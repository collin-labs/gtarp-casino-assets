# CONVERSA 5 — CLAUDE LOGICA + BACKEND — DICE (#7)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa: student/estudo-dos-jogos/7.DICE/0.PESQUISA-REGRA0-DICE-PARTE-1.md a PARTE-3-ADENDO.md (3 arquivos)
Mega Estudo: student/estudo-dos-jogos/7.DICE/1.MEGA-ESTUDO-DICE-PARTE-1.md e PARTE-2.md (2 arquivos)
Logica: student/estudo-dos-jogos/7.DICE/3.PROMPT-AI-DICE-PARTE-1.md a PARTE-6-ADENDO.md (6 arquivos)
Roteiro: student/estudo-dos-jogos/7.DICE/5.ROTEIRO-DICE-PARTE-1.md a PARTE-6-ADENDO.md (6 arquivos)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/dice/DiceLogic.ts, DiceTypes.ts, DiceConstants.ts, useDiceSounds.ts, index.ts
server/handlers/dice.js | sql/dice.sql | client/dice_client.lua

## FASES
3A: Tipos (BetPosition 2-12, DiceResult, GameState) + Constantes (odds por total, payouts, lightning multipliers)
3B: Engine (roll 2d6 via HMAC, evaluate bets, calculate payout, lightning mode)
3C: Auto-bet engine (loop, stop conditions)
3D: Integrar logica no visual (state machine, animacao 3D synced)
4A: SQL (casino_dice_rounds, casino_dice_bets, casino_dice_config)
4B: Handler JS (dice:placeBets, dice:roll, dice:getHistory, dice:verify, dice:autoBet)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
