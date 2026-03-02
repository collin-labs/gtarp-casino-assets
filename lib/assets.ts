// ═══════════════════════════════════════════════════════
// BLACKOUT CASINO — Mapeamento de Assets
// Paths relativos a public/assets/
// ═══════════════════════════════════════════════════════

const BASE = "/assets";

export const UI = {
  bg: `${BASE}/ui/FUNDO-PARA-PAINEL-FLUTUANTE/bg-casino.png`,
  bgAlt: `${BASE}/ui/FUNDO-PARA-PAINEL-FLUTUANTE/FUNDO-PARA-PAINEL-FLUTUANTE.png`,
  dock: `${BASE}/ui/IDEIA-DE-MENU/MENU-DOURADO-MODELO2-SEM-TEXTO.png`,
  dockComTexto: `${BASE}/ui/IDEIA-DE-MENU/MENU-DOURADO-MODELO2-COM-TEXTO.png`,
  letreiro: `${BASE}/ui/GTARP CASINO LETREIRO PARA TOPO/GTARP CASINO LETREIRO PARA TOPO.png`,
  btnActive: `${BASE}/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png`,
  btnDisabled: `${BASE}/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png`,
  flagBR: `${BASE}/ui/BANDEIRA-PAIS/pais-brasil.png`,
  flagEN: `${BASE}/ui/BANDEIRA-PAIS/pais-eua.png`,
  logo4x2: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP CASINO LOGO 4-2.png`,
  logo1x1: `${BASE}/brand/LOGO-BLACKOUT-CASINO/1-GTARP CASINO logo 1-1.png`,
};

// Gera path do card 500x500
export function cardPath(id: number, name: string): string {
  const ext = id === 13 ? ".png.png" : ".png";
  return `${BASE}/cards/IMAGENS-DOURADAS-PARA-CARD/${id}.${name}${ext}`;
}

// Gera path do logo BR do jogo
export function logoBRPath(id: number, name: string): string {
  const ext = (id === 5 || id === 13) ? ".png.png" : ".png";
  return `${BASE}/logos-br-para-hero/GTARP CASINO LOGOS (BR)/${id}.LOGO-BR-${name}${ext}`;
}

// Gera path do logo IN do jogo
export function logoINPath(id: number, name: string): string {
  const ext = (id === 5 || id === 13) ? ".png.png" : ".png";
  return `${BASE}/logos-in-para-hero/GTARP CASINO LOGOS (IN)/${id}.LOGO-IN-${name}${ext}`;
}

// Gera path da imagem dourada grande (hero)
export function goldPath(id: number, name: string): string {
  const ext = (id === 5 || id === 13) ? ".png.png" : ".png";
  return `${BASE}/image-background-transparent/GTARP CASINO IMAGEM DOURADA/${id}.IMAGEM-DOURADA-${name}${ext}`;
}

// Gera path da imagem com pedestal (hero alternativo)
export function pedestalPath(id: number, name: string): string {
  return `${BASE}/image-para-hero/GTARP CASINO IMAGEM COM PEDESTAL/${id}.${name}-IMAGEM-COM-PEDESTAL.png`;
}
