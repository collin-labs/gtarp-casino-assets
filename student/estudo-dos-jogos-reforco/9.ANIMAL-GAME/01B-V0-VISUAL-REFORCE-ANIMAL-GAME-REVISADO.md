# REFORCO VISUAL — ANIMAL GAME / JOGO DO BICHO (#9) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# Pesquisa X0: CSS sphere shading (arc.id.au), metallic gradients (ibelick.com), BGaming Jogo do Bicho

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta + overlay escurecimento
- [ ] Header: VOLTAR + titulo "JOGO DO BICHO" Cinzel 900 #D4A843 + saldo #00E676
- [ ] Grid 5x5 (25 animais) com PNGs REAIS de /assets/games/bicho/1.png a 25.png
- [ ] Cada card: gradiente escuro, borda dourada sutil, imagem PNG ~70%, nome + grupo
- [ ] Card hover: scale 1.05, borda intensifica, sombra cresce
- [ ] Card selecionado: borda verde #00E676 + glow verde + badge "APOSTADO"
- [ ] 5 capsulas metalicas ESFERICAS no sorteio (radial-gradient 4 CAMADAS — specular+ambient+limb+reflexo)
- [ ] Revelacao SEQUENCIAL das capsulas: stagger 800ms com shake→flash→reveal
- [ ] Painel de apostas: 5 modos (Simple/Dupla/Tripla/Quadra/Quina) + chips + payout preview
- [ ] Resultado: overlay WIN verde com counter + confetti dourado OU feedback LOSE discreto
- [ ] Historico slide-in + PF modal glassmorphism
- [ ] Stagger entrada do grid: cada card delay = (row*5+col) * 30ms
→ Se faltou 1 item: PARE e releia este bloco.

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
  padding: 'clamp(6px, 0.8vw, 14px)',
}}
```

Header: bg rgba(0,0,0,0.6), backdropFilter blur(4px), borderBottom 1px rgba(212,168,67,0.15).
Titulo: Cinzel 900, clamp(12px,1.8vw,22px), #D4A843, textShadow `0 0 12px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8)`.
Saldo: JetBrains Mono 700, #00E676, textShadow verde.

---

## 2. GRID 5x5 — 25 Animais com PNGs reais

ATENCAO: Existem 25 PNGs em /assets/games/bicho/ (1.png a 25.png). Usar TODOS.

Layout do grid: display grid, gridTemplateColumns repeat(5, 1fr), gap clamp(4px,0.5vw,8px).
O grid TODO precisa caber na tela 1280x720 junto com o painel de apostas ao lado.

CARD DE ANIMAL (cada um dos 25):
```
style={{
  background: 'linear-gradient(180deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))',
  border: '1.5px solid rgba(212,168,67,0.2)',
  borderRadius: 'clamp(6px, 0.8vw, 10px)',
  padding: 'clamp(4px, 0.5vw, 8px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: 'clamp(2px, 0.3vw, 4px)',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,215,0,0.05)',
  position: 'relative', overflow: 'hidden',
  minHeight: 44,
}}
```

Imagem do animal: width/height ~70% do card, objectFit contain.
Numero do grupo: position absolute top-left, Cinzel 600, clamp(7px,0.8vw,10px), rgba(212,168,67,0.5).
Nome do animal: Cinzel 600, clamp(7px,0.8vw,10px), #A8A8A8, textTransform uppercase.

HOVER: scale 1.05, borderColor rgba(212,168,67,0.5), boxShadow `0 4px 15px rgba(0,0,0,0.6), 0 0 8px rgba(212,168,67,0.15)`.

SELECIONADO (apostou neste animal):
```
borderColor: 'rgba(0,230,118,0.5)',
background: 'linear-gradient(180deg, rgba(0,230,118,0.08), rgba(0,230,118,0.03))',
boxShadow: '0 0 15px rgba(0,230,118,0.4), 0 0 30px rgba(0,230,118,0.15)',
```
Badge de ORDEM (circulo numerado, NAO texto "APOSTADO"):
```
style={{
  position: 'absolute', top: -6, right: -6, width: 20, height: 20,
  borderRadius: '50%', background: '#00E676', color: '#000',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
  fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 2,
}}
```
Mostra "1o", "2o", "3o" conforme ordem de selecao.
Framer: initial{{ scale:0 }}, animate{{ scale:1 }}, spring stiffness 400 damping 15.

RESULTADO MATCH (animal acertou no sorteio): animation `bichoMatchFlash 0.6s ease`, borderColor #FFD700, boxShadow `0 0 20px rgba(255,215,0,0.4)`.

STAGGER ENTRADA: Framer initial={{ opacity:0, scale:0.85 }}, animate={{ opacity:1, scale:1 }}, delay = (row*5+col) * 0.03.

Shimmer sweep (pseudo-element em hover): gradiente translucido 30deg, translateX -100%→200% em 0.8s.

---

## 3. CAPSULAS DO SORTEIO — ESFERAS METALICAS 3D (ELEMENTO MAIS CRITICO)

ATENCAO V0: NAO faca circulos flat com cor solida. Estas sao ESFERAS METALICAS DOURADAS que parecem objetos reais em 3D.

A tecnica CSS para criar uma esfera realista usa 4 CAMADAS de radial-gradient empilhadas:

5 capsulas em row horizontal, gap clamp(12px,2vw,20px).

Cada capsula:
```
style={{
  width: 'clamp(60px, 10vw, 100px)', height: same,
  borderRadius: '50%',
  position: 'relative',
  cursor: 'default',

  // CAMADA 1: Base metalica dourada (highlight em 35% 30% — posicao realista de luz)
  background: 'radial-gradient(circle at 35% 30%, #FFD700 0%, #D4A843 40%, #8B6914 80%, #462523 100%)',

  // Borda metalica sutil
  border: '2px solid rgba(255,215,0,0.5)',

  // CAMADA 4: Sombra projetada (profundidade 3D)
  boxShadow: '0 8px 25px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,215,0,0.2)',
}}
```

CAMADA 2: Specular highlight (pseudo-element ou div filha):
```
// Reflexo metalico — posicao 35%/25% conforme Doc 6 (ellipse, nao circle)
style={{
  position: 'absolute',
  top: '10%', left: '15%',
  width: '50%', height: '35%',
  borderRadius: '50%',
  background: 'radial-gradient(ellipse 60% 40% at 35% 25%, rgba(255,255,255,0.25), transparent)',
  pointerEvents: 'none',
}}
```

CAMADA 3: Limb darkening (escurecimento nas bordas — outra div filha):
```
style={{
  position: 'absolute', inset: 0, borderRadius: '50%',
  background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.3) 100%)',
  pointerEvents: 'none',
}}
```

5 ESTADOS DA CAPSULA:

**FECHADA (idle):** Esferas douradas com micro-oscilacao.
Framer: animate={{ rotate:[0,3,-3,0] }}, duration 3s, repeat Infinity. (wobble sutil)
LID (TAMPA) — div sobreposta no topo da esfera:
```
style={{
  position: 'absolute', top: 0, left: '10%', right: '10%', height: '45%',
  borderRadius: '50% 50% 0 0',
  background: 'linear-gradient(180deg, #FFD700 0%, #D4A843 60%, #8B6914 100%)',
  borderBottom: '1px solid rgba(139,105,20,0.5)',
  transformOrigin: 'bottom center',
}}
```

**SEQUENCIA REVEAL — 5 PASSOS (useAnimate):**
1. SHAKE: animate x:[-3,3,-3,0] duration 0.4s
2. OPEN LID: animate rotateX:-120 y:-30 opacity:0 duration 0.5s (tampa abre pra tras)
3. REVEAL ANIMAL: animate scale:[0,1.2,1] opacity:[0,1] duration 0.4s (animal aparece de dentro)
4. SHOW NAME: animate opacity:[0,1] y:[10,0] duration 0.3s (nome + milhar)
5. PAUSE: 800ms antes da proxima capsula

3 VELOCIDADES (botoes 1x/2x/> no canto):
- Normal: shake 400ms + open 500ms + reveal 400ms + name 300ms + pause 800ms = ~7s total
- Fast (2x): tudo * 0.5 = ~3.5s
- Instant (>): tudo 100ms = ~1.5s
Skip: clique em qualquer lugar = revela tudo instantaneamente

**ABERTA:** Numero aparece no centro da esfera (milhar).
Numero: JetBrains Mono 900, clamp(16px,2.5vw,28px), #FFFFFF, textShadow `0 0 10px rgba(255,255,255,0.6)`.
Animal pequeno embaixo: img 16-24px do PNG correspondente.
Milhar: JetBrains Mono 600, clamp(6px,0.7vw,9px), rgba(212,168,67,0.4).

**MATCH (jogador apostou neste grupo):** Borda fica verde #00E676, boxShadow ganha `0 0 25px rgba(0,230,118,0.6), 0 0 50px rgba(0,230,118,0.2)`, animation matchFlash 0.6s × 2. Confetti DOM 30 spans dourados.

REVELACAO SEQUENCIAL (dramatica):
- Capsula 1: t=0ms → 5 passos
- Capsula 2: t=total_cap1 → 5 passos
- Capsula 3/4/5: idem com stagger
A cada revelacao, se o grupo eh o que o jogador apostou, o card correspondente no grid pisca verde.

---

## 4. PAINEL DE APOSTAS (lado direito do grid)

Container:
```
style={{
  flex: '0 0 clamp(200px, 38%, 350px)',
  display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.8vw, 12px)',
  padding: 'clamp(6px, 0.8vw, 12px)',
  background: 'rgba(5,5,5,0.85)', border: '1px solid rgba(212,168,67,0.1)',
  borderRadius: 10, backdropFilter: 'blur(2px)', overflowY: 'auto',
}}
```

5 TABS DE MODO (Simple/Dupla/Tripla/Quadra/Quina):
Tab ATIVA:
```
style={{
  padding: 'clamp(4px,0.6vw,8px) clamp(8px,1.5vw,16px)', borderRadius: 6,
  background: 'rgba(212,168,67,0.1)', color: '#D4A843',
  borderBottom: '2px solid #D4A843', border: 'none',
  fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(8px, 1vw, 12px)', textTransform: 'uppercase',
  letterSpacing: '1px', minHeight: 44, cursor: 'pointer',
}}
```
Tab INATIVA: bg rgba(0,0,0,0.3), color rgba(212,168,67,0.4), borderBottom transparent.

MULTIPLICADORES POR MODO:
- Simple: cabeca 12x, cercada 3x
- Dupla: 90x / 10x
- Tripla: 650x / 40x
- Quadra: 3.500x / 180x
- Quina: 15.000x / 1.200x

PAYOUT DISPLAY:
```
style={{
  padding: 'clamp(4px,0.5vw,8px)', background: 'rgba(0,0,0,0.3)',
  borderRadius: 6, borderLeft: '2px solid rgba(255,215,0,0.3)',
}}
```
Linha 1: JetBrains 600 clamp(9px,1.1vw,14px) #FFD700, "1o = 12x = G$1.200"
Linha 2: JetBrains 500 clamp(8px,0.9vw,12px) rgba(212,168,67,0.5), "Outros = 3x = G$300"

CHIPS (5 valores: 50, 100, 250, 500, 1K):
Chip NORMAL:
```
style={{
  width: 'clamp(36px, 5vw, 52px)', height: same, borderRadius: '50%',
  cursor: 'pointer', background: 'rgba(10,10,10,0.9)',
  border: '1.5px solid rgba(212,168,67,0.2)', color: '#00E676',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(9px, 1.1vw, 13px)',
}}
```
Chip ATIVO: bg rgba(20,18,5,0.95), borderColor #FFD700, color #FFD700, scale 1.1, boxShadow `0 0 10px rgba(255,215,0,0.3)`.

BOTAO JOGAR (usa PNG, NAO gradient CSS):
```
style={{
  minWidth: 'clamp(120px, 18vw, 200px)', minHeight: 'clamp(36px, 5vw, 48px)',
  backgroundImage: "url('/assets/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png')",
  backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
  border: 'none', fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(10px, 1.3vw, 16px)', color: '#FFFFFF',
  textTransform: 'uppercase', letterSpacing: '2px',
  textShadow: '0 1px 3px rgba(0,0,0,0.8)', cursor: 'pointer',
}}
```
DISABLED: backgroundImage troca para DESATIVO, opacity 0.4, filter grayscale(0.5).

BOTAO ALEATORIO:
```
style={{
  background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600,
  fontSize: 'clamp(8px, 1vw, 12px)', color: '#D4A843',
  cursor: 'pointer', minHeight: 44,
}}
```

---

## 5. RESULTADO — WIN (overlay) vs LOSE (discreto)

**WIN OVERLAY:** position absolute inset 0, zIndex 80, bg rgba(0,0,0,0.7), backdropFilter blur(8px).

"VOCE GANHOU!": Cinzel 900, clamp(20px,4vw,40px), #00E676, textShadow `0 0 20px rgba(0,230,118,0.5)`.
Payout: JetBrains 900, clamp(24px,5vw,48px), #00E676, countup rAF 2s ease-out.
Animais acertados: row com PNGs dos animais que matcharam, scale bounce.
Confetti: 150 spans DOM dourados (#FFD700, #D4A843, #F6E27A), animation `bichoConfettiFall` stagger.
Botoes: JOGAR NOVAMENTE (verde) + VOLTAR (ghost dourado).

**LOSE:** SEM overlay pesado. Cards nao acertados fazem animation `bichoDefeatFade` (opacity 0.4, scale 0.98). Texto discreto "Nenhum acerto" em Inter 500, rgba(255,255,255,0.4), fade-out 3s. Capsulas permanecem abertas 2s antes de resetar.

---

## 6. KEYFRAMES OBRIGATORIOS

```css
@keyframes bichoShimmer {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 0.15; }
  100% { transform: translateX(200%); opacity: 0; }
}
@keyframes bichoPulseGlow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.95; }
}
@keyframes bichoMatchFlash {
  0%, 100% { opacity: 1; transform: scale(1); }
  25% { opacity: 0.7; transform: scale(1.08); }
  50% { opacity: 1; transform: scale(1.04); }
  75% { opacity: 0.85; transform: scale(1.02); }
}
@keyframes bichoConfettiFall {
  0% { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 1; }
  70% { opacity: 0.8; }
  100% { transform: translateY(400px) rotate(720deg) scale(0.3); opacity: 0; }
}
@keyframes bichoDefeatFade {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.4; transform: scale(0.98); }
}
@keyframes bichoBtnUrgent {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

---

## 7. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA capsulas como circulos flat de cor solida — SEMPRE radial-gradient 4 CAMADAS (base+specular+limb+shadow)
2.  NUNCA capsulas sem specular highlight — o reflexo branco em 12%/18% eh o que faz parecer 3D
3.  NUNCA revelacao de todas capsulas simultaneamente — SEMPRE sequencial stagger 800ms
4.  NUNCA revelacao sem shake+flash pre-abertura — 300ms shake + 400ms flash ANTES do numero aparecer
5.  NUNCA animais como emojis/texto — SEMPRE PNGs de /assets/games/bicho/1.png a 25.png
6.  NUNCA grid com menos de 25 cards (5x5) — todos os 25 animais DEVEM aparecer
7.  NUNCA fundo claro — #0A0A0A com bg-casino.png
8.  NUNCA sans-serif em titulos — Cinzel
9.  NUNCA px fixo — SEMPRE clamp()
10. NUNCA botao < 44px, NUNCA card < 44px minHeight
11. NUNCA GCoin diferente de #00E676
12. NUNCA confetti colorido — SOMENTE dourado (#FFD700, #D4A843, #F6E27A)
13. NUNCA animar box-shadow diretamente em @keyframes — usar transform e opacity (GPU-friendly)
14. NUNCA Canvas/SVG para capsulas — SEMPRE DOM divs com radial-gradient (Chromium 93 do FiveM)
15. NUNCA derrota com overlay pesado — feedback DISCRETO (fade cards, texto sutil, sem blur fullscreen)
```

---

## COMPARACAO — O que o V0 QUER entregar vs o que DEVE entregar

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Capsulas | Circulos amarelos flat | Esferas 3D com 4 camadas radial-gradient (base+specular+limb+shadow) |
| Specular | Ausente | Circulo branco blur(2px) em top 12% left 18%, width/height 35% |
| Revelacao | Todas aparecem de uma vez | Sequencial 800ms stagger: shake 300ms → flash 400ms → numero aparece |
| Grid animais | Divs com texto | 25 PNGs reais de /assets/games/bicho/ com card gradiente escuro |
| Card hover | Sem efeito | scale 1.05 + borda intensifica + shimmer sweep pseudo-element |
| Card selecionado | Borda azul | Borda VERDE #00E676 + glow + badge "APOSTADO" |
| Resultado win | Texto inline | Overlay blur + "VOCE GANHOU!" verde + countup + confetti dourado |
| Resultado lose | Mesmo overlay | SEM overlay — fade discreto nos cards + texto sutil |
| Painel apostas | Inputs nativos | Panel glassmorphism blur(8px) + 5 tabs modo + chips + payout preview |
| Fundo | #0A0A0A liso | bg-casino.png + vinheta + overlay escurecimento |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-ANIMAL-GAME-REVISADO.md — Abril 2026 — 42L → ~330L]`
`[X0 PESQUISA: 3 rodadas, 15+ refs (speckyboy, ibelick, arc.id.au, codepen metallic/lottery, bgaming, skywind, vegasslotsonline, etc)]`
