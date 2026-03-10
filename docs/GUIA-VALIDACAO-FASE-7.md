# GUIA DE VALIDAÇÃO — SLOTS FASE 7

## Auto Play + Turbo + Histórico + Paytable
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Autoplay na indústria inclui: número de spins, stop on loss/win limit, stop on free spins/jackpot trigger. Nosso design segue o padrão completo. Sem pesquisa, teríamos esquecido "stop on free spins trigger" que é padrão.

---

## ARQUIVOS (4 novos)

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `AutoPlayModal.tsx` | 148 | Modal config: spins + 4 stop conditions |
| `AutoPlayEngine.ts` | 95 | State machine: start/stop/check conditions |
| `PaytableOverlay.tsx` | 148 | Slide-up: símbolos + pagamentos + regras |
| `HistoryOverlay.tsx` | 120 | Slide-up: últimas 20 rodadas + grid layout |
| **Total** | **~511** | **4 arquivos** |

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA 5)

| Elemento | Tooltip/Feedback | Status |
|----------|-----------------|:------:|
| Spin options (10/25/50/100/∞) | Seleção visual com highlight | ✅ |
| Input saldo mínimo | Placeholder + validação numérica | ✅ |
| Input win máximo | Placeholder + validação numérica | ✅ |
| Checkbox Free Spins | Custom checkbox dourado com ✓ | ✅ |
| Checkbox Jackpot | Custom checkbox dourado com ✓ | ✅ |
| Botão INICIAR | "Iniciar auto play" tooltip | ✅ |
| Botão CANCELAR | Hover color change | ✅ |
| Botão X (Paytable) | "Fechar" tooltip | ✅ |
| Botão X (Histórico) | "Fechar" tooltip | ✅ |
| Win positivo (histórico) | Cor verde #00E676 | ✅ |
| Loss (histórico) | Cor vermelha #FF1744 | ✅ |
| Multiplicador > 1 | Cor dourada #FFD700 | ✅ |
| Free Spin marker | "(FS)" no resultado | ✅ |
| Regras especiais | Ícone + texto explicativo | ✅ |

**Total: 14 feedbacks visuais nesta fase** ✅

---

## PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM.** AutoPlay com 5 opções de spins + 4 stop conditions. PaytableOverlay com todos símbolos e regras para ambos os modos. HistoryOverlay com mock de 5 entries (em produção: NUI callback `casino:slots:history`).

**Próxima fase:** Fase 8 — FiveM Build (final!)
