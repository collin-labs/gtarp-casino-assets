# CONVERSA 6 — CLAUDE INTEGRACAO + QA — LOTTERY (#18)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/18.LOTTERY/9.BIBLIOTECA-IMAGENS-LOTERIA-PARTE-2.md — Mapeamento
student/estudo-dos-jogos/18.LOTTERY/10.GUIA-INTEGRACAO-V0-LOTERIA.md
student/estudo-dos-jogos/18.LOTTERY/10.RELATORIO-CORRECAO-LOTERIA.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===18 → LotteryGame) — aba EVENTOS
2. index.ts, ESC, saldo
3. Sons procedurais (ball bounce, ball exit, match ding, miss buzz, mega ball thunder, jackpot fanfare)
4. Bilingue BR/EN (Surpresinha/Quick Pick, acertos/matches, etc)
5. Verificar globo/bolas funcionam em CEF M103

## CHECKLIST QA
VISUAL: grid 60 com 5 estados, globo esferico dourado, bolas bounce, reveal stagger, mega ball dramatico, resultado cinematografico, 7 camadas
LOGICA: 6 de 60, match 0-6, mega ball multiplier, jackpot progressivo, quick pick, daily limit, cooldown, PF
BACKEND: SQL (3 tabelas), handler, rate-limit, audit, lua timeout
INTEGRACAO: abre (aba EVENTOS), ESC, saldo, sons, bilingue, mock
