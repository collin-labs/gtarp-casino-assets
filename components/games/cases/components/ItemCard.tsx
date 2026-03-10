"use client";

import { motion } from "framer-motion";
import RarityBadge from "./RarityBadge";
import Tooltip from "./Tooltip";

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    rarity: string;
    rarity_color: string;
    value: number;
    sell_back_value: number;
    probability: number;
    image_url?: string | null;
  };
  isBR: boolean;
}

export default function ItemCard({ item, isBR }: ItemCardProps) {
  const color = item.rarity_color || "#4B69FF";

  return (
    <Tooltip text={`${item.name} - ${item.probability}%`}>
      <motion.div
        whileHover={{ scale: 1.06 }}
        style={{
          background: "#141414",
          border: `2px solid ${color}`,
          borderRadius: "10px",
          padding: "clamp(6px, 0.8vw, 10px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: "default",
          boxShadow: `0 0 12px ${color}33, 0 4px 8px rgba(0,0,0,0.3)`,
          transition: "box-shadow 0.3s",
          minWidth: 0,
        }}
      >
        {/* Glow background */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "10px",
          background: `radial-gradient(circle at 50% 30%, ${color}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Item icon — PNG se disponível, SVG fallback */}
        <div style={{
          position: "relative",
          filter: `drop-shadow(0 0 10px ${color}88)`,
          width: "clamp(36px, 4vw, 56px)",
          height: "clamp(36px, 4vw, 56px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              style={{
                width: "100%", height: "100%",
                objectFit: "contain",
                borderRadius: "4px",
              }}
              loading="lazy"
            />
          ) : (
            <svg viewBox="0 0 40 40" fill="none" style={{ width: "clamp(24px, 2.5vw, 36px)", height: "clamp(24px, 2.5vw, 36px)" }}>
              {item.rarity === "legendary" ? (
                <polygon points="20,2 25,15 39,15 28,24 32,38 20,30 8,38 12,24 1,15 15,15" fill={color} opacity="0.8" />
              ) : item.rarity === "epic" ? (
                <polygon points="20,3 26,14 38,16 29,25 31,37 20,31 9,37 11,25 2,16 14,14" fill={color} opacity="0.7" />
              ) : item.rarity === "rare" ? (
                <circle cx="20" cy="20" r="14" fill={`${color}44`} stroke={color} strokeWidth="2" />
              ) : (
                <rect x="8" y="8" width="24" height="24" rx="4" fill={`${color}33`} stroke={color} strokeWidth="1.5" />
              )}
            </svg>
          )}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(8px, 0.85vw, 12px)",
          fontWeight: 600,
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {item.name}
        </div>

        {/* Rarity badge */}
        <RarityBadge rarity={item.rarity as any} lang={isBR ? "br" : "in"} />

        {/* Value */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(9px, 0.9vw, 12px)",
          fontWeight: 700,
          color: "#FFD700",
        }}>
          🪙 {item.value.toLocaleString("pt-BR")}
        </div>

        {/* Probability */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(8px, 0.75vw, 10px)",
          color: "#A8A8A8",
        }}>
          {item.probability}%
        </div>
      </motion.div>
    </Tooltip>
  );
}
