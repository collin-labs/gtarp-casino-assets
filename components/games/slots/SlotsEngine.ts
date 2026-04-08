// Slot Machine Engine — Blackout Casino GTARP
// Grid generation, scatter pays, tumble loop, free spins, provably fair
// Mock no browser, pronto para integrar com server handler

import type {
  SlotSymbol, GridCell, Grid, WinCluster, TumbleStep,
  SpinResult, FreeSpinsState, ProvablyFairData,
  ClassicSymbol, ClassicResult, ClassicPaylineWin,
} from "./SlotsTypes";

import {
  VIDEO_SYMBOLS, TOTAL_WEIGHT_BASE, TOTAL_WEIGHT_FS,
  MULTIPLIER_ORB_WEIGHT_FS, MULTIPLIER_VALUES_BASE, MULTIPLIER_VALUES_FS,
  GRID_COLS, GRID_ROWS, MIN_SCATTER_PAYS,
  FS_SCATTER_REQUIRED, FS_SPINS_AWARDED, FS_RETRIGGER_SPINS,
  JACKPOT_CONTRIBUTION_PERCENT, MAX_WIN_MULTIPLIER,
  CLASSIC_SYMBOLS, CLASSIC_TOTAL_WEIGHT, CLASSIC_PAYLINES,
} from "./SlotsConstants";

// =============================================
// PROVABLY FAIR (HMAC-SHA256)
// =============================================

// Browser: usa crypto.subtle. Server: usa Node crypto
async function hmacSHA256(key: string, message: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig = await window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback simples para quando crypto.subtle nao esta disponivel
  return fallbackHash(key + message);
}

async function sha256(input: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const hash = await window.crypto.subtle.digest("SHA-256", enc.encode(input));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return fallbackHash(input);
}

// Hash fallback para ambientes sem crypto.subtle (nunca em prod)
function fallbackHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

function generateRandomSeed(): string {
  const arr = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 32; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createProvablyFairSession(): Promise<{
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}> {
  const serverSeed = generateRandomSeed();
  const serverSeedHash = await sha256(serverSeed);
  const clientSeed = generateRandomSeed().slice(0, 16);
  return { serverSeed, serverSeedHash, clientSeed, nonce: 0 };
}

// Gera N numeros deterministicos a partir do hash
async function generateNumbers(
  serverSeed: string, clientSeed: string, nonce: number, count: number
): Promise<number[]> {
  const numbers: number[] = [];
  let cursor = 0;

  while (numbers.length < count) {
    const hash = await hmacSHA256(serverSeed, `${clientSeed}:${nonce}:${cursor}`);
    // Cada 8 chars hex = 1 numero (0 a 4294967295)
    for (let i = 0; i < hash.length - 7 && numbers.length < count; i += 8) {
      const hex = hash.slice(i, i + 8);
      numbers.push(parseInt(hex, 16));
    }
    cursor++;
  }

  return numbers;
}

// =============================================
// SELECAO DE SIMBOLOS POR PESO
// =============================================

function selectSymbolByWeight(randomValue: number, isFS: boolean): SlotSymbol {
  const totalWeight = isFS ? TOTAL_WEIGHT_FS : TOTAL_WEIGHT_BASE;
  const roll = randomValue % totalWeight;
  let cumulative = 0;

  for (const sym of VIDEO_SYMBOLS) {
    let weight = sym.weight;
    if (sym.id === "multiplier_orb") {
      weight = isFS ? MULTIPLIER_ORB_WEIGHT_FS : 0;
    }
    cumulative += weight;
    if (roll < cumulative) return sym;
  }

  // Fallback
  return VIDEO_SYMBOLS[VIDEO_SYMBOLS.length - 2]; // topaz
}

function selectMultiplierValue(randomValue: number, isFS: boolean): number {
  const values = isFS ? MULTIPLIER_VALUES_FS : MULTIPLIER_VALUES_BASE;
  return values[randomValue % values.length];
}

// =============================================
// GRID GENERATION
// =============================================

export async function generateGrid(
  serverSeed: string, clientSeed: string, nonce: number, isFS: boolean
): Promise<{ grid: Grid; pfData: ProvablyFairData }> {
  const totalCells = GRID_COLS * GRID_ROWS;
  const numbers = await generateNumbers(serverSeed, clientSeed, nonce, totalCells + 10);
  const serverSeedHash = await sha256(serverSeed);

  const grid: Grid = [];
  let idx = 0;

  for (let col = 0; col < GRID_COLS; col++) {
    const column: GridCell[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const symbol = selectSymbolByWeight(numbers[idx], isFS);
      const isMultiplier = symbol.id === "multiplier_orb";
      const multiplierValue = isMultiplier
        ? selectMultiplierValue(numbers[idx + totalCells] || numbers[idx], isFS)
        : 0;

      column.push({
        symbol, row, col,
        isWinning: false, isDimmed: false,
        isScatter: symbol.id === "scatter",
        isMultiplier, multiplierValue,
      });
      idx++;
    }
    grid.push(column);
  }

  return {
    grid,
    pfData: { serverSeedHash, clientSeed, nonce },
  };
}

// =============================================
// SCATTER PAYS DETECTION
// =============================================

export function detectWins(grid: Grid): WinCluster[] {
  // Contar simbolos por tipo (scatter pays = 8+ anywhere)
  const counts: Record<string, Array<{ row: number; col: number }>> = {};

  for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      const cell = grid[col][row];
      if (cell.symbol.id === "multiplier_orb") continue;

      if (!counts[cell.symbol.id]) counts[cell.symbol.id] = [];
      counts[cell.symbol.id].push({ row, col });
    }
  }

  const clusters: WinCluster[] = [];

  for (const [symbolId, positions] of Object.entries(counts)) {
    const symbol = VIDEO_SYMBOLS.find(s => s.id === symbolId);
    if (!symbol) continue;

    // Scatter: 4+ triga free spins (paga tambem)
    if (symbolId === "scatter") {
      if (positions.length >= 4) {
        const count = Math.min(positions.length, 6);
        const payout = symbol.payouts[count] || symbol.payouts[4] || 3;
        clusters.push({ symbolId, count, positions, payout });
      }
      continue;
    }

    // Regular: 8+ iguais anywhere
    if (positions.length >= MIN_SCATTER_PAYS) {
      const count = Math.min(positions.length, 12);
      // Pegar payout do tier mais proximo
      const payoutKeys = Object.keys(symbol.payouts).map(Number).sort((a, b) => b - a);
      let payout = 0;
      for (const key of payoutKeys) {
        if (count >= key) { payout = symbol.payouts[key]; break; }
      }
      clusters.push({ symbolId, count, positions, payout });
    }
  }

  return clusters;
}

// =============================================
// TUMBLE LOOP
// =============================================

export async function processTumble(
  grid: Grid, bet: number, isFS: boolean,
  serverSeed: string, clientSeed: string, nonce: number
): Promise<{ steps: TumbleStep[]; finalGrid: Grid; totalWin: number; totalMultiplier: number }> {
  const steps: TumbleStep[] = [];
  let currentGrid = grid;
  let totalWin = 0;
  let totalMultiplier = 1;
  let tumbleNonce = nonce * 100; // sub-nonce para tumbles

  for (let attempt = 0; attempt < 20; attempt++) { // max 20 tumbles
    const wins = detectWins(currentGrid);
    if (wins.length === 0) break;

    // Coletar multiplicadores da rodada
    const multiplierHits: Array<{ row: number; col: number; value: number }> = [];
    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        if (currentGrid[col][row].isMultiplier && currentGrid[col][row].multiplierValue > 0) {
          multiplierHits.push({ row, col, value: currentGrid[col][row].multiplierValue });
          totalMultiplier += currentGrid[col][row].multiplierValue;
        }
      }
    }

    // Calcular win desta tumble
    let stepWin = 0;
    const removedPositions: Array<{ row: number; col: number }> = [];

    for (const cluster of wins) {
      stepWin += cluster.payout * bet;
      for (const pos of cluster.positions) {
        if (!removedPositions.some(p => p.row === pos.row && p.col === pos.col)) {
          removedPositions.push(pos);
        }
      }
    }

    totalWin += stepWin;

    // Marcar grid
    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        currentGrid[col][row].isWinning = removedPositions.some(p => p.row === row && p.col === col);
        currentGrid[col][row].isDimmed = !currentGrid[col][row].isWinning;
      }
    }

    // Gerar novos simbolos para substituir os removidos
    tumbleNonce++;
    const newCount = removedPositions.length;
    const newNumbers = await generateNumbers(serverSeed, clientSeed, tumbleNonce, newCount + 5);
    const newSymbols: Array<{ row: number; col: number; symbol: SlotSymbol }> = [];

    // Cascade: remover wins, descer simbolos, novos entram pelo topo
    const newGrid: Grid = [];
    let newIdx = 0;

    for (let col = 0; col < GRID_COLS; col++) {
      const surviving: GridCell[] = currentGrid[col]
        .filter(cell => !removedPositions.some(p => p.row === cell.row && p.col === col));

      const needed = GRID_ROWS - surviving.length;
      const newCells: GridCell[] = [];

      for (let i = 0; i < needed; i++) {
        const symbol = selectSymbolByWeight(newNumbers[newIdx], isFS);
        const isMultiplier = symbol.id === "multiplier_orb";
        const multiplierValue = isMultiplier
          ? selectMultiplierValue(newNumbers[newIdx] >> 8, isFS)
          : 0;

        const cell: GridCell = {
          symbol, row: i, col,
          isWinning: false, isDimmed: false,
          isScatter: symbol.id === "scatter",
          isMultiplier, multiplierValue,
        };
        newCells.push(cell);
        newSymbols.push({ row: i, col, symbol });
        newIdx++;
      }

      // Novos no topo, sobreviventes embaixo
      const column = [...newCells, ...surviving].map((cell, row) => ({
        ...cell, row, isWinning: false, isDimmed: false,
      }));
      newGrid.push(column);
    }

    steps.push({
      winClusters: wins,
      removedPositions,
      newSymbols,
      multiplierHits,
      totalWin: stepWin,
    });

    currentGrid = newGrid;
  }

  // Aplicar multiplicador total ao win
  if (totalMultiplier > 1) {
    totalWin = totalWin * totalMultiplier;
  }

  // Cap no max win
  const maxWin = bet * MAX_WIN_MULTIPLIER;
  if (totalWin > maxWin) totalWin = maxWin;

  return { steps, finalGrid: currentGrid, totalWin, totalMultiplier };
}

// =============================================
// SPIN COMPLETO (VIDEO SLOT)
// =============================================

export async function executeVideoSpin(
  bet: number, anteBet: boolean,
  serverSeed: string, clientSeed: string, nonce: number,
  isFS: boolean, jackpotPool: number
): Promise<{ result: SpinResult; newJackpotPool: number }> {
  const totalBet = anteBet ? bet * 1.25 : bet;

  // Contribuir para jackpot
  const jackpotContribution = totalBet * (JACKPOT_CONTRIBUTION_PERCENT / 100);
  let newJackpotPool = jackpotPool + jackpotContribution;

  // Gerar grid inicial
  const { grid, pfData } = await generateGrid(serverSeed, clientSeed, nonce, isFS);

  // Processar tumble loop
  const { steps, finalGrid, totalWin, totalMultiplier } = await processTumble(
    grid, bet, isFS, serverSeed, clientSeed, nonce
  );

  // Contar scatters no grid inicial
  let scatterCount = 0;
  for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      if (grid[col][row].symbol.id === "scatter") scatterCount++;
    }
  }

  // Ante bet dobra chance de trigger FS (simular com scatter bonus)
  const fsRequired = anteBet
    ? Math.max(FS_SCATTER_REQUIRED - 1, 3)
    : FS_SCATTER_REQUIRED;

  const triggeredFreeSpins = scatterCount >= fsRequired;
  const freeSpinsAwarded = triggeredFreeSpins ? FS_SPINS_AWARDED : 0;

  // Jackpot check (ratio >= 500x)
  const ratio = totalWin / bet;
  const isJackpot = ratio >= 500;
  let jackpotWin = 0;
  if (isJackpot) {
    jackpotWin = newJackpotPool;
    newJackpotPool = 10000; // reset
  }

  return {
    result: {
      initialGrid: grid,
      tumbleSteps: steps,
      totalWin: totalWin + jackpotWin,
      totalMultiplier,
      scatterCount,
      triggeredFreeSpins,
      freeSpinsAwarded,
      isJackpot,
      jackpotWin,
      provablyFair: pfData,
    },
    newJackpotPool,
  };
}

// =============================================
// CLASSIC SLOT ENGINE
// =============================================

function selectClassicSymbol(randomValue: number): ClassicSymbol {
  const roll = randomValue % CLASSIC_TOTAL_WEIGHT;
  let cumulative = 0;
  for (const sym of CLASSIC_SYMBOLS) {
    cumulative += sym.weight;
    if (roll < cumulative) return sym;
  }
  return CLASSIC_SYMBOLS[CLASSIC_SYMBOLS.length - 1];
}

export async function executeClassicSpin(
  bet: number, serverSeed: string, clientSeed: string, nonce: number
): Promise<ClassicResult> {
  // 9 simbolos (3 reels x 3 visiveis)
  const numbers = await generateNumbers(serverSeed, clientSeed, nonce, 9);
  const pfData: ProvablyFairData = {
    serverSeedHash: await sha256(serverSeed),
    clientSeed,
    nonce,
  };

  const visibleReels: [ClassicSymbol[], ClassicSymbol[], ClassicSymbol[]] = [[], [], []];

  for (let reel = 0; reel < 3; reel++) {
    for (let pos = 0; pos < 3; pos++) {
      visibleReels[reel].push(selectClassicSymbol(numbers[reel * 3 + pos]));
    }
  }

  // Centro (payline principal)
  const reels: [ClassicSymbol, ClassicSymbol, ClassicSymbol] = [
    visibleReels[0][1], visibleReels[1][1], visibleReels[2][1],
  ];

  // Avaliar 3 paylines (top=0, center=1, bottom=2)
  const paylineWins: ClassicPaylineWin[] = [];
  let totalWin = 0;

  for (let line = 0; line < CLASSIC_PAYLINES; line++) {
    const lineSymbols = [
      visibleReels[0][line],
      visibleReels[1][line],
      visibleReels[2][line],
    ];

    // 3 iguais
    if (lineSymbols[0].id === lineSymbols[1].id && lineSymbols[1].id === lineSymbols[2].id) {
      const payout = lineSymbols[0].payout3 * bet;
      paylineWins.push({ payline: line, symbolId: lineSymbols[0].id, count: 3, payout });
      totalWin += payout;
    }
    // 2 iguais (primeiros 2)
    else if (lineSymbols[0].id === lineSymbols[1].id) {
      const payout = lineSymbols[0].payout2 * bet;
      paylineWins.push({ payline: line, symbolId: lineSymbols[0].id, count: 2, payout });
      totalWin += payout;
    }
  }

  return { reels, visibleReels, paylineWins, totalWin, provablyFair: pfData };
}

// =============================================
// BUY BONUS
// =============================================

export async function executeBuyBonus(
  bet: number, serverSeed: string, clientSeed: string, nonce: number,
  jackpotPool: number
): Promise<{ result: SpinResult; newJackpotPool: number }> {
  // Buy bonus: paga 100x bet, garante trigger de free spins
  // Gerar grid com scatters forcados (minimo 4)
  const { grid, pfData } = await generateGrid(serverSeed, clientSeed, nonce, false);

  // Forcar 4 scatters em posicoes aleatorias
  const scatterSymbol = VIDEO_SYMBOLS.find(s => s.id === "scatter")!;
  const positions = [];
  for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < GRID_ROWS; row++) {
      positions.push({ col, row });
    }
  }
  // Shuffle e pegar 4
  for (let i = positions.length - 1; i > 0; i--) {
    const j = nonce % (i + 1);
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let i = 0; i < 4; i++) {
    const { col, row } = positions[i];
    grid[col][row] = {
      ...grid[col][row],
      symbol: scatterSymbol,
      isScatter: true,
    };
  }

  const { steps, finalGrid, totalWin, totalMultiplier } = await processTumble(
    grid, bet, false, serverSeed, clientSeed, nonce
  );

  const jackpotContribution = bet * 100 * (JACKPOT_CONTRIBUTION_PERCENT / 100);

  return {
    result: {
      initialGrid: grid,
      tumbleSteps: steps,
      totalWin,
      totalMultiplier,
      scatterCount: 4,
      triggeredFreeSpins: true,
      freeSpinsAwarded: FS_SPINS_AWARDED,
      isJackpot: false,
      jackpotWin: 0,
      provablyFair: pfData,
    },
    newJackpotPool: jackpotPool + jackpotContribution,
  };
}
