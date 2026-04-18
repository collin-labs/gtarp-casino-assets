# MAPA DE CONVERSAS — DICE / DADOS (#7)
# Blackout Casino GTARP — 01/04/2026

## 6 CONVERSAS (3 V0 + 3 Claude)
01-V0-ESTUDO .............. Estudo + regras + paths + confirmacao
02-V0-TELAS-1-4 ........... Idle (betting), Lightning Phase, Rolling 3D, Result
03-V0-TELAS-5-8 ........... Big Win, History, Provably Fair, Auto-Bet
04-CLAUDE-POLISH .......... Aplicar Doc 4 + Doc 7, corrigir visual
05-CLAUDE-LOGICA-BACKEND .. Engine dice + SQL + Handler + Lua
06-CLAUDE-INTEGRACAO ...... Integrar no painel + QA

## ASSETS — TODOS EXISTEM (zero faltando)
Game: public/assets/games/dice/ — 2 arquivos (legado, nao essenciais)
NOTA: Dados sao renderizados como CUBOS CSS 3D (rotateX/Y/Z com Framer Motion). NAO usam PNGs de face.
Cards/Logos: image-para-cards/7.*, logos-br/7.*, logos-in/7.*, dourada/7.*, pedestal/7.*, hero logos
Icons shared: sound-on/off, history, provably-fair, auto-bet, auto, copy, gcoin
UI: bg-casino.png
Sons: ZERO mp3 — Web Audio procedural

## CHECKLIST — TODOS OS 32 DOCUMENTOS

| # | Arquivo | Linhas | Usado em |
|---|---------|:------:|----------|
| 1 | 0.PESQUISA-REGRA0-DICE-PARTE-1.md | 343 | 05-LOGICA |
| 2 | 0.PESQUISA-REGRA0-DICE-PARTE-2.md | 460 | 05-LOGICA |
| 3 | 0.PESQUISA-REGRA0-DICE-PARTE-3-ADENDO.md | 36 | 05-LOGICA |
| 4 | 1.MEGA-ESTUDO-DICE-PARTE-1.md | 261 | 05-LOGICA |
| 5 | 1.MEGA-ESTUDO-DICE-PARTE-2.md | 533 | 05-LOGICA |
| 6 | 2.GUIA-DO-JOGO-DICE.md | 257 | 01-V0-ESTUDO |
| 7 | 2.GUIA-DO-JOGO-DICE-PARTE-2-ADENDO.md | 45 | 01-V0-ESTUDO |
| 8 | 3.PROMPT-AI-DICE-PARTE-1.md | 677 | 05-LOGICA |
| 9 | 3.PROMPT-AI-DICE-PARTE-2.md | 579 | 05-LOGICA |
| 10 | 3.PROMPT-AI-DICE-PARTE-3.md | 827 | 05-LOGICA |
| 11 | 3.PROMPT-AI-DICE-PARTE-4.md | 357 | 05-LOGICA |
| 12 | 3.PROMPT-AI-DICE-PARTE-5-ADENDO.md | 150 | 05-LOGICA |
| 13 | 3.PROMPT-AI-DICE-PARTE-6-ADENDO.md | 54 | 05-LOGICA |
| 14 | 4.ADENDO-DS-DICE-PARTE-1.md | 561 | 04-POLISH |
| 15 | 4.ADENDO-DS-DICE-PARTE-2.md | 613 | 04-POLISH |
| 16 | 4.ADENDO-DS-DICE-PARTE-3.md | 807 | 04-POLISH |
| 17 | 5.ROTEIRO-DICE-PARTE-1.md | 388 | 05-LOGICA |
| 18 | 5.ROTEIRO-DICE-PARTE-2.md | 765 | 05-LOGICA |
| 19 | 5.ROTEIRO-DICE-PARTE-3.md | 685 | 05-LOGICA |
| 20 | 5.ROTEIRO-DICE-PARTE-4.md | 481 | 05-LOGICA |
| 21 | 5.ROTEIRO-DICE-PARTE-5-ADENDO.md | 288 | 05-LOGICA |
| 22 | 5.ROTEIRO-DICE-PARTE-6-ADENDO.md | 237 | 05-LOGICA |
| 23 | 6.PROMPT-V0-DICE-PARTE-1.md | 249 | 02-V0-TELAS-1-4 |
| 24 | 6.PROMPT-V0-DICE-PARTE-2.md | 329 | 03-V0-TELAS-5-8 |
| 25 | 6.PROMPT-V0-DICE-PARTE-3-ADENDO.md | 30 | 02+03-V0 (mock+tooltips) |
| 26 | 7.CSS-COMPONENTES-DICE-PARTE-1.md | 783 | 02-V0 + 04-POLISH |
| 27 | 7.CSS-COMPONENTES-DICE-PARTE-2.md | 652 | 03-V0 + 04-POLISH |
| 28 | 7.CSS-COMPONENTES-DICE-PARTE-3-ADENDO.md | 195 | 04-POLISH |
| 29 | 7.CSS-COMPONENTES-DICE-PARTE-4-ADENDO.md | 61 | 04-POLISH |
| 30 | 8.BIBLIOTECA-IMAGENS-DICE-PARTE-1.md | 560 | 01-V0-ESTUDO |
| 31 | 8.BIBLIOTECA-IMAGENS-DICE-PARTE-2.md | 531 | 01-V0-ESTUDO |
| 32 | 9.GUIA-INTEGRACAO-V0-DICE.md | 201 | 04-POLISH + 06-INTEG |

**32 documentos. 12.995 linhas. TODOS mapeados. ZERO de fora.**
**NOTA: Sem Doc 10 (Relatorio) para Dice.**
