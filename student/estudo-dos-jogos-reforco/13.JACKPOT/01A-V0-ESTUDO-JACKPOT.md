# CONVERSA 1 — V0 ESTUDO — JACKPOT (#13)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Jackpot para o Blackout Casino (FiveM). PvP pot multi-player — 2 a 10 jogadores depositam GCoins num pot, donut chart mostra fatias proporcionais, roda gira pra escolher vencedor. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/13.JACKPOT/2.GUIA-DO-JOGO-JACKPOT-PARTE-1.md`
- `student/estudo-dos-jogos/13.JACKPOT/2.GUIA-DO-JOGO-JACKPOT-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/13.JACKPOT/2.GUIA-DO-JOGO-JACKPOT-PARTE-3-ADENDO.md`
- `student/estudo-dos-jogos/13.JACKPOT/8.BIBLIOTECA-IMAGENS-JACKPOT-PARTE-1.md`
- `student/estudo-dos-jogos/13.JACKPOT/8.BIBLIOTECA-IMAGENS-JACKPOT-PARTE-2.md`

Navegue e confirme shared icons e UI existem.

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function JackpotGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion. Donut via CSS conic-gradient. Spin via CSS rotate.

## PATHS
Game: /assets/games/jackpot/ (donut-frame-gold.png, pointer-gold.png)
Logos: /assets/logos-br-para-cards/13.LOGO-BR-JACKPOT.png, logos-in/13.LOGO-IN-JACKPOT.png
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-settings, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## PALETA DE 10 CORES JOGADORES
#FF6B6B coral, #4ECDC4 turquesa, #45B7D1 azul, #96CEB4 menta, #FFEAA7 amarelo, #DDA0DD lavanda, #FF8C42 laranja, #6C5CE7 roxo, #A8E6CF verde claro, #FF85A1 rosa

## 5 TELAS
1. LOBBY — Deposito + donut chart ao vivo + lista jogadores + timer
2. SPINNING — Donut inteiro gira (rotate CSS), ponteiro fixo no topo, desacelera
3. RESULTADO — Vencedor com confetti, pot total, percentual
4. HISTORY — Ultimas rodadas
5. PROVABLY FAIR — Seeds + hash + verificar

NAO gere codigo. Confirme que leu, entendeu PvP pot, entendeu donut chart.
