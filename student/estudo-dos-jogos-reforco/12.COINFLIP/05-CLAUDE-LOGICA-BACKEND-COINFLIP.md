# CONVERSA 5 — CLAUDE LOGICA + BACKEND — COINFLIP (#12)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/12.COINFLIP/0.PESQUISA-REGRA0-COINFLIP-PARTE-1.md a PARTE-4-ADENDO.md (4)
Mega Estudo: student/estudo-dos-jogos/12.COINFLIP/1.MEGA-ESTUDO-COINFLIP-PARTE-1.md e PARTE-2.md (2)
Logica: student/estudo-dos-jogos/12.COINFLIP/3.PROMPT-AI-COINFLIP-PARTE-1.md a PARTE-6-ADENDO.md (6)
Roteiro: student/estudo-dos-jogos/12.COINFLIP/5.ROTEIRO-COINFLIP-PARTE-1.md a PARTE-7-ADENDO.md (7)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/coinflip/CoinflipLogic.ts, CoinflipTypes.ts, CoinflipConstants.ts, useCoinflipSounds.ts, index.ts
server/handlers/coinflip.js | sql/coinflip.sql | client/coinflip_client.lua

## FASES
3A: Tipos (CoinSide heads/tails, Room, RoomState, Player) + Constantes (house edge, min/max bet)
3B: Engine (create room, join, flip via HMAC → heads/tails, determine winner, payout)
3C: Lobby system (list rooms, filter, join, leave, timeout auto-cancel)
3D: Leaderboard (wins, profit ranking, top 20)
3E: Provably Fair (HMAC-SHA256 → bit 0 = heads/tails)
4A: SQL (casino_coinflip_rooms, casino_coinflip_history, casino_coinflip_leaderboard)
4B: Handler JS (coinflip:create, coinflip:join, coinflip:flip, coinflip:getHistory, coinflip:getLeaderboard, coinflip:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
