# CONVERSA 6 — CLAUDE INTEGRACAO + QA — UPGRADE (#15)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/15.UPGRADE/8.BIBLIOTECA-IMAGENS-UPGRADE-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/15.UPGRADE/9.GUIA-INTEGRACAO-V0-IMAGENS-UPGRADE.md
student/estudo-dos-jogos/15.UPGRADE/9.GUIA-INTEGRACAO-V0-IMAGENS-UPGRADE-PARTE-2-ADENDO.md
student/estudo-dos-jogos/15.UPGRADE/10.RELATORIO-CORRECAO-UPGRADE.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===15 → UpgradeGame) — aba LOJA
2. index.ts, ESC, saldo
3. Sons procedurais (wheel buildup whoosh, ticker tick, ticker slow, win explosion, lose destruction, gcoin)
4. Bilingue BR/EN
5. Verificar 16 PNGs de itens compartilhados com Cases usados corretamente

## CHECKLIST QA
VISUAL: wheel SVG com arcos proporcionais, ticker gira suave, 5 fases spinning, near-miss, item destruido animacao, versus layout, 7 camadas
LOGICA: calculate chance (value ratio × house edge), item/gcoin modes, HMAC roll, inventory update, provably fair
BACKEND: SQL, handler, rate-limit, audit, lua timeout, inventory sync
INTEGRACAO: abre (aba LOJA), ESC, saldo, sons, bilingue, mock
