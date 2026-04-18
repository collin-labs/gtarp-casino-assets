# CONVERSA 4 — V0 GERA TELAS 8-10 — SLOT MACHINE (#2)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/2.SLOT-MACHINE/6.PROMPT-V0-SLOT-MACHINE-PARTE-3-ADENDO.md`

Continue SlotsGame.tsx com Telas 8, 9 e 10 (modais).

TELA 8 — PAYTABLE: Modal com simbolos + payouts. Icons de /assets/games/slots/symbols/ e /classic/. Payouts por tier (8-12 OAK). Botao fechar.

TELA 9 — HISTORICO + PROVABLY FAIR: 2 abas. Historico: 20 rounds mock. PF: server seed hash + client seed input + verificar. Icons: icon-history.png, icon-provably-fair.png, icon-copy.png.

TELA 10 — BUY BONUS: Modal confirmacao. scatter.png 64px no topo, custo bet×100, botoes CONFIRMAR/CANCELAR.

Booleans: showPaytable, showHistory, showBuyBonus. AnimatePresence. Paths exatos.
