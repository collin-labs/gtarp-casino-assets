# CONVERSA 5 — CLAUDE LOGICA + BACKEND — BRAZILIAN ROULETTE (#10)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/0.PESQUISA-*.md (4 arquivos)
Mega Estudo: student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/1.MEGA-ESTUDO-*.md (3 arquivos)
Logica: student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/3.PROMPT-AI-*.md (5 arquivos)
Roteiro: student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/5.ROTEIRO-*.md (5 arquivos)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/brazilian-roulette/BRRouletteLogic.ts, BRRouletteTypes.ts, BRRouletteConstants.ts, useBRRouletteSounds.ts, index.ts
server/handlers/brazilian-roulette.js | sql/brazilian-roulette.sql | client/brazilian-roulette_client.lua

## FASES
3A: Tipos (3 GameMode, BetType inside/outside/special, LightningNumber) + Constantes (37 numeros, payouts por modo, multiplicadores)
3B: Engine Classica (spin HMAC, evaluate bets, payouts padrao 35:1)
3C: Engine Relampago (select lightning numbers, assign multipliers 50/100/200/500, payout base 29:1 + multiplicador)
3D: Engine Mini/Double (15 casas, simplificado, payouts diferentes)
3E: Apostas especiais (Finales en Plein, Vizinhos do Zero, Full Complete, racetrack)
3F: Provably Fair
4A: SQL (casino_br_roulette_rounds, _bets, _config)
4B: Handler JS
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
