"use client";

import { motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { useSoundManager } from "@/hooks/use-sound-manager";

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isBR: boolean;
}

export default function SpinButton({ onClick, disabled, isBR }: SpinButtonProps) {
  const sound = useSoundManager();

  return (
    <Tooltip text={isBR ? "Girar os rolos" : "Spin the reels"}>
      <motion.button
        whileHover={disabled ? {} : {
          scale: 1.08,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 8px rgba(0,0,0,0.4), 0 8px 20px rgba(0,77,37,0.4), 0 0 24px rgba(0,230,118,0.4), 0 0 48px rgba(0,230,118,0.15)",
        }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={disabled ? undefined : () => { sound.play("click"); onClick(); }}
        style={{
          width: "clamp(56px, 5.5vw, 76px)",
          height: "clamp(56px, 5.5vw, 76px)",
          borderRadius: "50%",
          background: disabled
            ? "linear-gradient(180deg, #333333, #1A1A1A)"
            : "linear-gradient(180deg, #00C853 0%, #00E676 30%, #004D25 100%)",
          border: `2px solid ${disabled ? "#444" : "rgba(0,230,118,0.5)"}`,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: disabled
            ? "none"
            : [
                "inset 0 1px 0 rgba(255,255,255,0.2)",
                "inset 0 -2px 0 rgba(0,0,0,0.3)",
                "0 2px 4px rgba(0,0,0,0.4)",
                "0 4px 12px rgba(0,77,37,0.3)",
                "0 0 16px rgba(0,230,118,0.25)",
              ].join(", "),
          transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          position: "relative" as const,
          overflow: "hidden" as const,
        }}
      >
        {/* Bevel highlight — luz de cima (DS P2 §8.1) */}
        {!disabled && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
        )}
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(10px, 1vw, 15px)",
          fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "1px",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          position: "relative" as const,
          zIndex: 1,
        }}>
          SPIN
        </span>
      </motion.button>
    </Tooltip>
  );
}
