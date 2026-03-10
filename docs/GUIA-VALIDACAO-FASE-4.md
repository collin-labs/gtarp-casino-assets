# GUIA DE VALIDAÇÃO — SLOTS FASE 4

## Free Spins + Bonus Buy
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Bonus Buy custa 50-200x a aposta na indústria; nosso 25x é mais acessível (design FiveM). Free Spins devem ter visual diferenciado (backdrop escuro, cores ciano) para criar sensação de evento raro e especial. Sem pesquisa, teríamos feito free spins com mesmo visual do jogo base.

---

## ARQUIVOS ENTREGUES (3 novos)

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `FreeSpinsContext.tsx` | 68 | State management (Context API) da sessão |
| `BonusBuyModal.tsx` | 130 | Modal confirmação com custo, feedback erro |
| `FreeSpinsOverlay.tsx` | 215 | Overlay completo: backdrop, counter, multiplicador, retrigger, tela conclusão |
| **Total** | **~413** | **3 arquivos** |

---

## O QUE CADA COMPONENTE FAZ

### FreeSpinsContext.tsx
- Context API com Provider + hook `useFreeSpins()`
- State: active, sessionId, spinsRemaining, totalSpins, accumulatedMultiplier, totalWin, betAmount, retriggerCount
- Actions: startSession, decrementSpin, updateMultiplier, addWin, retrigger, endSession

### BonusBuyModal.tsx
- Backdrop rgba(0,0,0,0.8) — click fora fecha
- Card centrado: título "COMPRAR FREE SPINS", custo em R$ vermelho, subtexto com multiplicador
- Botões CONFIRMAR (verde) + CANCELAR (cinza)
- Feedback inline de "Saldo insuficiente!" com borda vermelha (auto-fecha 2s)
- Verifica canAfford antes de confirmar

### FreeSpinsOverlay.tsx
- Backdrop rgba(0,0,0,0.7) sobre tudo
- Header: "FREE SPINS" em ciano (#00E5FF) com glow pulsante
- Counter com AnimatePresence (bounce ao decrementar)
- MultiplierDisplay grande (isFreeSpins=true, 80px) no canto direito
- Notificação de retrigger: "+5 FREE SPINS!" com spring animation (auto-some 2s)
- Tela de conclusão: "FREE SPINS COMPLETOS!", multiplicador final, total win em verde, botão CONTINUAR
- Controles simplificados: SPIN (borda ciano) + TURBO

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA 5)

| Elemento | Tooltip | Modal/Feedback | Status |
|----------|---------|:------:|:------:|
| Botão CONFIRMAR (BonusBuy) | "Confirmar compra" | — | ✅ |
| Botão CANCELAR (BonusBuy) | "Cancelar" | — | ✅ |
| Saldo insuficiente | — | Feedback inline vermelho 2s | ✅ |
| Click fora do modal | — | Fecha modal | ✅ |
| Multiplicador (FreeSpins) | "Multiplicador total desta sessão" | — | ✅ |
| Botão SPIN (FreeSpins) | "Girar (grátis!)" | Disabled durante spin | ✅ |
| Botão TURBO (FreeSpins) | "Acelerar animações" | Toggle visual ciano | ✅ |
| Botão CONTINUAR | "Voltar ao jogo base" | Transição de saída | ✅ |
| Retrigger | — | Flash "+5 FREE SPINS!" 2s | ✅ |
| Tela conclusão | — | Total win + multiplicador final | ✅ |

**Total: 10 tooltips/feedbacks nesta fase** ✅

---

## INTEGRAÇÃO COM FASES ANTERIORES

Para conectar ao VideoSlot.tsx (Fase 3):
1. Wrap SlotsGame com `<FreeSpinsProvider>`
2. No VideoSlot, importar BonusBuyModal e FreeSpinsOverlay
3. Adicionar states: `showBonusBuy`, `freeSpinsActive`, `freeSpinsComplete`
4. View "bonusBuyModal" → mostra BonusBuyModal
5. Quando server retorna freeSpinsAwarded > 0 → ativa FreeSpinsOverlay

Instruções detalhadas serão consolidadas no pacote final (REGRA 13).

---

## PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM para UI.** BonusBuyModal mostra custo, valida saldo, tem feedback de erro. FreeSpinsOverlay tem visual diferenciado (ciano), counter com bounce, multiplicador acumulado, retrigger notification, e tela de conclusão com total win. Para produção, o onSpin precisa chamar `casino:slots:free_spin` via NUI (Fase 8).

**Próxima fase:** Fase 5 — Jackpot Progressivo (ticker real-time + hit overlay)
