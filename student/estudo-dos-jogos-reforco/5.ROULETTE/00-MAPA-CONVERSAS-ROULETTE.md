# MAPA DE CONVERSAS — ROULETTE / ROLETA (#5)
# Blackout Casino GTARP — 01/04/2026

## 6 CONVERSAS (3 V0 + 3 Claude)
01-V0-ESTUDO .............. Estudo + regras + paths + confirmacao
02-V0-TELAS-1-4 ........... ModeSelect, Mesa Apostas, Lightning Phase, Spinning
03-V0-TELAS-5-8 ........... Resultado Win, Resultado Lose, Big Win, History+PF
04-CLAUDE-POLISH .......... Aplicar Doc 4 + Doc 7, corrigir visual
05-CLAUDE-LOGICA-BACKEND .. Engine roleta + SQL + Handler + Lua
06-CLAUDE-INTEGRACAO ...... Integrar no painel + QA

## ASSETS
Game: public/assets/games/roulette/ — 19 arquivos existentes:
  wheel-european.png, ball.png, felt-texture.png, lightning-bolt.png, racetrack-icon.png
  chips/ (8 valores: 1,5,10,25,50,100,500,1000)
  multipliers/ (6 valores: 50x,100x,200x,300x,400x,500x)
FALTAM 4 ASSETS: frame-wheel.png, mode-classic.png, mode-lightning.png, icon-spin.png
  (Doc 8 tem prompts de criacao — gerar antes do V0 ou usar alternativa CSS)
Cards/Logos: 5.ROULETTE-IMAGE, LOGO-BR, LOGO-IN
Video: hero/5.roulette.webm
Sons: ZERO mp3 — Web Audio procedural

## CHECKLIST — TODOS OS 39 DOCUMENTOS

| # | Arquivo | Linhas | Usado em |
|---|---------|:------:|----------|
| 1 | 0.PESQUISA-REGRA0-ROLETA-PARTE-1.md | 257 | 05-LOGICA (pesquisa) |
| 2 | 0.PESQUISA-REGRA0-ROLETA-PARTE-2.md | 283 | 05-LOGICA (pesquisa) |
| 3 | 0.PESQUISA-REGRA0-ROLETA-PARTE-3.md | 303 | 05-LOGICA (pesquisa) |
| 4 | 0.PESQUISA-REGRA0-ROLETA-PARTE-4-ADENDO.md | 23 | 05-LOGICA (complemento) |
| 5 | 1.MEGA-ESTUDO-ROLETA-PARTE-1.md | 191 | 05-LOGICA (mecanicas) |
| 6 | 1.MEGA-ESTUDO-ROLETA-PARTE-2.md | 265 | 05-LOGICA (mecanicas) |
| 7 | 1.MEGA-ESTUDO-ROLETA-PARTE-3.md | 159 | 05-LOGICA (mecanicas) |
| 8 | 1.MEGA-ESTUDO-ROLETA-PARTE-4-ADENDO.md | 334 | 05-LOGICA (complemento) |
| 9 | 2.GUIA-DO-JOGO-ROLETA.md | 281 | 01-V0-ESTUDO (visao geral) |
| 10 | 3.PROMPT-AI-ROLETA-PARTE-1.md | 293 | 05-LOGICA (mecanicas core) |
| 11 | 3.PROMPT-AI-ROLETA-PARTE-2.md | 363 | 05-LOGICA (apostas, payouts) |
| 12 | 3.PROMPT-AI-ROLETA-PARTE-3.md | 390 | 05-LOGICA (lightning mode) |
| 13 | 3.PROMPT-AI-ROLETA-PARTE-4.md | 319 | 05-LOGICA (provably fair) |
| 14 | 3.PROMPT-AI-ROLETA-PARTE-5.md | 239 | 05-LOGICA (estados, API) |
| 15 | 3.PROMPT-AI-ROLETA-PARTE-6-ADENDO.md | 117 | 05-LOGICA (complemento) |
| 16 | 3.PROMPT-AI-ROLETA-PARTE-7-ADENDO.md | 56 | 05-LOGICA (paths) |
| 17 | 4.ADENDO-DS-ROLETA-PARTE-1.md | 477 | 04-POLISH (tokens, paleta) |
| 18 | 4.ADENDO-DS-ROLETA-PARTE-2.md | 647 | 04-POLISH (componentes) |
| 19 | 4.ADENDO-DS-ROLETA-PARTE-3.md | 666 | 04-POLISH (animacoes) |
| 20 | 4.ADENDO-DS-ROLETA-PARTE-4.md | 497 | 04-POLISH (estados) |
| 21 | 4.ADENDO-DS-ROLETA-PARTE-5-ADENDO.md | 104 | 04-POLISH (complemento) |
| 22 | 4.ADENDO-DS-ROLETA-PARTE-6-ADENDO.md | 46 | 04-POLISH (complemento) |
| 23 | 5.ROTEIRO-ROLETA-PARTE-1.md | 234 | 05-LOGICA (tipos) |
| 24 | 5.ROTEIRO-ROLETA-PARTE-2.md | 620 | 05-LOGICA (wheel engine) |
| 25 | 5.ROTEIRO-ROLETA-PARTE-3.md | 597 | 05-LOGICA (betting, payouts) |
| 26 | 5.ROTEIRO-ROLETA-PARTE-4.md | 737 | 05-LOGICA (lightning mode) |
| 27 | 5.ROTEIRO-ROLETA-PARTE-5.md | 900 | 05-LOGICA (backend) |
| 28 | 5.ROTEIRO-ROLETA-PARTE-6.md | 600 | 05-LOGICA (integracao) |
| 29 | 5.ROTEIRO-ROLETA-PARTE-7-ADENDO.md | 181 | 05-LOGICA (adendo) |
| 30 | 5.ROTEIRO-ROLETA-PARTE-8-ADENDO.md | 187 | 05-LOGICA (adendo) |
| 31 | 6.PROMPT-V0-ROLETA-PARTE-1.md | 405 | 02-V0-TELAS + 03-V0-TELAS |
| 32 | 6.PROMPT-V0-ROLETA-PARTE-2-ADENDO.md | 196 | 02+03-V0-TELAS (mock+tooltips) |
| 33 | 7.CSS-COMPONENTES-ROLETA-PARTE-1.md | 807 | 02-V0 + 04-POLISH (@keyframes) |
| 34 | 7.CSS-COMPONENTES-ROLETA-PARTE-2-ADENDO.md | 196 | 03-V0 + 04-POLISH |
| 35 | 7.CSS-COMPONENTES-ROLETA-PARTE-3-ADENDO.md | 63 | 04-POLISH (complemento) |
| 36 | 8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-1.md | 104 | 01-V0-ESTUDO (inventario) |
| 37 | 8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-2.md | 349 | 01-V0-ESTUDO (prompts criar) |
| 38 | 8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-3.md | 461 | 06-INTEGRACAO (mapeamento) |
| 39 | 9.GUIA-INTEGRACAO-V0-ROLETA.md | 208 | 04-POLISH + 06-INTEGRACAO |

**39 documentos. 13.155 linhas. TODOS mapeados. ZERO de fora.**
**NOTA: Sem Doc 10 (Relatorio) para Roulette.**
