# CONVERSA 5 — CLAUDE LOGICA + BACKEND — MINES (#3)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## DOCS — LER DO PROJETO (TODOS — na integra)

Contexto profundo (pesquisa + mecanicas):
student/estudo-dos-jogos/3.MINES/0.PESQUISA-REGRA0-MINES-PARTE-1.md
student/estudo-dos-jogos/3.MINES/0.PESQUISA-REGRA0-MINES-PARTE-2.md
student/estudo-dos-jogos/3.MINES/1.MEGA-ESTUDO-MINES-PARTE-1.md
student/estudo-dos-jogos/3.MINES/1.MEGA-ESTUDO-MINES-PARTE-2.md

Logica do jogo (OBRIGATORIO):
student/estudo-dos-jogos/3.MINES/3.PROMPT-AI-MINES-PARTE-1.md — Mecanicas core, grid, tiles
student/estudo-dos-jogos/3.MINES/3.PROMPT-AI-MINES-PARTE-2.md — Estados, provably fair
student/estudo-dos-jogos/3.MINES/3.PROMPT-AI-MINES-PARTE-3.md — RNG, payout calculation
student/estudo-dos-jogos/3.MINES/3.PROMPT-AI-MINES-PARTE-4-ADENDO.md — Complemento
student/estudo-dos-jogos/3.MINES/3.PROMPT-AI-MINES-PARTE-5-ADENDO.md — Paths consolidados

Roteiro (OBRIGATORIO):
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-1.md — Tipos + estrutura
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-2.md — Grid engine
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-3.md — Provably fair
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-4.md — Backend SQL+Handler
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-5.md — Lua + integracao
student/estudo-dos-jogos/3.MINES/5.ROTEIRO-MINES-PARTE-7-ADENDO.md — Adendo roteiro

Referencia patterns:
server/handlers/panel.js, client/panel_client.lua, sql/panel.sql, hooks/use-game-api.ts

## CRIAR
components/games/mines/MinesLogic.ts, MinesTypes.ts, MinesConstants.ts, useMinesSounds.ts, index.ts
server/handlers/mines.js | sql/mines.sql | client/mines_client.lua

## FASES
3A: Tipos+Constantes
3B: Engine (grid 5x5, mine placement, tile reveal, payout calc, provably fair HMAC-SHA256)
3C: Integrar logica no visual (state machine: idle→playing→win/bust)
4A: SQL (casino_mines_rounds, casino_mines_config)
4B: Handler JS (mines:bet, mines:reveal, mines:cashout, mines:getHistory, mines:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas. Mock funcional no browser.
