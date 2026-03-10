"use client";

import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isBR: boolean;
}

export default function SpinButton({ onClick, disabled, isBR }: SpinButtonProps) {
  return (
    <Tooltip text={isBR ? "Girar os rolos" : "Spin the reels"}>
      <motion.button
        whileHover={disabled ? {} : {
          scale: 1.08,
          boxShadow: "0 0 20px rgba(0,230,118,0.5), 0 0 40px rgba(0,230,118,0.2)",
        }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={disabled ? undefined : onClick}
        style={{
          width: "clamp(52px, 5vw, 70px)",
          height: "clamp(52px, 5vw, 70px)",
          borderRadius: "50%",
          background: disabled
            ? "linear-gradient(180deg, #333333, #1A1A1A)"
            : "linear-gradient(180deg, #00E676, #004D25)",
          border: `2px solid ${disabled ? "#555" : "#00E676"}`,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: disabled
            ? "none"
            : "0 0 12px rgba(0,230,118,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "opacity 0.3s",
        }}
      >
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(10px, 1vw, 15px)",
          fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "1px",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}>
          SPIN
        </span>
      </motion.button>
    </Tooltip>
  );
}
