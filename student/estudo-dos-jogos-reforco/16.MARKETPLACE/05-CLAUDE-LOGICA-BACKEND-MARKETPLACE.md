# CONVERSA 5 — CLAUDE LOGICA + BACKEND — MARKETPLACE (#16)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/16.MARKETPLACE/0.PESQUISA-*.md (5)
Mega Estudo: student/estudo-dos-jogos/16.MARKETPLACE/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/16.MARKETPLACE/3.PROMPT-AI-*.md (5)
Roteiro: student/estudo-dos-jogos/16.MARKETPLACE/5.ROTEIRO-*.md (6)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/marketplace/MarketplaceLogic.ts, MarketplaceTypes.ts, MarketplaceConstants.ts, index.ts
server/handlers/marketplace.js | sql/marketplace.sql | client/marketplace_client.lua

## FASES
3A: Tipos (Listing, ListingStatus, ItemType, FilterParams, SortOrder) + Constantes (tax rate 5%, instant sell 70%)
3B: Engine listings (create, buy, cancel, expire, search, filter, sort, paginate)
3C: Instant sell (calculate value, execute, credit balance)
3D: Wishlist + notifications (add/remove favorite, price alert)
3E: Seller profile + ratings
3F: Admin (moderate, ban, stats, fee config)
4A: SQL (casino_marketplace_listings, casino_marketplace_transactions, casino_marketplace_favorites, casino_marketplace_ratings)
4B: Handler JS (market:list, market:buy, market:sell, market:instantSell, market:favorite, market:rate, market:admin)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
