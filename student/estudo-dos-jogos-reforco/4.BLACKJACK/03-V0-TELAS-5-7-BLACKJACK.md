# CONVERSA 3 — V0 GERA TELAS 5-7 — BLACKJACK (#4)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/4.BLACKJACK/6.PROMPT-V0-BLACKJACK-PARTE-2.md` (T5-T7)
- `student/estudo-dos-jogos/4.BLACKJACK/7.CSS-COMPONENTES-BLACKJACK-PARTE-2.md`

Continue BlackjackGame.tsx com Telas 5-7.

TELA 5 — DEALER TURN: Dealer revela carta oculta (flip animation). Dealer compra ate 17+. Controles do jogador dimmed (opacity 0.4, pointerEvents none). Cada carta nova com stagger delay.

TELA 6 — RESULTADO (5 variantes):
- WIN: overlay verde, "+X GC" countup, confetti dourado
- LOSE: overlay vermelho sutil
- PUSH: overlay dourado, "EMPATE" / "PUSH", aposta devolvida
- BLACKJACK!: overlay especial, "BLACKJACK!" grande com shimmer, paga 3:2
- BUST: overlay vermelho, "ESTOUROU!" / "BUST!", >21 mostrado
Botao NOVA MAO (icon-new-hand.png) em todas variantes.

TELA 7 — HISTORY + PROVABLY FAIR:
Modal com 2 abas. Historico: ultimas 20 maos. PF: seeds + hash + verificar.
Icons: icon-history.png, icon-provably-fair.png, icon-copy.png de /assets/shared/icons/.
