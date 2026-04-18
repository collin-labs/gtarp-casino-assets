# MAPA DE CONVERSAS — CRASH (#1)
# Blackout Casino GTARP — 01/04/2026

## ESTADO ATUAL
O V0 JA TERMINOU (2 rodadas). Codigo existe em components/games/crash/ (9 arquivos, 3.202L).
Integracao basica no BlackoutCasino.tsx JA FUNCIONA (abre pelo painel, ESC fecha).
PROBLEMA: 70% funcional — falta foguete, particulas, efeitos, e tem bugs de logica.

## 4 CONVERSAS (todas no Claude — V0 ja concluido)
01-CLAUDE-POLISH .......... Foguete, trail, particulas, shake, flash, confetti, Doc 4+7
02-CLAUDE-LOGICA .......... Fix bugs, MIN/MAX, MANUAL/AUTO, sequencia crash, Doc 3 (logica)
03-CLAUDE-BACKEND ......... SQL, Handler JS, Lua client, Provably Fair real, Doc 0+1+3+5
04-CLAUDE-INTEGRACAO ...... QA completo, sons, bilingue, polish final, Doc 8+9+10

## ASSETS (7 exclusivos + shared — TODOS EXISTEM)
Game: public/assets/games/crash/ — rocket-idle.png, rocket-flying.png, explosion.png, trail-fire.png, particles-gold.png, stars-bg.png, frame-canvas.png
Sons: ZERO mp3 — procedural Web Audio (useCrashSound.ts)
Icons: public/assets/shared/icons/ (24)
UI: public/assets/shared/ui/ (bg-casino.png)

## CHECKLIST DE DOCUMENTOS — TODOS OS 41 ARQUIVOS

| # | Documento | Usado em |
|---|-----------|----------|
| 1 | 0.PESQUISA-REGRA0-CRASH-PARTE-1.md | 03-BACKEND (contexto pesquisa) |
| 2 | 0.PESQUISA-REGRA0-CRASH-PARTE-2.md | 03-BACKEND |
| 3 | 0.PESQUISA-REGRA0-CRASH-PARTE-3.md | 03-BACKEND |
| 4 | 0.PESQUISA-REGRA0-CRASH-PARTE-4-ADENDO.md | 03-BACKEND |
| 5 | 0.PESQUISA-REGRA0-CRASH-PARTE-5-ADENDO.md | 03-BACKEND |
| 6 | 1.MEGA-ESTUDO-CRASH-PARTE-1.md | 03-BACKEND (mecanicas profundas) |
| 7 | 1.MEGA-ESTUDO-CRASH-PARTE-2.md | 03-BACKEND |
| 8 | 1.MEGA-ESTUDO-CRASH-PARTE-3.md | 03-BACKEND |
| 9 | 1.MEGA-ESTUDO-CRASH-PARTE-4-ADENDO.md | 03-BACKEND |
| 10 | 1.MEGA-ESTUDO-CRASH-PARTE-5-ADENDO.md | 03-BACKEND |
| 11 | 2.GUIA-DO-JOGO-CRASH.md | 01-POLISH (visao geral) |
| 12 | 3.PROMPT-AI-CRASH-PARTE-1.md | 02-LOGICA (mecanicas core) |
| 13 | 3.PROMPT-AI-CRASH-PARTE-2.md | 02-LOGICA (estados) |
| 14 | 3.PROMPT-AI-CRASH-PARTE-3.md | 02-LOGICA (RNG) |
| 15 | 3.PROMPT-AI-CRASH-PARTE-4-ADENDO.md | 03-BACKEND (mock data) |
| 16 | 3.PROMPT-AI-CRASH-PARTE-5-ADENDO.md | 01-POLISH (paths consolidados) |
| 17 | 4.ADENDO-DS-CRASH-PARTE-1.md | 01-POLISH (tokens CSS) |
| 18 | 4.ADENDO-DS-CRASH-PARTE-2.md | 01-POLISH (componentes) |
| 19 | 4.ADENDO-DS-CRASH-PARTE-3.md | 01-POLISH (animacoes) |
| 20 | 4.ADENDO-DS-CRASH-PARTE-4-ADENDO.md | 01-POLISH (complemento) |
| 21 | 4.ADENDO-DS-CRASH-PARTE-5-ADENDO.md | 01-POLISH (complemento) |
| 22 | 5.ROTEIRO-CRASH-PARTE-1.md | 01-POLISH (sequencias animacao) |
| 23 | 5.ROTEIRO-CRASH-PARTE-2.md | 02-LOGICA (codigo logica) |
| 24 | 5.ROTEIRO-CRASH-PARTE-3.md | 02-LOGICA (codigo logica) |
| 25 | 5.ROTEIRO-CRASH-PARTE-4-ADENDO.md | 03-BACKEND (backend) |
| 26 | 5.ROTEIRO-CRASH-PARTE-5-ADENDO.md | 03-BACKEND (backend) |
| 27 | 6.PROMPT-V0-CRASH-PARTE-1.md | JA USADO (V0 concluido) |
| 28 | 6.PROMPT-V0-CRASH-PARTE-2.md | JA USADO (V0 concluido) |
| 29 | 6.PROMPT-V0-CRASH-PARTE-4-ADENDO.md | JA USADO (V0 concluido) |
| 30 | 7.CSS-COMPONENTES-CRASH-PARTE-1.md | 01-POLISH (@keyframes) |
| 31 | 7.CSS-COMPONENTES-CRASH-PARTE-2.md | 01-POLISH (mais @keyframes) |
| 32 | 7.CSS-COMPONENTES-CRASH-PARTE-3-ADENDO.md | 01-POLISH (complemento) |
| 33 | 7.CSS-COMPONENTES-CRASH-PARTE-4-ADENDO.md | 01-POLISH (complemento) |
| 34 | 8.BIBLIOTECA-IMAGENS-CRASH-PARTE-1.md | 04-INTEGRACAO (inventario) |
| 35 | 8.BIBLIOTECA-IMAGENS-CRASH-PARTE-2.md | 04-INTEGRACAO (mapeamento) |
| 36 | 9.GUIA-INTEGRACAO-V0-CRASH.md | 04-INTEGRACAO |
| 37 | 10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-1.md | 04-INTEGRACAO |
| 38 | 10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-2.md | 04-INTEGRACAO |
| 39 | 10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-3.md | 04-INTEGRACAO |
| 40 | 10.BIBLIOTECA-IMAGENS-UNIFICADA-PARTE-4.md | 04-INTEGRACAO |
| 41 | 10.RELATORIO-CORRECAO-CRASH.md | 04-INTEGRACAO (paths corrigidos) |

**41 documentos. TODOS mapeados. ZERO de fora.**
