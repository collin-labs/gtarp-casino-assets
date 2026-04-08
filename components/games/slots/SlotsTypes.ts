// Slot Machine Types — Blackout Casino GTARP
// Tipagem completa para engine video + classic + provably fair

export type SymbolTier = "premium" | "gem" | "special";

export interface SlotSymbol {
  id: string;
  path: string;
  tier: SymbolTier;
  color: string;
  weight: number;
  payouts: Record<number, number>; // quantidade -> multiplicador (ex: 8 -> 1.5x)
}

export interface GridCell {
  symbol: SlotSymbol;
  row: number;
  col: number;
  isWinning: boolean;
  isDimmed: boolean;
  isScatter: boolean;
  isMultiplier: boolean;
  multiplierValue: number;
}

export type Grid = GridCell[][];

export interface WinCluster {
  symbolId: string;
  count: number;
  positions: Array<{ row: number; col: number }>;
  payout: number;
}

export interface TumbleStep {
  winClusters: WinCluster[];
  removedPositions: Array<{ row: number; col: number }>;
  newSymbols: Array<{ row: number; col: number; symbol: SlotSymbol }>;
  multiplierHits: Array<{ row: number; col: number; value: number }>;
  totalWin: number;
}

export interface SpinResult {
  initialGrid: Grid;
  tumbleSteps: TumbleStep[];
  totalWin: number;
  totalMultiplier: number;
  scatterCount: number;
  triggeredFreeSpins: boolean;
  freeSpinsAwarded: number;
  isJackpot: boolean;
  jackpotWin: number;
  provablyFair: ProvablyFairData;
}

export interface FreeSpinsState {
  active: boolean;
  remaining: number;
  total: number;
  runningMultiplier: number;
  totalWin: number;
  spinsPlayed: SpinResult[];
}

export interface ProvablyFairData {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  serverSeed?: string; // revelado apos sessao
}

// Classic Slot
export interface ClassicSymbol {
  id: string;
  path: string;
  color: string;
  weight: number;
  payout3: number; // 3 iguais
  payout2: number; // 2 iguais
}

export interface ClassicReel {
  symbols: ClassicSymbol[];
  currentIndex: number;
}

export interface ClassicResult {
  reels: [ClassicSymbol, ClassicSymbol, ClassicSymbol]; // centro
  visibleReels: [ClassicSymbol[], ClassicSymbol[], ClassicSymbol[]]; // 3 por reel
  paylineWins: ClassicPaylineWin[];
  totalWin: number;
  provablyFair: ProvablyFairData;
}

export interface ClassicPaylineWin {
  payline: number; // 0=top, 1=center, 2=bottom
  symbolId: string;
  count: number;
  payout: number;
}

// Config admin
export interface SlotsConfig {
  rtpTarget: number;
  volatility: "low" | "medium" | "high";
  minBet: number;
  maxBet: number;
  buyBonusMultiplier: number;
  anteBetModifier: number;
  freeSpinsCount: number;
  freeSpinsScatterRequired: number;
  multiplierRangeBase: number[];
  multiplierRangeFS: number[];
  jackpotContributionPercent: number;
  maxWinMultiplier: number;
}

// Win tier para overlay
export type WinTier = "normal" | "big" | "mega" | "jackpot";

export function getWinTier(ratio: number): WinTier {
  if (ratio >= 500) return "jackpot";
  if (ratio >= 50) return "mega";
  if (ratio >= 5) return "big";
  return "normal";
}

// History
export interface SpinHistoryEntry {
  id: number;
  timestamp: number;
  mode: "video" | "classic";
  bet: number;
  totalWin: number;
  multiplier: number;
  tumbles: number;
  freeSpins: boolean;
  provablyFair: ProvablyFairData;
}

// Estado do jogo
export interface SlotsGameState {
  mode: "video" | "classic";
  bet: number;
  anteBet: boolean;
  turboMode: boolean;
  autoPlay: boolean;
  autoPlayCount: number;
  balance: number;
  jackpotPool: number;
  freeSpins: FreeSpinsState;
  history: SpinHistoryEntry[];
  currentSpin: SpinResult | null;
  clientSeed: string;
  nonce: number;
}
