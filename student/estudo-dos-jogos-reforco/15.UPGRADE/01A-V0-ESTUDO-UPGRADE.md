# CONVERSA 1 — V0 ESTUDO — UPGRADE (#15)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Upgrade para o Blackout Casino (FiveM). Jogador aposta um item do inventario contra um item de valor superior. Wheel SVG circular mostra a chance. Ticker gira e decide. Estilo CSGORoll/Clash.gg. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/15.UPGRADE/2.GUIA-DO-JOGO-UPGRADE.md`
- `student/estudo-dos-jogos/15.UPGRADE/8.BIBLIOTECA-IMAGENS-UPGRADE-PARTE-1.md`
- `student/estudo-dos-jogos/15.UPGRADE/8.BIBLIOTECA-IMAGENS-UPGRADE-PARTE-2.md`

Navegue e confirme que existem:
- `public/assets/games/cases/itens/arsenal/` — 8 itens PNG
- `public/assets/games/cases/itens/garagem/` — 8 itens PNG
- `public/assets/shared/icons/` + `public/assets/shared/ui/`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — usar PNGs reais dos itens
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function UpgradeGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion. Wheel SVG (NAO Canvas).

## PATHS
Itens: /assets/games/cases/itens/arsenal/*.png (8) + /assets/games/cases/itens/garagem/*.png (8)
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #00E676 green (win zone), #FF4444 red (lose zone), #0A0A0A fundo
Raridade: Common #B0BEC5, Uncommon #4FC3F7, Rare #7C4DFF, Epic #FF4081, Legendary #FFD700

## 9 TELAS
1. SELECAO ITENS — Inventario grid + selecionar item apostado + item alvo
2. READY — Wheel preview com porcentagem calculada + botao UPGRADE
3. MODAL CONFIRMACAO — "Tem certeza? Item sera DESTRUIDO se perder"
4. SPINNING — Wheel ticker girando ~3.5s
5. RESULTADO WIN — Item alvo ganho, confetti, celebracao
6. RESULTADO LOSE — Item destruido, animacao de perda
7. MODO GCOIN — Aposta GCoin contra multiplicador (sem inventario)
8. HISTORICO — Panel slide-in
9. PROVABLY FAIR — Modal seeds + verificar

NAO gere codigo. Confirme que leu, itens existem, wheel eh SVG, entendeu.
