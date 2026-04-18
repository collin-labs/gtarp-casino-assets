# MAPA DE CONVERSAS — MINES / CAMPO MINADO (#3)
# Blackout Casino GTARP — 01/04/2026

## 6 CONVERSAS (3 V0 + 3 Claude)
01-V0-ESTUDO .............. Estudo + regras + paths + confirmacao
02-V0-TELAS-1-3 ........... Idle, Playing, Win (cash out)
03-V0-TELAS-4-6 ........... Bust (bomba), Provably Fair modal, Historico modal
04-CLAUDE-POLISH .......... Aplicar Doc 4 + Doc 7, corrigir visual
05-CLAUDE-LOGICA-BACKEND .. Engine logica + SQL + Handler + Lua
06-CLAUDE-INTEGRACAO ...... Integrar no painel + QA checklist

## ASSETS (14 imagens — TODAS EXISTEM)
Game: public/assets/games/mines/ (bomb.png, gem.png)
Cards/Logos: image-para-cards/3.*, logos-br/3.*, logos-in/3.*
Icons: public/assets/shared/icons/ (7 usados)
UI: public/assets/shared/ui/ (bg-casino.png)
Sons: ZERO arquivos — usar Web Audio procedural

## CHECKLIST DE DOCUMENTOS — TODOS OS 33 ARQUIVOS

| # | Documento | Linhas | Usado em qual prompt |
|---|-----------|:------:|---------------------|
| 1 | 0.PESQUISA-REGRA0-MINES-PARTE-1.md | 320 | 05-CLAUDE-LOGICA (contexto pesquisa) |
| 2 | 0.PESQUISA-REGRA0-MINES-PARTE-2.md | 477 | 05-CLAUDE-LOGICA (contexto pesquisa) |
| 3 | 1.MEGA-ESTUDO-MINES-PARTE-1.md | 238 | 05-CLAUDE-LOGICA (mecanicas profundas) |
| 4 | 1.MEGA-ESTUDO-MINES-PARTE-2.md | 602 | 05-CLAUDE-LOGICA (mecanicas profundas) |
| 5 | 2.GUIA-DO-JOGO-MINES.md | 274 | 01-V0-ESTUDO (visao geral do jogo) |
| 6 | 2.GUIA-DO-JOGO-MINES-PARTE-2-ADENDO.md | 45 | 01-V0-ESTUDO (complemento visao geral) |
| 7 | 3.PROMPT-AI-MINES-PARTE-1.md | 604 | 05-CLAUDE-LOGICA (mecanicas core) |
| 8 | 3.PROMPT-AI-MINES-PARTE-2.md | 564 | 05-CLAUDE-LOGICA (estados, provably fair) |
| 9 | 3.PROMPT-AI-MINES-PARTE-3.md | 478 | 05-CLAUDE-LOGICA (RNG, payout calc) |
| 10 | 3.PROMPT-AI-MINES-PARTE-4-ADENDO.md | 66 | 05-CLAUDE-LOGICA (complemento) |
| 11 | 3.PROMPT-AI-MINES-PARTE-5-ADENDO.md | 54 | 05-CLAUDE-LOGICA (paths consolidados) |
| 12 | 4.ADENDO-DS-MINES-PARTE-1.md | 471 | 04-CLAUDE-POLISH (tokens, paleta) |
| 13 | 4.ADENDO-DS-MINES-PARTE-2.md | 602 | 04-CLAUDE-POLISH (componentes, botoes) |
| 14 | 4.ADENDO-DS-MINES-PARTE-3.md | 713 | 04-CLAUDE-POLISH (animacoes, timelines) |
| 15 | 4.ADENDO-DS-MINES-PARTE-4-ADENDO.md | 27 | 04-CLAUDE-POLISH (complemento) |
| 16 | 4.ADENDO-DS-MINES-PARTE-5-ADENDO.md | 118 | 04-CLAUDE-POLISH (complemento) |
| 17 | 5.ROTEIRO-MINES-PARTE-1.md | 228 | 05-CLAUDE-LOGICA (fase 1 tipos) |
| 18 | 5.ROTEIRO-MINES-PARTE-2.md | 546 | 05-CLAUDE-LOGICA (fase 2 grid engine) |
| 19 | 5.ROTEIRO-MINES-PARTE-3.md | 699 | 05-CLAUDE-LOGICA (fase 3 provably fair) |
| 20 | 5.ROTEIRO-MINES-PARTE-4.md | 744 | 05-CLAUDE-LOGICA (fase 4 backend) |
| 21 | 5.ROTEIRO-MINES-PARTE-5.md | 463 | 05-CLAUDE-LOGICA (fase 5 integracao) |
| 22 | 5.ROTEIRO-MINES-PARTE-7-ADENDO.md | 240 | 05-CLAUDE-LOGICA (adendo roteiro) |
| 23 | 6.PROMPT-V0-MINES-PARTE-1.md | 415 | 02-V0-TELAS-1-3 + 03-V0-TELAS-4-6 |
| 24 | 6.PROMPT-V0-MINES-PARTE-2-ADENDO.md | 84 | 03-V0-TELAS-4-6 (mock JSON) |
| 25 | 6.PROMPT-V0-MINES-PARTE-3-ADENDO.md | 37 | 02-V0-TELAS + 03-V0-TELAS (tooltips) |
| 26 | 7.CSS-COMPONENTES-MINES-PARTE-1.md | 272 | 02-V0-TELAS-1-3 + 04-CLAUDE-POLISH |
| 27 | 7.CSS-COMPONENTES-MINES-PARTE-2.md | 319 | 03-V0-TELAS-4-6 + 04-CLAUDE-POLISH |
| 28 | 7.CSS-COMPONENTES-MINES-PARTE-3-ADENDO.md | 69 | 04-CLAUDE-POLISH (complemento) |
| 29 | 8.BIBLIOTECA-IMAGENS-MINES-PARTE-1.md | 120 | 01-V0-ESTUDO (inventario assets) |
| 30 | 8.BIBLIOTECA-IMAGENS-MINES-PARTE-2.md | 527 | 06-CLAUDE-INTEGRACAO (mapeamento) |
| 31 | 9.GUIA-INTEGRACAO-V0-MINES.md | 241 | 04-CLAUDE-POLISH + 06-CLAUDE-INTEGRACAO |
| 32 | 10.RELATORIO-CORRECAO-MINES.md | 31 | 06-CLAUDE-INTEGRACAO (paths corrigidos) |

**33 documentos. 10.688 linhas. TODOS mapeados. ZERO de fora.**
