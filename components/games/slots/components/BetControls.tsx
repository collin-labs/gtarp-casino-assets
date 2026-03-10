"use client";

import { motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { useSoundManager } from "@/hooks/use-sound-manager";

interface BetControlsProps {
  bet: number;
  setBet: (v: number) => void;
  min: number;
  max: number;
  disabled: boolean;
  isBR: boolean;
}

export default function BetControls({ bet, setBet, min, max, disabled, isBR }: BetControlsProps) {
  const sound = useSoundManager();
  const adjust = (delta: number) => {
    if (disabled) return;
    sound.play("click");
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
    width: "clamp(28px, 2.5vw, 36px)", height: "clamp(28px, 2.5vw, 36px)",
    background: "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
    border: "1px solid rgba(212,168,67,0.2)",
    borderRadius: "6px", color: "#D4A843", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 1.2vw, 16px)", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.3)",
    transition: "all 0.15s ease",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "clamp(4px, 0.4vw, 6px)",
    }}>
      <Tooltip text={isBR ? "Aposta mínima" : "Min bet"}>
        <motion.button whileHover={{ background: "#333" }} whileTap={{ scale: 0.9 }}
          style={btnStyle} onClick={() => { sound.play("click"); setBet(min); }} disabled={disabled}
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
        background: "linear-gradient(180deg, #1A1A1A, #111111)",
        border: "1px solid rgba(212,168,67,0.3)", borderRadius: "6px",
        padding: "0 clamp(10px, 1vw, 16px)", height: "clamp(30px, 3vw, 40px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        minWidth: "clamp(70px, 7vw, 100px)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(212,168,67,0.08)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(12px, 1.2vw, 17px)", color: "#FFFFFF", fontWeight: 600,
        }}>
          🪙 {bet.toLocaleString("pt-BR")}
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
          style={btnStyle} onClick={() => { sound.play("click"); setBet(max); }} disabled={disabled}
        >
          <span style={{ fontSize: "clamp(7px, 0.7vw, 9px)", letterSpacing: "0.5px" }}>MAX</span>
        </motion.button>
      </Tooltip>
    </div>
  );
}
