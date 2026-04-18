# MAPA DE CONVERSAS — COINFLIP (#12)
# Blackout Casino GTARP — 01/04/2026

## 6 CONVERSAS (3 V0 + 3 Claude)
01-V0-ESTUDO .............. Estudo + regras + paths + confirmacao
02-V0-TELAS-1-4 ........... Lobby, Criar Sala, Entrar Sala, Flip (moeda 3D)
03-V0-TELAS-5-8 ........... Resultado, Historico, Leaderboard, Provably Fair
04-CLAUDE-POLISH .......... Aplicar Doc 4 + Doc 7, corrigir visual
05-CLAUDE-LOGICA-BACKEND .. Engine coinflip + SQL + Handler + Lua
06-CLAUDE-INTEGRACAO ...... Integrar no painel + QA

## ASSETS
Game: public/assets/games/coinflip/ — PASTA NAO EXISTE (11 a criar)
  Moeda: coin-heads.png (face cara), coin-tails.png (face coroa) — CRIAR
  Mini: coin-heads-mini.png, coin-tails-mini.png — CRIAR
  Icons: 7 icons exclusivos — CRIAR (ou reutilizar shared)
Cards/Logos: 12.COINFLIP-IMAGE, LOGO-BR, LOGO-IN, Dourada, Pedestal — EXISTEM
Video: hover/12.coinflip.webm — EXISTE
Icons shared: gcoin, provably-fair, history, sound-on/off, copy — EXISTEM
NOTA: Tratar como se assets JA existissem (serao criados antes do V0).

## CHECKLIST — TODOS OS 35 DOCUMENTOS

| # | Arquivo | Linhas | Usado em |
|---|---------|:------:|----------|
| 1 | 0.PESQUISA-REGRA0-COINFLIP-PARTE-1.md | 253 | 05-LOGICA |
| 2 | 0.PESQUISA-REGRA0-COINFLIP-PARTE-2.md | 548 | 05-LOGICA |
| 3 | 0.PESQUISA-REGRA0-COINFLIP-PARTE-3-ADENDO.md | 127 | 05-LOGICA |
| 4 | 0.PESQUISA-REGRA0-COINFLIP-PARTE-4-ADENDO.md | 23 | 05-LOGICA |
| 5 | 1.MEGA-ESTUDO-COINFLIP-PARTE-1.md | 239 | 05-LOGICA |
| 6 | 1.MEGA-ESTUDO-COINFLIP-PARTE-2.md | 561 | 05-LOGICA |
| 7 | 2.GUIA-DO-JOGO-COINFLIP.md | 294 | 01-V0-ESTUDO |
| 8 | 3.PROMPT-AI-COINFLIP-PARTE-1.md | 805 | 05-LOGICA |
| 9 | 3.PROMPT-AI-COINFLIP-PARTE-2.md | 812 | 05-LOGICA |
| 10 | 3.PROMPT-AI-COINFLIP-PARTE-3.md | 579 | 05-LOGICA |
| 11 | 3.PROMPT-AI-COINFLIP-PARTE-4.md | 448 | 05-LOGICA |
| 12 | 3.PROMPT-AI-COINFLIP-PARTE-5-ADENDO.md | 181 | 05-LOGICA |
| 13 | 3.PROMPT-AI-COINFLIP-PARTE-6-ADENDO.md | 45 | 05-LOGICA |
| 14 | 4.ADENDO-DS-COINFLIP-PARTE-1.md | 682 | 04-POLISH |
| 15 | 4.ADENDO-DS-COINFLIP-PARTE-2.md | 751 | 04-POLISH |
| 16 | 4.ADENDO-DS-COINFLIP-PARTE-3.md | 632 | 04-POLISH |
| 17 | 4.ADENDO-DS-COINFLIP-PARTE-4.md | 111 | 04-POLISH |
| 18 | 5.ROTEIRO-COINFLIP-PARTE-1.md | 449 | 05-LOGICA |
| 19 | 5.ROTEIRO-COINFLIP-PARTE-2.md | 627 | 05-LOGICA |
| 20 | 5.ROTEIRO-COINFLIP-PARTE-3.md | 405 | 05-LOGICA |
| 21 | 5.ROTEIRO-COINFLIP-PARTE-4.md | 541 | 05-LOGICA |
| 22 | 5.ROTEIRO-COINFLIP-PARTE-5.md | 248 | 05-LOGICA |
| 23 | 5.ROTEIRO-COINFLIP-PARTE-6-ADENDO.md | 238 | 05-LOGICA |
| 24 | 5.ROTEIRO-COINFLIP-PARTE-7-ADENDO.md | 238 | 05-LOGICA |
| 25 | 6.PROMPT-V0-COINFLIP-PARTE-1.md | 373 | 02-V0-TELAS-1-4 |
| 26 | 6.PROMPT-V0-COINFLIP-PARTE-2.md | 246 | 03-V0-TELAS-5-8 |
| 27 | 6.PROMPT-V0-COINFLIP-PARTE-3-ADENDO.md | 32 | 02+03-V0 |
| 28 | 7.CSS-COMPONENTES-COINFLIP-PARTE-1.md | 771 | 02-V0 + 04-POLISH |
| 29 | 7.CSS-COMPONENTES-COINFLIP-PARTE-2.md | 866 | 03-V0 + 04-POLISH |
| 30 | 7.CSS-COMPONENTES-COINFLIP-PARTE-3-ADENDO.md | 205 | 04-POLISH |
| 31 | 7.CSS-COMPONENTES-COINFLIP-PARTE-4-ADENDO.md | 55 | 04-POLISH |
| 32 | 8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-1.md | 381 | 01-V0-ESTUDO |
| 33 | 8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-2.md | 483 | 01-V0-ESTUDO |
| 34 | 8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-3.md | 314 | 06-INTEGRACAO |
| 35 | 9.GUIA-INTEGRACAO-V0-COINFLIP.md | 263 | 04-POLISH + 06-INTEG |

**35 documentos. 13.826 linhas. TODOS mapeados. ZERO de fora.**
**NOTA: Sem Doc 10 (Relatorio) para Coinflip.**
