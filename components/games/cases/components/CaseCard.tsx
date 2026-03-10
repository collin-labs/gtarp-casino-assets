"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import RarityBadge from "./RarityBadge";
import Tooltip from "./Tooltip";

// ── Mapa de backgrounds temáticos por caixa ──
const CASE_BACKGROUNDS: Record<number, string> = {
  1: "/assets/cases/backgrounds/case-bg-arsenal.png",
  2: "/assets/cases/backgrounds/case-bg-garagem.png",
  3: "/assets/cases/backgrounds/case-bg-pacote.png",
  4: "/assets/cases/backgrounds/case-bg-cofre.png",
  5: "/assets/cases/backgrounds/case-bg-noturna.png",
  6: "/assets/cases/backgrounds/case-bg-diaria.png",
};

function getCaseStates(imageUrl: string | null) {
  if (!imageUrl) return { closed: null, semi: null, open: null };
  return {
    closed: imageUrl,
    semi: imageUrl.replace("-FECHADA", "-SEMI-ABERTA"),
    open: imageUrl.replace("-FECHADA", "-ABERTA"),
  };
}

interface CaseCardProps {
  caseData: {
    id: number; name: string; price: number; image_url: string | null;
    theme_color: string; category: string; item_count: number;
    preview: { name: string; rarity: string; rarity_color: string; value: number }[];
  };
  isBR: boolean;
  onClick: () => void;
  isHero?: boolean;
}

export default function CaseCard({ caseData, isBR, onClick, isHero }: CaseCardProps) {
  const isFree = caseData.category === "daily_free";
  const tc = caseData.theme_color || "#D4A843";
  const rgb = hexToRgb(tc);
  const states = getCaseStates(caseData.image_url);
  const [hovered, setHovered] = useState(false);
  const [caseStage, setCaseStage] = useState<0 | 1 | 2>(0); // 0=fechada, 1=semi, 2=aberta
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const bgUrl = CASE_BACKGROUNDS[caseData.id] || "";

  // Loop automático dos 3 estados no hover
  useEffect(() => {
    if (!hovered) {
      setCaseStage(0);
      return;
    }
    // Sequência: 0→1 (0.4s) → 1→2 (0.6s) → 2→0 (0.8s) → loop
    const timings = [400, 600, 800];
    let stage = 0;
    setCaseStage(1); // Começa mostrando semi-aberta
    stage = 1;

    const tick = () => {
      const nextStage = ((stage + 1) % 3) as 0 | 1 | 2;
      setCaseStage(nextStage);
      stage = nextStage;
    };

    let timeout: NodeJS.Timeout;
    const loop = () => {
      timeout = setTimeout(() => {
        tick();
        loop();
      }, timings[stage]);
    };
    loop();

    return () => clearTimeout(timeout);
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
      <motion.div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        whileHover={isHero ? { y: -3, scale: 1.02 } : { y: -6, scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative overflow-hidden cursor-pointer"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "14px",
          border: hovered
            ? `2px solid rgba(${rgb},0.7)`
            : `2px solid rgba(${rgb},0.3)`,
          outline: hovered
            ? `1px solid rgba(${rgb},0.4)`
            : `1px solid rgba(${rgb},0.08)`,
          outlineOffset: "2px",
          background: "rgba(5,5,5,0.95)",
          boxShadow: hovered
            ? `0 0 25px rgba(${rgb},0.25), 0 12px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(${rgb},0.15), inset 0 0 20px rgba(0,0,0,0.5), 0 -2px 15px rgba(${rgb},0.15)`
            : `0 4px 15px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(${rgb},0.08), inset 0 0 15px rgba(0,0,0,0.4)`,
          transition: "border 0.3s, box-shadow 0.3s, outline 0.3s",
        }}
      >
        {/* Keyframes para animações da caixa */}
        <style>{`
          @keyframes caseFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(0.5deg); }
            50% { transform: translateY(-2px) rotate(-0.3deg); }
            75% { transform: translateY(-5px) rotate(0.2deg); }
          }
          @keyframes caseGlowPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
        `}</style>
        {/* ═══ IMAGEM DE FUNDO TEMÁTICA ═══ */}
        {bgUrl && (
          <img
            src={bgUrl}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              filter: hovered ? "brightness(1.15) saturate(1.1)" : "brightness(0.7)",
              transition: "filter 0.3s",
              borderRadius: "12px",
            }}
          />
        )}

        {/* Gradiente escuro no TOPO */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "50%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
            borderRadius: "12px 12px 0 0",
            zIndex: 2,
          }}
        />

        {/* Gradiente escuro na BASE */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
            borderRadius: "0 0 12px 12px",
            zIndex: 2,
          }}
        />

        {/* ═══ CAIXA PNG — 3 estados + animação idle flutuante ═══ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3,
          display: "flex",
          alignItems: isHero ? "flex-end" : "center",
          justifyContent: "center",
          paddingBottom: isHero ? "18%" : 0,
          pointerEvents: "none",
        }}>
          {/* Glow circular atrás da caixa — pulsa levemente */}
          <div style={{
            position: "absolute",
            width: isHero ? "clamp(180px, 20vw, 320px)" : "clamp(100px, 11vw, 180px)",
            height: isHero ? "clamp(180px, 20vw, 320px)" : "clamp(100px, 11vw, 180px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgb},${hovered ? "0.5" : "0.35"}) 0%, rgba(${rgb},0.12) 40%, transparent 70%)`,
            filter: "blur(15px)",
            animation: "caseGlowPulse 3s ease-in-out infinite",
            transition: "background 0.3s",
          }} />
          {/* Container da caixa com animação idle */}
          <div style={{
            position: "relative",
            width: isHero ? "clamp(150px, 18vw, 280px)" : "clamp(80px, 9vw, 150px)",
            height: isHero ? "clamp(150px, 18vw, 280px)" : "clamp(80px, 9vw, 150px)",
            animation: hovered ? "none" : `caseFloat ${3 + caseData.id * 0.3}s ease-in-out infinite`,
          }}>
            {/* Estado 0: FECHADA */}
            {states.closed && (
              <img src={states.closed} alt={caseData.name} loading="lazy" style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: `drop-shadow(0 8px 25px rgba(${rgb},${hovered ? "1" : "0.6"})) drop-shadow(0 0 15px rgba(${rgb},0.3))`,
                opacity: caseStage === 0 ? 1 : 0,
                transform: caseStage === 0 ? "scale(1)" : "scale(0.9)",
                transition: "opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease",
              }} />
            )}
            {/* Estado 1: SEMI-ABERTA */}
            {states.semi && (
              <img src={states.semi} alt="semi" loading="lazy" style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "contain",
                filter: `drop-shadow(0 12px 35px rgba(${rgb},1)) drop-shadow(0 0 20px rgba(${rgb},0.5)) brightness(1.1)`,
                opacity: caseStage === 1 ? 1 : 0,
                transform: caseStage === 1 ? "scale(1.05) translateY(-3px)" : "scale(0.92)",
                transition: "opacity 0.35s ease, transform 0.4s ease",
              }} />
            )}
            {/* Estado 2: ABERTA */}
            {states.open && (
              <img src={states.open} alt="open" loading="lazy" style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "contain",
                filter: `drop-shadow(0 14px 40px rgba(${rgb},1)) drop-shadow(0 0 25px rgba(${rgb},0.6)) brightness(1.2)`,
                opacity: caseStage === 2 ? 1 : 0,
                transform: caseStage === 2 ? "scale(1.1) translateY(-5px)" : "scale(0.95)",
                transition: "opacity 0.35s ease, transform 0.4s ease",
              }} />
            )}
          </div>
        </div>

        {/* Atmospheric glow bottom */}
        <div style={{
          position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "40%",
          background: `radial-gradient(ellipse, rgba(${rgb},${hovered ? "0.3" : "0.12"}) 0%, transparent 70%)`,
          filter: "blur(20px)", pointerEvents: "none", zIndex: 1, transition: "all 0.3s",
        }} />

        {/* Spotlight cursor */}
        {hovered && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4,
            background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(${rgb},0.2), rgba(${rgb},0.04) 40%, transparent 70%)`,
          }} />
        )}

        {/* Feixo temático permanente na borda inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "3px",
            background: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.3) 20%, ${tc} 50%, rgba(${rgb},0.3) 80%, transparent 95%)`,
            boxShadow: hovered
              ? `0 0 15px rgba(${rgb},0.6), 0 0 30px rgba(${rgb},0.3), 0 -3px 12px rgba(${rgb},0.2)`
              : `0 0 8px rgba(${rgb},0.3), 0 0 15px rgba(${rgb},0.15)`,
            borderRadius: "0 0 12px 12px",
            zIndex: 7,
            transition: "box-shadow 0.3s",
          }}
        />

        {/* Linha superior sutil */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent 10%, rgba(${rgb},0.3) 30%, rgba(${rgb},0.6) 50%, rgba(${rgb},0.3) 70%, transparent 90%)`,
            zIndex: 7,
          }}
        />

        {/* Shimmer sweep no hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none animate-shimmer"
            style={{
              background: `linear-gradient(105deg, transparent 40%, rgba(${rgb},0.06) 45%, rgba(${rgb},0.14) 50%, rgba(${rgb},0.06) 55%, transparent 60%)`,
              backgroundSize: "200% 100%",
              zIndex: 5,
            }}
          />
        )}

        {/* Neon hover top */}
        {hovered && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 8, pointerEvents: "none",
            background: `linear-gradient(90deg, transparent 10%, ${tc} 50%, transparent 90%)`,
            boxShadow: `0 0 12px rgba(${rgb},0.5), 0 2px 8px rgba(${rgb},0.2)`,
          }} />
        )}

        {/* Emboss interno */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none", zIndex: 6,
          boxShadow: `inset 0 1px 0 rgba(${rgb},0.12), inset 0 -1px 0 rgba(${rgb},0.08)`,
        }} />

        {/* ═══ TÍTULO — topo ═══ */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 5,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: isHero ? "clamp(10px, 1.2vw, 16px) 8px" : "clamp(6px, 0.8vw, 12px) 8px",
          fontFamily: "var(--font-cinzel)",
          fontSize: isHero ? "clamp(13px, 1.5vw, 20px)" : "clamp(9px, 1vw, 15px)",
          fontWeight: 900, letterSpacing: "2px",
          textTransform: "uppercase", textAlign: "center",
          color: hovered ? "#FFD700" : tc,
          textShadow: hovered
            ? `0 0 14px rgba(${rgb},0.7), 0 2px 6px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)`
            : `0 0 8px rgba(${rgb},0.4), 0 2px 6px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)`,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)",
          transition: "color 0.3s, text-shadow 0.3s",
          pointerEvents: "none",
          lineHeight: 1.2,
        }}>
          {caseData.name}
        </div>

        {/* ═══ BASE — PREÇO + BADGES ═══ */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: isHero ? "clamp(12px, 1.5vw, 20px)" : "clamp(8px, 1vw, 14px)",
          gap: isHero ? "8px" : "5px", pointerEvents: "none",
        }}>
          {/* Preço — pill dourado */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(0,0,0,0.6)",
            border: isFree ? "1px solid rgba(0,230,118,0.4)" : "1px solid rgba(212,168,67,0.35)",
            borderRadius: "20px",
            padding: isHero ? "4px 16px" : "3px 12px",
            backdropFilter: "blur(4px)",
          }}>
            <span style={{
              fontSize: isHero ? "clamp(9px, 0.9vw, 12px)" : "clamp(7px, 0.7vw, 10px)",
            }}>🪙</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: isHero ? "clamp(18px, 2vw, 28px)" : "clamp(14px, 1.4vw, 20px)",
              fontWeight: 700,
              color: isFree ? "#00E676" : "#FFD700",
              textShadow: isFree
                ? "0 0 14px rgba(0,230,118,0.6)"
                : "0 0 14px rgba(255,215,0,0.6)",
            }}>
              {isFree ? (isBR ? "GRATIS" : "FREE") : caseData.price.toLocaleString("pt-BR")}
            </span>
          </div>
          {/* Badges de raridade */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {caseData.preview?.slice(0, 3).map((item, i) => (
              <RarityBadge key={i} rarity={item.rarity as any} lang={isBR ? "br" : "in"} />
            ))}
          </div>
        </div>

        {/* Daily free pulse */}
        {isFree && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "14px", pointerEvents: "none", zIndex: 6,
            border: "2px solid rgba(0,230,118,0.3)", animation: "breathe 3s ease-in-out infinite",
          }} />
        )}
      </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}
