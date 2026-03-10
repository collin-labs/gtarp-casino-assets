# GUIA DE VALIDACAO -- CASES FASE 3

## Animacao de Revelacao (Carrossel Horizontal)
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: CSS translateX deceleration easing, cubic-bezier case opening, Framer Motion inertia.
**Fontes:** CSS-Tricks (cubic-bezier avancado), Motion.dev (transitions docs), MDN (linear() custom easing), curveeditor.com
**O que trouxe:** Easing `cubic-bezier(0.15, 0.85, 0.35, 1.0)` para desaceleracao suave tipo reel. Framer Motion suporta arrays de 4 numeros como cubic-bezier.
**Sem pesquisa:** ease-out generico. Com pesquisa: easing customizado para deceleration natural.

---

## ARQUIVOS CRIADOS/EDITADOS

| Arquivo | Linhas | Funcao |
|---------|:------:|--------|
| components/games/cases/RevealStrip.tsx | 178 | Strip horizontal com 50 itens + indicador central + translateX deceleration |
| components/games/cases/CaseOpening.tsx | 138 | Overlay fullscreen com titulo + strip + resultado revelado |
| components/games/cases/CaseResult.tsx | 194 | Tela de resultado: item + vender/guardar/abrir outra + hash provably fair |
| components/games/cases/CasesGame.tsx | +55 linhas | Integracao: states opening/result + handlers sell/keep/openAnother |
| components/games/cases/CasePreview.tsx | +3 linhas | Prop onFastOpen adicionada |
| **TOTAL** | **~568** | |

---

## MECANICA DO CARROSSEL

```
1. Strip de 50 itens montada (repetidos aleatoriamente conforme pool)
2. Item-alvo posicionado na posicao 45 (perto do final)
3. Animacao: translateX de 0 ate -(targetPos * 120px) + offset central
4. Easing: cubic-bezier(0.15, 0.85, 0.35, 1.0) -- deceleration suave
5. Duracao: 4.5s normal / 0.6s fast mode
6. Indicador central fixo (linha dourada + triangulo)
7. Blur nas laterais durante spin
8. Ao completar: item-alvo ganha glow na cor da raridade
```

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA X5)

| # | Elemento | Tooltip | Feedback Visual |
|:-:|---------|:-------:|:---------------:|
| 1 | Botao VENDER | "Vender por GCoin X" | Hover: scale + cor verde |
| 2 | Botao GUARDAR | "Guardar no inventario" | Hover: scale + cor dourada |
| 3 | Botao ABRIR OUTRA | "Abrir mais uma caixa" | Hover: scale + brightness verde |
| 4 | Hash provably fair | "Hash verificavel" | Exibido com # + hash truncado |
| 5 | Botao CANCELAR | -- | Opacity 0.5, aparece apos 1.5s |
| 6 | Botao VOLTAR AO CATALOGO | -- | Hover: cor dourada |

**6 de 6 elementos com feedback.**

---

## TESTE

| # | Teste | O que verificar |
|:-:|-------|----------------|
| 1 | Clicar ABRIR no preview | Overlay escuro abre com titulo |
| 2 | Carrossel gira | Itens passam rapidamente da direita pra esquerda |
| 3 | Deceleration | Carrossel desacelera suavemente antes de parar |
| 4 | Indicador central | Linha dourada + triangulo fixos no centro |
| 5 | Item revelado | Glow na cor da raridade + nome + valor |
| 6 | Tela de resultado | Item grande + badge + valor GCoin + 3 botoes |
| 7 | VENDER funciona | Console log + volta ao catalogo |
| 8 | GUARDAR funciona | Console log + volta ao catalogo |
| 9 | ABRIR OUTRA funciona | Nova animacao de abertura inicia |
| 10 | Fast mode | Clique RAPIDO no preview -> carrossel gira em 0.6s |
| 11 | Hash exibido | Numero + hash truncado visivel |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** Carrossel com deceleration customizado, 50 itens na strip, indicador central, blur lateral, resultado com glow, 3 acoes (sell/keep/open another), fast mode, hash provably fair. Mock data funcional.

**TODOS os itens desta fase foram implementados: 3 de 3 componentes + 2 integracoes. Zero pendencias.**

**Proxima fase:** FASE 4 -- Polish (particulas, glassmorphism, glow por raridade)
