// Slot Machine Constants — Blackout Casino GTARP
// Simbolos, pesos, payouts, config padrao

import type { SlotSymbol, ClassicSymbol, SlotsConfig } from "./SlotsTypes";

// === VIDEO SLOT — 11 simbolos (9 regulares + scatter + multiplier) ===

export const VIDEO_SYMBOLS: SlotSymbol[] = [
  {
    id: "crown", path: "/assets/games/slots/symbols/crown.png",
    tier: "premium", color: "#FFD700", weight: 3,
    payouts: { 8: 10, 9: 15, 10: 25, 11: 40, 12: 50 },
  },
  {
    id: "ring", path: "/assets/games/slots/symbols/ring.png",
    tier: "premium", color: "#D4A843", weight: 4,
    payouts: { 8: 8, 9: 12, 10: 20, 11: 30, 12: 40 },
  },
  {
    id: "hourglass", path: "/assets/games/slots/symbols/hourglass.png",
    tier: "premium", color: "#CB9B51", weight: 4,
    payouts: { 8: 5, 9: 8, 10: 12, 11: 20, 12: 25 },
  },
  {
    id: "chalice", path: "/assets/games/slots/symbols/chalice.png",
    tier: "premium", color: "#8B6914", weight: 5,
    payouts: { 8: 3, 9: 5, 10: 8, 11: 12, 12: 15 },
  },
  {
    id: "ruby", path: "/assets/games/slots/symbols/ruby.png",
    tier: "gem", color: "#FF1744", weight: 8,
    payouts: { 8: 1.5, 9: 2.5, 10: 4, 11: 6, 12: 8 },
  },
  {
    id: "sapphire", path: "/assets/games/slots/symbols/sapphire.png",
    tier: "gem", color: "#1E88E5", weight: 8,
    payouts: { 8: 1, 9: 2, 10: 3, 11: 5, 12: 5 },
  },
  {
    id: "emerald", path: "/assets/games/slots/symbols/emerald.png",
    tier: "gem", color: "#43A047", weight: 9,
    payouts: { 8: 0.8, 9: 1.5, 10: 2.5, 11: 4, 12: 4 },
  },
  {
    id: "amethyst", path: "/assets/games/slots/symbols/amethyst.png",
    tier: "gem", color: "#8E24AA", weight: 9,
    payouts: { 8: 0.5, 9: 1, 10: 2, 11: 3, 12: 3 },
  },
  {
    id: "topaz", path: "/assets/games/slots/symbols/topaz.png",
    tier: "gem", color: "#FF8F00", weight: 10,
    payouts: { 8: 0.25, 9: 0.5, 10: 1, 11: 2, 12: 2 },
  },
  {
    id: "scatter", path: "/assets/games/slots/symbols/scatter.png",
    tier: "special", color: "#FFD700", weight: 2,
    payouts: { 4: 3, 5: 5, 6: 100 },
  },
  {
    id: "multiplier_orb", path: "/assets/games/slots/symbols/multiplier_orb.png",
    tier: "special", color: "#FFD700", weight: 0, // so aparece em free spins
    payouts: {},
  },
];

// Pesos totais sem multiplier (base game)
export const TOTAL_WEIGHT_BASE = VIDEO_SYMBOLS
  .filter(s => s.id !== "multiplier_orb")
  .reduce((sum, s) => sum + s.weight, 0); // 62

// Pesos totais com multiplier (free spins) — multiplier_orb weight = 3 em FS
export const MULTIPLIER_ORB_WEIGHT_FS = 3;
export const TOTAL_WEIGHT_FS = TOTAL_WEIGHT_BASE + MULTIPLIER_ORB_WEIGHT_FS; // 65

// Multiplicadores possiveis
export const MULTIPLIER_VALUES_BASE = [2, 3, 5];
export const MULTIPLIER_VALUES_FS = [2, 3, 5, 8, 10, 15, 25, 50, 100];

// Grid dimensions
export const GRID_COLS = 6;
export const GRID_ROWS = 5;
export const GRID_SIZE = GRID_COLS * GRID_ROWS; // 30

// Scatter pays: minimo 8 simbolos iguais anywhere
export const MIN_SCATTER_PAYS = 8;

// Free spins trigger
export const FS_SCATTER_REQUIRED = 4;
export const FS_SPINS_AWARDED = 10;
export const FS_RETRIGGER_SPINS = 5;

// Win tiers
export const WIN_TIER_BIG = 5;
export const WIN_TIER_MEGA = 50;
export const WIN_TIER_JACKPOT = 500;

// Bet
export const MIN_BET = 1;
export const MAX_BET = 500;
export const BET_STEPS = [1, 2, 5, 10, 25, 50, 100, 250, 500];
export const ANTE_BET_MODIFIER = 1.25;
export const BUY_BONUS_MULTIPLIER = 100;

// Jackpot
export const JACKPOT_CONTRIBUTION_PERCENT = 1.5;
export const JACKPOT_INITIAL = 10000;

// Max win cap
export const MAX_WIN_MULTIPLIER = 5000;

// === CLASSIC SLOT — 7 simbolos ===

export const CLASSIC_SYMBOLS: ClassicSymbol[] = [
  { id: "seven", path: "/assets/games/slots/classic/seven.png", color: "#FF1744", weight: 2, payout3: 100, payout2: 10 },
  { id: "bar", path: "/assets/games/slots/classic/bar.png", color: "#D4A843", weight: 4, payout3: 40, payout2: 5 },
  { id: "diamond", path: "/assets/games/slots/classic/diamond.png", color: "#00E5FF", weight: 5, payout3: 25, payout2: 3 },
  { id: "bell", path: "/assets/games/slots/classic/bell.png", color: "#FFD700", weight: 6, payout3: 15, payout2: 2 },
  { id: "cherry", path: "/assets/games/slots/classic/cherry.png", color: "#F44336", weight: 8, payout3: 10, payout2: 1.5 },
  { id: "lemon", path: "/assets/games/slots/classic/lemon.png", color: "#FFEB3B", weight: 10, payout3: 5, payout2: 1 },
  { id: "star", path: "/assets/games/slots/classic/star.png", color: "#FFD700", weight: 10, payout3: 5, payout2: 1 },
];

export const CLASSIC_TOTAL_WEIGHT = CLASSIC_SYMBOLS.reduce((sum, s) => sum + s.weight, 0); // 45
export const CLASSIC_PAYLINES = 3; // top, center, bottom
export const CLASSIC_REEL_SIZE = 3; // simbolos visiveis por reel

// === CONFIG PADRAO ===

export const DEFAULT_CONFIG: SlotsConfig = {
  rtpTarget: 96.5,
  volatility: "high",
  minBet: MIN_BET,
  maxBet: MAX_BET,
  buyBonusMultiplier: BUY_BONUS_MULTIPLIER,
  anteBetModifier: ANTE_BET_MODIFIER,
  freeSpinsCount: FS_SPINS_AWARDED,
  freeSpinsScatterRequired: FS_SCATTER_REQUIRED,
  multiplierRangeBase: MULTIPLIER_VALUES_BASE,
  multiplierRangeFS: MULTIPLIER_VALUES_FS,
  jackpotContributionPercent: JACKPOT_CONTRIBUTION_PERCENT,
  maxWinMultiplier: MAX_WIN_MULTIPLIER,
};

// === SONS ===

export const SOUND_PATHS: Record<string, string> = {
  spin_start: "/assets/sounds/slots/spin_start.mp3",
  reel_stop: "/assets/sounds/slots/reel_stop.mp3",
  win_small: "/assets/sounds/slots/win_small.mp3",
  win_medium: "/assets/sounds/slots/win_medium.mp3",
  win_big: "/assets/sounds/slots/win_big.mp3",
  win_mega: "/assets/sounds/slots/win_mega.mp3",
  tumble_drop: "/assets/sounds/slots/tumble_drop.mp3",
  tumble_clear: "/assets/sounds/slots/tumble_clear.mp3",
  multiplier_hit: "/assets/sounds/slots/multiplier_hit.mp3",
  scatter_land: "/assets/sounds/slots/scatter_land.mp3",
  free_spins_trigger: "/assets/sounds/slots/free_spins_trigger.mp3",
  button_click: "/assets/sounds/slots/button_click.mp3",
  bet_change: "/assets/sounds/slots/bet_change.mp3",
  lever_pull: "/assets/sounds/slots/lever_pull.mp3",
  jackpot_hit: "/assets/sounds/slots/jackpot_hit.mp3",
  buy_bonus: "/assets/sounds/slots/buy_bonus.mp3",
};
