# CONVERSA 5 — CLAUDE LOGICA + BACKEND — BLACKJACK (#4)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## DOCS — LER DO PROJETO (TODOS na integra)

Pesquisa + Mecanicas:
student/estudo-dos-jogos/4.BLACKJACK/0.PESQUISA-REGRA0-BLACKJACK-PARTE-1.md
student/estudo-dos-jogos/4.BLACKJACK/0.PESQUISA-REGRA0-BLACKJACK-PARTE-2.md
student/estudo-dos-jogos/4.BLACKJACK/1.MEGA-ESTUDO-BLACKJACK-PARTE-1.md
student/estudo-dos-jogos/4.BLACKJACK/1.MEGA-ESTUDO-BLACKJACK-PARTE-2.md

Logica:
student/estudo-dos-jogos/4.BLACKJACK/3.PROMPT-AI-BLACKJACK-PARTE-1.md — Core (deal, hit, stand)
student/estudo-dos-jogos/4.BLACKJACK/3.PROMPT-AI-BLACKJACK-PARTE-2.md — Decisoes (double, split, insurance)
student/estudo-dos-jogos/4.BLACKJACK/3.PROMPT-AI-BLACKJACK-PARTE-3.md — Provably fair, baralho
student/estudo-dos-jogos/4.BLACKJACK/3.PROMPT-AI-BLACKJACK-PARTE-4-ADENDO.md — Mock data
student/estudo-dos-jogos/4.BLACKJACK/3.PROMPT-AI-BLACKJACK-PARTE-5-ADENDO.md — Paths

Roteiro:
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-1.md — Tipos
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-2.md — Engine (deal, evaluate, strategy)
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-3.md — Split, insurance, side bets
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-4.md — Backend SQL+Handler
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-5.md — Lua + integracao
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-6-ADENDO.md — Adendo
student/estudo-dos-jogos/4.BLACKJACK/5.ROTEIRO-BLACKJACK-PARTE-7-ADENDO.md — Adendo

Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql

## CRIAR
components/games/blackjack/BlackjackLogic.ts, BlackjackTypes.ts, BlackjackConstants.ts, useBlackjackSounds.ts, index.ts
server/handlers/blackjack.js | sql/blackjack.sql | client/blackjack_client.lua

## FASES
3A: Tipos (Card, Hand, GameState, Action) + Constantes (deck, payouts, rules)
3B: Engine (shuffle, deal, hit, stand, evaluate hand value, determine winner)
3C: Features avancadas (split, double down, insurance, push, blackjack 3:2)
3D: Provably Fair (HMAC-SHA256 pra shuffle do baralho)
4A: SQL (casino_blackjack_hands, casino_blackjack_config + seeds)
4B: Handler JS (blackjack:deal, blackjack:hit, blackjack:stand, blackjack:double, blackjack:split, blackjack:insurance, blackjack:getHistory, blackjack:verify)
4C: Lua client
4D: Conectar frontend ao backend

1 fase por entrega. Edicoes cirurgicas. Mock funcional.
