# CONVERSA 1 — V0 ESTUDO — CASE BATTLE (#11)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Case Battle para o Blackout Casino (FiveM). Jogadores abrem caixas simultaneamente em batalhas PvP (1v1 ate 4v4), quem tira itens de maior valor total vence. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/11.CASE-BATTLE/2.GUIA-DO-JOGO-CASE-BATTLE-1.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/2.GUIA-DO-JOGO-CASE-BATTLE-2.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/8.BIBLIOTECA-DE-IMAGENS-CASE-BATTLE-PARTE-1.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/8.BIBLIOTECA-DE-IMAGENS-CASE-BATTLE-PARTE-2.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/8.BIBLIOTECA-DE-IMAGENS-CASE-BATTLE-PARTE-3.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/8.BIBLIOTECA-DE-IMAGENS-CASE-BATTLE-PARTE-4.md`

Navegue e confirme que existem:
- `public/assets/games/cases/caixas/` — 18 PNGs (6 caixas × 3 estados)
- `public/assets/games/cases/backgrounds/` — 7 backgrounds
- `public/assets/games/cases/itens/arsenal/` — 8 itens
- `public/assets/games/cases/itens/garagem/` — 8 itens
- `public/assets/shared/icons/` + `public/assets/shared/ui/`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — usar PNGs reais das caixas e itens
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function CaseBattleGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion

## 6 CAIXAS (paths em /assets/games/cases/caixas/)
1-Caixa-Arsenal-Dourado (FECHADA/SEMI-ABERTA/ABERTA)
2-Caixa-Garagem-VIP (FECHADA/SEMI-ABERTA/ABERTA)
3-Caixa-Pacote-Urbano (FECHADA/SEMI-ABERTA/ABERTA)
4-Caixa-Cofre-Secreto (FECHADA/SEMI-ABERTA/ABERTA)
5-Caixa-Noturna (FECHADA/SEMI-ABERTA/ABERTA)
6-Caixa-Diaria (FECHADA/SEMI-ABERTA/ABERTA)

## BACKGROUNDS (/assets/games/cases/backgrounds/)
case-bg-arsenal.png, case-bg-garagem.png, case-bg-pacote.png, case-bg-cofre.png, case-bg-noturna.png, case-bg-diaria.png, cases-bg.png (geral)

## CORES RARIDADE
Common #B0BEC5 | Uncommon #4FC3F7 | Rare #7C4DFF | Epic #FF4081 | Legendary #FFD700

## 6 TELAS
1. LOBBY — Lista batalhas abertas, filtros, botao CRIAR BATALHA
2. CRIAR BATALHA — Selecionar caixa, modo (1v1/2v2/3v3/4v4), rounds, valor entrada
3. SALA ESPERA — Players conectados, countdown, chat mini
4. BATALHA — Caixas abrindo simultaneamente lado a lado, carousel de itens
5. RESULTADO — Vencedor declarado, valor total comparado, itens ganhos
6. PROVABLY FAIR — Seeds + hash + verificar

NAO gere codigo. Confirme que leu, assets existem, entendeu regras.
