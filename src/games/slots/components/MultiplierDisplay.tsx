"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MultiplierDisplayProps {
  value: number;
  isFreeSpins?: boolean;
}

export default function MultiplierDisplay({ value, isFreeSpins = false }: MultiplierDisplayProps) {
  const color = value >= 10 ? "#FFD700" : value >= 4 ? "#D4A843" : "#FFFFFF";
  const glowIntensity = Math.min(value * 2, 25);
  const sz = isFreeSpins ? "clamp(60px,7vw,85px)" : "clamp(46px,5vw,65px)";
  const font = isFreeSpins ? "clamp(20px,2.5vw,34px)" : "clamp(16px,1.8vw,26px)";

  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%",
      border: `2px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(10,10,10,0.9)",
      boxShadow: `0 0 ${glowIntensity}px rgba(${value >= 10 ? "255,215,0" : value >= 4 ? "212,168,67" : "255,255,255"},0.3)`,
      transition: "border-color 0.3s, box-shadow 0.3s",
      position: "relative",
    }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            fontFamily: "'Cinzel', serif", fontSize: font, fontWeight: 900,
            color, textShadow: `0 0 ${glowIntensity}px rgba(${value >= 10 ? "255,215,0" : "212,168,67"},0.5)`,
          }}
        >
          x{value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
