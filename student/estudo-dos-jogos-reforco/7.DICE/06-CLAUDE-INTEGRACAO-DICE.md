# CONVERSA 6 — CLAUDE INTEGRACAO + QA — DICE (#7)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/7.DICE/9.GUIA-INTEGRACAO-V0-DICE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===7 → DiceGame)
2. index.ts, ESC, saldo
3. Sons procedurais (dice shake, dice land, bet place, win, lose, lightning thunder)
4. Bilingue BR/EN
5. Verificar dados 3D funcionam em CEF M103 (perspective + preserve-3d)

## CHECKLIST QA
VISUAL: dados 3D com 6 faces, pips dourados, rotacao spring, blur movimento, lightning flash, grid apostas, 7 camadas, hover
LOGICA: roll 2d6, totais 2-12, odds corretas, lightning multipliers, auto-bet com stop conditions, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock, CEF M103 compativel
