# CONVERSA 6 — CLAUDE INTEGRACAO + QA — POKER (#6)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/6.POKER/8.BIBLIOTECA-IMAGENS-POKER-PARTE-3.md — Mapeamento
student/estudo-dos-jogos/6.POKER/9.GUIA-INTEGRACAO-V0-POKER.md
student/estudo-dos-jogos/6.POKER/10.RELATORIO-CORRECAO-POKER.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===6 → PokerGame)
2. index.ts, ESC, saldo tempo real
3. Sons procedurais (card deal, card flip, chip place, fold, win, lose, jackpot)
4. Bilingue BR/EN (nomes de maos, acoes, resultado)
5. Verificar 6 assets game + shared icons

## CHECKLIST QA
VISUAL: card flip 3D, naipes reais, chip stack, felt, 7 camadas, hover states, stagger cartas, hand highlight
LOGICA: Caribbean (deal, fold/raise, dealer qualifica, payouts), UTH (hole, flop/turn/river, decisions, showdown), hand evaluator, side bets, provably fair
BACKEND: SQL, handler, rate-limit, audit log, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
