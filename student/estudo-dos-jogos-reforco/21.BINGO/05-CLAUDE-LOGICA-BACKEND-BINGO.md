# CONVERSA 5 — CLAUDE LOGICA + BACKEND — BINGO (#21)
## DOCS
Pesquisa: student/estudo-dos-jogos/21.BINGO/0.PESQUISA-*.md (3)
Mega Estudo: student/estudo-dos-jogos/21.BINGO/1.MEGA-ESTUDO-*.md (3)
Logica: student/estudo-dos-jogos/21.BINGO/3.PROMPT-AI-*.md (5)
Roteiro: student/estudo-dos-jogos/21.BINGO/5.ROTEIRO-*.md (5)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/bingo/BingoLogic.ts, BingoTypes.ts, BingoConstants.ts, useBingoSounds.ts, index.ts
server/handlers/bingo.js | sql/bingo.sql | client/bingo_client.lua

## FASES
3A: Tipos (BingoCard 5×5, BingoBall 1-75, Pattern, GameState) + Constantes (5 colunas B/I/N/G/O ranges, 8 patterns)
3B: Engine (generate card, draw balls HMAC, auto-dab, check pattern completion)
3C: Lucky numbers (2-3 per card, bonus if hit)
3D: Wild ball (1 per round, auto-marks 1 missing number)
3E: Pattern matching (full house, lines, corners, X, T, L)
3F: Provably Fair
4A: SQL (casino_bingo_rounds, casino_bingo_cards, casino_bingo_config)
4B: Handler JS
4C: Lua client
1 fase por entrega.
