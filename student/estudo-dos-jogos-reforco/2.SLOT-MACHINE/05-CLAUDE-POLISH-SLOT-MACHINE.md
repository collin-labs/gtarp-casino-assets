# CONVERSA 5 — CLAUDE POLISH VISUAL — SLOT MACHINE (#2)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## CONTEXTO
Jogo Slot Machine (#2) do Blackout Casino. Viewport 1280x720. O V0 gerou o visual base com problemas GRAVES.

## DOCS — LER DO PROJETO (pasta student/)
student/estudo-dos-jogos/2.SLOT-MACHINE/4.ADENDO-DS-SLOT-MACHINE-PARTE-1.md
student/estudo-dos-jogos/2.SLOT-MACHINE/4.ADENDO-DS-SLOT-MACHINE-PARTE-2.md
student/estudo-dos-jogos/2.SLOT-MACHINE/4.ADENDO-DS-SLOT-MACHINE-PARTE-3.md
student/estudo-dos-jogos/2.SLOT-MACHINE/4.ADENDO-DS-SLOT-MACHINE-PARTE-4.md
student/estudo-dos-jogos/2.SLOT-MACHINE/7.CSS-COMPONENTES-SLOT-MACHINE-PARTE-1.md
student/estudo-dos-jogos/2.SLOT-MACHINE/7.CSS-COMPONENTES-SLOT-MACHINE-PARTE-2.md
student/estudo-dos-jogos/2.SLOT-MACHINE/9.GUIA-INTEGRACAO-V0-SLOT-MACHINE.md
Referencia: components/casino/GameCard.tsx (7 camadas)

## ASSETS EXISTEM — NAO CRIE NADA
public/assets/games/slots/ (symbols/ classic/ overlays/), shared/icons/, shared/ui/, sounds/slots/

## REGRAS
CSS inline, Cinzel/Inter/JetBrains Mono, #D4A843/#00E676/#FF4444/#0A0A0A, bordas rgba, clamp(), edicoes CIRURGICAS.

---

## PROBLEMA 1 — VIDEO SLOT: GRID CORTADO (CRITICO)

Grid 6x5 estoura o container. Row 5 cortada. Titulo e JACKPOT sobrepostos nos simbolos.

Layout correto:
```
[VOLTAR]     SLOT MACHINE     JACKPOT: GC 47.350  [500]   <- FORA do frame
+------------------------------------------------------+
|  [sym] [sym] [sym] [sym] [sym] [sym]  row 1         |
|  [sym] [sym] [sym] [sym] [sym] [sym]  row 2         |  <- frame dourado
|  [sym] [sym] [sym] [sym] [sym] [sym]  row 3         |     SO o grid
|  [sym] [sym] [sym] [sym] [sym] [sym]  row 4         |
|  [sym] [sym] [sym] [sym] [sym] [sym]  row 5         |
+------------------------------------------------------+
[icons] [MIN][/2] APOSTA: 10 GC [x2][MAX] [ANTE] > ... <- FORA do frame
```

Titulo e controls FORA do frame. Grid com gridTemplateRows: "repeat(5, 1fr)" + height 100%.

## PROBLEMA 2 — CLASSIC SLOT: NAO PARECE MAQUINA (CRITICO)

O Classic eh um grid 3x3 flat. Precisa ser MAQUINA FISICA:

- Cabine metalica dourada (gradiente #2A2215→#0D0B07, borda 3px, borderRadius 24px, ~60% da tela)
- Placa "CLASSIC SLOTS" topo com luzes decorativas
- Janela reels: 3 colunas verticais overflow hidden, 3 simbolos por reel, sombra interna topo/fundo (profundidade)
- MANIVELA lado direito: barra dourada vertical + bola topo, clicavel=SPIN, anima ao puxar
- Payline indicators: setas douradas nas laterais da linha central
- Painel LED inferior: credito/aposta/ganho JetBrains Mono verde
- Controles integrados na cabine (NAO flutuando)

## PROBLEMA 3 — POLISH GERAL (Doc 4 + Doc 7)
7 camadas nos frames, @keyframes (shimmer, pulse-gold, glow-breathe), hover/active/disabled todos botoes, stagger entradas, tokens CSS, touch targets 44px.

## METODO
Leia docs. Comece pelo Problema 1. 1 entrega por vez. Edicoes cirurgicas.
