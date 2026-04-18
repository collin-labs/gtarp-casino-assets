# REFORCO VISUAL — MARKETPLACE (#16) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Skeleton loading shimmer (logrocket, subframe), debounce 300ms (dmitripavlutin, c-sharpcorner), dark card glow (freefrontend)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] GRID: auto-fill minmax(clamp(160px,18vw,200px),1fr) com cards premium
- [ ] CARD: 5 boxShadow + outline + feixo verde base + shimmer sweep hover + badge raridade + badge origem
- [ ] SEARCH BAR: input #141414 + icon lupa PNG + debounce 300ms + focus borderColor dourado
- [ ] SIDEBAR FILTROS: chips com borderLeft ativo + titulo Cinzel dourado + preco Min/Max inputs
- [ ] SKELETON LOADING: pulse shimmer (NUNCA spinner) com animation market-shimmer 1.5s infinite
- [ ] ITEM DETAIL: modal glassmorphism + imagem + preco + trend + vendedor + COMPRAR/OFERTA
- [ ] BUY CONFIRM: modal com linhas item/taxa/total + saldo antes/depois + CONFIRMAR
- [ ] CREATE LISTING: grid inventario + preview + input preco + atalhos + INSTANT SELL + LISTAR
- [ ] MY LISTINGS: tabs ATIVOS/VENDIDOS/EXPIRADOS + rows com editar/cancelar/ofertas
- [ ] RARIDADE: 5 cores CORRETAS — Common #4B69FF, Uncommon #8847FF, Rare #D32CE6, Epic #EB4B4B, Legendary #FFD700
- [ ] 10 telas completas (Grid, ItemDetail, BuyConfirm, CreateListing, MyListings, InventorySelect, InstantSell, Wishlist, SellerProfile, Admin)
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  display: 'flex', flexDirection: 'column',
}}
```

Titulo MARKETPLACE: Cinzel 700, clamp(14px,1.8vw,20px), **#FFD700** (nao #D4A843 — destaque especial), textShadow `0 0 20px rgba(255,215,0,0.15)`.

---

## 2. SEARCH BAR + FILTROS + GRID

SEARCH INPUT:
```
style={{
  width: '100%', height: 'clamp(32px, 4vh, 40px)',
  background: '#141414', border: '1px solid #222222', borderRadius: 6,
  padding: '0 clamp(10px,1vw,14px) 0 clamp(30px,3.5vw,38px)',
  color: '#FFFFFF', fontFamily: "'Inter', sans-serif", fontSize: 'clamp(11px,1.2vw,14px)',
}}
```
Focus: borderColor rgba(255,215,0,0.4), boxShadow `0 0 0 2px rgba(255,215,0,0.08)`.
Icone lupa: PNG icon-search-gold.png, 16x16, position absolute left 10px.
**DEBOUNCE 300ms** com useMemo + lodash.debounce (useRef pra timer entre re-renders).

Btn VENDER: bg #00E676, color #000, Inter 700 clamp(10px,1.1vw,13px), minHeight 44.

SIDEBAR FILTROS: bg #0D0D0D, borderRight 1px rgba(255,255,255,0.04).
Titulo grupo: Cinzel 700 clamp(9px,1vw,11px) #D4A843 uppercase letterSpacing 1.5px.
Chip ATIVO: bg rgba(212,168,67,0.08), color #FFD700, borderLeft 2px solid #D4A843.
Chip INATIVO: color #999.
Preco: 2 inputs MIN/MAX (JetBrains Mono), NAO slider.

GRID:
```
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 18vw, 200px), 1fr))',
  gap: 'clamp(8px, 1vw, 12px)',
}}
```

---

## 3. PRODUCT CARD — Premium com 5 estados

CARD BASE:
```
style={{
  background: 'rgba(5,5,5,0.95)',
  border: '2px solid rgba(212,168,67,0.3)',
  outline: '1px solid rgba(191,149,63,0.15)', outlineOffset: 3,
  borderRadius: 14, overflow: 'hidden', cursor: 'pointer', position: 'relative',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 4px 15px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,0,0.08), inset 0 0 15px rgba(0,0,0,0.4), 0 -1px 8px rgba(0,230,118,0.08)',
}}
```
Hover: borderColor rgba(212,168,67,0.7), translateY -4px, boxShadow cresce.
Stagger entrada: delay index * 0.03, initial opacity 0 y 15.

FEIXO RARIDADE na base da imagem: 2px height, gradient da cor da raridade.
Badge raridade: canto superior esquerdo, cor conforme tier.
Badge origem: canto superior direito (nome do jogo de onde veio).
Preco: JetBrains 700, #00E676, com icon GCoin.
Favorito: coracao canto inferior direito, toggle vermelho quando ativo.

SHIMMER SWEEP hover:
```
background: 'linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.06) 45%, rgba(255,215,0,0.12) 50%, rgba(255,215,0,0.06) 55%, transparent 60%)',
backgroundSize: '200% 100%', animation: 'market-shimmer 2s infinite',
```

---

## 4. SKELETON LOADING (NUNCA spinner)

Enquanto dados carregam, mostrar cards skeleton com shimmer:
```
style skeleton={{
  background: 'linear-gradient(90deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)',
  backgroundSize: '200% 100%',
  borderRadius: 8,
  animation: 'market-shimmer 1.5s ease-in-out infinite',
}}
```
Skeleton card: mesmas dimensoes do card real. Blocos: imagem (60%), titulo (12px height), preco (12px height 50% width).

---

## 5. CORES DE RARIDADE (paleta MARKETPLACE — mesma de Cases #14)

| Raridade | Cor | Feixo base | Glow hover |
|----------|-----|-----------|-----------|
| Common | #4B69FF | gradient azul 2px | 0 0 8px rgba(75,105,255,0.2) |
| Uncommon | #8847FF | gradient roxo 2px | 0 0 10px rgba(136,71,255,0.3) |
| Rare | #D32CE6 | gradient magenta 2px | 0 0 12px rgba(211,44,230,0.3) |
| Epic | #EB4B4B | gradient vermelho 2px | 0 0 14px rgba(235,75,75,0.4) |
| Legendary | #FFD700 | gradient dourado 2px + particulas | 0 0 20px rgba(255,215,0,0.5) |

---

## 6. MODAIS — Item Detail + Buy Confirm + Instant Sell

OVERLAY:
```
style={{
  position: 'absolute', inset: 0, zIndex: 70,
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}
```

MODAL CONTAINER:
```
style={{
  background: 'rgba(17,17,17,0.97)',
  border: '1px solid rgba(212,168,67,0.15)', borderRadius: 12,
  boxShadow: '0 0 0 1px rgba(212,168,67,0.05), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,215,0,0.05)',
  maxWidth: 'clamp(400px, 50vw, 600px)', width: '90%',
  padding: 'clamp(16px, 2vw, 24px)', position: 'relative',
}}
```
Framer: initial{{ opacity:0, scale:0.95 }}, animate{{ opacity:1, scale:1 }}, duration 0.25s.

**Item Detail:** imagem fundo #0D0D0D + nome Cinzel #FFD700 + preco JetBrains #00E676 + trend (verde/vermelho) + vendedor clicavel #D4A843 + btn COMPRAR (market-btn--primary) + btn OFERTA (market-btn--gold).

**Buy Confirm:** linhas item/taxa(7.5%)/total + divider + saldo antes/depois (verde suficiente, vermelho insuficiente) + CANCELAR ghost + CONFIRMAR verde. Apos: checkmark spring scale 0→1.2→1.

**Instant Sell:** taxa 30% em #FF1744 + VOCE RECEBE JetBrains clamp(18px,2.2vw,24px) #00E676 + aviso vermelho sutil + btn VENDER AGORA dourado (market-btn--gold).

---

## 7. CREATE LISTING + MY LISTINGS + TELAS 6-10

**Create Listing:** grid inventario minmax(clamp(100px,12vw,130px),1fr) + preview + input preco JetBrains + atalhos MIN/x2/÷2/MAX + preco sugerido #888 + btn INSTANT SELL dourado + btn LISTAR verde.

**My Listings:** tabs ATIVOS/VENDIDOS/EXPIRADOS (tab ativa #FFD700 borda inferior gradient) + rows com thumb + nome + preco + views + ofertas + tempo + btns EDITAR/CANCELAR/OFERTAS. Stagger 0.03s.

**Inventory Select (Tela 6):** modal fullscreen z-70, grid clamp(120px,14vw,150px), card selecionado border #FFD700 + glow.

**Wishlist+Notifications (Tela 8):** tabs + favoritos com trend +/- + notificacoes com icone tipo + borderLeft #FFD700 (nao lida) vs transparent (lida).

**Seller Profile (Tela 9):** avatar 48-64px + rating stars #FFD700 + grid anuncios + avaliacoes.

**Admin Dashboard (Tela 10):** stat cards #111111 + config inputs + audit log JetBrains Mono.

---

## 8. KEYFRAMES OBRIGATORIOS (6)

```css
@keyframes market-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes market-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes market-slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes market-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.3); }
  50% { box-shadow: 0 0 12px 4px rgba(212,168,67,0.15); }
}
@keyframes market-coinDrop {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(40px) rotate(180deg); opacity: 0; }
}
@keyframes market-success {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA spinner de loading — SEMPRE skeleton pulse com market-shimmer
2.  NUNCA cores de raridade do Case Battle (#B0BEC5 etc) — usar paleta Marketplace/Cases (#4B69FF etc)
3.  NUNCA onChange sem debounce — 300ms obrigatorio no search input
4.  NUNCA fundo claro — #0A0A0A
5.  NUNCA sans-serif em titulos — Cinzel
6.  NUNCA px fixo — SEMPRE clamp()
7.  NUNCA botao < 44px
8.  NUNCA GCoin diferente de #00E676
9.  NUNCA icones Lucide para identidade — PNGs dourados (X21)
10. NUNCA modal sem backdrop-filter blur
11. NUNCA position:fixed em NUI — usar position:absolute
12. NUNCA z-index > 90 em NUI
13. NUNCA card sem feixo raridade na base + shimmer sweep hover
14. NUNCA preco sem JetBrains Mono + icon GCoin
15. NUNCA backdrop-filter no grid (so modais) — CEF flickering em scroll
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Grid | Lista vertical | auto-fill minmax(clamp(160px,18vw,200px),1fr) + stagger 30ms |
| Card | Div com texto e borda | 5-shadow + outline + feixo raridade + shimmer sweep + badges |
| Loading | Spinner | Skeleton pulse shimmer #1A1A1A→#2A2A2A→#1A1A1A 1.5s |
| Search | Input nativo | #141414 + lupa PNG + debounce 300ms + focus glow dourado |
| Filtros | Checkboxes nativos | Chips dark com borderLeft ativo + titulo Cinzel + Min/Max inputs |
| Raridade | Todas mesma cor | 5 cores: Common #4B69FF → Legendary #FFD700 + feixo + glow |
| Item Detail | Popup simples | Modal glassmorphism blur(6px) + imagem + trend + vendedor + COMPRAR/OFERTA |
| Instant Sell | Botao "Vender" | Modal com taxa 30% vermelho + VOCE RECEBE verde + aviso irreversivel |
| My Listings | Tabela basica | Tabs douradas + rows premium + badges status + acoes inline |
| Telas | 5-6 telas | **10 telas completas** (grid, detail, buy, create, listings, inventory, instant, wishlist, seller, admin) |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-MARKETPLACE-REVISADO.md — Abril 2026 — 88L → ~350L]`
`[X0: 3 rodadas, 15+ refs — skeleton (logrocket, subframe, smartinfogl), debounce (dmitripavlutin, c-sharpcorner, medium/nerd-for-tech, medium/satnammca, alexefimenko), cards (freefrontend 194 cards, dev.to/realchell), grid (primereact, blog.logrocket.com)]`
