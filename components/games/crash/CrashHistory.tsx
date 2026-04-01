"use client";

import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// CRASH HISTORY — Badges dos ultimos rounds
// ═══════════════════════════════════════════════════════════════════════════

interface CrashRound {
  id: string;
  crashPoint: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

interface CrashHistoryProps {
  history: CrashRound[];
}

// Faixas de cor conforme o crash point
function getBadgeColor(crashPoint: number): { bg: string; text: string; border: string; glow: string } {
  if (crashPoint < 1.5) {
    // Vermelho (crash baixo)
    return {
      bg: "rgba(255,68,68,0.2)",
      text: "#FF6666",
      border: "rgba(255,68,68,0.4)",
      glow: "rgba(255,68,68,0.3)",
    };
  }
  if (crashPoint < 2) {
    // Laranja
    return {
      bg: "rgba(255,140,0,0.2)",
      text: "#FFA500",
      border: "rgba(255,140,0,0.4)",
      glow: "rgba(255,140,0,0.3)",
    };
  }
  if (crashPoint < 5) {
    // Dourado
    return {
      bg: "rgba(212,168,67,0.2)",
      text: "#FFD700",
      border: "rgba(212,168,67,0.4)",
      glow: "rgba(212,168,67,0.3)",
    };
  }
  if (crashPoint < 10) {
    // Verde
    return {
      bg: "rgba(0,230,118,0.2)",
      text: "#00E676",
      border: "rgba(0,230,118,0.4)",
      glow: "rgba(0,230,118,0.3)",
    };
  }
  // Roxo/Magenta (muito alto)
  return {
    bg: "rgba(186,85,211,0.2)",
    text: "#DA70D6",
    border: "rgba(186,85,211,0.4)",
    glow: "rgba(186,85,211,0.5)",
  };
}

export function CrashHistory({ history }: CrashHistoryProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(4px, 0.5vw, 8px)",
        padding: "clamp(6px, 0.8vw, 12px)",
        background: "rgba(5,5,5,0.7)",
        border: "1px solid rgba(212,168,67,0.2)",
        borderRadius: "8px",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {history.slice(0, 15).map((round, index) => {
        const colors = getBadgeColor(round.crashPoint);
        
        return (
          <motion.div
            key={round.id}
            initial={index === 0 ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            style={{
              flexShrink: 0,
              padding: "clamp(4px, 0.6vw, 8px) clamp(8px, 1vw, 14px)",
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              boxShadow: index === 0 ? `0 0 15px ${colors.glow}` : "none",
              cursor: "pointer",
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `0 0 20px ${colors.glow}`,
            }}
            title={`Round #${round.nonce} - Crash: ${round.crashPoint.toFixed(2)}x`}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(10px, 1vw, 14px)",
                fontWeight: 700,
                color: colors.text,
                textShadow: `0 0 8px ${colors.glow}`,
                whiteSpace: "nowrap",
              }}
            >
              {round.crashPoint.toFixed(2)}×
            </span>
          </motion.div>
        );
      })}
      
      {history.length === 0 && (
        <div
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(10px, 1vw, 13px)",
            color: "rgba(212,168,67,0.5)",
            fontStyle: "italic",
          }}
        >
          Aguardando rounds...
        </div>
      )}
    </div>
  );
}
