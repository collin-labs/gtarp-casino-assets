"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

interface LightningOverlayProps {
  visible: boolean;
  luckyNumbers: Map<number, number>;
  onComplete: () => void;
  isBR: boolean;
}

export default function LightningOverlay({
  visible,
  luckyNumbers,
  onComplete,
  isBR,
}: LightningOverlayProps) {
  // Auto-close after animation
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.95)",
            borderRadius: "inherit",
            overflow: "hidden",
          }}
        >
          {/* Electric background effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, transparent 60%)",
              animation: "electricPulse 0.5s ease-in-out infinite alternate",
            }}
          />

          {/* Lightning bolts decoration */}
          <motion.img
            src="/assets/roulette/07.lightning-bolt.png"
            alt=""
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{
              opacity: [0, 1, 0.8],
              scale: [0, 1.3, 1],
              rotate: [-30, 0, 0],
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              top: "10%",
              left: "15%",
              width: "clamp(60px, 8vw, 100px)",
              filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
            }}
          />
          <motion.img
            src="/assets/roulette/07.lightning-bolt.png"
            alt=""
            initial={{ opacity: 0, scale: 0, rotate: 30 }}
            animate={{
              opacity: [0, 1, 0.8],
              scale: [0, 1.3, 1],
              rotate: [30, 0, 0],
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              position: "absolute",
              top: "15%",
              right: "15%",
              width: "clamp(50px, 7vw, 80px)",
              filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
              transform: "scaleX(-1)",
            }}
          />

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              color: "#FFD700",
              margin: 0,
              marginBottom: "clamp(8px, 1vw, 16px)",
              letterSpacing: "4px",
              textShadow:
                "0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)",
              position: "relative",
              zIndex: 5,
            }}
          >
            LIGHTNING ROUND
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(12px, 1.4vw, 18px)",
              color: "#D4A843",
              margin: 0,
              marginBottom: "clamp(20px, 3vw, 40px)",
              letterSpacing: "2px",
              fontStyle: "italic",
              position: "relative",
              zIndex: 5,
            }}
          >
            {isBR ? "Numeros da Sorte Selecionados!" : "Lucky Numbers Selected!"}
          </motion.p>

          {/* Lucky numbers display */}
          <div
            style={{
              display: "flex",
              gap: "clamp(16px, 2vw, 32px)",
              flexWrap: "wrap",
              justifyContent: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            {Array.from(luckyNumbers.entries()).map(([num, mult], i) => (
              <motion.div
                key={num}
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5 + i * 0.12,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "clamp(6px, 0.8vw, 12px)",
                }}
              >
                {/* Number circle */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.2)",
                      "0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)",
                      "0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.2)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "clamp(56px, 7vw, 84px)",
                    height: "clamp(56px, 7vw, 84px)",
                    borderRadius: "50%",
                    background:
                      num === 0
                        ? "linear-gradient(180deg, #00E676, #004D25)"
                        : RED_NUMBERS.includes(num)
                        ? "linear-gradient(180deg, #FF1744, #8B0000)"
                        : "linear-gradient(180deg, #444, #111)",
                    border: "3px solid #FFD700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(22px, 2.8vw, 36px)",
                      fontWeight: 900,
                      color: "#FFF",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {num}
                  </span>
                </motion.div>

                {/* Multiplier badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.7 + i * 0.12,
                    type: "spring",
                    stiffness: 400,
                  }}
                  style={{
                    background:
                      mult >= 500
                        ? "linear-gradient(135deg, #FF1744, #B71C1C)"
                        : mult >= 200
                        ? "linear-gradient(135deg, #FF6B00, #E65100)"
                        : mult >= 100
                        ? "linear-gradient(135deg, #FFD700, #FF9800)"
                        : "linear-gradient(135deg, #D4A843, #8B6914)",
                    padding:
                      "clamp(4px, 0.5vw, 8px) clamp(12px, 1.5vw, 20px)",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(14px, 1.8vw, 24px)",
                      fontWeight: 900,
                      color: mult >= 200 ? "#FFF" : "#000",
                      letterSpacing: "1px",
                    }}
                  >
                    {mult}x
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <style>{`
            @keyframes electricPulse {
              0% {
                opacity: 0.3;
                transform: scale(1);
              }
              100% {
                opacity: 0.6;
                transform: scale(1.02);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
