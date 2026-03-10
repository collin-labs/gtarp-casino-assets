"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ModeSelectProps {
  onSelectMode: (mode: "classic" | "video") => void;
  onBack: () => void;
  isBR: boolean;
}

/* SVG ícone máquina clássica */
function ClassicIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
      {/* Moldura da máquina */}
      <rect x="15" y="10" width="90" height="100" rx="8" fill="url(#goldGrad)" opacity="0.15" stroke="#D4A843" strokeWidth="2"/>
      {/* Visor */}
      <rect x="25" y="25" width="70" height="45" rx="4" fill="#1A1A1A" stroke="#D4A843" strokeWidth="1.5"/>
      {/* 3 reels */}
      <rect x="30" y="30" width="18" height="35" rx="2" fill="#F5F5F0" opacity="0.9"/>
      <rect x="51" y="30" width="18" height="35" rx="2" fill="#F5F5F0" opacity="0.9"/>
      <rect x="72" y="30" width="18" height="35" rx="2" fill="#F5F5F0" opacity="0.9"/>
      {/* 777 */}
      <text x="39" y="52" textAnchor="middle" fill="#FF1744" fontSize="14" fontWeight="bold" fontFamily="serif">7</text>
      <text x="60" y="52" textAnchor="middle" fill="#FF1744" fontSize="14" fontWeight="bold" fontFamily="serif">7</text>
      <text x="81" y="52" textAnchor="middle" fill="#FF1744" fontSize="14" fontWeight="bold" fontFamily="serif">7</text>
      {/* Alavanca */}
      <rect x="108" y="30" width="6" height="40" rx="3" fill="#D4A843"/>
      <circle cx="111" cy="28" r="6" fill="#FFD700"/>
      {/* LEDs */}
      {[28,40,52,64,76,88].map((x,i) => (
        <circle key={i} cx={x} cy="18" r="2.5" fill={i % 2 === 0 ? "#FFD700" : "#FF1744"} opacity="0.8"/>
      ))}
      {/* Botão SPIN */}
      <rect x="40" y="80" width="40" height="16" rx="8" fill="#004D25" stroke="#00E676" strokeWidth="1"/>
      <text x="60" y="91" textAnchor="middle" fill="#00E676" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SPIN</text>
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* SVG ícone grid 6×5 com gemas */
function VideoIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
      {/* Grid background */}
      <rect x="10" y="15" width="100" height="90" rx="6" fill="#111111" stroke="#D4A843" strokeWidth="1.5"/>
      {/* Grid cells 6×5 */}
      {Array.from({length: 6}).map((_, col) =>
        Array.from({length: 5}).map((_, row) => (
          <rect key={`${col}-${row}`}
            x={14 + col * 16} y={19 + row * 16} width="14" height="14" rx="2"
            fill="#1A1A1A" stroke="rgba(212,168,67,0.2)" strokeWidth="0.5"/>
        ))
      )}
      {/* Gemas brilhando (sample) */}
      <circle cx="37" cy="42" r="4" fill="#E53935" opacity="0.8"/>  {/* rubi */}
      <circle cx="69" cy="58" r="4" fill="#00E676" opacity="0.8"/>  {/* esmeralda */}
      <circle cx="53" cy="26" r="4" fill="#FFD700" opacity="0.9"/>  {/* ouro */}
      <circle cx="85" cy="74" r="4" fill="#00E5FF" opacity="0.7"/>  {/* scatter */}
      <circle cx="21" cy="58" r="4" fill="#D4A843" opacity="0.8"/>  {/* ficha */}
      {/* Glow effect */}
      <circle cx="53" cy="26" r="8" fill="rgba(255,215,0,0.2)"/>
      <circle cx="85" cy="74" r="8" fill="rgba(0,229,255,0.15)"/>
      {/* Multiplicador */}
      <circle cx="105" cy="60" r="10" fill="none" stroke="#D4A843" strokeWidth="1.5"/>
      <text x="105" y="64" textAnchor="middle" fill="#FFD700" fontSize="9" fontWeight="bold" fontFamily="serif">x3</text>
    </svg>
  );
}

export default function ModeSelect({ onSelectMode, onBack, isBR }: ModeSelectProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: "classic",
      title: "777 GOLD",
      subtitle: isBR ? "Clássico" : "Classic",
      desc: isBR ? "3 rolos, Hold & Spin, Jackpot" : "3 reels, Hold & Spin, Jackpot",
      icon: <ClassicIcon />,
      badge: null,
    },
    {
      id: "video",
      title: "BLACKOUT FORTUNE",
      subtitle: isBR ? "Video Slot" : "Video Slot",
      desc: isBR ? "6×5 Cluster, Tumble, Free Spins, Bonus Buy" : "6×5 Cluster, Tumble, Free Spins, Bonus Buy",
      icon: <VideoIcon />,
      badge: "PREMIUM",
    },
  ];

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", position: "relative",
    }}>
      {/* Botão voltar */}
      <motion.button
        whileHover={{ scale: 1.15, color: "#FFFFFF" }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        title={isBR ? "Voltar ao menu do cassino" : "Back to casino menu"}
        style={{
          position: "absolute", top: "clamp(12px, 2vh, 24px)", left: "clamp(12px, 2vw, 24px)",
          background: "transparent", border: "none", cursor: "pointer",
          fontSize: "clamp(18px, 2vw, 28px)", color: "#A8A8A8",
          fontFamily: "'Inter', sans-serif", transition: "color 0.2s",
          zIndex: 5,
        }}
      >
        ‹
      </motion.button>

      {/* Título */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(24px, 3vw, 40px)",
          fontWeight: 900, color: "#D4A843", margin: 0,
          textShadow: "0 0 20px rgba(212,168,67,0.4)",
          letterSpacing: "4px",
        }}
      >
        SLOTS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'Inter', sans-serif", fontSize: "clamp(11px, 1.1vw, 15px)",
          color: "#A8A8A8", margin: "clamp(4px, 0.5vw, 8px) 0 clamp(16px, 2vw, 32px)",
        }}
      >
        {isBR ? "Escolha seu modo de jogo" : "Choose your game mode"}
      </motion.p>

      {/* Cards */}
      <div style={{
        display: "flex", gap: "clamp(16px, 2vw, 32px)",
        flexWrap: "wrap", justifyContent: "center",
        padding: "0 clamp(12px, 2vw, 24px)",
      }}>
        {cards.map((card, i) => {
          const isHovered = hoveredCard === card.id;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                width: "clamp(220px, 22vw, 300px)",
                height: "clamp(260px, 28vh, 340px)",
                background: "linear-gradient(180deg, #1A1A1A 0%, #111111 100%)",
                border: `2px solid ${isHovered ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.3)"}`,
                borderRadius: "12px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "space-between",
                padding: "clamp(16px, 1.5vw, 24px)",
                position: "relative", cursor: "pointer",
                boxShadow: isHovered
                  ? "0 0 25px rgba(212,168,67,0.25), inset 0 0 15px rgba(0,0,0,0.3)"
                  : "0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3)",
                transition: "border 0.3s, box-shadow 0.3s",
              }}
              onClick={() => onSelectMode(card.id as "classic" | "video")}
            >
              {/* Badge PREMIUM */}
              {card.badge && (
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "#D4A843", color: "#000",
                  fontSize: "clamp(8px, 0.8vw, 11px)", fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  padding: "2px 8px", borderRadius: "4px",
                  letterSpacing: "1px",
                }}>
                  {card.badge}
                </div>
              )}

              {/* Ícone */}
              <div style={{
                width: "clamp(80px, 9vw, 120px)",
                height: "clamp(80px, 9vw, 120px)",
                flexShrink: 0,
              }}>
                {card.icon}
              </div>

              {/* Textos */}
              <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
                <h2 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: card.id === "video" ? "clamp(14px, 1.5vw, 21px)" : "clamp(16px, 1.7vw, 24px)",
                  fontWeight: 900, color: "#FFD700", margin: 0,
                  letterSpacing: "2px",
                }}>
                  {card.title}
                </h2>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(9px, 0.9vw, 13px)", color: "#A8A8A8",
                }}>
                  {card.subtitle}
                </span>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(10px, 1vw, 14px)", color: "#FFFFFF",
                  margin: "4px 0 0", lineHeight: 1.4,
                }}>
                  {card.desc}
                </p>
              </div>

              {/* Botão JOGAR */}
              <motion.button
                whileHover={{ backgroundColor: "#00E676", color: "#000000" }}
                whileTap={{ scale: 0.95 }}
                title={isBR ? "Jogar este modo" : "Play this mode"}
                style={{
                  width: "100%", height: "clamp(34px, 4vh, 44px)",
                  background: "#004D25", border: "none", borderRadius: "8px",
                  color: "#00E676", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(11px, 1.1vw, 15px)", fontWeight: 700,
                  letterSpacing: "2px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode(card.id as "classic" | "video");
                }}
              >
                {isBR ? "JOGAR" : "PLAY"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
