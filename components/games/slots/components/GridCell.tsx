"use client";

import { motion } from "framer-motion";
import SymbolIcon from "../symbols/SymbolIcon";

interface GridCellProps {
  symbol: string;
  isHighlighted: boolean;
  isExploding: boolean;
  isNew: boolean;
  cellSize: string;
}

export default function GridCell({ symbol, isHighlighted, isExploding, isNew, cellSize }: GridCellProps) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -30, scale: 0.8 } : false}
      animate={
        isExploding
          ? { opacity: 0, scale: 0, rotate: 15 }
          : { opacity: 1, y: 0, scale: 1, rotate: 0 }
      }
      transition={
        isExploding
          ? { duration: 0.25, ease: "easeIn" }
          : isNew
            ? { duration: 0.35, ease: [0.15, 0.85, 0.35, 1], type: "spring", stiffness: 300, damping: 20 }
            : { duration: 0.2 }
      }
      style={{
        width: cellSize,
        height: cellSize,
        background: isHighlighted
          ? "rgba(212,168,67,0.15)"
          : "linear-gradient(180deg, #1C1C1C, #151515)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        border: isHighlighted
          ? "2px solid #FFD700"
          : "1px solid rgba(212,168,67,0.08)",
        boxShadow: isHighlighted
          ? "0 0 8px rgba(255,215,0,0.4), 0 0 16px rgba(255,215,0,0.25), 0 0 32px rgba(255,215,0,0.1), inset 0 0 12px rgba(255,215,0,0.15)"
          : "inset 0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(212,168,67,0.04)",
        transition: "border 0.2s, background 0.2s, box-shadow 0.2s",
        overflow: "hidden",
      }}
    >
      <SymbolIcon name={symbol} size={`calc(${cellSize} * 0.78)`} />

      {/* Shimmer no highlight */}
      {isHighlighted && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "5px",
          background: "linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "gcShimmer 1.5s ease infinite",
          pointerEvents: "none",
        }} />
      )}

      <style>{`
        @keyframes gcShimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
    </motion.div>
  );
}
