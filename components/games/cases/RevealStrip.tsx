"use client";

import { useEffect, useRef, useState } from "react";
import RarityBadge from "./components/RarityBadge";

interface RevealItem {
  id: number;
  name: string;
  rarity: string;
  rarity_color: string;
  value: number;
  image_url?: string | null;
}

interface RevealStripProps {
  items: RevealItem[];
  targetIndex: number;
  onRevealComplete: () => void;
  fastMode?: boolean;
}

const ITEM_WIDTH = 120;
const VISIBLE_ITEMS = 50;

// Montar strip com itens repetidos conforme probabilidade
function buildStrip(items: RevealItem[], targetIdx: number): RevealItem[] {
  const strip: RevealItem[] = [];
  // Preencher strip com itens aleatorios
  for (let i = 0; i < VISIBLE_ITEMS - 1; i++) {
    const rand = items[Math.floor(Math.random() * items.length)];
    strip.push(rand);
  }
  // Colocar item-alvo na posicao correta (centro da area visivel final)
  const targetPos = VISIBLE_ITEMS - 5;
  strip.splice(targetPos, 0, items[targetIdx] || items[0]);
  return strip;
}

export default function RevealStrip({ items, targetIndex, onRevealComplete, fastMode }: RevealStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [strip] = useState(() => buildStrip(items, targetIndex));

  // Posicao final: item-alvo no centro do container
  const targetPos = VISIBLE_ITEMS - 5;
  const finalOffset = -(targetPos * ITEM_WIDTH) + (ITEM_WIDTH * 2); // centralizar

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("spinning");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "spinning") return;
    const duration = fastMode ? 600 : 4500;
    const timer = setTimeout(() => {
      setPhase("done");
      onRevealComplete();
    }, duration + 200);
    return () => clearTimeout(timer);
  }, [phase, fastMode, onRevealComplete]);

  const spinDuration = fastMode ? 0.6 : 4.5;
  const currentOffset = phase === "idle" ? 0 : finalOffset;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(100px, 12vw, 140px)",
      overflow: "hidden",
      borderRadius: "10px",
      background: "#0A0A0A",
      border: "1px solid rgba(212,168,67,0.3)",
    }}>
      {/* Indicador central fixo */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "3px",
        background: "linear-gradient(180deg, transparent, #FFD700, transparent)",
        boxShadow: "0 0 12px rgba(255,215,0,0.6), 0 0 24px rgba(255,215,0,0.3)",
        zIndex: 10,
        pointerEvents: "none",
      }} />

      {/* Triangulo indicador topo */}
      <div style={{
        position: "absolute",
        top: "-2px", left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: "10px solid #FFD700",
        filter: "drop-shadow(0 0 6px rgba(255,215,0,0.5))",
        zIndex: 10,
      }} />

      {/* Strip de itens */}
      <div
        ref={stripRef}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          transform: `translateX(${currentOffset}px)`,
          transition: phase === "spinning"
            ? `transform ${spinDuration}s cubic-bezier(0.15, 0.85, 0.35, 1.0)`
            : "none",
          willChange: "transform",
        }}
      >
        {strip.map((item, i) => {
          const isTarget = i === targetPos && phase === "done";
          return (
            <div
              key={`${item.id}-${i}`}
              style={{
                flexShrink: 0,
                width: `${ITEM_WIDTH}px`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                background: isTarget
                  ? `radial-gradient(circle, ${item.rarity_color}22 0%, transparent 70%)`
                  : "transparent",
                transition: "background 0.3s",
                padding: "4px",
              }}
            >
              {/* Item icon — PNG se disponível */}
              <div style={{
                filter: isTarget ? `drop-shadow(0 0 12px ${item.rarity_color})` : "none",
                transition: "filter 0.5s",
                width: "clamp(32px, 3.5vw, 48px)",
                height: "clamp(32px, 3.5vw, 48px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "contain",
                      opacity: isTarget ? 1 : 0.7,
                      transition: "opacity 0.5s",
                    }}
                  />
                ) : (
                  <svg viewBox="0 0 40 40" fill="none" style={{ width: "100%", height: "100%" }}>
                    {item.rarity === "legendary" ? (
                      <polygon points="20,2 25,15 39,15 28,24 32,38 20,30 8,38 12,24 1,15 15,15"
                        fill={item.rarity_color} opacity={isTarget ? "1" : "0.6"} />
                    ) : item.rarity === "rare" ? (
                      <circle cx="20" cy="20" r="14"
                        fill={`${item.rarity_color}55`} stroke={item.rarity_color} strokeWidth="2" />
                    ) : (
                      <rect x="8" y="8" width="24" height="24" rx="4"
                        fill={`${item.rarity_color}33`} stroke={item.rarity_color} strokeWidth="1.5" />
                    )}
                  </svg>
                )}
              </div>

              {/* Item name */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(7px, 0.7vw, 9px)",
                color: isTarget ? "#FFFFFF" : "#888",
                textAlign: "center",
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                padding: "0 2px",
              }}>
                {item.name}
              </div>

              {/* Rarity bar */}
              <div style={{
                width: "80%",
                height: "3px",
                borderRadius: "2px",
                background: item.rarity_color,
                opacity: isTarget ? 1 : 0.4,
                boxShadow: isTarget ? `0 0 8px ${item.rarity_color}` : "none",
                transition: "opacity 0.5s, box-shadow 0.5s",
              }} />
            </div>
          );
        })}
      </div>

      {/* Blur de velocidade nas laterais */}
      {phase === "spinning" && (
        <>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: "15%",
            background: "linear-gradient(90deg, #0A0A0A, transparent)",
            pointerEvents: "none", zIndex: 5,
          }} />
          <div style={{
            position: "absolute", top: 0, bottom: 0, right: 0, width: "15%",
            background: "linear-gradient(-90deg, #0A0A0A, transparent)",
            pointerEvents: "none", zIndex: 5,
          }} />
        </>
      )}
    </div>
  );
}
