# CONVERSA 6 — CLAUDE INTEGRACAO + QA — PLINKO (#8)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/8.PLINKO/9.GUIA-INTEGRACAO-V0-PLINKO.md
student/estudo-dos-jogos/8.PLINKO/10.RELATORIO-CORRECAO-PLINKO.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===8 → PlinkoGame)
2. index.ts, ESC, saldo
3. Sons procedurais (peg hit, ball drop, slot land, win, big win, auto start/stop)
4. Bilingue BR/EN
5. Verificar board funciona em 1280x720 + CEF M103

## CHECKLIST QA
VISUAL: board triangular, pegs dourados, bola com glow+trail, slots coloridos, 7 camadas, hover, stagger
LOGICA: ball path deterministic (HMAC bits), 8/12/16 rows, 3 riscos, multipliers corretos, auto-bet, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock, CEF M103
