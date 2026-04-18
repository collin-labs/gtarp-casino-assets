# CONVERSA 5 — CLAUDE LOGICA + BACKEND — ANIMAL GAME (#9)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa: student/estudo-dos-jogos/9.ANIMAL-GAME/0.PESQUISA-REGRA0-ANIMAL-GAME-PARTE-1.md a PARTE-4-ADENDO.md (4)
Mega Estudo: student/estudo-dos-jogos/9.ANIMAL-GAME/1.MEGA-ESTUDO-ANIMAL-GAME-PARTE-1.md a PARTE-3.md (3)
Logica: student/estudo-dos-jogos/9.ANIMAL-GAME/3.PROMPT-AI-ANIMAL-GAME-PARTE-1.md a PARTE-5-ADENDO.md (5)
Roteiro: student/estudo-dos-jogos/9.ANIMAL-GAME/5.ROTEIRO-ANIMAL-GAME-PARTE-1.md a PARTE-7-ADENDO.md (7)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/animal-game/AnimalGameLogic.ts, AnimalGameTypes.ts, AnimalGameConstants.ts, useAnimalSounds.ts, index.ts
server/handlers/animal-game.js | sql/animal-game.sql | client/animal-game_client.lua

## FASES
3A: Tipos (AnimalGroup 1-25, BetType grupo/dezena/centena/milhar, DrawResult 5 numeros) + Constantes (25 animais, payouts por tipo)
3B: Engine (gerar 5 numeros via HMAC, mapear numeros→grupos, evaluate bets)
3C: Regras do Bicho (dezena = ultimos 2 digitos, centena = 3, milhar = 4, grupo = qual animal os digitos mapeiam)
3D: Integrar logica no visual
4A: SQL (casino_bicho_draws, casino_bicho_bets, casino_bicho_config + 25 animais seed)
4B: Handler JS (bicho:placeBet, bicho:draw, bicho:getHistory, bicho:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
