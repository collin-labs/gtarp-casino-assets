# CONVERSA 6 — CLAUDE INTEGRACAO + QA — JACKPOT (#13)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/13.JACKPOT/9.GUIA-INTEGRACAO-V0-JACKPOT.md
student/estudo-dos-jogos/13.JACKPOT/9.GUIA-INTEGRACAO-V0-JACKPOT-PARTE-2-ADENDO.md
student/estudo-dos-jogos/13.JACKPOT/10.RELATORIO-CORRECAO-JACKPOT.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===13 → JackpotGame)
2. index.ts, ESC, saldo
3. Sons procedurais (deposit drop, donut update, spin whoosh, tick por secao, win fanfare)
4. Bilingue BR/EN
5. Verificar donut conic-gradient funciona em CEF M103

## CHECKLIST QA
VISUAL: donut conic-gradient, moldura dourada, ponteiro fixo, spin 8s suave, 10 cores distintas, 7 camadas, hover
LOGICA: deposit → tickets, pot acumula, timer 20s, spin → HMAC winning ticket, multi-deposit, 5% house edge, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout, broadcast
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
