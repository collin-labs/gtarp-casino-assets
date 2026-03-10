"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./components/Tooltip";

interface BonusBuyModalProps {
  visible: boolean;
  betAmount: number;
  costMultiplier: number;
  balance: number;
  isBR: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BonusBuyModal({
  visible, betAmount, costMultiplier, balance, isBR, onConfirm, onCancel,
}: BonusBuyModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const cost = betAmount * costMultiplier;
  const canAfford = balance >= cost;

  const handleConfirm = () => {
    if (!canAfford) {
      setFeedback(isBR ? "Saldo insuficiente!" : "Insufficient balance!");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    onConfirm();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.8)", borderRadius: "inherit",
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            style={{
              width: "clamp(260px, 28vw, 340px)",
              background: "rgba(17,17,17,0.92)",
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(212,168,67,0.25)", borderRadius: "12px",
              padding: "clamp(16px, 2vw, 28px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,168,67,0.08)",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "clamp(10px, 1.2vw, 16px)",
            }}
          >
            {/* Título */}
            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: "clamp(14px, 1.5vw, 20px)",
              fontWeight: 800, color: "#D4A843", margin: 0, letterSpacing: "1.5px",
              textAlign: "center",
            }}>
              {isBR ? "COMPRAR FREE SPINS" : "BUY FREE SPINS"}
            </h3>

            {/* Descrição */}
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: "clamp(11px, 1.1vw, 14px)",
              color: "#FFFFFF", margin: 0, textAlign: "center",
            }}>
              {isBR ? "Entrar direto em 10 Free Spins" : "Jump straight into 10 Free Spins"}
            </p>

            {/* Custo */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(15px, 1.6vw, 21px)", fontWeight: 800,
              color: "#FF1744", textAlign: "center",
            }}>
              {isBR ? "Custo:" : "Cost:"} 🪙 {cost.toFixed(2).replace(".", ",")}
            </div>

            {/* Subtexto */}
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: "clamp(9px, 0.9vw, 12px)",
              color: "#A8A8A8", marginTop: "-8px",
            }}>
              ({costMultiplier}x {isBR ? "sua aposta de" : "your bet of"} 🪙 {betAmount.toFixed(2).replace(".", ",")})
            </span>

            {/* Feedback de erro */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "clamp(10px, 1vw, 13px)",
                    color: "#FF1744", fontWeight: 600,
                    background: "rgba(255,23,68,0.1)", borderRadius: "6px",
                    padding: "4px 12px", border: "1px solid rgba(255,23,68,0.3)",
                  }}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões */}
            <div style={{ display: "flex", gap: "clamp(8px, 1vw, 14px)", width: "100%" }}>
              <Tooltip text={isBR ? "Confirmar compra" : "Confirm purchase"}>
                <motion.button
                  whileHover={canAfford ? { backgroundColor: "#00E676", color: "#000" } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                  onClick={handleConfirm}
                  style={{
                    flex: 1, height: "clamp(34px, 3.5vw, 44px)",
                    background: canAfford ? "#004D25" : "#333",
                    border: "none", borderRadius: "8px", cursor: canAfford ? "pointer" : "not-allowed",
                    fontFamily: "'Inter', sans-serif", fontSize: "clamp(11px, 1.1vw, 15px)",
                    fontWeight: 700, color: canAfford ? "#00E676" : "#666",
                    letterSpacing: "1px", opacity: canAfford ? 1 : 0.5,
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {isBR ? "CONFIRMAR" : "CONFIRM"}
                </motion.button>
              </Tooltip>

              <Tooltip text={isBR ? "Cancelar" : "Cancel"}>
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  style={{
                    flex: 1, height: "clamp(34px, 3.5vw, 44px)",
                    background: "#222222", border: "none", borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", fontSize: "clamp(11px, 1.1vw, 15px)",
                    fontWeight: 600, color: "#A8A8A8", letterSpacing: "1px",
                    transition: "background 0.2s",
                  }}
                >
                  {isBR ? "CANCELAR" : "CANCEL"}
                </motion.button>
              </Tooltip>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
