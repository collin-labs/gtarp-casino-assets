"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_GAMES } from "@/lib/games";
import { UI } from "@/lib/assets";

interface HeroProps {
  lang: "br" | "in";
}

export default function HeroCarousel({ lang }: HeroProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [btnPressed, setBtnPressed] = useState(false);
  const [direction, setDirection] = useState(1);
  const isBR = lang === "br";
  const current = HERO_GAMES[heroIdx];

  // Auto-rotation 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setHeroIdx((prev) => (prev + 1) % HERO_GAMES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => {
    if (i === heroIdx) return;
    setDirection(i > heroIdx ? 1 : -1);
    setHeroIdx(i);
  };

  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -60 : 60,
    }),
  };

  return (
    <div
      className="relative z-[5] grid grid-cols-[42%_58%] h-full"
      style={{ overflow: "visible" }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`hero-left-${heroIdx}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center items-start gap-[clamp(4px,0.8vw,12px)] overflow-hidden absolute inset-0"
          style={{
            padding: "clamp(8px, 1.5vw, 20px) clamp(12px, 2.5vw, 40px)",
            width: "42%",
          }}
        >
          {/* Logo do jogo */}
          <motion.img
            src={isBR ? current.logoBR : current.logoIN}
            alt={isBR ? current.labelBR : current.labelEN}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="object-contain"
            style={{
              width: "clamp(100px, 20vw, 340px)",
              maxHeight: "40%",
              height: "auto",
              filter: "drop-shadow(0 0 16px rgba(212,168,67,0.5))",
            }}
          />

          {/* Subtitulo */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="m-0 leading-relaxed max-w-[90%]"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(8px, 1vw, 14px)",
              color: "rgba(255,215,0,0.7)",
            }}
          >
            {isBR ? current.descBR : current.descEN}
          </motion.p>

          {/* Botao JOGAR AGORA -- PNG original, menor */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
            whileTap={{ scale: 0.97 }}
            onMouseDown={() => setBtnPressed(true)}
            onMouseUp={() => setBtnPressed(false)}
            onMouseLeave={() => setBtnPressed(false)}
            className="relative border-none cursor-pointer flex items-center justify-center p-0"
            style={{
              background: "none",
              width: "clamp(80px, 13vw, 200px)",
              aspectRatio: "829 / 234",
              backgroundImage: `url(${btnPressed ? UI.btnActive : UI.btnDisabled})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <span
              className="pointer-events-none"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(6px, 0.85vw, 13px)",
                fontWeight: 900,
                color: "#FFD700",
                textShadow:
                  "0 0 8px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "2px",
              }}
            >
              {isBR ? "JOGAR AGORA" : "PLAY NOW"}
            </span>
          </motion.button>

          {/* Hero dots */}
          <div className="flex gap-1.5 mt-[2px]">
            {HERO_GAMES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.3 }}
                className="p-0 cursor-pointer rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  border: "1px solid #D4A843",
                  background:
                    i === heroIdx ? "#FFD700" : "rgba(212,168,67,0.2)",
                  boxShadow:
                    i === heroIdx ? "0 0 8px rgba(255,215,0,0.6)" : "none",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LADO DIREITO: Imagem com Pedestal */}
      <div
        className="flex items-end justify-center relative"
        style={{ gridColumn: 2, overflow: "visible" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-right-${heroIdx}`}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-end justify-center relative w-full h-full"
          >
            {/* Glow atras */}
            <div
              className="absolute w-[60%] h-[60%] rounded-full animate-breathe"
              style={{
                top: "20%",
                background:
                  "radial-gradient(circle, rgba(0,230,118,0.15) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <motion.img
              src={current.pedestalUrl}
              alt={isBR ? current.labelBR : current.labelEN}
              onError={(e) => {
                console.log("[v0] Pedestal image failed to load:", current.pedestalUrl);
                console.log("[v0] Current game:", current.cardName, "id:", current.id);
              }}
              onLoad={() => {
                console.log("[v0] Pedestal image loaded OK:", current.pedestalUrl);
              }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-[2] object-contain object-bottom"
              style={{
                maxHeight: "115%",
                maxWidth: "100%",
                filter:
                  "drop-shadow(0 0 20px rgba(212,168,67,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
