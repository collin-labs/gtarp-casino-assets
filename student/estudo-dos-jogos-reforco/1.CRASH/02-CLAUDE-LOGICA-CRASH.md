# CONVERSA 2 — CLAUDE LOGICA — CRASH (#1)
# O projeto esta importado via GitHub — NAO precisa anexar nada
# NOTA: Codigo JA EXISTE. Voce vai CORRIGIR bugs e ADICIONAR features.

---

## DOCS — LER DO PROJETO (na integra)
student/estudo-dos-jogos/1.CRASH/3.PROMPT-AI-CRASH-PARTE-1.md — Mecanicas core
student/estudo-dos-jogos/1.CRASH/3.PROMPT-AI-CRASH-PARTE-2.md — Estados, transicoes
student/estudo-dos-jogos/1.CRASH/3.PROMPT-AI-CRASH-PARTE-3.md — RNG, probabilidades
student/estudo-dos-jogos/1.CRASH/5.ROTEIRO-CRASH-PARTE-2.md — Codigo logica
student/estudo-dos-jogos/1.CRASH/5.ROTEIRO-CRASH-PARTE-3.md — Codigo logica

Tambem leia: components/games/crash/CrashGame.tsx (795L), CrashControls.tsx (473L)

## BUGS A CORRIGIR

### #1 CIRCULAR DEPENDENCY (CRITICO)
triggerCrash depende de startNewRound no useCallback. startNewRound depende de soundEnabled/sound. Risco de stale closure ou loop infinito.
Acao: separar o setTimeout do proximo round. Usar ref pra soundEnabled.

### #2 BOTS SO APARECEM NO RISING
fakeBets gerados em startRising(). Devem aparecer durante BETTING.
Acao: mover geracao de bots pro inicio da fase BETTING.

### #3 SEM MIN/MAX
CrashControls nao tem botoes MIN e MAX.
Acao: adicionar MIN (config.MIN_BET) e MAX (min(config.MAX_BET, saldo)).

### #4 SEM MANUAL/AUTO TOGGLE
Nao tem toggle com painel de configuracao auto-bet (quantas rodadas, stop loss, stop profit).
Acao: adicionar estado autoMode com config panel.

### #5 CRASH 1.00x VISUAL
Crash instantaneo (1.00x) usa vermelho igual qualquer crash. Deveria ser amarelo (#FFD700).
Acao: if (crashPoint <= 1.01) usar cor amarela em vez de vermelha.

### #6 SEQUENCIA DE CRASH NAO RIGIDA
Todos os efeitos disparam simultaneamente. Precisa ser sequencial com delays.

## REGRAS
Edicoes CIRURGICAS. Zero rewrite. 1 fix por entrega. Eu testo.
