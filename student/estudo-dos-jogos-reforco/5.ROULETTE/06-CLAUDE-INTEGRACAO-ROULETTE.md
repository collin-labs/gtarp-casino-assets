# CONVERSA 6 — CLAUDE INTEGRACAO + QA — ROULETTE (#5)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO
student/estudo-dos-jogos/5.ROULETTE/8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/5.ROULETTE/9.GUIA-INTEGRACAO-V0-ROLETA.md

Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar no gameMap (game.id===5 → RouletteGame)
2. index.ts, ESC hierarquico, saldo tempo real
3. Sons procedurais (spin, ball bounce, chip place, win, lose, lightning thunder)
4. Bilingue BR/EN completo (nomes apostas, resultado, modais)
5. Verificar TODOS 19 assets existentes usados + 4 faltantes com CSS alternativo

## CHECKLIST QA
VISUAL: roda gira suave, ball orbita, mesa layout completo, chips empilham, felt-texture, lightning multipliers, 7 camadas, hover states
LOGICA: 37 numeros (0-36), inside+outside bets corretas, payouts (straight 35:1, split 17:1, etc), lightning multipliers, racetrack, provably fair
BACKEND: SQL, handler (placeBets/spin/history/verify), rate-limit, audit log, lua timeout
INTEGRACAO: abre pelo card, ESC volta, saldo sync, sons, bilingue, mock browser
