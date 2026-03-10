"use client";

/*
 * ClassicReel — Animação de reel via requestAnimationFrame
 * 
 * PESQUISA REGRA 0: A abordagem anterior (CSS transition + onTransitionEnd)
 * causava saltos visuais porque onTransitionEnd tem race conditions com
 * React state updates. A solução comprovada (CodePen antibland/ypagZd,
 * MrFirthy/oGVWqK) usa animação imperativa com rAF/setInterval.
 * 
 * Esta implementação usa requestAnimationFrame com easing manual:
 * 1. Monta a strip (atuais + extras + target)
 * 2. Anima offsetY via rAF com desaceleração quadrática
 * 3. Quando atinge o target, para — sem trocar a strip, sem resetar offset
 * 4. Só depois de parado, limpa a strip pra só os 3 finais
 */

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import SymbolIcon from "./symbols/SymbolIcon";

interface ClassicReelProps {
  symbols: string[];
  colIndex: number;
  winPaylines: number[];
}

const ALL_SYMBOLS = ["cereja","limao","sino","estrela","bar_triplo","777","diamante"];
const CELL = "clamp(60px, 6.5vw, 85px)";

// Tamanho real da célula em pixels (precisa medir no DOM)
function getCellPx() {
  // clamp(60px, 6.5vw, 85px) — estimar baseado em viewport típico
  // Em produção o valor exato depende do viewport
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const computed = vw * 0.065;
  return Math.max(60, Math.min(85, computed));
}

const ClassicReel = forwardRef<
  { spin: (target: string[], cb: () => void) => void },
  ClassicReelProps
>(function ClassicReel({ symbols, colIndex, winPaylines }, ref) {
  const [visibleSymbols, setVisibleSymbols] = useState<string[]>(symbols);
  const [spinning, setSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<string[]>(symbols);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Renderizar via ref direta no DOM — bypass React pra animação suave
  function setOffset(val: number) {
    offsetRef.current = val;
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${val}px)`;
    }
  }

  useImperativeHandle(ref, () => ({
    spin(target: string[], onDone: () => void) {
      const cellPx = getCellPx() + 2; // +2 gap
      const extraCount = 20 + colIndex * 5; // reels param -> 20, 25, 30

      // Montar strip: atuais no topo, extras aleatórios, target no final
      const extra = Array.from({ length: extraCount }, (_, i) =>
        ALL_SYMBOLS[(colIndex * 7 + i * 3 + Math.floor(Math.random() * 3)) % ALL_SYMBOLS.length]
      );
      const fullStrip = [...visibleSymbols, ...extra, ...target];
      stripRef.current = fullStrip;

      // Forçar re-render pra montar a strip completa no DOM
      setVisibleSymbols(fullStrip);
      setOffset(0);
      setSpinning(true);

      // Destino: mover pra mostrar os últimos 3 da strip
      const targetOffset = -(fullStrip.length - 3) * cellPx;
      const duration = 2000 + colIndex * 700; // 2s, 2.7s, 3.4s por reel

      // Iniciar animação no próximo frame (após React render)
      requestAnimationFrame(() => {
        const startTime = performance.now();
        const startOffset = 0;

        function animate(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing: ease-out quadrático (desacelera no final)
          const eased = 1 - Math.pow(1 - progress, 3);

          const currentOffset = startOffset + (targetOffset - startOffset) * eased;
          setOffset(currentOffset);

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            // Animação concluída — garantir offset exato
            setOffset(targetOffset);

            // Agora sim, atualizar o estado React pra só os 3 targets
            // Como o offset visual já está no lugar certo, a troca é invisível
            setTimeout(() => {
              stripRef.current = target;
              setVisibleSymbols(target);
              setOffset(0);
              setSpinning(false);
              onDone();
            }, 50); // 50ms delay pra garantir que o último frame pintou
          }
        }

        rafRef.current = requestAnimationFrame(animate);
      });
    }
  }));

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const centerWin = winPaylines.includes(1);

  return (
    <div style={{
      width: CELL, height: `calc(${CELL} * 3 + 4px)`,
      overflow: "hidden", borderRadius: "4px",
      background: "#F5F5F0", border: "1px solid rgba(212,168,67,0.4)",
    }}>
      <div
        ref={containerRef}
        style={{
          display: "flex", flexDirection: "column", gap: "2px",
          // Sem CSS transition — tudo controlado por rAF
          willChange: "transform",
        }}
      >
        {visibleSymbols.map((sym, i) => {
          const isResult = !spinning && visibleSymbols.length === 3;
          const isCenterRow = isResult && i === 1;
          const hasWinGlow = isCenterRow && centerWin;
          return (
            <div key={i} style={{
              width: CELL, height: CELL,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hasWinGlow ? "rgba(255,215,0,0.12)" : "transparent",
              borderRadius: "4px", position: "relative", flexShrink: 0,
              boxShadow: hasWinGlow ? "inset 0 0 12px rgba(255,215,0,0.3)" : "none",
            }}>
              <SymbolIcon name={sym} size={`calc(${CELL} * 0.75)`} />
              {hasWinGlow && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "4px",
                  border: "2px solid #FFD700",
                  boxShadow: "0 0 8px rgba(255,215,0,0.5)",
                  pointerEvents: "none",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ClassicReel;
