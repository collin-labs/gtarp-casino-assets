"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game } from "@/lib/games";
import { UI } from "@/lib/assets";

interface HeroProps {
  lang: "br" | "in";
  games: Game[];
  onGameSelect?: (game: Game) => void;
  activeTab?: number;
}

export default function HeroCarousel({ lang, games, onGameSelect, activeTab }: HeroProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [btnPressed, setBtnPressed] = useState(false);
  const [direction, setDirection] = useState(1);
  const [heroHovered, setHeroHovered] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const isBR = lang === "br";
  const current = games[heroIdx];

  const handleHeroEnter = useCallback(() => {
    setHeroHovered(true);
    heroVideoRef.current?.pause();
  }, []);

  const handleHeroLeave = useCallback(() => {
    setHeroHovered(false);
    heroVideoRef.current?.play().catch(() => {});
  }, []);

  // Roleta comeca no segundo 2
  const heroStartOffset: Record<number, number> = { 5: 2 };
  const handleVideoLoaded = useCallback(() => {
    const vid = heroVideoRef.current;
    const offset = heroStartOffset[current.id];
    if (vid && offset) vid.currentTime = offset;
  }, [current.id]);

  useEffect(() => {
    setHeroIdx(0);
  }, [games]);

  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setHeroIdx((prev) => (prev + 1) % games.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [games.length]);

  const goTo = (i: number) => {
    if (i === heroIdx) return;
    setDirection(i > heroIdx ? 1 : -1);
    setHeroIdx(i);
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.95 }),
  };

  return (
    <div
      onMouseEnter={current.heroVideo ? handleHeroEnter : undefined}
      onMouseLeave={current.heroVideo ? handleHeroLeave : undefined}
      style={{
        position: "relative", 
        zIndex: 5,
        width: "100%",
        height: "100%",
        overflow: "clip",
      }}
    >
      {/* Video hero — cobre o hero inteiro, texto fica por cima */}
      {current.heroVideo && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <video
            ref={heroVideoRef}
            src={current.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleVideoLoaded}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: heroHovered ? 0.6 : 1,
              transition: "opacity 0.4s ease",
            }}
          />
        </div>
      )}
      {/* ========================================== */}
      {/* LADO ESQUERDO — Logo + Subtitle + Button   */}
      {/* ========================================== */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`hero-left-${heroIdx}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "42%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "clamp(1px, 0.3vw, 4px)",
            zIndex: 2,
            paddingTop: "clamp(6px, 1vw, 16px)",
            paddingLeft: "clamp(6px, 1vw, 16px)",
          }}
        >
          {/* Logo do jogo */}
          <motion.img
            src={isBR ? current.logoBR : current.logoIN}
            alt={isBR ? current.labelBR : current.labelEN}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            draggable={false}
            style={{
              width: "clamp(140px, 25vw, 400px)",
              maxHeight: "85%",
              marginTop: activeTab === 1 ? "clamp(28px, 1vw, 16px)" : 0,
              marginBottom: activeTab === 0 
                ? "clamp(-35px, -3.5vw, -10px)" 
                : activeTab === 1 
                  ? "clamp(-15px, -1.5vw, -4px)" 
                  : 0,
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 16px rgba(212,168,67,0.5))",
            }}
          />

          {/* Wrapper centraliza subtitle+botão com a largura da logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "clamp(140px, 25vw, 400px)" }}>
            {/* Subtitulo */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                margin: "0 0 clamp(8px, 1vw, 14px) 0",
                maxWidth: "90%",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(10px, 1vw, 24px)",
                lineHeight: 1.4,
                color: "rgba(255,215,0,0.7)",
                textAlign: "center",
              }}
            >
              {isBR ? current.descBR : current.descEN}
            </motion.p>

            {/* Botao JOGAR AGORA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
              whileTap={{ scale: 0.97 }}
              onMouseDown={() => setBtnPressed(true)}
              onMouseUp={() => { setBtnPressed(false); onGameSelect?.(current); }}
              onMouseLeave={() => setBtnPressed(false)}
              style={{
                position: "relative",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                background: "none",
                width: "clamp(80px, 13vw, 200px)",
                aspectRatio: "829 / 234",
                backgroundImage: `url(${btnPressed ? UI.btnActive : UI.btnDisabled})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="cta-pulse"
            >
              {/* Fio de luz girando na borda */}
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
                    background: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #00E676 80%, #FFD700 90%, transparent 100%)",
                    animation: "spin 3s linear infinite",
                  }}
                />
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(6px, 0.85vw, 13px)",
                  fontWeight: 900,
                  color: "#FFD700",
                  textShadow:
                    "0 0 8px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
                  letterSpacing: "2px",
                  marginTop: "-8px",
                }}
              >
                {isBR ? "JOGAR AGORA" : "PLAY NOW"}
              </span>
            </motion.button>
          </div>

          {/* Dots (só aparece se mais de 1 jogo) */}
          {games.length > 1 && (
          <div style={{ display: "flex", gap: "6px", marginTop: "2px", width: "clamp(140px, 25vw, 400px)", justifyContent: "center" }}>
            {games.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.3 }}
                style={{
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "50%",
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
          )}
        </motion.div>
      </AnimatePresence>

      {/* ========================================== */}
      {/* LADO DIREITO — Pedestal (so quando nao tem heroVideo) */}
      {/* ========================================== */}
      {!current.heroVideo && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "58%",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-right-${heroIdx}`}
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* Glow */}
              <div
                className="animate-breathe"
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "20%",
                  width: "60%",
                  height: "60%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(0,230,118,0.15) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)",
                  filter: "blur(30px)",
                  pointerEvents: "none",
                }}
              />

              {/* Imagem pedestal */}
              <motion.img
                src={current.pedestalUrl}
                alt={isBR ? current.labelBR : current.labelEN}
                draggable={false}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  zIndex: 2,
                  filter:
                    "drop-shadow(0 0 20px rgba(212,168,67,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}