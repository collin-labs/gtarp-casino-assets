"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { RouletteMode } from "./RouletteGame";

interface ModeSelectProps {
  onSelectMode: (mode: RouletteMode) => void;
  onBack: () => void;
  isBR: boolean;
}

export default function ModeSelect({ onSelectMode, onBack, isBR }: ModeSelectProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle effect background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.3 ? "#D4A843" : "#00E676",
      });
    }

    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  const cards = [
    {
      id: "classic",
      title: isBR ? "ROLETA EUROPEIA" : "EUROPEAN ROULETTE",
      subtitle: isBR ? "Classica" : "Classic",
      desc: isBR
        ? "37 numeros, 0-36, pagamentos tradicionais"
        : "37 numbers, 0-36, traditional payouts",
      image: "/assets/roulette/08.mode-classic.png",
      badge: null,
    },
    {
      id: "lightning",
      title: isBR ? "ROLETA BLACKOUT" : "BLACKOUT ROULETTE",
      subtitle: "Lightning",
      desc: isBR
        ? "Lucky Numbers com multiplicadores ate 500x!"
        : "Lucky Numbers with multipliers up to 500x!",
      image: "/assets/roulette/09.mode-lightning.png",
      badge: "PREMIUM",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "clamp(60px, 6vh, 90px)",
        position: "relative",
        background: "#0A0A0A",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Radial gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,168,67,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Back button */}
      <motion.button
        whileHover={{
          scale: 1.15,
          color: "#FFD700",
          textShadow: "0 0 10px rgba(255,215,0,0.5)",
        }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        title={isBR ? "Voltar ao menu do cassino" : "Back to casino menu"}
        style={{
          position: "absolute",
          top: "clamp(12px, 2vh, 24px)",
          left: "clamp(12px, 2vw, 24px)",
          background: "rgba(20,20,20,0.8)",
          border: "1px solid rgba(212,168,67,0.3)",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "clamp(14px, 1.5vw, 20px)",
          color: "#D4A843",
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          padding: "clamp(4px, 0.5vw, 8px) clamp(10px, 1vw, 16px)",
          transition: "all 0.2s",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}>&#8249;</span>
        <span
          style={{
            fontSize: "clamp(9px, 0.9vw, 12px)",
            letterSpacing: "1px",
          }}
        >
          {isBR ? "VOLTAR" : "BACK"}
        </span>
      </motion.button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <img
          src={
            isBR
              ? "/assets/roulette/02.logo-br.png"
              : "/assets/roulette/03.logo-en.png"
          }
          alt="Roleta"
          draggable={false}
          style={{
            width: "clamp(280px, 22vw, 380px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
            userSelect: "none",
          }}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(13px, 1.4vw, 20px)",
          color: "#D4A843",
          margin: "clamp(8px, 1vh, 16px) 0 clamp(24px, 3vh, 40px)",
          fontWeight: 600,
          letterSpacing: "3px",
          fontStyle: "italic",
          textShadow:
            "0 0 10px rgba(212,168,67,0.3), 0 2px 4px rgba(0,0,0,0.8)",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          width: "100%",
        }}
      >
        {isBR ? "Escolha seu modo de jogo" : "Choose your game mode"}
      </motion.p>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: "clamp(16px, 2vw, 32px)",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 clamp(12px, 2vw, 24px)",
          maxWidth: "800px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {cards.map((card, i) => {
          const isHovered = hoveredCard === card.id;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onSelectMode(card.id as RouletteMode)}
              style={{
                width: "clamp(240px, 24vw, 320px)",
                height: "clamp(340px, 38vh, 450px)",
                background: "#0A0A0A",
                border: `2px solid ${
                  isHovered
                    ? "rgba(212,168,67,0.7)"
                    : "rgba(212,168,67,0.25)"
                }`,
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                cursor: "pointer",
                boxShadow: isHovered
                  ? "0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,168,67,0.15)"
                  : "0 4px 16px rgba(0,0,0,0.5)",
                overflow: "hidden",
                transition: "border 0.3s, box-shadow 0.3s, transform 0.3s",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              {/* Top shine */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(246,226,122,0.5), transparent)",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />

              {/* Badge */}
              {card.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 4,
                    background:
                      "linear-gradient(135deg, #D4A843, #F6E27A, #D4A843)",
                    color: "#000",
                    fontSize: "clamp(7px, 0.7vw, 10px)",
                    fontWeight: 800,
                    fontFamily: "'Cinzel', serif",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    letterSpacing: "1.5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {card.badge}
                </div>
              )}

              {/* Image area - 60% */}
              <div
                style={{
                  width: "100%",
                  flex: "0 0 60%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isHovered
                      ? "brightness(1.1) saturate(1.1)"
                      : "brightness(0.85)",
                    transition: "filter 0.4s ease, transform 0.4s ease",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                />
                {/* Bottom gradient */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: "linear-gradient(transparent, #0A0A0A)",
                    pointerEvents: "none",
                  }}
                />

                {/* Lightning effect for lightning mode */}
                {card.id === "lightning" && isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>

              {/* Content area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding:
                    "0 clamp(10px, 0.8vw, 14px) clamp(14px, 1.2vw, 20px)",
                  gap: "clamp(4px, 0.4vw, 6px)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(14px, 1.5vw, 20px)",
                    fontWeight: 900,
                    color: "#FFD700",
                    margin: 0,
                    letterSpacing: "1.5px",
                    textAlign: "center",
                    textShadow: "0 0 12px rgba(255,215,0,0.3)",
                  }}
                >
                  {card.title}
                </h2>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(8px, 0.8vw, 11px)",
                    color: "#D4A843",
                    letterSpacing: "1px",
                    fontStyle: "italic",
                  }}
                >
                  {card.subtitle}
                </span>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(9px, 0.9vw, 12px)",
                    color: "#A8A8A8",
                    margin: 0,
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {card.desc}
                </p>

                {/* Play button */}
                <motion.button
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.96 }}
                  title={isBR ? "Jogar este modo" : "Play this mode"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMode(card.id as RouletteMode);
                  }}
                  style={{
                    marginTop: "clamp(6px, 0.8vw, 12px)",
                    padding:
                      "clamp(8px, 0.8vw, 12px) clamp(24px, 2.5vw, 40px)",
                    background:
                      card.id === "lightning"
                        ? "linear-gradient(180deg, #FFD700 0%, #D4A843 40%, #8B6914 100%)"
                        : "linear-gradient(180deg, #00E676 0%, #00C853 40%, #004D25 100%)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(10px, 1vw, 14px)",
                    fontWeight: 800,
                    color: card.id === "lightning" ? "#000" : "#FFF",
                    letterSpacing: "2px",
                    boxShadow:
                      card.id === "lightning"
                        ? "0 0 15px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
                        : "0 0 10px rgba(0,230,118,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                    transition: "all 0.2s",
                  }}
                >
                  {isBR ? "JOGAR AGORA" : "PLAY NOW"}
                </motion.button>
              </div>

              {/* Shimmer effect */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "50%",
                    height: "200%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                    transform: "rotate(25deg)",
                    animation: isHovered
                      ? "shimmerSweep 2s ease-in-out infinite"
                      : "none",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative roulette wheel at bottom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(300px, 40vw, 500px)",
          height: "clamp(300px, 40vw, 500px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <img
          src="/assets/roulette/04.wheel-european.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            animation: "slowSpin 60s linear infinite",
          }}
        />
      </motion.div>

      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-200%) rotate(25deg); }
          100% { transform: translateX(400%) rotate(25deg); }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
