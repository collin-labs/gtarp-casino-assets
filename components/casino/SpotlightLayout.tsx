"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game } from "@/lib/games";
import GameCard from "./GameCard";

/* =====================================================
   SpotlightLayout — EVENTOS tab
   3 GameCards com spotlight no clicado
   Logo no topo de todos, efeitos premium no ativo
   ===================================================== */

interface SpotlightLayoutProps {
  games: Game[];
  isBR: boolean;
  onGameSelect: (game: Game) => void;
}

export default function SpotlightLayout({
  games,
  isBR,
  onGameSelect,
}: SpotlightLayoutProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const items = games.slice(0, 3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "clamp(16px, 2.5vw, 40px)",
        padding: "clamp(12px, 2vw, 28px)",
        boxSizing: "border-box",
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      {/* Keyframes */}
      <style>{`
        @keyframes spotlightBreathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        @keyframes floatParticle {
          0% { opacity: 0; transform: translateY(8px) scale(0.4); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-35px) scale(0.15); }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
      `}</style>

      {items.map((game, idx) => {
        const isActive = idx === activeIdx;

        const logoSrc = isBR ? game.logoBR : game.logoIN;

        return (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: 0.1 + idx * 0.12, type: "spring", stiffness: 350, damping: 25 }}
            style={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
              position: "relative",
              filter: "brightness(1)",
              opacity: 1,
              transition: "filter 0.5s ease, opacity 0.5s ease",
              zIndex: isActive ? 2 : 1,
              cursor: "pointer",
            }}
            onClick={() => {
              if (isActive) {
                onGameSelect(game);
              } else {
                setActiveIdx(idx);
              }
            }}
          >
            {/* GameCard base */}
            <div style={{ width: "100%", height: "100%" }}>
              <GameCard
                game={game}
                isBR={isBR}
                showLogo={false}
              />
            </div>

            {/* OVERLAY — esconde label do GameCard no topo */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.6) 75%, transparent 100%)",
                borderRadius: "14px 14px 0 0",
                pointerEvents: "none",
                zIndex: 5,
              }}
            />

            {/* LOGO no topo — presente em TODOS os cards */}
            <div
              style={{
                position: "absolute",
                top: "clamp(10px, 2.5vh, 28px)",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 6,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
              }}
            >
              {/* Glow dourado atrás da logo — só no ativo */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "clamp(160px, 28vw, 400px)",
                  height: "clamp(80px, 16vh, 160px)",
                  background: "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.25) 0%, rgba(255,215,0,0.08) 40%, transparent 70%)",
                  filter: "blur(14px)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  pointerEvents: "none",
                }}
              />

              <img
                src={logoSrc}
                alt={isBR ? game.labelBR : game.labelEN}
                draggable={false}
                style={{
                  width: "clamp(130px, 24vw, 360px)",
                  height: "auto",
                  maxHeight: "clamp(60px, 15vh, 140px)",
                  objectFit: "contain",
                  filter: isActive
                    ? "drop-shadow(0 0 20px rgba(255,215,0,0.6)) drop-shadow(0 4px 14px rgba(0,0,0,0.9))"
                    : "drop-shadow(0 0 12px rgba(255,215,0,0.4)) drop-shadow(0 3px 10px rgba(0,0,0,0.8))",
                  opacity: 1,
                  transition: "filter 0.6s ease, opacity 0.6s ease",
                }}
              />
            </div>

            {/* === EFEITOS EM TODOS OS CARDS === */}

            {/* SHIMMER sweep — todos */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 4,
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "35%",
                  height: "200%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.06) 40%, rgba(255,255,255,0.08) 50%, rgba(255,215,0,0.06) 60%, transparent 100%)",
                  animation: `shimmerSweep ${4 + idx * 1.5}s ease-in-out ${idx * 0.8}s infinite`,
                }}
              />
            </div>

            {/* PARTÍCULAS douradas — todos */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 4,
                borderRadius: "14px",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: `${2 + Math.random() * 2.5}px`,
                    height: `${2 + Math.random() * 2.5}px`,
                    borderRadius: "50%",
                    background: i % 3 === 0
                      ? "rgba(255,215,0,0.8)"
                      : i % 3 === 1
                      ? "rgba(212,168,67,0.6)"
                      : "rgba(0,230,118,0.5)",
                    left: `${10 + Math.random() * 80}%`,
                    bottom: `${15 + Math.random() * 50}%`,
                    animation: `floatParticle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* FEIXES DE LUZ aleatórios nas bordas — todos */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 3,
                borderRadius: "14px",
              }}
            >
              {/* Feixe esquerdo */}
              <div
                style={{
                  position: "absolute",
                  top: `${15 + idx * 20}%`,
                  left: "-2px",
                  width: "40%",
                  height: "2px",
                  background: "linear-gradient(90deg, rgba(255,215,0,0.5), transparent)",
                  filter: "blur(1px)",
                  animation: `shimmerSweep ${6 + idx}s ease-in-out ${idx * 1.2}s infinite`,
                  opacity: 0.6,
                }}
              />
              {/* Feixe direito */}
              <div
                style={{
                  position: "absolute",
                  top: `${55 + idx * 10}%`,
                  right: "-2px",
                  width: "35%",
                  height: "2px",
                  background: "linear-gradient(270deg, rgba(255,215,0,0.5), transparent)",
                  filter: "blur(1px)",
                  animation: `shimmerSweep ${7 + idx}s ease-in-out ${idx * 0.5 + 2}s infinite`,
                  opacity: 0.5,
                }}
              />
              {/* Feixe topo diagonal */}
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: `${20 + idx * 25}%`,
                  width: "2px",
                  height: "30%",
                  background: "linear-gradient(180deg, rgba(255,215,0,0.4), transparent)",
                  filter: "blur(1px)",
                  animation: `shimmerSweep ${5 + idx * 1.5}s ease-in-out ${idx * 0.7 + 1}s infinite`,
                  opacity: 0.5,
                }}
              />
              {/* Feixe canto — glow corner */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "clamp(30px, 5vw, 60px)",
                  height: "clamp(30px, 5vw, 60px)",
                  background: "radial-gradient(circle at 0% 0%, rgba(255,215,0,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "clamp(30px, 5vw, 60px)",
                  height: "clamp(30px, 5vw, 60px)",
                  background: "radial-gradient(circle at 100% 100%, rgba(0,230,118,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* BORDA GLOW — todos (mais forte no ativo) */}
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "16px",
                boxShadow: isActive
                  ? "0 0 18px rgba(255,215,0,0.3), 0 0 40px rgba(0,230,118,0.12)"
                  : "0 0 10px rgba(255,215,0,0.12), 0 0 20px rgba(0,230,118,0.05)",
                pointerEvents: "none",
                zIndex: 3,
                transition: "box-shadow 0.5s ease",
              }}
            />

            {/* === EFEITOS EXTRAS — SÓ NO CARD ATIVO === */}
            <AnimatePresence>
              {isActive && (
                <>
                  {/* SPOTLIGHT CONE do topo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: "-10%",
                      left: "10%",
                      right: "10%",
                      height: "70%",
                      background: "conic-gradient(from 250deg at 50% 0%, transparent 0deg, rgba(255,215,0,0.1) 10deg, rgba(255,215,0,0.2) 20deg, rgba(255,215,0,0.1) 30deg, transparent 40deg)",
                      filter: "blur(16px)",
                      animation: "spotlightBreathe 4s ease-in-out infinite",
                      pointerEvents: "none",
                      zIndex: 3,
                      borderRadius: "14px",
                    }}
                  />

                  {/* GLOW base */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "5%",
                      right: "5%",
                      height: "50%",
                      background: "radial-gradient(ellipse at 50% 100%, rgba(255,215,0,0.12) 0%, rgba(0,230,118,0.06) 30%, transparent 70%)",
                      pointerEvents: "none",
                      zIndex: 3,
                      borderRadius: "0 0 14px 14px",
                    }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
