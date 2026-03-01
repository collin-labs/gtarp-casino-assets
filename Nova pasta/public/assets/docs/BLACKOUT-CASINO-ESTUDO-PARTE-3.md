# BLACKOUT CASINO — ESTUDO COMPLETO DO PROJETO

## PARTE 3: Comparativo ChatGPT vs Claude, Plano de Etapas, Checklist Final

---

# 12. ANÁLISE COMPARATIVA: O QUE O CHATGPT DISSE vs ANÁLISE DO CLAUDE

O ChatGPT produziu 4 documentos ao longo da conversa. Abaixo, cada ponto que ele levantou é analisado criticamente.

## 12.1 Tabela Comparativa Geral

| Tópico | O que o ChatGPT disse | Análise do Claude | Concordância |
|--------|----------------------|-------------------|:------------:|
| **Tipo de interface** | "Não é site, é HUD de jogo" | ✅ Correto. É NUI FiveM, painel flutuante, não web | ✅ Concordo |
| **Modo de interação** | "Focus Mode, bloqueia movimentação" | ✅ Correto para cassino de ambiente físico | ✅ Concordo |
| **Scroll** | "PROIBIDO. Usar carrossel, paginação, transições" | ✅ Correto. HUD de GTA não usa scroll | ✅ Concordo |
| **Proporção interna** | "1600x900 (16:9)" | ✅ Boa referência, embora não precisa ser pixel-perfect — pode ser % equivalente | ✅ Concordo |
| **Ocupação da tela** | "78% largura × 72% altura" | ✅ Razoável. Margem ~11% de cada lado cria respiro. Pode ajustar em testes | ✅ Concordo |
| **5 camadas estruturais** | "Moldura, Header, Hero, Cards, Dock" | ✅ Correto. Mas são 6 camadas na verdade (faltou o overlay escuro + fundo bg-casino) | ⚠️ Incompleto |
| **Grid Header** | "15% da altura" | ⚠️ Na referência o header é mais compacto. Recomendo 10-12% | ⚠️ Discordo parcial |
| **Grid Hero** | "45% da altura" | ✅ OK, pode ser 45-48% com o espaço economizado do header | ✅ Concordo |
| **Grid Games** | "25%" | ✅ Correto | ✅ Concordo |
| **Grid Dock** | "15%" | ✅ Correto para acomodar o menu ornamentado | ✅ Concordo |
| **Hero split** | "40% texto / 60% asset 3D" | ✅ Correto. Asset deve dominar visualmente | ✅ Concordo |
| **Hierarquia de brilho** | "Jackpot > Asset 3D > Nome jogo > Botão > Cards > Dock" | ✅ Correto e bem definido | ✅ Concordo |
| **Cards** | "Pedestal, glow inferior, profundidade" | ⚠️ A ideia é boa mas os cards reais são imagens 500x500 com fundo preto, não com pedestal. Pedestal é para a Loja | ⚠️ Confusão |
| **Dock** | "Não é navbar, é barra de console" | ✅ Correto. É imagem ornamentada + texto por cima | ✅ Concordo |
| **Tipografia** | "Serifada forte para títulos, limpa para números" | ⚠️ Os títulos dos jogos são IMAGENS, não fontes CSS. A dica de fonte se aplica ao jackpot e saldo | ⚠️ Incompleto |
| **Profundidade** | "3 níveis: fundo, elementos médios, destaques" | ✅ Correto | ✅ Concordo |
| **Botão** | "Nunca flat, deve ter profundidade e glow" | ✅ Correto. E a solução é usar PNG, não CSS | ✅ Concordo |
| **Responsividade** | "NÃO é mobile-first. Proporção fixa" | ✅ Correto | ✅ Concordo |
| **V0 como ferramenta** | "Bom para esqueleto, ruim para refinamento AAA" | ✅ Correto. V0 gera estrutura, não arte visual | ✅ Concordo |
| **Erros de outras IAs** | "Criaram UI web, não HUD de jogo" | ✅ Correto. Faltou usar imagens como base, tentaram CSS puro | ✅ Concordo |
| **Imagens como solução** | Não mencionou explicitamente | ❌ FALHA PRINCIPAL: ChatGPT nunca disse claramente que a solução é usar PNGs como background + texto por cima | ❌ Omissão |

## 12.2 Análise Detalhada dos 4 Documentos do ChatGPT

### Documento 1 — Dissecação da imagem de referência

| O que disse | Avaliação |
|-------------|-----------|
| "5 níveis estruturais" | ✅ Boa dissecação visual |
| "Moldura cinematográfica com dupla linha dourada" | ✅ Correto, mas não explicou COMO fazer (resposta: CSS border + box-shadow + bg-casino.png) |
| "Header de Jackpot como HUD financeiro vivo" | ✅ Boa descrição. Letreiro PNG + valor HTML |
| "Hero dividido em 2 mundos" | ✅ Correto. 40/60 texto/asset |
| "Cards com pedestal luminoso" | ⚠️ Na referência não são pedestais — são cards com bordinha e glow inferior |
| "Dock inferior estilo console" | ✅ Correto. Menu PNG ornamentado |
| "IAs erram porque criam UI Web" | ✅ Diagnóstico correto |

### Documento 2 — Documento Técnico de UI/UX

| O que disse | Avaliação |
|-------------|-----------|
| Filosofia visual bem definida | ✅ Excelente |
| "Peso Visual Hierárquico" | ✅ Conceito fundamental e correto |
| Arquitetura de 6 camadas | ✅ Correto (overlay, moldura, header, hero, carrossel, dock) |
| Moldura deve ter "dupla borda, inner shadow, glow, textura" | ✅ Correto. bg-casino.png é essa textura |
| "Não usar scroll, usar carrossel ou paginação" | ✅ Correto |
| Tipografia: "serifada forte para títulos" | ⚠️ Títulos dos jogos são imagens, não fontes |
| "Proporção 1600x900" | ✅ Boa referência |
| Fluxo UX: "fade suave, jackpot pulsa, hero com brilho gradual" | ✅ Excelente UX |
| Erros a evitar: "blur, gradiente exagerado, glow em tudo" | ✅ Correto |

### Documento 3 — Proporção, Assets, Grid (NOTA: é idêntico ao Documento 4)

| O que disse | Avaliação |
|-------------|-----------|
| Proporção 1600x900, 78%×72% | ✅ Bom |
| Documentação dos assets | ⚠️ Incompleta — não abriu os ZIPs, generalizou |
| Não identificou que cards têm fundo preto | ❌ Omissão |
| Não identificou que imagens douradas são para o hero | ❌ Omissão |
| Não mencionou bg-casino.png | ❌ Faltou (BC ainda não tinha enviado) |
| Grid macro Header 15%, Hero 45%, Games 25%, Dock 15% | ⚠️ Header muito grande |
| Moldura: "elegante vs Las Vegas" | ✅ Boa pergunta estratégica |

### Documento 4 — Prompt para outras IAs + Estratégia V0

| O que disse | Avaliação |
|-------------|-----------|
| V0 é bom para esqueleto, não para refinamento | ✅ Correto |
| "Pedir só estrutura vazia ao V0" | ✅ Correto |
| Prompt construído com contexto, proporção, hierarquia | ✅ Útil mas descritivo demais |
| "Não jogar todas as imagens no prompt" | ✅ Correto |

## 12.3 Resumo: Pontos Fortes e Fracos do ChatGPT

### ✅ Pontos Fortes
1. Excelente diagnóstico do problema (UI web vs HUD de jogo)
2. Boa dissecação visual da imagem de referência
3. Conceito de "Peso Visual Hierárquico" muito útil
4. Boa definição de regras do que NÃO fazer
5. Fluxo UX bem pensado

### ❌ Pontos Fracos
1. **Repetitivo** — 4 documentos dizem basicamente a mesma coisa
2. **Documento 3 e 4 são idênticos** — parece bug ou repetição
3. **Nunca chegou na solução técnica real** — a técnica "PNG como background + texto HTML por cima" nunca foi explicitada
4. **Não analisou os assets de verdade** — generalizou sem abrir os ZIPs
5. **Não identificou que as imagens douradas são para o hero**
6. **Não identificou que os cards têm fundo preto (não transparente)**
7. **Ficou no loop de "vamos definir mais uma coisa antes de começar"** sem nunca entregar algo prático
8. **Header 15% está superestimado** — na referência é ~10-12%

---

# 13. PLANO DE IMPLEMENTAÇÃO PASSO A PASSO

Cada etapa é independente. Só avança para a próxima quando a anterior estiver validada e funcionando.

## Etapa 1 — CONTAINER FLUTUANTE + FUNDO

**Objetivo:** Criar o painel flutuante centralizado com o fundo bg-casino.png

**O que será feito:**
- Overlay escuro fullscreen (Camada 1)
- Container centralizado com proporção ~16:9
- Ocupação ~78% largura × ~72% altura
- `bg-casino.png` como background-image
- Bordas arredondadas (~20px)
- Borda dourada simples (CSS)

**Assets usados:**
- `bg-casino.png`

**Critério de sucesso:**
- [ ] Painel aparece centralizado na tela
- [ ] Fundo tem as partículas douradas visíveis
- [ ] Tem respiro lateral (não cola nas bordas)
- [ ] Borda dourada visível
- [ ] Parece um "objeto flutuante", não um site fullscreen

---

## Etapa 2 — MENU DOCK INFERIOR

**Objetivo:** Adicionar o menu dock na parte inferior do painel

**O que será feito:**
- Imagem MENU-MODELO1-SEM-TEXTO como background
- 5 divs posicionadas sobre as 5 seções
- Texto HTML em cada seção
- Highlight visual na aba ativa

**Assets usados:**
- `MENU-DOURADO-MODELO1-SEM-TEXTO.png`

**Critério de sucesso:**
- [ ] Menu aparece na parte inferior do painel
- [ ] Imagem ornamentada é visível (não CSS genérico)
- [ ] 5 textos estão posicionados corretamente sobre cada seção
- [ ] Clique troca aba ativa
- [ ] Não parece navbar de site

---

## Etapa 3 — HEADER (Logo + Letreiro + Saldo)

**Objetivo:** Montar a barra superior com os 3 elementos

**O que será feito:**
- Logo Blackout Casino (4:2) no canto esquerdo
- Letreiro jackpot (PNG) no centro com valor numérico por cima
- Saldo do jogador + bandeiras de idioma à direita

**Assets usados:**
- `1-GTARP CASINO LOGO 4-2.png`
- `GTARP CASINO LETREIRO PARA TOPO.png`

**Critério de sucesso:**
- [ ] Logo visível e proporcional no canto esquerdo
- [ ] Letreiro centralizado com valor do jackpot por cima
- [ ] Saldo visível à direita
- [ ] Bandeiras BR/US clicáveis
- [ ] Nada compete visualmente com o jackpot

---

## Etapa 4 — DIVISÕES INTERNAS

**Objetivo:** Criar separação visual entre Header, Hero, Carrossel e Dock

**O que será feito:**
- Linhas divisórias douradas sutis
- Áreas com proporções corretas (12% / 48% / 25% / 15%)
- Background sutil diferenciado por seção se necessário

**Assets usados:**
- Nenhum novo (CSS puro para divisórias)

**Critério de sucesso:**
- [ ] 4 seções claramente separadas visualmente
- [ ] Proporções respeitam o grid macro
- [ ] Linhas divisórias douradas são sutis (não grossas)

---

## Etapa 5 — HERO SECTION

**Objetivo:** Montar a área principal com logo do jogo + asset 3D + botão

**O que será feito:**
- Lado esquerdo (40%): logo do jogo (BR/IN) + subtítulo + botão JOGAR AGORA
- Lado direito (60%): imagem dourada grande (asset 3D)
- Carrossel automático rotando ~5 jogos em destaque

**Assets usados:**
- `LOGO-BR-*.png` / `LOGO-IN-*.png` (logos dos jogos)
- `BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png`
- `BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png`
- `IMAGEM-DOURADA-*.png` (imagens douradas grandes — quando disponíveis)

**Critério de sucesso:**
- [ ] Logo do jogo visível à esquerda
- [ ] Botão JOGAR AGORA funcional com estados ativo/hover/desativo
- [ ] Asset 3D dominante à direita (quando implementado)
- [ ] Carrossel troca jogos automaticamente a cada X segundos
- [ ] Idioma muda logos BR ↔ IN ao clicar bandeira

---

## Etapa 6 — CARROSSEL DE JOGOS (CARDS)

**Objetivo:** Mostrar os 22 jogos em cards navegáveis

**O que será feito:**
- Cards com imagens 500x500
- Nome do jogo abaixo de cada card
- Navegação horizontal (setas ou dots)
- ~5 cards visíveis por vez
- Glow verde sutil no hover

**Assets usados:**
- Todas as 22 imagens de `IMAGENS-DOURADAS-PARA-CARD.zip`

**Critério de sucesso:**
- [ ] Cards visíveis com imagens corretas
- [ ] Navegação horizontal funciona
- [ ] Nomes dos jogos visíveis
- [ ] Hover tem efeito visual
- [ ] Sem scroll vertical

---

## Etapa 7 — SISTEMA DE IDIOMAS + INTEGRAÇÕES

**Objetivo:** Finalizar sistema de idiomas e conectar tudo

**O que será feito:**
- State `lang: 'br' | 'in'` funcional
- Todas as imagens e textos trocam ao mudar idioma
- Conexão entre card clicado → abre jogo
- Troca de conteúdo ao mudar aba do dock

**Critério de sucesso:**
- [ ] Clicar bandeira troca TUDO para o idioma selecionado
- [ ] Clicar card abre a página do jogo correspondente
- [ ] Dock muda conteúdo ao trocar aba

---

# 14. CHECKLIST FINAL — VALIDAÇÃO DE TODAS AS INFORMAÇÕES

Este checklist verifica se NADA foi esquecido em relação ao que foi discutido com o ChatGPT e com o Claude.

## 14.1 Informações do ChatGPT — Checklist de Validação

| # | Informação do ChatGPT | Status | Observação |
|---|----------------------|:------:|------------|
| 1 | "Não é site, é HUD de jogo" | ✅ Documentado | Seção 1 da Parte 1 |
| 2 | "Focus Mode com cursor ativo" | ✅ Documentado | Seção 1.4 da Parte 1 |
| 3 | "Scroll proibido" | ✅ Documentado | Seção 1.4 e Regra 8 |
| 4 | "Proporção 1600x900 (16:9)" | ✅ Documentado | Seção 4.1 da Parte 1 |
| 5 | "Ocupação 78% × 72% da tela" | ✅ Documentado | Seção 4.1 da Parte 1 |
| 6 | "Overlay escuro 70-85% opacidade" | ✅ Documentado | Camada 1, Seção 3 |
| 7 | "Container central com bordas arredondadas" | ✅ Documentado | Camada 3, Seção 3 |
| 8 | "Dupla borda dourada com glow interno" | ✅ Documentado | Camada 3, Seção 3 |
| 9 | "Background com textura (não flat preto)" | ✅ Documentado | bg-casino.png, Seção 10.1 |
| 10 | "Header 15%" | ⚠️ Ajustado | Recomendamos 10-12% (Seção 4.1) |
| 11 | "Hero 45%" | ✅ Documentado | Seção 4.1 (45-48%) |
| 12 | "Games Row 25%" | ✅ Documentado | Seção 4.1 |
| 13 | "Dock 15%" | ✅ Documentado | Seção 4.1 |
| 14 | "Hero split 40% texto / 60% asset" | ✅ Documentado | Seção 4.3 |
| 15 | "Jackpot é maior peso visual" | ✅ Documentado | Seção 2.2 |
| 16 | "Asset 3D deve dominar sobre texto" | ✅ Documentado | Seção 4.3 |
| 17 | "Cards com pedestal e glow verde" | ⚠️ Corrigido | Cards usam imagens 500x500 com fundo preto (Seção 10.7). Pedestais são para Loja (Seção 10.9) |
| 18 | "Dock não é navbar, é barra de console" | ✅ Documentado | Menu PNG ornamentado (Seção 10.2) |
| 19 | "Tipografia serifada para títulos" | ⚠️ Corrigido | Títulos são IMAGENS PNG, não fontes (Seção 2.3) |
| 20 | "Nunca usar blur exagerado" | ✅ Documentado | Regra 8, Seção 8 |
| 21 | "Nunca glow em tudo" | ✅ Documentado | Seção 2.2 (hierarquia de brilho) |
| 22 | "Sem gradientes genéricos" | ✅ Documentado | Regra 8, Seção 8 |
| 23 | "Sem layout full screen" | ✅ Documentado | Regra 8, Seção 8 |
| 24 | "V0 para esqueleto, não para refinamento" | ✅ Documentado | Seção 12 |
| 25 | "Paleta: ouro, verde esmeralda, preto" | ✅ Documentado | Seção 2.1 |
| 26 | "Verde esmeralda #00E676" | ✅ Documentado | Seção 2.1 |
| 27 | "3 níveis de profundidade" | ✅ Documentado | Seção 3 (camadas) |
| 28 | "Sem aparência de dashboard SaaS" | ✅ Documentado | Seção 1.2 e Regra 8 |
| 29 | "Carrossel horizontal, não grid estático" | ✅ Documentado | Seção 4.4 |
| 30 | "Fluxo: fade → painel surge → jackpot pulsa" | ✅ Documentado | Seção 1.5 |
| 31 | "Moldura = monitor físico do cassino" | ✅ Documentado | Camada 3, Seção 3 |
| 32 | "Documentação dos assets por categoria" | ✅ Documentado | Parte 2 inteira (Seções 10.1 a 10.9) |
| 33 | "Logo nunca competir com jackpot" | ✅ Documentado | Seção 10.5 |
| 34 | "Botão: nunca flat, nunca cinza" | ✅ Documentado | Seção 10.3 |
| 35 | "Pedestal nunca sem sombra" | ✅ Documentado | Seção 10.9 |

## 14.2 Informações Adicionais do Claude (não mencionadas pelo ChatGPT)

| # | Informação do Claude | Status | Onde |
|---|---------------------|:------:|------|
| 1 | Técnica "PNG background + texto HTML por cima" | ✅ Documentado | Seção 7.2 |
| 2 | Cards têm fundo preto (RGB), não transparente | ✅ Documentado | Seção 10.7 |
| 3 | Imagens douradas grandes = assets do hero | ✅ Documentado | Seção 10.8 |
| 4 | bg-casino.png como Camada 2 do fundo | ✅ Documentado | Seção 10.1 |
| 5 | Sistema de idiomas com paths dinâmicos | ✅ Documentado | Seção 5 |
| 6 | 5 abas do dock e conteúdo de cada uma | ✅ Documentado | Seção 6 |
| 7 | Versão SEM-TEXTO dos assets para produção | ✅ Documentado | Seções 10.2, 10.3 |
| 8 | Bug nos nomes de arquivo (.png.png) | ✅ Documentado | Seção 10.6 |
| 9 | Total de 120 imagens em 10 ZIPs | ✅ Documentado | Seção 9.1 |
| 10 | Pedestais são para Loja (não para cards do cassino) | ✅ Documentado | Seção 10.9 |
| 11 | Hero terá carrossel automático de ~5 jogos | ✅ Documentado | Seção 4.3 |
| 12 | Header recomendado 10-12% (não 15%) | ✅ Documentado | Seção 4.1 |
| 13 | Plano de 7 etapas independentes | ✅ Documentado | Seção 13 |

## 14.3 Assets — Checklist de Completude

| # | Asset | Documentado | Onde usar | Dimensão | Transparência |
|---|-------|:-----------:|-----------|----------|:-------------:|
| 1 | bg-casino.png | ✅ | Fundo do painel | 1536×1024 | ❌ RGB |
| 2 | Menu Modelo 1 SEM-TEXTO | ✅ | Dock inferior | 1072×370 | ✅ RGBA |
| 3 | Menu Modelo 1 COM-TEXTO | ✅ | Referência visual | 1072×370 | ✅ RGBA |
| 4 | Menu Modelo 2 SEM-TEXTO | ✅ | Alternativa dock | 1072×370 | ✅ RGBA |
| 5 | Menu Modelo 2 COM-TEXTO | ✅ | Referência visual | 1072×370 | ✅ RGBA |
| 6 | Botão ATIVO SEM-TEXTO | ✅ | CTA normal/hover | 829×234 | ✅ RGBA |
| 7 | Botão ATIVO COM-TEXTO | ✅ | Referência visual | 829×234 | ✅ RGBA |
| 8 | Botão DESATIVO SEM-TEXTO | ✅ | CTA pressionado/disabled | 829×234 | ✅ RGBA |
| 9 | Botão DESATIVO COM-TEXTO | ✅ | Referência visual | 829×234 | ✅ RGBA |
| 10 | Letreiro Topo | ✅ | Header jackpot | 1148×298 | ✅ RGBA |
| 11 | Logo 4:2 (paisagem) | ✅ | Header esquerdo | 700×350 | ✅ RGBA |
| 12 | Logo 1:1 (v1) | ✅ | Splash/loading | 1063×1063 | ✅ RGBA |
| 13 | Logo 1:1 (v2) | ✅ | Alternativa | 1063×1063 | ✅ RGBA |
| 14 | Logo 1:1 (v3) | ✅ | Alternativa | 1063×1063 | ✅ RGBA |
| 15 | 20 Logos BR | ✅ | Hero (títulos PT) | 650×325 | ✅ RGBA |
| 16 | 20 Logos IN | ✅ | Hero (títulos EN) | 650×325 | ✅ RGBA |
| 17 | 22 Cards para carrossel | ✅ | Carrossel jogos | 500×500 | ⚠️ RGB |
| 18 | 20 Imagens douradas | ✅ | Hero (asset 3D) | ~1024×1024 | ✅ RGBA |
| 19 | 24 Itens com pedestal | ✅ | Aba Loja | Variável | ✅ RGBA |
| | **TOTAL: 120 imagens** | | | | |

## 14.4 Decisões de Design — Checklist

| # | Decisão | Definida? | Valor |
|---|---------|:---------:|-------|
| 1 | Tipo de interface | ✅ | HUD NUI FiveM (painel flutuante) |
| 2 | Modo de interação | ✅ | Focus Mode (bloqueia movimento) |
| 3 | Scroll | ✅ | PROIBIDO |
| 4 | Proporção | ✅ | 16:9 (~1600×900 referência) |
| 5 | Ocupação da tela | ✅ | ~78% × ~72% |
| 6 | Paleta principal | ✅ | Ouro + Verde esmeralda + Preto |
| 7 | Fundo do painel | ✅ | bg-casino.png (partículas douradas) |
| 8 | Moldura | ✅ | CSS bordas douradas + arredondamento |
| 9 | Menu dock | ✅ | Modelo 1 SEM-TEXTO + texto HTML |
| 10 | Botão principal | ✅ | PNG ativo/desativo + texto HTML |
| 11 | Letreiro jackpot | ✅ | PNG + valor numérico HTML |
| 12 | Logo do header | ✅ | Versão 4:2 (700×350) |
| 13 | Títulos dos jogos | ✅ | Logos BR/IN (imagens, não CSS) |
| 14 | Cards do carrossel | ✅ | Imagens 500×500 com fundo preto |
| 15 | Asset hero | ✅ | Imagens douradas grandes (futuro) |
| 16 | Sistema de idiomas | ✅ | State lang br/in, swap de imagens |
| 17 | Número de abas | ✅ | 5: Cassino, PVP, Loja, Eventos, Perfil |
| 18 | Hero automático | ✅ | Carrossel ~5 jogos em destaque |
| 19 | Hierarquia de brilho | ✅ | Jackpot > Asset > Logo > Botão > Cards > Dock |
| 20 | Grid macro | ✅ | 12% / 48% / 25% / 15% |

---

# 15. OBSERVAÇÕES FINAIS

## 15.1 Sobre Manutenção Futura

- Para **adicionar um novo jogo**: criar 1 card (500x500), 1 logo BR (650x325), 1 logo IN (650x325), 1 imagem dourada (~1024x1024). Adicionar nos arrays de dados.
- Para **mudar estilo do menu dock**: trocar a imagem PNG e ajustar posições dos textos.
- Para **mudar fundo**: trocar bg-casino.png por outra textura.
- Para **adicionar idioma**: criar pasta de logos no novo idioma + textos traduzidos.

## 15.2 Arquivos com Nome Problemático

Renomear antes de usar em produção:
- `5.ROULETTE.png.png` → `5.ROULETTE.png`
- `13.JACKPOT.png.png` → `13.JACKPOT.png`
- `5.LOGO-BR-ROULETTE.png.png` → `5.LOGO-BR-ROULETTE.png`
- `13.LOGO-BR-JACKPOT.png.png` → `13.LOGO-BR-JACKPOT.png`
- `5.LOGO-IN-ROULETTE.png.png` → `5.LOGO-IN-ROULETTE.png`
- `13.LOGO-IN-JACKPOT.png.png` → `13.LOGO-IN-JACKPOT.png`
- `5.IMAGEM-DOURADA-ROULETTE.png.png` → `5.IMAGEM-DOURADA-ROULETTE.png`
- `13.IMAGEM-DOURADA-JACKPOT.png.png` → `13.IMAGEM-DOURADA-JACKPOT.png`

## 15.3 Projeto Base Existente

BC possui um projeto anterior do Blackout Casino em React para web. Ele será a base para o desenvolvimento — **não será reescrito do zero**. As etapas de implementação serão aplicadas como modificações incrementais (cirúrgicas) sobre o projeto existente.

---

# FIM DO DOCUMENTO

**Este documento em 3 partes contém toda a informação necessária para:**
1. Entender completamente o projeto Blackout Casino NUI
2. Conhecer todos os 120 assets disponíveis e onde cada um será usado
3. Saber exatamente a arquitetura visual em camadas
4. Ter um plano de implementação em 7 etapas
5. Validar tudo que foi discutido anteriormente (ChatGPT + Claude)

**Para usar em uma nova conversa:** envie as 3 partes + a imagem de referência (Layout.png) + os ZIPs dos assets necessários para a etapa atual.
