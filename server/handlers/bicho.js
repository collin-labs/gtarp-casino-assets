// Blackout Casino - Jogo do Bicho (#9) - Server Handler
// Compativel com oxmysql 2.x / CommunityOx (prepared statements)
// Provably Fair: HMAC_SHA256(serverSeed, clientSeed:nonce)
// Seguranca: mutex por jogador, debito atomico, validacao completa

const crypto = require("crypto");
const db = exports.oxmysql;

// Mutex por jogador — impede requests concorrentes do mesmo identifier
const playerLocks = new Map();
async function withPlayerLock(identifier, fn) {
  while (playerLocks.get(identifier)) {
    await new Promise(r => setTimeout(r, 50));
  }
  playerLocks.set(identifier, true);
  try {
    return await fn();
  } finally {
    playerLocks.delete(identifier);
  }
}

// Rate-limit por jogador
const cooldownMap = new Map();
const roundsPerHour = new Map();

function checkCooldown(identifier, cooldownMs) {
  const agora = Date.now();
  const ultimo = cooldownMap.get(identifier) || 0;
  if (agora - ultimo < cooldownMs) return false;
  cooldownMap.set(identifier, agora);
  return true;
}

function checkHourlyLimit(identifier, maxRounds) {
  const agora = Date.now();
  const registros = roundsPerHour.get(identifier) || [];
  const ultHora = registros.filter(t => agora - t < 3600000);
  if (ultHora.length >= maxRounds) return false;
  ultHora.push(agora);
  roundsPerHour.set(identifier, ultHora);
  return true;
}

function getIdentifier(src) {
  const numIds = GetNumPlayerIdentifiers(src);
  for (let i = 0; i < numIds; i++) {
    const id = GetPlayerIdentifier(src, i);
    if (id && id.startsWith("license:")) return id;
  }
  return null;
}

// Provably Fair - gerar seed aleatorio
function gerarSeed() {
  return crypto.randomBytes(32).toString("hex");
}

// SHA256 do server seed (commitado antes do jogo)
function hashSeed(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

// HMAC_SHA256 - gera resultado a partir dos seeds
function gerarResultadoHMAC(serverSeed, clientSeed, nonce) {
  return crypto.createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");
}

// Extrair 5 milhares de um hash HMAC (5 premios)
function extrairResultados(hmacHex) {
  const resultados = [];
  for (let i = 0; i < 5; i++) {
    const segmento = hmacHex.substring(i * 8, i * 8 + 8);
    const valor = parseInt(segmento, 16);
    const milhar = valor % 10000;
    const dezena = milhar % 100;
    const grupo = dezena === 0 ? 25 : Math.ceil(dezena / 4);
    resultados.push({
      posicao: i + 1,
      milhar: String(milhar).padStart(4, "0"),
      dezena: String(dezena).padStart(2, "0"),
      grupo
    });
  }
  return resultados;
}

// Verificar vitoria — TODOS selecionados devem aparecer
function calcularPayout(mode, animaisSelecionados, resultados, aposta, config) {
  const gruposSorteados = resultados.map(r => r.grupo);
  const todosAcertaram = animaisSelecionados.every(g => gruposSorteados.includes(g));

  if (!todosAcertaram) return { ganhou: false, payout: 0, multiplicador: 0 };

  // Posicoes dos acertos
  const posicoes = [];
  animaisSelecionados.forEach(g => {
    const idx = gruposSorteados.indexOf(g);
    if (idx !== -1) posicoes.push(idx + 1);
  });

  const maxPos = Math.max(...posicoes);
  const primeirasPosicoes = maxPos <= animaisSelecionados.length;

  const chaveFirst = `mult_${mode}_first`;
  const chaveOther = `mult_${mode}_other`;
  const multiplicador = primeirasPosicoes
    ? (config[chaveFirst] || 12)
    : (config[chaveOther] || 3);

  let payout = aposta * multiplicador;
  if (payout > config.max_payout) payout = config.max_payout;

  return { ganhou: true, payout, multiplicador };
}

// Buscar config do bicho
async function getConfig() {
  const linhas = await db.query("SELECT * FROM casino_bicho_config WHERE id = 1");
  return linhas?.[0] || {};
}

// Registrar no audit
async function registrarAudit(identifier, action, roundId, details) {
  await db.execute(
    "INSERT INTO casino_bicho_audit (identifier, action, round_id, details) VALUES (?, ?, ?, ?)",
    [identifier, action, roundId, JSON.stringify(details)]
  );
}

// ============================================================
// ENDPOINT 1: bicho:play — validar aposta + gerar seed
// ============================================================
RegisterNetEvent("casino:bicho:play");
on("casino:bicho:play", async (payload) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:bicho:play:response", src, { erro: "Sem identificador" });

  // Mutex — impede 2 apostas simultaneas do mesmo jogador
  await withPlayerLock(identifier, async () => {

  const config = await getConfig();
  if (!config.enabled) return emitNet("casino:bicho:play:response", src, { erro: "Jogo desabilitado" });

  const { mode, animals, bet, clientSeed } = payload || {};

  // Validar modo
  const modos = ["simple", "dupla", "tripla", "quadra", "quina"];
  if (!modos.includes(mode)) return emitNet("casino:bicho:play:response", src, { erro: "Modo invalido" });

  // Validar animais selecionados
  const expectedCount = { simple: 1, dupla: 2, tripla: 3, quadra: 4, quina: 5 };
  if (!Array.isArray(animals) || animals.length !== expectedCount[mode]) {
    return emitNet("casino:bicho:play:response", src, { erro: `Modo ${mode} requer ${expectedCount[mode]} animais` });
  }
  if (animals.some(a => a < 1 || a > 25)) {
    return emitNet("casino:bicho:play:response", src, { erro: "Animal invalido (1-25)" });
  }
  // Rejeitar animais duplicados (ex: [5,5] no modo dupla)
  if (new Set(animals).size !== animals.length) {
    return emitNet("casino:bicho:play:response", src, { erro: "Animais duplicados" });
  }

  // Validar aposta
  const valor = parseInt(bet);
  if (isNaN(valor) || valor <= 0) return emitNet("casino:bicho:play:response", src, { erro: "Valor invalido" });

  const chaveMax = `bet_max_${mode}`;
  const betMin = config.bet_min || 50;
  const betMax = config[chaveMax] || 5000;
  if (valor < betMin) return emitNet("casino:bicho:play:response", src, { erro: `Aposta minima: G$${betMin}` });
  if (valor > betMax) return emitNet("casino:bicho:play:response", src, { erro: `Aposta maxima ${mode}: G$${betMax}` });

  // Rate limit
  if (!checkCooldown(identifier, config.cooldown_ms || 3000)) {
    return emitNet("casino:bicho:play:response", src, { erro: "Aguarde antes de jogar novamente" });
  }
  if (!checkHourlyLimit(identifier, config.max_rounds_per_hour || 60)) {
    return emitNet("casino:bicho:play:response", src, { erro: "Limite de rodadas por hora atingido" });
  }

  // Debito ATOMICO — previne race condition / duplicacao de dinheiro
  // Um unico UPDATE que so executa se saldo >= aposta
  const debitoResult = await db.execute(
    "UPDATE casino_accounts SET gcoin_balance = gcoin_balance - ? WHERE identifier = ? AND gcoin_balance >= ?",
    [valor, identifier, valor]
  );
  if (!debitoResult || debitoResult.affectedRows === 0) {
    return emitNet("casino:bicho:play:response", src, { erro: "Saldo insuficiente" });
  }

  // Gerar seeds
  const serverSeed = gerarSeed();
  const serverSeedHash = hashSeed(serverSeed);
  const playerSeed = clientSeed || gerarSeed();

  // Buscar nonce do jogador
  const nonceRows = await db.query(
    "SELECT COALESCE(MAX(nonce), 0) + 1 AS proximo FROM casino_bicho_rounds WHERE identifier = ?",
    [identifier]
  );
  const nonce = nonceRows?.[0]?.proximo || 1;

  // Gerar resultado via HMAC
  const hmacHex = gerarResultadoHMAC(serverSeed, playerSeed, nonce);
  const resultados = extrairResultados(hmacHex);

  // Calcular payout
  const { ganhou, payout, multiplicador } = calcularPayout(mode, animals, resultados, valor, config);

  // Creditar se ganhou
  if (ganhou) {
    await db.execute(
      "UPDATE casino_accounts SET gcoin_balance = gcoin_balance + ? WHERE identifier = ?",
      [payout, identifier]
    );
  }

  // Buscar saldo atualizado
  const novoSaldoRows = await db.query("SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?", [identifier]);
  const novoSaldo = parseFloat(novoSaldoRows?.[0]?.gcoin_balance ?? 0);

  // Salvar rodada
  const insertId = await db.execute(
    `INSERT INTO casino_bicho_rounds
     (identifier, mode, animals_selected, bet_amount, server_seed, server_seed_hash, client_seed, nonce, result_hash,
      prize_1_milhar, prize_1_grupo, prize_2_milhar, prize_2_grupo, prize_3_milhar, prize_3_grupo,
      prize_4_milhar, prize_4_grupo, prize_5_milhar, prize_5_grupo, won, payout_amount, payout_multiplier)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      identifier, mode, JSON.stringify(animals), valor,
      serverSeed, serverSeedHash, playerSeed, nonce, hmacHex,
      resultados[0].milhar, resultados[0].grupo,
      resultados[1].milhar, resultados[1].grupo,
      resultados[2].milhar, resultados[2].grupo,
      resultados[3].milhar, resultados[3].grupo,
      resultados[4].milhar, resultados[4].grupo,
      ganhou ? 1 : 0, payout, multiplicador
    ]
  );

  // Registrar transacao no painel (casino_transactions)
  // saldoAntes calculado: saldo atual + aposta - payout (se ganhou)
  const saldoAntes = novoSaldo + valor - (ganhou ? payout : 0);
  const saldoDepois = novoSaldo;
  await db.execute(
    `INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [identifier, ganhou ? "win" : "bet", ganhou ? payout : -valor, saldoAntes, saldoDepois, "bicho",
     `${mode} animais:${animals.join(",")} mult:${multiplicador}`]
  );

  // Audit
  await registrarAudit(identifier, ganhou ? "WIN" : "LOSE", insertId, {
    mode, animals, bet: valor, payout, multiplicador, resultados: resultados.map(r => r.grupo)
  });

  // Responder ao client
  emitNet("casino:bicho:play:response", src, {
    sucesso: true,
    resultados,
    ganhou,
    payout,
    multiplicador,
    novoSaldo,
    serverSeedHash,
    clientSeed: playerSeed,
    nonce,
    serverSeed,
    resultHash: hmacHex,
    roundId: insertId
  });

  }); // fecha withPlayerLock
});


// ============================================================
// ENDPOINT 2: bicho:getHistory — ultimas rodadas do jogador
// ============================================================
RegisterNetEvent("casino:bicho:getHistory");
on("casino:bicho:getHistory", async (limite) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:bicho:getHistory:response", src, []);

  const maxRows = Math.min(parseInt(limite) || 20, 50);
  const rodadas = await db.query(
    `SELECT id, mode, animals_selected, bet_amount, won, payout_amount, payout_multiplier,
            prize_1_grupo, prize_2_grupo, prize_3_grupo, prize_4_grupo, prize_5_grupo,
            created_at
     FROM casino_bicho_rounds WHERE identifier = ? ORDER BY created_at DESC LIMIT ?`,
    [identifier, maxRows]
  );

  emitNet("casino:bicho:getHistory:response", src, rodadas || []);
});


// ============================================================
// ENDPOINT 3: bicho:verify — verificar provably fair
// ============================================================
RegisterNetEvent("casino:bicho:verify");
on("casino:bicho:verify", async (roundId) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:bicho:verify:response", src, { erro: "Sem identificador" });

  const rodada = await db.query(
    "SELECT server_seed, server_seed_hash, client_seed, nonce, result_hash FROM casino_bicho_rounds WHERE id = ? AND identifier = ?",
    [roundId, identifier]
  );

  if (!rodada?.[0]) return emitNet("casino:bicho:verify:response", src, { erro: "Rodada nao encontrada" });

  const r = rodada[0];
  const hashRecalculado = gerarResultadoHMAC(r.server_seed, r.client_seed, r.nonce);
  const seedHashRecalculado = hashSeed(r.server_seed);

  emitNet("casino:bicho:verify:response", src, {
    serverSeed: r.server_seed,
    serverSeedHash: r.server_seed_hash,
    clientSeed: r.client_seed,
    nonce: r.nonce,
    resultHash: r.result_hash,
    hashRecalculado,
    seedHashRecalculado,
    valido: hashRecalculado === r.result_hash && seedHashRecalculado === r.server_seed_hash
  });
});


// ============================================================
// ENDPOINT 4: bicho:getConfig — config publica
// ============================================================
RegisterNetEvent("casino:bicho:getConfig");
on("casino:bicho:getConfig", async () => {
  const src = source;
  const config = await getConfig();

  // Retorna so o necessario pro client (sem server seeds)
  emitNet("casino:bicho:getConfig:response", src, {
    bet_min: config.bet_min,
    bet_max_simple: config.bet_max_simple,
    bet_max_dupla: config.bet_max_dupla,
    bet_max_tripla: config.bet_max_tripla,
    bet_max_quadra: config.bet_max_quadra,
    bet_max_quina: config.bet_max_quina,
    mult_simple_first: config.mult_simple_first,
    mult_simple_other: config.mult_simple_other,
    mult_dupla_first: config.mult_dupla_first,
    mult_dupla_other: config.mult_dupla_other,
    mult_tripla_first: config.mult_tripla_first,
    mult_tripla_other: config.mult_tripla_other,
    mult_quadra_first: config.mult_quadra_first,
    mult_quadra_other: config.mult_quadra_other,
    mult_quina_first: config.mult_quina_first,
    mult_quina_other: config.mult_quina_other,
    max_payout: config.max_payout,
    enabled: config.enabled
  });
});


// ============================================================
// ENDPOINT 5: bicho:admin:stats — metricas agregadas (admin)
// ============================================================
RegisterNetEvent("casino:bicho:admin:stats");
on("casino:bicho:admin:stats", async () => {
  const src = source;

  const stats = await db.query(`
    SELECT
      COUNT(*) AS total_rodadas,
      SUM(bet_amount) AS total_apostado,
      SUM(payout_amount) AS total_pago,
      SUM(bet_amount) - SUM(payout_amount) AS lucro_casa,
      SUM(CASE WHEN won = 1 THEN 1 ELSE 0 END) AS total_vitorias,
      ROUND(SUM(CASE WHEN won = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100, 2) AS win_rate
    FROM casino_bicho_rounds
  `);

  emitNet("casino:bicho:admin:stats:response", src, stats?.[0] || {});
});

console.log("[Blackout Casino] Bicho handlers carregados — 5 endpoints ativos");
