# CONVERSA 5 — CLAUDE LOGICA + BACKEND — GIVEAWAYS (#20)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/20.GIVEAWAYS/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/20.GIVEAWAYS/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/20.GIVEAWAYS/3.PROMPT-AI-*.md (4)
Roteiro: student/estudo-dos-jogos/20.GIVEAWAYS/5.ROTEIRO-*.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/giveaways/GiveawaysLogic.ts, GiveawaysTypes.ts, GiveawaysConstants.ts, useGiveawaysSounds.ts, index.ts
server/handlers/giveaways.js | sql/giveaways.sql | client/giveaways_client.lua

## FASES
3A: Tipos (Giveaway, GiveawayStatus, Ticket, DrawResult) + Constantes
3B: Engine (create giveaway admin, buy tickets, draw winner via HMAC, distribute prize)
3C: Countdown system (server-side timer, auto-draw when countdown=0)
3D: Ticket system (buy, validate, max per player, sold out)
3E: Provably Fair (HMAC-SHA256 per draw, ticket index selection)
4A: SQL (casino_giveaways, casino_giveaway_tickets, casino_giveaway_draws)
4B: Handler JS (giveaway:list, giveaway:buyTicket, giveaway:draw, giveaway:getHistory, giveaway:verify, giveaway:adminCreate)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
