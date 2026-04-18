# CONVERSA 1 — V0 ESTUDO — BLACKJACK (#4)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Blackjack (Vinte e Um) para o Blackout Casino (FiveM). Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/4.BLACKJACK/2.GUIA-DO-JOGO-BLACKJACK.md`
- `student/estudo-dos-jogos/4.BLACKJACK/8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-1.md`
- `student/estudo-dos-jogos/4.BLACKJACK/8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-2.md`

Navegue e confirme que existem:
- `public/assets/games/blackjack/` — 14 arquivos (card-back, 6 chips, felt-texture, 6 icons)
- `public/assets/shared/icons/` — 24 icones
- `public/assets/shared/ui/` — bg-casino.png

## REGRAS ABSOLUTAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — TODAS imagens existem
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function BlackjackGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion para animacoes (card flip 3D via rotateY)

## PATHS EXATOS
Game (/assets/games/blackjack/):
card-back.png, felt-texture.png
chip-1.png, chip-5.png, chip-25.png, chip-100.png, chip-500.png, chip-1000.png
icon-hit.png, icon-stand.png, icon-double.png, icon-new-hand.png, icon-cards-spread.png, icon-chip-stack.png

Logos: /assets/logos-br-para-cards/4.LOGO-BR-BLACKJACK.png, /assets/logos-in-para-cards/4.LOGO-IN-BLACKJACK.png
Icons shared: icon-gcoin.png, icon-provably-fair.png, icon-history.png, icon-insurance.png, icon-sound-on.png, icon-sound-off.png, icon-copy.png
UI: /assets/shared/ui/bg-casino.png

TOTAL: 14 game + shared. TODAS EXISTEM.

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo, #0D4A1A felt verde escuro

## FUNDO: bg-casino.png + felt-texture.png na area da mesa

## 7 TELAS
1. BETTING — Mesa felt, areas de aposta, chip selector, botao DEAL
2. PLAYER TURN — Cartas jogador+dealer, 5 botoes (HIT/STAND/DOUBLE/SPLIT/INSURANCE)
3. INSURANCE MODAL — Overlay com timer, aceitar/recusar
4. SPLIT — 2+ maos lado a lado, indicador de mao ativa
5. DEALER TURN — Dealer revela carta, jogador observa (controles dim)
6. RESULTADO — 5 variantes (Win, Lose, Push, Blackjack!, Bust)
7. HISTORY + PROVABLY FAIR — Modais

NAO gere codigo. Confirme que leu, assets existem, entendeu regras.
