# BLACKOUT CASINO — ESTUDO COMPLETO DO PROJETO

## PARTE 2: Catálogo Completo de Assets

---

# 9. INVENTÁRIO GERAL DE ASSETS

## 9.1 Resumo Quantitativo

| Categoria | Arquivo ZIP | Qtd. Imagens | Formato | Transparência |
|-----------|------------|:------------:|---------|:-------------:|
| Fundo do painel | FUNDO-PARA-PAINEL-FLUTUANTE.zip | 1 | PNG | ❌ Não (RGB) |
| Menu dock | IDEIA-DE-MENU.zip | 4 | PNG | ✅ Sim (RGBA) |
| Botão jogar | BUTTON-JOGAR-AGORA-ATIVO-DESATIVO.zip | 4 | PNG | ✅ Sim (RGBA) |
| Letreiro topo | GTARP CASINO LETREIRO PARA TOPO.zip | 1 | PNG | ✅ Sim (RGBA) |
| Logo principal | LOGO-BLACKOUT-CASINO.zip | 4 | PNG | ✅ Sim (RGBA) |
| Logos BR | GTARP CASINO LOGOS (BR).zip | 20 | PNG | ✅ Sim (RGBA) |
| Logos IN | GTARP CASINO LOGOS (IN).zip | 20 | PNG | ✅ Sim (RGBA) |
| Cards para carrossel | IMAGENS-DOURADAS-PARA-CARD.zip | 22 | PNG | ⚠️ Misto* |
| Imagens douradas (hero) | GTARP CASINO IMAGEM DOURADA.zip | 20 | PNG | ✅ Sim (RGBA) |
| Itens com pedestal (loja) | GTARP CASINO IMAGEM COM PEDESTAL.zip | 24 | PNG | ✅ Sim (RGBA) |
| **TOTAL** | **10 ZIPs** | **120 imagens** | | |

*\*Cards: maioria tem fundo preto (RGB), não transparente. Funciona perfeitamente sobre fundo escuro.*

---

# 10. CATÁLOGO DETALHADO POR CATEGORIA

---

## 10.1 — FUNDO DO PAINEL FLUTUANTE

### Arquivo ZIP: `FUNDO-PARA-PAINEL-FLUTUANTE.zip`

| Arquivo | Dimensão | Modo | Transparência |
|---------|----------|------|:-------------:|
| `bg-casino.png` | 1536 × 1024 | RGB | ❌ Não |

### Descrição Visual
Fundo escuro com partículas douradas flutuantes, similar a uma nebulosa espacial dourada. Na parte inferior há arcos sutis de luz verde esmeralda. Efeito de vignette (bordas mais escuras que o centro). Predominância de tons dourados sobre preto profundo.

### Onde Usar
- **CAMADA 2** da arquitetura — fundo interno do painel flutuante
- Aplicar como `background-image` do container principal
- Usar `background-size: cover` para cobrir toda a área
- Proporção 3:2 (1536x1024) — se encaixa bem em container 16:9

### Como Aplicar (conceito)
```
Container principal do painel
    └── background-image: url('bg-casino.png')
    └── background-size: cover
    └── background-position: center
```

### Importância
⭐⭐⭐⭐⭐ CRÍTICA — É uma das imagens mais importantes. Sem ela, o painel pareceria um site com fundo preto flat. Com ela, ganha textura, profundidade e identidade visual premium.

---

## 10.2 — MENU DOCK INFERIOR

### Arquivo ZIP: `IDEIA-DE-MENU.zip`

| Arquivo | Dimensão | Modo | Descrição |
|---------|----------|------|-----------|
| `MENU-DOURADO-MODELO1-COM-TEXTO.png` | 1072 × 370 | RGBA | Modelo 1 com texto "CASSINO PVP LOJA EVENTOS PERFIL" |
| `MENU-DOURADO-MODELO1-SEM-TEXTO.png` | 1072 × 370 | RGBA | Modelo 1 sem texto (versão para produção) |
| `MENU-DOURADO-MODELO2-COM-TEXTO.png` | 1072 × 370 | RGBA | Modelo 2 com texto |
| `MENU-DOURADO-MODELO2-SEM-TEXTO.png` | 1072 × 370 | RGBA | Modelo 2 sem texto (versão para produção) |

### Diferença entre Modelos

| Aspecto | Modelo 1 | Modelo 2 |
|---------|----------|----------|
| Cantos | Angulares, pontiagudos, estilo medieval | Arredondados, mais fluidos |
| Ornamento superior | Ponta central triangular com glow | Onda fluida com glow central |
| Ornamento inferior | Ponta central + detalhes laterais | Ponta central mais sutil |
| Cantos laterais | Estilo "garras" douradas ornamentadas | Curvas suaves com arabescos |
| Divisórias | 4 linhas finas verticais (5 seções) | 4 diamantes dourados (5 seções) |
| Estilo geral | Mais agressivo, "Las Vegas premium" | Mais elegante, "luxo refinado" |

### Recomendação
**Modelo 1** combina melhor com a imagem de referência do layout original (que tem dock inferior mais elaborado e angular).

### Qual Versão Usar em Produção
**SEM-TEXTO** — Sempre usar a versão sem texto. O texto será HTML dinâmico posicionado por cima de cada uma das 5 seções. Isso permite:
- Trocar idioma (BR/IN)
- Mudar cor do texto ativo vs inativo
- Adicionar ícones
- Ajustar tamanho da fonte

### Onde Usar
- **DOCK INFERIOR** (últimos 15% do painel)
- Como `background-image` de uma div que contém 5 divs filhas (uma por aba)

### Técnica de Implementação (conceito)
```
<div class="dock" style="background-image: url('MENU-MODELO1-SEM-TEXTO.png')">
    <div class="dock-item ativo">CASSINO</div>    ← posição absoluta sobre seção 1
    <div class="dock-item">PVP</div>               ← posição absoluta sobre seção 2
    <div class="dock-item">LOJA</div>              ← posição absoluta sobre seção 3
    <div class="dock-item">EVENTOS</div>           ← posição absoluta sobre seção 4
    <div class="dock-item">PERFIL</div>            ← posição absoluta sobre seção 5
</div>
```

### Importância
⭐⭐⭐⭐⭐ CRÍTICA — O menu dock é o que diferencia "HUD de jogo" de "navbar de site".

---

## 10.3 — BOTÃO JOGAR AGORA

### Arquivo ZIP: `BUTTON-JOGAR-AGORA-ATIVO-DESATIVO.zip`

| Arquivo | Dimensão | Modo | Descrição |
|---------|----------|------|-----------|
| `BUTTON-JOGAR-AGORA-ATIVO-COM-TEXTO.png` | 829 × 234 | RGBA | Estado ativo com texto "JOGAR AGORA" embutido |
| `BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png` | 829 × 234 | RGBA | Estado ativo sem texto (para produção) |
| `BUTTON-JOGAR-AGORA-DESATIVO-COM-TEXTO.png` | 829 × 234 | RGBA | Estado desativado com texto |
| `BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png` | 829 × 234 | RGBA | Estado desativado sem texto (para produção) |

### Descrição Visual
- Fundo verde esmeralda com textura de nebulosa/energia
- Moldura dourada dupla (borda externa + borda interna)
- Ponto de luz (flare) na parte inferior central
- O estado ATIVO tem glow mais forte e brilho inferior mais intenso
- O estado DESATIVO tem brilho reduzido e aparência mais apagada

### Diferença Ativo vs Desativo

| Aspecto | ATIVO | DESATIVO |
|---------|-------|----------|
| Brilho geral | Forte | Reduzido |
| Flare inferior | Intenso, verde brilhante | Suave, quase apagado |
| Textura interna | Verde vibrante com energia | Verde mais escuro, menos contraste |
| Moldura dourada | Brilhante | Levemente mais opaca |

### Estados do Botão na Interface

| Estado | Imagem | Efeito CSS Adicional |
|--------|--------|---------------------|
| **Normal** | ATIVO-SEM-TEXTO | Nenhum |
| **Hover** | ATIVO-SEM-TEXTO | `brightness(1.1)` + `scale(1.02)` |
| **Pressionado (click)** | DESATIVO-SEM-TEXTO | `brightness(0.9)` + `scale(0.98)` |
| **Desabilitado** | DESATIVO-SEM-TEXTO | `opacity(0.5)` + `cursor: not-allowed` |

### Onde Usar
- **HERO SECTION** — botão principal "JOGAR AGORA" abaixo do logo do jogo
- Versão SEM-TEXTO como `background-image`
- Texto HTML "JOGAR AGORA" / "PLAY NOW" por cima (troca com idioma)
- Pode ser reutilizado como base visual para outros botões do sistema

### Por que não deu certo antes com CSS?
Tentativas anteriores de recriar esse botão com CSS falharam porque é impossível replicar: textura de nebulosa verde + moldura dourada dupla com inner glow + flare de luz central inferior. São efeitos gráficos que só existem como imagem.

### Importância
⭐⭐⭐⭐ ALTA — É o CTA (Call to Action) principal. Deve ser mais chamativo que botões secundários, mas menos que o jackpot.

---

## 10.4 — LETREIRO DO TOPO (JACKPOT)

### Arquivo ZIP: `GTARP CASINO LETREIRO PARA TOPO.zip`

| Arquivo | Dimensão | Modo | Descrição |
|---------|----------|------|-----------|
| `GTARP CASINO LETREIRO PARA TOPO.png` | 1148 × 298 | RGBA | Letreiro com asas douradas e fundo verde |

### Descrição Visual
- Formato retangular horizontal com "asas" douradas nas laterais
- Fundo verde escuro texturizado (mesma paleta do botão)
- Moldura dourada dupla
- Ponto de flare verde na parte inferior central
- As "asas" douradas se estendem para fora da moldura, criando efeito premium

### Onde Usar
- **HEADER** — centro do topo, onde fica o display do GRANDE JACKPOT
- Na imagem de referência: é onde aparece "GRANDE JACKPOT" com o valor "R$75.823,94"
- Imagem como `background-image` de um container
- Texto "GRANDE JACKPOT" + valor "R$75.823,94" posicionados por cima em HTML
- O valor pode ter animação de pulso sutil ou incremento

### DNA Visual
Compartilha o mesmo DNA visual (verde esmeralda + moldura dourada) com o botão JOGAR AGORA e com o glow inferior dos cards na referência. Isso cria consistência visual.

### Importância
⭐⭐⭐⭐⭐ CRÍTICA — O jackpot é o elemento de MAIOR peso visual do painel inteiro. É a primeira coisa que o jogador vê.

---

## 10.5 — LOGO PRINCIPAL BLACKOUT CASINO

### Arquivo ZIP: `LOGO-BLACKOUT-CASINO.zip`

| Arquivo | Dimensão | Proporção | Descrição |
|---------|----------|-----------|-----------|
| `1-GTARP CASINO LOGO 4-2.png` | 700 × 350 | 4:2 (paisagem) | Logo horizontal — IDEAL para header |
| `1-GTARP CASINO logo 1-1.png` | 1063 × 1063 | 1:1 (quadrada) | Logo com escudo + louros — para splash/loading |
| `2-GTARP CASINO logo 1-1.png` | 1063 × 1063 | 1:1 (quadrada) | Variante 2 |
| `3-GTARP CASINO logo 1-1.png` | 1063 × 1063 | 1:1 (quadrada) | Variante 3 |

### Descrição Visual
- **Versão 4:2 (paisagem):** Escudo dourado com estrela à esquerda + texto "BLACKOUT CASINO" em dourado 3D à direita. Formato ideal para header horizontal.
- **Versões 1:1 (quadradas):** Escudo grande com texto "BLACKOUT CASINO" integrado, louros dourados na base, estrela central. Mais imponente, ideal para telas de destaque.

### Onde Usar

| Logo | Uso Recomendado |
|------|----------------|
| `LOGO 4-2` (paisagem) | **HEADER** — canto superior esquerdo, como na referência |
| `logo 1-1` (quadrada) | Tela de loading/splash, aba Perfil, páginas internas, decoração |

### Importância
⭐⭐⭐⭐ ALTA — Identidade institucional. Mas no layout, não deve competir visualmente com o jackpot (peso visual menor que o jackpot).

---

## 10.6 — LOGOS DOS JOGOS (BR e IN)

### Arquivos ZIP:
- `GTARP CASINO LOGOS (BR).zip` — 20 logos em português
- `GTARP CASINO LOGOS (IN).zip` — 20 logos em inglês

### Dimensão Padrão: 650 × 325 pixels, RGBA (transparente)

### Lista Completa

| # | Arquivo BR | Arquivo IN | Jogo |
|---|-----------|-----------|------|
| 1 | `1.LOGO-BR-CRASH.png` | `1.LOGO-IN-CRASH.png` | Crash |
| 2 | `2.LOGO-BR-SLOT-MACHINE.png` | `2.LOGO-IN-SLOT-MACHINE.png` | Caça-Níquel |
| 3 | `3.LOGO-BR-MINES.png` | `3.LOGO-IN-MINES.png` | Mines |
| 4 | `4.LOGO-BR-BLACKJACK.png` | `4.LOGO-IN-BLACKJACK.png` | Blackjack |
| 5 | `5.LOGO-BR-ROULETTE.png.png` | `5.LOGO-IN-ROULETTE.png.png` | Roleta |
| 6 | `6.LOGO-BR-POKER.png` | `6.LOGO-IN-POKER.png` | Poker |
| 7 | `7.LOGO-BR-DICE.png` | `7.LOGO-IN-DICE.png` | Dados |
| 8 | `8.LOGO-BR-PLINKO.png` | `8.LOGO-IN-PLINKO.png` | Plinko |
| 9 | `9.LOGO-BR-ANIMAL-GAME.png` | `9.LOGO-IN-ANIMAL-GAME.png` | Jogo do Bicho |
| 10 | `10.LOGO-BR-BRAZILIAN-ROULETTE.png` | `10.LOGO-IN-BRAZILIAN-ROULETTE.png` | Roleta Brasileira |
| 11 | `11.LOGO-BR-CASE-BATTLE.png` | `11.LOGO-IN-CASE-BATTLE.png` | Case Battle |
| 12 | `12.LOGO-BR-CONIFLIP.png` | `12.LOGO-IN-CONIFLIP.png` | Coinflip |
| 13 | `13.LOGO-BR-JACKPOT.png.png` | `13.LOGO-IN-JACKPOT.png.png` | Jackpot |
| 14 | `14.LOGO-BR-CASES.png` | `14.LOGO-IN-CASES.png` | Cases |
| 15 | `15.LOGO-BR-UPGRADE.png` | `15.LOGO-IN-UPGRADE.png` | Upgrade |
| 16 | `16.LOGO-BR-MARKETPLACE.png` | `16.LOGO-IN-MARKETPLACE.png` | Marketplace |
| 17 | `17.LOGO-BR-INVENTORY.png` | `17.LOGO-IN-INVENTORY.png` | Inventário |
| 18 | `18.LOGO-BR-LOTTERY.png` | `18.LOGO-IN-LOTTERY.png` | Loteria |
| 19 | `19.LOGO-BR-DAILY-FREE.png` | `19.LOGO-IN-DAILY-FREE.png` | Daily Free |
| 20 | `20.LOGO-BR-GIVEAWAYS.png` | `20.LOGO-IN-GIVEAWAYS.png` | Giveaways |

### Descrição Visual
Cada logo é um texto 3D dourado estilizado com efeitos especiais. O logo do "Jogo do Bicho" (BR) por exemplo tem coroa dourada no topo e partículas brilhantes. A versão IN ("Animal Game") tem o mesmo estilo visual mas texto em inglês.

### Onde Usar
- **HERO SECTION** — lado esquerdo, acima do botão JOGAR AGORA
- Exatamente como na imagem de referência onde aparece "JOGO DO BICHO" em dourado
- Só 1 logo aparece por vez (o jogo em destaque no hero)
- Troca quando o carrossel do hero muda de slide
- Troca quando o jogador muda idioma (BR ↔ IN)

### Observação sobre Nomes de Arquivo
⚠️ Alguns arquivos têm `.png.png` (extensão duplicada): arquivos 5 e 13. Isso pode causar problemas. Recomenda-se renomear para `.png` simples antes de usar em produção.

### Importância
⭐⭐⭐⭐ ALTA — São os títulos visuais dos jogos. Definem a identidade de cada modo de jogo.

---

## 10.7 — IMAGENS PARA CARDS DO CARROSSEL

### Arquivo ZIP: `IMAGENS-DOURADAS-PARA-CARD.zip`

### Dimensão Padrão: 500 × 500 pixels

| # | Arquivo | Jogo | Descrição Visual |
|---|---------|------|------------------|
| 1 | `1.CRASH.png` | Crash | Foguete dourado decolando com fogo e partículas |
| 2 | `2.SLOTS.png` | Caça-Níquel | Máquina de slot dourada com "777" e glow verde |
| 3 | `3.MINES.png` | Mines | Diamante verde esmeralda + bomba com pavio aceso |
| 4 | `4.BLACKJACK.png` | Blackjack | Cartas e fichas douradas |
| 5 | `5.ROULETTE.png.png` | Roleta | Roleta dourada com glow verde |
| 6 | `6.POKER.png` | Poker | Mesa/fichas de poker douradas |
| 7 | `7.DICE.png` | Dados | Dados dourados com pontos luminosos |
| 8 | `8.PLINKO.png` | Plinko | Elementos de plinko dourados |
| 9 | `9.ANIMA-GAME.png` | Jogo do Bicho | Elementos de animais dourados |
| 10 | `10.BRAZILIAN-ROULETTE.png` | Roleta Brasileira | Roleta estilizada brasileira |
| 11 | `11.CASE-BATTLE.png` | Case Battle | Caixas em batalha |
| 12 | `12.CONIFLIP.png` | Coinflip | Moeda dourada |
| 13 | `13.JACKPOT.png.png` | Jackpot | Elementos de jackpot dourados |
| 14 | `14.CASES.png` | Cases | Caixas douradas |
| 15 | `15.UPGRADE.png` | Upgrade | Elementos de upgrade |
| 16 | `16.MARKETPLACE.png` | Marketplace | Elementos de mercado |
| 17 | `17.INVENTORY.png` | Inventário | Elementos de inventário |
| 18 | `18.LOTTERY.png` | Loteria | Elementos de loteria |
| 19 | `19.DAILY-FREE.png` | Daily Free | Presente/recompensa diária |
| 20 | `20.GIVEAWAYS.png` | Giveaways | Elementos de sorteio |
| 21 | `21.BINGO.png` | Bingo | Elementos de bingo |
| 22 | `22.POOL-GAME.png` | Pool Game | Mesa de sinuca |

### Transparência
⚠️ **ATENÇÃO:** Estas imagens têm fundo **PRETO SÓLIDO** (modo RGB), NÃO transparente. Isso NÃO é problema porque:
- Os cards vão estar sobre fundo escuro
- O preto se mescla naturalmente com o fundo do painel
- Se precisar de transparência futuramente, pode tratar com remoção de fundo

### Onde Usar
- **CARROSSEL DE JOGOS** — cada card mostra uma dessas imagens
- Dentro de containers com bordinha dourada sutil
- Com nome do jogo abaixo (texto HTML ou logo reduzida)
- Glow verde inferior sutil no card ativo/hover

### Importância
⭐⭐⭐⭐ ALTA — São o rosto visual de cada jogo no carrossel.

---

## 10.8 — IMAGENS DOURADAS GRANDES (HERO 3D)

### Arquivo ZIP: `GTARP CASINO IMAGEM DOURADA.zip`

### Dimensão Padrão: ~1024 × 1024 pixels, RGBA (transparente)

| # | Arquivo | Jogo |
|---|---------|------|
| 1 | `1.IMAGEM-DOURADA-CRASH.png` | Crash (foguete dourado detalhado) |
| 2 | `2.IMAGEM-DOURADA-SLOTS.png` | Caça-Níquel |
| 3 | `3.IMAGEM-DOURADA-MINES.png` | Mines |
| 4 | `4.IMAGEM-DOURADA-BLACKJACK.png` | Blackjack |
| 5 | `5.IMAGEM-DOURADA-ROULETTE.png.png` | Roleta |
| 6 | `6.IMAGEM-DOURADA-POKER.png` | Poker |
| 7 | `7.IMAGEM-DOURADA-DICE.png` | Dados |
| 8 | `8.IMAGEM-DOURADA-PLINKO.png` | Plinko |
| 9 | `9.IMAGEM-DOURADA-ANIMA-GAME.png` | Jogo do Bicho |
| 10 | `10.IMAGEM-DOURADA-BRAZILIAN-ROULETTE.png` | Roleta Brasileira |
| 11 | `11.IMAGEM-DOURADA-CASE-BATTLE.png` | Case Battle |
| 12 | `12.IMAGEM-DOURADA-CONIFLIP.png` | Coinflip |
| 13 | `13.IMAGEM-DOURADA-JACKPOT.png.png` | Jackpot |
| 14 | `14.IMAGEM-DOURADA-CASES.png` | Cases |
| 15 | `15.IMAGEM-DOURADA-UPGRADE.png` | Upgrade |
| 16 | `16.IMAGEM-DOURADA-MARKETPLACE.png` | Marketplace |
| 17 | `17.IMAGEM-DOURADA-INVENTORY.png` | Inventário |
| 18 | `18.IMAGEM-DOURADA-LOTTERY.png` | Loteria |
| 19 | `19.IMAGEM-DOURADA-DAILY-FREE.png` | Daily Free |
| 20 | `20.IMAGEM-DOURADA-GIVEAWAYS.png` | Giveaways |

### Descrição Visual
Imagens douradas detalhadas em fundo transparente. São versões "escultóricas" de cada jogo — puro ouro metálico polido. Exemplo: o Crash é um foguete dourado ornamentado com detalhes de relevo, estilo escultura de museu.

### Onde Usar — DESCOBERTA IMPORTANTE
Estas imagens são o **ASSET PRINCIPAL DA HERO SECTION** — o lado direito do hero (60% do espaço).

Na imagem de referência, o tigre dourado no pedestal é exatamente este tipo de imagem. Quando o hero muda de jogo:
- Jogo "Crash" → mostra o foguete dourado
- Jogo "Mines" → mostra a esmeralda/bomba dourada
- Jogo "Jogo do Bicho" → mostra o animal dourado
- etc.

### Relação com outras imagens

```
HERO SECTION COMPLETA:

┌─────────────────────┬──────────────────────────────┐
│  LOGO DO JOGO       │   IMAGEM DOURADA GRANDE      │
│  (logos-br/in)      │   (imagem-dourada)            │
│  650x325            │   ~1024x1024                  │
│                     │   TRANSPARENTE                │
│  + Subtítulo        │   É O FOCO VISUAL PRINCIPAL   │
│  + Botão JOGAR      │                              │
└─────────────────────┴──────────────────────────────┘
```

### Status de Uso
BC indicou que NÃO pretende usar agora, mas a análise mostra que estas são essenciais para o hero completo. Podem ser adicionadas em etapa posterior.

### Importância
⭐⭐⭐⭐⭐ CRÍTICA (para hero completo) — São o segundo elemento de maior peso visual do painel, depois do jackpot.

---

## 10.9 — ITENS COM PEDESTAL (LOJA)

### Arquivo ZIP: `GTARP CASINO IMAGEM COM PEDESTAL.zip`

### Dimensão: Variável (~500-1000px), RGBA (transparente)

### Categorias de Itens

**ROUPAS (5 itens):**

| Arquivo | Item |
|---------|------|
| `ROUPAS-3.Conjunto-Gangster.png` | Conjunto Gangster |
| `ROUPAS-4.Farda-Militar.png` | Farda Militar |
| `ROUPAS-5.Terno-Dourado.png` | Terno Dourado |

**VEÍCULOS (5 itens):**

| Arquivo | Item |
|---------|------|
| `VEICULOS-1.Truffade-Thrax.png` | Truffade Thrax |
| `VEICULOS-2.Pegassi-Zentorno.png` | Pegassi Zentorno |
| `VEICULOS-3.Benefactor-Krieger.png` | Benefactor Krieger |
| `VEICULOS-4.Nagasaki-Shotaro.png` | Nagasaki Shotaro |
| `VEICULOS-5.Pegassi-Oppressor.png` | Pegassi Oppressor |

**CAIXAS (5 itens):**

| Arquivo | Item |
|---------|------|
| `CAIXAS-1.Caixa-Heroica.png` | Caixa Heróica |
| `CAIXAS-2.Caixa-de-Carro.png` | Caixa de Carro |
| `CAIXAS-3.Caixa-Lendaria.png` | Caixa Lendária |
| `CAIXAS-4.Caixa-Epica.png` | Caixa Épica |
| `CAIXAS-5.Caixa-Olimpica.png` | Caixa Olímpica |

**GCOIN (5 itens):**

| Arquivo | Item |
|---------|------|
| `GCOIN-1.1.000-GCoin.png` | 1.000 GCoin |
| `GCOIN-2.5.000-GCoin.png` | 5.000 GCoin |
| `GCOIN-3.-10.000-GCoin.png` | 10.000 GCoin |
| `GCOIN-4.50.000-GCoin.png` | 50.000 GCoin |
| `GCOIN-5.100.000-GCoin.png` | 100.000 GCoin |

**PASSE DE BATALHA (2 itens):**

| Arquivo | Item |
|---------|------|
| `PASSE-DE-BATALHA-1.Passe-Free.png` | Passe Free |
| `PASSE-DE-BATALHA-2.Passe-Premium.png` | Passe Premium |

### Onde Usar
- **ABA LOJA** do dock inferior
- Cada item aparece com seu pedestal dourado
- Itens organizados por categoria (roupas, veículos, caixas, GCoin, passes)
- Fundo transparente permite posicionar sobre qualquer fundo

### Importância
⭐⭐⭐ MÉDIA (para fase atual) — São conteúdo da aba Loja. Serão implementados após o cassino principal estar funcionando.

---

# 11. MAPA VISUAL: ONDE CADA ASSET VAI NO LAYOUT

```
┌──────────────────────────────────────────────────────────────────┐
│  bg-casino.png (FUNDO DO PAINEL INTEIRO)                         │
│                                                                  │
│  ┌──────────┬─────────────────────────┬────────────────────────┐ │
│  │  LOGO    │    LETREIRO-TOPO.png    │  Saldo + 🇧🇷🇺🇸       │ │
│  │  4-2.png │    + "R$75.823,94"      │  bandeiras idioma      │ │
│  │  (header)│    (header centro)      │  (header direita)      │ │
│  ├──────────┴────────────┬────────────┴────────────────────────┤ │
│  │                       │                                     │ │
│  │  LOGO-BR-XXX.png      │    IMAGEM-DOURADA-XXX.png           │ │
│  │  ou LOGO-IN-XXX.png   │    (asset 3D grande)                │ │
│  │  (título do jogo)     │    (foco visual principal)          │ │
│  │                       │                                     │ │
│  │  "subtítulo em texto" │                                     │ │
│  │                       │                                     │ │
│  │  BUTTON-ATIVO.png     │                                     │ │
│  │  + "JOGAR AGORA"      │                                     │ │
│  │  (botão CTA)          │                                     │ │
│  ├───────────────────────┴─────────────────────────────────────┤ │
│  │  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐                   │ │
│  │  │CARD│  │CARD│  │CARD│  │CARD│  │CARD│    ← • • • • •     │ │
│  │  │500 │  │500 │  │500 │  │500 │  │500 │    (dots paginação) │ │
│  │  └────┘  └────┘  └────┘  └────┘  └────┘                   │ │
│  │  (IMAGENS-DOURADAS-PARA-CARD / carrossel)                   │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  MENU-MODELO1-SEM-TEXTO.png (background)                   │ │
│  │  CASSINO   PVP    LOJA    EVENTOS    PERFIL  (texto HTML)  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

*Continua na PARTE 3 — Comparativo ChatGPT vs Claude, Plano de Etapas, Checklist Final*
