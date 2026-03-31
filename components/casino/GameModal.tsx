"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Game } from "@/lib/games";
import { UI } from "@/lib/assets";

interface GameModalProps {
  game: Game;
  lang: "br" | "in";
  onClose: () => void;
  onPlay?: () => void;
}

/* Partículas de abertura */
interface ModalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  color: string;
}

export default function GameModal({ game, lang, onClose, onPlay }: GameModalProps) {
  const isBR = lang === "br";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<ModalParticle[]>([]);
  const raf = useRef<number>(0);
  const time = useRef(0);

  /* --- Burst de partículas --- */
  const createBurstParticles = useCallback((w: number, h: number) => {
    const center = { x: w / 2, y: h * 0.35 };
    const colors = [
      "255,215,0",
      "212,168,67",
      "0,230,118",
      "255,240,200",
      "180,140,50",
    ];
    return Array.from({ length: 100 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 0.8;
      return {
        x: center.x + (Math.random() - 0.5) * 30,
        y: center.y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        life: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    time.current += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.988;
      p.vy *= 0.988;
      p.life += 1;

      const fade = Math.max(0, 1 - p.life / 200);
      const a = p.alpha * fade;
      if (a <= 0) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${a})`;
      ctx.fill();

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(${p.color},${a * 0.25})`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    /* Glow central pulsante */
    const pulse = 0.12 + Math.sin(time.current * 0.025) * 0.04;
    const cg = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.35, 0,
      canvas.width / 2, canvas.height * 0.35, canvas.width * 0.35
    );
    cg.addColorStop(0, `rgba(255,215,0,${pulse})`);
    cg.addColorStop(0.3, `rgba(0,230,118,${pulse * 0.25})`);
    cg.addColorStop(1, "transparent");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    raf.current = requestAnimationFrame(drawParticles);
  }, []);

  /* --- Canvas resize & init --- */
  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const resize = () => {
      const r = el.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    };
    resize();
    particles.current = createBurstParticles(canvas.width, canvas.height);
    drawParticles();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [createBurstParticles, drawParticles]);

  /* --- ESC para fechar --- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.35, ease: "easeIn" } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "inherit",
        fontFamily: "var(--font-cinzel)",
        background: "#000",
      }}
    >
      {/* Fundo escuro com gradiente radial verde/ouro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,50,25,0.6) 0%, rgba(0,0,0,0.95) 70%, #000 100%)",
          zIndex: 0,
        }}
      />

      {/* Canvas de partículas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Raios cônicos giratórios */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 0.35, scale: 1.4 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: "80%",
          aspectRatio: "1",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.08) 15deg, transparent 30deg, rgba(0,230,118,0.06) 45deg, transparent 60deg, rgba(255,215,0,0.08) 75deg, transparent 90deg, rgba(0,230,118,0.06) 105deg, transparent 120deg, rgba(255,215,0,0.08) 135deg, transparent 150deg, rgba(0,230,118,0.06) 165deg, transparent 180deg, rgba(255,215,0,0.08) 195deg, transparent 210deg, rgba(0,230,118,0.06) 225deg, transparent 240deg, rgba(255,215,0,0.08) 255deg, transparent 270deg, rgba(0,230,118,0.06) 285deg, transparent 300deg, rgba(255,215,0,0.08) 315deg, transparent 330deg, rgba(0,230,118,0.06) 345deg, transparent 360deg)",
          borderRadius: "50%",
          filter: "blur(25px)",
          zIndex: 2,
          animation: "spin 25s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Halo central */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: premiumEase }}
        style={{
          position: "absolute",
          width: "50%",
          aspectRatio: "1",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(0,230,118,0.04) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(35px)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ============================================ */}
      {/* CONTEÚDO PRINCIPAL                           */}
      {/* ============================================ */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(6px, 1.2vw, 16px)",
          maxWidth: "90%",
          paddingBottom: "clamp(8px, 2vw, 24px)",
        }}
      >
        {/* Imagem dourada do jogo com float */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: premiumEase }}
          style={{ position: "relative" }}
        >
          <div
            className="animate-breathe"
            style={{
              position: "absolute",
              inset: "-25%",
              background:
                "radial-gradient(circle, rgba(212,168,67,0.2) 0%, rgba(0,230,118,0.08) 40%, transparent 65%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <motion.img
            src={game.goldUrl}
            alt={isBR ? game.labelBR : game.labelEN}
            draggable={false}
            animate={{
              y: [0, -8, 0],
              filter: [
                "drop-shadow(0 0 25px rgba(212,168,67,0.5)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))",
                "drop-shadow(0 0 35px rgba(255,215,0,0.6)) drop-shadow(0 14px 28px rgba(0,0,0,0.6))",
                "drop-shadow(0 0 25px rgba(212,168,67,0.5)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              maxHeight: "clamp(120px, 38vh, 380px)",
              maxWidth: "clamp(120px, 38vw, 380px)",
              objectFit: "contain",
              position: "relative",
              zIndex: 3,
            }}
          />
        </motion.div>

        {/* Nome do jogo */}
        <motion.h2
          initial={{ opacity: 0, y: 25, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: premiumEase }}
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(18px, 3vw, 44px)",
            fontWeight: 900,
            color: "#FFD700",
            textShadow:
              "0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.2), 0 4px 8px rgba(0,0,0,0.8)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
          }}
        >
          {isBR ? game.labelBR : game.labelEN}
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(9px, 1.1vw, 15px)",
            color: "rgba(255,215,0,0.6)",
            textAlign: "center",
            maxWidth: "clamp(200px, 40vw, 400px)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {isBR ? game.descBR : game.descEN}
        </motion.p>

        {/* ============================== */}
        {/* BOTÃO JOGAR AGORA (Hero style) */}
        {/* ============================== */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          whileHover={{ scale: 1.06, filter: "brightness(1.15)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onPlay}
          style={{
            position: "relative",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            background: "none",
            width: "clamp(120px, 18vw, 260px)",
            aspectRatio: "829 / 234",
            backgroundImage: `url(${UI.btnDisabled})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Fio de luz girando — copiado da Hero */}
          <div
            style={{
              position: "absolute",
              inset: "2px 4px 11px 18px",
              borderRadius: "6px",
              overflow: "hidden",
              pointerEvents: "none",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1.5px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-50%",
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 70%, #00E676 80%, #FFD700 90%, transparent 100%)",
                animation: "spin 3s linear infinite",
              }}
            />
          </div>
          <span
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
            }}
          >
            {isBR ? "JOGAR AGORA" : "PLAY NOW"}
          </span>
        </motion.button>

        {/* VOLTAR */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(8px, 0.85vw, 12px)",
            color: "rgba(212,168,67,0.4)",
            letterSpacing: "3px",
            transition: "color 0.3s, text-shadow 0.3s",
            marginTop: "clamp(0px, 0.3vw, 4px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFD700";
            e.currentTarget.style.textShadow = "0 0 8px rgba(255,215,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(212,168,67,0.4)";
            e.currentTarget.style.textShadow = "none";
          }}
        >
          {isBR ? "VOLTAR" : "BACK"}
        </motion.button>
      </div>
    </motion.div>
  );
}
