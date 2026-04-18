# CONVERSA 5 — CLAUDE LOGICA + BACKEND — POKER (#6)
# O projeto esta importado via GitHub

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa: student/estudo-dos-jogos/6.POKER/0.PESQUISA-REGRA0-POKER-PARTE-1.md a PARTE-4-ADENDO.md (4 arquivos)
Mega Estudo: student/estudo-dos-jogos/6.POKER/1.MEGA-ESTUDO-POKER-PARTE-1.md a PARTE-3-ADENDO-2.md (4 arquivos)
Logica: student/estudo-dos-jogos/6.POKER/3.PROMPT-AI-POKER-PARTE-1.md a PARTE-6-ADENDO.md (6 arquivos)
Roteiro: student/estudo-dos-jogos/6.POKER/5.ROTEIRO-POKER-PARTE-1.md a PARTE-7-ADENDO.md (7 arquivos)
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/poker/PokerLogic.ts, PokerTypes.ts, PokerConstants.ts, usePokerSounds.ts, index.ts
server/handlers/poker.js | sql/poker.sql | client/poker_client.lua

## FASES
3A: Tipos (Card, Hand, HandRank, GameMode, GameState) + Constantes (deck 52, rankings, payouts Caribbean+UTH)
3B: Engine Caribbean Stud (deal 5+5, evaluate hand, dealer qualifica Ace-King+, compare, payouts)
3C: Engine UTH (deal hole+community, evaluate best-5-of-7, blind/trips/ante payouts, dealer qualifica)
3D: Hand evaluator (Royal Flush→High Card, kickers, compare)
3E: Side bets (Progressive Jackpot, Trips+, pair plus)
3F: Provably Fair (HMAC-SHA256 pra shuffle)
4A: SQL (casino_poker_hands, casino_poker_config)
4B: Handler JS (poker:deal, poker:fold, poker:raise, poker:check, poker:bet, poker:getHistory, poker:verify)
4C: Lua client + conectar frontend

1 fase por entrega. Edicoes cirurgicas.
