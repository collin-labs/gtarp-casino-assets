"use client";

import { useCallback } from "react";

/**
 * FASE 8 -- useRipple: Hook reutilizavel para efeito ripple dourado
 * Uso: const ripple = useRipple(); onClick={(e) => { ripple(e); }}
 * Requer: parent com position:relative e overflow:hidden
 */

interface RippleOptions {
  color?: string;
  duration?: number;
}

export function useRipple(options?: RippleOptions) {
  const {
    color = "rgba(212,168,67,0.35)",
    duration = 500,
  } = options || {};

  const trigger = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const diameter = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        left: ${x - diameter / 2}px;
        top: ${y - diameter / 2}px;
        width: ${diameter}px;
        height: ${diameter}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color} 0%, transparent 70%);
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
        z-index: 999;
        animation: casino-ripple ${duration}ms ease-out forwards;
      `;
      el.appendChild(ripple);

      // Limpar após animação
      setTimeout(() => {
        if (ripple.parentNode === el) {
          el.removeChild(ripple);
        }
      }, duration + 50);
    },
    [color, duration]
  );

  return trigger;
}
