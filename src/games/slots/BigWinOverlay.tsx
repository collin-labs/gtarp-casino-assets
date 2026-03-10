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
  big:  { text: "BIG WIN",  size: "clamp(32px,4vw,52px)", color: "#FFD700", particles: 40, shake: false, gradient: false },
  mega: { text: "MEGA WIN", size: "clamp(38px,5vw,60px)", color: "#FFD700", particles: 60, shake: true,  gradient: false },
  epic: { text: "EPIC WIN", size: "clamp(44px,6vw,68px)", color: "#FFD700", particles: 80, shake: true,  gradient: true  },
};

export default function BigWinOverlay({ visible, tier, amount, isBR, onClose }: BigWinOverlayProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const [shaking, setShaking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const cfg = tier ? TIER_CFG[tier] : TIER_CFG.big;

  // Contador animado (0 → amount em 2s)
  useEffect(() => {
    if (!visible || amount <= 0) return;
    setDisplayVal(0);
    const duration = 2000;
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

  // Screen shake para mega/epic
  useEffect(() => {
    if (!visible || !cfg.shake) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), cfg.gradient ? 400 : 200);
    return () => clearTimeout(t);
  }, [visible, cfg.shake, cfg.gradient]);

  // Confetti Canvas 2D
  useEffect(() => {
    if (!visible || !tier) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) { canvas.width = rect.width; canvas.height = rect.height; }

    const colors = ["#FFD700","#D4A843","#FF6B00","#FFFFFF","#00E676"];
    const particles = Array.from({ length: cfg.particles }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      alpha: 1,
    }));

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.998;
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, p.alpha - 0.003);
        if (p.alpha <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        // Retângulo confetti
        ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    };
    draw();

    const timer = setTimeout(onClose, 4000);
    return () => { running = false; clearTimeout(timer); };
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
            position: "absolute", inset: 0, zIndex: 65,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.85)", borderRadius: "inherit",
            cursor: "pointer", overflow: "hidden",
            animation: shaking ? "bwShake 0.15s ease-in-out 3" : "none",
          }}
        >
          {/* Flash dourado (mega/epic) */}
          {(cfg.shake) && (
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute", inset: 0,
                background: "rgba(255,215,0,0.15)", pointerEvents: "none",
              }}
            />
          )}

          {/* Canvas confetti */}
          <canvas ref={canvasRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
          />

          {/* Conteúdo */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(8px,1.2vw,16px)" }}>
            <motion.h2
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
              style={{
                fontFamily: "'Cinzel', serif", fontSize: cfg.size,
                fontWeight: 900, margin: 0, letterSpacing: "4px",
                color: cfg.gradient ? "transparent" : cfg.color,
                background: cfg.gradient ? "linear-gradient(135deg, #FFD700, #FF6B00)" : "none",
                WebkitBackgroundClip: cfg.gradient ? "text" : "unset",
                WebkitTextFillColor: cfg.gradient ? "transparent" : "unset",
                textShadow: cfg.gradient ? "none" : `0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)`,
                filter: cfg.gradient ? "drop-shadow(0 0 20px rgba(255,215,0,0.5))" : "none",
              }}
            >
              {cfg.text}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(22px,3vw,40px)", fontWeight: 800,
                color: "#FFFFFF",
                textShadow: "0 0 15px rgba(255,255,255,0.3)",
              }}
            >
              R$ {displayVal.toFixed(2).replace(".", ",")}
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(9px,0.9vw,12px)", color: "#A8A8A8",
                marginTop: "clamp(8px,1vw,16px)",
              }}
            >
              {isBR ? "Toque para fechar" : "Tap to close"}
            </motion.span>
          </div>

          <style>{`
            @keyframes bwShake {
              0%,100% { transform: translate(0,0); }
              25% { transform: translate(-${cfg.gradient ? 5 : 3}px, ${cfg.gradient ? 3 : 2}px); }
              50% { transform: translate(${cfg.gradient ? 5 : 3}px, -${cfg.gradient ? 3 : 2}px); }
              75% { transform: translate(-${cfg.gradient ? 3 : 2}px, ${cfg.gradient ? 5 : 3}px); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
