# GUIA DE VALIDAÇÃO — SLOTS FASE 2

## Classic Slot UI (React + Framer Motion)
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Técnica confirmada: translateY + cubic-bezier para easing de pouso premium. Referência enermax5555 usa GSAP, adaptamos para Framer Motion + CSS transitions (já no projeto, mais leve no NUI).

---

## ARQUIVOS (9 componentes, ~840 linhas)

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `SlotsGame.tsx` | 48 | Router de 10 views |
| `ModeSelect.tsx` | 167 | Seleção Classic vs Video |
| `ClassicSlot.tsx` | 170 | Jogo Classic 777 Gold |
| `ClassicReel.tsx` | 108 | Reel com animação translateY |
| `symbols/SymbolIcon.tsx` | 120 | 20 símbolos SVG inline |
| `components/Tooltip.tsx` | 40 | Tooltip reutilizável |
| `components/BetControls.tsx` | 82 | Controles aposta +/- MIN MAX |
| `components/SpinButton.tsx` | 50 | Botão SPIN circular |
| `components/WinDisplay.tsx` | 55 | Contador de win animado |

## 15 TOOLTIPS IMPLEMENTADOS (REGRA 5) ✅

Voltar, Cards, JOGAR, Jackpot ticker, Saldo, −, +, MIN, MAX, SPIN, Alavanca, Paytable (i) — todos com tooltip posicional.

## RESPONSIVIDADE (REGRA 4) ✅

Tudo com `clamp()`. Grid cells 60-85px, fontes escaláveis, controles adaptam 720p a ultrawide.

## IDENTIDADE VISUAL (REGRA 7) ✅

Ouro/verde/preto, Cinzel/JetBrains Mono/Inter, LEDs piscando, glow dourado.

**Próxima fase:** Fase 3 — Video Slot UI
