# CONVERSA 3 — CLAUDE BACKEND — CRASH (#1)
# O projeto esta importado via GitHub — NAO precisa anexar nada

---

## DOCS — LER DO PROJETO (na integra, TODOS)

Pesquisa + Mecanicas profundas:
student/estudo-dos-jogos/1.CRASH/0.PESQUISA-REGRA0-CRASH-PARTE-1.md
student/estudo-dos-jogos/1.CRASH/0.PESQUISA-REGRA0-CRASH-PARTE-2.md
student/estudo-dos-jogos/1.CRASH/0.PESQUISA-REGRA0-CRASH-PARTE-3.md
student/estudo-dos-jogos/1.CRASH/0.PESQUISA-REGRA0-CRASH-PARTE-4-ADENDO.md
student/estudo-dos-jogos/1.CRASH/0.PESQUISA-REGRA0-CRASH-PARTE-5-ADENDO.md
student/estudo-dos-jogos/1.CRASH/1.MEGA-ESTUDO-CRASH-PARTE-1.md
student/estudo-dos-jogos/1.CRASH/1.MEGA-ESTUDO-CRASH-PARTE-2.md
student/estudo-dos-jogos/1.CRASH/1.MEGA-ESTUDO-CRASH-PARTE-3.md
student/estudo-dos-jogos/1.CRASH/1.MEGA-ESTUDO-CRASH-PARTE-4-ADENDO.md
student/estudo-dos-jogos/1.CRASH/1.MEGA-ESTUDO-CRASH-PARTE-5-ADENDO.md

Prompt AI + Roteiro backend:
student/estudo-dos-jogos/1.CRASH/3.PROMPT-AI-CRASH-PARTE-4-ADENDO.md — Mock data
student/estudo-dos-jogos/1.CRASH/5.ROTEIRO-CRASH-PARTE-4-ADENDO.md — Backend
student/estudo-dos-jogos/1.CRASH/5.ROTEIRO-CRASH-PARTE-5-ADENDO.md — Backend

Referencia patterns: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
server/handlers/crash.js — Handler server-side (oxmysql)
sql/crash.sql — Tabelas + seeds
client/crash_client.lua — NUI callbacks

## FASES
4A: SQL (casino_crash_rounds, casino_crash_bets, casino_crash_config + seeds)
4B: Handler JS (crash:newRound, crash:placeBet, crash:cashout, crash:getHistory, crash:verify)
4C: Lua client (NUI callbacks + promise + timeout)
4D: Provably Fair REAL (HMAC-SHA256, substituir mock Math.random)
4E: Conectar frontend ao backend (substituir mocks por fetchNui)

1 fase por entrega. Edicoes cirurgicas. Mock mantido como fallback browser.
