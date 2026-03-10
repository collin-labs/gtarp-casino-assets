"use client";

import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

interface BetControlsProps {
  bet: number;
  setBet: (v: number) => void;
  min: number;
  max: number;
  disabled: boolean;
  isBR: boolean;
}

export default function BetControls({ bet, setBet, min, max, disabled, isBR }: BetControlsProps) {
  const adjust = (delta: number) => {
    if (disabled) return;
    const steps = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    const currentIdx = steps.indexOf(bet);
    if (delta > 0 && currentIdx < steps.length - 1) {
      const next = steps[currentIdx + 1] || Math.min(bet + delta, max);
      setBet(Math.min(next, max));
    } else if (delta < 0 && currentIdx > 0) {
      const prev = steps[currentIdx - 1] || Math.max(bet + delta, min);
      setBet(Math.max(prev, min));
    }
  };

  const btnStyle: React.CSSProperties = {
    width: "clamp(26px, 2.5vw, 34px)", height: "clamp(26px, 2.5vw, 34px)",
    background: "#222222", border: "1px solid rgba(212,168,67,0.3)",
    borderRadius: "6px", color: "#D4A843", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 1.2vw, 16px)", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1, transition: "background 0.2s",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "clamp(4px, 0.4vw, 6px)",
    }}>
      <Tooltip text={isBR ? "Aposta mínima" : "Min bet"}>
        <motion.button whileHover={{ background: "#333" }} whileTap={{ scale: 0.9 }}
          style={btnStyle} onClick={() => setBet(min)} disabled={disabled}
        >
          <span style={{ fontSize: "clamp(7px, 0.7vw, 9px)", letterSpacing: "0.5px" }}>MIN</span>
        </motion.button>
      </Tooltip>

      <Tooltip text={isBR ? "Diminuir aposta" : "Decrease bet"}>
        <motion.button whileHover={{ background: "#333" }} whileTap={{ scale: 0.9 }}
          style={btnStyle} onClick={() => adjust(-1)} disabled={disabled}
        >
          −
        </motion.button>
      </Tooltip>

      <div style={{
        background: "#1A1A1A", border: "1px solid #D4A843", borderRadius: "6px",
        padding: "0 clamp(8px, 0.8vw, 14px)", height: "clamp(28px, 2.8vw, 36px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        minWidth: "clamp(65px, 6vw, 90px)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(12px, 1.2vw, 17px)", color: "#FFFFFF", fontWeight: 600,
        }}>
          R$ {bet.toLocaleString("pt-BR")}
        </span>
      </div>

      <Tooltip text={isBR ? "Aumentar aposta" : "Increase bet"}>
        <motion.button whileHover={{ background: "#333" }} whileTap={{ scale: 0.9 }}
          style={btnStyle} onClick={() => adjust(1)} disabled={disabled}
        >
          +
        </motion.button>
      </Tooltip>

      <Tooltip text={isBR ? "Aposta máxima" : "Max bet"}>
        <motion.button whileHover={{ background: "#333" }} whileTap={{ scale: 0.9 }}
          style={btnStyle} onClick={() => setBet(max)} disabled={disabled}
        >
          <span style={{ fontSize: "clamp(7px, 0.7vw, 9px)", letterSpacing: "0.5px" }}>MAX</span>
        </motion.button>
      </Tooltip>
    </div>
  );
}
