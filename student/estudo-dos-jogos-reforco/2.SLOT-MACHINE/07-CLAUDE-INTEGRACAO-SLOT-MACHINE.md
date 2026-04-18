# CONVERSA 7 — CLAUDE INTEGRACAO + QA — SLOT MACHINE (#2)
# O projeto esta importado via GitHub

## DOCS
student/estudo-dos-jogos/2.SLOT-MACHINE/9.GUIA-INTEGRACAO-V0-SLOT-MACHINE.md
student/estudo-dos-jogos/2.SLOT-MACHINE/10.RELATORIO-CORRECAO-SLOT-MACHINE.md
Referencia: BlackoutCasino.tsx, components/games/crash/index.ts, lib/games.ts

## TAREFAS
1. Registrar no gameMap (game.id===2 → SlotsGame)
2. index.ts de export
3. ESC hierarquico
4. Saldo tempo real (useGameAPI + CasinoContext)
5. Sons (Web Audio, /assets/sounds/slots/)
6. Bilingue BR/EN

## CHECKLIST QA
VISUAL: fundo, bordas rgba, fontes, clamp, touch 44px, hover states, stagger
LOGICA: grid 6x5, scatter pays, tumble, FS, multiplicadores, buy bonus, classic, provably fair
BACKEND: SQL, handler, rate-limit, audit log, lua timeout
INTEGRACAO: abre pelo card, ESC volta, saldo sync, sons+mute, bilingue, mock browser
