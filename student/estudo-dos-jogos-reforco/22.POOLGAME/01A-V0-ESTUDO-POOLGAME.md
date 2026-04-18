# CONVERSA 1 — V0 ESTUDO — POOL GAME / SINUCA (#22)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Pool Game para o Blackout Casino (FiveM). Sinuca PvP — 8-ball/9-ball, mesa Canvas 2D com fisica Matter.js, taco com mira, loja de tacos. Projeto importado.

## ESTUDE ANTES DE GERAR
- `student/estudo-dos-jogos/22.POOLGAME/2.GUIA-DO-JOGO-POOL-GAME-PARTE-1.md`
- `student/estudo-dos-jogos/22.POOLGAME/2.GUIA-DO-JOGO-POOL-GAME-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/22.POOLGAME/8.BIBLIOTECA-IMAGENS-POOL-GAME-PARTE-1.md`
- `student/estudo-dos-jogos/22.POOLGAME/8.BIBLIOTECA-IMAGENS-POOL-GAME-PARTE-2.md`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function PoolGame({ onBack, lang, playerId, initialBalance })
5. Canvas 2D pra mesa/bolas/taco. Framer Motion pra UI.

## NOTA TECNICA
Mesa, bolas e taco sao CANVAS 2D (Matter.js physics). NAO PNGs.
PNGs dos tacos (cue-classic/gold/carbon/neon) sao APENAS pra Cue Shop UI.

## PATHS
Tacos (shop): /assets/pool/cues/cue-classic.png, cue-gold.png, cue-carbon.png, cue-neon.png
Icons: /assets/pool/icons/ (rack-triangle, sound, provably-fair, history, settings, close, info, spin, power, aim, rematch)
Icons shared: gcoin + demais
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #00E676 green, #0A0A0A fundo
Mesa felt: #1B5E20, Rails: #3E2723, Pockets: #000000
Bolas: 1=amarelo 2=azul 3=vermelho 4=roxo 5=laranja 6=verde 7=marrom 8=preto

## 5 TELAS
1. LOBBY — Modos (8-ball/9-ball/straight) + tiers + matchmaking
2. MESA+AIMING — Partida: mesa Canvas, taco, mira, barra forca, spin indicator
3. SHOT MOVING — Bolas em movimento apos tacada (fisica)
4. VICTORY — Resultado PvP, vencedor celebrado
5. CUE SHOP — Loja de tacos (4 tacos com stats)

NAO gere codigo. Confirme que leu, entendeu que mesa eh Canvas 2D.
