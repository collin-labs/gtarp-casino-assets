"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UI } from "@/lib/assets";
import { GAMES } from "@/lib/games";
import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import GameCarousel from "./GameCarousel";
import Dock from "./Dock";
import GoldParticles from "./GoldParticles";
import GameModal from "./GameModal";

export default function BlackoutCasino() {
  const [lang, setLang] = useState<"br" | "in">("br");
  const [activeTab, setActiveTab] = useState(0);
  const [jackpot, setJackpot] = useState(75823.94);
  const [panelSize, setPanelSize] = useState({ w: 0, h: 0 });
  const [selectedGame, setSelectedGame] = useState<(typeof GAMES)[number] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Medir painel para Canvas
  useEffect(() => {
    const measure = () => {
      if (panelRef.current) {
        const r = panelRef.current.getBoundingClientRect();
        setPanelSize({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Jackpot incrementa
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpot((prev) => prev + (Math.random() * 2 + 0.5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* CAMADA 0+1: OVERLAY ESCURO (fullscreen) */}
      <div
        className="fixed overflow-hidden"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(3px)",
          fontFamily: "var(--font-cinzel)",
        }}
      >
        {/* Wrapper relativo para dock posicionado na borda */}
        <div style={{ position: "relative" }}>
          {/* CAMADA 2+3: PAINEL FLUTUANTE */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden animate-border-glow"
            style={{
              width: "80vw",
              maxWidth: "1600px",
              height: "calc(80vw * 9 / 16)",
              maxHeight: "85vh",
              borderRadius: "18px",
              border: "1.5px solid #D4A843",
              outline: "1.5px solid rgba(191,149,63,0.45)",
              outlineOffset: "4px",
              boxShadow:
                "0 0 25px rgba(212,168,67,0.2), 0 0 50px rgba(212,168,67,0.08), inset 0 0 60px rgba(0,0,0,0.4)",
              backgroundImage: `url("${UI.bg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "grid",
              gridTemplateRows: "12fr 1px 42fr 1px 44fr",
              position: "relative",
            }}
          >
            {/* Escurecimento leve sobre o fundo */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[15px]"
              style={{ background: "rgba(0,0,0,0.15)", zIndex: 0 }}
            />
            {/* Vignette interna */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[18px]"
              style={{
                zIndex: 1,
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
              }}
            />

            {/* Particulas douradas melhoradas */}
            <GoldParticles width={panelSize.w} height={panelSize.h} />

            {/* HEADER */}
            <Header lang={lang} setLang={setLang} />

            {/* Divisoria 1 + Letreiro sobreposto */}
            <div className="z-[5] relative">
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent 5%, #D4A843 20%, rgba(212,168,67,0.3) 38%, transparent 42%, transparent 58%, rgba(212,168,67,0.3) 62%, #D4A843 80%, transparent 95%)",
                }}
              />
              {/* Letreiro PNG centralizado -- mais compacto e elegante */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -40%)",
                  width: "clamp(200px, 28vw, 420px)",
                  zIndex: 10,
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={UI.letreiro}
                    alt="Jackpot"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      filter: "drop-shadow(0 0 12px rgba(0,230,118,0.25))",
                    }}
                  />
                  {/* Valor centralizado */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <motion.span
                      key={Math.floor(jackpot)}
                      initial={{ opacity: 0.7, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="animate-pulse-glow"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "clamp(10px, 1.6vw, 22px)",
                        color: "#FFD700",
                        textShadow:
                          "0 0 12px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.2)",
                        whiteSpace: "nowrap",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {lang === "br"
                        ? `R$ ${jackpot
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            .replace(/\.(\d{2})$/, ",$1")}`
                        : `R$ ${jackpot
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO */}
            <HeroCarousel lang={lang} />

            {/* Divisoria 2 */}
            <div
              className="z-[5]"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 5%, #D4A843 30%, #FFD700 50%, #D4A843 70%, transparent 95%)",
                opacity: 0.5,
              }}
            />

            {/* CARROSSEL */}
            <GameCarousel lang={lang} onGameSelect={setSelectedGame} />

            {/* BANDEIRAS -- canto inferior direito com hover neon */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(12px, 2vw, 24px)",
                right: "clamp(12px, 2vw, 24px)",
                zIndex: 15,
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {(
                [
                  ["br", UI.flagBR],
                  ["in", UI.flagEN],
                ] as const
              ).map(([key, src]) => (
                <motion.button
                  key={key}
                  onClick={() => setLang(key as "br" | "in")}
                  whileHover={{
                    scale: 1.12,
                    filter: "brightness(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.6))",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer p-0 bg-transparent border-none"
                  style={{
                    width: "clamp(24px, 2.2vw, 34px)",
                    height: "clamp(24px, 2.2vw, 34px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    filter:
                      lang === key
                        ? "brightness(1.1) drop-shadow(0 0 6px rgba(255,215,0,0.4))"
                        : "brightness(0.3) grayscale(0.8)",
                    transition: "filter 0.3s ease",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* DOCK -- posicionado NA borda inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translate(-50%, 45%)",
              width: "60%",
              zIndex: 20,
              pointerEvents: "auto",
            }}
          >
            <Dock
              lang={lang}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* GAME MODAL -- abertura fullscreen */}
      <AnimatePresence>
        {selectedGame && (
          <GameModal
            game={selectedGame}
            lang={lang}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
