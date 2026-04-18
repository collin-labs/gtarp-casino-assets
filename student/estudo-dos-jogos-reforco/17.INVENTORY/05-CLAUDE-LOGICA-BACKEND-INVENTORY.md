# CONVERSA 5 — CLAUDE LOGICA + BACKEND — INVENTORY (#17)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/17.INVENTORY/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/17.INVENTORY/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/17.INVENTORY/3.PROMPT-AI-*.md (4)
Roteiro: student/estudo-dos-jogos/17.INVENTORY/5.ROTEIRO-*.md (4)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/inventory/InventoryLogic.ts, InventoryTypes.ts, InventoryConstants.ts, index.ts
server/handlers/inventory.js | sql/inventory.sql | client/inventory_client.lua

## FASES
3A: Tipos (InventoryItem, Rarity, ItemCategory, SortOrder) + Constantes (sell-back 70%, categories)
3B: Engine (list items, filter, sort, sell item, calculate sell price)
3C: Integration hooks (link to Upgrade #15, Marketplace #16, Cases #14)
4A: SQL (casino_inventory, casino_inventory_transactions)
4B: Handler JS (inventory:list, inventory:sell, inventory:getItem, inventory:getHistory)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
