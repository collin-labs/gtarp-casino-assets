# CONVERSA 5 — CLAUDE LOGICA + BACKEND — JACKPOT (#13)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/13.JACKPOT/0.PESQUISA-REGRA0-JACKPOT-PARTE-1.md a PARTE-5-ADENDO.md (5)
Mega Estudo: student/estudo-dos-jogos/13.JACKPOT/1.MEGA-ESTUDO-JACKPOT-PARTE-1.md a PARTE-3-ADENDO.md (3)
Logica: student/estudo-dos-jogos/13.JACKPOT/3.PROMPT-AI-JACKPOT-PARTE-1.md a PARTE-4-ADENDO.md (4)
Roteiro: student/estudo-dos-jogos/13.JACKPOT/5.ROTEIRO-JACKPOT-PARTE-1.md a PARTE-5-ADENDO.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/jackpot/JackpotLogic.ts, JackpotTypes.ts, JackpotConstants.ts, useJackpotSounds.ts, index.ts
server/handlers/jackpot.js | sql/jackpot.sql | client/jackpot_client.lua

## FASES
3A: Tipos (PotState, Player, Ticket, RoundPhase open/spinning/result) + Constantes (10 cores, house edge 5%, min/max deposit, timer 20s)
3B: Engine (deposit → ticket range, close pot → spin, HMAC → winning ticket mod totalTickets, determine winner)
3C: Real-time updates (broadcast pot changes, donut recalc, player join/deposit events)
3D: Multi-deposit (mesmo jogador pode depositar varias vezes, acumula tickets)
3E: Provably Fair (server seed + client seeds concatenados + nonce)
4A: SQL (casino_jackpot_rounds, casino_jackpot_deposits, casino_jackpot_config)
4B: Handler JS (jackpot:deposit, jackpot:getRound, jackpot:getHistory, jackpot:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
