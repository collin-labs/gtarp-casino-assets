# CONVERSA 6 — CLAUDE INTEGRACAO + QA — MINES (#3)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO
student/estudo-dos-jogos/3.MINES/8.BIBLIOTECA-IMAGENS-MINES-PARTE-2.md — Mapeamento componente↔imagem
student/estudo-dos-jogos/3.MINES/9.GUIA-INTEGRACAO-V0-MINES.md — Como integrar
student/estudo-dos-jogos/3.MINES/10.RELATORIO-CORRECAO-MINES.md — Paths corrigidos

Referencia: BlackoutCasino.tsx (como Crash esta integrado), lib/games.ts

## TAREFAS
1. Registrar no gameMap (game.id===3 → MinesGame)
2. index.ts de export
3. ESC hierarquico
4. Saldo tempo real
5. Sons procedurais (Web Audio — tile reveal, gem found, bomb explode, cashout, win, lose)
6. Bilingue BR/EN completo

## CHECKLIST QA
VISUAL: fundo, bordas rgba, fontes, clamp, 44px, hover states, stagger tiles, grid cabe em 1280x720
LOGICA: grid 5x5, mine placement correto, multiplicador crescente, cashout a qualquer momento, provably fair
BACKEND: SQL, handler (bet/reveal/cashout/history/verify), rate-limit, audit log, lua timeout
INTEGRACAO: abre pelo card, ESC volta, saldo sync, sons, bilingue, mock browser
