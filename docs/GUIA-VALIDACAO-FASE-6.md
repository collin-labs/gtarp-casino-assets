# GUIA DE VALIDAÇÃO — SLOTS FASE 6

## Polish (Sons, BigWinOverlay, Animations)
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**Válida? SIM.** Web Audio API em 2026: AudioBufferSourceNode é single-use (criar novo a cada play, buffer é reutilizável). Ponto crítico descoberto: browsers suspendem AudioContext até interação do usuário — nosso SoundManager inclui `resume()` no `init()`. Sem pesquisa, o áudio não tocaria no primeiro spin.

---

## ARQUIVOS ENTREGUES (3 novos)

| Arquivo | Linhas | Função |
|---------|:------:|--------|
| `SoundManager.ts` | 95 | Singleton Web Audio API, preload 16 sons, play por nome |
| `BigWinOverlay.tsx` | 175 | Overlay BIG/MEGA/EPIC com confetti Canvas 2D |
| `animations.css` | 50 | 9 keyframes globais do Slots |
| **Total** | **~320** | **3 arquivos** |

---

## SoundManager.ts — COMO USAR

```tsx
// No SlotsGame.tsx ou componente pai, no primeiro click:
import { soundManager } from "./SoundManager";

// Inicializar após primeiro click do usuário
const handleFirstInteraction = async () => {
  await soundManager.init(); // preload + resume AudioContext
};

// Tocar som em qualquer componente:
soundManager.play("spin_start");
soundManager.play("reel_stop", { playbackRate: 1.1 }); // pitch mais alto
soundManager.play("win_big", { volume: 0.9 });
soundManager.toggleMute(); // mute/unmute
soundManager.setVolume(0.5); // 50%
```

## 16 SONS ESPERADOS (gerar com IA)

| Arquivo | Prompt para IA de Áudio |
|---------|------------------------|
| spin_start.mp3 | "Mechanical slot machine lever pull with metal click" |
| reel_stop.mp3 | "Single slot machine reel stopping with heavy thunk" |
| win_small.mp3 | "Casino coin drop, 3-4 coins falling on metal tray" |
| win_medium.mp3 | "Cascade of casino coins falling, celebratory chime" |
| win_big.mp3 | "Epic casino jackpot fanfare, brass crescendo" |
| win_mega.mp3 | "Massive casino win explosion, golden coins raining" |
| jackpot_hit.mp3 | "Grand jackpot siren, alarm bells, crowd cheering" |
| tumble_drop.mp3 | "Gemstones falling on glass surface, crystalline" |
| tumble_explode.mp3 | "Magic crystal explosion, sparkle burst" |
| multiplier_up.mp3 | "Power-up whoosh ascending pitch" |
| free_spins_trigger.mp3 | "Magical portal opening, mystical chimes" |
| bonus_buy_confirm.mp3 | "Premium purchase confirmation, golden bell" |
| hold_spin_trigger.mp3 | "Lock mechanism engaging, suspenseful tone" |
| diamond_reveal.mp3 | "Treasure chest opening, value reveal" |
| button_click.mp3 | "Soft premium UI click, tactile feedback" |
| autoplay_start.mp3 | "Smooth mechanical engagement" |

**Caminho:** `public/assets/sounds/slots/` (16 arquivos MP3, <500KB cada)

---

## BigWinOverlay — 3 TIERS

| Tier | Trigger | Texto | Particles | Shake | Gradient |
|------|:-------:|-------|:---------:|:-----:|:--------:|
| BIG | win ≥ 10x | "BIG WIN" | 40 confetti | ❌ | ❌ |
| MEGA | win ≥ 25x | "MEGA WIN" | 60 confetti | ✅ 200ms | ❌ |
| EPIC | win ≥ 50x | "EPIC WIN" | 80 confetti | ✅ 400ms | ✅ ouro→laranja |

Auto-fecha 4s ou tap.

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA 5)

| Elemento | Feedback | Status |
|----------|----------|:------:|
| BigWin texto | Spring bounce + glow/gradient | ✅ |
| BigWin contador | 2s ease out animado | ✅ |
| BigWin confetti | Canvas 2D, partículas caindo | ✅ |
| BigWin shake | CSS keyframes (mega/epic) | ✅ |
| BigWin flash | Opacity flash dourado (mega/epic) | ✅ |
| BigWin fechar | Tap + auto 4s | ✅ |
| SoundManager init | Console log de sons carregados | ✅ |
| Sons fallback | Warn se MP3 não encontrado | ✅ |

---

## PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM para componentes.** SoundManager funcional com preload e fallback. BigWinOverlay com 3 tiers de celebração. Animations.css com 9 keyframes. Para funcionar completamente, os 16 arquivos MP3 precisam ser gerados e colocados em `public/assets/sounds/slots/`.

**Próxima fase:** Fase 7 — Auto Play + Turbo + Histórico + Paytable
