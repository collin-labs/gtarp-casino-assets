# CONVERSA 6 — CLAUDE LOGICA + BACKEND — SLOT MACHINE (#2)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## DOCS — LER DO PROJETO
student/estudo-dos-jogos/2.SLOT-MACHINE/3.PROMPT-AI-SLOT-MACHINE-PARTE-1.md
student/estudo-dos-jogos/2.SLOT-MACHINE/3.PROMPT-AI-SLOT-MACHINE-PARTE-2.md
student/estudo-dos-jogos/2.SLOT-MACHINE/3.PROMPT-AI-SLOT-MACHINE-PARTE-3.md
student/estudo-dos-jogos/2.SLOT-MACHINE/3.PROMPT-AI-SLOT-MACHINE-PARTE-4.md
student/estudo-dos-jogos/2.SLOT-MACHINE/5.ROTEIRO-SLOT-MACHINE-PARTE-1.md
student/estudo-dos-jogos/2.SLOT-MACHINE/5.ROTEIRO-SLOT-MACHINE-PARTE-2.md
student/estudo-dos-jogos/2.SLOT-MACHINE/5.ROTEIRO-SLOT-MACHINE-PARTE-3.md
student/estudo-dos-jogos/2.SLOT-MACHINE/5.ROTEIRO-SLOT-MACHINE-PARTE-4.md
student/estudo-dos-jogos/2.SLOT-MACHINE/5.ROTEIRO-SLOT-MACHINE-PARTE-5.md
Referencia: server/handlers/panel.js, client/panel_client.lua, sql/panel.sql, hooks/use-game-api.ts

## CRIAR
components/games/slots/SlotsLogic.ts, SlotsTypes.ts, SlotsConstants.ts, useSlotsSounds.ts, index.ts
server/handlers/slots.js | sql/slots.sql | client/slots_client.lua

## FASES
3A: Tipos+Constantes | 3B: Engine (grid,tumble,FS,provably fair) | 3C: Classic engine
3D: Integrar logica no visual | 4A: SQL | 4B: Handler JS | 4C: Lua

1 fase por entrega. Edicoes cirurgicas no SlotsGame.tsx. Logica separada. Mock funcional no browser.
