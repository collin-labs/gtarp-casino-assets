"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CrashPhase } from "./CrashGame";

// ═══════════════════════════════════════════════════════════════════════════
// CRASH CANVAS — Curva 2D + Multiplicador + Estados Visuais
// ═══════════════════════════════════════════════════════════════════════════

interface CrashCanvasProps {
  phase: CrashPhase;
  multiplier: number;
  curvePoints: { x: number; y: number }[];
  countdown: number;
  crashPoint?: number;
}

// Assets
const STARS_BG = "/assets/games/crash/stars-bg.png";
const EXPLOSION = "/assets/games/crash/explosion.png";

// Cores
const COLORS = {
  gold: "#D4A843",
  goldLight: "#FFD700",
  green: "#00E676",
  red: "#FF4444",
  gridLine: "rgba(212,168,67,0.15)",
  gridLineStrong: "rgba(212,168,67,0.25)",
};

export function CrashCanvas({
  phase,
  multiplier,
  curvePoints,
  countdown,
  crashPoint,
}: CrashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const explosionRef = useRef<HTMLImageElement | null>(null);

  // Carregar imagens
  useEffect(() => {
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = STARS_BG;
    bgImg.onload = () => {
      bgImageRef.current = bgImg;
    };

    const expImg = new Image();
    expImg.crossOrigin = "anonymous";
    expImg.src = EXPLOSION;
    expImg.onload = () => {
      explosionRef.current = expImg;
    };
  }, []);

  // ResizeObserver para canvas responsivo
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ 
          width: Math.floor(width * window.devicePixelRatio),
          height: Math.floor(height * window.devicePixelRatio),
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Renderizar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;

    // Configurar canvas
    canvas.width = width;
    canvas.height = height;

    // Limpar
    ctx.clearRect(0, 0, width, height);

    // Fundo estrelado
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, width, height);
    } else {
      // Fallback gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#0A0A0A");
      bgGrad.addColorStop(1, "#050505");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Escurecimento sobre o fundo
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, width, height);

    // ════════════════════════════════════════════════════════════════════
    // GRID DOURADO
    // ════════════════════════════════════════════════════════════════════
    const gridSpacingX = width / 12;
    const gridSpacingY = height / 8;

    // Linhas verticais
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1 * dpr;
    for (let x = gridSpacingX; x < width; x += gridSpacingX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Linhas horizontais
    for (let y = gridSpacingY; y < height; y += gridSpacingY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Eixos mais fortes
    ctx.strokeStyle = COLORS.gridLineStrong;
    ctx.lineWidth = 2 * dpr;
    // Eixo X (base)
    ctx.beginPath();
    ctx.moveTo(0, height - gridSpacingY);
    ctx.lineTo(width, height - gridSpacingY);
    ctx.stroke();
    // Eixo Y
    ctx.beginPath();
    ctx.moveTo(gridSpacingX, 0);
    ctx.lineTo(gridSpacingX, height);
    ctx.stroke();

    // ════════════════════════════════════════════════════════════════════
    // CURVA DO CRASH
    // ════════════════════════════════════════════════════════════════════
    if (phase === "RISING" || phase === "CRASHED") {
      const paddingX = gridSpacingX;
      const paddingY = gridSpacingY;
      const graphWidth = width - paddingX * 2;
      const graphHeight = height - paddingY * 2;

      if (curvePoints.length > 1) {
        // Determinar cor baseado na fase e multiplicador
        let curveColor = COLORS.green;
        if (phase === "CRASHED") {
          curveColor = COLORS.red;
        } else if (multiplier > 5) {
          curveColor = COLORS.goldLight;
        } else if (multiplier > 2) {
          // Gradiente verde -> dourado
          const t = (multiplier - 2) / 3;
          curveColor = `rgb(${Math.floor(0 + 255 * t)}, ${Math.floor(230 - 15 * t)}, ${Math.floor(118 - 118 * t)})`;
        }

        // Normalizar pontos para o canvas
        const maxX = Math.max(...curvePoints.map(p => p.x), 1);
        const maxY = Math.max(...curvePoints.map(p => p.y), 1);
        
        const normalizedPoints = curvePoints.map(p => ({
          x: paddingX + (p.x / maxX) * graphWidth * 0.9,
          y: height - paddingY - (p.y / maxY) * graphHeight * 0.8,
        }));

        // Desenhar curva com glow fake (sem shadowBlur - bug CEF)
        // Camada de glow (linha mais grossa, mais transparente)
        ctx.beginPath();
        ctx.moveTo(normalizedPoints[0].x, normalizedPoints[0].y);
        for (let i = 1; i < normalizedPoints.length; i++) {
          ctx.lineTo(normalizedPoints[i].x, normalizedPoints[i].y);
        }
        ctx.strokeStyle = curveColor.replace("rgb", "rgba").replace(")", ",0.3)");
        ctx.lineWidth = 12 * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Camada media
        ctx.beginPath();
        ctx.moveTo(normalizedPoints[0].x, normalizedPoints[0].y);
        for (let i = 1; i < normalizedPoints.length; i++) {
          ctx.lineTo(normalizedPoints[i].x, normalizedPoints[i].y);
        }
        ctx.strokeStyle = curveColor.replace("rgb", "rgba").replace(")", ",0.5)");
        ctx.lineWidth = 6 * dpr;
        ctx.stroke();

        // Curva principal
        ctx.beginPath();
        ctx.moveTo(normalizedPoints[0].x, normalizedPoints[0].y);
        for (let i = 1; i < normalizedPoints.length; i++) {
          ctx.lineTo(normalizedPoints[i].x, normalizedPoints[i].y);
        }
        ctx.strokeStyle = curveColor;
        ctx.lineWidth = 3 * dpr;
        ctx.stroke();

        // Ponto final (cabeca da curva)
        if (phase === "RISING" && normalizedPoints.length > 0) {
          const lastPoint = normalizedPoints[normalizedPoints.length - 1];
          
          // Glow do ponto
          const pointGrad = ctx.createRadialGradient(
            lastPoint.x, lastPoint.y, 0,
            lastPoint.x, lastPoint.y, 20 * dpr
          );
          pointGrad.addColorStop(0, curveColor);
          pointGrad.addColorStop(0.5, curveColor.replace("rgb", "rgba").replace(")", ",0.3)"));
          pointGrad.addColorStop(1, "transparent");
          ctx.fillStyle = pointGrad;
          ctx.beginPath();
          ctx.arc(lastPoint.x, lastPoint.y, 20 * dpr, 0, Math.PI * 2);
          ctx.fill();

          // Ponto solido
          ctx.fillStyle = curveColor;
          ctx.beginPath();
          ctx.arc(lastPoint.x, lastPoint.y, 6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // EXPLOSAO (fase CRASHED)
    // ════════════════════════════════════════════════════════════════════
    if (phase === "CRASHED" && explosionRef.current && curvePoints.length > 0) {
      const paddingX = gridSpacingX;
      const paddingY = gridSpacingY;
      const graphWidth = width - paddingX * 2;
      const graphHeight = height - paddingY * 2;

      const maxX = Math.max(...curvePoints.map(p => p.x), 1);
      const maxY = Math.max(...curvePoints.map(p => p.y), 1);
      const lastPoint = curvePoints[curvePoints.length - 1];
      
      const explosionX = paddingX + (lastPoint.x / maxX) * graphWidth * 0.9;
      const explosionY = height - paddingY - (lastPoint.y / maxY) * graphHeight * 0.8;
      const explosionSize = 120 * dpr;

      ctx.drawImage(
        explosionRef.current,
        explosionX - explosionSize / 2,
        explosionY - explosionSize / 2,
        explosionSize,
        explosionSize
      );
    }
  }, [phase, multiplier, curvePoints, dimensions]);

  // ════════════════════════════════════════════════════════════════════════
  // OVERLAY DE TEXTO (Multiplicador, Countdown, Status)
  // ════════════════════════════════════════════════════════════════════════
  
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          TEXTO CENTRAL — Multiplicador ou Status
          ════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {/* WAITING: Countdown */}
          {phase === "WAITING" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(12px, 1.5vw, 18px)",
                  fontWeight: 600,
                  color: "rgba(212,168,67,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  marginBottom: "clamp(8px, 1vw, 16px)",
                }}
              >
                PRÓXIMO ROUND EM
              </div>
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(48px, 8vw, 96px)",
                  fontWeight: 800,
                  color: COLORS.goldLight,
                  textShadow: `
                    0 0 20px rgba(255,215,0,0.8),
                    0 0 40px rgba(255,215,0,0.4),
                    0 0 60px rgba(255,215,0,0.2)
                  `,
                }}
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}

          {/* BETTING: Aposte Agora */}
          {phase === "BETTING" && (
            <motion.div
              key="betting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 20px rgba(0,230,118,0.6), 0 0 40px rgba(0,230,118,0.3)",
                    "0 0 40px rgba(0,230,118,0.9), 0 0 80px rgba(0,230,118,0.5)",
                    "0 0 20px rgba(0,230,118,0.6), 0 0 40px rgba(0,230,118,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(24px, 4vw, 48px)",
                  fontWeight: 800,
                  color: COLORS.green,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                }}
              >
                APOSTE AGORA!
              </motion.div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(14px, 1.8vw, 22px)",
                  fontWeight: 600,
                  color: "rgba(212,168,67,0.7)",
                  marginTop: "clamp(8px, 1vw, 16px)",
                }}
              >
                1.00x
              </div>
            </motion.div>
          )}

          {/* RISING: Multiplicador */}
          {phase === "RISING" && (
            <motion.div
              key="rising"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(36px, 7vw, 80px)",
                  fontWeight: 800,
                  color: multiplier > 5 ? COLORS.goldLight : multiplier > 2 ? "#90EE90" : COLORS.green,
                  textShadow: `
                    0 0 30px ${multiplier > 5 ? "rgba(255,215,0,0.8)" : "rgba(0,230,118,0.8)"},
                    0 0 60px ${multiplier > 5 ? "rgba(255,215,0,0.4)" : "rgba(0,230,118,0.4)"},
                    0 0 90px ${multiplier > 5 ? "rgba(255,215,0,0.2)" : "rgba(0,230,118,0.2)"}
                  `,
                }}
              >
                {multiplier.toFixed(2)}x
              </motion.div>
            </motion.div>
          )}

          {/* CRASHED: Crash Point */}
          {phase === "CRASHED" && crashPoint && (
            <motion.div
              key="crashed"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 0.3, repeat: 3 }}
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(14px, 1.8vw, 22px)",
                  fontWeight: 700,
                  color: COLORS.red,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  marginBottom: "clamp(8px, 1vw, 12px)",
                }}
              >
                CRASHED!
              </motion.div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(32px, 6vw, 72px)",
                  fontWeight: 800,
                  color: COLORS.red,
                  textShadow: `
                    0 0 30px rgba(255,68,68,0.8),
                    0 0 60px rgba(255,68,68,0.4)
                  `,
                }}
              >
                {crashPoint.toFixed(2)}x
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
