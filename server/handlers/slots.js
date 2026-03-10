// ═══════════════════════════════════════════════════════════════
// BLACKOUT CASINO — SLOTS ENGINE v1.0
// Server-side handler completo para Classic "777 Gold" + Video "Blackout Fortune"
// Provably Fair (padrão Stake.com 2026): byteGenerator + cursor + 4 bytes/float
// Cluster Pays (BFS 6×5) + Payline Detection (3×3) + Tumble Engine
// Data: 04/03/2026
// ═══════════════════════════════════════════════════════════════

const crypto = require('crypto');

// ── CACHE LOCAL (carregado do banco no boot) ────────────────
let slotsConfig = {};       // { classic: {...}, video: {...} }
let reelStrips = {};        // { 'classic:default': [[strip0], [strip1], ...] }
let paytables = {};         // { classic: [...], video: [...] }
let jackpotPools = {};      // { 'mini:classic': {amount,rate,odds,...}, ... }
let userStates = {};        // { odorId: { lastSpin, spinning } }
let serverSeeds = {};       // { odorId: { seed, hash, nonce, cursor } }

// ── CONSTANTES ──────────────────────────────────────────────
const CLASSIC_COLS = 3, CLASSIC_ROWS = 3;
const VIDEO_COLS = 6, VIDEO_ROWS = 5;
const MAX_TUMBLES = 50;
const MAX_RETRIGGERS = 3;
const MULTIPLIER_SCHEDULE = [1,2,3,5,7,10,15,20,25,30]; // idx = tumble count

function getMultiplier(tumbleCount, isFreeSpins) {
  if (isFreeSpins) return 1 + tumbleCount; // free spins: +1x por tumble, sem limite até 100
  if (tumbleCount < MULTIPLIER_SCHEDULE.length) return MULTIPLIER_SCHEDULE[tumbleCount];
  return MULTIPLIER_SCHEDULE[MULTIPLIER_SCHEDULE.length - 1] + (tumbleCount - MULTIPLIER_SCHEDULE.length + 1) * 5;
}

// ═══════════════════════════════════════════════════════════════
// 1. PROVABLY FAIR — Padrão Stake.com 2026
//    byteGenerator com cursor + rounds + 4 bytes por float
// ═══════════════════════════════════════════════════════════════

function* byteGenerator({ serverSeed, clientSeed, nonce, cursor }) {
  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor - (currentRound * 32);

  while (true) {
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
    const buffer = hmac.digest();

    while (currentRoundCursor < 32) {
      yield Number(buffer[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}

function generateFloats({ serverSeed, clientSeed, nonce, cursor, count }) {
  const rng = byteGenerator({ serverSeed, clientSeed, nonce, cursor });
  const bytes = [];
  while (bytes.length < count * 4) {
    bytes.push(rng.next().value);
  }
  // Cada grupo de 4 bytes → 1 float entre 0 e 1
  const floats = [];
  for (let i = 0; i < count; i++) {
    const b = bytes.slice(i * 4, i * 4 + 4);
    const value = b.reduce((acc, val, idx) => acc + val / Math.pow(256, idx + 1), 0);
    floats.push(value);
  }
  return floats;
}

function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

function hashSeed(seed) {
  return crypto.createHash('sha256').update(seed).digest('hex');
}

// ═══════════════════════════════════════════════════════════════
// 2. GRID BUILDER — Converte posições em grid de símbolos
// ═══════════════════════════════════════════════════════════════

function getReelPositions(floats, strips) {
  return floats.map((f, i) => Math.floor(f * strips[i].length));
}

function buildGrid(positions, strips, rows) {
  const grid = []; // grid[col][row]
  for (let col = 0; col < positions.length; col++) {
    const column = [];
    for (let row = 0; row < rows; row++) {
      const idx = (positions[col] + row) % strips[col].length;
      column.push(strips[col][idx]);
    }
    grid.push(column);
  }
  return grid;
}

// ═══════════════════════════════════════════════════════════════
// 3. CLUSTER DETECTION — BFS para Video 6×5
//    5+ símbolos adjacentes (horizontal/vertical) = cluster win
// ═══════════════════════════════════════════════════════════════

function findClusters(grid, cols, rows) {
  const visited = Array.from({ length: cols }, () => Array(rows).fill(false));
  const clusters = [];

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (visited[c][r]) continue;
      const symbol = grid[c][r];
      if (!symbol || symbol === 'blank' || symbol === 'scatter') continue;

      // BFS
      const cluster = [];
      const queue = [[c, r]];
      visited[c][r] = true;
      const isWild = symbol === 'wild';
      let baseSymbol = isWild ? null : symbol;

      while (queue.length > 0) {
        const [cc, rr] = queue.shift();
        cluster.push([cc, rr]);

        const neighbors = [[cc-1,rr],[cc+1,rr],[cc,rr-1],[cc,rr+1]];
        for (const [nc, nr] of neighbors) {
          if (nc < 0 || nc >= cols || nr < 0 || nr >= rows || visited[nc][nr]) continue;
          const ns = grid[nc][nr];
          if (!ns || ns === 'blank' || ns === 'scatter') continue;

          let matches = false;
          if (baseSymbol === null) {
            // Cluster iniciou com wild — aceita qualquer não-scatter
            if (ns !== 'scatter') {
              if (ns !== 'wild') baseSymbol = ns;
              matches = true;
            }
          } else {
            matches = (ns === baseSymbol || ns === 'wild');
          }

          if (matches) {
            visited[nc][nr] = true;
            queue.push([nc, nr]);
          }
        }
      }

      if (cluster.length >= 5 && baseSymbol) {
        clusters.push({ symbol: baseSymbol, cells: cluster, count: cluster.length });
      }
    }
  }
  return clusters;
}

// ═══════════════════════════════════════════════════════════════
// 4. CLUSTER PAYOUT — Busca na paytable por threshold
// ═══════════════════════════════════════════════════════════════

function calculateClusterPayout(clusters, paytable) {
  const thresholds = [20, 15, 12, 8, 5]; // maior primeiro
  return clusters.map(cluster => {
    for (const t of thresholds) {
      if (cluster.count >= t) {
        const pay = paytable.find(p => p.symbol === cluster.symbol && p.count === t);
        if (pay) return { ...cluster, payout: pay.payout_multiplier, threshold: t };
      }
    }
    // Fallback menor threshold
    const pay = paytable.find(p => p.symbol === cluster.symbol && p.count === 5);
    return { ...cluster, payout: pay ? pay.payout_multiplier : 0, threshold: 5 };
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. PAYLINE DETECTION — Classic 3×3, 5 paylines
// ═══════════════════════════════════════════════════════════════

const CLASSIC_PAYLINES = [
  [[0,1],[1,1],[2,1]], // centro
  [[0,0],[1,0],[2,0]], // topo
  [[0,2],[1,2],[2,2]], // base
  [[0,0],[1,1],[2,2]], // diagonal desc
  [[0,2],[1,1],[2,0]], // diagonal asc
];

function checkClassicPaylines(grid, paytable) {
  const wins = [];
  for (let i = 0; i < CLASSIC_PAYLINES.length; i++) {
    const symbols = CLASSIC_PAYLINES[i].map(([c, r]) => grid[c][r]);
    if (symbols.some(s => !s || s === 'blank')) continue;

    const base = symbols.find(s => s !== 'wild');
    if (!base) continue; // 3 wilds — tratar separadamente se necessário

    const allMatch = symbols.every(s => s === base || s === 'wild');
    if (allMatch) {
      const pay = paytable.find(p => p.symbol === base && p.count === 3);
      if (pay) {
        wins.push({
          type: 'payline',
          line: i + 1,
          symbols: symbols.join('-'),
          symbol: base,
          count: 3,
          payout: pay.payout_multiplier,
          cells: CLASSIC_PAYLINES[i]
        });
      }
    }
  }
  return wins;
}

// Checar cereja com 2 (tradição slots clássicos)
function checkCherryPairs(grid, paytable) {
  const wins = [];
  const cherryPay = paytable.find(p => p.symbol === 'cereja' && p.count === 2);
  if (!cherryPay) return wins;

  for (let i = 0; i < CLASSIC_PAYLINES.length; i++) {
    const symbols = CLASSIC_PAYLINES[i].map(([c, r]) => grid[c][r]);
    const cherryCount = symbols.filter(s => s === 'cereja').length;
    if (cherryCount === 2) {
      // Só paga se não teve win de 3 nesta payline
      wins.push({
        type: 'payline',
        line: i + 1,
        symbols: symbols.join('-'),
        symbol: 'cereja',
        count: 2,
        payout: cherryPay.payout_multiplier,
        cells: CLASSIC_PAYLINES[i]
      });
    }
  }
  return wins;
}

// ═══════════════════════════════════════════════════════════════
// 6. TUMBLE ENGINE — Remove wins, gravity, novos símbolos
// ═══════════════════════════════════════════════════════════════

function performTumble(grid, winCells, strips, seedParams, cursorOffset, cols, rows) {
  // 1. Marcar células do win como null
  const removedCells = [];
  for (const [c, r] of winCells) {
    if (grid[c][r] !== null) {
      removedCells.push({ col: c, row: r, symbol: grid[c][r] });
      grid[c][r] = null;
    }
  }

  // 2. Gravity: células acima caem
  const dropMap = []; // { col, fromRow, toRow }
  for (let c = 0; c < cols; c++) {
    let writeIdx = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[c][r] !== null) {
        if (writeIdx !== r) {
          dropMap.push({ col: c, fromRow: r, toRow: writeIdx });
          grid[c][writeIdx] = grid[c][r];
          grid[c][r] = null;
        }
        writeIdx--;
      }
    }

    // 3. Novos símbolos no topo
    const nullCount = writeIdx + 1;
    if (nullCount > 0) {
      const floats = generateFloats({
        ...seedParams,
        cursor: cursorOffset,
        count: nullCount
      });
      cursorOffset += nullCount * 4;

      for (let i = 0; i < nullCount; i++) {
        const pos = Math.floor(floats[i] * strips[c].length);
        grid[c][writeIdx - i] = strips[c][pos];
      }
    }
  }

  return { grid, removedCells, dropMap, newCursorOffset: cursorOffset };
}

// ═══════════════════════════════════════════════════════════════
// 7. SCATTER DETECTION — Conta scatters no grid (Video)
// ═══════════════════════════════════════════════════════════════

function countScatters(grid, cols, rows) {
  let count = 0;
  const positions = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (grid[c][r] === 'scatter') {
        count++;
        positions.push([c, r]);
      }
    }
  }
  return { count, positions };
}

function scatterToFreeSpins(count) {
  if (count >= 5) return 20;
  if (count >= 4) return 15;
  if (count >= 3) return 10;
  return 0;
}

// ═══════════════════════════════════════════════════════════════
// 8. HOLD & SPIN ENGINE — Classic: Diamantes travam
// ═══════════════════════════════════════════════════════════════

function checkHoldAndSpin(grid, cols, rows) {
  const diamonds = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (grid[c][r] === 'diamante') {
        diamonds.push([c, r]);
      }
    }
  }
  return { triggered: diamonds.length > 0, diamonds };
}

function generateHoldAndSpinResult(diamonds, grid, seedParams, cursorOffset, strips, cols, rows) {
  const respins = [];
  let currentDiamonds = [...diamonds];
  let currentGrid = grid.map(col => [...col]);
  let remainingRespins = 3;

  while (remainingRespins > 0 && currentDiamonds.length < cols * rows) {
    // Gerar novos símbolos para posições NÃO travadas
    const freePositions = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const isHeld = currentDiamonds.some(([dc, dr]) => dc === c && dr === r);
        if (!isHeld) freePositions.push([c, r]);
      }
    }

    const floats = generateFloats({
      ...seedParams,
      cursor: cursorOffset,
      count: freePositions.length
    });
    cursorOffset += freePositions.length * 4;

    const newDiamonds = [];
    for (let i = 0; i < freePositions.length; i++) {
      const [c, r] = freePositions[i];
      const pos = Math.floor(floats[i] * strips[c].length);
      currentGrid[c][r] = strips[c][pos];
      if (currentGrid[c][r] === 'diamante') {
        newDiamonds.push([c, r]);
      }
    }

    if (newDiamonds.length > 0) {
      currentDiamonds = [...currentDiamonds, ...newDiamonds];
      remainingRespins = 3; // reset
    } else {
      remainingRespins--;
    }

    respins.push({
      grid: currentGrid.map(col => [...col]),
      newDiamonds,
      heldDiamonds: [...currentDiamonds],
      remainingRespins
    });
  }

  // Revelar valores dos diamantes (5x-50x aposta)
  const DIAMOND_VALUES = [5, 10, 10, 15, 15, 20, 25, 25, 50];
  const valueFloats = generateFloats({
    ...seedParams,
    cursor: cursorOffset,
    count: currentDiamonds.length
  });
  cursorOffset += currentDiamonds.length * 4;

  const diamondReveals = currentDiamonds.map((pos, i) => {
    const idx = Math.floor(valueFloats[i] * DIAMOND_VALUES.length);
    return { col: pos[0], row: pos[1], multiplier: DIAMOND_VALUES[idx] };
  });

  const totalMultiplier = diamondReveals.reduce((sum, d) => sum + d.multiplier, 0);
  const isGridComplete = currentDiamonds.length >= cols * rows;

  return {
    respins,
    diamondReveals,
    totalMultiplier,
    isGridComplete,
    newCursorOffset: cursorOffset
  };
}

// ═══════════════════════════════════════════════════════════════
// 9. JACKPOT CHECK — Random trigger baseado em odds
// ═══════════════════════════════════════════════════════════════

function checkJackpot(mode, seedParams, cursorOffset) {
  const tiers = mode === 'classic' ? ['mini', 'grand'] : ['mini', 'minor', 'major', 'grand'];

  const floats = generateFloats({
    ...seedParams,
    cursor: cursorOffset,
    count: tiers.length
  });
  cursorOffset += tiers.length * 4;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const poolKey = `${tier}:${mode}`;
    const pool = jackpotPools[poolKey];
    if (!pool) continue;

    const roll = Math.floor(floats[i] * pool.trigger_odds);
    if (roll === 0) { // 1 em trigger_odds chance
      return {
        tier,
        amount: pool.current_amount,
        newCursorOffset: cursorOffset
      };
    }
  }

  return { tier: null, amount: 0, newCursorOffset: cursorOffset };
}

function contributeToJackpots(mode, betAmount) {
  const tiers = mode === 'classic' ? ['mini', 'grand'] : ['mini', 'minor', 'major', 'grand'];
  for (const tier of tiers) {
    const poolKey = `${tier}:${mode}`;
    const pool = jackpotPools[poolKey];
    if (pool) {
      pool.current_amount += betAmount * pool.contribution_rate;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 10. VIDEO SPIN COMPLETO — Grid + Clusters + Tumbles + Scatter
// ═══════════════════════════════════════════════════════════════

function processVideoSpin(strips, paytable, seedParams, cursorStart, isFreeSpins, accumulatedMultiplier) {
  const cols = VIDEO_COLS, rows = VIDEO_ROWS;
  let cursor = cursorStart;

  // Gerar posições iniciais dos reels
  const floats = generateFloats({ ...seedParams, cursor, count: cols });
  cursor += cols * 4;

  const positions = getReelPositions(floats, strips);
  const initialGrid = buildGrid(positions, strips, rows);
  let grid = initialGrid.map(col => [...col]);

  // Scatter check (antes de tumbles)
  const scatterInfo = countScatters(grid, cols, rows);
  const freeSpinsAwarded = scatterToFreeSpins(scatterInfo.count);

  // Tumble loop
  const tumbles = [];
  let tumbleCount = 0;
  let totalWinMultiplier = 0;
  let baseMultiplier = isFreeSpins ? accumulatedMultiplier : 1;

  while (tumbleCount < MAX_TUMBLES) {
    const clusters = findClusters(grid, cols, rows);
    if (clusters.length === 0) break;

    const paidClusters = calculateClusterPayout(clusters, paytable);
    const currentMultiplier = isFreeSpins
      ? baseMultiplier + tumbleCount
      : getMultiplier(tumbleCount, false);

    const tumbleWin = paidClusters.reduce((sum, c) => sum + c.payout, 0) * currentMultiplier;
    totalWinMultiplier += paidClusters.reduce((sum, c) => sum + c.payout, 0);

    // Coletar todas as células de win para remover
    const allWinCells = [];
    for (const c of paidClusters) {
      for (const cell of c.cells) {
        if (!allWinCells.some(([x, y]) => x === cell[0] && y === cell[1])) {
          allWinCells.push(cell);
        }
      }
    }

    tumbles.push({
      tumbleIndex: tumbleCount,
      clusters: paidClusters.map(c => ({
        symbol: c.symbol,
        count: c.count,
        threshold: c.threshold,
        payout: c.payout,
        cells: c.cells
      })),
      multiplier: currentMultiplier,
      winThisTumble: tumbleWin,
      removedCells: allWinCells,
      gridBefore: grid.map(col => [...col])
    });

    // Executar tumble
    const tumbleResult = performTumble(grid, allWinCells, strips, seedParams, cursor, cols, rows);
    grid = tumbleResult.grid;
    cursor = tumbleResult.newCursorOffset;
    tumbleCount++;
  }

  // Calcular win total
  const finalMultiplier = isFreeSpins
    ? baseMultiplier + tumbleCount
    : (tumbleCount > 0 ? getMultiplier(tumbleCount - 1, false) : 1);

  return {
    positions,
    initialGrid: initialGrid.map(col => [...col]),
    finalGrid: grid.map(col => [...col]),
    tumbles,
    tumbleCount,
    totalWinMultiplier, // soma dos payouts base (sem multiplicador)
    finalMultiplier,
    scatterInfo,
    freeSpinsAwarded,
    cursorEnd: cursor
  };
}

// ═══════════════════════════════════════════════════════════════
// 11. CLASSIC SPIN COMPLETO — Grid + Paylines + Hold&Spin
// ═══════════════════════════════════════════════════════════════

function processClassicSpin(strips, paytable, seedParams, cursorStart) {
  const cols = CLASSIC_COLS, rows = CLASSIC_ROWS;
  let cursor = cursorStart;

  // Gerar posições
  const floats = generateFloats({ ...seedParams, cursor, count: cols });
  cursor += cols * 4;

  const positions = getReelPositions(floats, strips);
  const grid = buildGrid(positions, strips, rows);

  // Check paylines (3 iguais)
  const paylineWins = checkClassicPaylines(grid, paytable);

  // Check cereja pairs (2 iguais) — só se não houve win de 3 na mesma payline
  const winPaylines = new Set(paylineWins.map(w => w.line));
  const cherryWins = checkCherryPairs(grid, paytable)
    .filter(w => !winPaylines.has(w.line));

  const allWins = [...paylineWins, ...cherryWins];
  const totalPayoutMultiplier = allWins.reduce((sum, w) => sum + w.payout, 0);

  // Check Hold & Spin
  const holdSpin = checkHoldAndSpin(grid, cols, rows);
  let holdSpinResult = null;

  if (holdSpin.triggered) {
    holdSpinResult = generateHoldAndSpinResult(
      holdSpin.diamonds, grid, seedParams, cursor, strips, cols, rows
    );
    cursor = holdSpinResult.newCursorOffset;
  }

  return {
    positions,
    grid: grid.map(col => [...col]),
    wins: allWins,
    totalPayoutMultiplier,
    holdAndSpin: holdSpinResult,
    cursorEnd: cursor
  };
}

// ═══════════════════════════════════════════════════════════════
// 12. INIT — Carregar dados do banco para cache
// ═══════════════════════════════════════════════════════════════

async function initSlotsEngine() {
  const MySQL = exports.oxmysql;

  // Config
  const configRows = await MySQL.query_async('SELECT * FROM casino_slots_config');
  for (const row of configRows) {
    slotsConfig[row.mode] = row;
  }

  // Reel strips
  const stripRows = await MySQL.query_async(
    'SELECT * FROM casino_slots_reel_strips ORDER BY mode, rtp_profile, reel_index, position'
  );
  for (const row of stripRows) {
    const key = `${row.mode}:${row.rtp_profile}`;
    if (!reelStrips[key]) reelStrips[key] = [];
    if (!reelStrips[key][row.reel_index]) reelStrips[key][row.reel_index] = [];
    reelStrips[key][row.reel_index][row.position] = row.symbol;
  }

  // Paytable
  const payRows = await MySQL.query_async(
    'SELECT * FROM casino_slots_paytable ORDER BY mode, display_order'
  );
  for (const row of payRows) {
    if (!paytables[row.mode]) paytables[row.mode] = [];
    paytables[row.mode].push(row);
  }

  // Jackpot pools
  const jpRows = await MySQL.query_async('SELECT * FROM casino_slots_jackpot_pool');
  for (const row of jpRows) {
    jackpotPools[`${row.tier}:${row.mode}`] = {
      current_amount: parseFloat(row.current_amount),
      seed_amount: parseFloat(row.seed_amount),
      contribution_rate: parseFloat(row.contribution_rate),
      trigger_odds: row.trigger_odds
    };
  }

  console.log('[SLOTS] Engine inicializada:',
    Object.keys(slotsConfig).length, 'configs,',
    Object.keys(reelStrips).length, 'reel strip profiles,',
    Object.keys(paytables).length, 'paytables,',
    Object.keys(jackpotPools).length, 'jackpot pools'
  );
}

// ═══════════════════════════════════════════════════════════════
// 13. SEED MANAGEMENT — Por sessão de usuário
// ═══════════════════════════════════════════════════════════════

async function getOrCreateSeed(userId) {
  if (serverSeeds[userId] && serverSeeds[userId].status === 'active') {
    return serverSeeds[userId];
  }

  const MySQL = exports.oxmysql;

  // Buscar seed ativa no banco
  const existing = await MySQL.query_async(
    'SELECT * FROM casino_slots_server_seeds WHERE user_id = ? AND status = "active" LIMIT 1',
    [userId]
  );

  if (existing && existing.length > 0) {
    const row = existing[0];
    serverSeeds[userId] = {
      id: row.id,
      seed: row.server_seed,
      hash: row.server_seed_hash,
      clientSeed: row.client_seed,
      nonce: row.nonce,
      status: 'active'
    };
    return serverSeeds[userId];
  }

  // Criar nova seed
  const seed = generateServerSeed();
  const hash = hashSeed(seed);

  const result = await MySQL.query_async(
    'INSERT INTO casino_slots_server_seeds (user_id, server_seed, server_seed_hash) VALUES (?, ?, ?)',
    [userId, seed, hash]
  );

  serverSeeds[userId] = {
    id: result.insertId,
    seed,
    hash,
    clientSeed: 'default',
    nonce: 0,
    status: 'active'
  };

  return serverSeeds[userId];
}

async function incrementNonce(userId) {
  const s = serverSeeds[userId];
  if (!s) return;
  s.nonce += 1;

  const MySQL = exports.oxmysql;
  await MySQL.query_async(
    'UPDATE casino_slots_server_seeds SET nonce = ? WHERE id = ?',
    [s.nonce, s.id]
  );
}

// ═══════════════════════════════════════════════════════════════
// 14. VALIDAÇÕES DE SEGURANÇA
// ═══════════════════════════════════════════════════════════════

function validateSpin(userId, betAmount, mode) {
  const config = slotsConfig[mode];
  if (!config) return { valid: false, error: 'Modo inválido' };
  if (betAmount < parseFloat(config.min_bet)) return { valid: false, error: `Aposta mínima R$ ${config.min_bet}` };
  if (betAmount > parseFloat(config.max_bet)) return { valid: false, error: `Aposta máxima R$ ${config.max_bet}` };

  // Rate limit
  const state = userStates[userId];
  if (state) {
    if (state.spinning) return { valid: false, error: 'Spin em andamento' };
    const elapsed = Date.now() - state.lastSpin;
    if (elapsed < config.rate_limit_ms) return { valid: false, error: 'Aguarde para girar novamente' };
  }

  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════
// 15. HANDLERS — Eventos NUI → Server
// ═══════════════════════════════════════════════════════════════

// ── HANDLER: casino:slots:spin ──────────────────────────────
async function handleSpin(source, data) {
  const userId = source;
  const { mode, betAmount } = data;
  const MySQL = exports.oxmysql;

  // Validar
  const validation = validateSpin(userId, betAmount, mode);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Verificar saldo (vRP)
  const money = exports.vrp.getMoney({ parseInt(userId) });
  if (money < betAmount) {
    return { success: false, error: 'Saldo insuficiente' };
  }

  // Marcar spinning
  userStates[userId] = { spinning: true, lastSpin: Date.now() };

  try {
    // Cobrar aposta
    exports.vrp.removeMoney({ parseInt(userId), betAmount });

    // Contribuir para jackpots
    contributeToJackpots(mode, betAmount);

    // Seed
    const seedData = await getOrCreateSeed(userId);
    const config = slotsConfig[mode];
    const profile = config.rtp_profile || 'default';
    const strips = reelStrips[`${mode}:${profile}`];
    const paytable = paytables[mode];

    if (!strips || !paytable) {
      exports.vrp.addMoney({ parseInt(userId), betAmount }); // refund
      return { success: false, error: 'Configuração de jogo não encontrada' };
    }

    const seedParams = {
      serverSeed: seedData.seed,
      clientSeed: seedData.clientSeed,
      nonce: seedData.nonce
    };

    let result;
    let totalWin = 0;

    if (mode === 'video') {
      result = processVideoSpin(strips, paytable, seedParams, 0, false, 1);
      totalWin = result.totalWinMultiplier * betAmount;
      // Aplicar multiplicador final
      if (result.tumbleCount > 0) {
        totalWin = result.tumbles.reduce((sum, t) => sum + t.winThisTumble * betAmount, 0);
      }
    } else {
      result = processClassicSpin(strips, paytable, seedParams, 0);
      totalWin = result.totalPayoutMultiplier * betAmount;

      // Hold & Spin bonus
      if (result.holdAndSpin) {
        totalWin += result.holdAndSpin.totalMultiplier * betAmount;
      }
    }

    // Check jackpot
    const jpCheck = checkJackpot(mode, seedParams, result.cursorEnd || 0);
    let jackpotHit = null;
    if (jpCheck.tier) {
      totalWin += jpCheck.amount;
      jackpotHit = { tier: jpCheck.tier, amount: jpCheck.amount };

      // Reset pool
      const poolKey = `${jpCheck.tier}:${mode}`;
      const pool = jackpotPools[poolKey];
      await MySQL.query_async(
        'UPDATE casino_slots_jackpot_pool SET current_amount = seed_amount, last_hit_user_id = ?, last_hit_amount = ?, last_hit_at = NOW() WHERE tier = ? AND mode = ?',
        [userId, jpCheck.amount, jpCheck.tier, mode]
      );
      pool.current_amount = pool.seed_amount;
    }

    // Pagar win
    if (totalWin > 0) {
      exports.vrp.addMoney({ parseInt(userId), totalWin });
    }

    // Atualizar jackpot pools no banco
    for (const key of Object.keys(jackpotPools)) {
      const [tier, m] = key.split(':');
      const p = jackpotPools[key];
      await MySQL.query_async(
        'UPDATE casino_slots_jackpot_pool SET current_amount = ? WHERE tier = ? AND mode = ?',
        [p.current_amount, tier, m]
      );
    }

    // Registrar round
    const profit = totalWin - betAmount;
    await MySQL.query_async(
      `INSERT INTO casino_slots_rounds 
       (user_id, mode, bet_amount, total_win, profit, reel_positions, symbols_result, wins_detail, 
        tumble_count, final_multiplier, server_seed_hash, client_seed, nonce, cursor_start, rtp_profile)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, mode, betAmount, totalWin, profit,
        JSON.stringify(result.positions),
        JSON.stringify(mode === 'video' ? result.initialGrid : result.grid),
        JSON.stringify(mode === 'video' ? result.tumbles : result.wins),
        mode === 'video' ? result.tumbleCount : 0,
        mode === 'video' ? result.finalMultiplier : 1,
        seedData.hash, seedData.clientSeed, seedData.nonce, 0, profile
      ]
    );

    // Audit log
    await MySQL.query_async(
      'INSERT INTO casino_slots_audit_log (user_id, action, details) VALUES (?, ?, ?)',
      [userId, 'spin', JSON.stringify({
        mode, betAmount, totalWin, profit,
        tumbles: mode === 'video' ? result.tumbleCount : 0,
        jackpot: jackpotHit ? jpCheck.tier : null
      })]
    );

    // Incrementar nonce
    await incrementNonce(userId);

    // Montar resposta para o client
    const response = {
      success: true,
      mode,
      betAmount,
      totalWin,
      profit,
      seedHash: seedData.hash,
      nonce: seedData.nonce - 1, // nonce usado neste spin (já incrementamos)
      jackpotHit,
      jackpotPools: getJackpotPoolsForClient(mode),
      newBalance: exports.vrp.getMoney({ parseInt(userId) })
    };

    if (mode === 'video') {
      response.positions = result.positions;
      response.initialGrid = result.initialGrid;
      response.tumbles = result.tumbles;
      response.tumbleCount = result.tumbleCount;
      response.finalMultiplier = result.finalMultiplier;
      response.scatterInfo = result.scatterInfo;
      response.freeSpinsAwarded = result.freeSpinsAwarded;
    } else {
      response.positions = result.positions;
      response.grid = result.grid;
      response.wins = result.wins;
      response.holdAndSpin = result.holdAndSpin;
    }

    // Determinar tier de win
    const winRatio = totalWin / betAmount;
    if (winRatio >= 50) response.winTier = 'epic';
    else if (winRatio >= 25) response.winTier = 'mega';
    else if (winRatio >= 10) response.winTier = 'big';
    else if (winRatio > 0) response.winTier = 'normal';
    else response.winTier = 'none';

    return response;

  } finally {
    userStates[userId] = { spinning: false, lastSpin: Date.now() };
  }
}

// ── HANDLER: casino:slots:free_spin ─────────────────────────
async function handleFreeSpin(source, data) {
  const userId = source;
  const { sessionId } = data;
  const MySQL = exports.oxmysql;

  // Buscar sessão ativa
  const sessions = await MySQL.query_async(
    'SELECT * FROM casino_slots_free_spins WHERE id = ? AND user_id = ? AND status = "active"',
    [sessionId, userId]
  );

  if (!sessions || sessions.length === 0) {
    return { success: false, error: 'Sessão de free spins não encontrada' };
  }

  const session = sessions[0];
  if (session.spins_remaining <= 0) {
    return { success: false, error: 'Free spins esgotados' };
  }

  // Rate limit
  const state = userStates[userId];
  if (state && state.spinning) return { success: false, error: 'Spin em andamento' };

  userStates[userId] = { spinning: true, lastSpin: Date.now() };

  try {
    const seedData = await getOrCreateSeed(userId);
    const config = slotsConfig.video;
    const profile = config.rtp_profile || 'default';
    const strips = reelStrips[`video:${profile}`];
    const paytable = paytables.video;

    const seedParams = {
      serverSeed: seedData.seed,
      clientSeed: seedData.clientSeed,
      nonce: seedData.nonce
    };

    const accMultiplier = parseFloat(session.accumulated_multiplier);
    const result = processVideoSpin(strips, paytable, seedParams, 0, true, accMultiplier);

    const betAmount = parseFloat(session.bet_amount);
    let spinWin = result.tumbles.reduce((sum, t) => sum + t.winThisTumble * betAmount, 0);

    // Retrigger check
    let retriggered = false;
    let extraSpins = 0;
    if (result.freeSpinsAwarded > 0 && session.retrigger_count < MAX_RETRIGGERS) {
      retriggered = true;
      extraSpins = 5; // +5 spins por retrigger
    }

    // Atualizar sessão
    const newMultiplier = accMultiplier + result.tumbleCount;
    const newRemaining = session.spins_remaining - 1 + extraSpins;
    const newRetriggers = session.retrigger_count + (retriggered ? 1 : 0);
    const newTotalWin = parseFloat(session.total_win) + spinWin;

    const isComplete = newRemaining <= 0;

    await MySQL.query_async(
      `UPDATE casino_slots_free_spins SET 
       spins_remaining = ?, accumulated_multiplier = ?, total_win = ?, 
       retrigger_count = ?, status = ?, completed_at = ?
       WHERE id = ?`,
      [
        newRemaining, newMultiplier, newTotalWin,
        newRetriggers, isComplete ? 'completed' : 'active',
        isComplete ? new Date().toISOString() : null,
        sessionId
      ]
    );

    // Pagar win do spin
    if (spinWin > 0) {
      exports.vrp.addMoney({ parseInt(userId), spinWin });
    }

    // Registrar round
    await MySQL.query_async(
      `INSERT INTO casino_slots_rounds 
       (user_id, mode, bet_amount, total_win, profit, reel_positions, symbols_result, wins_detail,
        tumble_count, final_multiplier, is_free_spin, free_spin_session_id, server_seed_hash, client_seed, nonce, rtp_profile)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`,
      [
        userId, 'video', betAmount, spinWin, spinWin,
        JSON.stringify(result.positions),
        JSON.stringify(result.initialGrid),
        JSON.stringify(result.tumbles),
        result.tumbleCount, newMultiplier,
        sessionId, seedData.hash, seedData.clientSeed, seedData.nonce,
        config.rtp_profile || 'default'
      ]
    );

    await incrementNonce(userId);

    return {
      success: true,
      positions: result.positions,
      initialGrid: result.initialGrid,
      tumbles: result.tumbles,
      tumbleCount: result.tumbleCount,
      multiplier: newMultiplier,
      spinWin,
      totalSessionWin: newTotalWin,
      spinsRemaining: newRemaining,
      retriggered,
      extraSpins,
      isComplete,
      newBalance: exports.vrp.getMoney({ parseInt(userId) })
    };

  } finally {
    userStates[userId] = { spinning: false, lastSpin: Date.now() };
  }
}

// ── HANDLER: casino:slots:bonus_buy ─────────────────────────
async function handleBonusBuy(source, data) {
  const userId = source;
  const { betAmount } = data;
  const MySQL = exports.oxmysql;

  const config = slotsConfig.video;
  if (!config) return { success: false, error: 'Configuração não encontrada' };

  const cost = betAmount * config.free_spins_cost_multiplier;
  const money = exports.vrp.getMoney({ parseInt(userId) });

  if (money < cost) {
    return { success: false, error: `Saldo insuficiente. Custo: R$ ${cost.toFixed(2)}` };
  }

  // Verificar se já tem sessão ativa
  const active = await MySQL.query_async(
    'SELECT id FROM casino_slots_free_spins WHERE user_id = ? AND status = "active"',
    [userId]
  );
  if (active && active.length > 0) {
    return { success: false, error: 'Você já tem uma sessão de free spins ativa' };
  }

  // Cobrar
  exports.vrp.removeMoney({ parseInt(userId), cost });

  // Criar sessão
  const result = await MySQL.query_async(
    `INSERT INTO casino_slots_free_spins (user_id, mode, trigger_type, total_spins, spins_remaining, bet_amount)
     VALUES (?, 'video', 'bonus_buy', 10, 10, ?)`,
    [userId, betAmount]
  );

  // Audit
  await MySQL.query_async(
    'INSERT INTO casino_slots_audit_log (user_id, action, details) VALUES (?, ?, ?)',
    [userId, 'bonus_buy', JSON.stringify({ cost, betAmount, sessionId: result.insertId })]
  );

  return {
    success: true,
    sessionId: result.insertId,
    spinsRemaining: 10,
    betAmount,
    cost,
    newBalance: exports.vrp.getMoney({ parseInt(userId) })
  };
}

// ── HANDLER: casino:slots:history ───────────────────────────
async function handleHistory(source) {
  const userId = source;
  const MySQL = exports.oxmysql;

  const rows = await MySQL.query_async(
    `SELECT id, mode, bet_amount, total_win, profit, tumble_count, final_multiplier, 
            jackpot_tier, jackpot_amount, is_free_spin, created_at
     FROM casino_slots_rounds WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    [userId]
  );

  return { success: true, rounds: rows };
}

// ── HANDLER: casino:slots:paytable ──────────────────────────
async function handlePaytable(source, data) {
  const { mode } = data;
  return { success: true, paytable: paytables[mode] || [] };
}

// ── HANDLER: casino:slots:jackpot_info ──────────────────────
function getJackpotPoolsForClient(mode) {
  const tiers = mode === 'classic' ? ['mini', 'grand'] : ['mini', 'minor', 'major', 'grand'];
  const pools = {};
  for (const tier of tiers) {
    const pool = jackpotPools[`${tier}:${mode}`];
    if (pool) pools[tier] = pool.current_amount;
  }
  return pools;
}

async function handleJackpotInfo(source, data) {
  const { mode } = data;
  return { success: true, pools: getJackpotPoolsForClient(mode) };
}

// ── HANDLER: casino:slots:admin_config ──────────────────────
async function handleAdminConfig(source, data) {
  const { mode, field, value } = data;
  const MySQL = exports.oxmysql;

  // TODO: verificar se source é admin via vRP
  const validFields = ['min_bet','max_bet','rtp_profile','free_spins_cost_multiplier',
    'turbo_enabled','autoplay_enabled','autoplay_max_spins','jackpot_enabled','max_tumbles','rate_limit_ms'];

  if (!validFields.includes(field)) {
    return { success: false, error: 'Campo inválido' };
  }

  const oldValue = slotsConfig[mode] ? slotsConfig[mode][field] : null;

  await MySQL.query_async(
    `UPDATE casino_slots_config SET ${field} = ? WHERE mode = ?`,
    [value, mode]
  );

  // Atualizar cache
  if (slotsConfig[mode]) slotsConfig[mode][field] = value;

  // Audit
  await MySQL.query_async(
    'INSERT INTO casino_slots_audit_log (user_id, action, details) VALUES (?, ?, ?)',
    [source, 'config_change', JSON.stringify({ mode, field, oldValue, newValue: value })]
  );

  // Se mudou rtp_profile, recarregar strips
  if (field === 'rtp_profile') {
    await initSlotsEngine(); // reload tudo
  }

  return { success: true, config: slotsConfig[mode] };
}

// ═══════════════════════════════════════════════════════════════
// 16. REGISTRO DE CALLBACKS NUI
// ═══════════════════════════════════════════════════════════════

// Inicializar ao carregar o resource
setTimeout(() => {
  initSlotsEngine().then(() => {
    console.log('[SLOTS] ✅ Engine pronta para receber spins');
  }).catch(err => {
    console.error('[SLOTS] ❌ Erro ao inicializar:', err);
  });
}, 2000); // delay para oxmysql estar pronto

// Registrar NUI callbacks
RegisterNUICallback('casino:slots:spin', async (data, cb) => {
  const source = global.source || data.userId;
  const result = await handleSpin(source, data);
  cb(result);
});

RegisterNUICallback('casino:slots:free_spin', async (data, cb) => {
  const source = global.source || data.userId;
  const result = await handleFreeSpin(source, data);
  cb(result);
});

RegisterNUICallback('casino:slots:bonus_buy', async (data, cb) => {
  const source = global.source || data.userId;
  const result = await handleBonusBuy(source, data);
  cb(result);
});

RegisterNUICallback('casino:slots:history', async (data, cb) => {
  const source = global.source || data.userId;
  const result = await handleHistory(source);
  cb(result);
});

RegisterNUICallback('casino:slots:paytable', async (data, cb) => {
  const result = await handlePaytable(null, data);
  cb(result);
});

RegisterNUICallback('casino:slots:jackpot_info', async (data, cb) => {
  const result = await handleJackpotInfo(null, data);
  cb(result);
});

RegisterNUICallback('casino:slots:admin_config', async (data, cb) => {
  const source = global.source || data.userId;
  const result = await handleAdminConfig(source, data);
  cb(result);
});

// Exports para uso externo
exports('getSlotsJackpots', (mode) => getJackpotPoolsForClient(mode));
exports('getSlotsConfig', (mode) => slotsConfig[mode]);

console.log('[SLOTS] Handler carregado — aguardando init...');
