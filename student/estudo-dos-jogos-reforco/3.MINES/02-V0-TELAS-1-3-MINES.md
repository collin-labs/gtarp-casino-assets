# CONVERSA 2 — V0 GERA TELAS 1-3 — MINES (#3)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/3.MINES/6.PROMPT-V0-MINES-PARTE-1.md` (Telas 1-6, foque nas 1-3)
- `student/estudo-dos-jogos/3.MINES/7.CSS-COMPONENTES-MINES-PARTE-1.md` (@keyframes)
- `student/estudo-dos-jogos/3.MINES/6.PROMPT-V0-MINES-PARTE-3-ADENDO.md` (tooltips)

Gere MinesGame.tsx com Telas 1-3. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — IDLE: Layout flex row. Grid 5x5 dim (tiles inertas, "?" central, opacity 0.5). Painel lateral: input aposta + atalhos MIN/x2/÷2/MAX + seletor minas [-][3][+] + info "Gemas: 22 | Prob: 88%" + botao APOSTAR verde. Header: voltar + titulo MINES + saldo + botoes PF/historico/som.

TELA 2 — PLAYING: Grid ativo (tiles clicaveis, hover scale 1.05 + borda dourada). Ao clicar tile: revelar gem.png (glow verde, scale 0→1 spring) ou manter hidden. Multiplicador topo: JetBrains Mono grande, glow verde, cresce a cada gem. Display "PROXIMO: 1.67x" e "LUCRO: +45 GC". Botao CASHOUT verde pulsante (glow-breathe). Barra de probabilidade visual.

TELA 3 — WIN (Cash Out): Grid revela TODAS posicoes (gems verdes, bombs vermelhas dim). Overlay verde: "VOCE GANHOU!" Cinzel 800, valor "+145 GC" JetBrains Mono com rolling countup. Confetti dourado. Multiplicador final grande. Botao NOVA RODADA.

Assets: /assets/games/mines/gem.png, /assets/games/mines/bomb.png (JA EXISTEM).
