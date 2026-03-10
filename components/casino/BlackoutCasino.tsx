"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { UI } from "@/lib/assets";
import { GAMES, TAB_GAMES, TAB_LAYOUTS, TAB_HERO_GAMES } from "@/lib/games";
// Header removido na Fase 1 — saldo e logo migram para Dock na Fase 2
import HeroCarousel from "./HeroCarousel";
import BentoGrid from "./BentoGrid";
import Dock from "./Dock";
import GoldParticles from "./GoldParticles";
import GameModal from "./GameModal";
import SlotsGame from "@/components/games/slots/SlotsGame";
import CasesGame from "@/components/games/cases/CasesGame";
import { useRipple } from "@/hooks/use-ripple";
import { useSoundManager } from "@/hooks/use-sound-manager";

export default function BlackoutCasino() {
  const [lang, setLang] = useState<"br" | "in">("br");
  const [activeTab, setActiveTab] = useState(0);
  const [panelSize, setPanelSize] = useState({ w: 0, h: 0 });
  const [selectedGame, setSelectedGame] = useState<(typeof GAMES)[number] | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const [mouseXY, setMouseXY] = useState({ x: -9999, y: -9999 });

  // ── FASE 7: Spotlight cursor (Framer Motion values) ──
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(circle 350px at ${spotlightX}px ${spotlightY}px, rgba(212,168,67,0.04) 0%, transparent 70%)`;

  // ── FASE 8: Ripple + Sons ──
  const ripple = useRipple();
  const sound = useSoundManager();

  // ── FASE 9: Sequencia cinematografica de entrada ──
  const [introStage, setIntroStage] = useState(0);
  // 0=nada, 1=overlay, 2=painel, 3=letreiro, 4=dock (tudo visivel)
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStage(1), 50);    // overlay
    const t2 = setTimeout(() => setIntroStage(2), 150);   // painel
    const t3 = setTimeout(() => setIntroStage(3), 600);   // letreiro
    const t4 = setTimeout(() => setIntroStage(4), 850);   // dock
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

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

  // ── FASE 7: Rastrear mouse relativo ao painel (para partículas + spotlight) ──
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let rafId = 0;
    const handleMove = (e: MouseEvent) => {
      const r = panel.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mousePos.current = { x, y };
      // Spotlight (Framer Motion — sem re-render)
      spotlightX.set(x);
      spotlightY.set(y);
      // Partículas (state throttled via rAF)
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setMouseXY({ x, y }));
    };
    const handleLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
      setMouseXY({ x: -9999, y: -9999 });
    };
    panel.addEventListener("mousemove", handleMove);
    panel.addEventListener("mouseleave", handleLeave);
    return () => {
      panel.removeEventListener("mousemove", handleMove);
      panel.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* CAMADA 0+1: OVERLAY ESCURO (fullscreen) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introStage >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
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
        {/* Wrapper relativo para dock e letreiro posicionados na borda */}
        <div style={{ position: "relative" }}>
          {/* CAMADA 2+3: PAINEL FLUTUANTE */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={introStage >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 40 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden animate-border-glow"
            style={{
              width: "80vw",
              maxWidth: "1600px",
              height: "calc(80vw * 8 / 16)",
              maxHeight: "78vh",
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
              gridTemplateRows: "1fr",
              gridTemplateColumns: "minmax(0, 1fr)",
              position: "relative",
            }}
          >
            {/* Mask the bottom border center where dock sits */}
            <div
              className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 z-[6] pointer-events-none"
              style={{
                width: "40%",
                height: "6px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.78) 15%, rgba(0,0,0,0.78) 85%, transparent 100%)",
              }}
            />

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

            {/* FASE 7: Spotlight cursor — luz sutil segue o mouse */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-[18px]"
              style={{
                zIndex: 1,
                background: spotlightBg,
              }}
            />

            {/* Particulas douradas melhoradas */}
            <GoldParticles width={panelSize.w} height={panelSize.h} mouseX={mouseXY.x} mouseY={mouseXY.y} />

            {/* FASE 7: Scan line dourada HUD */}
            <div
              className="absolute left-0 right-0 pointer-events-none animate-scanline"
              style={{
                height: "2px",
                background: "linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.15) 20%, rgba(212,168,67,0.3) 50%, rgba(212,168,67,0.15) 80%, transparent 95%)",
                boxShadow: "0 0 8px rgba(212,168,67,0.15), 0 0 16px rgba(212,168,67,0.06)",
                zIndex: 3,
              }}
            />

            {/* HEADER removido — Fase 1 */}

            {/* BENTO GRID — layout por aba (Fase 3) */}
            <BentoGrid
              games={TAB_GAMES[activeTab] || []}
              layout={TAB_LAYOUTS[activeTab] || "arcade"}
              lang={lang}
              onGameSelect={(game) => { sound.play("click"); setSelectedGame(game); }}
              heroContent={
                (TAB_HERO_GAMES[activeTab]?.length > 0) ? (
                  <HeroCarousel lang={lang} games={TAB_HERO_GAMES[activeTab]} onGameSelect={(game) => { sound.play("click"); setSelectedGame(game); }} activeTab={activeTab} />
                ) : undefined
              }
            />

            {/* BANDEIRAS — canto inferior esquerdo do painel */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(10px, 1.5vw, 20px)",
                left: "clamp(12px, 1.5vw, 24px)",
                zIndex: 15,
                display: "flex",
                gap: "clamp(5px, 0.5vw, 8px)",
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
                  onClick={() => { sound.play("click"); setLang(key as "br" | "in"); }}
                  whileHover={{
                    scale: 1.12,
                    filter: "brightness(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.6))",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer p-0 bg-transparent border-none"
                  title={key === "br" ? "Português" : "English"}
                  style={{
                    width: "clamp(22px, 2vw, 32px)",
                    height: "clamp(22px, 2vw, 32px)",
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

            {/* SALDO GCoin — canto inferior direito do painel */}
            <motion.div
              whileHover={{
                boxShadow:
                  "0 0 25px rgba(0,230,118,0.3), 0 0 15px rgba(212,168,67,0.4), inset 0 0 10px rgba(0,0,0,0.4)",
                borderColor: "rgba(0,230,118,0.8)",
              }}
              style={{
                position: "absolute",
                bottom: "clamp(10px, 1.5vw, 20px)",
                right: "clamp(12px, 1.5vw, 24px)",
                zIndex: 15,
                background:
                  "linear-gradient(135deg, rgba(10,18,8,0.95), rgba(5,12,3,0.98))",
                border: "1.5px solid rgba(212,168,67,0.6)",
                borderRadius: "12px",
                padding: "6px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow:
                  "0 0 15px rgba(212,168,67,0.2), inset 0 1px 0 rgba(255,215,0,0.1), inset 0 0 10px rgba(0,0,0,0.4)",
                cursor: "default",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(12px, 1.3vw, 18px)",
                  filter: "drop-shadow(0 0 4px rgba(0,230,118,0.5))",
                }}
              >
                🪙
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(11px, 1.2vw, 17px)",
                  color: "#00E676",
                  fontWeight: 700,
                  textShadow: "0 0 10px rgba(0,230,118,0.5), 0 0 20px rgba(0,230,118,0.2)",
                  letterSpacing: "1.5px",
                }}
              >
                509
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(7px, 0.7vw, 10px)",
                  color: "rgba(212,168,67,0.7)",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  marginLeft: "-4px",
                }}
              >
                GC
              </span>
            </motion.div>

            {/* GAME LOADING SCREEN — dentro do painel, cobre tudo */}
            <AnimatePresence>
              {selectedGame && !activeGame && (
                <GameModal
                  game={selectedGame}
                  lang={lang}
                  onClose={() => { sound.play("click"); setSelectedGame(null); }}
                  onPlay={() => {
                    sound.play("success");
                    const name = selectedGame.cardName.toLowerCase();
                    const gameMap: Record<string, string> = { "slots": "slots", "crash": "crash", "cases": "cases", "caixas": "cases" };
                    setActiveGame(gameMap[name] || name);
                    setSelectedGame(null);
                  }}
                />
              )}
            </AnimatePresence>

            {/* JOGO ATIVO — renderiza dentro do painel */}

            {/* FASE 7: Light leak — vazamento de luz dourada nos cantos */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-15%",
                right: "-8%",
                width: "35%",
                height: "50%",
                background: "radial-gradient(ellipse at center, rgba(212,168,67,0.05) 0%, transparent 70%)",
                filter: "blur(30px)",
                animation: "light-leak-drift 12s ease-in-out infinite",
                zIndex: 1,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: "-10%",
                left: "-6%",
                width: "30%",
                height: "40%",
                background: "radial-gradient(ellipse at center, rgba(0,230,118,0.03) 0%, transparent 70%)",
                filter: "blur(25px)",
                animation: "light-leak-drift 15s ease-in-out infinite reverse",
                zIndex: 1,
              }}
            />
          </motion.div>

          {/* SLOTS GAME */}
          {activeGame === "slots" && (
            <div style={{ position: "absolute", inset: 0, zIndex: 60, borderRadius: "inherit", overflow: "hidden" }}>
              <SlotsGame onBack={() => setActiveGame(null)} lang={lang} />
            </div>
          )}

          {/* CASES GAME */}
          {activeGame === "cases" && (
            <div style={{ position: "absolute", inset: 0, zIndex: 60, borderRadius: "inherit", overflow: "hidden" }}>
              <CasesGame onBack={() => setActiveGame(null)} lang={lang} />
            </div>
          )}

          {/* LETREIRO -- fora do painel, na borda entre header e hero */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translate(-50%, -60%)",
              width: "clamp(200px, 28vw, 420px)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -35, scale: 0.8 }}
              animate={
                (selectedGame || activeGame)
                  ? { opacity: 0, y: -20, scale: 0.9 }
                  : introStage >= 3
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: -35, scale: 0.8 }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
            <div style={{ position: "relative" }}>
              {/* FASE 2: Halo dourado pulsante atrás do letreiro */}
              <div
                className="letreiro-halo"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "160%",
                  height: "250%",
                  background: "radial-gradient(ellipse at center, rgba(212,168,67,0.3) 0%, rgba(255,215,0,0.1) 30%, rgba(212,168,67,0.04) 50%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <img
                src={UI.letreiro}
                alt="Letreiro"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 0 12px rgba(212,168,67,0.4)) drop-shadow(0 0 25px rgba(212,168,67,0.15))",
                  position: "relative",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: "20px",
                  overflow: "hidden",
                  zIndex: 2,
                  maskImage: "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                }}
              >
                <div
                  className="animate-marquee"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {[0, 1].map((copy) => (
                    <span
                      key={copy}
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        fontWeight: 700,
                        fontSize: "clamp(9px, 1.3vw, 18px)",
                        color: "#FFD700",
                        textShadow:
                          "0 0 12px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.2)",
                        letterSpacing: "3px",
                        paddingRight: "80px",
                      }}
                    >
                      {lang === "br"
                        ? "✦ BLACKOUT CASINO ✦ O CASSINO MAIS EXCLUSIVO DE LOS SANTOS ✦ FORTUNA FAVORECE OS AUDACIOSOS ✦ VIP UNDERGROUND ✦ ONDE LENDAS SÃO FEITAS ✦ HIGH STAKES ✦ SEM LIMITES ✦"
                        : "✦ BLACKOUT CASINO ✦ THE MOST EXCLUSIVE CASINO IN LOS SANTOS ✦ FORTUNE FAVORS THE BOLD ✦ VIP UNDERGROUND ✦ WHERE LEGENDS ARE MADE ✦ HIGH STAKES ✦ NO LIMITS ✦"
                      }
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          </div>

          {/* DOCK -- posicionado NA borda inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translate(-50%, 42%)",
              width: "60%",
              zIndex: 20,
              pointerEvents: (selectedGame || activeGame) ? "none" : "auto",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={
                (selectedGame || activeGame)
                  ? { opacity: 0, y: 40, scale: 0.9 }
                  : introStage >= 4
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
              }
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
            <Dock
              lang={lang}
              activeTab={activeTab}
              setActiveTab={(tab) => { sound.play("tab"); setActiveTab(tab); }}
            />
          </motion.div>
          </div>
        </div>
      </motion.div>

    </>
  );
}