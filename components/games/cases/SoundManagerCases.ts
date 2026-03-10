"use client";

import { useCallback, useRef } from "react";

// Sons procedurais para Cases (mesmo padrao do useSoundManager global)
// Zero dependencias, Web Audio API nativo

type CaseSound = "case_open" | "reveal_spin" | "reveal_stop" | "rarity_common" | "rarity_uncommon" | "rarity_rare" | "rarity_epic" | "rarity_legendary" | "sell_item" | "keep_item" | "button_click";

export function useCasesSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, vol: number, type: OscillatorType = "sine") => {
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + dur / 1000);
      } catch { /* silence */ }
    },
    [getCtx]
  );

  const play = useCallback(
    (name: CaseSound) => {
      switch (name) {
        case "case_open":
          // Dramatic opening -- ascending tones
          tone(300, 100, 0.06, "sine");
          setTimeout(() => tone(450, 100, 0.06, "sine"), 80);
          setTimeout(() => tone(600, 150, 0.05, "sine"), 160);
          break;
        case "reveal_spin":
          // Tick during spin -- rapid clicks
          tone(1000, 20, 0.03, "square");
          break;
        case "reveal_stop":
          // Stop -- impact
          tone(200, 150, 0.08, "sine");
          setTimeout(() => tone(400, 100, 0.06, "sine"), 100);
          break;
        case "rarity_common":
          tone(500, 80, 0.04, "sine");
          break;
        case "rarity_uncommon":
          tone(600, 100, 0.05, "sine");
          setTimeout(() => tone(700, 80, 0.04, "sine"), 60);
          break;
        case "rarity_rare":
          tone(500, 100, 0.06, "sine");
          setTimeout(() => tone(700, 100, 0.06, "sine"), 80);
          setTimeout(() => tone(900, 120, 0.05, "sine"), 160);
          break;
        case "rarity_epic":
          tone(400, 120, 0.07, "sine");
          setTimeout(() => tone(600, 120, 0.07, "sine"), 80);
          setTimeout(() => tone(800, 120, 0.06, "sine"), 160);
          setTimeout(() => tone(1000, 150, 0.05, "sine"), 240);
          break;
        case "rarity_legendary":
          // Fanfare -- 5 ascending tones
          tone(523, 100, 0.08, "sine");
          setTimeout(() => tone(659, 100, 0.08, "sine"), 80);
          setTimeout(() => tone(784, 100, 0.07, "sine"), 160);
          setTimeout(() => tone(1047, 150, 0.07, "sine"), 240);
          setTimeout(() => tone(1319, 200, 0.06, "sine"), 340);
          break;
        case "sell_item":
          // Coin sound -- high ping
          tone(1200, 60, 0.06, "sine");
          setTimeout(() => tone(1600, 80, 0.04, "sine"), 50);
          break;
        case "keep_item":
          // Confirm -- two tones
          tone(600, 80, 0.05, "sine");
          setTimeout(() => tone(800, 100, 0.05, "sine"), 60);
          break;
        case "button_click":
          tone(800, 50, 0.04, "sine");
          break;
      }
    },
    [tone]
  );

  return { play };
}
