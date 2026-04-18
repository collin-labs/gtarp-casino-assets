# MAPA DE CONVERSAS — BLACKJACK / VINTE E UM (#4)
# Blackout Casino GTARP — 01/04/2026

## 6 CONVERSAS (3 V0 + 3 Claude)
01-V0-ESTUDO .............. Estudo + regras + paths + confirmacao
02-V0-TELAS-1-4 ........... Betting, Player Turn, Insurance, Split
03-V0-TELAS-5-7 ........... Dealer Turn, Resultado (5 variantes), History+PF
04-CLAUDE-POLISH .......... Aplicar Doc 4 + Doc 7, corrigir visual
05-CLAUDE-LOGICA-BACKEND .. Engine BJ + SQL + Handler + Lua
06-CLAUDE-INTEGRACAO ...... Integrar no painel + QA

## ASSETS
Game: public/assets/games/blackjack/ — 14 arquivos (card-back, 6 chips, felt-texture, 6 icons)
Cards/Logos: 4.BLACKJACK-IMAGE-1152_768.png, LOGO-BR, LOGO-IN
Video: 4.blackjack.webm
Icons shared: /assets/shared/icons/ (gcoin, provably-fair, history, insurance, new-hand, cards-spread, chip-stack, sound-on, sound-off, copy)
UI: /assets/shared/ui/bg-casino.png
Sons: ZERO mp3 — usar Web Audio procedural
Doc 8 dizia "11 a CRIAR" mas TODOS JA EXISTEM no disco (foram criados apos o doc).

## CHECKLIST — TODOS OS 34 DOCUMENTOS

| # | Arquivo | Linhas | Usado em |
|---|---------|:------:|----------|
| 1 | 0.PESQUISA-REGRA0-BLACKJACK-PARTE-1.md | 410 | 05-LOGICA (contexto pesquisa) |
| 2 | 0.PESQUISA-REGRA0-BLACKJACK-PARTE-2.md | 396 | 05-LOGICA (contexto pesquisa) |
| 3 | 1.MEGA-ESTUDO-BLACKJACK-PARTE-1.md | 220 | 05-LOGICA (mecanicas profundas) |
| 4 | 1.MEGA-ESTUDO-BLACKJACK-PARTE-2.md | 642 | 05-LOGICA (mecanicas profundas) |
| 5 | 2.GUIA-DO-JOGO-BLACKJACK.md | 280 | 01-V0-ESTUDO (visao geral) |
| 6 | 3.PROMPT-AI-BLACKJACK-PARTE-1.md | 713 | 05-LOGICA (mecanicas core) |
| 7 | 3.PROMPT-AI-BLACKJACK-PARTE-2.md | 597 | 05-LOGICA (estados, decisoes) |
| 8 | 3.PROMPT-AI-BLACKJACK-PARTE-3.md | 677 | 05-LOGICA (provably fair, RNG) |
| 9 | 3.PROMPT-AI-BLACKJACK-PARTE-4-ADENDO.md | 119 | 05-LOGICA (mock data) |
| 10 | 3.PROMPT-AI-BLACKJACK-PARTE-5-ADENDO.md | 63 | 05-LOGICA (paths consolidados) |
| 11 | 4.ADENDO-DS-BLACKJACK-PARTE-1.md | 567 | 04-POLISH (tokens, paleta) |
| 12 | 4.ADENDO-DS-BLACKJACK-PARTE-2.md | 727 | 04-POLISH (componentes, botoes) |
| 13 | 4.ADENDO-DS-BLACKJACK-PARTE-3.md | 496 | 04-POLISH (animacoes, timelines) |
| 14 | 4.ADENDO-DS-BLACKJACK-PARTE-4-ADENDO.md | 78 | 04-POLISH (complemento) |
| 15 | 4.ADENDO-DS-BLACKJACK-PARTE-5-ADENDO.md | 64 | 04-POLISH (complemento) |
| 16 | 5.ROTEIRO-BLACKJACK-PARTE-1.md | 284 | 05-LOGICA (fase 1 tipos) |
| 17 | 5.ROTEIRO-BLACKJACK-PARTE-2.md | 943 | 05-LOGICA (fase 2 engine) |
| 18 | 5.ROTEIRO-BLACKJACK-PARTE-3.md | 579 | 05-LOGICA (fase 3 split/insurance) |
| 19 | 5.ROTEIRO-BLACKJACK-PARTE-4.md | 1195 | 05-LOGICA (fase 4 backend) |
| 20 | 5.ROTEIRO-BLACKJACK-PARTE-5.md | 948 | 05-LOGICA (fase 5 integracao) |
| 21 | 5.ROTEIRO-BLACKJACK-PARTE-6-ADENDO.md | 175 | 05-LOGICA (adendo) |
| 22 | 5.ROTEIRO-BLACKJACK-PARTE-7-ADENDO.md | 195 | 05-LOGICA (adendo) |
| 23 | 6.PROMPT-V0-BLACKJACK-PARTE-1.md | 452 | 02-V0-TELAS-1-4 (wireframes T1-T4) |
| 24 | 6.PROMPT-V0-BLACKJACK-PARTE-2.md | 333 | 03-V0-TELAS-5-7 (wireframes T5-T7) |
| 25 | 6.PROMPT-V0-BLACKJACK-PARTE-3-ADENDO.md | 142 | 02+03-V0-TELAS (mock JSON, tooltips) |
| 26 | 7.CSS-COMPONENTES-BLACKJACK-PARTE-1.md | 617 | 02-V0-TELAS + 04-POLISH (@keyframes) |
| 27 | 7.CSS-COMPONENTES-BLACKJACK-PARTE-2.md | 547 | 03-V0-TELAS + 04-POLISH (mais @keyframes) |
| 28 | 7.CSS-COMPONENTES-BLACKJACK-PARTE-3-ADENDO.md | 145 | 04-POLISH (complemento CSS) |
| 29 | 7.CSS-COMPONENTES-BLACKJACK-PARTE-4-ADENDO.md | 58 | 04-POLISH (complemento CSS) |
| 30 | 8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-1.md | 130 | 01-V0-ESTUDO (inventario assets) |
| 31 | 8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-2.md | 467 | 01-V0-ESTUDO (prompts — JA CRIADOS) |
| 32 | 8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-3.md | 465 | 06-INTEGRACAO (mapeamento) |
| 33 | 9.GUIA-INTEGRACAO-V0-BLACKJACK.md | 219 | 04-POLISH + 06-INTEGRACAO |
| 34 | 9.GUIA-INTEGRACAO-V0-BLACKJACK-PARTE-2-ADENDO.md | 54 | 06-INTEGRACAO (complemento) |

**34 documentos. 13.997 linhas. TODOS mapeados. ZERO de fora.**
