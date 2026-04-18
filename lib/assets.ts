// Blackout Casino — Mapeamento de Assets (v3 — Doc 10)
// Paths relativos a public/assets/
// 29/03/2026 — Nova estrutura shared/, fix .png.png, icons padronizados

const BASE = "/assets";

// UI do Painel (shared/ui/)
export const UI = {
  bg: `${BASE}/shared/ui/bg-casino.png`,
  dock: `${BASE}/shared/ui/MENU-DOURADO-MODELO2-SEM-TEXTO.png`,
  dockComTexto: `${BASE}/shared/ui/MENU-DOURADO-MODELO2-COM-TEXTO.png`,
  letreiro: `${BASE}/shared/ui/LETREIRO.png`,
  btnActive: `${BASE}/shared/ui/btn-jogar-ativo.png`,
  btnDisabled: `${BASE}/shared/ui/btn-jogar-desativo.png`,
  flagBR: `${BASE}/shared/ui/pais-brasil.png`,
  flagEN: `${BASE}/shared/ui/pais-eua.png`,
  logo4x2: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP-CASINO-LOGO-4-2.png`,
  logo1x1: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP-CASINO-logo-1-1.png`,
  logoIcone: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP-CASINO-LOGO-4-2-ICONE.png`,
  logoTexto: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP-CASINO-LOGO-4-2-TEXTO.png`,
};

// Icons do painel (shared/ui/)
export const PANEL_ICONS = {
  close: `${BASE}/shared/ui/icon-close.png`,
  deposit: `${BASE}/shared/ui/icon-deposit.png`,
  notification: `${BASE}/shared/ui/icon-notification.png`,
  arrowLeft: `${BASE}/shared/ui/icon-arrow-left.png`,
  arrowRight: `${BASE}/shared/ui/icon-arrow-right.png`,
  tabCassino: `${BASE}/shared/ui/icon-tab-cassino.png`,
  tabArcade: `${BASE}/shared/ui/icon-tab-arcade.png`,
  tabPvp: `${BASE}/shared/ui/icon-tab-pvp.png`,
  tabEvents: `${BASE}/shared/ui/icon-tab-events.png`,
  tabShop: `${BASE}/shared/ui/icon-tab-shop.png`,
};

// Badges (shared/ui/)
export const BADGES = {
  vipGold: `${BASE}/shared/ui/badge-vip-gold.png`,
  vipBlackout: `${BASE}/shared/ui/badge-vip-blackout.png`,
  badgeNew: `${BASE}/shared/ui/badge-new.png`,
  badgeHot: `${BASE}/shared/ui/badge-hot.png`,
};

// Icons compartilhados entre jogos (shared/icons/)
export const SHARED_ICONS = {
  soundOn: `${BASE}/shared/icons/icon-sound-on.png`,
  soundOff: `${BASE}/shared/icons/icon-sound-off.png`,
  soundMute: `${BASE}/shared/icons/icon-sound-mute.png`,
  provablyFair: `${BASE}/shared/icons/icon-provably-fair.png`,
  history: `${BASE}/shared/icons/icon-history.png`,
  copy: `${BASE}/shared/icons/icon-copy.png`,
  info: `${BASE}/shared/icons/icon-info.png`,
  gcoin: `${BASE}/shared/icons/icon-gcoin.png`,
  check: `${BASE}/shared/icons/icon-check.png`,
  settings: `${BASE}/shared/icons/icon-settings.png`,
  autoBet: `${BASE}/shared/icons/icon-auto-bet.png`,
  auto: `${BASE}/shared/icons/icon-auto.png`,
  manual: `${BASE}/shared/icons/icon-manual.png`,
  cashout: `${BASE}/shared/icons/icon-cashout.png`,
  turbo: `${BASE}/shared/icons/icon-turbo.png`,
  random: `${BASE}/shared/icons/icon-random.png`,
  paytable: `${BASE}/shared/icons/icon-paytable.png`,
  rules: `${BASE}/shared/icons/icon-rules.png`,
  jackpot: `${BASE}/shared/icons/icon-jackpot.png`,
  mode: `${BASE}/shared/icons/icon-mode.png`,
  insurance: `${BASE}/shared/icons/icon-insurance.png`,
  newHand: `${BASE}/shared/icons/icon-new-hand.png`,
  cardsSpread: `${BASE}/shared/icons/icon-cards-spread.png`,
  chipStack: `${BASE}/shared/icons/icon-chip-stack.png`,
};

// Assets exclusivos por jogo: games/{jogo}/{arquivo}
export function gameAssetPath(game: string, file: string): string {
  return `${BASE}/games/${game}/${file}`;
}

// Mapa ID -> arquivo na pasta image-para-cards
const CARD_FILES: Record<number, string> = {
  1:  "1.CRASH-IMAGE-1152_768.png",
  2:  "2.SLOT-MACHINE-IMAGE-1344_576.png",
  3:  "3.MINES-IMAGE-1152_768.png",
  4:  "4.BLACKJACK-IMAGE-1152_768.png",
  5:  "5.ROULETTE-IMAGE-1152_768.png",
  6:  "6.POKER-IMAGE-1152_768.png",
  7:  "7.DICE-IMAGE-1152_768.png",
  8:  "8.PLINKO-IMAGE-1152_768.png",
  9:  "9.ANIMALGAME-IMAGE-CARD-1024_1024.png",
  10: "10.BRAZILROULETTE-IMAGE-730_130.png",
  11: "11.CASEBATTLE-IMAGE-768_1024.png",
  12: "12.COINFLIP-IMAGE-768_1024.png",
  13: "13.JACKPOT-IMAGE-768_1024.png",
  14: "14.CASES-IMAGE-1344_576.png",
  15: "15.UPGRADE-IMAGE-1344_576.png",
  16: "16.MARKETPLACE-IMAGE-1344_576.png",
  17: "17.INVENTORY-IMAGE-1344_576.png",
  18: "18.LOTTERY-IMAGE-768_1024.png",
  19: "19.DAILYFREE-IMAGE-768_1024.png",
  20: "20.GIVEAWAYS-IMAGE-768_1024.png",
  21: "21.BINGO-IMAGE-730_130.png",
  22: "22.POOLGAME-IMAGE-1024_1024.png",
};

// Card para o grid (image-para-cards/)
export function cardPath(id: number, _name: string): string {
  const file = CARD_FILES[id];
  if (!file) return `${BASE}/image-para-cards/${id}.UNKNOWN.png`;
  return `${BASE}/image-para-cards/${file}`;
}

// Logo BR (logos-br-para-cards/)
export function logoBRPath(id: number, name: string): string {
  return `${BASE}/logos-br-para-cards/${id}.LOGO-BR-${name}.png`;
}

// Logo IN (logos-in-para-cards/)
export function logoINPath(id: number, name: string): string {
  return `${BASE}/logos-in-para-cards/${id}.LOGO-IN-${name}.png`;
}

// Imagem dourada
export function goldPath(id: number, name: string): string {
  return `${BASE}/image-background-transparent/GTARP-CASINO-IMAGEM-DOURADA/${id}.IMAGEM-DOURADA-${name}.png`;
}

// Imagem com pedestal
const PEDESTAL_NO_IMAGE: Set<number> = new Set([16, 17, 18]);
export function pedestalPath(id: number, name: string): string {
  const suffix = PEDESTAL_NO_IMAGE.has(id) ? "-NO-IMAGE" : "";
  return `${BASE}/image-para-hero/GTARP-CASINO-IMAGEM-COM-PEDESTAL/${id}.${name}-IMAGEM-COM-PEDESTAL${suffix}.png`;
}

// Video hover por jogo (videos/hover/)
const HOVER_VIDEO_FILES: Record<number, string> = {
  1:  "1.crash.webm",
  2:  "2.slot.webm",
  3:  "3.mines.webm",
  4:  "4.blackjack.webm",
  5:  "5.roulette.webm",
  6:  "6.poker.webm",
  7:  "7.dice.webm",
  8:  "8.plinko.webm",
  9:  "9.bichos.webm",
  10: "10.brasilian-roulette.webm",
  11: "11.case-battle.webm",
  12: "12.coinflip.webm",
  13: "13.jackpot.webm",
  14: "14.cases.webm",
  15: "15.upgrade.webm",
  16: "16.marketplace.webm",
  17: "17.inventory.webm",
  18: "18.loteria.webm",
  19: "19.dailyfree.webm",
  20: "20.giveaways.webm",
  21: "21.bingo.webm",
  22: "22.poolgame.webm",
};

export function hoverVideoPath(id: number): string {
  const file = HOVER_VIDEO_FILES[id];
  if (!file) return "";
  return `${BASE}/videos/hover/${file}`;
}

// Video hero por jogo (videos/hero/) — composicao propria pro hero
const HERO_VIDEO_FILES: Record<number, string> = {
  5:  "5.roulette.webm",
  9:  "9.bichos.webm",
};

export function heroVideoPath(id: number): string {
  const file = HERO_VIDEO_FILES[id];
  if (!file) return "";
  return `${BASE}/videos/hero/${file}`;
}
