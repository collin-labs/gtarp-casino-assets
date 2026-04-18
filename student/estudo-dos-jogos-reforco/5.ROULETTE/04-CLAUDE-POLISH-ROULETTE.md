# CONVERSA 4 — CLAUDE POLISH VISUAL — ROULETTE (#5)
# O projeto esta importado via GitHub — NAO precisa anexar nada

## DOCS — LER DO PROJETO (TODOS na integra)
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-1.md — Tokens, paleta
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-2.md — Componentes
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-3.md — Animacoes
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-4.md — Estados
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-5-ADENDO.md — Complemento
student/estudo-dos-jogos/5.ROULETTE/4.ADENDO-DS-ROLETA-PARTE-6-ADENDO.md — Complemento
student/estudo-dos-jogos/5.ROULETTE/7.CSS-COMPONENTES-ROLETA-PARTE-1.md — @keyframes
student/estudo-dos-jogos/5.ROULETTE/7.CSS-COMPONENTES-ROLETA-PARTE-2-ADENDO.md — Mais CSS
student/estudo-dos-jogos/5.ROULETTE/7.CSS-COMPONENTES-ROLETA-PARTE-3-ADENDO.md — Complemento
student/estudo-dos-jogos/5.ROULETTE/9.GUIA-INTEGRACAO-V0-ROLETA.md — Como integrar

Referencia: components/casino/GameCard.tsx (7 camadas)

## ASSETS — 19 EXISTEM, 4 FALTAM
Existem: wheel-european, ball, felt-texture, lightning-bolt, racetrack-icon, 8 chips, 6 multipliers
Faltam: frame-wheel.png, mode-classic.png, mode-lightning.png, icon-spin.png
Para os faltantes: usar CSS (borda dourada pra frame, gradientes pra modes, botao verde pra spin).

## TAREFAS
1. Roda da roleta: wheel-european.png girando suave (CSS rotate, nao Canvas)
2. Mesa de apostas: layout numeros 0-36, outside bets, chips empilhados com felt-texture.png
3. Lightning phase: multiplicadores com imagens de /multipliers/, bolt com lightning-bolt.png
4. Aplicar tokens Doc 4 (6 partes) + @keyframes Doc 7 (3 partes)
5. 7 camadas nos elementos principais (roda, mesa, chips)
6. Hover/active/disabled todos botoes + numeros da mesa
7. Stagger na revelacao de numeros lightning
8. Resultado overlays: win glow verde, big win shimmer, lose dim
9. Touch 44px, clamp(), bordas rgba
10. Seguir Doc 9

CSS inline, edicoes CIRURGICAS. Leia docs. 1 entrega por vez.
