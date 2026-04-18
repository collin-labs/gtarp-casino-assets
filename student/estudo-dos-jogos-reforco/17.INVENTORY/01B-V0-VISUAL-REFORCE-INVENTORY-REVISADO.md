# REFORCO VISUAL — INVENTORY / INVENTARIO (#17) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: AnimatePresence popLayout (motion.dev, react-news, maximeheckel), skeleton shimmer (logrocket, subframe), forwardRef required (motion.dev)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Grid auto-fill minmax(clamp(120px,12vw,160px),1fr) com cards
- [ ] CARD: borda COR DA RARIDADE (nao dourado fixo) + feixo raridade base + shine sweep + badge raridade
- [ ] CARD LEGENDARY: animation pulseGold 2.5s infinite (glow dourado pulsante)
- [ ] AnimatePresence mode="popLayout" no grid (NAO sync, NAO wait) — parent position:relative
- [ ] Sell exit: opacity 0, scale 0.5, y 30, 0.3s (card sai suavemente, grid relui sem snap)
- [ ] SKELETON: shimmer pulse #1A1A1A→#222222→#1A1A1A (NUNCA spinner)
- [ ] Filter pills TIPO (dourado) + Filter pills RARIDADE (cor propria de cada tier quando ativas)
- [ ] Modal glassmorphism blur(16px) saturate(1.2) com btns VENDER (vermelho) + EQUIPAR (verde)
- [ ] RARIDADE: Common #4B69FF, Uncommon #8847FF, Rare #D32CE6, Epic #EB4B4B, Legendary #FFD700
- [ ] 4 telas: Grid, Modal Detalhes, Confirmacao Venda, Empty State
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

---

## 2. GRID + FILTROS

GRID:
```
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 12vw, 160px), 1fr))',
  gap: 'clamp(6px, 0.8vw, 12px)',
  position: 'relative',  // OBRIGATORIO para popLayout funcionar
}}
```

**AnimatePresence mode="popLayout"** (CRITICO — sem isso grid pula ao vender):
```jsx
<AnimatePresence mode="popLayout">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, y: 30, transition: { duration: 0.3 } }}
      transition={{ delay: i * 0.03, duration: 0.3 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    />
  ))}
</AnimatePresence>
```

FILTER PILLS TIPO: borderRadius 20px, Inter 600 clamp(9px,0.9vw,12px).
Ativo: bg rgba(212,168,67,0.15), borderColor rgba(212,168,67,0.5), color #D4A843.

FILTER PILLS RARIDADE (cor PROPRIA de cada tier quando ativas):
- Common ativo: bg rgba(75,105,255,0.15), borderColor rgba(75,105,255,0.5), color #4B69FF
- Uncommon ativo: bg rgba(136,71,255,0.15), borderColor rgba(136,71,255,0.5), color #8847FF
- Rare ativo: bg rgba(211,44,230,0.15), borderColor rgba(211,44,230,0.5), color #D32CE6
- Epic ativo: bg rgba(235,75,75,0.15), borderColor rgba(235,75,75,0.5), color #EB4B4B
- Legendary ativo: bg rgba(255,215,0,0.15), borderColor rgba(255,215,0,0.5), color #FFD700

---

## 3. ITEM CARD — Borda usa COR DA RARIDADE (nao dourado fixo!)

```
style={{
  background: 'linear-gradient(160deg, #1A1A1A 0%, #141414 40%, #111111 100%)',
  border: `1.5px solid ${item.rarity_color}66`,  // 40% opacity
  borderRadius: 10, overflow: 'hidden', position: 'relative', cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(212,168,67,0.06)',
}}
```
Hover: translateY -4px, scale 1.03, border intensifica para `${rarity_color}B3`.

FEIXO RARIDADE base: height 2px, gradient da cor da raridade no centro.
Badge raridade: bg `${color}20`, border `1px solid ${color}66`, color cor, Cinzel 700 9px uppercase.
Badge EQUIPADO: bg rgba(0,230,118,0.15), border rgba(0,230,118,0.4), #00E676, animation `pulseGreen 2s infinite`.
Nome: Inter 600 clamp(10px,1vw,13px) #E0E0E0 ellipsis.
Valor: JetBrains 700 clamp(9px,0.9vw,12px) #D4A843.
Legendary: animation `pulseGold 2.5s infinite`.

---

## 4. SKELETON LOADING (NUNCA spinner)

```
style={{
  background: 'linear-gradient(90deg, #1A1A1A 25%, #222222 37%, #1A1A1A 63%)',
  backgroundSize: '200% 100%',
  borderRadius: 10,
  animation: 'skeletonShimmer 1.5s ease-in-out infinite',
}}
```
8 cards skeleton com mesmas dimensoes dos cards reais. Blocos: imagem (65%), nome (12px h), valor (10px h 50% w).

---

## 5. MODAL DETALHES — Glassmorphism

```
style={{
  background: 'rgba(20,20,20,0.85)',
  backdropFilter: 'blur(16px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
  maxWidth: 'clamp(300px, 50vw, 420px)', width: '90%',
  padding: 'clamp(16px, 2.5vw, 28px)',
}}
```
Entry: spring scale 0.95→1, stiffness 300 damping 25.

Nome: Cinzel 700, clamp(14px,2vw,20px), color ${rarity_color}, textShadow glow.
Info grid: 2 colunas (label Inter #666 uppercase + valor Inter #E0E0E0).
Valor: JetBrains 700 #00E676. Sell-back: JetBrains 700 #D4A843.

BOTAO VENDER (**VERMELHO** — danger, NAO dourado!):
```
style={{
  background: 'linear-gradient(180deg, #E53935 0%, #C62828 100%)',
  border: '1px solid rgba(255,23,68,0.3)', borderRadius: 8,
  color: '#FFFFFF', width: '100%', fontWeight: 700, textTransform: 'uppercase',
  fontSize: 'clamp(10px, 1.1vw, 14px)', minHeight: 44,
}}
```
Texto: "VENDER POR G$ {sell_back_value}". Disabled se equipped.

BOTAO EQUIPAR (verde):
```
style={{
  background: 'linear-gradient(180deg, #00C853 0%, #004D25 100%)',
  border: '1px solid rgba(0,230,118,0.3)', color: '#FFFFFF', width: '100%',
  minHeight: 44,
}}
```
Se ja equipado: bg transparent, border #00E676, color #00E676, texto "DESEQUIPAR".

BOTAO TROCAR: disabled cinza, opacity 0.5, cursor not-allowed.

---

## 6. TOAST FEEDBACK (3 variantes)

```
style base={{
  background: 'rgba(17,17,17,0.95)', backdropFilter: 'blur(12px)',
  borderRadius: 8, padding: 'clamp(8px,1vw,12px) clamp(12px,1.5vw,16px)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
}}
```
Sucesso: borderLeft 3px #00E676. Info: borderLeft 3px #D4A843. Erro: borderLeft 3px #FF1744.
Entry: translateX 100%→0. Auto-dismiss 3s.

---

## 7. KEYFRAMES OBRIGATORIOS (4)

```css
@keyframes pulseGold {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(212,168,67,0.06), 0 0 8px rgba(255,215,0,0.15);
  }
  50% {
    box-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(212,168,67,0.06), 0 0 20px rgba(255,215,0,0.35);
  }
}
@keyframes pulseGreen {
  0%, 100% { box-shadow: 0 0 4px rgba(0,230,118,0.15); }
  50% { box-shadow: 0 0 10px rgba(0,230,118,0.35); }
}
@keyframes valueDecrease {
  0% { transform: scale(1); }
  30% { transform: scale(0.95); color: #D4A843; }
  100% { transform: scale(1); color: #00E676; }
}
@keyframes skeletonShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 8. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA borda de card com cor FIXA dourada — SEMPRE usar cor da RARIDADE do item
2.  NUNCA AnimatePresence sem mode="popLayout" — grid pula sem isso (snap effect)
3.  NUNCA parent do grid sem position:relative — popLayout precisa disso
4.  NUNCA spinner de loading — skeleton shimmer 1.5s
5.  NUNCA botao VENDER dourado — eh VERMELHO (danger: #E53935→#C62828)
6.  NUNCA cores de raridade do Case Battle — usar paleta: #4B69FF/#8847FF/#D32CE6/#EB4B4B/#FFD700
7.  NUNCA filter pills de raridade com cor dourada fixa — cada tier tem COR PROPRIA quando ativa
8.  NUNCA venda sem modal de confirmacao
9.  NUNCA fundo claro — #0A0A0A
10. NUNCA sans-serif em titulos — Cinzel
11. NUNCA px fixo — SEMPRE clamp()
12. NUNCA botao < 44px
13. NUNCA GCoin diferente de #00E676
14. NUNCA backdrop-filter sem -webkit-backdrop-filter (FiveM CEF)
15. NUNCA valores monetarios sem JetBrains Mono
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Grid | Colunas fixas | auto-fill minmax(clamp(120px,12vw,160px),1fr) + popLayout |
| Card borda | Dourada fixa pra todos | COR DA RARIDADE (azul/roxo/magenta/vermelho/dourado) |
| Venda | Item some instantaneo | exit opacity 0 scale 0.5 y 30 via popLayout — grid relui suavemente |
| Loading | Spinner | Skeleton shimmer #1A1A1A→#222222→#1A1A1A 1.5s |
| Btn VENDER | Dourado | VERMELHO danger gradient (#E53935→#C62828) |
| Filter raridade | Todas douradas | Cada tier com COR PROPRIA: Common azul, Rare magenta, etc |
| Legendary | Igual aos outros | pulseGold 2.5s infinite (glow dourado pulsante permanente) |
| Modal | Popup simples | Glassmorphism blur(16px) saturate(1.2) + 5 boxShadow |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-INVENTORY-REVISADO.md — Abril 2026 — 81L → ~300L]`
`[X0: 3 rodadas, 15+ refs — popLayout (motion.dev ×3, react-news, maximeheckel, medium triplem, inhaq, logrocket, framermotionexamples, egghead), skeleton (smartinfogl, subframe, logrocket), cards (freefrontend), debounce (dmitripavlutin, c-sharpcorner)]`
