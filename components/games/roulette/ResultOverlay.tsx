"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SpinResult, Bet } from "./RouletteGame";

const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

interface ResultOverlayProps {
  visible: boolean;
  result: SpinResult;
  bets: Bet[];
  totalWin: number;
  isBR: boolean;
  onClose: () => void;
}

export default function ResultOverlay({
  visible,
  result,
  bets,
  totalWin,
  isBR,
  onClose,
}: ResultOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isWin = totalWin > 0;

  // Particle effects for wins
  useEffect(() => {
    if (!visible || !isWin) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const colors = ["#FFD700", "#D4A843", "#00E676", "#FFFFFF"];
    const particles = Array.from({ length: 40 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
    }));

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, p.alpha - 0.015);

        if (p.alpha <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        ctx.restore();
      }

      requestAnimationFrame(draw);
    };
    draw();

    const timer = setTimeout(onClose, 3000);
    return () => {
      running = false;
      clearTimeout(timer);
    };
  }, [visible, isWin, onClose]);

  // Auto-close for losses
  useEffect(() => {
    if (!visible || isWin) return;
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [visible, isWin, onClose]);

  const getNumberBg = () => {
    if (result.number === 0) return "linear-gradient(180deg, #00E676, #004D25)";
    if (RED_NUMBERS.includes(result.number))
      return "linear-gradient(180deg, #FF1744, #8B0000)";
    return "linear-gradient(180deg, #333, #0A0A0A)";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 55,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "inherit",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* Particle canvas */}
          {isWin && (
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(16px, 2vw, 28px)",
            }}
          >
            {/* Number result */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{
                width: "clamp(80px, 10vw, 120px)",
                height: "clamp(80px, 10vw, 120px)",
                borderRadius: "50%",
                background: getNumberBg(),
                border: result.isLucky
                  ? "4px solid #FFD700"
                  : "3px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: result.isLucky
                  ? "0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.3)"
                  : "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 900,
                  color: "#FFF",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {result.number}
              </span>
            </motion.div>

            {/* Lucky multiplier badge */}
            {result.isLucky && result.multiplier && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                style={{
                  background:
                    result.multiplier >= 500
                      ? "linear-gradient(135deg, #FF1744, #B71C1C)"
                      : result.multiplier >= 200
                      ? "linear-gradient(135deg, #FF6B00, #E65100)"
                      : "linear-gradient(135deg, #FFD700, #8B6914)",
                  padding: "clamp(8px, 1vw, 14px) clamp(16px, 2vw, 28px)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src="/assets/roulette/07.lightning-bolt.png"
                  alt=""
                  style={{
                    height: "clamp(20px, 2.5vw, 32px)",
                    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(18px, 2.5vw, 32px)",
                    fontWeight: 900,
                    color: result.multiplier >= 200 ? "#FFF" : "#000",
                    letterSpacing: "2px",
                  }}
                >
                  {result.multiplier}x
                </span>
              </motion.div>
            )}

            {/* Win/Lose message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: "center",
              }}
            >
              {isWin ? (
                <>
                  <h2
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(24px, 3vw, 40px)",
                      fontWeight: 900,
                      color: "#00E676",
                      margin: 0,
                      marginBottom: "clamp(8px, 1vw, 14px)",
                      textShadow:
                        "0 0 20px rgba(0,230,118,0.6), 0 0 40px rgba(0,230,118,0.3)",
                      letterSpacing: "3px",
                    }}
                  >
                    {isBR ? "VOCE GANHOU!" : "YOU WIN!"}
                  </h2>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "clamp(28px, 4vw, 48px)",
                      fontWeight: 800,
                      color: "#FFD700",
                      textShadow:
                        "0 0 15px rgba(255,215,0,0.5), 0 0 30px rgba(255,215,0,0.2)",
                    }}
                  >
                    +{totalWin.toLocaleString()}
                  </div>
                </>
              ) : (
                <h2
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(20px, 2.5vw, 32px)",
                    fontWeight: 700,
                    color: "#FF1744",
                    margin: 0,
                    textShadow: "0 0 15px rgba(255,23,68,0.4)",
                    letterSpacing: "2px",
                  }}
                >
                  {isBR ? "SEM PREMIO" : "NO WIN"}
                </h2>
              )}
            </motion.div>

            {/* Tap to close */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                color: "#666",
                marginTop: "clamp(8px, 1vw, 16px)",
              }}
            >
              {isBR ? "Toque para continuar" : "Tap to continue"}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
