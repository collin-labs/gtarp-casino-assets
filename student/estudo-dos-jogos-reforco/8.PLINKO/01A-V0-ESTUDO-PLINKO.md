# CONVERSA 1 — V0 ESTUDO — PLINKO (#8)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Plinko para o Blackout Casino (FiveM). Bola cai por grid de pegs, pousa em slot multiplicador. 3 niveis de risco. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/8.PLINKO/2.GUIA-DO-JOGO-PLINKO.md`
- `student/estudo-dos-jogos/8.PLINKO/2.GUIA-DO-JOGO-PLINKO-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/8.PLINKO/8.BIBLIOTECA-IMAGENS-PLINKO-PARTE-1.md`
- `student/estudo-dos-jogos/8.PLINKO/8.BIBLIOTECA-IMAGENS-PLINKO-PARTE-2.md`

Navegue e confirme:
- `public/assets/shared/icons/` — 24 icones (EXISTEM)
- `public/assets/shared/ui/` — bg-casino.png (EXISTE)

## NOTA TECNICA CRITICA
O Plinko NAO usa PNGs de game. TUDO eh CSS/Canvas:
- Pegs: circulos dourados (~8px) em grid triangular (8-16 rows conforme risco)
- Bola: circulo (~12px) dourado com glow, fisica de bounce entre pegs
- Slots: divs coloridos na base com multiplicadores (0.2x ate 1000x)
- Cores dos slots: gradiente verde(centro)→amarelo→laranja→vermelho(extremos)
- Animacao: Framer Motion ou Canvas 2D pra fisica da bola

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function PlinkoGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion + Canvas 2D pra fisica

## PATHS (shared — board eh CSS puro)
Icons: icon-gcoin, icon-provably-fair, icon-history, icon-auto-bet, icon-auto, icon-sound-on/off, icon-copy, icon-turbo, icon-random
UI: /assets/shared/ui/bg-casino.png
Logos: /assets/logos-br-para-cards/8.LOGO-BR-PLINKO.png, /assets/logos-in-para-cards/8.LOGO-IN-PLINKO.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Slots: verde #00E676 (centro, low multi) → amarelo #FFD700 → laranja #FF8C00 → vermelho #FF1744 (extremos, high multi)
Bola: #FFD700 com glow dourado
Pegs: #D4A843 com sutil glow

## 7 TELAS
1. IDLE — Board de pegs, slots na base, bet controls, seletor rows/risco, botao DROP
2. BALL DROPPING — Bola descendo, bouncing entre pegs (fisica)
3. RESULT — Bola pousa no slot, multiplicador revelado, payout
4. BIG WIN — Multiplicador >= 50x, overlay especial, confetti
5. PROVABLY FAIR — Modal seeds + hash + verificar
6. HISTORY — Modal com lista de drops
7. AUTOBET — Estado dentro dos controles (nao modal separado)

NAO gere codigo. Confirme que leu, entendeu que board eh CSS/Canvas, entendeu regras.
