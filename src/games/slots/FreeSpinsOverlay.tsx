"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultiplierDisplay from "./components/MultiplierDisplay";
import Tooltip from "./components/Tooltip";

interface FreeSpinsOverlayProps {
  active: boolean;
  spinsRemaining: number;
  totalSpins: number;
  multiplier: number;
  totalWin: number;
  betAmount: number;
  retriggered: boolean;
  isComplete: boolean;
  isBR: boolean;
  onSpin: () => void;
  onContinue: () => void;
  spinning: boolean;
  turbo: boolean;
  onToggleTurbo: () => void;
}

export default function FreeSpinsOverlay({
  active, spinsRemaining, totalSpins, multiplier, totalWin, betAmount,
  retriggered, isComplete, isBR, onSpin, onContinue, spinning, turbo, onToggleTurbo,
}: FreeSpinsOverlayProps) {
  const [showRetrigger, setShowRetrigger] = useState(false);

  // Flash de retrigger
  if (retriggered && !showRetrigger) {
    setShowRetrigger(true);
    setTimeout(() => setShowRetrigger(false), 2000);
  }

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* BACKDROP — escurece tudo exceto grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.7)",
              borderRadius: "inherit", pointerEvents: "none",
            }}
          />

          {/* HEADER FREE SPINS — topo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              position: "absolute", top: "clamp(8px, 1.5vh, 18px)",
              left: "50%", transform: "translateX(-50%)", zIndex: 45,
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "clamp(4px, 0.5vw, 8px)",
            }}
          >
            {/* Título FREE SPINS */}
            <motion.h2
              animate={{ textShadow: [
                "0 0 15px rgba(0,229,255,0.3)",
                "0 0 25px rgba(0,229,255,0.5)",
                "0 0 15px rgba(0,229,255,0.3)",
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(18px, 2.2vw, 30px)", fontWeight: 900,
                color: "#00E5FF", margin: 0, letterSpacing: "3px",
              }}
            >
              FREE SPINS
            </motion.h2>

            {/* Counter */}
            <div style={{
              display: "flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 12px)",
            }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={spinsRemaining}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(20px, 2.5vw, 34px)", fontWeight: 800,
                    color: "#FFFFFF",
                  }}
                >
                  {spinsRemaining}
                </motion.span>
              </AnimatePresence>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(11px, 1.1vw, 15px)",
                color: "rgba(255,255,255,0.7)",
              }}>
                {isBR ? "restantes" : "remaining"}
              </span>
            </div>
          </motion.div>

          {/* MULTIPLICADOR ACUMULADO — centro-superior */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              position: "absolute",
              top: "clamp(70px, 10vh, 100px)",
              right: "clamp(16px, 3vw, 40px)",
              zIndex: 45,
            }}
          >
            <Tooltip text={isBR ? "Multiplicador total desta sessão" : "Total session multiplier"}>
              <div>
                <MultiplierDisplay value={multiplier} isFreeSpins />
              </div>
            </Tooltip>
          </motion.div>

          {/* RETRIGGER NOTIFICATION */}
          <AnimatePresence>
            {showRetrigger && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)", zIndex: 55,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 900,
                  color: "#00E5FF",
                  textShadow: "0 0 20px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.3)",
                  pointerEvents: "none",
                }}
              >
                +5 FREE SPINS!
              </motion.div>
            )}
          </AnimatePresence>

          {/* TELA DE CONCLUSÃO */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 50,
                  background: "rgba(0,0,0,0.85)", borderRadius: "inherit",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "clamp(10px, 1.5vw, 20px)",
                }}
              >
                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 900,
                    color: "#00E5FF", margin: 0, letterSpacing: "3px",
                    textShadow: "0 0 20px rgba(0,229,255,0.5)",
                  }}
                >
                  {isBR ? "FREE SPINS COMPLETOS!" : "FREE SPINS COMPLETE!"}
                </motion.h2>

                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(11px, 1.1vw, 14px)", color: "#A8A8A8",
                }}>
                  {isBR ? "Multiplicador final:" : "Final multiplier:"} <span style={{ color: "#FFD700", fontWeight: 700 }}>x{multiplier}</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 800,
                    color: "#00E676",
                    textShadow: "0 0 15px rgba(0,230,118,0.5)",
                  }}
                >
                  R$ {totalWin.toFixed(2).replace(".", ",")}
                </motion.div>

                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(9px, 0.9vw, 12px)", color: "#A8A8A8",
                }}>
                  {isBR ? "Total ganho nos free spins" : "Total won in free spins"}
                </span>

                <Tooltip text={isBR ? "Voltar ao jogo base" : "Return to base game"}>
                  <motion.button
                    whileHover={{ backgroundColor: "#00E676", color: "#000" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onContinue}
                    style={{
                      marginTop: "clamp(8px, 1vw, 16px)",
                      padding: "clamp(8px, 1vw, 14px) clamp(24px, 3vw, 48px)",
                      background: "#004D25", border: "none", borderRadius: "8px",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(12px, 1.2vw, 16px)", fontWeight: 700,
                      color: "#00E676", letterSpacing: "2px",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {isBR ? "CONTINUAR" : "CONTINUE"}
                  </motion.button>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTROLES SIMPLIFICADOS — bottom */}
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                position: "absolute", bottom: "clamp(10px, 2vh, 24px)",
                left: "50%", transform: "translateX(-50%)", zIndex: 45,
                display: "flex", gap: "clamp(10px, 1.2vw, 18px)", alignItems: "center",
              }}
            >
              <Tooltip text={isBR ? "Girar (grátis!)" : "Spin (free!)"}>
                <motion.button
                  whileHover={spinning ? {} : { boxShadow: "0 0 15px rgba(0,229,255,0.4)" }}
                  whileTap={spinning ? {} : { scale: 0.95 }}
                  onClick={spinning ? undefined : onSpin}
                  style={{
                    width: "clamp(90px, 9vw, 130px)", height: "clamp(34px, 3.5vw, 44px)",
                    borderRadius: "8px", border: "2px solid #00E5FF",
                    background: spinning ? "rgba(0,229,255,0.1)" : "rgba(0,229,255,0.2)",
                    cursor: spinning ? "not-allowed" : "pointer",
                    opacity: spinning ? 0.4 : 1,
                    fontFamily: "'Cinzel', serif", fontSize: "clamp(12px, 1.2vw, 17px)",
                    fontWeight: 800, color: "#00E5FF", letterSpacing: "2px",
                    transition: "opacity 0.2s",
                  }}
                >
                  SPIN
                </motion.button>
              </Tooltip>

              <Tooltip text={isBR ? "Acelerar animações" : "Speed up animations"}>
                <motion.button
                  whileHover={{ background: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleTurbo}
                  style={{
                    width: "clamp(34px, 3.5vw, 44px)", height: "clamp(34px, 3.5vw, 44px)",
                    borderRadius: "8px", background: "rgba(0,0,0,0.5)",
                    border: `1px solid ${turbo ? "#00E5FF" : "rgba(255,255,255,0.2)"}`,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: turbo ? "#00E5FF" : "#A8A8A8",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" fill="currentColor"/>
                  </svg>
                </motion.button>
              </Tooltip>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
