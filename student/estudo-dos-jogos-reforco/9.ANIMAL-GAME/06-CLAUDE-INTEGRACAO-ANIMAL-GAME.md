# CONVERSA 6 — CLAUDE INTEGRACAO + QA — ANIMAL GAME (#9)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/9.ANIMAL-GAME/8.BIBLIOTECA-IMAGENS-ANIMAL-GAME-PARTE-4.md — Mapeamento
student/estudo-dos-jogos/9.ANIMAL-GAME/9.GUIA-INTEGRACAO-V0-IMAGENS-ANIMAL-GAME.md
Referencia: BlackoutCasino.tsx, lib/games.ts

## TAREFAS
1. Registrar gameMap (game.id===9 → AnimalGame)
2. index.ts, ESC, saldo
3. Sons procedurais (capsula open, animal reveal, bet place, win fanfare, lose)
4. Bilingue BR/EN (nomes animais, tipos aposta, resultado)
5. Verificar 25 PNGs usados corretamente com paths /assets/games/bicho/{N}.png

## CHECKLIST QA
VISUAL: grid 5x5 cabe 1280x720, 25 PNGs reais, capsulas premium, 7 camadas, hover, stagger, confetti
LOGICA: 25 grupos, 4 tipos aposta, 5 capsulas com numeros, mapeamento numero→grupo correto, provably fair
BACKEND: SQL (25 animais seeded), handler, rate-limit, audit, lua timeout
INTEGRACAO: abre, ESC, saldo, sons, bilingue, mock
