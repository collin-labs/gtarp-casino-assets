"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry } from "./RouletteGame";

const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

interface HistoryOverlayProps {
  visible: boolean;
  isBR: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

export default function HistoryOverlay({
  visible,
  isBR,
  onClose,
  history,
}: HistoryOverlayProps) {
  const getColor = (num: number) => {
    if (num === 0) return "#00C853";
    return RED_NUMBERS.includes(num) ? "#E53935" : "#1A1A1A";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "inherit",
            cursor: "pointer",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(180deg, #1A1A1A, #0A0A0A)",
              border: "1.5px solid rgba(212,168,67,0.4)",
              outline: "1px solid rgba(191,149,63,0.15)",
              outlineOffset: "3px",
              borderRadius: "16px",
              padding: "clamp(16px, 2vw, 28px)",
              maxWidth: "520px",
              width: "90%",
              maxHeight: "70vh",
              overflow: "auto",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(212,168,67,0.1), inset 0 1px 0 rgba(255,215,0,0.06)",
              cursor: "default",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "clamp(16px, 2vw, 24px)",
                paddingBottom: "clamp(12px, 1.5vw, 18px)",
                borderBottom: "1px solid rgba(212,168,67,0.2)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(18px, 2vw, 26px)",
                  fontWeight: 800,
                  color: "#D4A843",
                  margin: 0,
                  letterSpacing: "2px",
                  textShadow: "0 0 12px rgba(255,215,0,0.3), 0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {isBR ? "HISTORICO" : "HISTORY"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, color: "#FFD700" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: "rgba(212,168,67,0.1)",
                  border: "1px solid rgba(212,168,67,0.3)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                  color: "#D4A843",
                  fontFamily: "'Cinzel', serif",
                  padding: "4px 10px",
                  lineHeight: 1,
                }}
              >
                ✕
              </motion.button>
            </div>

            {/* Stats bar */}
            {history.length > 0 && (
              <div style={{
                display: "flex",
                gap: "clamp(8px, 1vw, 14px)",
                marginBottom: "clamp(12px, 1.5vw, 20px)",
                padding: "clamp(8px, 1vw, 12px)",
                background: "rgba(20,20,20,0.8)",
                borderRadius: "8px",
                border: "1px solid rgba(212,168,67,0.15)",
              }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(14px, 1.5vw, 20px)", fontWeight: 700, color: "#FFD700" }}>
                    {history.length}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(8px, 0.8vw, 11px)", color: "#666", letterSpacing: "1px" }}>
                    {isBR ? "RODADAS" : "SPINS"}
                  </div>
                </div>
                <div style={{ width: "1px", background: "rgba(212,168,67,0.2)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(14px, 1.5vw, 20px)", fontWeight: 700, color: "#00E676" }}>
                    {history.filter(h => h.win).length}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(8px, 0.8vw, 11px)", color: "#666", letterSpacing: "1px" }}>
                    {isBR ? "VITORIAS" : "WINS"}
                  </div>
                </div>
                <div style={{ width: "1px", background: "rgba(212,168,67,0.2)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(14px, 1.5vw, 20px)", fontWeight: 700, color: "#00E676", textShadow: "0 0 8px rgba(0,230,118,0.4)" }}>
                    {history.filter(h => h.win).reduce((s, h) => s + h.amount, 0).toLocaleString()}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(8px, 0.8vw, 11px)", color: "#666", letterSpacing: "1px" }}>
                    {isBR ? "GANHOS" : "WON"}
                  </div>
                </div>
              </div>
            )}

            {/* History list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(6px, 0.8vw, 10px)",
              }}
            >
              {history.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(12px, 1.2vw, 16px)",
                    color: "#666",
                    textAlign: "center",
                    padding: "clamp(24px, 3vw, 40px)",
                    fontStyle: "italic",
                  }}
                >
                  {isBR ? "Nenhum resultado ainda. Faca sua primeira aposta!" : "No results yet. Place your first bet!"}
                </p>
              ) : (
                history.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "clamp(8px, 1vw, 14px) clamp(10px, 1.2vw, 16px)",
                      background: i === 0 ? "rgba(212,168,67,0.08)" : "rgba(30,30,30,0.6)",
                      borderRadius: "8px",
                      border: `1px solid ${i === 0 ? "rgba(212,168,67,0.25)" : "rgba(212,168,67,0.08)"}`,
                    }}
                  >
                    {/* Left: Number + index */}
                    <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 1vw, 16px)" }}>
                      <div
                        style={{
                          width: "clamp(34px, 3.5vw, 46px)",
                          height: "clamp(34px, 3.5vw, 46px)",
                          borderRadius: "50%",
                          background: getColor(item.number),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${item.isLucky ? "#FFD700" : item.number === 0 ? "#00E676" : "rgba(255,255,255,0.2)"}`,
                          boxShadow: item.isLucky ? "0 0 12px rgba(255,215,0,0.5)" : "none",
                        }}
                      >
                        <span style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "clamp(13px, 1.4vw, 18px)",
                          fontWeight: 700,
                          color: "#FFF",
                        }}>
                          {item.number}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "clamp(10px, 1vw, 13px)",
                          color: "#888",
                        }}>
                          #{history.length - i}
                        </span>
                        {item.isLucky && item.multiplier && (
                          <span style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(8px, 0.8vw, 11px)",
                            fontWeight: 800,
                            color: "#FFD700",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}>
                            ⚡ {item.multiplier}x
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Result amount */}
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "clamp(13px, 1.4vw, 18px)",
                        fontWeight: 700,
                        color: item.win ? "#00E676" : "#FF1744",
                        textShadow: item.win ? "0 0 8px rgba(0,230,118,0.3)" : "none",
                      }}
                    >
                      {item.win ? `+${item.amount.toLocaleString()}` : isBR ? "Sem premio" : "No win"}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.02, background: "rgba(212,168,67,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: "clamp(16px, 2vw, 24px)",
                padding: "clamp(10px, 1.2vw, 14px)",
                background: "rgba(212,168,67,0.1)",
                border: "1px solid rgba(212,168,67,0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(11px, 1.1vw, 15px)",
                fontWeight: 700,
                color: "#D4A843",
                letterSpacing: "2px",
                transition: "all 0.2s",
              }}
            >
              {isBR ? "FECHAR" : "CLOSE"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
