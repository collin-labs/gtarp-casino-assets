# CONVERSA 6 — CLAUDE INTEGRACAO + QA — COINFLIP (#12)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/12.COINFLIP/8.BIBLIOTECA-IMAGENS-COINFLIP-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/12.COINFLIP/9.GUIA-INTEGRACAO-V0-COINFLIP.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===12 → CoinflipGame)
2. index.ts, ESC, saldo
3. Sons procedurais (coin flip whoosh, coin land, countdown tick, win fanfare, lose)
4. Bilingue BR/EN (cara/coroa, heads/tails, vencedor/winner, etc)
5. Verificar moeda 3D flip funciona em CEF M103

## CHECKLIST QA
VISUAL: moeda 3D com faces PNG, flip animation suave, lobby cards premium, countdown dramatico, resultado celebratorio, 7 camadas
LOGICA: create/join/flip, PvP 1v1, lobby list/filter, leaderboard, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout, room cleanup
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
