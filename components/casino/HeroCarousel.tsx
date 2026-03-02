"use client";

import { useState, useEffect } from "react";
import { HERO_GAMES, type Game } from "@/lib/games";
import { UI } from "@/lib/assets";

interface HeroProps {
  lang: "br" | "in";
}

export default function HeroCarousel({ lang }: HeroProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [btnPressed, setBtnPressed] = useState(false);
  const isBR = lang === "br";
  const current = HERO_GAMES[heroIdx];

  // Auto-rotation 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setHeroIdx((prev) => (prev + 1) % HERO_GAMES.length);
        setFade(true);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => {
    if (i === heroIdx) return;
    setFade(false);
    setTimeout(() => {
      setHeroIdx(i);
      setFade(true);
    }, 200);
  };

  return (
    <div
      className="relative z-[5] grid grid-cols-[42%_58%] overflow-hidden h-full transition-opacity duration-300"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {/* ── LADO ESQUERDO: Logo + Subtítulo + Botão ── */}
      <div
        className="flex flex-col justify-center items-start gap-[clamp(4px,0.8vw,12px)] overflow-hidden"
        style={{
          padding: "clamp(8px, 1.5vw, 20px) clamp(12px, 2.5vw, 40px)",
          animation: fade ? "fadeInUp 0.5s ease forwards" : "none",
        }}
      >
        {/* Logo do jogo (BR/IN) */}
        <img
          src={isBR ? current.logoBR : current.logoIN}
          alt={isBR ? current.labelBR : current.labelEN}
          className="object-contain drop-shadow-[0_0_16px_rgba(212,168,67,0.5)]"
          style={{ width: "clamp(100px, 20vw, 340px)", maxHeight: "40%", height: "auto" }}
        />

        {/* Subtítulo */}
        <p
          className="m-0 leading-relaxed max-w-[90%]"
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(8px, 1vw, 14px)",
            color: "rgba(255,215,0,0.7)",
          }}
        >
          {isBR ? current.descBR : current.descEN}
        </p>

        {/* Botão JOGAR AGORA */}
        <button
          onMouseDown={() => setBtnPressed(true)}
          onMouseUp={() => setBtnPressed(false)}
          onMouseLeave={() => setBtnPressed(false)}
          className="relative border-none cursor-pointer flex items-center justify-center p-0 group"
          style={{
            background: "none",
            width: "clamp(100px, 18vw, 280px)",
            aspectRatio: "829 / 234",
            backgroundImage: `url(${btnPressed ? UI.btnDisabled : UI.btnActive})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transition: "transform 0.1s, filter 0.1s",
            transform: btnPressed ? "scale(0.97)" : "scale(1)",
            filter: btnPressed ? "brightness(0.9)" : "brightness(1)",
          }}
          onMouseEnter={(e) => {
            if (!btnPressed) {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.12)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
            }
          }}
        >
          <span
            className="pointer-events-none"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(8px, 1.2vw, 18px)",
              fontWeight: 900,
              color: "#FFFFFF",
              textShadow: "0 0 8px rgba(0,230,118,0.6), 0 2px 4px rgba(0,0,0,0.8)",
              letterSpacing: "2px",
            }}
          >
            {isBR ? "JOGAR AGORA" : "PLAY NOW"}
          </span>
        </button>

        {/* Hero dots */}
        <div className="flex gap-1.5 mt-[2px]">
          {HERO_GAMES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="p-0 cursor-pointer rounded-full transition-all duration-300"
              style={{
                width: "8px",
                height: "8px",
                border: "1px solid #D4A843",
                background: i === heroIdx ? "#FFD700" : "rgba(212,168,67,0.2)",
                animation: i === heroIdx ? "dotPulse 2s ease-in-out infinite" : "none",
                boxShadow: i === heroIdx ? "0 0 6px rgba(255,215,0,0.6)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── LADO DIREITO: Imagem Dourada 3D ── */}
      <div
        className="flex items-center justify-center relative"
        style={{ animation: fade ? "scaleIn 0.6s ease forwards" : "none" }}
      >
        {/* Glow atrás */}
        <div
          className="absolute w-[60%] h-[60%] rounded-full animate-breathe"
          style={{
            background:
              "radial-gradient(circle, rgba(0,230,118,0.15) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <img
          src={current.goldUrl}
          alt={isBR ? current.labelBR : current.labelEN}
          className="relative z-[2] object-contain animate-float"
          style={{
            maxHeight: "88%",
            maxWidth: "85%",
            filter:
              "drop-shadow(0 0 20px rgba(212,168,67,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
          }}
        />
      </div>
    </div>
  );
}
