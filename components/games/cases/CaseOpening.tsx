"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import RevealStrip from "./RevealStrip";

interface CaseOpeningProps {
  caseName: string;
  caseImageUrl?: string | null;
  themeColor: string;
  items: { id: number; name: string; rarity: string; rarity_color: string; value: number; sell_back_value: number; probability: number }[];
  targetItemIndex: number;
  isBR: boolean;
  fastMode?: boolean;
  onComplete: (item: any) => void;
  onClose: () => void;
}

export default function CaseOpening({
  caseName, caseImageUrl, themeColor, items, targetItemIndex, isBR, fastMode, onComplete, onClose
}: CaseOpeningProps) {
  const [revealed, setRevealed] = useState(false);
  const targetItem = items[targetItemIndex] || items[0];

  const handleRevealComplete = useCallback(() => {
    setRevealed(true);
    setTimeout(() => onComplete(targetItem), 800);
  }, [targetItem, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute", inset: 0, zIndex: 55,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "clamp(12px, 1.5vw, 24px)",
        padding: "clamp(16px, 2vw, 32px)",
        fontFamily: "var(--font-cinzel)",
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontSize: "clamp(14px, 1.8vw, 24px)",
          fontWeight: 800, color: themeColor,
          letterSpacing: "3px",
          textShadow: `0 0 16px ${themeColor}66`,
          textTransform: "uppercase",
        }}
      >
        {isBR ? "ABRINDO" : "OPENING"}: {caseName}
      </motion.div>

      {/* Case image — fechada → aberta */}
      {caseImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            width: "clamp(80px, 10vw, 140px)",
            height: "clamp(80px, 10vw, 140px)",
          }}
        >
          <img
            src={revealed
              ? caseImageUrl.replace("-FECHADA", "-ABERTA")
              : caseImageUrl
            }
            alt={caseName}
            style={{
              width: "100%", height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 8px 24px ${themeColor}66)`,
              transition: "all 0.5s ease",
            }}
          />
        </motion.div>
      )}

      {/* Reveal strip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: "700px" }}
      >
        <RevealStrip
          items={items}
          targetIndex={targetItemIndex}
          onRevealComplete={handleRevealComplete}
          fastMode={fastMode}
        />
      </motion.div>

      {/* Revealed item glow */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "8px",
          }}
        >
          {/* Item glow circle */}
          <div style={{
            width: "clamp(60px, 8vw, 100px)",
            height: "clamp(60px, 8vw, 100px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${targetItem.rarity_color}44 0%, transparent 70%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${targetItem.rarity_color}55, 0 0 60px ${targetItem.rarity_color}22`,
            animation: "breathe 2s ease-in-out infinite",
          }}>
            {targetItem.image_url ? (
              <img src={targetItem.image_url} alt={targetItem.name}
                style={{ width: "80%", height: "80%", objectFit: "contain",
                  filter: `drop-shadow(0 0 8px ${targetItem.rarity_color}88)` }} />
            ) : (
              <span style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                {targetItem.rarity === "legendary" ? "\u2B50" :
                 targetItem.rarity === "epic" ? "\uD83D\uDC8E" :
                 targetItem.rarity === "rare" ? "\uD83D\uDD2E" : "\uD83D\uDCE6"}
              </span>
            )}
          </div>

          {/* Item name */}
          <div style={{
            fontSize: "clamp(14px, 1.6vw, 22px)",
            fontWeight: 800, color: targetItem.rarity_color,
            textShadow: `0 0 12px ${targetItem.rarity_color}66`,
            letterSpacing: "2px",
          }}>
            {targetItem.name}
          </div>

          {/* Value */}
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(16px, 2vw, 26px)",
            fontWeight: 700, color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.4)",
          }}>
            🪙 {targetItem.value.toLocaleString("pt-BR")}
          </div>
        </motion.div>
      )}

      {/* Close / Skip */}
      {!revealed && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
          onClick={onClose}
          style={{
            background: "transparent", border: "none",
            color: "#666", cursor: "pointer",
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(9px, 0.9vw, 12px)",
            letterSpacing: "2px",
          }}
        >
          {isBR ? "CANCELAR" : "CANCEL"}
        </motion.button>
      )}
    </motion.div>
  );
}
