# CONVERSA 5 — CLAUDE LOGICA + BACKEND — DAILY-FREE (#19)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)
Pesquisa: student/estudo-dos-jogos/19.DAILY-FREE/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/19.DAILY-FREE/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/19.DAILY-FREE/3.PROMPT-AI-*.md (3)
Roteiro: student/estudo-dos-jogos/19.DAILY-FREE/5.ROTEIRO-*.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/daily-free/DailyFreeLogic.ts, DailyFreeTypes.ts, DailyFreeConstants.ts, useDailyFreeSounds.ts, index.ts
server/handlers/daily-free.js | sql/daily-free.sql | client/daily-free_client.lua

## FASES
3A: Tipos (WheelSegment, Prize, StreakDay, MilestoneType) + Constantes (8 segmentos, premios, milestones 7/14/30)
3B: Engine spin (select segment via HMAC weighted, credit prize)
3C: Streak system (track consecutive days, detect break, milestone rewards)
3D: Cooldown (24h timer, server-side validation, anti-exploit)
3E: Provably Fair
4A: SQL (casino_daily_free_spins, casino_daily_free_streaks, casino_daily_free_config)
4B: Handler JS (daily:spin, daily:getStreak, daily:getHistory, daily:verify)
4C: Lua client

1 fase por entrega. Edicoes cirurgicas.
