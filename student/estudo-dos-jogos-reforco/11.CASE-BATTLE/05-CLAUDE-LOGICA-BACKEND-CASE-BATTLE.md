# CONVERSA 5 — CLAUDE LOGICA + BACKEND — CASE BATTLE (#11)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/11.CASE-BATTLE/0.PESQUISA-REGRA0-CASE-BATTLE-PARTE-0.md a PARTE-3.md (4)
Mega Estudo: student/estudo-dos-jogos/11.CASE-BATTLE/1.MEGA-ESTUDO-CASE-BATTLE-PARTE-1.md a PARTE-3-ADENDO.md (3)
Logica: student/estudo-dos-jogos/11.CASE-BATTLE/3.PROMPT-AI-CASE-BATTLE-PARTE-1.md a PARTE-5-ADENDO.md (6)
Roteiro: student/estudo-dos-jogos/11.CASE-BATTLE/5.ROTEIRO-CASE-BATTLE-PARTE-1.md a PARTE-7-ADENDO.md (7)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/case-battle/CaseBattleLogic.ts, CaseBattleTypes.ts, CaseBattleConstants.ts, useCaseBattleSounds.ts, index.ts
server/handlers/case-battle.js | sql/case-battle.sql | client/case-battle_client.lua

## FASES
3A: Tipos (Case, CaseItem, Rarity, BattleMode 1v1-4v4, BattleState, Round) + Constantes (6 caixas, itens por caixa, drop rates, raridade→cor)
3B: Engine (create battle, join, start round, roll item via HMAC per player per round, compare totals)
3C: Drop rate system (weighted random por raridade, garantir fairness entre jogadores via seeds independentes)
3D: Multi-round logic (best of 3/5, acumulado, desempate)
3E: Lobby system (list battles, filter, join, leave, timeout)
4A: SQL (casino_case_battles, casino_case_battle_rounds, casino_case_battle_players, casino_cases, casino_case_items)
4B: Handler JS (caseBattle:create, caseBattle:join, caseBattle:start, caseBattle:roll, caseBattle:getHistory, caseBattle:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
