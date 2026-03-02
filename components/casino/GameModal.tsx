"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Game } from "@/lib/games";
import { UI } from "@/lib/assets";

interface GameModalProps {
  game: Game;
  lang: "br" | "in";
  onClose: () => void;
}

/* Particulas de abertura do jogo */
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

export default function GameModal({ game, lang, onClose }: GameModalProps) {
  const isBR = lang === "br";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ModalParticle[]>([]);
  const raf = useRef<number>(0);
  const time = useRef(0);

  const createBurstParticles = useCallback((w: number, h: number) => {
    const center = { x: w / 2, y: h / 2 };
    const colors = [
      "255,215,0",   // gold
      "212,168,67",  // gold-mid
      "0,230,118",   // green
      "255,240,200", // white-warm
      "180,140,50",  // dark gold
    ];
    return Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      return {
        x: center.x + (Math.random() - 0.5) * 40,
        y: center.y + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
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
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life += 1;

      const fade = Math.max(0, 1 - p.life / 180);
      const a = p.alpha * fade;
      if (a <= 0) continue;

      // Particula
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${a})`;
      ctx.fill();

      // Trail glow
      const grad = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.r * 5
      );
      grad.addColorStop(0, `rgba(${p.color},${a * 0.3})`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Central glow pulsante
    const pulse = 0.15 + Math.sin(time.current * 0.03) * 0.05;
    const cg = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.4
    );
    cg.addColorStop(0, `rgba(255,215,0,${pulse})`);
    cg.addColorStop(0.3, `rgba(0,230,118,${pulse * 0.3})`);
    cg.addColorStop(1, "transparent");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    raf.current = requestAnimationFrame(drawParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.current = createBurstParticles(canvas.width, canvas.height);
    drawParticles();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [createBurstParticles, drawParticles]);

  // Fechar com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
        fontFamily: "var(--font-cinzel)",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      {/* Canvas de particulas de explosao */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Raios de luz irradiando do centro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute pointer-events-none"
        style={{
          width: "80vmin",
          height: "80vmin",
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.1) 15deg, transparent 30deg, rgba(0,230,118,0.08) 45deg, transparent 60deg, rgba(255,215,0,0.1) 75deg, transparent 90deg, rgba(0,230,118,0.08) 105deg, transparent 120deg, rgba(255,215,0,0.1) 135deg, transparent 150deg, rgba(0,230,118,0.08) 165deg, transparent 180deg, rgba(255,215,0,0.1) 195deg, transparent 210deg, rgba(0,230,118,0.08) 225deg, transparent 240deg, rgba(255,215,0,0.1) 255deg, transparent 270deg, rgba(0,230,118,0.08) 285deg, transparent 300deg, rgba(255,215,0,0.1) 315deg, transparent 330deg, rgba(0,230,118,0.08) 345deg, transparent 360deg)",
          borderRadius: "50%",
          filter: "blur(20px)",
          zIndex: 2,
          animation: "spin 20s linear infinite",
        }}
      />

      {/* Halo de luz central */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute pointer-events-none"
        style={{
          width: "60vmin",
          height: "60vmin",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(0,230,118,0.05) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 2,
        }}
      />

      {/* Container principal -- nao fecha ao clicar */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center gap-[clamp(12px,2vw,24px)] z-[10]"
        style={{ cursor: "default", maxWidth: "90vw" }}
      >
        {/* Imagem dourada do jogo -- efeito de surgimento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          {/* Glow circular atras da imagem */}
          <div
            className="absolute inset-[-30%] pointer-events-none animate-breathe"
            style={{
              background:
                "radial-gradient(circle, rgba(212,168,67,0.2) 0%, rgba(0,230,118,0.1) 40%, transparent 65%)",
              filter: "blur(25px)",
            }}
          />
          <motion.img
            src={game.goldUrl}
            alt={isBR ? game.labelBR : game.labelEN}
            animate={{
              y: [0, -8, 0],
              filter: [
                "drop-shadow(0 0 30px rgba(212,168,67,0.5)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))",
                "drop-shadow(0 0 40px rgba(255,215,0,0.6)) drop-shadow(0 14px 28px rgba(0,0,0,0.6))",
                "drop-shadow(0 0 30px rgba(212,168,67,0.5)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              maxHeight: "45vh",
              maxWidth: "60vw",
              objectFit: "contain",
              position: "relative",
              zIndex: 3,
            }}
          />
        </motion.div>

        {/* Nome do jogo */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(20px, 3.5vw, 48px)",
            fontWeight: 900,
            color: "#FFD700",
            textShadow:
              "0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.2), 0 4px 8px rgba(0,0,0,0.8)",
            letterSpacing: "4px",
            textAlign: "center",
            margin: 0,
          }}
        >
          {isBR ? game.labelBR : game.labelEN}
        </motion.h2>

        {/* Descricao */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(10px, 1.3vw, 18px)",
            color: "rgba(255,215,0,0.6)",
            textAlign: "center",
            maxWidth: "500px",
            margin: 0,
          }}
        >
          {isBR ? game.descBR : game.descEN}
        </motion.p>

        {/* Botao JOGAR */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative border-none cursor-pointer flex items-center justify-center p-0"
          style={{
            background: "none",
            width: "clamp(140px, 22vw, 320px)",
            aspectRatio: "829 / 234",
            backgroundImage: `url(${UI.btnActive})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <span
            className="pointer-events-none"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(10px, 1.5vw, 20px)",
              fontWeight: 900,
              color: "#FFFFFF",
              textShadow:
                "0 0 10px rgba(0,230,118,0.7), 0 2px 4px rgba(0,0,0,0.9)",
              letterSpacing: "3px",
            }}
          >
            {isBR ? "JOGAR AGORA" : "PLAY NOW"}
          </span>
        </motion.button>

        {/* Botao Voltar sutil */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer"
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(9px, 1vw, 14px)",
            color: "rgba(212,168,67,0.5)",
            letterSpacing: "2px",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFD700";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(212,168,67,0.5)";
          }}
        >
          {isBR ? "VOLTAR" : "BACK"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
