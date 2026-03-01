# BLACKOUT CASINO — ROTEIRO DE DESENVOLVIMENTO

## Documento Operacional — Passo a Passo com Feedback

**Data:** 01/03/2026
**Base:** Projeto React existente (GTA-CASINO-FLUTUANTE)
**Destino:** Painel NUI FiveM — Blackout Casino

---

# SUMÁRIO

1. Análise do Projeto Existente
2. Pesquisa FiveM NUI — Capacidades e Limitações (2026)
3. Catálogo de Animações e Efeitos Disponíveis
4. Roteiro de Fases (11 fases principais + extras)
5. Sugestão de 5 Jogos para o Hero
6. Temas Sazonais (Natal, Páscoa, etc.)
7. Loading Screens de Abertura de Jogo

---

# 1. ANÁLISE DO PROJETO EXISTENTE

## 1.1 O que já existe e funciona

O projeto tem uma estrutura sólida. Não vamos reescrever — vamos adaptar.

| Componente | Arquivo | Status | O que faz |
|-----------|---------|:------:|-----------|
| Panel (container flutuante) | `Panel.tsx` + `Panel.styles.css` | ✅ Existe | Overlay escuro + container centralizado + dupla borda dourada CSS |
| Header | `Header.tsx` | ✅ Existe | Logo texto + jackpot com letreiro PNG + saldo + bandeiras emoji |
| Dock (menu inferior) | `Dock.tsx` | ✅ Existe | 5 abas com ícones Lucide + cores + glow ativo |
| Hero Carousel | `HeroCarousel.tsx` | ✅ Existe | Embla carousel com 6 slides, autoplay, logos PNG, botão play |
| Game Cards | `GameCard.tsx` | ✅ Existe | Cards com 3D tilt, glow follow mouse, shimmer sweep |
| Content Area | `ContentArea.tsx` | ✅ Existe | Wrapper scrollável (NOTA: tem scroll — precisamos remover) |
| Lobby Page | `LobbyPage.tsx` | ✅ Existe | Hero + grid de cards |
| Gold Particles | `GoldParticles.tsx` | ✅ Existe | 50 partículas Canvas2D flutuando |
| Corner Accents | `CornerAccents.tsx` | ✅ Existe | 4 cantos L-shaped verdes |
| Scan Line | `ScanLine.tsx` | ✅ Existe | Linha HUD horizontal percorrendo |
| 22 Jogos registrados | `games.ts` | ✅ Existe | Todos os 22 jogos com nomes BR/EN, cores, tiers |
| 6 Hero slides | `slides.ts` | ✅ Existe | Crash, Slots, Mines, Bicho, Roulette, Blackjack |
| i18n completo | `translations.ts` | ✅ Existe | PT-BR e EN com todas as strings |
| NUI hooks | `useNui.ts` | ✅ Existe | fetchNui + useNuiEvent |
| Zustand stores | `stores/` | ✅ Existe | Navigation + Player + Settings |
| Design tokens | `tokens.css` | ✅ Existe | Todas as variáveis CSS |
| 20+ animações | `animations.css` | ✅ Existe | Shimmer, glow, fade, scale, scan, float, etc. |
| Asset path utils | `assetPath.ts` | ✅ Existe | Funções para caminhos de imagens |
| bg-casino.png referenciado | `Panel.styles.css` | ✅ Referenciado | Fundo já definido no CSS |

## 1.2 O que precisa mudar

| Problema | Onde | Solução |
|----------|------|---------|
| `public/assets/` está vazio | Pasta public | Copiar as imagens dos ZIPs para a estrutura correta |
| Logo é texto CSS, não imagem | `Header.tsx` | Trocar por `<img>` da logo 4:2 |
| Letreiro é PNG mas path pode estar errado | `Header.tsx` | Validar path `/assets/ui/header-bar.png` |
| Bandeiras são emoji 🇧🇷🇺🇸 | `Header.tsx` | Trocar por imagens estilizadas de bandeiras |
| Dock usa ícones Lucide (genérico) | `Dock.tsx` | Trocar por menu PNG ornamentado + texto HTML |
| ContentArea tem overflow-y-auto (scroll!) | `ContentArea.tsx` | Remover scroll, usar layout fixo |
| Cards usam grid que pode ter scroll | `LobbyPage.tsx` | Converter para carrossel horizontal |
| Botão play é PNG genérico | `HeroCarousel.tsx` | Trocar pela imagem BUTTON-JOGAR-AGORA |
| Next.js precisa virar build estático | `next.config.ts` | Adicionar `output: 'export'` para gerar HTML estático |

## 1.3 Estrutura de Pastas dos Assets (proposta)

```
public/
  assets/
    textures/
      bg-casino.png                    ← fundo do painel
    ui/
      menu-dock.png                    ← MENU-MODELO1-SEM-TEXTO.png
      header-bar.png                   ← LETREIRO PARA TOPO.png (já referenciado)
      btn-play-active.png              ← BUTTON-ATIVO-SEM-TEXTO.png
      btn-play-disabled.png            ← BUTTON-DESATIVO-SEM-TEXTO.png
      logo-landscape.png               ← LOGO 4-2.png
      logo-square.png                  ← LOGO 1-1.png (variante principal)
      flag-br.png                      ← bandeira BR estilizada
      flag-us.png                      ← bandeira US estilizada
    cards/
      crash.png                        ← 1.CRASH.png (500x500)
      slots.png                        ← 2.SLOTS.png
      mines.png                        ← 3.MINES.png
      ... (22 arquivos)
    heroes/
      crash.png                        ← 1.IMAGEM-DOURADA-CRASH.png
      slots.png                        ← 2.IMAGEM-DOURADA-SLOTS.png
      ... (20 arquivos) — FUTURO
    titles/
      pt-BR/
        crash.png                      ← 1.LOGO-BR-CRASH.png
        slots.png                      ← 2.LOGO-BR-SLOT-MACHINE.png
        ... (20 arquivos)
      en/
        crash.png                      ← 1.LOGO-IN-CRASH.png
        slots.png                      ← 2.LOGO-IN-SLOT-MACHINE.png
        ... (20 arquivos)
    shop/
      ... (pedestais — FUTURO)
```

---

# 2. PESQUISA: FIVEM NUI — CAPACIDADES E LIMITAÇÕES (2026)

## 2.1 O que é NUI no FiveM

NUI (New UI) é o sistema de interfaces HTML do FiveM. Usa o **Chromium Embedded Framework (CEF)** — basicamente um Chrome embutido no jogo. Tudo que funciona no Chrome funciona no NUI.

## 2.2 O que o NUI SUPORTA

| Tecnologia | Suporte | Notas |
|-----------|:-------:|-------|
| **HTML5** | ✅ Completo | |
| **CSS3** | ✅ Completo | Animações, flexbox, grid, variables, filters |
| **JavaScript ES2022+** | ✅ Completo | |
| **React** | ✅ Completo | Padrão da comunidade, múltiplos boilerplates |
| **TypeScript** | ✅ Completo | Via build step (Vite/Webpack) |
| **Tailwind CSS** | ✅ Completo | Usado em boilerplates oficiais |
| **Zustand/Redux** | ✅ Completo | State management normal |
| **CSS Animations** | ✅ Completo | @keyframes, transitions, transforms |
| **Canvas 2D** | ✅ Completo | Partículas, desenhos, mini-games |
| **WebGL** | ✅ Completo | Acelerado por hardware |
| **CSS Filters** | ✅ Completo | blur, brightness, drop-shadow, etc. |
| **CSS backdrop-filter** | ✅ Completo | blur por trás de elementos |
| **Google Fonts** | ✅ Via @import | Precisa de internet ou embedar localmente |
| **PNG transparência** | ✅ Completo | Fundo transparente funciona |
| **SVG** | ✅ Completo | Inline ou arquivo |
| **requestAnimationFrame** | ✅ Completo | Para animações suaves |
| **Web Audio API** | ✅ Completo | Sons e música |
| **Fetch API** | ✅ Completo | Comunicação com Lua client |
| **window.postMessage** | ✅ Completo | Receber dados do Lua |
| **Vite** | ✅ Recomendado | Build rápido, HMR |
| **Next.js (static export)** | ✅ Funciona | Com `output: 'export'` gera HTML estático |

## 2.3 Limitações e Cuidados

| Limitação | Detalhes | Solução |
|-----------|---------|---------|
| **Performance** | NUI roda junto com o jogo — CPU/GPU compartilhados | Evitar animações pesadas simultâneas demais |
| **Muitas partículas** | >100 partículas Canvas pode impactar FPS | Manter 30-60 partículas max |
| **DOM updates frequentes** | Re-renders excessivos afetam performance | Zustand com selectors minimiza re-renders |
| **backdrop-filter: blur** | Funciona mas consome GPU | Usar com moderação, blur de 4-8px max |
| **Fontes pesadas** | Google Fonts precisa de internet | Embedar fontes localmente (incluir .woff2 no build) |
| **Imagens grandes** | PNGs >2MB causam delay no load | Otimizar imagens, usar WebP se possível |
| **WebGL transparência** | Bug conhecido com alpha acumulativo em WebGL | Não afeta nosso caso (usamos Canvas 2D) |
| **iframes** | Cada resource NUI é um iframe fullscreen | Não afeta (projeto é single-page) |
| **DevTools** | Acessível em `localhost:13172` | Ótimo para debug em desenvolvimento |
| **Hot Reload** | Precisa restart do resource | Usar Vite watch mode + resource restart |

## 2.4 Build para FiveM

O projeto atual usa Next.js. Para funcionar no FiveM:

```
next.config.ts → adicionar: output: 'export'
```

Isso gera uma pasta `out/` com HTML estático puro. No `fxmanifest.lua`:

```lua
fx_version 'cerulean'
games { 'gta5' }

ui_page 'out/index.html'

files {
    'out/**/*'
}

client_scripts {
    'client/main.lua'
}
```

**ALTERNATIVA FUTURA:** migrar de Next.js para Vite puro (mais leve, build mais rápido). Mas por agora Next.js com export funciona perfeitamente.

---

# 3. CATÁLOGO DE ANIMAÇÕES E EFEITOS DISPONÍVEIS

## 3.1 Animações CSS já existentes no projeto

| Animação | Keyframe | Efeito Visual | Onde usar |
|----------|----------|--------------|-----------|
| `shimmer` | Luz diagonal passando | Brilho deslizando no card | Cards |
| `shimmer-sweep` | Faixa de luz periódica | Reflexo passando | Cards |
| `glow-breathing` | Opacidade pulsando | Brilho que respira | Glow inferior, LEDs |
| `led-sweep` | Background movendo | Luz caminhando esq→dir | Barras LED |
| `gold-shimmer` | Background position | Texto dourado cintilando | Logo "BLACKOUT" |
| `border-glow-rotate` | Background position | Borda dourada animada | Moldura do painel |
| `scan-line` | Top 0→100% | Linha CRT descendo | Efeito HUD |
| `float` | TranslateY variável | Partículas flutuando | Ambiente |
| `fade-in` | Opacity 0→1 | Aparecer suave | Geral |
| `fade-in-up` | Opacity + translateY | Aparecer subindo | Conteúdo |
| `fade-in-down` | Opacity + translateY | Aparecer descendo | Header |
| `slide-in-up` | Opacity + translateY | Subir de baixo | Dock |
| `scale-in` | Opacity + scale | Zoom in suave | Painel abrindo |
| `scale-out` | Opacity + scale | Zoom out suave | Painel fechando |
| `pulse` | Scale 1→1.05→1 | Pulsação | Destaque |
| `pulse-glow` | Box-shadow pulsando | Glow que pulsa | Jackpot, botão |
| `shake` | TranslateX oscilando | Tremida | Feedback de erro |
| `win-flash` | Opacity flash | Flash dourado | Vitória |
| `count-up` | TranslateY + opacity | Número subindo | Jackpot counter |
| `stagger-in` | Opacity + translateY | Entrada escalonada | Cards em sequência |
| `crown-hover` | TranslateY sutil | Coroa flutuando | Ícone header |
| `dot-pulse` | Box-shadow pulsando | Dot do carousel | Dots navegação |
| `spin` | Rotate 360° | Rotação | Loading spinners |

## 3.2 Efeitos Canvas já existentes

| Efeito | Componente | Descrição |
|--------|-----------|-----------|
| Gold Particles | `GoldParticles.tsx` | 50 partículas douradas (85%) e verdes (15%) flutuando com glow halo |

## 3.3 Novos Efeitos que podemos adicionar

| Efeito | Tipo | Descrição | Impacto Performance |
|--------|------|-----------|:-------------------:|
| **Partículas de faísca** | Canvas 2D | Faíscas douradas caindo do topo | 🟢 Baixo |
| **Glow pulsante no jackpot** | CSS | Valor do jackpot com glow que pulsa mais forte | 🟢 Baixo |
| **Hover parallax nos cards** | JS/CSS | Cards com leve efeito 3D ao mover mouse (JÁ EXISTE) | 🟢 Baixo |
| **Transição de slide com fade** | CSS | Hero slides trocando com crossfade suave | 🟢 Baixo |
| **Ripple effect no clique** | CSS | Ondinha expandindo ao clicar | 🟢 Baixo |
| **Confetti de vitória** | Canvas 2D | Confete dourado e verde caindo ao ganhar | 🟡 Médio |
| **Número "contando"** | JS | Jackpot subindo incrementalmente (JÁ EXISTE) | 🟢 Baixo |
| **Glow trail no mouse** | Canvas 2D | Rastro dourado seguindo o cursor | 🟡 Médio |
| **Vignette animada** | CSS | Bordas escuras pulsando sutilmente | 🟢 Baixo |
| **Borda energia** | CSS | Borda do painel com "energia" correndo | 🟢 Baixo |
| **Partículas de moeda** | Canvas 2D | Moedas caindo ao ganhar jackpot | 🟡 Médio |
| **Texto com typewriter** | JS/CSS | Subtítulo aparecendo letra por letra | 🟢 Baixo |
| **Gradient animado no fundo** | CSS | Cores do fundo movendo sutilmente | 🟢 Baixo |
| **Scale bounce nos cards** | CSS | Card "quicando" ao entrar na tela | 🟢 Baixo |
| **Glow line na divisória** | CSS | Linha divisória com luz correndo | 🟢 Baixo |

## 3.4 Combinações de efeitos recomendadas

| Momento | Combinação | Resultado |
|---------|-----------|-----------|
| **Painel abrindo** | `scale-in` + `fade-in` + partículas acelerando | Entrada cinematográfica |
| **Jackpot pulsando** | `pulse-glow` + `count-up` + `glow-breathing` | Valor vivo e magnético |
| **Card hover** | 3D tilt + `shimmer-sweep` + glow follow mouse | Card premium interativo |
| **Trocar slide hero** | Crossfade + `fade-in-up` texto + `scale-in` asset | Transição suave e elegante |
| **Clicar JOGAR AGORA** | `brightness(1.1)` + `scale(1.02)` + ripple | Feedback tátil satisfatório |
| **Ganhar prêmio** | `win-flash` + confetti Canvas + shake leve | Celebração empolgante |
| **Trocar aba dock** | Glow transition + conteúdo `fade-in-up` | Navegação fluida |
| **Loading jogo** | Logo `pulse` + `spin` ring + partículas intensas | Loading imponente |

---

# 4. ROTEIRO DE FASES

**REGRA:** Cada fase só avança após feedback positivo do BC.

---

## FASE 0 — PREPARAÇÃO (Setup dos Assets)

**Objetivo:** Organizar as imagens nos paths corretos e validar que o projeto roda.

**O que será feito:**
- Criar estrutura de pastas em `public/assets/`
- Copiar e renomear as imagens dos ZIPs para os paths corretos
- Corrigir nomes com `.png.png`
- Validar que `npm run dev` roda sem erro
- Validar que bg-casino.png aparece como fundo

**Imagens usadas:**
- `bg-casino.png` → `public/assets/textures/bg-casino.png`
- `MENU-DOURADO-MODELO1-SEM-TEXTO.png` → `public/assets/ui/menu-dock.png`
- `BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png` → `public/assets/ui/btn-play-active.png`
- `BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png` → `public/assets/ui/btn-play-disabled.png`
- `GTARP CASINO LETREIRO PARA TOPO.png` → `public/assets/ui/header-bar.png`
- `1-GTARP CASINO LOGO 4-2.png` → `public/assets/ui/logo-landscape.png`
- Cards e logos conforme necessário nas fases seguintes

**Aguarda feedback:** ✅ "Assets estão no lugar certo e o projeto roda"

---

## FASE 1 — MOLDURA/BORDA FLUTUANTE

**Objetivo:** Refinar o container flutuante para parecer "objeto físico dourado".

**O que será feito:**
- Ajustar proporção do painel (verificar 78%×72% vs atual 85%×85%)
- Garantir bg-casino.png como fundo com partículas douradas visíveis
- Refinar a dupla borda dourada (já existe em CSS)
- Ajustar border-radius
- Garantir respiro lateral (margem entre painel e bordas da tela)
- Animar borda com `border-glow-rotate` (já existe)

**Imagens usadas:**
- `bg-casino.png` (já referenciado em Panel.styles.css)

**Efeitos:**
- `border-glow-rotate` na borda
- `Gold Particles` Canvas (já existe)
- `ScanLine` (já existe)
- `CornerAccents` (já existe)

**Resultado esperado:** Painel flutuante com aspecto de "monitor dourado premium"

**Aguarda feedback:** ✅ "A moldura ficou boa"

---

## FASE 2 — MENU DOCK COM IMAGEM

**Objetivo:** Substituir o dock atual (ícones Lucide) pelo menu dourado ornamentado.

**O que será feito:**
- Substituir o Dock.tsx atual
- Usar `MENU-MODELO1-SEM-TEXTO.png` como `background-image`
- Posicionar 5 textos HTML sobre cada seção da imagem
- Manter cores diferenciadas por aba
- Highlight no item ativo (glow, texto mais brilhante)
- Adicionar transição suave ao trocar aba

**Imagens usadas:**
- `menu-dock.png` (MENU-DOURADO-MODELO1-SEM-TEXTO.png)

**Efeitos:**
- Transition de cor no texto ativo
- Glow sutil no item selecionado
- `fade-in` no conteúdo ao trocar aba

**Resultado esperado:** Menu inferior com aparência de "barra de console de jogo AAA"

**Aguarda feedback:** ✅ "O menu dock ficou bom"

---

## FASE 3 — HEADER (Logo Imagem + Letreiro Jackpot + Saldo + Bandeiras)

**Objetivo:** Trocar o header de texto CSS por imagens reais.

**O que será feito:**
- **Logo:** Trocar texto "BLACKOUT CASINO" pela imagem `logo-landscape.png` (700×350)
- **Letreiro:** Validar que `header-bar.png` (letreiro com asas douradas) funciona como background do jackpot
- **Jackpot:** Valor "R$75.823,94" com fonte display por cima do letreiro
- **Saldo:** Manter estilo atual (verde, monospace)
- **Bandeiras:** Trocar emoji 🇧🇷🇺🇸 por imagens estilizadas de bandeiras com borda dourada

**Imagens usadas:**
- `logo-landscape.png`
- `header-bar.png` (já referenciado)
- Imagens de bandeiras estilizadas (criar ou gerar)

**Efeitos:**
- `count-up` no jackpot (já existe)
- `pulse-glow` sutil no valor do jackpot
- `gold-shimmer` removido do texto (agora é imagem)
- Hover nas bandeiras com `scale(1.1)` + `brightness(1.2)`

**Resultado esperado:** Header premium com logo real, letreiro ornamentado e bandeiras bonitas

**Aguarda feedback:** ✅ "O header ficou bom"

---

## FASE 4 — DIVISÓRIAS INTERNAS (Separar Seções)

**Objetivo:** Criar separação visual clara entre Header, Hero, Carrossel e Dock.

**O que será feito:**
- Remover scroll do ContentArea (overflow-y-auto → overflow-hidden)
- Definir alturas fixas: Header ~12% / Hero ~48% / Carrossel ~25% / Dock ~15%
- Adicionar linhas divisórias douradas entre seções
- Linhas com gradiente (transparente → dourado → transparente)

**Imagens usadas:**
- Nenhuma nova (CSS puro)

**Efeitos:**
- `glow-breathing` nas linhas divisórias (pulso sutil)
- Gradientes dourados nas linhas

**Resultado esperado:** 4 áreas claramente definidas, sem scroll, proporcionais

**Aguarda feedback:** ✅ "As divisórias ficaram boas"

---

## FASE 5 — CARROSSEL DE CARDS (Inferior)

**Objetivo:** Converter o grid de cards em carrossel horizontal.

**O que será feito:**
- Converter grid atual para carrossel horizontal (Embla ou CSS scroll-snap)
- Mostrar ~5 cards visíveis por vez
- Navegação por setas laterais e/ou dots
- Cada card com imagem 500×500 + nome do jogo abaixo
- Manter efeitos existentes (3D tilt, shimmer, glow)
- Sem scroll vertical

**Imagens usadas:**
- 22 imagens de cards (500×500) — copiar para `public/assets/cards/`
- Renomear: `1.CRASH.png` → `crash.png`, etc.

**Efeitos:**
- 3D tilt no hover (já existe)
- `shimmer-sweep` (já existe)
- Mouse follow glow (já existe)
- `stagger-in` na entrada (já existe)
- Navegação com setas + dots

**Resultado esperado:** Carrossel horizontal premium com 22 jogos navegáveis

**Aguarda feedback:** ✅ "O carrossel ficou bom"

---

## FASE 6 — HERO SECTION COM LOGOS

**Objetivo:** Refinar o hero com logos dos jogos + botão JOGAR AGORA em imagem.

**5 jogos sugeridos para o hero (BC decide):**

| # | Jogo | Motivo |
|---|------|--------|
| 1 | **Crash** | Mais popular em cassinos online, visual impactante (foguete) |
| 2 | **Jogo do Bicho** | Exclusivo brasileiro, identidade forte, já tem a logo "JOGO DO BICHO" com coroa |
| 3 | **Slots (Caça-Níquel)** | Clássico de cassino, visual da máquina 777 é icônico |
| 4 | **Mines** | Muito popular, visual verde esmeralda + bomba é marcante |
| 5 | **Roleta** | Clássico absoluto, todo cassino precisa ter |

**Alternativas:** Blackjack (tier A), Plinko (visual colorido), Poker (clássico).

**O que será feito:**
- Copiar logos BR/IN dos 5 jogos escolhidos para `public/assets/titles/`
- Trocar botão play genérico por `btn-play-active.png` / `btn-play-disabled.png`
- Texto "JOGAR AGORA" / "PLAY NOW" por cima do botão (HTML)
- Carrossel hero com autoplay (~6 segundos por slide)
- Lado esquerdo: logo + subtítulo + botão
- Lado direito: por enquanto manter gradiente com cores do jogo (imagens douradas são futuro)

**Imagens usadas:**
- `titles/pt-BR/crash.png`, `titles/en/crash.png` (e os outros 4)
- `btn-play-active.png`
- `btn-play-disabled.png`

**Efeitos:**
- Crossfade entre slides
- `fade-in-up` no texto/logo (já existe)
- `scale-in` no asset (já existe)
- Dots do carousel com `dot-pulse`
- Botão com hover `brightness(1.1)` + `scale(1.02)`
- Botão pressionado troca para imagem `disabled`

**Resultado esperado:** Hero cinematográfico com 5 jogos rotando, logos premium por idioma

**Aguarda feedback:** ✅ "O hero ficou bom"

---

## FASE 7 — SISTEMA DE IDIOMAS REFINADO

**Objetivo:** Garantir que tudo troca perfeitamente BR ↔ EN.

**O que será feito:**
- Validar que logos trocam ao mudar idioma
- Validar que textos do dock trocam
- Validar que saldo e jackpot formatam corretamente
- Validar que subtítulos do hero trocam
- Validar que botão texto troca ("JOGAR AGORA" ↔ "PLAY NOW")

**Imagens usadas:**
- Todas as logos BR e IN dos jogos selecionados

**Efeitos:**
- Transição suave na troca (fade rápido 200ms)

**Aguarda feedback:** ✅ "O idioma funciona perfeitamente"

---

## FASE 8 — PARTÍCULAS E EFEITOS FINAIS

**Objetivo:** Adicionar camada final de polish visual.

**O que será feito:**
- Refinar partículas existentes (quantidade, velocidade, cores)
- Adicionar faíscas douradas sutis caindo do topo
- Glow line animada nas divisórias
- Vignette sutil nas bordas internas
- Efeito de "energia" na borda do painel

**Imagens usadas:**
- Nenhuma nova

**Efeitos novos:**
- Partículas de faísca (Canvas 2D)
- Glow line nas divisórias
- Vignette CSS animada

**Aguarda feedback:** ✅ "Os efeitos ficaram bons"

---

## FASE 9 — IMAGENS DOURADAS NO HERO (Opcional/Futuro)

**Objetivo:** Adicionar os assets 3D dourados no lado direito do hero.

**O que será feito:**
- Copiar imagens douradas (~1024×1024) para `public/assets/heroes/`
- Exibir no lado direito do hero (60%)
- Transição com `scale-in` ao trocar slide
- Glow verde na base

**Imagens usadas:**
- `IMAGEM-DOURADA-CRASH.png` → `heroes/crash.png`
- E os outros 4 jogos selecionados

**Aguarda feedback:** ✅ "As imagens douradas ficaram boas no hero"

---

## FASE 10 — BUILD E TESTE NO FIVEM

**Objetivo:** Compilar e testar no ambiente real do FiveM.

**O que será feito:**
- Configurar `next.config.ts` com `output: 'export'`
- Gerar build estático (`npm run build`)
- Criar `fxmanifest.lua`
- Criar `client/main.lua` com abertura/fechamento do painel
- Testar no servidor FiveM
- Ajustar proporções se necessário para resolução real

**Aguarda feedback:** ✅ "Funciona no FiveM"

---

## FASE 11 — LOADING SCREENS DE ABERTURA DE JOGO

**Objetivo:** Tela de loading premium ao abrir cada jogo.

**O que será feito:**
- Ao clicar em um jogo, mostrar tela de loading antes de abrir
- Loading usa: logo do jogo (BR/IN) + spinner dourado + partículas intensas
- Opção de usar logo Blackout Casino (1:1) como fundo sutil
- Duração: 1-3 segundos (simulada ou real)
- Transição suave para a tela do jogo

**Imagens usadas:**
- Logo do jogo (título BR/IN)
- Logo Blackout Casino 1:1 (fundo sutil)
- Imagem dourada do jogo (se disponível)

**Efeitos:**
- Logo com `pulse` sutil
- Spinner ring com `spin` + glow
- Partículas aceleradas
- Barra de progresso dourada
- `fade-in` → loading → `fade-out` → jogo

**Referências visuais:** Loading screens de jogos como GTA Online Casino, Valorant, League of Legends — sempre com logo centralizada, efeito de brilho, e sensação de "preparando algo grande".

**Aguarda feedback:** ✅ "O loading ficou bom"

---

# 5. TEMAS SAZONAIS (ADENDO FUTURO)

Após o painel principal estar completo, podemos adicionar temas que mudam automaticamente por data.

| Tema | Período | Mudanças Visuais |
|------|---------|-----------------|
| **Natal** | 15/12 a 06/01 | Partículas de neve + bordas vermelhas/verdes + gorro no logo + botão "FELIZ NATAL" |
| **Páscoa** | Data variável | Partículas de confete pastel + ovos dourados nos cards + coelho no hero |
| **Dia das Mães** | 2º domingo de maio | Flores douradas + rosa no logo + mensagem especial |
| **Dia dos Pais** | 2º domingo de agosto | Gravata no logo + tons mais sóbrios + mensagem |
| **Dia das Crianças** | 12/10 | Cores mais vibrantes + estrelas + balões nos cards |
| **Halloween** | 25/10 a 01/11 | Abóboras nos cards + partículas laranja + glow roxo + morcegos |

**Implementação técnica:** Um state `theme` que aplica classes CSS alternativas. Cada tema tem: paleta de cores override, partículas especiais (Canvas), e pequenos elementos decorativos. O logo e as imagens principais NÃO mudam — apenas detalhes decorativos.

---

# 6. RESUMO VISUAL DO ROTEIRO

```
FASE 0: Setup Assets        → Organizar imagens nos paths
FASE 1: Moldura/Borda       → Container flutuante premium
FASE 2: Menu Dock           → Imagem ornamentada + texto HTML
FASE 3: Header              → Logo + Letreiro + Saldo + Bandeiras
FASE 4: Divisórias          → Separar seções, remover scroll
FASE 5: Carrossel Cards     → Grid → carrossel horizontal
FASE 6: Hero + Logos        → 5 jogos com logos BR/IN + botão
FASE 7: Idiomas             → Validação completa BR ↔ EN
FASE 8: Efeitos Finais      → Partículas, glow, polish
FASE 9: Douradas no Hero    → Assets 3D grandes (opcional)
FASE 10: Build FiveM        → Compilar e testar no jogo
FASE 11: Loading Screens    → Abertura premium de jogo

EXTRAS FUTUROS:
- Temas sazonais
- Aba Loja com pedestais
- Aba PVP
- Aba Eventos
- Aba Perfil
```

---

**Este documento é o guia operacional completo. A cada fase, BC dá feedback e só então avançamos.**

**Próximo passo:** BC confirma se quer começar pela FASE 0, e escolhe os 5 jogos do hero.
