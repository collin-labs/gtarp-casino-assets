// ═══════════════════════════════════════════════════════════════
// BLACKOUT CASINO — Mapeamento de Assets (v2 — Fase 3C)
// Paths relativos a public/assets/
// Atualizado: 04/03/2026 — Novos paths para cards e logos
// ═══════════════════════════════════════════════════════════════

const BASE = "/assets";

// ── UI & Brand (inalterado) ──────────────────────────────────
export const UI = {
  bg: `${BASE}/ui/FUNDO-PARA-PAINEL-FLUTUANTE/bg-casino.png`,
  bgAlt: `${BASE}/ui/FUNDO-PARA-PAINEL-FLUTUANTE/FUNDO-PARA-PAINEL-FLUTUANTE.png`,
  dock: `${BASE}/ui/IDEIA-DE-MENU/MENU-DOURADO-MODELO2-SEM-TEXTO.png`,
  dockComTexto: `${BASE}/ui/IDEIA-DE-MENU/MENU-DOURADO-MODELO2-COM-TEXTO.png`,
  letreiro: encodeURI(`${BASE}/ui/GTARP CASINO LETREIRO PARA TOPO/GTARP CASINO LETREIRO PARA TOPO.png`),
  btnActive: `${BASE}/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png`,
  btnDisabled: `${BASE}/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png`,
  flagBR: `${BASE}/ui/BANDEIRA-PAIS/pais-brasil.png`,
  flagEN: `${BASE}/ui/BANDEIRA-PAIS/pais-eua.png`,
  logo4x2: encodeURI(`${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP CASINO LOGO 4-2.png`),
  logo1x1: encodeURI(`${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP CASINO logo 1-1.png`),
};

// ── Mapa explícito: ID → nome do arquivo na pasta image-para-cards ──
// Cada imagem foi gerada no tamanho exato da posição no grid (WxH no nome)
const CARD_FILES: Record<number, string> = {
  1:  "1.CRASH-IMAGE-1152_768.png",
  2:  "2.SLOTS-IMAGE-1152_768.png",
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

// ── Card para o grid (NOVO — pasta image-para-cards) ─────────
export function cardPath(id: number, _name: string): string {
  const file = CARD_FILES[id];
  if (!file) return `${BASE}/image-para-cards/${id}.UNKNOWN.png`;
  return `${BASE}/image-para-cards/${file}`;
}

// ── Logo BR para cards/hero (NOVO — pasta logos-br-para-cards) ──
export function logoBRPath(id: number, name: string): string {
  return `${BASE}/logos-br-para-cards/${id}.LOGO-BR-${name}.png`;
}

// ── Logo IN para cards/hero (NOVO — pasta logos-in-para-cards) ──
export function logoINPath(id: number, name: string): string {
  return `${BASE}/logos-in-para-cards/${id}.LOGO-IN-${name}.png`;
}

// ── Imagem dourada grande — hero background (inalterado) ─────
export function goldPath(id: number, name: string): string {
  const ext = (id === 5 || id === 13) ? ".png.png" : ".png";
  return encodeURI(`${BASE}/image-background-transparent/GTARP CASINO IMAGEM DOURADA/${id}.IMAGEM-DOURADA-${name}${ext}`);
}

// ── Imagem com pedestal — hero carousel (inalterado) ─────────
export function pedestalPath(id: number, name: string): string {
  return encodeURI(`${BASE}/image-para-hero/GTARP CASINO IMAGEM COM PEDESTAL/${id}.${name}-IMAGEM-COM-PEDESTAL.png`);
}
