# CONVERSA 2 — V0 GERA TELAS 1-5 — CASES (#14)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/14.CASES/6.PROMPT-V0-CASES-PARTE-1.md` (T1-T5)
- `student/estudo-dos-jogos/14.CASES/7.CSS-COMPONENTES-CASES-PARTE-1.md`
- `student/estudo-dos-jogos/14.CASES/6.PROMPT-V0-CASES-PARTE-3-ADENDO.md`

COLE JUNTO o arquivo VISUAL-REFORCE-CASES.md.

Gere CasesGame.tsx com Telas 1-5. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — CaseCatalog: Grid 2×3 (ou 3×2) com 6 caixas. Cada card: PNG FECHADA real, background case-bg-*.png atras com opacity 0.15, nome, preco GCoin, badge tier (Bronze/Silver/Gold). Hover scale+glow.

TELA 2 — CasePreview: Caixa FECHADA grande ao centro (~200px). Lista de itens possiveis abaixo (thumb 40px + nome + raridade + % chance). Botao ABRIR verde grande + botao FAST OPEN dourado menor. Preco. Background da caixa.

TELA 3 — CaseOpening: STRIP HORIZONTAL ANIMADA (estilo CS:GO). Itens scrollam rapido da esquerda pra direita. Indicador central (seta/linha dourada). Strip desacelera. Para no item sorteado. Item central: scale 1.3 + glow da raridade.

TELA 4 — CaseResult: Item revelado em destaque. PNG grande + nome + raridade + valor GCoin. Borda glow da cor raridade. Se Legendary: overlay BigWin (confetti+shimmer). Botoes: ABRIR OUTRA + VENDER (70%) + GUARDAR.

TELA 5 — FastOpenResult: Abertura instantanea. Card flip 3D (rotateY): verso = caixa FECHADA, frente = item revelado. Flip 0.6s. Sem strip. Mais rapido.

USAR PNGs REAIS de /assets/games/cases/.
