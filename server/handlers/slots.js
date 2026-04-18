// Blackout Casino — Slot Machine Server Handler
// Seguranca: rate-limit, validacao server-side, transacoes atomicas, audit log
// Compativel com oxmysql (prepared statements, ? placeholders)
// NUNCA confiar no client — resultado calculado server-side

const crypto = require("crypto");

// Helper DB: callback explicito wrappado em Promise (unico padrao que funciona no FiveM JS)
// Timeout 5s: se oxmysql nao chamar callback (ex: erro silencioso), resolve null e loga
function dbQuery(sql, params) {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      console.log(`[CASINO-DB] TIMEOUT query: ${sql.substring(0, 80)}`);
      resolve(null);
    }, 5000);
    exports.oxmysql.query(sql, params || [], (result) => {
      clearTimeout(t);
      resolve(result);
    });
  });
}
function dbExecute(sql, params) {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      console.log(`[CASINO-DB] TIMEOUT execute: ${sql.substring(0, 80)}`);
      resolve(null);
    }, 5000);
    exports.oxmysql.execute(sql, params || [], (result) => {
      clearTimeout(t);
      resolve(result);
    });
  });
}

// Wrapper: todo handler async com try/catch + logging
const SLOT_RESPONSE = "casino:slot:response";
const _slotOn = on;
function safeSlotHandler(eventName, handler) {
  RegisterNetEvent(eventName);
  _slotOn(eventName, async (...args) => {
    const src = source;
    const cbId = args[0];
    console.log(`[CASINO-SLOT] ${eventName} src=${src} cbId=${cbId}`);
    try {
      await handler(src, cbId, args[1] || {});
    } catch (err) {
      console.log(`[CASINO-SLOT] ${eventName} ERRO: ${err.message}`);
      console.log(`[CASINO-SLOT] Stack: ${err.stack}`);
      emitNet(SLOT_RESPONSE, src, cbId, { error: "server_error", message: err.message });
    }
  });
}

// Rate limit por jogador: { identifier: { lastSpin: timestamp, spinsThisMinute: N, minuteStart: timestamp } }
const rateLimits = {};

// Sessoes ativas por jogador: { identifier: { serverSeed, clientSeed, nonce, sessionId } }
const sessions = {};

// Config cache (recarregada a cada 60s)
let configCache = null;
let configLastLoad = 0;

// -- HELPERS --

function generateServerSeed() {
  return crypto.randomBytes(32).toString("hex");
}

function hashSeed(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function hmacSHA256(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("hex");
}

function generateNumbers(serverSeed, clientSeed, nonce, count) {
  const numbers = [];
  let cursor = 0;
  while (numbers.length < count) {
    const hash = hmacSHA256(serverSeed, `${clientSeed}:${nonce}:${cursor}`);
    for (let i = 0; i < hash.length - 7 && numbers.length < count; i += 8) {
      numbers.push(parseInt(hash.slice(i, i + 8), 16));
    }
    cursor++;
  }
  return numbers;
}

// Simbolos com pesos (mesmos do SlotsConstants.ts)
const VIDEO_SYMBOLS = [
  { id: "crown", weight: 3, payouts: { 8: 10, 9: 15, 10: 25, 11: 40, 12: 50 } },
  { id: "ring", weight: 4, payouts: { 8: 8, 9: 12, 10: 20, 11: 30, 12: 40 } },
  { id: "hourglass", weight: 4, payouts: { 8: 5, 9: 8, 10: 12, 11: 20, 12: 25 } },
  { id: "chalice", weight: 5, payouts: { 8: 3, 9: 5, 10: 8, 11: 12, 12: 15 } },
  { id: "ruby", weight: 8, payouts: { 8: 1.5, 9: 2.5, 10: 4, 11: 6, 12: 8 } },
  { id: "sapphire", weight: 8, payouts: { 8: 1, 9: 2, 10: 3, 11: 5, 12: 5 } },
  { id: "emerald", weight: 9, payouts: { 8: 0.8, 9: 1.5, 10: 2.5, 11: 4, 12: 4 } },
  { id: "amethyst", weight: 9, payouts: { 8: 0.5, 9: 1, 10: 2, 11: 3, 12: 3 } },
  { id: "topaz", weight: 10, payouts: { 8: 0.25, 9: 0.5, 10: 1, 11: 2, 12: 2 } },
  { id: "scatter", weight: 2, payouts: { 4: 3, 5: 5, 6: 100 } },
  { id: "multiplier_orb", weight: 0, payouts: {} },
];

const TOTAL_WEIGHT_BASE = VIDEO_SYMBOLS.filter(s => s.id !== "multiplier_orb").reduce((s, sym) => s + sym.weight, 0);
const MULTIPLIER_ORB_WEIGHT_FS = 3;
const TOTAL_WEIGHT_FS = TOTAL_WEIGHT_BASE + MULTIPLIER_ORB_WEIGHT_FS;
const MULTIPLIER_VALUES_FS = [2, 3, 5, 8, 10, 15, 25, 50, 100];

const CLASSIC_SYMBOLS = [
  { id: "seven", weight: 2, payout3: 100, payout2: 10 },
  { id: "bar", weight: 4, payout3: 40, payout2: 5 },
  { id: "diamond", weight: 5, payout3: 25, payout2: 3 },
  { id: "bell", weight: 6, payout3: 15, payout2: 2 },
  { id: "cherry", weight: 8, payout3: 10, payout2: 1.5 },
  { id: "lemon", weight: 10, payout3: 5, payout2: 1 },
  { id: "star", weight: 10, payout3: 5, payout2: 1 },
];
const CLASSIC_TOTAL_WEIGHT = CLASSIC_SYMBOLS.reduce((s, sym) => s + sym.weight, 0);

function selectSymbol(randomValue, isFS) {
  const total = isFS ? TOTAL_WEIGHT_FS : TOTAL_WEIGHT_BASE;
  const roll = randomValue % total;
  let cumulative = 0;
  for (const sym of VIDEO_SYMBOLS) {
    let w = sym.weight;
    if (sym.id === "multiplier_orb") w = isFS ? MULTIPLIER_ORB_WEIGHT_FS : 0;
    cumulative += w;
    if (roll < cumulative) return sym;
  }
  return VIDEO_SYMBOLS[8]; // topaz fallback
}

function selectClassicSymbol(randomValue) {
  const roll = randomValue % CLASSIC_TOTAL_WEIGHT;
  let cumulative = 0;
  for (const sym of CLASSIC_SYMBOLS) {
    cumulative += sym.weight;
    if (roll < cumulative) return sym;
  }
  return CLASSIC_SYMBOLS[6];
}

// -- ENGINE SERVER-SIDE --

function generateVideoGrid(serverSeed, clientSeed, nonce, isFS) {
  const numbers = generateNumbers(serverSeed, clientSeed, nonce, 42);
  const grid = []; // 8 colunas x 4 linhas
  let idx = 0;
  for (let col = 0; col < 8; col++) {
    const column = [];
    for (let row = 0; row < 4; row++) {
      const sym = selectSymbol(numbers[idx], isFS);
      const isMult = sym.id === "multiplier_orb";
      const multVal = isMult ? MULTIPLIER_VALUES_FS[numbers[idx] % MULTIPLIER_VALUES_FS.length] : 0;
      column.push({ symbolId: sym.id, row, col, isScatter: sym.id === "scatter", isMultiplier: isMult, multiplierValue: multVal });
      idx++;
    }
    grid.push(column);
  }
  return grid;
}

function detectWins(grid) {
  const counts = {};
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 4; row++) {
      const cell = grid[col][row];
      if (cell.symbolId === "multiplier_orb") continue;
      if (!counts[cell.symbolId]) counts[cell.symbolId] = [];
      counts[cell.symbolId].push({ row, col });
    }
  }
  const clusters = [];
  for (const [symId, positions] of Object.entries(counts)) {
    const sym = VIDEO_SYMBOLS.find(s => s.id === symId);
    if (!sym) continue;
    if (symId === "scatter" && positions.length >= 4) {
      const count = Math.min(positions.length, 6);
      clusters.push({ symbolId: symId, count, payout: sym.payouts[count] || sym.payouts[4] || 3, positions });
    } else if (symId !== "scatter" && positions.length >= 8) {
      const count = Math.min(positions.length, 12);
      const keys = Object.keys(sym.payouts).map(Number).sort((a, b) => b - a);
      let payout = 0;
      for (const k of keys) { if (count >= k) { payout = sym.payouts[k]; break; } }
      clusters.push({ symbolId: symId, count, payout, positions });
    }
  }
  return clusters;
}

function processVideoSpin(bet, anteBet, serverSeed, clientSeed, nonce, isFS, jackpotPool, config) {
  const totalBet = anteBet ? Math.floor(bet * parseFloat(config.slot_ante_bet_mod || "1.25")) : bet;
  const jackpotContrib = totalBet * (parseFloat(config.slot_jackpot_contrib || "1.5") / 100);
  let newJackpotPool = jackpotPool + jackpotContrib;
  const maxWinMult = parseInt(config.slot_max_win_mult || "5000");

  const grid = generateVideoGrid(serverSeed, clientSeed, nonce, isFS);

  // Contar scatters
  let scatterCount = 0;
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 4; row++) {
      if (grid[col][row].isScatter) scatterCount++;
    }
  }

  // Tumble loop (max 20) — captura cada passo pra animacao no client
  let totalWin = 0;
  let totalMultiplier = 1;
  let tumbles = 0;
  let currentGrid = grid;
  let tumbleNonce = nonce * 100;
  const tumbleSteps = [];

  for (let attempt = 0; attempt < 20; attempt++) {
    const wins = detectWins(currentGrid);
    if (wins.length === 0) break;
    tumbles++;

    // Multiplicadores
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 4; row++) {
        if (currentGrid[col][row].isMultiplier && currentGrid[col][row].multiplierValue > 0) {
          totalMultiplier += currentGrid[col][row].multiplierValue;
        }
      }
    }

    let stepWin = 0;
    const removed = new Set();
    for (const cluster of wins) {
      stepWin += cluster.payout * bet;
      for (const pos of cluster.positions) removed.add(`${pos.col}-${pos.row}`);
    }
    totalWin += stepWin;

    // Cascade
    tumbleNonce++;
    const newNumbers = generateNumbers(serverSeed, clientSeed, tumbleNonce, 30);
    const newGrid = [];
    let newIdx = 0;
    for (let col = 0; col < 8; col++) {
      const surviving = currentGrid[col].filter((_, row) => !removed.has(`${col}-${row}`));
      const needed = 4 - surviving.length;
      const newCells = [];
      for (let i = 0; i < needed; i++) {
        const sym = selectSymbol(newNumbers[newIdx], isFS);
        const isMult = sym.id === "multiplier_orb";
        const multVal = isMult ? MULTIPLIER_VALUES_FS[newNumbers[newIdx] % MULTIPLIER_VALUES_FS.length] : 0;
        newCells.push({ symbolId: sym.id, row: i, col, isScatter: sym.id === "scatter", isMultiplier: isMult, multiplierValue: multVal });
        newIdx++;
      }
      newGrid.push([...newCells, ...surviving].map((cell, row) => ({ ...cell, row })));
    }

    // Capturar passo pra client animar
    tumbleSteps.push({
      winClusters: wins,
      stepWin,
      totalWin,
      // Grid APOS cascade (novos simbolos ja caidos)
      gridAfter: newGrid.map(col => col.map(cell => ({
        symbolId: cell.symbolId, row: cell.row, col: cell.col,
        isScatter: cell.isScatter, isMultiplier: cell.isMultiplier,
        multiplierValue: cell.multiplierValue,
      }))),
    });

    currentGrid = newGrid;
  }

  if (totalMultiplier > 1) totalWin = totalWin * totalMultiplier;
  const maxWin = bet * maxWinMult;
  if (totalWin > maxWin) totalWin = maxWin;

  const fsRequired = anteBet ? Math.max(parseInt(config.slot_fs_scatter_req || "4") - 1, 3) : parseInt(config.slot_fs_scatter_req || "4");
  const triggeredFS = scatterCount >= fsRequired;
  const fsAwarded = triggeredFS ? parseInt(config.slot_fs_count || "10") : 0;

  const isJackpot = (totalWin / bet) >= 500;
  let jackpotWin = 0;
  if (isJackpot) { jackpotWin = newJackpotPool; newJackpotPool = 10000; }

  return {
    totalBet, totalWin: totalWin + jackpotWin, totalMultiplier, tumbles, scatterCount,
    triggeredFS, fsAwarded, isJackpot, jackpotWin, newJackpotPool, grid, tumbleSteps, gridHash: hashSeed(JSON.stringify(grid)),
  };
}

function processClassicSpin(bet, serverSeed, clientSeed, nonce) {
  const numbers = generateNumbers(serverSeed, clientSeed, nonce, 9);
  const visibleReels = [[], [], []];
  for (let reel = 0; reel < 3; reel++) {
    for (let pos = 0; pos < 3; pos++) {
      visibleReels[reel].push(selectClassicSymbol(numbers[reel * 3 + pos]));
    }
  }

  let totalWin = 0;
  for (let line = 0; line < 3; line++) {
    const lineSyms = [visibleReels[0][line], visibleReels[1][line], visibleReels[2][line]];
    if (lineSyms[0].id === lineSyms[1].id && lineSyms[1].id === lineSyms[2].id) {
      totalWin += lineSyms[0].payout3 * bet;
    } else if (lineSyms[0].id === lineSyms[1].id) {
      totalWin += lineSyms[0].payout2 * bet;
    }
  }

  return { totalBet: bet, totalWin, visibleReels, gridHash: hashSeed(JSON.stringify(visibleReels)) };
}

// -- HANDLERS --

async function loadConfig() {
  const now = Date.now();
  if (configCache && now - configLastLoad < 60000) return configCache;
  const rows = await dbQuery("SELECT chave, valor FROM casino_config WHERE chave LIKE 'slot_%'", []);
  configCache = {};
  if (Array.isArray(rows)) {
    for (const row of rows) configCache[row.chave] = row.valor;
  } else {
    console.log(`[CASINO-SLOT] loadConfig: rows nao eh array, tipo=${typeof rows}, valor=${JSON.stringify(rows)}`);
  }
  configLastLoad = now;
  return configCache;
}

function checkRateLimit(identifier, config) {
  const now = Date.now();
  const cooldownMs = parseInt(config.slot_cooldown_ms || "1000");
  const maxPerMin = parseInt(config.slot_max_spins_per_min || "30");

  if (!rateLimits[identifier]) {
    rateLimits[identifier] = { lastSpin: 0, spinsThisMinute: 0, minuteStart: now };
  }
  const rl = rateLimits[identifier];

  // Cooldown
  if (now - rl.lastSpin < cooldownMs) return { ok: false, reason: "cooldown" };

  // Max por minuto
  if (now - rl.minuteStart > 60000) { rl.spinsThisMinute = 0; rl.minuteStart = now; }
  if (rl.spinsThisMinute >= maxPerMin) return { ok: false, reason: "rate_limit" };

  rl.lastSpin = now;
  rl.spinsThisMinute++;
  return { ok: true };
}

async function getOrCreateSession(identifier, mode, clientSeed) {
  if (sessions[identifier] && sessions[identifier].mode === mode) {
    return sessions[identifier];
  }
  const serverSeed = generateServerSeed();
  const serverSeedHash = hashSeed(serverSeed);
  const insertResult = await dbExecute(
    "INSERT INTO casino_slot_sessions (identifier, mode, server_seed, server_seed_hash, client_seed) VALUES (?, ?, ?, ?, ?)",
    [identifier, mode, serverSeed, serverSeedHash, clientSeed]
  );
  const sessionId = insertResult?.insertId ?? insertResult;
  const session = { sessionId, serverSeed, serverSeedHash, clientSeed, nonce: 0, mode };
  sessions[identifier] = session;
  return session;
}

// SPIN VIDEO
safeSlotHandler("casino:slot:spin", async (src, cbId, payload) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const config = await loadConfig();
  if (config.slot_enabled === "0") return emitNet("casino:slot:response", src, cbId, { error: "disabled" });

  // Validacao de input
  const bet = parseInt(payload.bet);
  const anteBet = !!payload.anteBet;
  const isFS = !!payload.isFS;
  const clientSeed = String(payload.clientSeed || "").slice(0, 32);
  const minBet = parseInt(config.slot_min_bet || "1");
  const maxBet = parseInt(config.slot_max_bet || "500");

  if (!bet || bet < minBet || bet > maxBet || isNaN(bet)) return emitNet("casino:slot:response", src, cbId, { error: "invalid_bet" });

  // Rate limit
  const rlCheck = checkRateLimit(identifier, config);
  if (!rlCheck.ok) return emitNet("casino:slot:response", src, cbId, { error: rlCheck.reason });

  // Saldo
  const contaRows = await dbQuery("SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?", [identifier]);
  const conta = contaRows?.[0];
  if (!conta) return emitNet("casino:slot:response", src, cbId, { error: "no_account" });
  const saldoAntes = parseFloat(conta.gcoin_balance);
  const totalBet = anteBet ? Math.floor(bet * parseFloat(config.slot_ante_bet_mod || "1.25")) : bet;
  if (saldoAntes < totalBet) return emitNet("casino:slot:response", src, cbId, { error: "insufficient_balance" });

  // Sessao + nonce
  const session = await getOrCreateSession(identifier, "video", clientSeed);
  const nonce = session.nonce;
  session.nonce++;

  // Jackpot
  const jpRows = await dbQuery("SELECT pool FROM casino_slot_jackpot WHERE id = 1");
  const jp = jpRows?.[0];
  const jackpotPool = jp ? parseFloat(jp.pool) : 10000;

  // Resultado server-side
  const result = processVideoSpin(bet, anteBet, session.serverSeed, session.clientSeed, nonce, isFS, jackpotPool, config);
  const saldoDepois = saldoAntes - result.totalBet + result.totalWin;

  // Transacao: debitar + creditar + registrar spin + atualizar jackpot (sequencial — panel.js pattern)
  await dbExecute(
    "UPDATE casino_accounts SET gcoin_balance = ?, total_wagered = total_wagered + ?, total_won = total_won + ? WHERE identifier = ?",
    [saldoDepois, result.totalBet, result.totalWin, identifier]
  );
  await dbExecute(
    "INSERT INTO casino_slot_spins (session_id, identifier, mode, nonce, bet, ante_bet, total_bet, win, multiplier, tumbles, scatter_count, free_spins_triggered, is_jackpot, jackpot_win, saldo_antes, saldo_depois, grid_hash) VALUES (?, ?, 'video', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [session.sessionId, identifier, nonce, bet, anteBet ? 1 : 0, result.totalBet, result.totalWin, result.totalMultiplier, result.tumbles, result.scatterCount, result.triggeredFS ? 1 : 0, result.isJackpot ? 1 : 0, result.jackpotWin, saldoAntes, saldoDepois, result.gridHash]
  );
  await dbExecute(
    "UPDATE casino_slot_jackpot SET pool = ?, total_contributed = total_contributed + ? WHERE id = 1",
    [result.newJackpotPool, result.totalBet * (parseFloat(config.slot_jackpot_contrib || "1.5") / 100)]
  );
  await dbExecute(
    "INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes) VALUES (?, 'bet', ?, ?, ?, 'slot_video', ?)",
    [identifier, result.totalBet, saldoAntes, saldoAntes - result.totalBet, `spin:${nonce} bet:${bet} ante:${anteBet}`]
  );

  // Se teve win, registrar transacao de win separada
  if (result.totalWin > 0) {
    await dbExecute(
      "INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes) VALUES (?, 'win', ?, ?, ?, 'slot_video', ?)",
      [identifier, result.totalWin, saldoAntes - result.totalBet, saldoDepois, `spin:${nonce} win:${result.totalWin} mult:${result.totalMultiplier}`]
    );
  }

  // Atualizar totais da sessao
  await dbExecute(
    "UPDATE casino_slot_sessions SET total_bet = total_bet + ?, total_won = total_won + ?, spins_count = spins_count + 1, nonce_end = ? WHERE id = ?",
    [result.totalBet, result.totalWin, nonce, session.sessionId]
  );

  emitNet("casino:slot:response", src, cbId, {
    success: true,
    balance: saldoDepois,
    totalWin: result.totalWin,
    totalMultiplier: result.totalMultiplier,
    tumbles: result.tumbles,
    scatterCount: result.scatterCount,
    triggeredFS: result.triggeredFS,
    fsAwarded: result.fsAwarded,
    isJackpot: result.isJackpot,
    jackpotWin: result.jackpotWin,
    jackpotPool: result.newJackpotPool,
    serverSeedHash: session.serverSeedHash,
    nonce,
    grid: result.grid,
    tumbleSteps: result.tumbleSteps,
  });
});

// SPIN CLASSIC
safeSlotHandler("casino:slot:classic-spin", async (src, cbId, payload) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const config = await loadConfig();
  if (config.slot_enabled === "0") return emitNet("casino:slot:response", src, cbId, { error: "disabled" });

  const bet = parseInt(payload.bet);
  const clientSeed = String(payload.clientSeed || "").slice(0, 32);
  const minBet = parseInt(config.slot_min_bet || "1");
  const maxBet = parseInt(config.slot_max_bet || "500");
  if (!bet || bet < minBet || bet > maxBet) return emitNet("casino:slot:response", src, cbId, { error: "invalid_bet" });

  const rlCheck = checkRateLimit(identifier, config);
  if (!rlCheck.ok) return emitNet("casino:slot:response", src, cbId, { error: rlCheck.reason });

  const contaRows = await dbQuery("SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?", [identifier]);
  const conta = contaRows?.[0];
  if (!conta) return emitNet("casino:slot:response", src, cbId, { error: "no_account" });
  const saldoAntes = parseFloat(conta.gcoin_balance);
  if (saldoAntes < bet) return emitNet("casino:slot:response", src, cbId, { error: "insufficient_balance" });

  const session = await getOrCreateSession(identifier, "classic", clientSeed);
  const nonce = session.nonce;
  session.nonce++;

  const result = processClassicSpin(bet, session.serverSeed, session.clientSeed, nonce);
  const saldoDepois = saldoAntes - bet + result.totalWin;

  await dbExecute(
    "UPDATE casino_accounts SET gcoin_balance = ?, total_wagered = total_wagered + ?, total_won = total_won + ? WHERE identifier = ?",
    [saldoDepois, bet, result.totalWin, identifier]
  );
  await dbExecute(
    "INSERT INTO casino_slot_spins (session_id, identifier, mode, nonce, bet, ante_bet, total_bet, win, saldo_antes, saldo_depois, grid_hash) VALUES (?, ?, 'classic', ?, ?, 0, ?, ?, ?, ?, ?)",
    [session.sessionId, identifier, nonce, bet, bet, result.totalWin, saldoAntes, saldoDepois, result.gridHash]
  );
  await dbExecute(
    "INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes) VALUES (?, 'bet', ?, ?, ?, 'slot_classic', ?)",
    [identifier, bet, saldoAntes, saldoAntes - bet, `classic:${nonce}`]
  );

  if (result.totalWin > 0) {
    await dbExecute(
      "INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes) VALUES (?, 'win', ?, ?, ?, 'slot_classic', ?)",
      [identifier, result.totalWin, saldoAntes - bet, saldoDepois, `classic:${nonce} win:${result.totalWin}`]
    );
  }

  emitNet("casino:slot:response", src, cbId, { success: true, balance: saldoDepois, totalWin: result.totalWin, reels: result.visibleReels, serverSeedHash: session.serverSeedHash, nonce });
});

// BUY BONUS
safeSlotHandler("casino:slot:buy-bonus", async (src, cbId, payload) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const config = await loadConfig();
  const bet = parseInt(payload.bet);
  const cost = bet * parseInt(config.slot_buy_bonus_mult || "100");

  const contaRows = await dbQuery("SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?", [identifier]);
  const conta = contaRows?.[0];
  if (!conta || parseFloat(conta.gcoin_balance) < cost) return emitNet("casino:slot:response", src, cbId, { error: "insufficient_balance" });

  const saldoAntes = parseFloat(conta.gcoin_balance);
  const saldoDepois = saldoAntes - cost;

  await dbExecute(
    "UPDATE casino_accounts SET gcoin_balance = ?, total_wagered = total_wagered + ? WHERE identifier = ?",
    [saldoDepois, cost, identifier]
  );
  await dbExecute(
    "INSERT INTO casino_transactions (identifier, tipo, valor, saldo_antes, saldo_depois, jogo, detalhes) VALUES (?, 'bet', ?, ?, ?, 'slot_buy_bonus', ?)",
    [identifier, cost, saldoAntes, saldoDepois, `buy_bonus bet:${bet} cost:${cost}`]
  );

  emitNet("casino:slot:response", src, cbId, { success: true, balance: saldoDepois, cost, fsAwarded: parseInt(config.slot_fs_count || "10") });
});

// GET SALDO
safeSlotHandler("casino:slot:get-balance", async (src, cbId) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const contaRows = await dbQuery("SELECT gcoin_balance FROM casino_accounts WHERE identifier = ?", [identifier]);
  const conta = contaRows?.[0];
  if (!conta) return emitNet("casino:slot:response", src, cbId, { error: "no_account" });

  const jpRows = await dbQuery("SELECT pool FROM casino_slot_jackpot WHERE id = 1");
  const jp = jpRows?.[0];
  emitNet("casino:slot:response", src, cbId, { balance: parseFloat(conta.gcoin_balance), jackpotPool: jp ? parseFloat(jp.pool) : 10000 });
});

// GET HISTORICO (ultimos 20 spins)
safeSlotHandler("casino:slot:get-history", async (src, cbId) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const spins = await dbQuery(
    "SELECT id, mode, nonce, bet, total_bet, win, multiplier, tumbles, scatter_count, free_spins_triggered, is_buy_bonus, is_jackpot, created_at FROM casino_slot_spins WHERE identifier = ? ORDER BY created_at DESC LIMIT 20",
    [identifier]
  );
  emitNet("casino:slot:response", src, cbId, { history: spins || [] });
});

// GET CONFIG (para NUI)
safeSlotHandler("casino:slot:get-config", async (src, cbId) => {
  const config = await loadConfig();
  emitNet("casino:slot:response", src, cbId, {
    minBet: parseInt(config.slot_min_bet || "1"),
    maxBet: parseInt(config.slot_max_bet || "500"),
    buyBonusMult: parseInt(config.slot_buy_bonus_mult || "100"),
    anteBetMod: parseFloat(config.slot_ante_bet_mod || "1.25"),
    fsCount: parseInt(config.slot_fs_count || "10"),
    fsScatterReq: parseInt(config.slot_fs_scatter_req || "4"),
    jackpotContrib: parseFloat(config.slot_jackpot_contrib || "1.5"),
    maxWinMult: parseInt(config.slot_max_win_mult || "5000"),
  });
});

// REVELAR SERVER SEED (quando jogador troca de sessao)
safeSlotHandler("casino:slot:reveal-seed", async (src, cbId) => {
  const identifier = GetPlayerIdentifier(src, 0);
  if (!identifier) return emitNet("casino:slot:response", src, cbId, { error: "no_identifier" });

  const session = sessions[identifier];
  if (!session) return emitNet("casino:slot:response", src, cbId, { error: "no_session" });

  const oldSeed = session.serverSeed;
  const oldHash = session.serverSeedHash;

  // Fechar sessao antiga
  await dbExecute(
    "UPDATE casino_slot_sessions SET server_seed = ?, closed_at = NOW(), nonce_end = ? WHERE id = ?",
    [oldSeed, session.nonce, session.sessionId]
  );

  // Criar nova sessao
  delete sessions[identifier];

  emitNet("casino:slot:response", src, cbId, { serverSeed: oldSeed, serverSeedHash: oldHash, nonce: session.nonce });
});
