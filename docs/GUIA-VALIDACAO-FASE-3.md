# GUIA DE VALIDAÇÃO — SLOTS FASE 3

## Video Slot UI (6×5 Grid, Cluster Highlight, Tumble Visual)
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Cluster Pays dominam 2026 (Sweet Bonanza, Gates of Olympus, Reactoonz). O timing da animação é crítico: 600ms highlight → 300ms explode → gravity drop → check. Sem pesquisa, teríamos feito tumble instantâneo sem pausa dramática.

---

## ARQUIVOS ENTREGUES (6 novos + 1 edição)

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `VideoSlot.tsx` | 178 | Tela completa Blackout Fortune |
| `components/VideoGrid.tsx` | 130 | Grid 6×5 com tumble engine visual |
| `components/GridCell.tsx` | 68 | Célula individual (normal/highlight/explode/new) |
| `components/MultiplierDisplay.tsx` | 45 | Círculo multiplicador animado |
| `components/JackpotTicker.tsx` | 62 | Ticker 4 tiers incrementando |
| `EDITAR-SlotsGame.txt` | — | Instruções de edição cirúrgica (2 linhas) |
| **Total** | **~483** | **6 arquivos novos** |

---

## O QUE CADA COMPONENTE FAZ

### VideoSlot.tsx
- Header: voltar + "BLACKOUT FORTUNE" + JackpotTicker (4 tiers) + saldo
- Área central: VideoGrid com multiplicador ao lado
- Controles: Aposta + GIRAR (retangular) + FREE SPINS + AUTO + TURBO + PAYTABLE + HISTÓRICO
- Mock: gera grid com weighted symbols, 50% chance de tumble

### VideoGrid.tsx
- CSS Grid 6×5 com GridCell em cada posição
- Processa sequência de tumbles com timing dramático
- 600ms highlight clusters → 300ms explode → novos caem com spring
- MultiplierDisplay atualiza a cada tumble

### GridCell.tsx
- 4 estados: normal, highlighted (borda dourada + shimmer), exploding (scale 0 + rotate), new (cai de cima com spring)
- Framer Motion para todas transições

### MultiplierDisplay.tsx
- Círculo com borda e glow que intensifica com valor
- AnimatePresence para transição scale no número
- Cores: branco (1-3), ouro (#D4A843, 4-9), dourado brilhante (#FFD700, 10+)

### JackpotTicker.tsx
- Ticker horizontal: MINI | MINOR | MAJOR | GRAND
- Valores incrementam a cada 1.5s (mock)
- Cor por tier: cinza/verde/ouro/dourado
- GRAND com textShadow pulsante

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA 5)

| Elemento | Tooltip | Status |
|----------|---------|:------:|
| Botão Voltar | "Voltar" | ✅ |
| Jackpot Ticker | "Jackpot progressivo..." | ✅ |
| Saldo | "Seu saldo atual" | ✅ |
| Botão GIRAR | "Girar os rolos" | ✅ |
| Botão FREE SPINS | "Comprar entrada nos Free Spins (25x aposta)" | ✅ |
| Botão AUTO | "Girar automaticamente" | ✅ |
| Toggle TURBO | "Acelerar animações (2x)" | ✅ |
| Botão PAYTABLE (i) | "Ver tabela de pagamentos" | ✅ |
| Botão HISTÓRICO | "Ver últimas rodadas" | ✅ |
| Controles aposta (5 botões) | MIN/−/+/MAX todos com tooltip | ✅ |

**Total: 14 tooltips nesta fase** ✅

---

## EDIÇÃO CIRÚRGICA (REGRA 6)

O SlotsGame.tsx da Fase 2 precisa de apenas 2 edições:
1. Adicionar `import VideoSlot from "./VideoSlot";`
2. Substituir placeholder "Em breve" por `<VideoSlot ... />`

Instruções detalhadas no arquivo `EDITAR-SlotsGame.txt`.

---

## RESPONSIVIDADE (REGRA 4) ✅

- Grid cells: `clamp(52px, 5vw, 72px)` — adapta 720p a ultrawide
- Gap: `clamp(2px, 0.3vw, 3px)`
- Controles com flexWrap para telas menores
- Todas fontes com clamp()

## IDENTIDADE VISUAL (REGRA 7) ✅

- Grid escuro #111111 com bordas douradas sutis
- Cluster highlight dourado com shimmer
- Multiplicador com glow progressivo
- Botões ouro/verde conforme padrão Blackout Casino

---

## PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM para UI mock.** Grid 6×5 renderiza, clusters são destacados visualmente, tumble anima com timing correto, multiplicador atualiza, jackpot ticker incrementa. Para produção real, o handleSpin precisa ser conectado ao NUI callback (Fase 8).

**Próxima fase:** Fase 4 — Free Spins + Bonus Buy
