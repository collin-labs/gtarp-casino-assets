# GUIA DE VALIDACAO -- CASES FASE 4

## Polish Visual (Glow, Glassmorphism, SVG Icons, Ambient Orbs)
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: lootbox premium UI dark theme glow neon CSS 2025/2026.
**Fontes:** TestMuAI (47 glow effects), freefrontend (9 neon effects), Medium (Dark Glassmorphism 2026), uiCookies (36 glow effects).
**O que trouxe:** Dark Glassmorphism 2026 precisa de ambient gradient orbs atras da UI. Cards premium usam multi-layer box-shadow com CSS variable por card. Glow intensifica no hover.
**Sem pesquisa:** Cards flat sem profundidade. Com pesquisa: orbs de cor, SVG icons com glow, shimmer sweep.

---

## EDICOES CIRURGICAS (4 arquivos)

| Arquivo | O que mudou |
|---------|-------------|
| CaseCard.tsx | Emoji substituido por SVG box icon estilizado com cor do tema + shimmer sweep + ambient glow pulsante |
| ItemCard.tsx | Emoji substituido por SVG shapes por raridade (estrela/diamante/circulo/quadrado) + glow background radial |
| CasesGame.tsx | Adicionados 3 orbs de cor ambiente (dourado top-right, esmeralda bottom-left, roxo center) + vignette |
| RevealStrip.tsx | Emoji substituido por SVG shapes coloridos por raridade na strip de revelacao |

---

## MELHORIAS VISUAIS DETALHADAS

### CaseCard (antes vs depois)
- **ANTES:** Emoji 📦 simples, glow basico
- **DEPOIS:** SVG box com tampa, fitas, estrela no topo, tudo na cor do tema. Shimmer sweep animado. Ambient glow pulsante (breathe animation). Drop-shadow intenso.

### ItemCard (antes vs depois)
- **ANTES:** Emoji (⭐/💎/🔮/📦) generico
- **DEPOIS:** SVG shapes unicos por raridade: estrela 10 pontas (legendary), estrela 5 pontas (epic), circulo com borda (rare), quadrado arredondado (uncommon/common). Background radial na cor da raridade.

### CasesGame (antes vs depois)
- **ANTES:** Fundo flat linear-gradient escuro
- **DEPOIS:** 3 orbs de cor blur(40-60px) + vignette radial. Estetica Dark Glassmorphism premium.

### RevealStrip (antes vs depois)
- **ANTES:** Unicode emojis nos itens da strip
- **DEPOIS:** SVG shapes coloridos consistentes com ItemCard. Mais legivel em velocidade alta.

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA X5)

Nenhum elemento interativo novo foi criado nesta fase. Todos os tooltips e feedbacks das fases anteriores permanecem intactos.

---

## TESTE

| # | Teste | O que verificar |
|:-:|-------|----------------|
| 1 | Grid de caixas | Cards com SVG box colorido (nao emoji), shimmer sweep, glow pulsante |
| 2 | Hover em CaseCard | Glow intensifica, scale sutil |
| 3 | Caixas com cores diferentes | Arsenal=dourado, Garagem=verde, Urbano=azul, Cofre=dourado, Noturna=rosa |
| 4 | Preview de itens | SVG shapes por raridade (estrela, diamante, circulo, quadrado) |
| 5 | Carrossel girando | SVG shapes coloridos visiveis mesmo em velocidade |
| 6 | Fundo do CasesGame | Orbs de cor visiveis (dourado, verde, roxo) com blur |
| 7 | Vignette | Bordas escurecidas, centro mais claro |
| 8 | Performance | Sem lag com orbs + shimmer + glow |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** 4 arquivos editados cirurgicamente. Emojis substituidos por SVG estilizados. Dark Glassmorphism com ambient orbs. Shimmer sweep nos cards. Visual premium AAA.

**TODOS os itens desta fase foram implementados: 4 de 4 edicoes. Zero pendencias.**

**Proxima fase:** FASE 5 -- Feed + Daily + Som + Tooltips
