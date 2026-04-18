# REFORCO VISUAL — SLOT MACHINE (#2) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# INCLUI secao ERROS COMUNS para correcao de telas ja geradas

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Tela 1 Mode Select: 2 cards (Classic vs Video) com icone, descricao, botao JOGAR verde
- [ ] VIDEO: Grid 6x5 CSS Grid DENTRO de frame dourado (2px solid #D4A843 + outline 3px + 5 boxShadow)
- [ ] VIDEO: Celulas com simbolos PNG reais de /assets/games/slots/symbols/ (NAO emojis, NAO CSS)
- [ ] VIDEO: Scatter com radial-gradient dourado + border 2px + pulse animation
- [ ] VIDEO: Tumble cascade com AnimatePresence mode="popLayout" (4 fases: highlight→explosao→cascade→re-avaliacao)
- [ ] VIDEO: Free Spins com frame DOURADO mais brilhante, HUD bar (counter + multiplicador + win), spin button DOURADO
- [ ] CLASSIC: Frame com 3 reels verticais, cada reel overflow hidden mostrando 3 simbolos, sombra top/bottom profundidade
- [ ] Win Overlay 4 tiers: Normal inline, Big (5-49x), Mega (50-499x), Jackpot (500x+)
- [ ] Spin button: circulo 56px, gradient verde, glow pulse idle
- [ ] Bet controls: MIN/x2/÷2/MAX + Ante toggle + Turbo + Auto
- [ ] Jackpot display: JetBrains #FFD700 com textShadow
→ Se faltou 1 item: PARE e releia este bloco.

---

## ERROS COMUNS DO V0 NESTE JOGO (corrigir se ja gerou)

O V0 ja gerou 7 telas do Slot Machine. Estes sao os erros tipicos que ele comete:

| Erro | O que o V0 fez | O que deveria ser |
|------|---------------|-------------------|
| Grid sem frame | Grid 6x5 flutuando no fundo escuro | Grid DENTRO de frame dourado com border 2px, outline 3px, 5-shadow, borderRadius 18 |
| Simbolos como emojis/texto | Emojis ou letras coloridas | PNG reais de /assets/games/slots/symbols/ (crown.png, ruby.png, etc) |
| Celulas sem estados | Todas celulas iguais sempre | 4 estados: normal, winning (glow cor do simbolo), dimmed (opacity 0.3), scatter (radial-gradient dourado) |
| Tumble sem AnimatePresence | Simbolos trocam instantaneo | AnimatePresence mode="popLayout" com exit scale 0.3, entrada y -60 spring |
| Free Spins igual ao normal | Mesmo visual do modo base | Frame dourado MAIS brilhante, tint dourado rgba(212,168,67,0.05), spin button DOURADO, HUD bar exclusiva |
| Classic como grid | 3x3 grid flat | 3 reels VERTICAIS com overflow hidden, sombra interna top/bottom, profundidade visual |
| Win overlay unico | Mesmo overlay pra todo win | 4 TIERS: inline (< 5x), Big (5-49x), Mega (50-499x), Jackpot (500x+ com shake) |
| Spin como retangulo | Botao retangular verde | Circulo 56px, gradient verde, glow pulse, whileHover scale 1.08 |
| Bet controls nativos | Input range/number nativo | Botoes estilizados MIN/x2/÷2/MAX + Ante toggle + Turbo + Auto em bar backdrop blur |
| Jackpot ausente | Sem display de jackpot | JetBrains #FFD700, textShadow, tooltip com regra 1.5% |

---

## 1. CONTAINER + FUNDO

```
style={{
  position: 'absolute', inset: 0, zIndex: 60,
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  borderRadius: 'inherit', overflow: 'hidden',
  display: 'flex', flexDirection: 'column',
  padding: 'clamp(8px, 1vw, 16px)',
}}
```

---

## 2. VIDEO SLOT — Frame dourado + Grid 6x5

FRAME DOURADO (container do grid):
```
style={{
  margin: 'clamp(4px,0.8vw,8px) auto',
  padding: 'clamp(6px,1vw,12px)',
  border: '2px solid #D4A843',
  outline: '3px solid rgba(212,168,67,0.15)',
  outlineOffset: 4, borderRadius: 18,
  boxShadow: '0 0 30px rgba(212,168,67,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.4)',
  background: 'linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)',
  width: 'clamp(300px, 70vw, 600px)', flex: 1, maxHeight: '60vh',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  position: 'relative',
}}
```

GRID 6x5:
```
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gridTemplateRows: 'repeat(5, 1fr)',
  gap: 'clamp(3px, 0.4vw, 6px)',
  width: '100%', aspectRatio: '6 / 5',
}}
```

CELULA NORMAL: aspectRatio 1, borderRadius 8, bg rgba(255,255,255,0.03), border 1px rgba(255,255,255,0.04). Simbolo: img src PNG real, width/height 70%, objectFit contain.

CELULA SCATTER: bg `radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)`, border `2px solid rgba(255,215,0,0.4)`, animation `slotsScatterPulse 1.5s infinite`.

CELULA WINNING: boxShadow `0 0 15px rgba(COR,0.5)`, border `1.5px solid rgba(COR,0.6)`, scale 1.05. Cores: crown=#FFD700, ring=#D4A843, ruby=#FF1744, sapphire=#1E88E5, emerald=#43A047, amethyst=#8E24AA, topaz=#FF8F00.

CELULA DIMMED: opacity 0.3, transition 0.3s.

TUMBLE (AnimatePresence mode="popLayout" OBRIGATORIO):
```jsx
<AnimatePresence mode="popLayout">
  <motion.div key={sym.uniqueKey} layout
    initial={{ opacity: 0, y: -60, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.2 } }}
    transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
  />
</AnimatePresence>
```
4 fases: (1) HIGHLIGHT 400ms, (2) EXPLOSAO exit 200ms, (3) CASCADE spring, (4) RE-AVALIAR.

---

## 3. VIDEO SLOT — Free Spins (visual DIFERENTE)

Frame FS: border `2px solid #FFD700`, outline `3px solid rgba(255,215,0,0.25)`, boxShadow com glow 40px. Animation `slotsFrameFSGlow 3s infinite`.

Tint dourado overlay: background rgba(212,168,67,0.05), pointerEvents none.

FS HUD BAR: bg rgba(0,0,0,0.7), borderBottom `1px solid rgba(255,215,0,0.2)`.
- Esq: "FREE SPINS: {N}" Cinzel 700 #00E676
- Centro: "TOTAL x{N}" JetBrains 900 #FFD700 (Framer key={mult}, scale 1.4 → 1)
- Dir: "WIN: {N} GC" JetBrains 700 #00E676

Orbe multiplicador: radial-gradient dourado (#FFD700→#D4A843→#8B6914), JetBrains 900, color #0A0A0A, animation `slotsOrbeSpin 2s infinite`.

Spin button FS: gradient DOURADO (#FFD700→#8B6914), border rgba(255,215,0,0.6), color #0A0A0A, animation `slotsSpinFSPulse 2s infinite`.

FS Trigger overlay: inset 0, zIndex 100, bg rgba(0,0,0,0.8), blur 8px. "FREE SPINS!" Cinzel 900 #FFD700 spring scale 0→1. Auto-dismiss 3.2s.

---

## 4. CLASSIC SLOT — 3 Reels verticais com profundidade

FRAME CLASSIC: border `2px solid #D4A843`, borderRadius 18, bg `#0F0F0F→#0A0A0A`, width clamp(250px,45vw,400px).

REEL INDIVIDUAL (3 lado a lado, gap clamp(8px,1.2vw,14px)):
```
style={{
  width: 'clamp(60px, 10vw, 90px)', height: 'clamp(180px, 25vw, 270px)',
  overflow: 'hidden',
  border: '1.5px solid rgba(212,168,67,0.25)', borderRadius: 10,
  background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.6) 100%)',
  position: 'relative',
}}
```
Sombra top/bottom cria PROFUNDIDADE — simbolos extremos ficam escuros, central destaca.

SIMBOLOS: PNGs de /assets/games/slots/classic/ (cherry.png, seven.png, bar.png, diamond.png, bell.png, lemon.png, star.png). Cada: width 100%, height clamp(60px,8.3vw,90px), objectFit contain, padding 15%.

SPIN: Framer animate y [0,-500,-1000,-1500] duration 0.3s linear repeat (spinning). Stop: 0.4s ease-out. Stagger: reel0 1.0s, reel1 1.4s, reel2 2.2s.

---

## 5. WIN OVERLAY — 4 tiers

TIER 1 (< 5x): SEM overlay, win inline.
TIER 2 BIG (5-49x): zIndex 80, bg rgba(0,0,0,0.5) blur 4px. "BIG WIN!" Cinzel 800 clamp(18px,3vw,32px) #FFD700. Countup 2s.
TIER 3 MEGA (50-499x): zIndex 90, bg rgba(0,0,0,0.75) blur 8px. "MEGA WIN!" Cinzel 900 clamp(22px,4vw,40px) 3-camada shadow. Countup 3s.
TIER 4 JACKPOT (500x+): zIndex 100, bg rgba(0,0,0,0.85) blur 12px. "JACKPOT!" Cinzel 900 clamp(26px,5vw,48px) 4-camada shadow + screen shake. Countup 4s.

Countup: JetBrains 700 clamp(18px,3.5vw,36px) #00E676, rAF, easing `1 - Math.pow(1-t, 4)`.

---

## 6. BET CONTROLS BAR + SPIN BUTTON

Bar: bg rgba(0,0,0,0.6), borderTop 1px rgba(212,168,67,0.15), backdropFilter blur(4px).

SPIN BUTTON (circular 56px):
```
style={{
  width: 56, height: 56, borderRadius: '50%',
  background: 'linear-gradient(180deg, #00C853 0%, #004D25 100%)',
  border: '2px solid rgba(0,230,118,0.4)', color: '#FFFFFF',
  boxShadow: '0 0 15px rgba(0,230,118,0.3)',
  fontSize: 20, fontWeight: 900, flexShrink: 0,
  animation: 'slotsSpinPulse 2s ease-in-out infinite',
}}
```
Hover: scale 1.08. Disabled: opacity 0.4.

Atalhos: minWidth/Height 44, bg rgba(255,255,255,0.05), JetBrains 600, #A8A8A8.
Ante ativo: bg rgba(212,168,67,0.15), #D4A843. Inativo: bg rgba(0,0,0,0.3), #666.

---

## 7. ASSETS REAIS

Video (11): `/assets/games/slots/symbols/` — crown, ring, ruby, sapphire, emerald, amethyst, topaz, hourglass, chalice, scatter, multiplier_orb (.png)
Classic (7): `/assets/games/slots/classic/` — cherry, seven, bar, diamond, bell, lemon, star (.png)
Overlays (3): `/assets/games/slots/overlays/` — win_big, win_mega, win_jackpot (.png)
Sons (16): `/assets/sounds/slots/` — spin_start, reel_stop, win_small/medium/big/mega, jackpot_hit, tumble_drop/explode, free_spins_trigger, etc (.mp3)

---

## 8. KEYFRAMES OBRIGATORIOS

```css
@keyframes slotsFrameFSGlow {
  0%, 100% { box-shadow: 0 0 40px rgba(255,215,0,0.12); }
  50% { box-shadow: 0 0 55px rgba(255,215,0,0.20); }
}
@keyframes slotsWinGlow {
  0%, 100% { box-shadow: 0 0 12px var(--glow-color); }
  50% { box-shadow: 0 0 22px var(--glow-color); }
}
@keyframes slotsScatterPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(255,215,0,0.3); border-color: rgba(255,215,0,0.4); }
  50% { box-shadow: 0 0 25px rgba(255,215,0,0.5); border-color: rgba(255,215,0,0.6); }
}
@keyframes slotsOrbeSpin {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}
@keyframes slotsSpinPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(0,230,118,0.3); }
  50% { box-shadow: 0 0 25px rgba(0,230,118,0.5); }
}
@keyframes slotsSpinFSPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.4); }
  50% { box-shadow: 0 0 35px rgba(255,215,0,0.6); }
}
```

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA grid flutuando sem frame — grid SEMPRE dentro de frame dourado
2.  NUNCA simbolos como emojis/texto — SEMPRE PNGs de /assets/games/slots/
3.  NUNCA tumble sem AnimatePresence mode="popLayout"
4.  NUNCA Free Spins com visual identico ao modo base
5.  NUNCA win overlay unico pra todos — 4 TIERS obrigatorios
6.  NUNCA countup instantaneo — SEMPRE rAF com easing quartic
7.  NUNCA Classic como grid flat — SEMPRE 3 reels VERTICAIS overflow hidden
8.  NUNCA spin button retangular — SEMPRE circulo 56px gradient
9.  NUNCA fundo claro — #0A0A0A + bg-casino.png
10. NUNCA sans-serif em titulos — Cinzel
11. NUNCA px fixo — SEMPRE clamp()
12. NUNCA botao < 44px
13. NUNCA GCoin diferente de #00E676
14. NUNCA scatter sem destaque visual — radial-gradient + border + pulse
15. NUNCA celulas sem 4 estados — normal, winning, dimmed, scatter
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Grid | Divs num fundo preto | Grid CSS Grid dentro de frame dourado 5-shadow com PNGs reais |
| Simbolos | Emojis/letras | PNGs: crown.png, ruby.png, scatter.png etc |
| Tumble | Troca instantanea | AnimatePresence popLayout: exit scale 0.3 → cascade spring |
| Free Spins | Identico ao base | Frame dourado + tint + HUD bar + spin DOURADO + orb |
| Classic | Grid 3x3 flat | 3 reels VERTICAIS overflow hidden, sombra profundidade |
| Win | Texto "GANHOU" | 4 tiers: inline → Big → Mega → Jackpot (shake) |
| Spin | Retangulo | Circulo 56px gradient + glow pulse |
| Scatter | Celula normal | radial-gradient dourado + border + pulse animation |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-SLOT-MACHINE-REVISADO.md — Abril 2026 — 48L → ~340L]`
