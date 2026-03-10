"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WinDisplayProps {
  amount: number;
  visible: boolean;
  isBR: boolean;
}

export default function WinDisplay({ amount, visible, isBR }: WinDisplayProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible || amount <= 0) { setDisplayVal(0); return; }
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplayVal(amount * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [amount, visible]);

  return (
    <AnimatePresence>
      {visible && amount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px",
          }}
        >
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(9px, 0.9vw, 12px)",
            color: "#00E676", fontWeight: 600,
            letterSpacing: "1px",
          }}>
            {isBR ? "GANHOU" : "WIN"}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(14px, 1.5vw, 22px)",
            color: "#00E676", fontWeight: 800,
            textShadow: "0 0 10px rgba(0,230,118,0.5)",
          }}>
            R$ {displayVal.toFixed(2).replace(".", ",")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
