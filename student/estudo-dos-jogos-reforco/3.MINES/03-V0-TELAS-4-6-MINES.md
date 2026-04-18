# CONVERSA 3 — V0 GERA TELAS 4-6 — MINES (#3)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/3.MINES/6.PROMPT-V0-MINES-PARTE-1.md` (Telas 4-6)
- `student/estudo-dos-jogos/3.MINES/7.CSS-COMPONENTES-MINES-PARTE-2.md`
- `student/estudo-dos-jogos/3.MINES/6.PROMPT-V0-MINES-PARTE-2-ADENDO.md` (mock JSON)

Continue MinesGame.tsx com Telas 4-6.

TELA 4 — BUST (Bomba): Tile clicada revela bomb.png com shake + flash vermelho + escala 1.3. Grid revela todas posicoes. Overlay vermelho: "BOOM!" Cinzel 900, screen shake (x[-5,5,-3,3,0] 0.5s). Botao NOVA RODADA.

TELA 5 — PROVABLY FAIR: Modal com icon-provably-fair.png. Server Seed Hash (mono truncado + icon-copy.png). Client Seed input editavel. Nonce. Botao VERIFICAR verde. Explicacao curta.

TELA 6 — HISTORICO: Modal com lista de rodadas mock. Cada row: rodada#, aposta, minas, gems, multi, resultado (verde WIN / vermelho BUST). Botao "Ver PF" por rodada. icon-history.png no topo.

Booleans: showProvablyFair, showHistory. AnimatePresence. Paths exatos.
