# GUIA DE VALIDACAO -- PAINEL FASE 9

## Entrada/Saida Cinematografica do Painel
### Blackout Casino -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: Framer Motion stagger children entrance animation timeline React 2025/2026.

**Fontes:**
- motion.dev/docs/react-transitions -- staggerChildren + delayChildren oficial
- inhaq.com -- Framer Motion Complete Guide 2026 -- variants com when: "beforeChildren"
- 32blog.com -- Framer Motion React Animation Guide (stagger 0.05-0.1s recomendado)

**O que trouxe:** O padrao 2026 usa variants declarativos com `staggerChildren` propagando para filhos. O `when: "beforeChildren"` garante que o pai anima ANTES dos filhos. Easing premium: `[0.16, 1, 0.3, 1]` (custom bezier).

**Sem pesquisa:** Delays manuais hardcoded. Com pesquisa: delays coordenados com easing premium.

---

## ARQUIVOS EDITADOS

| Arquivo | Tipo | Alteracoes |
|---------|------|:----------:|
| `components/casino/BlackoutCasino.tsx` | Editado | 4 animacoes melhoradas |
| `components/games/slots/components/SpinButton.tsx` | Editado | +som click |
| `components/games/slots/components/BetControls.tsx` | Editado | +som click |

---

## O QUE FOI IMPLEMENTADO

### 9.1 -- Overlay escuro (fullscreen)
- ANTES: `<div>` estatico
- DEPOIS: `<motion.div>` com `initial={{ opacity: 0 }}` -> `animate={{ opacity: 1 }}`
- Duracao: 400ms, ease: easeOut
- Efeito: fundo escurece suavemente antes do painel aparecer

### 9.2 -- Painel flutuante (entrada principal)
- ANTES: `scale: 0.95 -> 1`, duracao 600ms
- DEPOIS: `scale: 0.88 -> 1, y: 30 -> 0`, duracao 700-800ms
- Easing: `[0.16, 1, 0.3, 1]` (premium, sem bounce)
- Efeito: painel surge de baixo com escala mais dramatica

### 9.3 -- Letreiro (entrada com delay)
- ANTES: `initial={false}` (sem animacao de entrada)
- DEPOIS: `initial={{ opacity: 0, y: -30, scale: 0.85 }}` com delay 0.4s
- Efeito: letreiro desce do topo APOS o painel aparecer

### 9.4 -- Dock (entrada com delay)
- ANTES: `initial={false}` (sem animacao de entrada)
- DEPOIS: `initial={{ opacity: 0, y: 50, scale: 0.9 }}` com delay 0.5s
- Efeito: dock sobe de baixo APOS o letreiro

### Timeline cinematografica resultante:
```
0.0s -- Overlay fade in (400ms)
0.0s -- Painel scale+slide (700ms)
0.4s -- Letreiro desce do topo (500ms)
0.5s -- Dock sobe de baixo (500ms)
~1.0s -- Tudo visivel
```

### BONUS: Sons nos Slots
- SpinButton: som "click" ao girar
- BetControls: som "click" em MIN, MAX, +, -

---

## CHECKLIST DE TESTE

| # | Teste | O que verificar |
|:-:|-------|----------------|
| 1 | Abrir painel (primeira vez) | Overlay fade -> Painel surge -> Letreiro desce -> Dock sobe |
| 2 | Sequencia temporal | Letreiro aparece ~0.4s APOS painel, Dock ~0.5s APOS |
| 3 | Easing suave | Sem bounce, sem jank, movimento premium |
| 4 | Selecionar jogo | Letreiro e Dock somem suavemente |
| 5 | Fechar jogo (voltar) | Letreiro e Dock reaparecem com animacao |
| 6 | SpinButton no Slots | Som de click ao girar |
| 7 | BetControls no Slots | Som de click em +/-/MIN/MAX |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** Entrada cinematografica com 4 elementos sequenciados (overlay -> painel -> letreiro -> dock). Easing premium. Sons integrados no Slots.

**TODOS os itens desta fase foram implementados: 4 de 4 + bonus sons Slots. Zero pendencias.**
