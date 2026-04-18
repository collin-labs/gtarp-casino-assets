# CONVERSA 6 — CLAUDE INTEGRACAO + QA — MARKETPLACE (#16)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/16.MARKETPLACE/9.GUIA-INTEGRACAO-V0-MARKETPLACE.md
student/estudo-dos-jogos/16.MARKETPLACE/9.GUIA-INTEGRACAO-V0-MARKETPLACE-PARTE-2-ADENDO.md
student/estudo-dos-jogos/16.MARKETPLACE/10.RELATORIO-CORRECAO-MARKETPLACE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===16 → MarketplaceGame) — aba LOJA
2. index.ts, ESC, saldo (atualiza ao comprar/vender)
3. Sons procedurais (buy cha-ching, sell confirm, favorite heart, notification bell)
4. Bilingue BR/EN (comprar/vender/anunciar/filtrar/etc)
5. Verificar itens de Cases reutilizados + icons marketplace

## CHECKLIST QA
VISUAL: grid vitrine, busca premium, filtros, item detail modal, precos GCoin, raridade cores, 7 camadas, hover, stagger
LOGICA: CRUD listings, buy/sell, instant sell 70%, search/filter/sort, wishlist, notifications, ratings, admin moderation
BACKEND: SQL (4 tabelas), handler, tax 5%, rate-limit, audit, lua timeout
INTEGRACAO: abre (aba LOJA), ESC, saldo sync, sons, bilingue, mock
