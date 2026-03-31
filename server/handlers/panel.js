// Blackout Casino — Handler do Painel Flutuante (server-side JS)
// Compativel com oxmysql 2.x (prepared statements)
// Todos endpoints sao chamados via NUI → client.lua → TriggerServerEvent

const db = exports.oxmysql;

// Cache de cooldown por jogador (rate-limit — fonte #6 vertexmods)
const cooldownMap = new Map();
const COOLDOWN_MS = 3000;

function checkCooldown(identifier) {
  const agora = Date.now();
  const ultimo = cooldownMap.get(identifier) || 0;
  if (agora - ultimo < COOLDOWN_MS) return false;
  cooldownMap.set(identifier, agora);
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

// Garantir que conta existe (upsert)
async function garantirConta(identifier) {
  await db.execute(
    `INSERT IGNORE INTO casino_accounts (identifier, gcoin_balance)
     VALUES (?, 0.00)`,
    [identifier]
  );
}

// Buscar config do banco (cacheavel no futuro)
async function getConfig(chave) {
  const rows = await db.query(
    "SELECT valor FROM casino_config WHERE chave = ?",
    [chave]
  );
  return rows?.[0]?.valor ?? null;
}

// Registrar transacao no audit log (regra X12)
async function registrarTransacao(identifier, tipo, valor, saldoAntes, saldoDepois, jogo, detalhes) {
  await db.execute(
    `INSERT INTO casino_transactions
     (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [identifier, tipo, valor, saldoAntes, saldoDepois, jogo, detalhes]
  );
}

// ============================================================
// ENDPOINT 1: getSaldo — retorna saldo GCoin do jogador
// ============================================================
RegisterNetEvent("casino:panel:getSaldo");
on("casino:panel:getSaldo", async () => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:panel:getSaldo:response", src, { erro: "Identificador nao encontrado" });

  await garantirConta(identifier);

  const rows = await db.query(
    "SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?",
    [identifier]
  );

  const saldo = rows?.[0]?.gcoin_balance ?? 0;
  emitNet("casino:panel:getSaldo:response", src, { gcoin_balance: parseFloat(saldo) });
});

// ============================================================
// ENDPOINT 2: buyGCoin — comprar GCoin com dinheiro do servidor
// ============================================================
RegisterNetEvent("casino:panel:buyGCoin");
on("casino:panel:buyGCoin", async (amount) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:panel:buyGCoin:response", src, { sucesso: false, mensagem: "Sem identificador" });

  // Rate-limit
  if (!checkCooldown(identifier)) {
    return emitNet("casino:panel:buyGCoin:response", src, { sucesso: false, mensagem: "Aguarde antes de tentar novamente" });
  }

  // Validacao de input
  const valor = parseFloat(amount);
  if (isNaN(valor) || valor <= 0) {
    return emitNet("casino:panel:buyGCoin:response", src, { sucesso: false, mensagem: "Valor invalido" });
  }

  const minDeposit = parseFloat(await getConfig("min_deposit")) || 10;
  const maxDeposit = parseFloat(await getConfig("max_deposit")) || 50000;
  if (valor < minDeposit || valor > maxDeposit) {
    return emitNet("casino:panel:buyGCoin:response", src, {
      sucesso: false,
      mensagem: `Deposito deve ser entre ${minDeposit} e ${maxDeposit} GCoin`
    });
  }

  await garantirConta(identifier);

  // Buscar saldo atual
  const rows = await db.query(
    "SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?",
    [identifier]
  );
  const saldoAntes = parseFloat(rows?.[0]?.gcoin_balance ?? 0);

  // TODO: integrar com framework (ESX/vRP) pra debitar dinheiro real do jogador
  // Exemplo ESX: xPlayer.removeMoney(valor * taxaGCoin)
  // Por enquanto, credita direto (mock pra dev)

  const saldoDepois = saldoAntes + valor;

  await db.execute(
    `UPDATE casino_accounts
     SET gcoin_balance = ?, total_deposited = total_deposited + ?
     WHERE identifier = ?`,
    [saldoDepois, valor, identifier]
  );

  await registrarTransacao(identifier, "deposit", valor, saldoAntes, saldoDepois, null, "Compra de GCoin via painel");

  emitNet("casino:panel:buyGCoin:response", src, { sucesso: true, novoSaldo: saldoDepois });
});

// ============================================================
// ENDPOINT 3: cashoutGCoin — sacar GCoin pra dinheiro do servidor
// ============================================================
RegisterNetEvent("casino:panel:cashoutGCoin");
on("casino:panel:cashoutGCoin", async (amount) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:panel:cashoutGCoin:response", src, { sucesso: false, mensagem: "Sem identificador" });

  if (!checkCooldown(identifier)) {
    return emitNet("casino:panel:cashoutGCoin:response", src, { sucesso: false, mensagem: "Aguarde antes de tentar novamente" });
  }

  const valor = parseFloat(amount);
  if (isNaN(valor) || valor <= 0) {
    return emitNet("casino:panel:cashoutGCoin:response", src, { sucesso: false, mensagem: "Valor invalido" });
  }

  const minWithdraw = parseFloat(await getConfig("min_withdraw")) || 50;
  const maxWithdraw = parseFloat(await getConfig("max_withdraw")) || 100000;
  if (valor < minWithdraw || valor > maxWithdraw) {
    return emitNet("casino:panel:cashoutGCoin:response", src, {
      sucesso: false,
      mensagem: `Saque deve ser entre ${minWithdraw} e ${maxWithdraw} GCoin`
    });
  }

  await garantirConta(identifier);

  const rows = await db.query(
    "SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?",
    [identifier]
  );
  const saldoAntes = parseFloat(rows?.[0]?.gcoin_balance ?? 0);

  if (saldoAntes < valor) {
    return emitNet("casino:panel:cashoutGCoin:response", src, { sucesso: false, mensagem: "Saldo insuficiente" });
  }

  // Taxa de saque (money sink — fonte #5 vertexmods)
  const taxaPercent = parseFloat(await getConfig("withdraw_tax_percent")) || 2;
  const taxa = valor * (taxaPercent / 100);
  const valorLiquido = valor - taxa;
  const saldoDepois = saldoAntes - valor;

  await db.execute(
    `UPDATE casino_accounts
     SET gcoin_balance = ?, total_withdrawn = total_withdrawn + ?
     WHERE identifier = ?`,
    [saldoDepois, valor, identifier]
  );

  // TODO: integrar com framework (ESX/vRP) pra creditar dinheiro real ao jogador
  // Exemplo ESX: xPlayer.addMoney(valorLiquido * taxaGCoin)

  await registrarTransacao(identifier, "withdraw", valor, saldoAntes, saldoDepois, null,
    `Saque de ${valor} GCoin (taxa ${taxaPercent}%, liquido ${valorLiquido.toFixed(2)})`
  );

  emitNet("casino:panel:cashoutGCoin:response", src, {
    sucesso: true,
    novoSaldo: saldoDepois,
    valorLiquido,
    taxa,
  });
});

// ============================================================
// ENDPOINT 4: getHistory — historico de transacoes do jogador
// ============================================================
RegisterNetEvent("casino:panel:getHistory");
on("casino:panel:getHistory", async (limite) => {
  const src = source;
  const identifier = getIdentifier(src);
  if (!identifier) return emitNet("casino:panel:getHistory:response", src, []);

  const maxRows = Math.min(parseInt(limite) || 50, 200);

  const rows = await db.query(
    `SELECT tipo, valor, saldo_depois, jogo, detalhes, created_at
     FROM casino_transactions
     WHERE identifier = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [identifier, maxRows]
  );

  emitNet("casino:panel:getHistory:response", src, rows || []);
});

// ============================================================
// ENDPOINT 5: getConfig — retorna configs publicas do cassino
// ============================================================
RegisterNetEvent("casino:panel:getConfig");
on("casino:panel:getConfig", async () => {
  const src = source;

  const rows = await db.query(
    "SELECT chave, valor FROM casino_config"
  );

  const config = {};
  for (const row of (rows || [])) {
    config[row.chave] = row.valor;
  }

  emitNet("casino:panel:getConfig:response", src, config);
});

console.log("[Blackout Casino] Panel handlers carregados — 5 endpoints ativos");
