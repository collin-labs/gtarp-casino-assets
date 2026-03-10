# GUIA DE VALIDACAO -- CASES FASE 2

## Catalogo + Preview (Componentes React)
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: React lootbox UI grid catalog, card design patterns 2025/2026.
**Fontes:** Dribbble (73 lootbox designs), Medium (Genogrand - Lootbox UI React), HeroUI Card.
**Sem pesquisa:** Cards sem glow por tema. Com pesquisa: glow, glassmorphism, estados progressivos.

---

## ARQUIVOS CRIADOS

| Arquivo | Linhas | Funcao |
|---------|:------:|--------|
| components/games/cases/CasesGame.tsx | 105 | Router de views (catalogo, preview, opening, result) |
| components/games/cases/CaseCatalog.tsx | 118 | Grid de caixas + filtros + stagger entrance |
| components/games/cases/CasePreview.tsx | 186 | Overlay glassmorphism com itens + botoes ABRIR |
| components/games/cases/components/CaseCard.tsx | 131 | Card individual com glow por tema |
| components/games/cases/components/ItemCard.tsx | 92 | Card de item com raridade e probabilidade |
| components/games/cases/components/RarityBadge.tsx | 44 | Badge colorido por tier (5 cores) |
| components/games/cases/components/Tooltip.tsx | 44 | Tooltip premium reutilizavel |
| components/casino/BlackoutCasino.tsx | +8 linhas | Integracao: import + gameMap + render |
| **TOTAL** | **~728** | |

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA X5)

| # | Elemento | Tooltip | Feedback Visual |
|:-:|---------|:-------:|:---------------:|
| 1 | CaseCard (cada caixa) | Nome da caixa | Hover: scale 1.04 + glow tema |
| 2 | Filtro TODAS/PREMIUM/etc | -- | Hover: scale + ativo: gold bg |
| 3 | Botao VOLTAR | -- | Hover: color + border change |
| 4 | Botao X (fechar preview) | "Fechar" | Hover: color gold |
| 5 | Botao ABRIR | "Abrir esta caixa" | Hover: scale + brightness |
| 6 | Botao RAPIDO | "Pular animacao" | Hover: scale |
| 7 | ItemCard (cada item) | "Nome - Probabilidade%" | Hover: scale 1.06 |
| 8 | Daily Free card | Nome | Borda verde pulsante |

**8 de 8 elementos interativos com feedback.** 

---

## TESTE

| # | Teste | O que verificar |
|:-:|-------|----------------|
| 1 | Clicar card "Caixas" no painel | CasesGame abre fullscreen |
| 2 | Ver grid de 6 caixas | Cards com glow, nome, preco, badges |
| 3 | Filtrar por PREMIUM | Apenas Garagem VIP e Cofre Secreto |
| 4 | Filtrar por GRATIS | Apenas Caixa Diaria |
| 5 | Clicar em caixa | Preview overlay abre com glassmorphism |
| 6 | Ver itens no preview | Grid organizado por raridade (lendario no topo) |
| 7 | Ver probabilidades | Cada item mostra % |
| 8 | Botao ABRIR visivel | Verde com preco em GCoin |
| 9 | Clicar X ou fundo | Preview fecha |
| 10 | Botao VOLTAR | Volta ao painel principal |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** 7 componentes novos + 1 integracao. Grid responsivo, glassmorphism, glow por tema, badges de raridade, tooltips, mock data completo. Filtros funcionais.

**TODOS os itens desta fase foram implementados: 7 de 7 componentes + 1 integracao. Zero pendencias.**

**Proxima fase:** FASE 3 -- Animacao de Revelacao (carrossel horizontal)
