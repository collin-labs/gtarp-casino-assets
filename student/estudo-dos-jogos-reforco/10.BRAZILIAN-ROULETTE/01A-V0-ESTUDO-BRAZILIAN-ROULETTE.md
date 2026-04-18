# CONVERSA 1 — V0 ESTUDO — BRAZILIAN ROULETTE (#10)
# O projeto esta importado via GitHub

Voce vai criar o componente visual da Roleta Brasileira para o Blackout Casino (FiveM). 3 modos: Relampago (Lightning), Classica, Mini (Double). Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/2.GUIA-DO-JOGO-BRAZILIAN-ROULETTE-PARTE-1.md`
- `student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/2.GUIA-DO-JOGO-BRAZILIAN-ROULETTE-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/8.BIBLIOTECA-IMAGENS-BRAZILIAN-ROULETTE-PARTE-1.md`
- `student/estudo-dos-jogos/10.BRAZILIAN-ROULETTE/8.BIBLIOTECA-IMAGENS-BRAZILIAN-ROULETTE-PARTE-2.md`

Navegue e confirme shared icons e UI existem.

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function BrazilianRouletteGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion. Roda via CSS rotate (nao Canvas).

## PATHS
Game: /assets/games/brazilian-roulette/ (wheel-european.png, ball-silver.png, felt-texture.png, lightning-bolt.png, mode-lightning.png, mode-classic.png, mode-mini.png, racetrack-overlay.png, chips/)
Logos: /assets/logos-br-para-cards/10.LOGO-BR-BRAZILIAN-ROULETTE.png, logos-in/10.LOGO-IN-BRAZILIAN-ROULETTE.png
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-settings, icon-sound-on/off, icon-copy, icon-check, icon-info
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green, #FF4444 red, #0A0A0A fundo
Numeros: vermelho #C62828, preto #1A1A1A, verde (0) #2E7D32
Lightning: roxo #7C4DFF, dourado #FFD700
Brasil: verde #009739, amarelo #FFDF00

## 8 TELAS
1. MODE SELECT — 3 cards (Relampago/Classica/Mini) com icones e descricao
2. MESA RELAMPAGO — Roda + mesa de apostas completa
3. LIGHTNING PHASE — Numeros selecionados com multiplicadores + raios
4. SPINNING — Roda gira + bola orbita
5. RESULTADO — Numero vencedor, apostas resolvidas
6. BIGWIN — Multiplicador lightning >= 100x, overlay especial
7. HISTORY — Ultimos sorteios
8. PROVABLY FAIR — Seeds + verificar

NAO gere codigo. Confirme que leu e entendeu os 3 modos.
