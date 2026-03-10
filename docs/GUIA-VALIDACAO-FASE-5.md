# GUIA DE VALIDAÇÃO — SLOTS FASE 5

## Jackpot Progressivo (Ticker Real-Time + Hit Overlay)
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Progressive jackpots em 2026 seguem padrão multi-tier (Mini/Minor/Major/Grand) com ticker incrementando em tempo real e celebração fullscreen no hit. DraftKings reportou jackpot de $22.4M em nov/2025. Nosso design está alinhado com a indústria. Sem pesquisa, teríamos feito o hit sem flash branco + raios cônicos, que são o padrão visual dos slots premium.

---

## ARQUIVOS ENTREGUES

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `JackpotHitOverlay.tsx` | 188 | Overlay fullscreen: flash, partículas Canvas 2D, raios cônicos, contador animado |
| `EDITAR-JackpotTicker.txt` | 22 | Edição cirúrgica: push updates via NUI message |
| **Total** | **~210** | **1 arquivo novo + 1 edição** |

---

## JackpotHitOverlay — SEQUÊNCIA DE ANIMAÇÃO

Conforme Roteiro Fase 5 (doc 7):

| Passo | Timing | Efeito |
|:-----:|:------:|--------|
| 1 | 0ms | Flash branco (opacity 0 → 0.3 → 0, 150ms) |
| 2 | 0ms | Backdrop escuro (rgba(0,0,0,0.9), fade in 300ms) |
| 3 | 200ms | Tier name aparece com spring bounce (scale 0 → 1) |
| 4 | 500ms | Valor começa a contar (0 → amount em 3s, ease out cubic) |
| 5 | 0ms | Canvas 2D: 80 partículas douradas do centro (com gravidade) |
| 6 | 0ms | Raios cônicos giratórios (conic-gradient, 20s rotation, blur 20px) |
| 7 | 5000ms | Auto-fecha OU click/tap para fechar |

## CORES POR TIER

| Tier | Cor | Glow | Font Size |
|------|-----|------|:---------:|
| Mini | #A8A8A8 | rgba(168,168,168,0.4) | 22-34px |
| Minor | #00E676 | rgba(0,230,118,0.4) | 26-40px |
| Major | #D4A843 | rgba(212,168,67,0.5) | 30-46px |
| Grand | #FFD700 | rgba(255,215,0,0.6) | 34-52px |

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA 5)

| Elemento | Feedback | Status |
|----------|----------|:------:|
| Flash branco no hit | 150ms white overlay | ✅ |
| Tier name | Spring bounce com glow por tier | ✅ |
| Contador de valor | 3s ease out, formato R$ com vírgula | ✅ |
| Partículas | 80 particles Canvas 2D com gravidade | ✅ |
| Raios cônicos | Rotação 20s, cor por tier | ✅ |
| Auto-fechar | 5s timeout | ✅ |
| Tap para fechar | Click em qualquer lugar | ✅ |
| Texto "Toque para fechar" | Aparece após 2s, opacity 0.5 | ✅ |
| JackpotTicker push | NUI message listener | ✅ (edição) |

---

## INTEGRAÇÃO

O JackpotHitOverlay é chamado pelo VideoSlot/ClassicSlot quando o server retorna `jackpotHit: { tier, amount }`. Adicionar ao componente pai:

```tsx
{jackpotHit && (
  <JackpotHitOverlay
    visible={!!jackpotHit}
    tier={jackpotHit.tier}
    amount={jackpotHit.amount}
    isBR={isBR}
    onClose={() => setJackpotHit(null)}
  />
)}
```

---

## PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM.** Flash, partículas, raios, contador e auto-close implementados. Visual diferenciado por tier (4 configs de cor/glow/tamanho). Canvas 2D com 80 partículas <3% FPS (conforme Mega Estudo). Edição cirúrgica no JackpotTicker para receber push do server.

**Próxima fase:** Fase 6 — Polish (sons, BigWinOverlay, ParticleEngine, animations.css)
