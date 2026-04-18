# CONVERSA 1 — V0 ESTUDO DO PROJETO — SLOT MACHINE (#2)
# Copiar INTEIRO e colar no V0 como primeira mensagem
# O projeto JA esta importado via GitHub

---

Voce vai criar o componente visual do jogo Slot Machine para o Blackout Casino (GTA RP / FiveM). O projeto JA esta importado via GitHub.

## ANTES DE QUALQUER CODIGO — ESTUDE O PROJETO

Leia INTEIRO este arquivo do projeto:
- `student/estudo-dos-jogos/2.SLOT-MACHINE/2.GUIA-DO-JOGO-SLOT-MACHINE.md`

Navegue e confirme que estas pastas EXISTEM:
- `public/assets/games/slots/symbols/` — 11 simbolos video slot
- `public/assets/games/slots/classic/` — 7 simbolos classic slot
- `public/assets/games/slots/overlays/` — 3 overlays de vitoria
- `public/assets/sounds/slots/` — 16 sons
- `public/assets/shared/icons/` — 24 icones
- `public/assets/shared/ui/` — bg-casino.png, botoes, badges

## REGRAS ABSOLUTAS
1. NUNCA Tailwind — APENAS CSS inline style={{}} (camelCase)
2. NUNCA invente paths de imagem — use os listados abaixo
3. NUNCA placeholder — TODAS imagens JA existem
4. Dark mode APENAS (#0A0A0A)
5. Fontes: Cinzel (titulos), Inter (corpo), JetBrains Mono (numeros)
6. clamp() em TUDO, touch targets 44px
7. Bilingue: lang="br"|"en", textos via { br: "...", en: "..." }
8. Export: export default function SlotsGame({ onBack, lang, playerId, initialBalance })
9. Framer Motion, AnimatePresence mode="popLayout" no tumble

## PATHS EXATOS

Simbolos Video (/assets/games/slots/symbols/):
crown.png, ring.png, hourglass.png, chalice.png (HIGH)
ruby.png, sapphire.png, emerald.png, amethyst.png, topaz.png (LOW)
scatter.png, multiplier_orb.png (SPECIAL)

Simbolos Classic (/assets/games/slots/classic/):
seven.png, bar.png, cherry.png, diamond.png, bell.png, lemon.png, star.png

Overlays (/assets/games/slots/overlays/):
win_big.png, win_mega.png, win_jackpot.png

UI (/assets/shared/ui/): bg-casino.png, btn-jogar-ativo.png, btn-jogar-desativo.png
Icons (/assets/shared/icons/): icon-gcoin.png, icon-provably-fair.png, icon-history.png, icon-paytable.png, icon-turbo.png, icon-auto.png, icon-sound-on.png, icon-sound-off.png, icon-copy.png
Logos: /assets/logos-br-para-cards/2.LOGO-BR-SLOT-MACHINE.png, /assets/logos-in-para-cards/2.LOGO-IN-SLOT-MACHINE.png

TOTAL: 34 imagens. TODAS EXISTEM. ZERO placeholders.

## FUNDO PADRAO (todas as telas)
```javascript
style={{
  backgroundColor: "#0A0A0A",
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
  backgroundSize: "cover, 100% 100%",
  boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)"
}}
```

## CORES: #D4A843 gold, #FFD700 bright gold, #00E676 green, #FF4444 red, #0A0A0A fundo, #1A1A2E fundo secundario

## 10 TELAS (em conversas separadas)
1. MODE SELECT  2. VIDEO SLOT IDLE  3. SPINNING+TUMBLING  4. FS TRIGGER
5. FS PLAYING  6. WIN OVERLAY  7. CLASSIC SLOT  8. PAYTABLE  9. HISTORY  10. BUY BONUS

## RETORNE AGORA
NAO gere codigo. Confirme: leu o Guia? Pastas existem? Zero Tailwind? Paths exatos? Zero placeholder?
