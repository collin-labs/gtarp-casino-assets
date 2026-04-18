# CONVERSA 1 — V0 ESTUDO — MINES (#3)
# O projeto esta importado via GitHub

---

Voce vai criar o componente visual do jogo Mines (Campo Minado) para o Blackout Casino (GTA RP / FiveM). O projeto JA esta importado.

## ESTUDE ANTES DE GERAR

Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/3.MINES/2.GUIA-DO-JOGO-MINES.md` — Visao geral, mecanicas, momentos dopamina
- `student/estudo-dos-jogos/3.MINES/2.GUIA-DO-JOGO-MINES-PARTE-2-ADENDO.md` — Complemento
- `student/estudo-dos-jogos/3.MINES/8.BIBLIOTECA-IMAGENS-MINES-PARTE-1.md` — Inventario de assets

Navegue e confirme que existem:
- `public/assets/games/mines/` — gem.png (1024x1024) + bomb.png (1024x1024)
- `public/assets/shared/icons/` — 24 icones
- `public/assets/shared/ui/` — bg-casino.png

## REGRAS ABSOLUTAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — TODAS imagens existem
3. Dark mode #0A0A0A. Fontes: Cinzel/Inter/JetBrains Mono
4. clamp() em TUDO, touch targets 44px
5. Bilingue lang="br"|"en"
6. Export: export default function MinesGame({ onBack, lang, playerId, initialBalance })
7. Framer Motion para animacoes

## PATHS EXATOS

Game: /assets/games/mines/gem.png, /assets/games/mines/bomb.png
Logos: /assets/logos-br-para-cards/3.LOGO-BR-MINES.png, /assets/logos-in-para-cards/3.LOGO-IN-MINES.png
Icons: /assets/shared/icons/icon-gcoin.png, icon-provably-fair.png, icon-history.png, icon-random.png, icon-auto.png, icon-sound-on.png, icon-sound-off.png, icon-copy.png
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright gold, #00E676 green, #EB4B4B vermelho bomba, #FF1744 vermelho vibrante, #0A0A0A fundo

## FUNDO PADRAO
```javascript
style={{
  backgroundColor: "#0A0A0A",
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
  backgroundSize: "cover, 100% 100%",
  boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)"
}}
```

## 6 TELAS
1. IDLE — Grid 5x5 dim, painel lateral com aposta + seletor de minas
2. PLAYING — Grid ativo, tiles clicaveis, multiplicador crescente, cashout
3. WIN — Cash out, revelacao do grid, overlay verde
4. BUST — Bomba revelada, grid completo mostrado, overlay vermelho
5. PROVABLY FAIR — Modal com seeds, hash, verificacao
6. HISTORICO — Modal com ultimas rodadas

## RETORNE AGORA
NAO gere codigo. Confirme que leu os docs, que os assets existem, e que entendeu as regras.
