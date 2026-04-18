# CONVERSA 5 — CLAUDE LOGICA + BACKEND — CASES (#14)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/14.CASES/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/14.CASES/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/14.CASES/3.PROMPT-AI-*.md (6)
Roteiro: student/estudo-dos-jogos/14.CASES/5.ROTEIRO-*.md (7)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/cases/CasesLogic.ts, CasesTypes.ts, CasesConstants.ts, useCasesSounds.ts, index.ts
server/handlers/cases.js | sql/cases.sql | client/cases_client.lua

## FASES
3A: Tipos (Case, CaseItem, Rarity, OpenMode solo/fast/battle, CaseState) + Constantes (6 caixas, itens, drop rates, RTP 90%)
3B: Engine Solo (select case, roll item via HMAC weighted random, determine result)
3C: Engine Fast Open (same logic, skip animation, instant result)
3D: Engine Battle (mini PvP — create/join, dual roll synchronized, compare totals)
3E: Sell-back system (70% valor), inventory integration
3F: Provably Fair (HMAC-SHA256 per roll)
4A: SQL (casino_cases, casino_case_items, casino_case_opens, casino_case_battles)
4B: Handler JS (cases:open, cases:fastOpen, cases:sell, cases:battleCreate/Join/Roll, cases:getHistory, cases:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
