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
      className="relative rounded-[10px] overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "1 / 1",
        border: hovered
          ? "2px solid rgba(255,215,0,0.6)"
          : "1.5px solid rgba(212,168,67,0.25)",
        background: "rgba(5,5,5,0.85)",
        boxShadow: hovered
          ? "0 0 25px rgba(0,230,118,0.3), 0 0 50px rgba(212,168,67,0.15), 0 12px 30px rgba(0,0,0,0.6)"
          : "0 2px 10px rgba(0,0,0,0.4)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Card image */}
      <div className="absolute inset-0">
        <img
          src={game.cardUrl}
          alt={isBR ? game.labelBR : game.labelEN}
          className="w-full h-full object-cover"
          style={{
            filter: hovered ? "brightness(1.15) saturate(1.1)" : "brightness(0.85)",
            transition: "filter 0.3s",
            borderRadius: "9px",
          }}
        />
      </div>

      {/* Gradient escuro no topo */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "45%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          borderRadius: "9px 9px 0 0",
          zIndex: 2,
        }}
      />

      {/* Gradient escuro no fundo */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "30%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          borderRadius: "0 0 9px 9px",
          zIndex: 2,
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
          {/* Top neon line */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 10%, #00E676 50%, transparent 90%)",
              boxShadow: "0 0 10px rgba(0,230,118,0.5)",
              zIndex: 6,
              animation: "shimmer 2s ease infinite",
            }}
          />
          {/* Bottom neon line */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 10%, #FFD700 50%, transparent 90%)",
              boxShadow: "0 0 10px rgba(255,215,0,0.4)",
              zIndex: 6,
            }}
          />
        </>
      )}

      {/* Game name */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(6px, 1vw, 14px) 4px",
          fontSize: "clamp(7px, 0.85vw, 12px)",
          fontFamily: "var(--font-cinzel)",
          fontWeight: 900,
          color: hovered ? "#FFD700" : "#D4A843",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          textAlign: "center",
          transition: "all 0.3s",
          textShadow: hovered
            ? "0 0 12px rgba(255,215,0,0.7), 0 2px 4px rgba(0,0,0,0.9)"
            : "0 0 6px rgba(212,168,67,0.4), 0 2px 4px rgba(0,0,0,0.8)",
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

      {/* Tier badge cyber */}
      {hovered && game.tier === "S" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            width: "clamp(16px, 1.5vw, 22px)",
            height: "clamp(16px, 1.5vw, 22px)",
            borderRadius: "4px",
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.9), rgba(212,168,67,0.9))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(7px, 0.7vw, 10px)",
            fontWeight: 900,
            color: "#0a0a0a",
            fontFamily: "var(--font-mono)",
            boxShadow: "0 0 8px rgba(255,215,0,0.5)",
            zIndex: 6,
          }}
        >
          S
        </motion.div>
      )}
    </motion.div>
  );
}
