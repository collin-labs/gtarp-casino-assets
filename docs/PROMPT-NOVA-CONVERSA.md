# 🎯 PROMPT PARA NOVA CONVERSA — BLACKOUT CASINO

**Copiar tudo abaixo e colar como primeira mensagem na nova conversa, JUNTO com os arquivos anexados.**

---

## O QUE ANEXAR JUNTO COM ESTE PROMPT

```
OBRIGATÓRIO:
1. PADRAO-DE-ESTUDO-INDIVIDUAL-BLACKOUT-CASINO.md  ← Manual de metodologia
2. ADENDO-O-QUE-NAO-FAZER.md                       ← Checklist de erros a evitar
3. BLACKOUT-CASINO-ROTEIRO-DESENVOLVIMENTO.md       ← Roteiro de 11 fases do PAINEL
4. GTA-CASINO-FLUTUANTE-01_03-16_31.zip             ← Projeto React base do painel

OPCIONAL (se for trabalhar nas imagens/assets):
5. ZIPs de assets (FUNDO-PARA-PAINEL, MENU-DOCK, etc.)

OPCIONAL (se for fazer estudo de um jogo específico):
6. ESTUDO-INDIVIDUAL.zip                            ← Exemplos de estudos (Instagram/WhatsApp)
```

---

## PROMPT (copiar daqui até o final do documento)

```
Estou desenvolvendo o BLACKOUT CASINO — um cassino premium para GTA RP (FiveM) com 22 jogos integrados em um painel NUI flutuante. O visual é nível Las Vegas AAA: ouro metálico, verde esmeralda, preto profundo, partículas douradas, animações GSAP, Canvas 2D.

═══════════════════════════════════════
CONTEXTO DO PROJETO (leia com atenção)
═══════════════════════════════════════

STACK DO PROJETO EXISTENTE:
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + Zustand 5
- Embla Carousel (hero + cards)
- NUI hooks (fetchNui / useNuiEvent) para comunicação FiveM
- Build: output 'export' para HTML estático (FiveM NUI)
- 22 jogos registrados em games.ts

COMPONENTES JÁ IMPLEMENTADOS NO PAINEL:
- Panel.tsx: Container principal com overlay + dupla borda dourada + bg-casino.png
- Header.tsx: Logo texto + jackpot com letreiro PNG + saldo + bandeiras emoji
- Dock.tsx: 5 abas (Início, Jogos, Loja, Inventário, Ajuda) com ícones Lucide
- HeroCarousel.tsx: Embla carousel com 6 slides, autoplay, logos PNG, botão play
- GameCard.tsx: Cards com 3D tilt, glow follow mouse, shimmer sweep
- GoldParticles.tsx: 50 partículas Canvas2D flutuando
- CornerAccents.tsx: 4 cantos L-shaped verdes
- ScanLine.tsx: Linha HUD horizontal percorrendo
- i18n completo PT-BR/EN em translations.ts
- 20+ animações em animations.css
- Zustand stores: Navigation, Player, Settings

PROBLEMAS CONHECIDOS DO PAINEL:
- public/assets/ está vazio (imagens foram removidas, precisam ser recolocadas)
- Logo é texto CSS, não imagem PNG
- Bandeiras são emoji, não imagens estilizadas
- Dock usa ícones Lucide genéricos ao invés da imagem ornamentada
- ContentArea tem scroll vertical (precisa remover — overflow-hidden)
- Next.js precisa virar build estático (output: 'export')

ASSETS DISPONÍVEIS (120 assets em 10 ZIPs):
- bg-casino.png (1536×1024) — fundo do painel
- MENU-MODELO1-SEM-TEXTO.png (1072×370) — dock ornamentado
- btn-play-active/disabled.png (829×234) — botão jogar
- header-bar.png (1148×298) — letreiro topo
- logo-landscape.png (700×350) — logo principal
- logos BR/IN por jogo (650×325 cada)
- 22 cards de jogos (500×500 cada)
- imagens douradas (~1024×1024 cada)
- itens pedestal para loja

═══════════════════════════════════════
ONDE ESTAMOS AGORA
═══════════════════════════════════════

PAINEL DO CASSINO:
- Existe um ROTEIRO DE DESENVOLVIMENTO com 11 fases (arquivo anexo)
- FASE 0 a FASE 11, cada fase só avança com meu feedback
- Ainda não começamos NENHUMA fase — o roteiro está pronto mas não executado
- Próximo passo do painel: FASE 0 (setup dos assets nos caminhos corretos)

22 JOGOS:
- Os jogos NÃO existem ainda — serão criados do zero
- Existe um PADRÃO DE ESTUDO INDIVIDUAL (arquivo anexo) que define a metodologia
- Para cada jogo, criaremos 4 documentos (GUIA, MEGA ESTUDO, PROMPT AI, ROTEIRO)
- Nenhum estudo individual foi feito ainda
- Ordem sugerida: Crash → Mines → Blackjack → Plinko → Slots → Bicho → Roleta → ...

═══════════════════════════════════════
DOCUMENTOS ANEXOS (leia TODOS antes de agir)
═══════════════════════════════════════

1. PADRAO-DE-ESTUDO-INDIVIDUAL-BLACKOUT-CASINO.md
   → Define a metodologia: 4 arquivos por jogo, templates, pesquisa obrigatória,
     checklist de qualidade, adaptações de apps para jogos, seção "dois pontos"
     (FiveM vs Web em todas as tabelas de viabilidade)

2. ADENDO-O-QUE-NAO-FAZER.md
   → Checklist de erros: não fazer busca genérica, não cobrir 22 jogos de uma vez,
     não escrever descrições genéricas, não usar pseudocódigo no roteiro, etc.

3. BLACKOUT-CASINO-ROTEIRO-DESENVOLVIMENTO.md
   → 11 fases do painel NUI (moldura, dock, header, divisórias, carrossel,
     hero, idiomas, partículas, imagens douradas, build FiveM, loading screens)

4. Projeto React (ZIP)
   → Código fonte atual do painel com todos os componentes

═══════════════════════════════════════
REGRAS PARA ESTA CONVERSA
═══════════════════════════════════════

1. SEMPRE ler os documentos anexos ANTES de qualquer ação
2. NUNCA fazer nada sem eu pedir — perguntar antes
3. NUNCA reescrever arquivos completos — str_replace cirúrgico
4. NUNCA entregar documentos em .docx — SEMPRE Markdown (.md)
5. Eu uso PowerShell, não bash/cmd — adaptar comandos
6. Quando eu pedir estudo de um jogo, seguir o PADRÃO DE ESTUDO com pesquisa real
7. Cada feature precisa de DOIS PONTOS: FiveM NUI e Web React
8. Se eu enviar imagens/assets, analisar dimensões e propor posicionamento
9. ZIP sempre na pasta raiz do projeto ao entregar
10. Cada fase/etapa só avança com meu feedback explícito

═══════════════════════════════════════
O QUE EU VOU PEDIR AGORA
═══════════════════════════════════════

{AQUI VOCÊ ESCREVE O QUE QUER FAZER NA NOVA CONVERSA}

Exemplos:
- "Vamos começar a FASE 0 do painel (setup dos assets)"
- "Vamos fazer o estudo individual do CRASH"
- "Quero revisar o roteiro do painel antes de começar"
- "Enviei os assets, analise e posicione no projeto"
```
