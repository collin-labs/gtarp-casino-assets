# CONVERSA 4 — CLAUDE POLISH VISUAL — MINES (#3)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## CONTEXTO
Mines (#3) do Blackout Casino. Visual gerado pelo V0, precisa de polish premium. Viewport 1280x720.

## DOCS — LER DO PROJETO (TODOS — na integra)
student/estudo-dos-jogos/3.MINES/4.ADENDO-DS-MINES-PARTE-1.md — Tokens, paleta, tipografia
student/estudo-dos-jogos/3.MINES/4.ADENDO-DS-MINES-PARTE-2.md — Componentes, botoes, inputs
student/estudo-dos-jogos/3.MINES/4.ADENDO-DS-MINES-PARTE-3.md — Animacoes, timelines, estados
student/estudo-dos-jogos/3.MINES/4.ADENDO-DS-MINES-PARTE-4-ADENDO.md — Complemento tokens
student/estudo-dos-jogos/3.MINES/4.ADENDO-DS-MINES-PARTE-5-ADENDO.md — Complemento animacoes
student/estudo-dos-jogos/3.MINES/7.CSS-COMPONENTES-MINES-PARTE-1.md — @keyframes, hover
student/estudo-dos-jogos/3.MINES/7.CSS-COMPONENTES-MINES-PARTE-2.md — Mais @keyframes
student/estudo-dos-jogos/3.MINES/7.CSS-COMPONENTES-MINES-PARTE-3-ADENDO.md — Complemento CSS
student/estudo-dos-jogos/3.MINES/9.GUIA-INTEGRACAO-V0-MINES.md — Como integrar output V0

Referencia visual: components/casino/GameCard.tsx (7 camadas)

## ASSETS EXISTEM — NAO CRIE NADA
public/assets/games/mines/ (gem.png, bomb.png), shared/icons/, shared/ui/

## REGRAS
CSS inline, Cinzel/Inter/JetBrains Mono, cores #D4A843/#00E676/#EB4B4B/#0A0A0A, bordas rgba, clamp(), edicoes CIRURGICAS.

## TAREFAS
1. Verificar se grid 5x5 cabe inteiro em 1280x720 sem cortar
2. Verificar gem.png e bomb.png usados corretamente (nao placeholder)
3. Aplicar tokens CSS do Doc 4 (todas as 5 partes)
4. Aplicar @keyframes do Doc 7 (todas as 3 partes): tile-reveal, gem-glow, bomb-shake, cashout-pulse
5. 7 camadas de efeito nos tiles revelados e no frame do grid
6. Hover/active/disabled em TODOS os botoes
7. Stagger na revelacao das tiles (delay por posicao)
8. Screen shake no bust (bomb), confetti no win
9. Touch targets 44px, clamp() em tudo
10. Seguir Doc 9 pra integrar corretamente

## METODO
Leia docs. Liste problemas. 1 correcao por vez. Edicoes cirurgicas.
