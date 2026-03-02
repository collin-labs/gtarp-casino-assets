"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_GAMES } from "@/lib/games";

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
      className="relative z-[5] grid grid-cols-[42%_58%] overflow-hidden h-full"
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

          {/* Botao JOGAR AGORA -- dourado, compacto */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 0 20px rgba(212,168,67,0.6), 0 0 40px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            onMouseDown={() => setBtnPressed(true)}
            onMouseUp={() => setBtnPressed(false)}
            onMouseLeave={() => setBtnPressed(false)}
            className="relative cursor-pointer flex items-center justify-center animate-border-glow"
            style={{
              background: btnPressed
                ? "linear-gradient(180deg, rgba(139,105,20,0.9) 0%, rgba(80,60,10,0.95) 100%)"
                : "linear-gradient(180deg, rgba(212,168,67,0.15) 0%, rgba(139,105,20,0.25) 50%, rgba(80,60,10,0.4) 100%)",
              border: "1.5px solid #D4A843",
              borderRadius: "6px",
              padding: "clamp(4px, 0.5vw, 8px) clamp(14px, 2vw, 32px)",
              boxShadow:
                "0 0 12px rgba(212,168,67,0.3), 0 0 25px rgba(212,168,67,0.1), inset 0 1px 0 rgba(255,215,0,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.12) 45%, rgba(255,215,0,0.2) 50%, rgba(255,215,0,0.12) 55%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
            <span
              className="pointer-events-none relative z-[1]"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(7px, 0.9vw, 14px)",
                fontWeight: 900,
                color: "#FFD700",
                textShadow:
                  "0 0 8px rgba(255,215,0,0.5), 0 1px 3px rgba(0,0,0,0.8)",
                letterSpacing: "2.5px",
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

      {/* LADO DIREITO: Imagem Dourada */}
      <div
        className="flex items-center justify-center relative"
        style={{ gridColumn: 2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-right-${heroIdx}`}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative w-full h-full"
          >
            {/* Glow atras */}
            <div
              className="absolute w-[60%] h-[60%] rounded-full animate-breathe"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,230,118,0.15) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <motion.img
              src={current.goldUrl}
              alt={isBR ? current.labelBR : current.labelEN}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-[2] object-contain"
              style={{
                maxHeight: "88%",
                maxWidth: "85%",
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
