# CONVERSA 1 — V0 ESTUDO — DAILY-FREE (#19)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Daily-Free (Roda da Fortuna diaria gratuita) para o Blackout Casino (FiveM). Roda girando com premios GCoin + calendario de streak 30 dias. Projeto importado.

## ESTUDE ANTES DE GERAR
- `student/estudo-dos-jogos/19.DAILY-FREE/2.GUIA-DO-JOGO-DAILY-FREE-PARTE-1.md`
- `student/estudo-dos-jogos/19.DAILY-FREE/2.GUIA-DO-JOGO-DAILY-FREE-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/19.DAILY-FREE/8.BIBLIOTECA-IMAGENS-DAILY-FREE-PARTE-1.md`
- `student/estudo-dos-jogos/19.DAILY-FREE/8.BIBLIOTECA-IMAGENS-DAILY-FREE-PARTE-2.md`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
3. clamp(), touch 44px, bilingue lang="br"|"en"
4. Export: export default function DailyFreeGame({ onBack, lang, playerId, initialBalance })
5. Framer Motion. Roda via CSS rotate OU Canvas 2D.

## PATHS
Premios roda: /assets/daily-free/prizes/ (coin-small, coin-medium, coin-stack, gem-green, treasure)
Icons: /assets/daily-free/icons/ (wheel-pointer, info, provably-fair, history, sound-on/off, copy, verify, trophy, flame, lock)
Badges: /assets/daily-free/badges/ (badge-streak-7, badge-streak-14, badge-streak-30)
Icons shared: gcoin + demais de /assets/shared/icons/
UI: /assets/shared/ui/bg-casino.png

## CORES
#D4A843 gold, #FFD700 bright, #00E676 green (streak), #FF4444 red (quebrou), #0A0A0A fundo

## 7 TELAS
1. IDLE — Roda parada + calendario + botao GIRAR
2. SPINNING — Roda girando com desaceleracao dramatica
3. CLAIMED — Ja girou hoje (countdown pro proximo)
4. RESULTADO — Overlay com premio
5. MILESTONE — Badge 7/14/30 dias desbloqueado
6. PROVABLY FAIR — Modal
7. HISTORICO — Modal

NAO gere codigo. Confirme que leu, entendeu a roda + streak.
