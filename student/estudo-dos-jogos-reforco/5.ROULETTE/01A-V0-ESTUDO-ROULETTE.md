# CONVERSA 1 — V0 ESTUDO — ROULETTE / ROLETA (#5)
# O projeto esta importado via GitHub

Voce vai criar o componente visual da Roleta para o Blackout Casino (FiveM). Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/5.ROULETTE/2.GUIA-DO-JOGO-ROLETA.md`
- `student/estudo-dos-jogos/5.ROULETTE/8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-1.md`
- `student/estudo-dos-jogos/5.ROULETTE/8.BIBLIOTECA-IMAGENS-ROLETA-PARTE-2.md`

Navegue e confirme que existem:
- `public/assets/games/roulette/` — wheel-european.png, ball.png, felt-texture.png, lightning-bolt.png, racetrack-icon.png
- `public/assets/games/roulette/chips/` — 8 chips (1,5,10,25,50,100,500,1000)
- `public/assets/games/roulette/multipliers/` — 6 multiplicadores (50x-500x)
- `public/assets/shared/icons/` + `public/assets/shared/ui/`

NOTA: 4 assets FALTAM no disco (frame-wheel.png, mode-classic.png, mode-lightning.png, icon-spin.png). Para esses, use alternativas CSS (borda dourada pra frame, icones via Cinzel/emoji pra modes, botao verde pra spin).

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder para assets que EXISTEM
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function RouletteGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion. Roda gira via CSS rotate (nao Canvas).

## PATHS EXATOS
Game: /assets/games/roulette/wheel-european.png, ball.png, felt-texture.png, lightning-bolt.png, racetrack-icon.png
Chips: /assets/games/roulette/chips/chip-{1,5,10,25,50,100,500,1000}.png
Multipliers: /assets/games/roulette/multipliers/multi-{50,100,200,300,400,500}x.png
Logos: /assets/logos-br-para-cards/5.LOGO-BR-ROULETTE.png, /assets/logos-in-para-cards/5.LOGO-IN-ROULETTE.png
Icons shared: icon-gcoin.png, icon-provably-fair.png, icon-history.png, icon-sound-on/off.png, icon-copy.png
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 vermelho roleta, #0A0A0A fundo
Numeros: vermelho #C62828, preto #1A1A1A, verde (0) #2E7D32

## 8 TELAS
1. MODE SELECT — Classic vs Lightning (2 cards)
2. MESA APOSTAS — Layout betting (numeros + outside bets + chips)
3. LIGHTNING PHASE — Lucky numbers com multiplicadores (50x-500x)
4. SPINNING — Roda girando + bola orbitando
5. RESULTADO WIN — Numero destacado, apostas ganhas brilham
6. RESULTADO LOSE — Apostas perdidas dim
7. BIG WIN — Lightning multiplicador 200x+ com overlay especial
8. HISTORICO + PROVABLY FAIR — Modais

NAO gere codigo. Confirme que leu, assets existem, entendeu regras.
