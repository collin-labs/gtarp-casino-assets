# CHECKLIST CUSTOMIZADO — PAINEL FLUTUANTE BLACKOUT CASINO
## ~120 itens · 10 documentos · Adaptado do Checklist Mestre 195 itens
## Criado 22/03/2026 · Para execucao APOS os Quick Wins dos 22 jogos

---

# CONTEXTO

O Painel NAO eh um jogo. Nao tem Provably Fair, nao tem apostas, nao tem estados de rodada.
Mas eh a MOLDURA de todos os 22 jogos — a primeira coisa que o jogador ve.

Este checklist adapta o pipeline de 10 documentos e os 195 itens para a realidade do Painel:
removendo itens de jogo (PF, house edge, economia) e adicionando itens de navegacao,
integracao com 22 jogos, e Design System global.

O estudo atual (04/03/2026, 2.341L, 7 docs) serve como BASE. O objetivo nao eh reescrever
do zero — eh complementar com o nivel de precisao dos estudos recentes (Coinflip 94.7%).

---

# PIPELINE DE 10 DOCUMENTOS (adaptado)

| Doc | Nome | Benchmark | Foco Painel |
|:---:|------|:---------:|-------------|
| 0 | Pesquisa | ~800-1.000L | CSS 2026, FiveM NUI performance, paineis premium referencia |
| 1 | Mega Estudo | ~800-1.000L | Inventario dos 17+ componentes, estado atual, gaps |
| 2 | Guia do Painel | ~300-400L | Navegacao, abas, fluxos, diferencial visual |
| 3 | Prompt AI | ~1.500-2.000L | Layout ASCII, CSS por componente, estados por aba |
| 4 | Adendo DS | ~1.500-2.000L | CSS copiavel para TODOS componentes compartilhados |
| 5 | Roteiro | ~2.000-3.000L | Edicoes cirurgicas com codigo REAL por componente |
| 6 | Prompt V0 | ~500-700L | Telas do painel (Dock, abas, transicoes, modais) |
| 7 | CSS-Componentes | ~800-1.500L | CSS real copiavel de todos os componentes |
| 8 | Biblioteca Imagens | ~800-1.200L | Backgrounds, icons, logos, cards de jogo |
| 9 | Guia V0 | ~200-300L | Assets, arvore de pastas, mock data |

**Benchmark total: ~8.500-11.000L**
**Estudo atual: 2.341L (27% do benchmark medio)**

---

# DOC 0 — PESQUISA (~800-1.000L, 3 partes) — 39 itens

## 0.1 ESTRUTURA (4 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.1.1 | Plano de Acao | Template com Gold Standard, benchmark, secoes |
| 0.1.2 | Data e identificacao | "PAINEL FLUTUANTE - DD/MM/2026" |
| 0.1.3 | Gold Standards referenciados | Citar Coinflip V0, BR Roulette CSS, Slot DS |
| 0.1.4 | Benchmark declarado | 800-1.000L, 3 partes |

## 0.2 PESQUISA REAL (5 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.2.1 | Termos (min 6) | Tabela formal com 6+ buscas 2025/2026 |
| 0.2.2 | Pesquisa REAL | Termos reais com data (nao generico) |
| 0.2.3 | Fontes URL (min 15) | 15+ URLs com "O que trouxe" |
| 0.2.4 | "O que trouxe" por fonte | Descricao concreta, nao generica |
| 0.2.5 | Min 3 rodadas | 3 partes com foco diferente |

## 0.3 EIXO 1 — REFERENCIA REAL (6 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.3.1 | Paineis cassino referencia (min 3) | Stake, BC.Game, CSGOEmpire, Roobet, Gamdom |
| 0.3.2 | Analise de navegacao | Dock/tabs, sidebar, header, breadcrumbs |
| 0.3.3 | Transicoes entre secoes | Como cassinos reais trocam entre jogos/lobby/perfil |
| 0.3.4 | Responsividade dos paineis | Como se adaptam em resoluçoes menores |
| 0.3.5 | Carrossel/Hero patterns | Destaques, banners, rotacao automatica |
| 0.3.6 | Dark theme patterns | Cores, contrastes, hierarquia visual |

## 0.4 EIXO 2 — TECNOLOGIA (6 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.4.1 | CSS 2026 aplicavel | @property, container queries, view transitions, nesting |
| 0.4.2 | Framer Motion para painel | AnimatePresence abas, layout animations, shared layout |
| 0.4.3 | Canvas 2D (particulas) | Performance budget, requestAnimationFrame |
| 0.4.4 | GSAP vs Framer decisao | Comparativo com justificativa |
| 0.4.5 | Dependencias | Lista com custo (bundle size) |
| 0.4.6 | Codigo conceitual | Snippet de pelo menos 1 tecnica nova |

## 0.5 EIXO 3 — VIABILIDADE FIVEM (5 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.5.1 | NUI CEF limitacoes 2026 | Chromium version, features bloqueadas |
| 0.5.2 | Performance budget | FPS alvo, max DOM nodes, max particles |
| 0.5.3 | Concorrentes FiveM (min 3) | HUDs/paineis premium de outros servidores |
| 0.5.4 | Tabela comparativa | Features do Blackout vs concorrentes |
| 0.5.5 | DOIS PONTOS (min 10) | Tabela feature por feature: FiveM NUI vs Web React |

## 0.6 EIXO 4 — VISUAL PREMIUM (5 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.6.1 | Refs visuais | Dribbble, Behance com links |
| 0.6.2 | Paleta definida | Cores exatas com hex |
| 0.6.3 | Layout ASCII | ASCII do painel completo (header+dock+content+footer) |
| 0.6.4 | Efeitos catalogados | Tabela de efeitos com prioridade e custo |
| 0.6.5 | Design System mapping | Referencia DS § para cada componente |

## 0.7 INTEGRACAO COM 22 JOGOS (4 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.7.1 | Como o painel carrega cada jogo | z-index, overlay, NUI show/hide |
| 0.7.2 | Transicao painel→jogo | Animacao de entrada/saida |
| 0.7.3 | Dados compartilhados | Saldo, lang, playerId — como propagam |
| 0.7.4 | 4 abas documentadas | INICIO, JOGOS, LOJA, PERFIL (ou equivalente) |

## 0.8 SOUND DESIGN (2 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.8.1 | Sons do painel (min 8) | Tab switch, hover, click, open, close, notification, error, success |
| 0.8.2 | Implementacao | useSoundManager com paths |

## 0.9 SINTESE (2 itens)
| # | Item | Criterio |
|---|------|----------|
| 0.9.1 | "Com vs Sem" (min 6) | 6+ diferencas concretas |
| 0.9.2 | Checklist aprovacao | 20+ itens marcados |

---

# DOC 1 — MEGA ESTUDO (~800-1.000L, 2 partes) — 18 itens

## 1.1 INVENTARIO (6 itens)
| # | Item | Criterio |
|---|------|----------|
| 1.1.1 | Plano + 7 partes | Todas presentes |
| 1.1.2 | Todos componentes listados | Panel, Header, Dock, GameCard, HeroCarousel, Background, Particles, etc |
| 1.1.3 | Paths reais | Arquivo por arquivo com path completo |
| 1.1.4 | Linhas por componente | wc -l de cada arquivo |
| 1.1.5 | Dependencias externas | GSAP, Framer, Canvas |
| 1.1.6 | Props documentadas | Interface de cada componente |

## 1.2 ESTADO ATUAL (4 itens)
| # | Item | Criterio |
|---|------|----------|
| 1.2.1 | FUNCIONAL | Lista do que ja funciona |
| 1.2.2 | PARCIAL | Lista do que funciona com bugs/gaps |
| 1.2.3 | FALTA | Lista do que nao existe |
| 1.2.4 | Performance atual | FPS medido, DOM nodes, bundle size |

## 1.3 FEATURES (3 itens)
| # | Item | Criterio |
|---|------|----------|
| 1.3.1 | Features com viabilidade | DOIS PONTOS: feature + FiveM? + Web? + prioridade |
| 1.3.2 | Problemas conhecidos | Lista com severidade |
| 1.3.3 | Codigo problematico | Blocos de codigo que precisam de fix |

## 1.4 SQL + ESTRUTURA (2 itens)
| # | Item | Criterio |
|---|------|----------|
| 1.4.1 | Tabelas relacionadas | user_settings, user_preferences, etc |
| 1.4.2 | Configs admin | Quais configs o painel consome |

## 1.5 PLANO (3 itens)
| # | Item | Criterio |
|---|------|----------|
| 1.5.1 | Fases de melhoria | 5+ fases ordenadas |
| 1.5.2 | Metricas de sucesso | FPS, tempo de carga, DOM nodes |
| 1.5.3 | Checklist final | 15+ itens |

---

# DOC 2 — GUIA DO PAINEL (~300-400L) — 8 itens

| # | Item | Criterio |
|---|------|----------|
| 2.1 | Visao geral | O que eh o painel, por que existe, papel no cassino |
| 2.2 | Navegacao (min 4 abas) | INICIO, JOGOS, LOJA, PERFIL — features de cada |
| 2.3 | Nao genericas | Features especificas, nao "interface bonita" |
| 2.4 | Fluxos (min 3) | Abrir painel → navegar → abrir jogo. Trocar aba. Fechar. Notificacao |
| 2.5 | Refs visuais | Screenshots/mockups |
| 2.6 | Diferencial vs concorrentes | Tabela |
| 2.7 | Componentes | Lista dos 17+ componentes com descricao curta |
| 2.8 | Engajamento | Por que cada decisao visual (dopamina, retencao) |

---

# DOC 3 — PROMPT AI (~1.500-2.000L, 3-4 partes) — 12 itens

| # | Item | Criterio |
|---|------|----------|
| 3.1 | Contexto | Blackout Casino GTARP, FiveM NUI, dark theme |
| 3.2 | Regras tecnicas | React 19, TypeScript, Framer, clamp(), dark only |
| 3.3 | Paleta | Hex exatos: fundo, dourado, verde, cinza, texto |
| 3.4 | Viewport | clamp() para tudo |
| 3.5 | Layout ASCII | ASCII do painel completo POR ABA (min 4 layouts) |
| 3.6 | CSS por componente | CSS real para cada componente |
| 3.7 | Framer props | AnimatePresence, layout, shared layout transitions |
| 3.8 | Estados por aba | Cada aba com estados documentados |
| 3.9 | Mock PT-BR | JSON formal com dados mock (jogos, saldo, usuario) |
| 3.10 | Tooltips (min 20) | Lista formal BR+EN para todos elementos interativos |
| 3.11 | PROIBIDO (min 10) | Lista formal |
| 3.12 | Tabela componentes | Nome + path + descricao + props |

---

# DOC 4 — ADENDO DS (~1.500-2.000L, 3-4 partes) — 17 itens

| # | Item | Criterio |
|---|------|----------|
| 4.1 | Ref DS § | Refs ao Design System por componente |
| 4.2 | CSS copiavel | Blocos CSS REAIS para cada componente |
| 4.3 | Todos estados | hover, active, disabled, loading, selected POR componente |
| 4.4 | BEM naming | panel-*, dock-*, header-*, card-* |
| 4.5 | Container principal | CSS do Panel.tsx |
| 4.6 | Header | Logo, saldo, botoes, usuario |
| 4.7 | Dock/Tabs | 4+ abas com indicador ativo, transicao |
| 4.8 | Game Cards | Card individual, grid, hover effects |
| 4.9 | Hero Carousel | Slide, dots, auto-play, transition |
| 4.10 | Background + Particulas | Canvas particles, gradientes, vinheta |
| 4.11 | Glassmorphism | Modais, overlays, tooltips |
| 4.12 | Feixo verde + Linha dourada + Shine | 3 efeitos obrigatorios DS |
| 4.13 | Tooltip CSS | Bloco CSS completo isolado |
| 4.14 | Atmosferas por aba (min 4) | INICIO (acolhedor), JOGOS (eletrico), LOJA (premium), PERFIL (neutro) |
| 4.15 | Timelines (min 3) | Abertura do painel (ms), troca de aba (ms), abertura de jogo (ms) |
| 4.16 | Componentes especificos | Divisorias, scan line, corner accents, scroll container |
| 4.17 | Checklist DS §27 | 40+ itens de validacao |

---

# DOC 5 — ROTEIRO (~2.000-3.000L, 4-5 partes) — 12 itens

| # | Item | Criterio |
|---|------|----------|
| 5.1 | Pre-requisitos | Dependencias, estrutura de pastas |
| 5.2 | Min 5 fases | Background → Container → Header → Dock → Cards → Carousel → Polish |
| 5.3 | Objetivo por fase | Claro e mensuravel |
| 5.4 | Codigo REAL por componente | TSX + CSS, nao pseudocodigo |
| 5.5 | str_replace cirurgico | Edicoes no codigo existente, nunca reescrita |
| 5.6 | ANTES/DEPOIS | Bloco antes, bloco depois para cada edicao |
| 5.7 | Performance budget por fase | FPS target mantido |
| 5.8 | Integracao com jogos | Como cada jogo abre/fecha dentro do painel |
| 5.9 | Sons implementados | useSoundManager com paths e triggers |
| 5.10 | Tooltips inline | title={} em todos elementos interativos |
| 5.11 | Entrega por fase | Checklist do que validar |
| 5.12 | Checklist final | 20+ itens |

---

# DOC 6 — PROMPT V0 (~500-700L, 2 partes) — 12 itens

| # | Item | Criterio |
|---|------|----------|
| 6.1 | 1 bloco por tela/aba | Min 6: Painel fechado, INICIO, JOGOS, LOJA, PERFIL, Modal |
| 6.2 | Nome + descricao | Cada tela com objetivo |
| 6.3 | Restricoes tecnicas | CSS inline, Framer, dark, clamp |
| 6.4 | Layout ASCII | ASCII por tela |
| 6.5 | CSS inline por tela | CSS real |
| 6.6 | Framer props | AnimatePresence, layout |
| 6.7 | Bilingue BR+EN | Todos textos com { br, en } |
| 6.8 | Mock JSON | Dados formais: jogos[], usuario, saldo, notificacoes |
| 6.9 | PROIBIDO (min 10) | Lista formal |
| 6.10 | Tooltips | Tabela BR+EN para todos elementos interativos |
| 6.11 | Mobile clamp() | Tudo responsivo |
| 6.12 | X21 | Icons PNG, nao Lucide |

---

# DOC 7 — CSS-COMPONENTES (~800-1.500L, 2 partes) — 14 itens

| # | Item | Criterio |
|---|------|----------|
| 7.1 | Arquivo unico | Todos componentes numerados |
| 7.2 | Fundo + vinheta | bg-casino.png + gradientes |
| 7.3 | Container principal | Panel com z-index, position, sizing |
| 7.4 | Header | Logo, saldo, botoes |
| 7.5 | Dock | Abas, indicador ativo, hover, transicao |
| 7.6 | Game Card | Hover, glow, shine, imagem, titulo, badge |
| 7.7 | Hero Carousel | Slide, dots, arrows |
| 7.8 | Feixo verde | CSS obrigatorio DS |
| 7.9 | Linha dourada | CSS obrigatorio DS |
| 7.10 | Shine sweep | CSS obrigatorio DS |
| 7.11 | Glassmorphism | Modais/overlays/tooltips |
| 7.12 | Tooltip CSS | Bloco isolado completo |
| 7.13 | Lista imagens | Todas imagens necessarias |
| 7.14 | PROIBIDO | Lista de anti-patterns CSS |

---

# DOC 8 — BIBLIOTECA IMAGENS (~800-1.200L, 2-3 partes) — 16 itens

| # | Item | Criterio |
|---|------|----------|
| 8.1 | Pesquisa X0 | Ferramentas 2026 |
| 8.2 | 7 varreduras | V1-V7 no codigo do painel |
| 8.3 | Inventario existentes | Imagens que ja existem |
| 8.4 | Novas a criar | Lista com justificativa |
| 8.5 | Prompts 6 blocos | OBJECT+STYLE+RENDER+COMPOSITION+TECHNICAL+NEGATIVE |
| 8.6 | SALVAR COMO | Path final para cada imagem |
| 8.7 | Background (bg-casino.png) | Prompt especifico |
| 8.8 | Logo | Prompt especifico |
| 8.9 | 22 card images | 1 imagem por jogo (mini thumbnail) |
| 8.10 | Icons X21 | Som, settings, fechar, notificacao, perfil, etc |
| 8.11 | Hero banners | 3-5 banners para carousel |
| 8.12 | Aba icons | INICIO, JOGOS, LOJA, PERFIL |
| 8.13 | Badges | VIP, novo, popular, hot |
| 8.14 | Arvore de pastas | Completa |
| 8.15 | Guia de estilo | Cores, iluminacao, perspectiva |
| 8.16 | Mapeamento componente↔imagem | Tabela |

---

# DOC 9 — GUIA V0 (~200-300L) — 8 itens

| # | Item | Criterio |
|---|------|----------|
| 9.1 | Secao A: Assets do painel | Logo, bg, frame |
| 9.2 | Secao B: Assets UI | Botoes, icons |
| 9.3 | Secao C: Cards dos 22 jogos | Thumbnails |
| 9.4 | Secao D: Hero banners | Carousel images |
| 9.5 | Secao E: Icons premium X21 | Som, settings, perfil, etc |
| 9.6 | Secao F: Arvore de pastas | Completa |
| 9.7 | Secao G: Mock data | JSON com 22 jogos, usuario, saldo |
| 9.8 | Secao H: Estilo visual | Paleta, iluminacao, referencia |

---

# FORMULA DE SCORE (mesma dos jogos)

```
Score itens = media dos 10 docs (%)
Linhas vs benchmark = min(linhas_reais / 9.750 x 100, 100)   [media do benchmark]
SCORE FINAL = (score_itens x 0.7) + (linhas_vs_benchmark x 0.3)
```

Classificacoes: COMPLETO (90-100%), QUASE PRONTO (75-89%), PARCIAL (50-74%), INICIAL (25-49%)

---

# ESTIMATIVA DO ESTUDO ATUAL

```
Pesquisa:  256L → ~32% benchmark → ~43% score (sem DOIS PONTOS, sem concorrentes, sem riscos)
Mega:      969L → ~97% benchmark → ~96% score (forte, quase perfeito)
Guia:      225L → ~56% benchmark → ~75% score (como Guia de Efeitos, nao Guia do Painel)
Prompt AI: 623L → ~31% benchmark → ~60% score (curto, sem tooltips, sem PROIBIDO)
Adendo DS:    0L → FALTA → 0%
Roteiro:   268L → ~13% benchmark → ~57% score (superficial)
V0:           0L → FALTA → 0%
CSS:          0L → FALTA → 0%
Bib Img:      0L → FALTA → 0%
Guia V0:      0L → FALTA → 0%

Score itens estimado: (43+96+75+60+0+57+0+0+0+0) / 10 = 33.1%
Linhas: 2.341 / 9.750 = 24.0%

SCORE ESTIMADO: (33.1 x 0.7) + (24.0 x 0.3) = 23.2 + 7.2 = 30.4%
CLASSIFICACAO ESTIMADA: INICIAL (25-49%)
```

**Esforco estimado para COMPLETO: ~7.500-9.000L (15-18 conversas)**

---

# COMO EXECUTAR

## Arquivos a enviar na conversa:
1. PROMPT-UNIFICADO-v1.0.md
2. ESTE CHECKLIST (CHECKLIST-PAINEL-120-ITENS.md)
3. TODOS-DOCTOS-PAINEL.zip (estudo atual)
4. Opcionalmente: ZIP do Coinflip (Gold Standard V0) + ZIP da BR Roulette (Gold Standard CSS)

## Prompt:
```
Voce eh um especialista em documentacao para o projeto Blackout Casino GTARP (FiveM).

CONTEXTO: Estou reestudando o PAINEL FLUTUANTE — a moldura dos 22 jogos do cassino.
O estudo atual (04/03/2026, 2.341L) eh arcaico. O metodo evoluiu para 195 itens por jogo
e agora tenho um checklist customizado de ~120 itens para o painel.

ARQUIVOS ENVIADOS:
1. PROMPT-UNIFICADO-v1.0.md — regras X0-X22 + Y0-Y6
2. CHECKLIST-PAINEL-120-ITENS.md — checklist customizado do painel
3. TODOS-DOCTOS-PAINEL.zip — estudo atual (7 docs, 2.341L)

TAREFA: Criar Doc 0 (PESQUISA) novo do Painel seguindo o checklist customizado.
Pesquisa REAL com URLs, 3 partes, 39 itens do Doc 0.

REGRAS: X0-X22 + Y0-Y6 do Prompt Unificado. Partes ~500L. Zero fingerprint AI.
Plano de Acao antes de produzir. CHECKPOINT antes e depois.
```

---

`[CHECKLIST CUSTOMIZADO: PAINEL FLUTUANTE — ~120 ITENS — 22/03/2026]`
