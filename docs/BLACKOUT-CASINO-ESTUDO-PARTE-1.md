# BLACKOUT CASINO — ESTUDO COMPLETO DO PROJETO

## Documento Técnico de UI para GTA RP (FiveM NUI)

**Versão:** 1.0
**Data:** 01/03/2026
**Projeto:** Blackout Casino — Painel Flutuante NUI
**Autor:** Documentação colaborativa (Claude + ChatGPT + BC)

---

## ÍNDICE GERAL (3 Partes)

- **PARTE 1** (este arquivo): Visão Geral, Arquitetura, Identidade Visual
- **PARTE 2**: Catálogo Completo de Assets (todas as imagens documentadas)
- **PARTE 3**: Comparativo ChatGPT vs Claude, Plano de Etapas, Checklist Final

---

# 1. VISÃO GERAL DO PROJETO

## 1.1 O que é o Blackout Casino?

É um **painel flutuante de cassino** que aparece dentro do jogo GTA RP (FiveM). Não é um site web. Não é um app. É uma **interface de jogo (HUD)** que surge quando o personagem do jogador entra fisicamente em um cassino dentro do mapa do GTA e interage com um NPC ou mesa.

## 1.2 O que NÃO é

- NÃO é um site responsivo
- NÃO é um dashboard SaaS
- NÃO é uma landing page
- NÃO é um app mobile
- NÃO usa scroll vertical
- NÃO ocupa 100% da tela

## 1.3 O que É

- Um painel central flutuante
- Com proporção fixa (16:9)
- Que parece um **objeto físico dourado flutuando** na tela
- Com estética de cassino cinematográfico premium
- Usando imagens customizadas (não CSS genérico)
- Construído em React para rodar como NUI no FiveM

## 1.4 Contexto Técnico

| Item | Detalhe |
|------|---------|
| **Ambiente** | GTA RP (FiveM) |
| **Tecnologia** | React (NUI — interface web embutida no jogo) |
| **Modo de uso** | Focus Mode — bloqueia movimentação do personagem |
| **Cursor** | Ativo (mouse funciona normalmente) |
| **Scroll** | PROIBIDO — zero scroll vertical |
| **Navegação** | Carrossel horizontal, paginação, abas |
| **Resolução alvo** | 1920x1080 (Full HD) — maioria dos jogadores |
| **Proporção interna** | 16:9 fixa (1600x900 referência) |
| **Ocupação da tela** | ~78% largura × ~72% altura |

## 1.5 Fluxo do Jogador

```
Jogador entra no cassino físico no mapa do GTA
    ↓
Interage com NPC ou mesa
    ↓
Tela escurece levemente (overlay escuro 70-85% opacidade)
    ↓
Painel do cassino surge com animação suave (fade in)
    ↓
Jackpot pulsa levemente, hero aparece com brilho gradual
    ↓
Jogador navega pelo painel usando mouse
    ↓
Escolhe um jogo → transição interna suave
    ↓
Ao sair → painel fecha com fade out
```

## 1.6 Sensação Desejada

Quando o jogador abrir o cassino, ele deve sentir:

> **"Uma tela premium física apareceu à minha frente"**

E NÃO deve sentir:

> "Um site abriu dentro do jogo"

As palavras-chave da experiência são: **Luxo, Poder, Exclusividade**.

---

# 2. IDENTIDADE VISUAL

## 2.1 Paleta de Cores

| Cor | Código | Uso Principal |
|-----|--------|---------------|
| **Ouro metálico polido** | #D4A843 a #FFD700 | Bordas, molduras, texto de destaque, ornamentos |
| **Verde esmeralda neon** | #00E676 | Glow inferior, botão ativo, destaque de seleção |
| **Preto profundo** | #0A0A0A a #1A1A0A | Fundo do painel, base dos cards |
| **Dourado escuro** | #8B6914 a #B8860B | Sombras douradas, textos secundários |
| **Verde escuro** | #004D25 a #1B5E20 | Fundo dos botões, letreiro |

## 2.2 Regra de Hierarquia de Brilho

FUNDAMENTAL: Nem tudo pode brilhar ao mesmo tempo. Se tudo brilhar igual, vira bagunça.

**Ordem de quem brilha mais (do mais forte pro mais fraco):**

1. 🥇 Valor do Jackpot (glow mais forte)
2. 🥈 Asset 3D do hero (imagem dourada grande)
3. 🥉 Logo do jogo na hero (ex: "JOGO DO BICHO")
4. Botão "JOGAR AGORA" (glow verde)
5. Cards do carrossel (glow sutil)
6. Menu dock inferior (glow mínimo no item ativo)

## 2.3 Tipografia

| Uso | Recomendação |
|-----|-------------|
| **Títulos principais** | Os títulos são IMAGENS (logos BR/IN), não texto CSS |
| **Valor do Jackpot** | Fonte serifada forte ou display (ex: Cinzel, Playfair) |
| **Saldo** | Fonte limpa monospace (ex: JetBrains Mono, Roboto Mono) |
| **Textos do menu** | Fonte serifada média ou display dourada |
| **Textos secundários** | Fonte sans-serif limpa (ex: Inter, Roboto) |

**IMPORTANTE:** A maioria dos "textos bonitos" do layout são na verdade IMAGENS PNG, não fontes CSS. Os logos dos jogos (CRASH, JOGO DO BICHO, etc.) são imagens pré-renderizadas com efeito 3D dourado. Isso é intencional — é impossível replicar esse visual com CSS puro.

---

# 3. ARQUITETURA DE CAMADAS

O painel é composto por **6 camadas empilhadas**, da mais profunda (fundo) até a mais superficial (conteúdo):

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 0 — Mundo do GTA (desfocado/escurecido)        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CAMADA 1 — Overlay escuro (preto 70-85%)         │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  CAMADA 2 — Fundo do Painel (bg-casino.png) │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │  CAMADA 3 — Moldura/Bordas douradas   │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │  │
│  │  │  │  │  CAMADA 4 — Divisões internas    │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  CAMADA 5 — Conteúdo      │  │  │  │  │  │
│  │  │  │  │  │  (imagens, texto, botões)  │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Camada 0 — Mundo do GTA
- O jogo continua renderizando por trás
- Levemente desfocado ou escurecido
- Jogador não interage com o mundo enquanto painel está aberto

### Camada 1 — Overlay Escuro
- Div fullscreen com `background: rgba(0,0,0,0.75)`
- Pode ter `backdrop-filter: blur(4px)` opcional
- Bloqueia cliques no mundo (pointer-events controlado)
- Separa visualmente o jogador do GTA

### Camada 2 — Fundo do Painel (bg-casino.png)
- Imagem `bg-casino.png` (1536x1024) como background
- Aplicada com `background-size: cover`
- Partículas douradas + arcos verdes inferiores
- É a "textura interna" do painel flutuante
- **Esta é a camada que dá a sensação de profundidade e material**

### Camada 3 — Moldura Estrutural
- Container centralizado com proporção fixa
- Bordas arredondadas grandes (~20px)
- Dupla borda dourada (CSS: `border` + `box-shadow` ou `outline`)
- Glow interno sutil dourado
- Margem externa invisível (respiro entre painel e borda da tela)
- **É esta moldura que faz parecer "objeto físico flutuando" vs "site aberto"**

### Camada 4 — Divisões Internas
- Separação visual entre Header, Hero, Carrossel e Dock
- Linhas douradas finas horizontais
- Cada seção com seu próprio "container"

### Camada 5 — Conteúdo
- Imagens (logos, assets, cards)
- Textos (jackpot, saldo, subtítulos)
- Botões (JOGAR AGORA)
- Elementos interativos

---

# 4. GRID ESTRUTURAL (LAYOUT MACRO)

## 4.1 Proporção Vertical

O painel é dividido verticalmente em 4 seções:

```
┌──────────────────────────────────────┐
│          HEADER (10-12%)             │  ← Logo + Jackpot + Saldo + Bandeiras
├──────────────────────────────────────┤
│                                      │
│          HERO (45-48%)               │  ← Logo do jogo + Asset 3D + Botão
│                                      │
├──────────────────────────────────────┤
│       CARROSSEL DE JOGOS (25%)       │  ← Cards dos jogos
├──────────────────────────────────────┤
│          DOCK INFERIOR (15%)         │  ← Menu: Cassino, PVP, Loja, Eventos, Perfil
└──────────────────────────────────────┘
```

**NOTA:** O ChatGPT sugeriu Header 15%, mas olhando a imagem de referência, o header é bem compacto. Recomendo 10-12% para o header, e redistribuir o restante para o Hero ter mais espaço.

## 4.2 Grid Interno do HEADER

```
┌──────────┬───────────────────────┬──────────────────┐
│  LOGO    │   LETREIRO JACKPOT    │  SALDO + FLAGS   │
│  (25%)   │      (50%)            │     (25%)        │
└──────────┴───────────────────────┴──────────────────┘
```

- **Esquerda:** Logo Blackout Casino (imagem 4:2, 700x350)
- **Centro:** Letreiro do Jackpot (imagem 1148x298) com valor R$ por cima
- **Direita:** Saldo do jogador + bandeirinhas BR/US para trocar idioma

## 4.3 Grid Interno do HERO

```
┌─────────────────────┬──────────────────────────────┐
│                     │                              │
│  TEXTO/LOGO (40%)   │   ASSET 3D DOURADO (60%)     │
│                     │                              │
│  • Logo do jogo     │   • Imagem dourada grande    │
│    (ex: JOGO DO     │     (ex: foguete, tigre)     │
│     BICHO)          │   • Fundo transparente       │
│  • Subtítulo        │   • Maior peso visual        │
│  • Botão JOGAR      │                              │
│                     │                              │
└─────────────────────┴──────────────────────────────┘
```

**REGRA FUNDAMENTAL:** O asset 3D (lado direito) deve ter MAIS peso visual que o texto (lado esquerdo). Se o texto chamar mais atenção que a imagem, o layout perdeu o foco.

**SOBRE O CARROSSEL DO HERO:** A hero section terá um carrossel automático que roda ~5 jogos em destaque, trocando a cada poucos segundos. Cada "slide" mostra: logo do jogo (BR ou IN conforme idioma) + imagem dourada do jogo + botão JOGAR AGORA. A transição é suave (fade ou slide).

## 4.4 Grid Interno do CARROSSEL DE JOGOS

```
┌────────┬────────┬────────┬────────┬────────┐
│  CARD  │  CARD  │  CARD  │  CARD  │  CARD  │  ← Até 5 cards visíveis
│  1     │  2     │  3     │  4     │  5     │  ← Navegação por setas ou dots
└────────┴────────┴────────┴────────┴────────┘
```

- Cada card contém: imagem dourada 500x500 + nome do jogo abaixo
- Navegação horizontal (setas ou dots, sem scroll vertical)
- Card ativo pode ter glow verde inferior
- Total de jogos disponíveis: 22

## 4.5 Grid Interno do DOCK

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ CASSINO  │   PVP    │   LOJA   │ EVENTOS  │  PERFIL  │
│  (ativo) │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

- Imagem de menu SEM-TEXTO como background
- Texto HTML posicionado por cima de cada "célula"
- Item ativo com destaque visual (glow verde ou texto mais brilhante)
- Cada aba carrega conteúdo diferente na área principal

---

# 5. SISTEMA DE IDIOMAS

## 5.1 Como Funciona

O painel suporta 2 idiomas:
- **BR** — Português brasileiro
- **IN** — Inglês internacional

## 5.2 O que Muda com o Idioma

| Elemento | BR | IN |
|----------|----|----|
| Logo do jogo na hero | `LOGO-BR-CRASH.png` | `LOGO-IN-CRASH.png` |
| Logo do jogo na hero | `LOGO-BR-ANIMAL-GAME.png` ("JOGO DO BICHO") | `LOGO-IN-ANIMAL-GAME.png` ("ANIMAL GAME") |
| Textos do menu dock | "CASSINO", "LOJA", "EVENTOS" | "CASINO", "STORE", "EVENTS" |
| Textos de saldo | "Saldo: R$ 509,25" | "Balance: R$ 509.25" |
| Subtítulos | "Acerte o seu animal favorito..." | "Pick your favorite animal..." |

## 5.3 O que NÃO Muda

- Imagens dos cards (500x500) — são visuais, sem texto
- Imagens douradas (asset 3D) — são visuais, sem texto
- Background (bg-casino.png)
- Botões visuais (JOGAR AGORA) — usa versão SEM-TEXTO + texto HTML por cima
- Menu dock — usa versão SEM-TEXTO + texto HTML por cima

## 5.4 Implementação

- State simples: `lang: 'br' | 'in'`
- Duas bandeirinhas discretas no canto superior direito do header
- Ao clicar, troca `lang` e todas as imagens/textos atualizam instantaneamente
- Path das logos: `logos-${lang}/${numero}.LOGO-${lang.toUpperCase()}-${jogo}.png`

---

# 6. SISTEMA DE ABAS (DOCK)

O dock inferior tem 5 seções. Cada uma carrega conteúdo diferente na área principal (hero + carrossel).

| Aba | Conteúdo |
|-----|----------|
| **CASSINO** | Hero com jogo em destaque + carrossel de 22 jogos |
| **PVP** | Jogos player-vs-player (Coinflip, Case Battle, etc.) |
| **LOJA** | Itens com pedestal (roupas, veículos, caixas, GCoin, passes) |
| **EVENTOS** | Eventos especiais, giveaways, daily free |
| **PERFIL** | Dados do jogador, histórico, configurações |

**NOTA:** Já existem assets prontos para a aba LOJA (pedestais com roupas, veículos, caixas, GCoin, passes de batalha). As outras abas serão desenvolvidas progressivamente.

---

# 7. DECISÕES TÉCNICAS IMPORTANTES

## 7.1 Por que usar IMAGENS ao invés de CSS?

| Elemento | Por que NÃO usar CSS | Solução |
|----------|---------------------|---------|
| Botão JOGAR AGORA | Textura verde nebulosa + moldura dourada dupla + flare de luz = impossível em CSS puro | PNG como `background-image` de uma div clicável |
| Menu dock inferior | Ornamentos dourados, cantos estilizados, brilhos = impossível em CSS | PNG como `background-image` + texto HTML por cima |
| Letreiro jackpot | Asas douradas laterais + fundo verde texturizado = impossível em CSS | PNG como `background-image` + valor numérico HTML por cima |
| Logos dos jogos | Texto 3D dourado com coroa e partículas = impossível em CSS | PNG como `<img>` tag |
| Fundo do painel | Partículas douradas espaciais com arcos verdes = impossível em CSS | PNG como `background-image: cover` |

**RESUMO:** As IAs (V0, Lovable, Claude) falharam antes porque tentaram recriar esses efeitos com CSS. Isso é impossível. A solução correta é usar as imagens como base visual e sobrepor conteúdo HTML dinâmico por cima.

## 7.2 Técnica Principal: Imagem de Fundo + Conteúdo por Cima

```
CONCEITO VISUAL:

┌─────────────────────────────┐
│  [PNG do botão verde]       │  ← Imagem decorativa (background-image)
│       JOGAR AGORA           │  ← Texto HTML posicionado por cima
└─────────────────────────────┘

┌─────────────────────────────┐
│  [PNG do menu dourado]      │  ← Imagem decorativa (background-image)
│  CASSINO  PVP  LOJA  ...   │  ← Texto HTML posicionado por cima
└─────────────────────────────┘

┌─────────────────────────────┐
│  [PNG do letreiro verde]    │  ← Imagem decorativa (background-image)
│      R$ 75.823,94           │  ← Valor HTML posicionado por cima
└─────────────────────────────┘
```

Esta técnica é usada em jogos profissionais AAA. É simples, confiável e produz exatamente o resultado visual desejado.

## 7.3 Vantagens desta Abordagem

- **Fidelidade visual 100%** — o que você desenhou no Canvas é exatamente o que aparece
- **Idioma dinâmico** — texto HTML pode mudar, imagem de fundo continua igual
- **Estados interativos** — hover pode trocar imagem (ativo ↔ desativo) ou aplicar `brightness`
- **Performance** — PNGs são carregadas uma vez e cacheadas
- **Manutenção** — quer mudar o visual? Troca a imagem, não reescreve CSS

---

# 8. REGRAS ABSOLUTAS (O QUE NUNCA FAZER)

1. ❌ **NUNCA** usar scroll vertical
2. ❌ **NUNCA** fazer o painel ocupar 100% da tela
3. ❌ **NUNCA** usar layout responsivo fluido como web
4. ❌ **NUNCA** tentar recriar os ornamentos dourados com CSS puro
5. ❌ **NUNCA** usar blur exagerado
6. ❌ **NUNCA** usar gradientes genéricos no lugar das texturas reais
7. ❌ **NUNCA** aplicar glow/brilho em todos os elementos ao mesmo tempo
8. ❌ **NUNCA** usar fontes comuns de web para títulos dos jogos (são imagens)
9. ❌ **NUNCA** usar cards com aparência de dashboard/SaaS
10. ❌ **NUNCA** usar navbar padrão web no lugar do dock com imagem

---

*Continua na PARTE 2 — Catálogo Completo de Assets*
