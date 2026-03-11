"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HistoryOverlayProps {
  visible: boolean;
  isBR: boolean;
  onClose: () => void;
}

export default function HistoryOverlay({
  visible,
  isBR,
  onClose,
}: HistoryOverlayProps) {
  // Mock history data - in production this would come from props/state
  const mockHistory = [
    { number: 17, win: true, amount: 350 },
    { number: 0, win: false, amount: 0 },
    { number: 32, win: true, amount: 70 },
    { number: 5, win: false, amount: 0 },
    { number: 23, win: true, amount: 140 },
  ];

  const RED_NUMBERS = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];

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
              border: "1px solid rgba(212,168,67,0.4)",
              borderRadius: "16px",
              padding: "clamp(16px, 2vw, 28px)",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "70vh",
              overflow: "auto",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(212,168,67,0.1)",
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
                }}
              >
                {isBR ? "HISTORICO" : "HISTORY"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, color: "#FFD700" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "clamp(20px, 2.2vw, 28px)",
                  color: "#666",
                  fontFamily: "sans-serif",
                  padding: "4px 8px",
                  lineHeight: 1,
                }}
              >
                x
              </motion.button>
            </div>

            {/* History list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 1vw, 14px)",
              }}
            >
              {mockHistory.length === 0 ? (
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
                  {isBR
                    ? "Nenhum resultado ainda"
                    : "No results yet"}
                </p>
              ) : (
                mockHistory.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "clamp(10px, 1.2vw, 16px)",
                      background: "rgba(30,30,30,0.6)",
                      borderRadius: "8px",
                      border: "1px solid rgba(212,168,67,0.1)",
                    }}
                  >
                    {/* Number */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(10px, 1vw, 16px)",
                      }}
                    >
                      <div
                        style={{
                          width: "clamp(36px, 4vw, 48px)",
                          height: "clamp(36px, 4vw, 48px)",
                          borderRadius: "50%",
                          background: getColor(item.number),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${
                            item.number === 0
                              ? "#00E676"
                              : "rgba(255,255,255,0.2)"
                          }`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(14px, 1.5vw, 20px)",
                            fontWeight: 700,
                            color: "#FFF",
                          }}
                        >
                          {item.number}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "clamp(11px, 1.1vw, 14px)",
                          color: "#888",
                        }}
                      >
                        #{mockHistory.length - i}
                      </span>
                    </div>

                    {/* Result */}
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "clamp(13px, 1.4vw, 18px)",
                        fontWeight: 700,
                        color: item.win ? "#00E676" : "#FF1744",
                      }}
                    >
                      {item.win ? `+${item.amount}` : isBR ? "Sem premio" : "No win"}
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
