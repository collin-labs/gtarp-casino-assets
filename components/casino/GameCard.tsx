"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
  isBR: boolean;
  onClick?: () => void;
}

export default function GameCard({ game, isBR, onClick }: GameCardProps) {
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
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative overflow-hidden cursor-pointer"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "14px",
        /* Borda dupla alto relevo — dourada */
        border: hovered
          ? "2px solid rgba(212,168,67,0.7)"
          : "2px solid rgba(212,168,67,0.3)",
        outline: hovered
          ? "1px solid rgba(0,230,118,0.4)"
          : "1px solid rgba(212,168,67,0.1)",
        outlineOffset: "2px",
        background: "rgba(5,5,5,0.95)",
        /* Alto relevo: sombra 3D profunda + glow verde por baixo */
        boxShadow: hovered
          ? "0 0 25px rgba(0,230,118,0.2), 0 12px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.15), inset 0 0 20px rgba(0,0,0,0.5), 0 -2px 15px rgba(0,230,118,0.15)"
          : "0 4px 15px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,0,0.08), inset 0 0 15px rgba(0,0,0,0.4), 0 -1px 8px rgba(0,230,118,0.08)",
        transition: "border 0.3s, box-shadow 0.3s, outline 0.3s",
      }}
    >
      {/* Card image */}
      <img
        src={game.cardUrl}
        alt={isBR ? game.labelBR : game.labelEN}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: hovered ? "brightness(1.15) saturate(1.1)" : "brightness(0.85)",
          transition: "filter 0.3s",
          borderRadius: "12px",
        }}
      />

      {/* Gradient escuro no topo */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "45%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          borderRadius: "12px 12px 0 0",
          zIndex: 2,
        }}
      />

      {/* Gradient escuro no fundo */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "35%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          borderRadius: "0 0 12px 12px",
          zIndex: 2,
        }}
      />

      {/* Feixo de luz VERDE permanente na borda inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,230,118,0.3) 20%, #00E676 50%, rgba(0,230,118,0.3) 80%, transparent 95%)",
          boxShadow: hovered
            ? "0 0 15px rgba(0,230,118,0.6), 0 0 30px rgba(0,230,118,0.3), 0 -3px 12px rgba(0,230,118,0.2)"
            : "0 0 8px rgba(0,230,118,0.3), 0 0 15px rgba(0,230,118,0.15)",
          borderRadius: "0 0 12px 12px",
          zIndex: 7,
          transition: "box-shadow 0.3s",
        }}
      />

      {/* Linha dourada superior sutil */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 10%, rgba(212,168,67,0.3) 30%, rgba(255,215,0,0.5) 50%, rgba(212,168,67,0.3) 70%, transparent 90%)",
          zIndex: 7,
        }}
      />

      {/* Mouse-tracking spotlight glow */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(0,230,118,0.2), rgba(255,215,0,0.06) 40%, transparent 70%)`,
          }}
        />
      )}

      {/* Borda neon cyber animada no hover */}
      {hovered && (
        <>
          {/* Top neon line intensificada */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 10%, #FFD700 50%, transparent 90%)",
              boxShadow: "0 0 12px rgba(255,215,0,0.5), 0 2px 8px rgba(255,215,0,0.2)",
              zIndex: 8,
              animation: "shimmer 2s ease infinite",
            }}
          />
          {/* Bottom neon line intensificada (soma ao feixo verde permanente) */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "3px",
              background:
                "linear-gradient(90deg, transparent 5%, #00E676 50%, transparent 95%)",
              boxShadow: "0 0 20px rgba(0,230,118,0.7), 0 -5px 15px rgba(0,230,118,0.3)",
              zIndex: 8,
            }}
          />
        </>
      )}

      {/* Game name — fundo escuro para legibilidade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(6px, 0.8vw, 12px) 8px",
          fontSize: "clamp(8px, 1vw, 15px)",
          fontFamily: "var(--font-cinzel)",
          fontWeight: 900,
          color: hovered ? "#FFD700" : "#D4A843",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
          transition: "all 0.3s",
          textShadow: hovered
            ? "0 0 12px rgba(255,215,0,0.7), 0 2px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.9)"
            : "0 0 6px rgba(212,168,67,0.4), 0 2px 6px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.9)",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)",
          zIndex: 5,
          pointerEvents: "none",
          lineHeight: 1.2,
        }}
      >
        {isBR ? game.labelBR : game.labelEN}
      </div>

      {/* Shimmer sweep */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none animate-shimmer"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.06) 45%, rgba(255,215,0,0.12) 50%, rgba(255,215,0,0.06) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            zIndex: 5,
          }}
        />
      )}

      {/* Brilho interno na borda — efeito emboss/alto relevo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          boxShadow: "inset 0 1px 0 rgba(255,215,0,0.12), inset 0 -1px 0 rgba(0,230,118,0.1), inset 1px 0 0 rgba(255,215,0,0.05), inset -1px 0 0 rgba(255,215,0,0.05)",
          zIndex: 6,
        }}
      />
    </motion.div>
  );
}
