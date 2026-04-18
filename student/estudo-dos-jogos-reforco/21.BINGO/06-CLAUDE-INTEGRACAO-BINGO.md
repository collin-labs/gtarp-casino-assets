# CONVERSA 6 — CLAUDE INTEGRACAO + QA — BINGO (#21)
## DOCS
student/estudo-dos-jogos/21.BINGO/9.GUIA-INTEGRACAO-V0-BINGO.md
student/estudo-dos-jogos/21.BINGO/10.RELATORIO-CORRECAO-BINGO.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===21 → BingoGame) — aba JOGOS
2. index.ts, ESC, saldo
3. Sons procedurais (ball draw pop, dab stamp, lucky ding, wild whoosh, 1-to-go heartbeat, bingo fanfare)
4. Bilingue BR/EN
5. Verificar 22 PNGs novos + shared icons

## CHECKLIST QA
VISUAL: cartela premium 7 estados, globo dourado, bolas coloridas B/I/N/G/O, dab stamp, lucky flash, wild ball verde, 1-to-go tensao, patterns display, 7 camadas
LOGICA: generate card, draw 1-75, auto-dab, lucky bonus, wild ball, pattern check, 8 patterns, PF
BACKEND: SQL (3 tabelas), handler, rate-limit, audit
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock, mobile 375px
