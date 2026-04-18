# CONVERSA 1 — V0 ESTUDO — INVENTORY (#17)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Inventario para o Blackout Casino (FiveM). Cofre pessoal do jogador — grid de itens com raridade, vender, enviar pro Upgrade #15 ou Marketplace #16. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/17.INVENTORY/2.GUIA-DO-JOGO-INVENTORY\`-PARTE-1.md`
- `student/estudo-dos-jogos/17.INVENTORY/2.GUIA-DO-JOGO-INVENTORY-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/17.INVENTORY/2.GUIA-DO-JOGO-INVENTORY-PARTE-3-ADENDO.md`
- `student/estudo-dos-jogos/17.INVENTORY/8.BIBLIOTECA-IMAGENS-INVENTORY-PARTE-1.md`
- `student/estudo-dos-jogos/17.INVENTORY/8.BIBLIOTECA-IMAGENS-INVENTORY-PARTE-2.md`

Navegue e confirme itens existem:
- `public/assets/games/cases/itens/arsenal/` — 8 armas PNG
- `public/assets/games/cases/itens/garagem/` — 8 veiculos PNG
- `public/assets/shared/icons/` + `public/assets/shared/ui/`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — usar PNGs reais dos itens
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function InventoryGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion

## PATHS
Itens: /assets/games/cases/itens/arsenal/*.png (8) + /assets/games/cases/itens/garagem/*.png (8)
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES RARIDADE
Common #B0BEC5 | Uncommon #4FC3F7 | Rare #7C4DFF | Epic #FF4081 | Legendary #FFD700

## 4 TELAS
1. GRID INVENTARIO — Grid de itens com filtros, ordenacao, valor total
2. MODAL DETALHES — Info do item + botoes Vender/Upgrade/Market
3. CONFIRMACAO VENDA — Modal "tem certeza?" + preview + valor
4. EMPTY STATE — Inventario vazio com CTAs pra Cases e Market

NAO gere codigo. Confirme que leu, itens existem, entendeu regras.
