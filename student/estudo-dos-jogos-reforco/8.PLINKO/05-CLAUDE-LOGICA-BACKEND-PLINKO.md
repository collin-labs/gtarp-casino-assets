# CONVERSA 5 — CLAUDE LOGICA + BACKEND — PLINKO (#8)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa: student/estudo-dos-jogos/8.PLINKO/0.PESQUISA-REGRA0-PLINKO-PARTE-1.md a PARTE-3-ADENDO.md (3)
Mega Estudo: student/estudo-dos-jogos/8.PLINKO/1.MEGA-ESTUDO-PLINKO-PARTE-1.md e PARTE-2.md (2)
Logica: student/estudo-dos-jogos/8.PLINKO/3.PROMPT-AI-PLINKO-PARTE-1.md a PARTE-5-ADENDO.md (5)
Roteiro: student/estudo-dos-jogos/8.PLINKO/5.ROTEIRO-PLINKO-PARTE-1.md a PARTE-7-ADENDO.md (7)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/plinko/PlinkoLogic.ts, PlinkoTypes.ts, PlinkoConstants.ts, usePlinkoSounds.ts, index.ts
server/handlers/plinko.js | sql/plinko.sql | client/plinko_client.lua

## FASES
3A: Tipos (PegRow, Slot, RiskLevel, GameState) + Constantes (multipliers por rows/risco, slot colors)
3B: Engine (ball path via HMAC — cada peg = left/right bit, determine slot, calculate payout)
3C: Fisica visual (sincronizar path logico com animacao de bounce)
3D: Auto-bet engine (loop, stop conditions)
4A: SQL (casino_plinko_drops, casino_plinko_config)
4B: Handler JS (plinko:drop, plinko:getHistory, plinko:verify, plinko:autoDrop)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
