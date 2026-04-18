# CONVERSA 2 — V0 GERA TELAS 1-4 — BLACKJACK (#4)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/4.BLACKJACK/6.PROMPT-V0-BLACKJACK-PARTE-1.md` (T1-T4)
- `student/estudo-dos-jogos/4.BLACKJACK/7.CSS-COMPONENTES-BLACKJACK-PARTE-1.md`
- `student/estudo-dos-jogos/4.BLACKJACK/6.PROMPT-V0-BLACKJACK-PARTE-3-ADENDO.md` (mock+tooltips)

Gere BlackjackGame.tsx com Telas 1-4. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — BETTING: Mesa com felt-texture.png. Areas de aposta circulares. Chip selector com os 6 chips (chip-1 a chip-1000) de /assets/games/blackjack/. Botao DEAL verde. Header: voltar + titulo + saldo.

TELA 2 — PLAYER TURN: Cartas do jogador (face up) e dealer (1 up, 1 card-back.png). Total do jogador em badge. 5 botoes acao: HIT (icon-hit.png), STAND (icon-stand.png), DOUBLE (icon-double.png), SPLIT, INSURANCE (icon-insurance.png). Card flip animation (rotateY 0→180deg, backfaceVisibility hidden).

TELA 3 — INSURANCE MODAL: Overlay quando dealer mostra Ás. Timer 10s. "Seguro? Paga 2:1 se dealer tiver BJ." Botoes ACEITAR/RECUSAR.

TELA 4 — SPLIT: 2+ maos lado a lado. Indicador visual de mao ativa (borda dourada pulsante). Controles por mao.

Todos assets de /assets/games/blackjack/ — EXISTEM.
