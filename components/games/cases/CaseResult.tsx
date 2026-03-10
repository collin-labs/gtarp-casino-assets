"use client";

import { motion } from "framer-motion";
import RarityBadge from "./components/RarityBadge";
import Tooltip from "./components/Tooltip";

interface CaseResultProps {
  item: {
    id: number; name: string; rarity: string; rarity_color: string;
    value: number; sell_back_value: number; image_url?: string | null;
  };
  openingId: number;
  hash: string;
  isBR: boolean;
  onSell: () => void;
  onKeep: () => void;
  onOpenAnother: () => void;
  onClose: () => void;
}

export default function CaseResult({
  item, openingId, hash, isBR, onSell, onKeep, onOpenAnother, onClose
}: CaseResultProps) {
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute", inset: 0, zIndex: 55,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "clamp(10px, 1.2vw, 20px)",
        fontFamily: "var(--font-cinzel)",
      }}
    >
      {/* Item circle with glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        style={{
          width: "clamp(80px, 10vw, 130px)",
          height: "clamp(80px, 10vw, 130px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${item.rarity_color}33 0%, transparent 70%)`,
          border: `2px solid ${item.rarity_color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 40px ${item.rarity_color}44, 0 0 80px ${item.rarity_color}15`,
          animation: "breathe 3s ease-in-out infinite",
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            style={{
              width: "80%", height: "80%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 8px ${item.rarity_color}88)`,
            }}
          />
        ) : (
          <span style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
            {item.rarity === "legendary" ? "\u2B50" :
             item.rarity === "epic" ? "\uD83D\uDC8E" :
             item.rarity === "rare" ? "\uD83D\uDD2E" : "\uD83D\uDCE6"}
          </span>
        )}
      </motion.div>

      {/* Item name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: premiumEase }}
        style={{
          fontSize: "clamp(16px, 2vw, 28px)",
          fontWeight: 900, color: item.rarity_color,
          letterSpacing: "3px",
          textShadow: `0 0 16px ${item.rarity_color}66`,
          textAlign: "center",
        }}
      >
        {item.name}
      </motion.div>

      {/* Rarity badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <RarityBadge rarity={item.rarity as any} lang={isBR ? "br" : "in"} />
      </motion.div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(20px, 2.5vw, 36px)",
          fontWeight: 700, color: "#FFD700",
          textShadow: "0 0 12px rgba(255,215,0,0.5)",
        }}
      >
        🪙 {item.value.toLocaleString("pt-BR")}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease: premiumEase }}
        style={{
          display: "flex", gap: "clamp(8px, 1vw, 16px)",
          flexWrap: "wrap", justifyContent: "center",
        }}
      >
        {/* SELL */}
        <Tooltip text={isBR ? `Vender por 🪙${item.sell_back_value.toLocaleString("pt-BR")}` : `Sell for 🪙${item.sell_back_value.toLocaleString("pt-BR")}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSell}
            style={{
              background: "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
              border: "1px solid rgba(0,230,118,0.3)",
              borderRadius: "8px",
              padding: "clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 700, color: "#00E676",
              letterSpacing: "1px", cursor: "pointer",
              boxShadow: "0 0 12px rgba(0,230,118,0.15)",
            }}
          >
            {isBR ? "VENDER" : "SELL"} 🪙{item.sell_back_value.toLocaleString("pt-BR")}
          </motion.button>
        </Tooltip>

        {/* KEEP */}
        <Tooltip text={isBR ? "Guardar no inventario" : "Keep in inventory"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onKeep}
            style={{
              background: "linear-gradient(180deg, #2A2216, #1A1610)",
              border: "1px solid rgba(212,168,67,0.3)",
              borderRadius: "8px",
              padding: "clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 700, color: "#D4A843",
              letterSpacing: "1px", cursor: "pointer",
              boxShadow: "0 0 12px rgba(212,168,67,0.15)",
            }}
          >
            {isBR ? "GUARDAR" : "KEEP"}
          </motion.button>
        </Tooltip>

        {/* OPEN ANOTHER */}
        <Tooltip text={isBR ? "Abrir mais uma caixa" : "Open another case"}>
          <motion.button
            whileHover={{ scale: 1.06, filter: "brightness(1.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAnother}
            style={{
              background: "linear-gradient(180deg, #00C853, #00E676 30%, #004D25 100%)",
              border: "none", borderRadius: "8px",
              padding: "clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 800, color: "#FFFFFF",
              letterSpacing: "1px", cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 16px rgba(0,230,118,0.25)",
            }}
          >
            {isBR ? "ABRIR OUTRA" : "OPEN ANOTHER"}
          </motion.button>
        </Tooltip>
      </motion.div>

      {/* Provably Fair hash */}
      <Tooltip text={isBR ? "Hash Provably Fair verificavel" : "Verifiable Provably Fair hash"}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(7px, 0.7vw, 9px)",
          color: "#555", cursor: "default",
          letterSpacing: "0.5px",
          maxWidth: "90%",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          #{openingId} | {hash.substring(0, 16)}...
        </div>
      </Tooltip>

      {/* Close */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        onClick={onClose}
        style={{
          background: "transparent", border: "none",
          color: "#555", cursor: "pointer",
          fontFamily: "var(--font-cinzel)",
          fontSize: "clamp(8px, 0.8vw, 11px)",
          letterSpacing: "2px",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#D4A843"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; }}
      >
        {isBR ? "VOLTAR AO CATALOGO" : "BACK TO CATALOG"}
      </motion.button>
    </motion.div>
  );
}
