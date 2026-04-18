# CONVERSA 5 — CLAUDE LOGICA + BACKEND — UPGRADE (#15)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/15.UPGRADE/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/15.UPGRADE/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/15.UPGRADE/3.PROMPT-AI-*.md (5)
Roteiro: student/estudo-dos-jogos/15.UPGRADE/5.ROTEIRO-*.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/upgrade/UpgradeLogic.ts, UpgradeTypes.ts, UpgradeConstants.ts, useUpgradeSounds.ts, index.ts
server/handlers/upgrade.js | sql/upgrade.sql | client/upgrade_client.lua

## FASES
3A: Tipos (UpgradeMode item/gcoin, UpgradeState, ItemSlot) + Constantes (house edge 8%, multipliers, min/max)
3B: Engine Item Mode (calculate chance = (itemValue / targetValue) * (1 - houseEdge), roll via HMAC, win/lose)
3C: Engine GCoin Mode (apostar GCoin × multiplicador, mesma formula)
3D: Item destruction logic (remove do inventario na derrota, add target no win)
3E: Provably Fair (HMAC-SHA256, roll 0-99999, threshold = chance * 100000)
4A: SQL (casino_upgrade_history, casino_upgrade_config)
4B: Handler JS (upgrade:calculate, upgrade:execute, upgrade:gcoin, upgrade:getHistory, upgrade:verify)
4C: Lua client (inventory integration)

1 fase por entrega. Edicoes cirurgicas.
