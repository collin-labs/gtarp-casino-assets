# CONVERSA 6 — CLAUDE INTEGRACAO + QA — INVENTORY (#17)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/17.INVENTORY/8.BIBLIOTECA-IMAGENS-INVENTORY-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/17.INVENTORY/9.GUIA-INTEGRACAO-V0-IMAGENS-INVENTORY.md
student/estudo-dos-jogos/17.INVENTORY/10.RELATORIO-CORRECAO-INVENTORY.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===17 → InventoryGame) — aba LOJA
2. index.ts, ESC, saldo (atualiza ao vender)
3. Sons procedurais (item select, sell cha-ching, filter click)
4. Bilingue BR/EN
5. Verificar 16 PNGs de itens compartilhados usados corretamente
6. Links pra Cases/Upgrade/Marketplace funcionam

## CHECKLIST QA
VISUAL: grid vitrine, borda raridade, legendary shimmer, filtros pills, modal detalhes, empty state, 7 camadas
LOGICA: list/filter/sort, sell 70%, link upgrade/market, empty state
BACKEND: SQL (2 tabelas), handler, rate-limit, audit, lua timeout
INTEGRACAO: abre (aba LOJA), ESC, saldo sync, sons, bilingue, mock
