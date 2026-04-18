# CONVERSA 6 — CLAUDE INTEGRACAO + QA — BLACKJACK (#4)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO
student/estudo-dos-jogos/4.BLACKJACK/8.BIBLIOTECA-IMAGENS-BLACKJACK-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/4.BLACKJACK/9.GUIA-INTEGRACAO-V0-BLACKJACK.md
student/estudo-dos-jogos/4.BLACKJACK/9.GUIA-INTEGRACAO-V0-BLACKJACK-PARTE-2-ADENDO.md

Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar no gameMap (game.id===4 → BlackjackGame)
2. index.ts, ESC hierarquico, saldo tempo real
3. Sons procedurais (card deal, card flip, chip place, win, lose, blackjack fanfare)
4. Bilingue BR/EN completo
5. Verificar TODOS 14 assets usados corretamente

## CHECKLIST QA
VISUAL: mesa felt, card flip 3D, chip stack, 7 camadas, hover states, stagger cartas, resultado overlays
LOGICA: deal correto, hand value (Ás=1/11), hit/stand/double/split/insurance, dealer 17+, BJ 3:2, push, bust
BACKEND: SQL, handler 8 endpoints, rate-limit, audit log, lua timeout, provably fair
INTEGRACAO: abre pelo card, ESC volta, saldo sync, sons, bilingue, mock browser
