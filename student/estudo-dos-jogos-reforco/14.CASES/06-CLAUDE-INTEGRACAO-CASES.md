# CONVERSA 6 — CLAUDE INTEGRACAO + QA — CASES (#14)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/14.CASES/8.BIBLIOTECA-IMAGENS-CASES-PARTE-5-ADENDO.md — Mapeamento
student/estudo-dos-jogos/14.CASES/9.GUIA-INTEGRACAO-V0-CASES.md
student/estudo-dos-jogos/14.CASES/10.RELATORIO-CORRECAO-CASES.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===14 → CasesGame) — aba LOJA
2. index.ts, ESC, saldo
3. Sons procedurais (case shake/open, strip tick/stop, item reveal, legendary fanfare, sell cha-ching)
4. Bilingue BR/EN (nomes caixas/itens/raridades/acoes)
5. Verificar 41 PNGs compartilhados com Case Battle usados corretamente
6. RecentDrops feed funcionando

## CHECKLIST QA
VISUAL: catalogo premium, strip CS:GO, 3 estados caixa, itens glow raridade, fast open flip 3D, battle dual strip, 7 camadas
LOGICA: solo/fast/battle, weighted random per rarity, RTP 90%, sell-back 70%, provably fair
BACKEND: SQL (4 tabelas), handler, rate-limit, audit, lua timeout
INTEGRACAO: abre (aba LOJA), ESC, saldo, sons, bilingue, mock, recent drops
