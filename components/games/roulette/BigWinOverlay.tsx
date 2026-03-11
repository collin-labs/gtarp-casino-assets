"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BigWinOverlayProps {
  visible: boolean;
  tier: "big" | "mega" | "epic" | null;
  amount: number;
  isBR: boolean;
  onClose: () => void;
}

const TIER_CFG = {
  big: {
    text: "BIG WIN",
    size: "clamp(36px, 5vw, 60px)",
    color: "#FFD700",
    particles: 50,
    shake: false,
    gradient: false,
  },
  mega: {
    text: "MEGA WIN",
    size: "clamp(42px, 6vw, 72px)",
    color: "#FFD700",
    particles: 70,
    shake: true,
    gradient: false,
  },
  epic: {
    text: "EPIC WIN",
    size: "clamp(48px, 7vw, 84px)",
    color: "#FFD700",
    particles: 100,
    shake: true,
    gradient: true,
  },
};

export default function BigWinOverlay({
  visible,
  tier,
  amount,
  isBR,
  onClose,
}: BigWinOverlayProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const [shaking, setShaking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const cfg = tier ? TIER_CFG[tier] : TIER_CFG.big;

  // Animated counter (0 -> amount in 2s)
  useEffect(() => {
    if (!visible || amount <= 0) return;
    setDisplayVal(0);
    const duration = 2500;
    const start = performance.now();

    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayVal(amount * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, amount]);

  // Screen shake for mega/epic
  useEffect(() => {
    if (!visible || !cfg.shake) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), cfg.gradient ? 400 : 200);
    return () => clearTimeout(t);
  }, [visible, cfg.shake, cfg.gradient]);

  // Confetti Canvas
  useEffect(() => {
    if (!visible || !tier) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const colors = ["#FFD700", "#D4A843", "#FF6B00", "#FFFFFF", "#00E676", "#E53935"];
    const particles = Array.from({ length: cfg.particles }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      r: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      alpha: 1,
    }));

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.995;
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, p.alpha - 0.003);

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

    const timer = setTimeout(onClose, 5000);
    return () => {
      running = false;
      clearTimeout(timer);
    };
  }, [visible, tier, cfg.particles, onClose]);

  return (
    <AnimatePresence>
      {visible && tier && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 65,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "inherit",
            cursor: "pointer",
            overflow: "hidden",
            animation: shaking ? "bwShake 0.15s ease-in-out 3" : "none",
          }}
        >
          {/* Flash overlay */}
          {cfg.shake && (
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,215,0,0.2)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              width: "150%",
              height: "150%",
              background:
                "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 50%)",
              pointerEvents: "none",
              animation: "pulseGlow 2s ease-in-out infinite",
            }}
          />

          {/* Confetti canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(12px, 1.5vw, 24px)",
            }}
          >
            {/* Roulette image decoration */}
            <motion.img
              src="/assets/roulette/04.wheel-european.png"
              alt=""
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
              style={{
                width: "clamp(80px, 10vw, 120px)",
                filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
                animation: "slowSpin 20s linear infinite",
              }}
            />

            {/* Win text */}
            <motion.h2
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 12,
                delay: 0.15,
              }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: cfg.size,
                fontWeight: 900,
                margin: 0,
                letterSpacing: "5px",
                color: cfg.gradient ? "transparent" : cfg.color,
                background: cfg.gradient
                  ? "linear-gradient(135deg, #FFD700, #FF6B00, #FF1744)"
                  : "none",
                WebkitBackgroundClip: cfg.gradient ? "text" : "unset",
                WebkitTextFillColor: cfg.gradient ? "transparent" : "unset",
                textShadow: cfg.gradient
                  ? "none"
                  : "0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)",
                filter: cfg.gradient
                  ? "drop-shadow(0 0 25px rgba(255,215,0,0.6))"
                  : "none",
              }}
            >
              {cfg.text}
            </motion.h2>

            {/* Amount counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(32px, 5vw, 64px)",
                fontWeight: 800,
                color: "#FFFFFF",
                textShadow:
                  "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(24px, 3vw, 40px)",
                  color: "#00E676",
                }}
              >
                +
              </span>
              {displayVal.toFixed(2).replace(".", ",")}
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(12px, 1.3vw, 18px)",
                color: "#D4A843",
                margin: 0,
                letterSpacing: "2px",
                fontStyle: "italic",
              }}
            >
              {isBR ? "Parabens!" : "Congratulations!"}
            </motion.p>

            {/* Tap to close */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2.5 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                color: "#666",
                marginTop: "clamp(12px, 1.5vw, 24px)",
              }}
            >
              {isBR ? "Toque para fechar" : "Tap to close"}
            </motion.span>
          </div>

          <style>{`
            @keyframes bwShake {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(-${cfg.gradient ? 6 : 4}px, ${cfg.gradient ? 4 : 2}px); }
              50% { transform: translate(${cfg.gradient ? 6 : 4}px, -${cfg.gradient ? 4 : 2}px); }
              75% { transform: translate(-${cfg.gradient ? 4 : 2}px, ${cfg.gradient ? 6 : 4}px); }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
            @keyframes slowSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
