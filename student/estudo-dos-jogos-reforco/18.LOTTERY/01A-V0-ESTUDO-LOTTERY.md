# CONVERSA 1 — V0 ESTUDO — LOTTERY / LOTERIA (#18)
# O projeto esta importado via GitHub

Voce vai criar o componente visual da Loteria para o Blackout Casino (FiveM). Mega-Sena brasileira + Mega Ball (Evolution Gaming). Globo com bolas quicando, reveal cinematografico, multiplicador. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/18.LOTTERY/3.GUIA-DO-JOGO-LOTERIA-PARTE-1.md`
- `student/estudo-dos-jogos/18.LOTTERY/3.GUIA-DO-JOGO-LOTERIA-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/18.LOTTERY/9.BIBLIOTECA-IMAGENS-LOTERIA-PARTE-1.md`
- `student/estudo-dos-jogos/18.LOTTERY/9.BIBLIOTECA-IMAGENS-LOTERIA-PARTE-2.md`

Navegue e confirme shared icons e UI existem.

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function LotteryGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion. Globo em CSS (nao Canvas obrigatorio).

## PATHS
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green (acerto), #FF4444 red, #0A0A0A fundo
Bolas: dourado #FFD700 com gradiente | Acerto: verde #00E676 | Erro: cinza #666
Mega Ball: dourado intenso com glow pulsante

## 6 TELAS
1. SELECAO BILHETE — Grid 6×10 (60 numeros), selecionar 6, Surpresinha, bet controls
2. SORTEIO — Globo dourado + bolas quicando + reveal numero a numero
3. MEGA BALL — Multiplicador (roda) + bola especial
4. RESULTADO — Acertos, premio, jackpot
5. HISTORICO — Panel slide-in
6. PROVABLY FAIR — Modal

NAO gere codigo. Confirme que leu, entendeu o globo, entendeu Mega Ball.
