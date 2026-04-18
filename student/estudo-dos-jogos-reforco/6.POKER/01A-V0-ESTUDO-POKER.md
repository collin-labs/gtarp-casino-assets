# CONVERSA 1 — V0 ESTUDO — POKER (#6)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Poker para o Blackout Casino (FiveM). 2 modos: Caribbean Stud + Ultimate Texas Hold'em. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/6.POKER/2.GUIA-DO-JOGO-POKER.md`
- `student/estudo-dos-jogos/6.POKER/2.GUIA-DO-JOGO-POKER-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/6.POKER/8.BIBLIOTECA-IMAGENS-POKER-PARTE-1.md`
- `student/estudo-dos-jogos/6.POKER/8.BIBLIOTECA-IMAGENS-POKER-PARTE-2.md`

Navegue e confirme que existem:
- `public/assets/games/poker/` — card-back.png, chip.png, suit-hearts/diamonds/clubs/spades.png
- `public/assets/shared/icons/` — 24 icones (provably-fair, history, paytable, rules, mode, jackpot, sound, copy)
- `public/assets/shared/ui/` — bg-casino.png

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — TODAS imagens existem
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function PokerGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion. Card flip 3D (rotateY, perspective, backfaceVisibility).

## PATHS EXATOS
Game: /assets/games/poker/card-back.png, chip.png, suit-hearts.png, suit-diamonds.png, suit-clubs.png, suit-spades.png
Logos: /assets/logos-br-para-cards/6.LOGO-BR-POKER.png, /assets/logos-in-para-cards/6.LOGO-IN-POKER.png
Icons: icon-gcoin, icon-provably-fair, icon-history, icon-paytable, icon-rules, icon-mode, icon-jackpot, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Naipes: hearts #C62828, diamonds #C62828, clubs #1A1A1A, spades #1A1A1A

## 11 TELAS
1. MODE SELECT — Caribbean Stud vs Ultimate Texas Hold'em
2. CARIBBEAN BETTING — Ante + Side Bet
3. CARIBBEAN PLAYING — Fold/Raise decision
4. CARIBBEAN RESULT — Dealer revela
5. UTH BETTING — Hole cards + pre-flop decision
6. UTH COMMUNITY — Flop + Turn/River decisions
7. UTH SHOWDOWN — Dealer revela, resultado
8. WIN OVERLAY — 4 tiers
9. PAYTABLE — 2 tabs (Caribbean + UTH)
10. HISTORY + PROVABLY FAIR
11. SPECIAL COMPONENTS (hand rankings, side bet display)

NAO gere codigo. Confirme que leu, assets existem, entendeu regras.
