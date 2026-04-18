# REFORCO VISUAL — CASES / CAIXAS (#14) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: CS:GO strip deceleration (motion.dev), glow-per-rarity (Doc 7 keyframes)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] CATALOGO: grid 2x3 de case cards com PNG FECHADA real + feixo verde + shimmer hover + badge GRATIS
- [ ] PREVIEW: caixa SEMI-ABERTA flutuante + grid itens com % chance + borda cor raridade + botoes ABRIR/FAST
- [ ] STRIP: container blur(16px) + build-up (caixa treme 0.8s) + 40-60 itens scrollando + pointer VERMELHO #FF4444 + fade lateral
- [ ] STRIP: ease [0.15, 0, 0.05, 1] duracão 4.5s (NAO linear, NAO Case Battle ease)
- [ ] RARIDADE: 5 cores CORRETAS — Common #4B69FF, Uncommon #8847FF, Rare #D32CE6, Epic #EB4B4B, Legendary #FFD700
- [ ] GLOW POR RARIDADE: casesGlowRare (roxo), casesGlowEpic (vermelho), casesGlowLegendary (dourado 4-camada)
- [ ] FAST OPEN: card flip 3D (perspective 800, rotateY 180, 0.6s) com mesma celebracao por raridade
- [ ] RECENT DROPS: sidebar feed vertical auto-scroll com borda esquerda cor raridade
- [ ] LEGENDARY: overlay bigwin completo (fundo escurece, item 2x, confetti massivo, counter rolling)
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

## 2. CATALOGO — Grid 2x3 de case cards

CASE CARD:
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
Hover: borderColor rgba(212,168,67,0.7), translateY -6px scale 1.05, boxShadow +glow verde.
Stagger: delay 0.05*i, initial opacity 0 y 30.

Feixo verde base:
```
position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 3,
background: 'linear-gradient(90deg,transparent 5%,rgba(0,230,118,0.3) 20%,#00E676 50%,rgba(0,230,118,0.3) 80%,transparent 95%)',
boxShadow: '0 0 8px rgba(0,230,118,0.3), 0 0 15px rgba(0,230,118,0.15)',
```

Shimmer sweep hover:
```
background: 'linear-gradient(105deg,transparent 40%,rgba(255,215,0,0.06) 45%,rgba(255,215,0,0.12) 50%,rgba(255,215,0,0.06) 55%,transparent 60%)',
backgroundSize: '200% 100%', animation: 'casesShimmer 2s infinite',
```

Badge GRATIS (caixa diaria): bg rgba(255,215,0,0.2), border 1px rgba(255,215,0,0.5), Cinzel 700 #FFD700, animation `casesDailyPulse 2s infinite`.

Nome: Cinzel 700 clamp(10px,1.2vw,15px) #D4A843 letterSpacing 2px.
Preco: JetBrains 700 clamp(10px,1.2vw,14px) #00E676.
Imagem: PNG FECHADA, width 100%, objectFit contain.

---

## 3. STRIP DE ABERTURA — Estilo CS:GO (MAIS CRITICO)

CONTAINER STRIP:
```
style={{
  width: '100%', maxWidth: 'clamp(500px, 70vw, 900px)', margin: '0 auto',
  height: 'clamp(80px, 14vh, 140px)',
  background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)',
  border: '1.5px solid rgba(212,168,67,0.3)', borderRadius: 12, overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.06), inset 0 0 20px rgba(0,0,0,0.5)',
}}
```

BUILD-UP (ANTES da strip): caixa SEMI-ABERTA treme 0.8s:
Framer: animate{{ x:[0,-3,3,-2,2,-1,1,0], rotate:[0,-1,1,-0.5,0.5,0] }}, duration 0.8s.
Depois: animate{{ scale:0.8, opacity:0 }} → strip aparece.
Label "ABRINDO CAIXA...": Cinzel 700, clamp(12px,1.5vw,18px), #D4A843, opacity pulse 0.5→0.8→0.5.

POINTER (linha VERMELHA central — NAO dourada):
```
style={{
  position: 'absolute', top: 0, bottom: 0, left: '50%',
  transform: 'translateX(-50%)', width: 2,
  background: 'linear-gradient(180deg, transparent 0%, #FF4444 15%, #FF4444 85%, transparent 100%)',
  boxShadow: '0 0 8px rgba(255,68,68,0.5), 0 0 16px rgba(255,68,68,0.2)',
  zIndex: 10, pointerEvents: 'none',
}}
```
Setas VERMELHAS: borderTop 8px solid #FF4444.

STRIP ROW (40-60 itens inline):
```
style={{
  display: 'flex', gap: 2, position: 'absolute', top: '50%',
  transform: 'translateY(-50%)',
  // Framer animate{{ x: targetX }}
}}
```
Framer: animate={{ x: targetX }}, transition{{ duration: 4.5, ease: [0.15, 0, 0.05, 1] }}.

ITEM NA STRIP:
```
style={{
  width: 'clamp(70px, 10vw, 120px)', height: '100%',
  flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)',
  borderBottom: '3px solid {corRaridade}',
  background: 'rgba(20,20,20,0.9)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}
```
Imagem: thumb PNG, width/height 75%, objectFit contain.

FADE NAS BORDAS (mascaras laterais):
Esquerda: gradient `linear-gradient(90deg, #0A0A0A, transparent)`, width 15%, position absolute left 0, zIndex 5.
Direita: inverso.

ITEM VENCEDOR (apos parar): scale 1.4, border 4px solid {corRaridade}, boxShadow glow intenso, transition 0.5s. Nome + valor + badge raridade aparecem abaixo.

---

## 4. CORES DE RARIDADE — Cases (#14) tem paleta PROPRIA

ATENCAO: NAO usar cores do Case Battle (#11). Cases tem cores diferentes:

| Raridade | Cor | Glow animation |
|----------|-----|----------------|
| Common | #4B69FF (azul medio) | Glow sutil estatico |
| Uncommon | #8847FF (roxo medio) | Glow sutil estatico |
| Rare | #D32CE6 (roxo vibrante) | `casesGlowRare 2s infinite` (3-camada) |
| Epic | #EB4B4B (vermelho) | `casesGlowEpic 2s infinite` (3-camada) |
| Legendary | #FFD700 (dourado) | `casesGlowLegendary 2s infinite` (4-camada!!!) |

Glow Legendary (4 CAMADAS — unico entre todos os jogos):
```css
@keyframes casesGlowLegendary {
  0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.3), 0 0 25px rgba(255,215,0,0.2), 0 0 50px rgba(255,215,0,0.12), 0 0 80px rgba(255,215,0,0.06); }
  50% { box-shadow: 0 0 18px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.35), 0 0 70px rgba(255,215,0,0.2), 0 0 100px rgba(255,215,0,0.1); }
}
```

---

## 5. CELEBRACAO POR RARIDADE

Common: glow sutil #4B69FF, sem particulas.
Uncommon: glow #8847FF, 4 particulas.
Rare: glow pulsante `casesGlowRare`, 8 particulas, label "RARO!".
Epic: glow pulsante `casesGlowEpic`, 16 particulas, screen flash vermelho sutil, label "EPICO!".
**Legendary: OVERLAY BIGWIN** — bg escurece rgba(0,0,0,0.9) blur 12px, item centralizado 2x maior, shimmer dourado, confetti 100+ spans, counter valor rolling, "LEGENDARIO!!!" Cinzel 800 pulsante #FFD700, animation `casesBigwinFlash`.

---

## 6. FAST OPEN — Card flip 3D

Card central clamp(140px,22vw,240px).
Container: perspective 1000.
Verso: PNG FECHADA da caixa, border 2px rgba(212,168,67,0.3), borderRadius 16.
Frente: PNG do item + borda cor raridade + nome + valor.
Flip: Framer animate{{ rotateY: revealed ? 180 : 0 }}, duration 0.6s ease [0.4,0,0.2,1].
backfaceVisibility hidden + WebkitBackfaceVisibility hidden OBRIGATORIO.
Mesma celebracao por raridade apos flip.

---

## 7. CASERESULT — Botoes pos-abertura

Apos strip OU fast open, 3 botoes aparecem:

GUARDAR (ghost dourado):
```
style={{
  background: 'transparent', border: '1.5px solid rgba(212,168,67,0.4)',
  borderRadius: 10, color: '#D4A843', fontFamily: "'Cinzel', serif",
  fontWeight: 700, fontSize: 'clamp(11px,1.3vw,16px)', minHeight: 44,
}}
```

VENDER (gradient dourado):
```
style={{
  background: 'linear-gradient(180deg, #D4A843 0%, #8B6914 100%)',
  border: '1.5px solid rgba(255,215,0,0.4)', borderRadius: 10,
  color: '#0A0A0A', fontFamily: "'Cinzel', serif",
  fontWeight: 700, fontSize: 'clamp(11px,1.3vw,16px)', minHeight: 44,
}}
```
Texto: "VENDER — G${sell_back_value}".

ABRIR OUTRA (green ghost):
```
style={{
  background: 'transparent', border: '1px solid rgba(0,230,118,0.3)',
  borderRadius: 8, color: '#00E676', fontFamily: "'Cinzel', serif",
  fontWeight: 600, fontSize: 'clamp(10px,1.2vw,14px)', minHeight: 44,
}}
```

---

## 8. CASE BATTLE (Telas 6-8 — dual strip PvP)

Cases inclui 3 telas de Case Battle integradas:
- **Battle Lobby**: tabela de battles abertas com CRIAR/ENTRAR. Btn CRIAR gradient dourado.
- **Battle Game**: 2 slots lado a lado (grid 1fr 1fr), cada um com strip propria. ITEM_WIDTH menor: clamp(50px,7vw,80px). Duracao 3.5s. Countdown Cinzel 900 clamp(40px,8vw,80px) #FFD700.
- **Battle Result**: card vencedor border verde + confetti vs card perdedor opacity 0.7.
Ambas strips iniciam SIMULTANEAMENTE.

---

## 7. RECENT DROPS — Sidebar feed

```
style={{
  width: 'clamp(160px, 18vw, 220px)',
  background: 'rgba(5,5,5,0.9)',
  border: '1px solid rgba(212,168,67,0.1)',
  borderRadius: 10, overflowY: 'auto',
  display: 'flex', flexDirection: 'column',
}}
```
Cada entry: avatar 20px + nome item truncado + thumb 24px + tempo relativo.
Borda esquerda = cor raridade (4px solid).
Legendary: entry pulsa dourado 3s ao aparecer.
Auto-scroll: novos drops entram no topo com Framer initial{{ opacity:0, x:20 }}.

---

## 8. KEYFRAMES OBRIGATORIOS

```css
@keyframes casesShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes casesOpenPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(0,230,118,0.2); }
  50% { box-shadow: 0 0 25px rgba(0,230,118,0.4); }
}
@keyframes casesDailyPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; box-shadow: 0 0 10px rgba(255,215,0,0.4); }
}
@keyframes casesGlowRare {
  0%, 100% { box-shadow: 0 0 8px rgba(211,44,230,0.2), 0 0 20px rgba(211,44,230,0.15), 0 0 35px rgba(211,44,230,0.08); }
  50% { box-shadow: 0 0 12px rgba(211,44,230,0.3), 0 0 25px rgba(211,44,230,0.2), 0 0 40px rgba(211,44,230,0.12); }
}
@keyframes casesGlowEpic {
  0%, 100% { box-shadow: 0 0 10px rgba(235,75,75,0.25), 0 0 25px rgba(235,75,75,0.18), 0 0 45px rgba(235,75,75,0.1); }
  50% { box-shadow: 0 0 15px rgba(235,75,75,0.4), 0 0 35px rgba(235,75,75,0.25), 0 0 60px rgba(235,75,75,0.15); }
}
@keyframes casesGlowLegendary {
  0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.3), 0 0 25px rgba(255,215,0,0.2), 0 0 50px rgba(255,215,0,0.12), 0 0 80px rgba(255,215,0,0.06); }
  50% { box-shadow: 0 0 18px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.35), 0 0 70px rgba(255,215,0,0.2), 0 0 100px rgba(255,215,0,0.1); }
}
@keyframes casesBigwinFlash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
```

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA cores de raridade do Case Battle — Cases tem paleta PROPRIA (#4B69FF/#8847FF/#D32CE6/#EB4B4B/#FFD700)
2.  NUNCA strip linear — ease [0.15, 0, 0.05, 1] 4.5s obrigatorio
3.  NUNCA strip sem pointer VERMELHO central — #FF4444 com glow red + setas vermelhas (NAO dourado!)
4.  NUNCA strip sem fade lateral — mascaras gradiente nas bordas esquerda/direita
5.  NUNCA celebracao igual pra todas raridades — ESCALA por raridade (Common simples → Legendary overlay bigwin)
6.  NUNCA caixa como quadrado colorido — SEMPRE PNG FECHADA real de /assets/games/cases/caixas/
7.  NUNCA case card sem feixo verde na base e shimmer sweep no hover
8.  NUNCA fundo claro — #0A0A0A
9.  NUNCA sans-serif em titulos — Cinzel
10. NUNCA px fixo — SEMPRE clamp()
11. NUNCA botao < 44px
12. NUNCA GCoin diferente de #00E676
13. NUNCA Legendary sem glow 4-CAMADA (unico — 10/25/50/80px)
14. NUNCA Fast Open sem flip 3D (perspective + rotateY)
15. NUNCA Recent Drops sem borda esquerda cor raridade
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Catalogo | Cards simples | Cards 6-shadow + feixo verde + shimmer sweep + outline + stagger |
| Strip | Itens aparecem de uma vez | Build-up 0.8s + 40-60 itens ease [0.15,0,0.05,1] 4.5s + pointer VERMELHO #FF4444 + fade |
| Raridade | Todas mesma cor | 5 cores PROPRIAS (#4B69FF→#FFD700) com glow por raridade (3-4 camadas) |
| Legendary | Texto dourado | Overlay bigwin: bg blur + item 2x + confetti 100+ + counter + flash |
| Fast Open | Aparece direto | Card flip 3D perspective 800 rotateY 0→180deg 0.6s |
| Recent Drops | Lista simples | Sidebar auto-scroll + borda esquerda cor raridade + Legendary pulsa 3s |
| Badge GRATIS | Texto verde | Badge dourada com `casesDailyPulse 2s infinite` |
| Case card hover | Scale simples | translateY -6px + scale 1.05 + borda intensifica + shimmer sweep |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-CASES-REVISADO.md — Abril 2026 — 73L → ~330L]`
`[X0: Strip deceleration reusou pesquisa Case Battle + glow-per-rarity 4-camada do Doc 7]`
