# CONVERSA 2 — V0 GERA TELAS 1-4 — SLOT MACHINE (#2)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/2.SLOT-MACHINE/6.PROMPT-V0-SLOT-MACHINE-PARTE-1.md`
- `student/estudo-dos-jogos/2.SLOT-MACHINE/7.CSS-COMPONENTES-SLOT-MACHINE-PARTE-1.md`

Gere Telas 1-4 num UNICO SlotsGame.tsx. CSS inline, paths exatos, zero Tailwind, zero placeholder.
Siga FIELMENTE os wireframes do Doc 6 Parte 1.

TELA 1 — MODE SELECT: 2 cards (CLASSIC vs VIDEO), botao JOGAR verde, header com voltar+saldo.
TELA 2 — VIDEO SLOT IDLE: Grid 6x5 com 11 simbolos, frame dourado, bet controls (MIN/÷2/x2/MAX/ANTE/SPIN/AUTO/TURBO/BONUS).
TELA 3 — SPINNING+TUMBLING: Colunas scroll com stagger 150ms, win glow, tumble cascade com AnimatePresence.
TELA 4 — FREE SPINS TRIGGER: Overlay "FREE SPINS!" Cinzel 900 #FFD700, scale 0→1, botao COMECAR.

Estado 'screen': "modeSelect"|"videoIdle"|"spinning"|"fsTrigger". Mock grid com simbolos aleatorios.
