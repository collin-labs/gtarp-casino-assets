"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JackpotHitOverlayProps {
  visible: boolean;
  tier: "mini" | "minor" | "major" | "grand" | null;
  amount: number;
  isBR: boolean;
  onClose: () => void;
}

const TIER_CONFIG = {
  mini:  { color: "#A8A8A8", glow: "rgba(168,168,168,0.4)", fontSize: "clamp(22px,2.8vw,34px)", label: "MINI JACKPOT" },
  minor: { color: "#00E676", glow: "rgba(0,230,118,0.4)",   fontSize: "clamp(26px,3.2vw,40px)", label: "MINOR JACKPOT" },
  major: { color: "#D4A843", glow: "rgba(212,168,67,0.5)",  fontSize: "clamp(30px,3.8vw,46px)", label: "MAJOR JACKPOT" },
  grand: { color: "#FFD700", glow: "rgba(255,215,0,0.6)",   fontSize: "clamp(34px,4.5vw,52px)", label: "GRAND JACKPOT" },
};

export default function JackpotHitOverlay({ visible, tier, amount, isBR, onClose }: JackpotHitOverlayProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    r: number; alpha: number; life: number; color: string;
  }>>([]);

  const config = tier ? TIER_CONFIG[tier] : TIER_CONFIG.mini;

  // Flash branco inicial
  useEffect(() => {
    if (visible) {
      setShowFlash(true);
      setDisplayVal(0);
      setTimeout(() => setShowFlash(false), 150);
    }
  }, [visible]);

  // Contador animado (0 → amount em 3s)
  useEffect(() => {
    if (!visible || amount <= 0) return;
    const duration = 3000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out: rápido no início, desacelera no final
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(amount * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, amount]);

  // Partículas douradas (Canvas 2D)
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) { canvas.width = rect.width; canvas.height = rect.height; }

    const cx = canvas.width / 2, cy = canvas.height * 0.4;
    const colors = ["255,215,0", "212,168,67", "255,240,200", "180,140,50", "0,230,118"];

    // Burst de 80 partículas
    particlesRef.current = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      return {
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        life: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravidade leve
        p.vx *= 0.995;
        p.life += 1;
        const fade = Math.max(0, 1 - p.life / 180);
        const a = p.alpha * fade;
        if (a <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${a})`;
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(${p.color},${a * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };
    draw();

    // Auto-fecha após 5s
    const timer = setTimeout(onClose, 5000);
    return () => { running = false; clearTimeout(timer); };
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && tier && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: "absolute", inset: 0, zIndex: 70,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.9)", borderRadius: "inherit",
            cursor: "pointer", overflow: "hidden",
          }}
        >
          {/* Flash branco */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute", inset: 0, background: "#FFFFFF",
                  pointerEvents: "none", zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          {/* Canvas partículas */}
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
          />

          {/* Raios cônicos giratórios (fundo) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.3, scale: 1.5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute", width: "80%", aspectRatio: "1",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              background: `conic-gradient(from 0deg, transparent 0deg, ${config.glow} 15deg, transparent 30deg, ${config.glow} 45deg, transparent 60deg, ${config.glow} 75deg, transparent 90deg, ${config.glow} 105deg, transparent 120deg)`,
              borderRadius: "50%", filter: "blur(20px)",
              animation: "spin 20s linear infinite", pointerEvents: "none", zIndex: 1,
            }}
          />

          {/* Conteúdo */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(8px,1.2vw,16px)" }}>
            {/* Tier name */}
            <motion.h2
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
              style={{
                fontFamily: "'Cinzel', serif", fontSize: config.fontSize,
                fontWeight: 900, color: config.color, margin: 0,
                letterSpacing: "4px",
                textShadow: `0 0 30px ${config.glow}, 0 0 60px ${config.glow}`,
              }}
            >
              {config.label}
            </motion.h2>

            {/* Valor contando */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(28px,4vw,52px)", fontWeight: 800,
                color: config.color,
                textShadow: `0 0 20px ${config.glow}`,
              }}
            >
              R$ {displayVal.toFixed(2).replace(".", ",")}
            </motion.div>

            {/* Texto tap para fechar */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(9px,0.9vw,12px)", color: "#A8A8A8",
                marginTop: "clamp(12px,1.5vw,24px)",
              }}
            >
              {isBR ? "Toque para fechar" : "Tap to close"}
            </motion.span>
          </div>

          {/* Keyframe spin */}
          <style>{`@keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
