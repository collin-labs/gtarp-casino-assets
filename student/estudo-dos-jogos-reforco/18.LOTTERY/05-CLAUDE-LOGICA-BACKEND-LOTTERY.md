# CONVERSA 5 — CLAUDE LOGICA + BACKEND — LOTTERY (#18)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/18.LOTTERY/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/18.LOTTERY/1.MEGA-ESTUDO-*.md (2)
Logica: student/estudo-dos-jogos/18.LOTTERY/4.PROMPT-AI-*.md (4)
Roteiro: student/estudo-dos-jogos/18.LOTTERY/6.ROTEIRO-*.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/lottery/LotteryLogic.ts, LotteryTypes.ts, LotteryConstants.ts, useLotterySounds.ts, index.ts
server/handlers/lottery.js | sql/lottery.sql | client/lottery_client.lua

## FASES
3A: Tipos (Ticket 6 numeros, DrawResult 6+mega, MegaBallMultiplier, MatchCount) + Constantes (1-60, payouts por acerto, multipliers)
3B: Engine (generate ticket, draw 6 from 60 via HMAC, match count, calculate payout)
3C: Mega Ball (select multiplier via HMAC, check if mega completes match, apply multiplier)
3D: Jackpot progressivo (pool accumulates, conditions to win)
3E: Quick Pick (Fisher-Yates shuffle)
3F: Provably Fair (HMAC-SHA256 per draw)
4A: SQL (casino_lottery_draws, casino_lottery_tickets, casino_lottery_jackpot)
4B: Handler JS (lottery:buyTicket, lottery:draw, lottery:quickPick, lottery:getHistory, lottery:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
