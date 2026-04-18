# CONVERSA 1 — V0 ESTUDO — MARKETPLACE (#16)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Marketplace para o Blackout Casino (FiveM). Plataforma de compra e venda de itens entre jogadores. Estilo Steam Market/CSGOEmpire. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/16.MARKETPLACE/2.GUIA-DO-JOGO-MARKETPLACE.md`
- `student/estudo-dos-jogos/16.MARKETPLACE/2.GUIA-DO-JOGO-MARKETPLACE-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/16.MARKETPLACE/2.GUIA-DO-JOGO-MARKETPLACE-PARTE-3-ADENDO.md`
- `student/estudo-dos-jogos/16.MARKETPLACE/8.BIBLIOTECA-IMAGENS-MARKETPLACE-PARTE-1.md`
- `student/estudo-dos-jogos/16.MARKETPLACE/8.BIBLIOTECA-IMAGENS-MARKETPLACE-PARTE-2.md`

Navegue e confirme: shared icons e UI existem. Itens de Cases (arsenal+garagem) existem.

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function MarketplaceGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion

## PATHS
Itens reutilizados: /assets/games/cases/itens/arsenal/*.png + /assets/games/cases/itens/garagem/*.png
Itens marketplace: /assets/marketplace/items/*.png (12 itens exclusivos)
Icons marketplace: /assets/marketplace/icons/*.png (9 icons)
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES RARIDADE
Common #B0BEC5 | Uncommon #4FC3F7 | Rare #7C4DFF | Epic #FF4081 | Legendary #FFD700

## 10 TELAS
1. GRID — Vitrine de itens a venda, busca, filtros
2. ITEM DETAIL — Modal com info completa + botao COMPRAR
3. BUY CONFIRM — Modal confirmacao de compra
4. CREATE LISTING — Criar anuncio de venda
5. MY LISTINGS — Dashboard dos meus anuncios
6. INVENTORY SELECT — Selecionar item pra vender
7. INSTANT SELL — Venda rapida a 70%
8. WISHLIST + NOTIFICATIONS — Favoritos e alertas
9. SELLER PROFILE — Perfil publico do vendedor
10. ADMIN DASHBOARD — Painel admin (moderar, stats)

NAO gere codigo. Confirme que leu, entendeu que eh e-commerce, entendeu regras.
