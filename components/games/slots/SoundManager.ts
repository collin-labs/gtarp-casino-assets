// ═══════════════════════════════════════════════════════════════
// SOUND MANAGER — Web Audio API para Slots
// Singleton: preload todos os sons, play por nome
// Resume automático no primeiro click (requisito browser 2026)
// ═══════════════════════════════════════════════════════════════

const SOUND_BASE = "/assets/sounds/slots/";

const SOUND_LIST = [
  "spin_start", "reel_stop", "win_small", "win_medium",
  "win_big", "win_mega", "jackpot_hit", "tumble_drop",
  "tumble_explode", "multiplier_up", "free_spins_trigger",
  "bonus_buy_confirm", "hold_spin_trigger", "diamond_reveal",
  "button_click", "autoplay_start",
] as const;

export type SoundName = typeof SOUND_LIST[number];

class SoundManager {
  private ctx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private volume: number = 0.7;
  private muted: boolean = false;
  private initialized: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  // Deve ser chamado após primeira interação do usuário
  async init() {
    if (this.initialized) return;
    const ctx = this.getContext();

    // Resume se suspenso (requisito browser)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Preload todos os sons em paralelo
    const promises = SOUND_LIST.map(async (name) => {
      try {
        const url = `${SOUND_BASE}${name}.mp3`;
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`[SLOTS Sound] Não encontrado: ${name}.mp3`);
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch (err) {
        console.warn(`[SLOTS Sound] Erro ao carregar ${name}:`, err);
      }
    });

    await Promise.allSettled(promises);
    this.initialized = true;
    console.log(`[SLOTS Sound] ${this.buffers.size}/${SOUND_LIST.length} sons carregados`);
  }

  play(name: SoundName, options?: { volume?: number; playbackRate?: number }) {
    if (this.muted || !this.initialized) return;

    const ctx = this.getContext();
    const buffer = this.buffers.get(name);
    if (!buffer) return;

    // Criar source novo (single-use, padrão Web Audio API)
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    if (options?.playbackRate) {
      source.playbackRate.value = options.playbackRate;
    }

    // Gain node para controle de volume
    const gain = ctx.createGain();
    gain.gain.value = (options?.volume ?? 1) * this.volume;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

// Singleton exportado
export const soundManager = new SoundManager();
