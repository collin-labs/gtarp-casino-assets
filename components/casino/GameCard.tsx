"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Game } from "@/lib/games";

// ============================================================
// TODOS os valores configuráveis estão em globals.css :root
// Procure por "CONFIGURADOR DE CARDS" no globals.css
// Muda lá → hot reload instantâneo
// ============================================================

interface GameCardProps {
  game: Game;
  isBR: boolean;
  onClick?: () => void;
  feixoColor?: "green" | "gold";
  showLogo?: boolean;
  largeCard?: boolean;
}

export default function GameCard({ game, isBR, onClick, feixoColor = "green", showLogo = true, largeCard = false }: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = useCallback(() => {
    setHovered(true);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setMousePos({ x: 50, y: 50 });
    const vid = videoRef.current;
    if (vid) vid.pause();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const logoSrc = isBR ? game.logoBR : game.logoIN;
  const pre = largeCard ? "--card-lg" : "--card-sm";

  const feixoIsGold = feixoColor === "gold";
  const feixoGrad = feixoIsGold
    ? "linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.3) 20%, #D4A843 50%, rgba(212,168,67,0.3) 80%, transparent 95%)"
    : "linear-gradient(90deg, transparent 5%, rgba(0,230,118,0.3) 20%, #00E676 50%, rgba(0,230,118,0.3) 80%, transparent 95%)";
  const feixoShadowIdle = feixoIsGold
    ? "0 0 8px rgba(212,168,67,0.3), 0 0 15px rgba(212,168,67,0.15)"
    : "0 0 8px rgba(0,230,118,0.3), 0 0 15px rgba(0,230,118,0.15)";
  const feixoShadowHover = feixoIsGold
    ? "0 0 15px rgba(212,168,67,0.5), 0 0 30px rgba(212,168,67,0.25), 0 -3px 12px rgba(212,168,67,0.15)"
    : "0 0 15px rgba(0,230,118,0.6), 0 0 30px rgba(0,230,118,0.3), 0 -3px 12px rgba(0,230,118,0.2)";

  const shadowIdle = `drop-shadow(0 2px 5px rgba(0,0,0,1)) drop-shadow(0 5px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 20px rgba(0,0,0,0.8))`;
  const shadowHover = `drop-shadow(0 2px 5px rgba(0,0,0,1)) drop-shadow(0 5px 16px rgba(0,0,0,1)) drop-shadow(0 0 24px rgba(0,0,0,0.9)) drop-shadow(0 0 6px rgba(255,215,0,0.15))`;

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={isBR ? game.labelBR : game.labelEN}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative overflow-hidden cursor-pointer"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "14px",
        border: hovered
          ? "2px solid rgba(212,168,67,0.7)"
          : "2px solid rgba(212,168,67,0.3)",
        background: "rgba(5,5,5,0.95)",
        boxShadow: hovered
          ? "0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,215,0,0.15), inset 0 0 20px rgba(0,0,0,0.5)"
          : "0 4px 15px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,215,0,0.08), inset 0 0 15px rgba(0,0,0,0.4)",
        transition: "border 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* SWAP: imagem dourada por baixo */}
      <img
        src={game.goldUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          borderRadius: "12px",
          zIndex: 0,
          filter: "drop-shadow(0 0 15px rgba(212,168,67,0.4))",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          background: "radial-gradient(ellipse at center, rgba(212,168,67,0.12) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity var(--card-swap-speed) ease",
          zIndex: 0,
          animation: hovered ? "logoAuraPulse 2.5s ease-in-out infinite" : "none",
        }}
      />

      {/* Imagem principal do card */}
      <img
        src={game.cardUrl}
        alt={isBR ? game.labelBR : game.labelEN}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: hovered ? "brightness(1.15) saturate(1.1)" : "brightness(0.85)",
          transition: "filter 0.4s ease, opacity var(--card-swap-speed) ease",
          borderRadius: "12px",
          zIndex: 1,
          opacity: hovered ? "var(--card-swap-image-opacity)" as any : 1,
        }}
      />

      {/* Video hover — toca ao passar o mouse */}
      {game.hoverVideo && (
        <video
          ref={videoRef}
          src={game.hoverVideo}
          muted
          loop
          playsInline
          preload="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "12px",
            zIndex: 1,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Gradiente escurecimento topo */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "55%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          borderRadius: "12px 12px 0 0",
          zIndex: 2,
        }}
      />

      {/* Gradiente escurecimento base */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "55%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          borderRadius: "0 0 12px 12px",
          zIndex: 2,
        }}
      />

      {/* Feixo de luz */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "3px",
          background: feixoGrad,
          boxShadow: hovered ? feixoShadowHover : feixoShadowIdle,
          borderRadius: "0 0 12px 12px",
          zIndex: 7,
          transition: "box-shadow 0.3s ease",
        }}
      />

      {/* Linha dourada superior */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 10%, rgba(212,168,67,0.3) 30%, rgba(255,215,0,0.5) 50%, rgba(212,168,67,0.3) 70%, transparent 90%)",
          zIndex: 7,
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mouse-tracking spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          borderRadius: "12px",
          background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(0,230,118,0.2), rgba(255,215,0,0.06) 40%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Shine sweep continuo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.06) 45%, rgba(255,215,0,0.12) 50%, rgba(255,215,0,0.06) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "panelCardShine 3s ease infinite",
          zIndex: 5,
        }}
      />

      {/* Logo bilingue — tamanho/posicao via CSS vars */}
      {showLogo && (
        <>
          <div
            className={`absolute top-0 left-0 right-0 pointer-events-none ${largeCard ? "card-overlay-lg" : "card-overlay-sm"}`}
            style={{
              borderRadius: "12px 12px 0 0",
              zIndex: 5,
            }}
          />
          <img
            src={logoSrc}
            alt=""
            loading="lazy"
            style={{
              position: "absolute",
              top: `var(${pre}-logo-top)`,
              left: "50%",
              transform: hovered
                ? `translateX(-50%) translateY(var(${pre}-logo-offset-y)) scale(0.92)`
                : `translateX(-50%) translateY(var(${pre}-logo-offset-y))`,
              width: `var(${pre}-logo-width)`,
              filter: `${hovered ? shadowHover : shadowIdle} brightness(var(${pre}-logo-brightness)) contrast(var(${pre}-logo-contrast))`,
              pointerEvents: "none",
              zIndex: 6,
              opacity: hovered
                ? (`calc(var(${pre}-logo-opacity-hover) * (1 - var(--card-swap-logo-hide)))` as any)
                : (`var(${pre}-logo-opacity)` as any),
              transition: "opacity 0.4s ease, filter 0.3s ease, transform 0.4s ease",
            }}
          />
        </>
      )}

      {/* Pulse dourado — luz que respira sobre o card */}
      <div
        className="absolute inset-0 pointer-events-none card-pulse"
        style={{
          borderRadius: "12px",
          background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,67,0.1) 0%, rgba(255,215,0,0.04) 40%, transparent 70%)",
          zIndex: 3,
          ["--pulse-delay" as any]: `${(game.id % 5) * 0.6}s`,
        }}
      />

      {/* Brilho interno emboss */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          boxShadow: "inset 0 1px 0 rgba(255,215,0,0.12), inset 0 -1px 0 rgba(0,230,118,0.1), inset 1px 0 0 rgba(255,215,0,0.05), inset -1px 0 0 rgba(255,215,0,0.05)",
          zIndex: 8,
        }}
      />
    </motion.div>
  );
}
