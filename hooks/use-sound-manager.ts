"use client";

import { useCallback, useRef } from "react";

/**
 * FASE 8 -- useSoundManager: Sons UI via Web Audio API
 * Zero dependencias externas. Sons gerados proceduralmente.
 * Uso: const sound = useSoundManager(); sound.play("click");
 * 
 * Sons disponiveis: click, tab, hover, success, error
 */

type SoundName = "click" | "tab" | "hover" | "success" | "error";

export function useSoundManager() {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);

  // Lazy init do AudioContext (requer interacao do usuario)
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Gerar som procedural (sem arquivos .mp3)
  const playTone = useCallback(
    (freq: number, durMs: number, volume: number, type: OscillatorType = "sine") => {
      if (mutedRef.current) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durMs / 1000);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + durMs / 1000);
      } catch {
        // Silence AudioContext errors
      }
    },
    [getCtx]
  );

  const play = useCallback(
    (name: SoundName) => {
      switch (name) {
        case "click":
          // Click suave premium
          playTone(800, 60, 0.08, "sine");
          break;
        case "tab":
          // Troca de aba - whoosh sutil
          playTone(400, 80, 0.06, "sine");
          setTimeout(() => playTone(600, 60, 0.04, "sine"), 30);
          break;
        case "hover":
          // Hover - toque ultra sutil
          playTone(1200, 30, 0.03, "sine");
          break;
        case "success":
          // Win - tons ascendentes
          playTone(523, 100, 0.08, "sine");
          setTimeout(() => playTone(659, 100, 0.08, "sine"), 80);
          setTimeout(() => playTone(784, 150, 0.06, "sine"), 160);
          break;
        case "error":
          // Erro - tom baixo breve
          playTone(220, 120, 0.08, "square");
          break;
      }
    },
    [playTone]
  );

  const mute = useCallback(() => { mutedRef.current = true; }, []);
  const unmute = useCallback(() => { mutedRef.current = false; }, []);
  const toggleMute = useCallback(() => { mutedRef.current = !mutedRef.current; }, []);
  const isMuted = useCallback(() => mutedRef.current, []);

  return { play, mute, unmute, toggleMute, isMuted };
}
