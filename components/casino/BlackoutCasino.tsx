"use client";

import { useState, useEffect, useRef } from "react";
import { UI } from "@/lib/assets";
import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import GameCarousel from "./GameCarousel";
import Dock from "./Dock";
import GoldParticles from "./GoldParticles";

export default function BlackoutCasino() {
  const [lang, setLang] = useState<"br" | "in">("br");
  const [activeTab, setActiveTab] = useState(0);
  const [jackpot, setJackpot] = useState(75823.94);
  const [panelSize, setPanelSize] = useState({ w: 0, h: 0 });
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

  // Divisória dourada reutilizável
  const Divider = () => (
    <div
      className="z-[5]"
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, transparent 5%, #D4A843 30%, #FFD700 50%, #D4A843 70%, transparent 95%)",
        opacity: 0.5,
      }}
    />
  );

  return (
    <>
      {/* ═══ CAMADA 0+1: OVERLAY ESCURO (fullscreen) ═══ */}
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
        {/* ═══ CAMADA 2+3: PAINEL FLUTUANTE ═══ */}
        <div
          ref={panelRef}
          className="relative overflow-hidden animate-border-glow"
          style={{
            width: "80vw",
            maxWidth: "1600px",
            height: "calc(80vw * 9 / 16)",
            maxHeight: "85vh",
            borderRadius: "18px",
            // Borda dourada dupla — estilo igual às divisórias internas
            border: "1.5px solid #D4A843",
            outline: "1.5px solid rgba(191,149,63,0.45)",
            outlineOffset: "4px",
            // Sombra glow dourado + profundidade
            boxShadow: "0 0 25px rgba(212,168,67,0.2), 0 0 50px rgba(212,168,67,0.08), inset 0 0 60px rgba(0,0,0,0.4)",
            backgroundImage: `url("${UI.bg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // Grid macro
            display: "grid",
            gridTemplateRows: "12fr 1px 42fr 1px 44fr",
            position: "relative",
          }}
        >
          {/* Escurecimento leve sobre o fundo */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[15px]"
            style={{
              background: "rgba(0,0,0,0.15)",
              zIndex: 0,
            }}
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

          {/* Partículas douradas (Canvas) */}
          <GoldParticles width={panelSize.w} height={panelSize.h} />

          {/* ═══ HEADER ═══ */}
          <Header lang={lang} setLang={setLang} />

          {/* Divisória 1 + Letreiro sobreposto */}
          <div className="z-[5] relative">
            {/* Linha com fade no centro (onde o letreiro fica) */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent 5%, #D4A843 20%, rgba(212,168,67,0.3) 38%, transparent 42%, transparent 58%, rgba(212,168,67,0.3) 62%, #D4A843 80%, transparent 95%)",
              }}
            />
            {/* Letreiro PNG centralizado — levemente abaixo da linha */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -40%)",
                width: "clamp(250px, 35vw, 500px)",
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
                    filter: "drop-shadow(0 0 15px rgba(0,230,118,0.3))",
                  }}
                />
                {/* Só o valor, grande e centralizado */}
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
                  <span
                    className="animate-pulse-glow"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "clamp(12px, 2vw, 28px)",
                      color: "#FFD700",
                      textShadow: "0 0 12px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.2)",
                      whiteSpace: "nowrap",
                      letterSpacing: "2px",
                    }}
                  >
                    {lang === "br"
                      ? `R$ ${jackpot.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(\d{2})$/, ",$1")}`
                      : `R$ ${jackpot.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ HERO ═══ */}
          <HeroCarousel lang={lang} />

          {/* Divisória 2 */}
          <Divider />

          {/* ═══ CARROSSEL ═══ */}
          <GameCarousel lang={lang} />

          {/* ═══ BANDEIRAS — canto inferior direito ═══ */}
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
            {([["br", UI.flagBR], ["in", UI.flagEN]] as const).map(([key, src]) => (
              <button
                key={key}
                onClick={() => setLang(key as "br" | "in")}
                className="cursor-pointer transition-all duration-300 p-0 bg-transparent border-none"
                style={{
                  width: "clamp(24px, 2.2vw, 34px)",
                  height: "clamp(24px, 2.2vw, 34px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  filter: lang === key ? "brightness(1.1)" : "brightness(0.3) grayscale(0.8)",
                }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ DOCK — posicionado NA borda inferior, estilo letreiro ═══ */}
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
          <Dock lang={lang} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      </div>
    </>
  );
}
