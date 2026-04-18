# CONVERSA 6 — CLAUDE INTEGRACAO + QA — POOL GAME (#22)
## DOCS
student/estudo-dos-jogos/22.POOLGAME/9.GUIA-INTEGRACAO-V0-POOL-GAME.md
student/estudo-dos-jogos/22.POOLGAME/10.RELATORIO-CORRECAO-POOL-GAME.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===22 → PoolGame) — aba JOGOS
2. index.ts, ESC, saldo
3. Sons procedurais (cue hit, ball collision, ball pocket, rail bounce, foul buzz, win fanfare)
4. Bilingue BR/EN
5. Verificar 16 PNGs novos (4 tacos + 12 icons) + Canvas funciona CEF M103

## CHECKLIST QA
VISUAL: mesa felt+rails+pockets+diamonds, 16 bolas realistas, taco gradiente, mira+power+spin, cue shop com stats, 7 camadas HUD
LOGICA: Matter.js physics, 8-ball/9-ball rules, foul detection, pocket detection, turn-based PvP, cue stats, PF
BACKEND: SQL (3 tabelas), handler, matchmaking, rate-limit, audit
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock, CEF M103 Canvas
