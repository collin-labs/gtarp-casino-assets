# CONVERSA 3 — V0 GERA TELAS 5-7 — SLOT MACHINE (#2)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/2.SLOT-MACHINE/6.PROMPT-V0-SLOT-MACHINE-PARTE-2.md`
- `student/estudo-dos-jogos/2.SLOT-MACHINE/7.CSS-COMPONENTES-SLOT-MACHINE-PARTE-2.md`

Continue SlotsGame.tsx com Telas 5, 6 e 7.

TELA 5 — FREE SPINS PLAYING: Grid 6x5 + HUD topo ("FREE SPINS: 7/10" verde + "TOTAL x12" dourado). Multiplier orb: /assets/games/slots/symbols/multiplier_orb.png.

TELA 6 — WIN OVERLAY (4 tiers):
NORMAL (<5x) inline, BIG (5-49x) win_big.png, MEGA (50-499x) win_mega.png, JACKPOT (>=500x) win_jackpot.png.
Overlays em /assets/games/slots/overlays/. Countup animado, botao CONTINUAR.

TELA 7 — CLASSIC SLOT: IMPORTANTE — NAO eh grid flat. Eh uma MAQUINA FISICA:
- Cabine metalica dourada (gradiente #2A2215→#0D0B07, borda 3px dourada, borderRadius 24px)
- Placa "CLASSIC SLOTS" no topo com luzes decorativas
- Janela dos reels: 3 colunas verticais overflow hidden, 3 simbolos visiveis por reel, sombra interna topo/fundo (profundidade)
- MANIVELA no lado direito: barra dourada vertical + bola no topo, clicavel (=SPIN), anima ao clicar
- Payline indicators: setas douradas nas laterais
- Painel LED inferior: credito/aposta/ganho em JetBrains Mono verde
- Controles integrados na maquina (NAO flutuando embaixo)
- Simbolos: /assets/games/slots/classic/ (seven, bar, cherry, diamond, bell, lemon, star)
