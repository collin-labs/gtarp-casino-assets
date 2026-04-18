# CONVERSA 5 — CLAUDE LOGICA + BACKEND — POOL GAME (#22)
## DOCS
Pesquisa: student/estudo-dos-jogos/22.POOLGAME/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/22.POOLGAME/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/22.POOLGAME/3.PROMPT-AI-*.md (5)
Roteiro: student/estudo-dos-jogos/22.POOLGAME/5.ROTEIRO-*.md (6, incluindo PATCH-OPUS)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/pool/PoolLogic.ts, PoolTypes.ts, PoolConstants.ts, PoolPhysics.ts, usePoolSounds.ts, index.ts
server/handlers/pool.js | sql/pool.sql | client/pool_client.lua

## FASES
3A: Tipos (Ball, BallType solid/stripe/eight/cue, CueStick, GameMode 8ball/9ball, MatchState, Turn) + Constantes
3B: Physics engine (Matter.js — bodies, colisao, friccao, pockets detection, ball-in-pocket)
3C: Game rules 8-ball (break, assign solids/stripes, foul, 8-ball win/lose conditions)
3D: Game rules 9-ball (sequential, push-out, jump shot)
3E: Aiming + shot system (angle, power, spin, cue position)
3F: Cue shop (buy, equip, stats affect gameplay)
3G: PvP matchmaking (create, join, turn-based, timeout)
3H: Provably Fair (HMAC pra break scatter)
4A: SQL (casino_pool_matches, casino_pool_cues, casino_pool_stats)
4B: Handler JS
4C: Lua client
1 fase por entrega. Edicoes cirurgicas.
