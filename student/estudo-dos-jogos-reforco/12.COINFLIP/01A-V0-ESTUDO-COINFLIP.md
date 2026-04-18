# CONVERSA 1 — V0 ESTUDO — COINFLIP (#12)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Coinflip para o Blackout Casino (FiveM). PvP 1v1 — dois jogadores, moeda 3D, cara ou coroa, quem acertar vence. Lobby com salas. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/12.COINFLIP/2.GUIA-DO-JOGO-COINFLIP.md`
- `student/estudo-dos-jogos/12.COINFLIP/8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-1.md`
- `student/estudo-dos-jogos/12.COINFLIP/8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-2.md`

Navegue e confirme shared icons e UI existem.

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function CoinflipGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion. Moeda gira em 3D (rotateY com perspective).

## PATHS
Game: /assets/games/coinflip/ (coin-heads.png, coin-tails.png, coin-heads-mini.png, coin-tails-mini.png)
Logos: /assets/logos-br-para-cards/12.LOGO-BR-CONIFLIP.png, logos-in/12.LOGO-IN-CONIFLIP.png
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Cara (Heads): dourado #FFD700 (aguia/sol)
Coroa (Tails): prata #C0C0C0 (escudo/coroa)

## 8 TELAS
1. LOBBY — Grid de salas abertas, filtros, botao CRIAR SALA
2. CRIAR SALA — Modal: escolher lado (cara/coroa), valor aposta, criar
3. ENTRAR SALA — Modal: confirmar entrada, lado automatico (oposto), valor
4. FLIP — 2 jogadores lado a lado + moeda 3D central girando + countdown
5. RESULTADO — Vencedor vs perdedor, lado que caiu, premio
6. HISTORICO — Ultimos flips
7. LEADERBOARD — Ranking por wins/profit
8. PROVABLY FAIR — Seeds + hash + verificar

NAO gere codigo. Confirme que leu, entendeu a mecanica PvP, entendeu regras.
