# CONVERSA 6 — CLAUDE INTEGRACAO + QA — CASE BATTLE (#11)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/11.CASE-BATTLE/8.BIBLIOTECA-DE-IMAGENS-CASE-BATTLE-PARTE-5.md — Mapeamento
student/estudo-dos-jogos/11.CASE-BATTLE/9.GUIA-INTEGRACAO-V0-CASE-BATTLE.md
student/estudo-dos-jogos/11.CASE-BATTLE/10.RELATORIO-CORRECAO-CASE-BATTLE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===11 → CaseBattleGame)
2. index.ts, ESC, saldo
3. Sons procedurais (case shake, case open, item reveal, carousel tick, win fanfare, legendary drop)
4. Bilingue BR/EN (nomes caixas, itens, raridades, resultado)
5. Verificar 41 PNGs usados: 18 caixas + 7 backgrounds + 16 itens

## CHECKLIST QA
VISUAL: caixas 3 estados, itens com glow raridade, carousel CS:GO, backgrounds, 7 camadas, hover, lobby cards premium
LOGICA: create/join/start/roll, 6 caixas com itens e drop rates, multi-round, compare totals, lobby list/filter, provably fair
BACKEND: SQL (5 tabelas), handler, rate-limit, audit, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
