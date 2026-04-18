# CONVERSA 4 — CLAUDE INTEGRACAO + QA — CRASH (#1)
# O projeto esta importado via GitHub — NAO precisa anexar nada

---

## DOCS — LER DO PROJETO (na integra)
student/estudo-dos-jogos/1.CRASH/8.BIBLIOTECA-IMAGENS-CRASH-PARTE-1.md — Inventario
student/estudo-dos-jogos/1.CRASH/8.BIBLIOTECA-IMAGENS-CRASH-PARTE-2.md — Mapeamento
student/estudo-dos-jogos/1.CRASH/9.GUIA-INTEGRACAO-V0-CRASH.md — Como integrar
student/estudo-dos-jogos/1.CRASH/10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-1.md
student/estudo-dos-jogos/1.CRASH/10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-2.md
student/estudo-dos-jogos/1.CRASH/10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-3.md
student/estudo-dos-jogos/1.CRASH/10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-4.md
student/estudo-dos-jogos/1.CRASH/10.RELATORIO-CORRECAO-CRASH.md — Paths corrigidos

Referencia: BlackoutCasino.tsx (integracao atual), lib/games.ts

## SITUACAO
O Crash JA esta parcialmente integrado (activeGame === "crash" no BlackoutCasino.tsx). Mas precisa de QA completo apos as fases anteriores.

## TAREFAS
1. Verificar integracao no gameMap apos mudancas
2. Verificar ESC hierarquico
3. Saldo tempo real (apos backend estar conectado)
4. Sons procedurais — verificar todos: click, countdown, bet, rising, cashout, crash, lose
5. Bilingue BR/EN — verificar TODOS os textos (countdown, betting, result, modais)
6. Verificar que TODOS 7 assets sao usados corretamente no codigo

## CHECKLIST QA
VISUAL: foguete aparece na curva, trail atras, particulas no crash, screen shake, flash vermelho, confetti no win, labels grid, milestones 2x/5x/10x, frame-canvas alinhado, noise texture
LOGICA: game loop 4 fases, countdown tick todo segundo, bots no BETTING, auto-cashout, MIN/MAX, MANUAL/AUTO, crash 1.00x amarelo, sequencia rigida
BACKEND: SQL executa, handler 5 endpoints, rate-limit, audit log, lua timeout, provably fair HMAC-SHA256
INTEGRACAO: abre pelo card, ESC volta, saldo sync, sons, bilingue, mock browser
