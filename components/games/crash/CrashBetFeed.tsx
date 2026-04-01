"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CrashBet } from "./CrashGame";

// ===========================================================================
// CRASH BET FEED — Lista de apostas do round atual
// ===========================================================================

interface CrashBetFeedProps {
  bets: CrashBet[];
  lang: "br" | "in";
}

const COLORS = {
  gold: "#D4A843",
  green: "#00E676",
  red: "#FF4444",
  darkBg: "rgba(5,5,5,0.95)",
};

export function CrashBetFeed({ bets, lang }: CrashBetFeedProps) {
  // Ordenar: jogador primeiro, depois por valor de aposta
  const sortedBets = [...bets].sort((a, b) => {
    if (a.id === "player") return -1;
    if (b.id === "player") return 1;
    return b.amount - a.amount;
  });

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: COLORS.darkBg,
        border: "1px solid rgba(212,168,67,0.3)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "clamp(8px, 1vw, 14px)",
          borderBottom: "1px solid rgba(212,168,67,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(10px, 1vw, 13px)",
            fontWeight: 600,
            color: "rgba(212,168,67,0.8)",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}
        >
          {lang === "br" ? "APOSTAS" : "BETS"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(9px, 0.9vw, 12px)",
            fontWeight: 600,
            color: "rgba(212,168,67,0.5)",
          }}
        >
          {bets.length} {lang === "br" ? "jogadores" : "players"}
        </span>
      </div>

      {/* Lista de apostas */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "clamp(6px, 0.8vw, 10px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(4px, 0.5vw, 8px)",
        }}
      >
        <AnimatePresence>
          {sortedBets.map((bet) => {
            const isPlayer = bet.id === "player";
            const hasWon = bet.cashedOut && bet.cashoutMultiplier && bet.cashoutMultiplier > 0;
            const hasLost = bet.cashedOut === false && bet.cashoutMultiplier === 0;

            return (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "clamp(6px, 0.8vw, 10px)",
                  background: isPlayer 
                    ? "rgba(0,230,118,0.1)" 
                    : hasWon 
                      ? "rgba(0,230,118,0.05)"
                      : hasLost
                        ? "rgba(255,68,68,0.05)"
                        : "rgba(30,30,30,0.5)",
                  border: isPlayer 
                    ? "1px solid rgba(0,230,118,0.3)" 
                    : "1px solid rgba(60,60,60,0.3)",
                  borderRadius: "8px",
                }}
              >
                {/* Nome do jogador */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(6px, 0.6vw, 10px)",
                  }}
                >
                  {/* Avatar placeholder */}
                  <div
                    style={{
                      width: "clamp(24px, 2vw, 32px)",
                      height: "clamp(24px, 2vw, 32px)",
                      borderRadius: "50%",
                      background: isPlayer 
                        ? "linear-gradient(135deg, #00E676, #00C853)" 
                        : "linear-gradient(135deg, #444, #333)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "clamp(9px, 0.9vw, 12px)",
                      fontWeight: 700,
                      color: isPlayer ? "#0A0A0A" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {bet.playerName.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        fontSize: "clamp(9px, 0.9vw, 12px)",
                        fontWeight: isPlayer ? 700 : 500,
                        color: isPlayer ? COLORS.green : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {bet.playerName}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(8px, 0.8vw, 11px)",
                        color: "rgba(212,168,67,0.6)",
                      }}
                    >
                      {bet.amount.toLocaleString()} GC
                    </div>
                  </div>
                </div>

                {/* Status / Resultado */}
                <div style={{ textAlign: "right" }}>
                  {hasWon ? (
                    <>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(10px, 1vw, 13px)",
                          fontWeight: 700,
                          color: COLORS.green,
                          textShadow: "0 0 8px rgba(0,230,118,0.5)",
                        }}
                      >
                        {bet.cashoutMultiplier?.toFixed(2)}×
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(8px, 0.8vw, 11px)",
                          color: "rgba(0,230,118,0.7)",
                        }}
                      >
                        +{(bet.amount * (bet.cashoutMultiplier || 1)).toFixed(0)} GC
                      </div>
                    </>
                  ) : hasLost ? (
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(10px, 1vw, 13px)",
                        fontWeight: 600,
                        color: COLORS.red,
                        textShadow: "0 0 8px rgba(255,68,68,0.3)",
                      }}
                    >
                      CRASH
                    </div>
                  ) : bet.autoCashout ? (
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(9px, 0.9vw, 12px)",
                        color: "rgba(212,168,67,0.5)",
                      }}
                    >
                      @{bet.autoCashout.toFixed(2)}×
                    </div>
                  ) : (
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(9px, 0.9vw, 12px)",
                        color: "rgba(100,100,100,0.8)",
                      }}
                    >
                      —
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {bets.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(10px, 1vw, 13px)",
              color: "rgba(100,100,100,0.5)",
              fontStyle: "italic",
            }}
          >
            {lang === "br" ? "Nenhuma aposta ainda" : "No bets yet"}
          </div>
        )}
      </div>
    </div>
  );
}
