"use client";

import { useState, useRef } from "react";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
  isBR: boolean;
}

export default function GameCard({ game, isBR }: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative rounded-[10px] overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "1 / 1",
        border: hovered
          ? "2px solid rgba(255,215,0,0.5)"
          : "1.5px solid rgba(212,168,67,0.3)",
        background: "rgba(5,5,5,0.8)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 0 20px rgba(0,230,118,0.3), 0 0 40px rgba(212,168,67,0.15), 0 10px 25px rgba(0,0,0,0.5)"
          : "0 2px 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* Card image — preenche o card inteiro */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: "0" }}
      >
        <img
          src={game.cardUrl}
          alt={isBR ? game.labelBR : game.labelEN}
          className="w-full h-full object-cover transition-[filter] duration-300"
          style={{
            filter: hovered ? "brightness(1.1)" : "brightness(0.9)",
            borderRadius: "9px",
          }}
        />
      </div>

      {/* Gradient escuro no topo para legibilidade do título */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          borderRadius: "9px 9px 0 0",
          zIndex: 2,
        }}
      />

      {/* Mouse-tracking spotlight glow (premium 2026 effect) */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: `radial-gradient(circle 150px at ${mousePos.x}% ${mousePos.y}%, rgba(0,230,118,0.25), rgba(255,215,0,0.08) 40%, transparent 70%)`,
            transition: "background 0.05s ease",
          }}
        />
      )}

      {/* Game name — centralizado no topo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(8px, 1.2vw, 16px) 0",
          fontSize: "clamp(9px, 1.1vw, 15px)",
          fontFamily: "var(--font-cinzel)",
          fontWeight: 900,
          color: hovered ? "#FFD700" : "#D4A843",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
          transition: "all 0.3s",
          textShadow: hovered
            ? "0 0 12px rgba(255,215,0,0.7), 0 2px 4px rgba(0,0,0,0.9)"
            : "0 0 6px rgba(212,168,67,0.4), 0 2px 4px rgba(0,0,0,0.8)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {isBR ? game.labelBR : game.labelEN}
      </div>

      {/* Glow verde inferior no hover */}
      {hovered && (
        <div
          className="absolute bottom-0 left-[10%] right-[10%] h-[3px]"
          style={{
            background: "linear-gradient(90deg, transparent, #00E676, transparent)",
            boxShadow: "0 0 10px rgba(0,230,118,0.4)",
          }}
        />
      )}

      {/* Shimmer sweep */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none animate-shimmer"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.08) 45%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
        />
      )}
    </div>
  );
}
