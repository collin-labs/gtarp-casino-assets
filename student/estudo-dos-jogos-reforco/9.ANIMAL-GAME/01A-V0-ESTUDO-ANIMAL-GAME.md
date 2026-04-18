# CONVERSA 1 — V0 ESTUDO — ANIMAL GAME / JOGO DO BICHO (#9)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Jogo do Bicho para o Blackout Casino (FiveM). 25 grupos de animais, apostas por grupo/dezena/centena/milhar, sorteio com 5 capsulas. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/9.ANIMAL-GAME/2.GUIA-DO-JOGO-ANIMAL-GAME-PARTE-1.md`
- `student/estudo-dos-jogos/9.ANIMAL-GAME/2.GUIA-DO-JOGO-ANIMAL-GAME-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/9.ANIMAL-GAME/8.BIBLIOTECA-IMAGENS-ANIMAL-GAME-PARTE-1.md`
- `student/estudo-dos-jogos/9.ANIMAL-GAME/8.BIBLIOTECA-IMAGENS-ANIMAL-GAME-PARTE-2.md`
- `student/estudo-dos-jogos/9.ANIMAL-GAME/8.BIBLIOTECA-IMAGENS-ANIMAL-GAME-PARTE-3.md`

Navegue e confirme que existem:
- `public/assets/games/bicho/` — 25 PNGs (1.png a 25.png, um por grupo animal)
- `public/assets/shared/icons/` — 24 icones
- `public/assets/shared/ui/` — bg-casino.png

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — os 25 animais JA EXISTEM
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function AnimalGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion para animacoes

## PATHS EXATOS
Animais: /assets/games/bicho/1.png a /assets/games/bicho/25.png
Logos: /assets/logos-br-para-cards/9.LOGO-BR-ANIMAL-GAME.png, /assets/logos-in-para-cards/9.LOGO-IN-ANIMAL-GAME.png
Icons: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy, icon-auto, icon-random
UI: /assets/shared/ui/bg-casino.png

## OS 25 GRUPOS (path: /assets/games/bicho/{N}.png)
1-Avestruz 2-Aguia 3-Burro 4-Borboleta 5-Cachorro 6-Cabra 7-Carneiro
8-Camelo 9-Cobra 10-Coelho 11-Cavalo 12-Elefante 13-Galo 14-Gato
15-Jacare 16-Leao 17-Macaco 18-Porco 19-Pavao 20-Peru 21-Touro
22-Tigre 23-Urso 24-Veado 25-Vaca

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Capsulas sorteio: #D4A843 dourado metalico com glow

## 6 TELAS
1. APOSTAS — Grid 5x5 com 25 animais, tipos aposta (grupo/dezena/centena/milhar), bet controls
2. SORTEIO — 5 capsulas douradas revelando sequencialmente (stagger), numeros + grupo
3. VITORIA — Overlay verde, animal vencedor destaque, multiplicador, countup
4. DERROTA — Feedback discreto, resultado mostrado
5. HISTORICO — Slide-in lateral com ultimos sorteios
6. PROVABLY FAIR — Modal seeds + hash + verificar

NAO gere codigo. Confirme que leu, 25 PNGs existem, entendeu regras.
