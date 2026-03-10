"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Drop {
  id: number;
  username: string;
  item: string;
  rarity: string;
  rarity_color: string;
  value: number;
  timestamp: number;
}

// Mock drops (sera substituido por NUI listener na producao)
const MOCK_DROPS: Drop[] = [
  { id: 1, username: "carlos_rp", item: "Railgun Blackout", rarity: "legendary", rarity_color: "#FFD700", value: 10000, timestamp: Date.now() - 120000 },
  { id: 2, username: "maria_ls", item: "R$ 50 em GCoin", rarity: "common", rarity_color: "#4B69FF", value: 50, timestamp: Date.now() - 90000 },
  { id: 3, username: "joao_grau", item: "Sniper Pesada", rarity: "rare", rarity_color: "#D32CE6", value: 800, timestamp: Date.now() - 60000 },
  { id: 4, username: "ana_belle", item: "R$ 100 em GCoin", rarity: "rare", rarity_color: "#D32CE6", value: 100, timestamp: Date.now() - 30000 },
  { id: 5, username: "rafa_tuner", item: "Itali GTO", rarity: "rare", rarity_color: "#D32CE6", value: 3000, timestamp: Date.now() - 10000 },
];

interface RecentDropsProps {
  isBR: boolean;
  maxItems?: number;
}

export default function RecentDrops({ isBR, maxItems = 8 }: RecentDropsProps) {
  const [drops, setDrops] = useState<Drop[]>(MOCK_DROPS.slice(0, maxItems));

  // Simular novos drops a cada 8s (mock)
  useEffect(() => {
    const names = ["carlos_rp", "maria_ls", "joao_grau", "ana_belle", "rafa_tuner", "pedro_sp", "julia_rj"];
    const items = [
      { name: "Pistola Tatica", rarity: "common", color: "#4B69FF", value: 100 },
      { name: "Carabina MK2", rarity: "uncommon", color: "#8847FF", value: 300 },
      { name: "Sniper Pesada", rarity: "rare", color: "#D32CE6", value: 800 },
      { name: "Minigun Dourada", rarity: "epic", color: "#EB4B4B", value: 2000 },
      { name: "Scramjet Dourado", rarity: "legendary", color: "#FFD700", value: 25000 },
    ];

    const iv = setInterval(() => {
      const randName = names[Math.floor(Math.random() * names.length)];
      const randItem = items[Math.floor(Math.random() * items.length)];
      const newDrop: Drop = {
        id: Date.now(),
        username: randName,
        item: randItem.name,
        rarity: randItem.rarity,
        rarity_color: randItem.color,
        value: randItem.value,
        timestamp: Date.now(),
      };
      setDrops(prev => [newDrop, ...prev].slice(0, maxItems));
    }, 8000);

    return () => clearInterval(iv);
  }, [maxItems]);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: "4px", overflow: "hidden",
    }}>
      <div style={{
        fontFamily: "var(--font-cinzel)",
        fontSize: "clamp(8px, 0.85vw, 11px)",
        fontWeight: 700, color: "#D4A843",
        letterSpacing: "2px",
        marginBottom: "4px",
      }}>
        {isBR ? "DROPS RECENTES" : "RECENT DROPS"}
      </div>

      <AnimatePresence initial={false}>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "3px 6px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "4px",
              borderLeft: `2px solid ${drop.rarity_color}`,
              overflow: "hidden",
            }}
          >
            {/* Username */}
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              color: "#888",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "60px",
            }}>
              {drop.username}
            </span>

            {/* Item name */}
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              color: drop.rarity_color,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}>
              {drop.item}
            </span>

            {/* Value */}
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(7px, 0.65vw, 9px)",
              color: "#FFD700",
              whiteSpace: "nowrap",
            }}>
              {drop.value.toLocaleString("pt-BR")}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
