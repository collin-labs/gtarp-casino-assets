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
      icon: "/slots/classic/classic-preview.png",
      badge: null,
    },
    {
      id: "video",
      title: "BLACKOUT FORTUNE",
      subtitle: isBR ? "Video Slot" : "Video Slot",
      desc: isBR ? "6×5 Cluster, Tumble, Free Spins, Bonus Buy" : "6×5 Cluster, Tumble, Free Spins, Bonus Buy",
      icon: "/slots/video/video-preview.png",
      badge: "PREMIUM",
    },
  ];

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start", paddingTop: "clamp(90px, 4vh, 60px)",
      position: "relative",
      backgroundImage: "url(/slots/lobby/lobby-bg.png)",
      backgroundSize: "cover", backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "inherit", overflow: "hidden",
    }}>
      {/* Overlay escuro pra legibilidade */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Botão voltar */}
      <motion.button
        whileHover={{ scale: 1.15, color: "#FFD700", textShadow: "0 0 10px rgba(255,215,0,0.5)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        title={isBR ? "Voltar ao menu do cassino" : "Back to casino menu"}
        style={{
          position: "absolute", top: "clamp(12px, 2vh, 24px)", left: "clamp(12px, 2vw, 24px)",
          background: "rgba(20,20,20,0.8)", border: "1px solid rgba(212,168,67,0.3)",
          borderRadius: "8px", cursor: "pointer",
          fontSize: "clamp(14px, 1.5vw, 20px)", color: "#D4A843",
          fontFamily: "'Cinzel', serif", fontWeight: 700,
          padding: "clamp(4px, 0.5vw, 8px) clamp(10px, 1vw, 16px)",
          transition: "all 0.2s",
          zIndex: 5,
          display: "flex", alignItems: "center", gap: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        ‹ <span style={{ fontSize: "clamp(9px, 0.9vw, 12px)", letterSpacing: "1px" }}>
          {isBR ? "VOLTAR" : "BACK"}
        </span>
      </motion.button>

      {/* Logo do jogo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <img
          src={isBR
            ? "/assets/logos-br-para-cards/2.LOGO-BR-SLOT-MACHINE.png"
            : "/assets/logos-in-para-cards/2.LOGO-IN-SLOT-MACHINE.png"}
          alt="Slot Machine"
          draggable={false}
          style={{
            width: "clamp(280px, 22vw, 320px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
            userSelect: "none",
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(13px, 1.4vw, 20px)",
          color: "#D4A843", margin: "-4px 0 clamp(60px, 0.8vw, 12px)",
          fontWeight: 600, letterSpacing: "3px", fontStyle: "italic",
          textShadow: "0 0 10px rgba(212,168,67,0.3), 0 2px 4px rgba(0,0,0,0.8)",
          position: "relative", zIndex: 1, textAlign: "center", width: "100%",
        }}
      >
        {isBR ? "Escolha seu modo de jogo" : "Choose your game mode"}
      </motion.p>

      {/* Cards */}
      <div style={{
        display: "flex", gap: "clamp(16px, 2vw, 32px)",
        flexWrap: "wrap", justifyContent: "center",
        padding: "0 clamp(12px, 2vw, 24px)",
        maxWidth: "700px",
        position: "relative", zIndex: 1,
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
                height: "clamp(320px, 35vh, 420px)",
                background: "#0A0A0A",
                border: `2px solid ${isHovered ? "rgba(212,168,67,0.7)" : "rgba(212,168,67,0.25)"}`,
                borderRadius: "14px",
                display: "flex", flexDirection: "column",
                position: "relative", cursor: "pointer",
                boxShadow: isHovered
                  ? "0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,168,67,0.15)"
                  : "0 4px 16px rgba(0,0,0,0.5)",
                overflow: "hidden",
                transition: "border 0.3s, box-shadow 0.3s, transform 0.3s",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
              }}
              onClick={() => onSelectMode(card.id as "classic" | "video")}
            >
              {/* Brilho no topo */}
              <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(246,226,122,0.5), transparent)",
                pointerEvents: "none", zIndex: 3,
              }} />

              {/* Badge PREMIUM */}
              {card.badge && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px", zIndex: 4,
                  background: "linear-gradient(135deg, #D4A843, #F6E27A, #D4A843)", color: "#000",
                  fontSize: "clamp(7px, 0.7vw, 10px)", fontWeight: 800,
                  fontFamily: "'Cinzel', serif",
                  padding: "3px 10px", borderRadius: "4px",
                  letterSpacing: "1.5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}>
                  {card.badge}
                </div>
              )}

              {/* Imagem preview - ocupa 60% do card */}
              <div style={{
                width: "100%", flex: "0 0 60%",
                position: "relative", overflow: "hidden",
              }}>
                <img
                  src={card.icon as string}
                  alt={card.title}
                  draggable={false}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    filter: isHovered ? "brightness(1.1) saturate(1.1)" : "brightness(0.85)",
                    transition: "filter 0.4s ease, transform 0.4s ease",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                />
                {/* Gradiente inferior pra transição suave */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                  background: "linear-gradient(transparent, #0A0A0A)",
                  pointerEvents: "none",
                }} />
              </div>

              {/* Conteúdo texto + botão */}
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "0 clamp(10px, 0.8vw, 14px) clamp(14px, 1.2vw, 20px)",
                gap: "clamp(4px, 0.4vw, 6px)",
              }}>
                <h2 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(14px, 1.5vw, 20px)",
                  fontWeight: 900, color: "#FFD700", margin: 0,
                  letterSpacing: "1.5px", textAlign: "center",
                  textShadow: "0 0 12px rgba(255,215,0,0.3)",
                }}>
                  {card.title}
                </h2>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(8px, 0.8vw, 11px)", color: "#D4A843",
                  letterSpacing: "1px", fontStyle: "italic",
                }}>
                  {card.subtitle}
                </span>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(9px, 0.9vw, 12px)", color: "#A8A8A8",
                  margin: 0, lineHeight: 1.3, textAlign: "center",
                }}>
                  {card.desc}
                </p>

                {/* Botão JOGAR AGORA — Asset PNG com efeito de luz */}
                <motion.button
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.96 }}
                  title={isBR ? "Jogar este modo" : "Play this mode"}
                  style={{
                    position: "relative",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0, background: "none",
                    width: "clamp(160px, 25vw, 250px)",
                    aspectRatio: "829 / 234",
                    backgroundImage: "url(/assets/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-DESATIVO-SEM-TEXTO.png)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    marginTop: "clamp(2px, 0.3vw, 6px)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMode(card.id as "classic" | "video");
                  }}
                >
                  <div style={{
                    position: "absolute", inset: "2px 4px 11px 18px",
                    borderRadius: "6px", overflow: "hidden", pointerEvents: "none",
                    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude", WebkitMaskComposite: "xor" as any,
                    padding: "1.5px",
                  }}>
                    <div style={{
                      position: "absolute", inset: "-50%",
                      background: "conic-gradient(from 0deg, transparent 0%, transparent 70%, #00E676 80%, #FFD700 90%, transparent 100%)",
                      animation: "spin 3s linear infinite",
                    }} />
                  </div>
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "100%", height: "100%", pointerEvents: "none",
                    fontFamily: "var(--font-cinzel), 'Cinzel', serif",
                    fontSize: "clamp(6px, 0.8vw, 12px)", fontWeight: 900,
                    color: "#FFD700",
                    textShadow: "0 0 8px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
                    letterSpacing: "2px", marginTop: "-8px",
                  }}>
                    {isBR ? "JOGAR AGORA" : "PLAY NOW"}
                  </span>
                </motion.button>
              </div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
