# CONVERSA 6 — CLAUDE INTEGRACAO + QA — DAILY-FREE (#19)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/19.DAILY-FREE/8.BIBLIOTECA-IMAGENS-DAILY-FREE-PARTE-3.md
student/estudo-dos-jogos/19.DAILY-FREE/9.GUIA-INTEGRACAO-V0-DAILY-FREE.md
student/estudo-dos-jogos/19.DAILY-FREE/10.RELATORIO-CORRECAO-DAILY-FREE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===19 → DailyFreeGame) — aba EVENTOS
2. index.ts, ESC, saldo
3. Sons procedurais (14 sons: tick, spin, slow tick, stop, win small/big, milestone fanfare, claim, etc)
4. Bilingue BR/EN
5. Verificar 20 PNGs novos usados + shared icons

## CHECKLIST QA
VISUAL: roda 8 segmentos premium, moldura LEDs, ponteiro metalico, spin dramatico, calendar 30d streak, milestones, 7 camadas
LOGICA: spin 1x/dia, weighted random, streak tracking, milestone 7/14/30, cooldown 24h, PF
BACKEND: SQL (3 tabelas), handler, rate-limit, anti-exploit, lua timeout
INTEGRACAO: abre (aba EVENTOS), ESC, saldo, sons, bilingue, mock
