# CONVERSA 6 — CLAUDE INTEGRACAO + QA — BRAZILIAN ROULETTE (#10)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/9.GUIA-INTEGRACAO-V0-BRAZILIAN-ROULETTE.md
student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/9.GUIA-INTEGRACAO-V0-BRAZILIAN-ROULETTE-PARTE-2-ADENDO.md
student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/10.RELATORIO-CORRECAO-BRAZILIAN-ROULETTE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===10 → BrazilianRouletteGame)
2. index.ts, ESC, saldo
3. Sons procedurais (spin, ball, chip, lightning thunder, win, lose, big win)
4. Bilingue BR/EN (nomes apostas, modos, resultado)
5. Verificar 3 modos funcionam independente

## CHECKLIST QA
VISUAL: roda real, mesa felt, chips reais, lightning raios, 3 modos visuais distintos, 7 camadas, hover
LOGICA: 37 numeros, 3 modos (relampago/classica/mini), payouts corretos, lightning multipliers, apostas especiais, racetrack, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
