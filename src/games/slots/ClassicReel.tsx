"use client";
import { useState, useEffect, useRef } from "react";
import SymbolIcon from "./symbols/SymbolIcon";

// CLASSIC REEL - Reel individual com animacao translateY
const POOL = ["blank","limao","blank","cereja","limao","estrela","blank","limao","cereja","sino","blank","estrela","limao","cereja","blank","bar_triplo","estrela","limao","blank","cereja","sino","limao","estrela","blank","cereja","limao","777","blank","estrela","cereja","limao","sino","blank","cereja","limao","estrela","blank","bar_triplo","cereja","limao","blank","sino","estrela","cereja","limao","blank","bar_triplo","estrela","diamante","blank","limao","cereja","sino","blank","777","limao","estrela","blank","bar_triplo","sino","diamante","blank","limao","777"];

interface ClassicReelProps {
  reelIndex: number;
  finalSymbols: string[];
  spinning: boolean;
  heldPositions?: number[];
  cellSize: number;
  stopDelay: number;
  onStop?: () => void;
}

export default function ClassicReel({ reelIndex, finalSymbols, spinning, heldPositions = [], cellSize, stopDelay, onStop }: ClassicReelProps) {
  const [phase, setPhase] = useState<"idle"|"spin"|"stop">("idle");
  const [strip, setStrip] = useState<string[]>(finalSymbols);
  const [ty, setTy] = useState(0);
  const tRef = useRef<ReturnType<typeof setTimeout>>();
  const cntRef = useRef(0);

  useEffect(() => {
    if (spinning && phase === "idle") {
      cntRef.current++;
      const extra: string[] = [];
      for (let i = 0; i < 18; i++) extra.push(POOL[(reelIndex*7+i*3+cntRef.current)%POOL.length]);
      const full = [...extra, ...finalSymbols];
      setStrip(full);
      setPhase("spin");
      setTy(0);
      tRef.current = setTimeout(() => {
        setPhase("stop");
        setTy(-(full.length - 3) * cellSize);
      }, 300 + stopDelay);
    }
    if (!spinning && phase !== "idle") {
      setPhase("idle");
      setStrip(finalSymbols);
      setTy(0);
    }
    return () => { if (tRef.current) clearTimeout(tRef.current); };
  }, [spinning, phase, finalSymbols, reelIndex, cellSize, stopDelay]);

  const dur = phase === "stop" ? `${1.2 + reelIndex * 0.4}s` : "0s";
  const isSpin = phase === "spin" || phase === "stop";

  return (
    <div style={{ width: cellSize, height: cellSize * 3, overflow: "hidden", borderRadius: 4, background: "#F5F5F0", border: "1px solid rgba(212,168,67,0.4)", position: "relative" }}>
      <div style={{
        display: "flex", flexDirection: "column",
        transform: `translateY(${ty}px)`,
        transition: phase === "stop" ? `transform ${dur} cubic-bezier(0.16,1,0.3,1)` : "none",
      }} onTransitionEnd={() => { if (phase === "stop") { setPhase("idle"); setStrip(finalSymbols); setTy(0); onStop?.(); } }}>
        {(isSpin ? strip : finalSymbols).map((sym, i) => {
          const held = !isSpin && heldPositions.includes(i);
          return (
            <div key={`${reelIndex}-${i}-${sym}`} style={{ width: cellSize, height: cellSize, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
              <SymbolIcon symbol={sym} size={Math.floor(cellSize * 0.8)} glow={held} />
              {held && <div style={{ position: "absolute", inset: 0, border: "2px solid #FFD700", borderRadius: 4, boxShadow: "0 0 12px rgba(255,215,0,0.5), inset 0 0 8px rgba(255,215,0,0.15)", pointerEvents: "none" }} />}
            </div>
          );
        })}
      </div>
      {isSpin && phase === "spin" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(245,245,240,0.6) 0%, transparent 30%, transparent 70%, rgba(245,245,240,0.6) 100%)", pointerEvents: "none", zIndex: 2 }} />}
    </div>
  );
}
