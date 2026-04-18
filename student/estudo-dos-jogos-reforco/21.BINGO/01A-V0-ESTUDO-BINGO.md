# CONVERSA 1 — V0 ESTUDO — BINGO (#21)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Bingo para o Blackout Casino (FiveM). Cartela 5×5 premium, globo com bolas, lucky numbers, wild ball, 8 patterns. Projeto importado.

## ESTUDE ANTES DE GERAR
- `student/estudo-dos-jogos/21.BINGO/2.GUIA-DO-JOGO-BINGO.md`
- `student/estudo-dos-jogos/21.BINGO/8.BIBLIOTECA-IMAGENS-BINGO-PARTE-1.md`
- `student/estudo-dos-jogos/21.BINGO/8.BIBLIOTECA-IMAGENS-BINGO-PARTE-2.md`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function BingoGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion

## PATHS
Game: /assets/bingo/patterns/ (8 pattern PNGs), /assets/bingo/icons/ (icon-wild-ball, icon-dab-marker, etc), /assets/bingo/badges/ (lucky-number, 1-to-go)
Icons shared: gcoin, provably-fair, history, sound-on/off, copy
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #00E676 green (marcado), #FF4444 red (1-to-go), #0A0A0A fundo
Colunas B=#4B69FF I=#FF4081 N=#00E676 G=#FFD700 O=#FF5722

## 10 TELAS
1. CARD SELECTOR — Escolher cartela + pattern + bet
2. SORTEIO NORMAL — Bola a bola, auto-dab na cartela
3. LUCKY NUMBER HIT — Flash dourado quando acerta lucky
4. WILD BALL — Bola verde especial (marca 1 numero gratis)
5. 1-TO-GO — Falta 1 numero (tensao maxima)
6. VITORIA — "B-I-N-G-O!" + confetti + premio
7. DERROTA — Feedback discreto
8. MEGA WIN — Full House ou premio >50x
9. HISTORY + PF — Modais
10. MOBILE — Adaptacoes 375px

NAO gere codigo. Confirme.
