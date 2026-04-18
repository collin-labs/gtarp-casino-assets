# CONVERSA 1 — V0 ESTUDO — DICE / DADOS (#7)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Dice (Dados) para o Blackout Casino (FiveM). 2 dados 3D com Lightning mode. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/7.DICE/2.GUIA-DO-JOGO-DICE.md`
- `student/estudo-dos-jogos/7.DICE/2.GUIA-DO-JOGO-DICE-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/7.DICE/8.BIBLIOTECA-IMAGENS-DICE-PARTE-1.md`
- `student/estudo-dos-jogos/7.DICE/8.BIBLIOTECA-IMAGENS-DICE-PARTE-2.md`

Navegue e confirme:
- `public/assets/shared/icons/` — 24 icones
- `public/assets/shared/ui/` — bg-casino.png

## NOTA TECNICA CRITICA
Os dados NAO usam imagens PNG. Sao CUBOS CSS 3D construidos com:
- perspective: 800px no container
- transform-style: preserve-3d no cubo
- 6 faces posicionadas com translateZ + rotateX/Y
- Pips (bolinhas) desenhados com CSS (circulos posicionados)
- Framer Motion anima rotateX/Y/Z pra girar ate a face correta
- FACE_ROTATIONS: face1{x:0,y:0} face2{x:0,y:-90} face3{x:-90,y:0} face4{x:90,y:0} face5{x:0,y:90} face6{x:0,y:180}

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function DiceGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion para 3D rotation dos dados + animacoes

## PATHS (shared — os dados sao CSS puro)
Icons: icon-gcoin, icon-provably-fair, icon-history, icon-auto-bet, icon-auto, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png
Logos: /assets/logos-br-para-cards/7.LOGO-BR-DICE.png, /assets/logos-in-para-cards/7.LOGO-IN-DICE.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Dado: fundo #1A1A2E, pips #FFD700 (dourado), borda rgba(212,168,67,0.3)
Lightning: #7C4DFF roxo, #FFD700 dourado

## 8 TELAS
1. IDLE — Grid apostas (2-12), 2 dados dim ao centro, bet controls, botao ROLAR
2. LIGHTNING PHASE — Numeros aleatorios recebem multiplicadores (flash roxo/dourado)
3. ROLLING + LANDING — Dados giram 3D (2-4 voltas), pousam com bounce
4. RESULT — Total revelado, apostas ganhas brilham, perdidas dim
5. BIG WIN — Lightning multiplicador acertado, confetti, overlay especial
6. HISTORY — Lista rodadas passadas
7. PROVABLY FAIR — Seeds, hash, verificacao
8. AUTO-BET — Config rodadas automaticas (qtd, stop loss, stop profit)

NAO gere codigo. Confirme que leu, entendeu os dados CSS 3D, entendeu regras.
