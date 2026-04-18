# CONVERSA 5 — CLAUDE LOGICA + BACKEND — ROULETTE (#5)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa + Mecanicas:
student/estudo-dos-jogos/5.ROULETTE/0.PESQUISA-REGRA0-ROLETA-PARTE-1.md
student/estudo-dos-jogos/5.ROULETTE/0.PESQUISA-REGRA0-ROLETA-PARTE-2.md
student/estudo-dos-jogos/5.ROULETTE/0.PESQUISA-REGRA0-ROLETA-PARTE-3.md
student/estudo-dos-jogos/5.ROULETTE/0.PESQUISA-REGRA0-ROLETA-PARTE-4-ADENDO.md
student/estudo-dos-jogos/5.ROULETTE/1.MEGA-ESTUDO-ROLETA-PARTE-1.md
student/estudo-dos-jogos/5.ROULETTE/1.MEGA-ESTUDO-ROLETA-PARTE-2.md
student/estudo-dos-jogos/5.ROULETTE/1.MEGA-ESTUDO-ROLETA-PARTE-3.md
student/estudo-dos-jogos/5.ROULETTE/1.MEGA-ESTUDO-ROLETA-PARTE-4-ADENDO.md

Logica:
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-1.md — Core (roda, numeros)
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-2.md — Apostas, payouts
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-3.md — Lightning mode
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-4.md — Provably fair
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-5.md — Estados, API
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-6-ADENDO.md — Complemento
student/estudo-dos-jogos/5.ROULETTE/3.PROMPT-AI-ROLETA-PARTE-7-ADENDO.md — Paths

Roteiro:
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-1.md — Tipos
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-2.md — Wheel engine
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-3.md — Betting, payouts
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-4.md — Lightning mode
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-5.md — Backend
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-6.md — Integracao
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-7-ADENDO.md — Adendo
student/estudo-dos-jogos/5.ROULETTE/5.ROTEIRO-ROLETA-PARTE-8-ADENDO.md — Adendo

Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/roulette/RouletteLogic.ts, RouletteTypes.ts, RouletteConstants.ts, useRouletteSounds.ts, index.ts
server/handlers/roulette.js | sql/roulette.sql | client/roulette_client.lua

## FASES
3A: Tipos (BetType, BetPosition, RouletteNumber, GameState) + Constantes (numeros, cores, payouts)
3B: Engine (spin result via HMAC, evaluate bets, calculate total payout)
3C: Lightning mode (select lucky numbers, assign multipliers, apply to wins)
3D: Betting system (inside bets: straight/split/street/corner/line, outside bets: red/black/odd/even/dozens/columns)
3E: Racetrack bets (Voisins du Zero, Tier du Cylindre, Orphelins)
4A: SQL (casino_roulette_rounds, casino_roulette_bets, casino_roulette_config)
4B: Handler JS (roulette:placeBets, roulette:spin, roulette:getHistory, roulette:verify)
4C: Lua client + conectar frontend

1 fase por entrega. Edicoes cirurgicas. Mock funcional.
