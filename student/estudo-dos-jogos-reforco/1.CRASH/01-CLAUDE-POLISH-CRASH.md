# CONVERSA 1 — CLAUDE POLISH VISUAL — CRASH (#1)
# O projeto esta importado via GitHub — NAO precisa anexar nada
# NOTA: O V0 JA TERMINOU. O codigo JA EXISTE. Voce vai CORRIGIR e MELHORAR.

---

## CONTEXTO
O Crash (#1) ja tem 9 arquivos em components/games/crash/ (3.202 linhas). O V0 entregou 70%. Faltam efeitos visuais criticos e polish premium.

## DOCS — LER DO PROJETO (na integra, TODOS)
student/estudo-dos-jogos/1.CRASH/2.GUIA-DO-JOGO-CRASH.md — Visao geral
student/estudo-dos-jogos/1.CRASH/3.PROMPT-AI-CRASH-PARTE-5-ADENDO.md — Paths consolidados
student/estudo-dos-jogos/1.CRASH/4.ADENDO-DS-CRASH-PARTE-1.md — Tokens CSS, paleta
student/estudo-dos-jogos/1.CRASH/4.ADENDO-DS-CRASH-PARTE-2.md — Componentes, botoes
student/estudo-dos-jogos/1.CRASH/4.ADENDO-DS-CRASH-PARTE-3.md — Animacoes, timelines
student/estudo-dos-jogos/1.CRASH/4.ADENDO-DS-CRASH-PARTE-4-ADENDO.md — Complemento
student/estudo-dos-jogos/1.CRASH/4.ADENDO-DS-CRASH-PARTE-5-ADENDO.md — Complemento
student/estudo-dos-jogos/1.CRASH/5.ROTEIRO-CRASH-PARTE-1.md — Sequencias de animacao
student/estudo-dos-jogos/1.CRASH/7.CSS-COMPONENTES-CRASH-PARTE-1.md — @keyframes
student/estudo-dos-jogos/1.CRASH/7.CSS-COMPONENTES-CRASH-PARTE-2.md — Mais @keyframes
student/estudo-dos-jogos/1.CRASH/7.CSS-COMPONENTES-CRASH-PARTE-3-ADENDO.md — Complemento
student/estudo-dos-jogos/1.CRASH/7.CSS-COMPONENTES-CRASH-PARTE-4-ADENDO.md — Complemento

Tambem leia o CODIGO EXISTENTE:
components/games/crash/CrashGame.tsx (795L)
components/games/crash/CrashCanvas.tsx (476L)
components/games/crash/CrashControls.tsx (473L)

Referencia visual: components/casino/GameCard.tsx (7 camadas)

## ASSETS — JA EXISTEM, NAO CRIE NADA
public/assets/games/crash/ — 7 arquivos (rocket-idle, rocket-flying, explosion, trail-fire, particles-gold, stars-bg, frame-canvas)
public/assets/shared/icons/ — 24 icones
public/assets/shared/ui/ — bg-casino.png

## PROBLEMAS A CORRIGIR

### #1 FOGUETE NAO EXISTE NO CODIGO (CRITICO)
rocket-idle.png e rocket-flying.png estao no disco mas NUNCA referenciados. trail-fire.png tambem.
Acao no CrashCanvas.tsx: carregar imagens, desenhar foguete no ponto final da curva rotacionado pela tangente, trail atras. BETTING=rocket-idle, RISING=rocket-flying, CRASHED=desaparece.

### #2 PARTICULAS SO TEM PATH
particles-gold.png definido em ASSETS mas nunca renderizado.
Acao: no crash, 20 particulas do ponto final com velocidade radial, fade out 1s.

### #3 SEQUENCIA DE CRASH RIGIDA
Tudo acontece junto. Deve ser: tom para → curva vermelha → flash vermelho (rgba(255,68,68,0.15) 200ms) → screen shake (x[-3,3,-2,2,0] 0.4s) → particulas → badge CRASHED → overlay resultado.

### #4 EFEITOS DE VITORIA
Zero confetti, zero rolling counter.
Acao: confetti dourado ao sacar + countup animado 0→valor em ~1.5s.

### #5 LABELS DO GRID
"1x", "2x", "5x", "10x" nao desenhados nos eixos do canvas.

### #6 MILESTONE BADGES
Nenhum feedback ao passar 2x, 5x, 10x. Badge temporario + som ding.

### #7 POLISH Doc 4 + Doc 7
Tokens CSS, @keyframes (shimmer, pulse-gold, glow-breathe), hover states, stagger, noise texture.

## REGRAS
CSS inline, Cinzel/JetBrains Mono/Inter, #D4A843/#00E676/#FF4444/#0A0A0A, bordas rgba, clamp(), shadowBlur DESLIGADO (CEF M103), zero deps novas, regra X15, edicoes CIRURGICAS.

## METODO
Leia codigo + docs. Apresente plano. 1 entrega por vez. Eu testo.
