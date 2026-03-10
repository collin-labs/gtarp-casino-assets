"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RarityBadge from "./components/RarityBadge";
import Tooltip from "./components/Tooltip";

interface BattlePlayer {
  id: number;
  username: string;
  items: { name: string; rarity: string; rarity_color: string; value: number }[];
  totalValue: number;
  rank: number;
}

interface CaseBattleGameProps {
  battleId: number;
  players: BattlePlayer[];
  winnerId: number;
  isBR: boolean;
  onClose: () => void;
}

// Mock battle data
const MOCK_PLAYERS: BattlePlayer[] = [
  {
    id: 1, username: "carlos_rp", rank: 2, totalValue: 850,
    items: [
      { name: "Pistola Tatica", rarity: "common", rarity_color: "#4B69FF", value: 100 },
      { name: "Carabina MK2", rarity: "uncommon", rarity_color: "#8847FF", value: 300 },
      { name: "Shotgun Combate", rarity: "uncommon", rarity_color: "#8847FF", value: 350 },
      { name: "SMG Compacta", rarity: "common", rarity_color: "#4B69FF", value: 100 },
    ],
  },
  {
    id: 2, username: "joao_grau", rank: 1, totalValue: 11200,
    items: [
      { name: "Railgun Blackout", rarity: "legendary", rarity_color: "#FFD700", value: 10000 },
      { name: "Sniper Pesada", rarity: "rare", rarity_color: "#D32CE6", value: 800 },
      { name: "Pistola Tatica", rarity: "common", rarity_color: "#4B69FF", value: 100 },
      { name: "Carabina MK2", rarity: "uncommon", rarity_color: "#8847FF", value: 300 },
    ],
  },
];

export default function CaseBattleGame({ battleId, isBR, onClose }: CaseBattleGameProps & { players?: BattlePlayer[]; winnerId?: number }) {
  const [revealIndex, setRevealIndex] = useState(-1);
  const [finished, setFinished] = useState(false);
  const players = MOCK_PLAYERS;
  const winner = players.find(p => p.rank === 1);

  // Reveal items one by one
  useEffect(() => {
    if (revealIndex >= 3) {
      setTimeout(() => setFinished(true), 800);
      return;
    }
    const timer = setTimeout(() => setRevealIndex(prev => prev + 1), 1500);
    return () => clearTimeout(timer);
  }, [revealIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setRevealIndex(0), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      padding: "clamp(8px, 1vw, 14px)",
      gap: "clamp(8px, 1vw, 14px)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "clamp(12px, 1.4vw, 18px)",
          fontWeight: 800, color: "#EB4B4B",
          letterSpacing: "2px",
          textShadow: "0 0 12px rgba(235,75,75,0.4)",
        }}>
          {isBR ? "BATALHA #" : "BATTLE #"}{battleId}
        </div>
        {finished && (
          <Tooltip text={isBR ? "Fechar" : "Close"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                background: "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: "6px",
                padding: "4px 12px",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                fontWeight: 700, color: "#A8A8A8",
                cursor: "pointer",
              }}
            >
              {isBR ? "FECHAR" : "CLOSE"}
            </motion.button>
          </Tooltip>
        )}
      </div>

      {/* Players columns */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: `repeat(${players.length}, 1fr)`,
        gap: "clamp(8px, 1vw, 16px)",
        overflow: "hidden",
      }}>
        {players.map((player) => {
          const isWinner = finished && player.rank === 1;
          return (
            <motion.div
              key={player.id}
              animate={isWinner ? {
                boxShadow: ["0 0 0 rgba(255,215,0,0)", "0 0 30px rgba(255,215,0,0.3)", "0 0 0 rgba(255,215,0,0)"],
              } : {}}
              transition={isWinner ? { duration: 2, repeat: Infinity } : {}}
              style={{
                display: "flex", flexDirection: "column",
                background: "linear-gradient(180deg, #1A1A1A, #111111)",
                border: isWinner
                  ? "2px solid rgba(255,215,0,0.5)"
                  : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Player header */}
              <div style={{
                padding: "clamp(8px, 1vw, 12px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: isWinner
                  ? "linear-gradient(90deg, rgba(255,215,0,0.08), transparent)"
                  : "transparent",
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(11px, 1.1vw, 15px)",
                  fontWeight: 700,
                  color: isWinner ? "#FFD700" : "#FFFFFF",
                }}>
                  {player.username}
                  {isWinner && " 👑"}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(12px, 1.2vw, 16px)",
                  fontWeight: 700,
                  color: isWinner ? "#FFD700" : "#00E676",
                  textShadow: isWinner ? "0 0 8px rgba(255,215,0,0.4)" : "none",
                }}>
                  🪙 {(finished ? player.totalValue : player.items.slice(0, revealIndex + 1).reduce((s, it) => s + it.value, 0)).toLocaleString("pt-BR")}
                </div>
              </div>

              {/* Items revealed */}
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                gap: "4px", padding: "clamp(6px, 0.8vw, 10px)",
                overflowY: "auto",
              }}>
                {player.items.map((item, idx) => {
                  const isRevealed = idx <= revealIndex;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.15, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{
                        display: "flex", alignItems: "center",
                        gap: "8px",
                        padding: "clamp(4px, 0.5vw, 8px)",
                        background: isRevealed ? `${item.rarity_color}0D` : "rgba(255,255,255,0.02)",
                        borderRadius: "6px",
                        borderLeft: `3px solid ${isRevealed ? item.rarity_color : "#333"}`,
                      }}
                    >
                      {/* SVG icon */}
                      <svg viewBox="0 0 24 24" fill="none" style={{ width: "clamp(16px, 1.6vw, 22px)", height: "clamp(16px, 1.6vw, 22px)", flexShrink: 0 }}>
                        {item.rarity === "legendary" ? (
                          <polygon points="12,1 15,9 23,9 17,14 19,23 12,18 5,23 7,14 1,9 9,9" fill={item.rarity_color} opacity={isRevealed ? "0.8" : "0.2"} />
                        ) : item.rarity === "epic" ? (
                          <polygon points="12,2 15,9 23,10 17,15 18,22 12,18 6,22 7,15 1,10 9,9" fill={item.rarity_color} opacity={isRevealed ? "0.7" : "0.2"} />
                        ) : item.rarity === "rare" ? (
                          <circle cx="12" cy="12" r="8" fill={`${item.rarity_color}55`} stroke={item.rarity_color} strokeWidth="1.5" />
                        ) : (
                          <rect x="4" y="4" width="16" height="16" rx="3" fill={`${item.rarity_color}33`} stroke={item.rarity_color} strokeWidth="1" />
                        )}
                      </svg>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "clamp(8px, 0.85vw, 11px)",
                          fontWeight: 600,
                          color: isRevealed ? "#FFFFFF" : "#444",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {isRevealed ? item.name : "???"}
                        </div>
                      </div>

                      {isRevealed && (
                        <div style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(8px, 0.8vw, 10px)",
                          fontWeight: 700,
                          color: item.rarity_color,
                          whiteSpace: "nowrap",
                        }}>
                          🪙{item.value.toLocaleString("pt-BR")}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Winner banner */}
              {finished && (
                <div style={{
                  padding: "clamp(6px, 0.8vw, 10px)",
                  textAlign: "center",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(10px, 1vw, 14px)",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  color: isWinner ? "#FFD700" : "#EB4B4B",
                  background: isWinner
                    ? "linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)"
                    : "transparent",
                  textShadow: isWinner ? "0 0 12px rgba(255,215,0,0.5)" : "none",
                }}>
                  {isWinner ? (isBR ? "VENCEDOR!" : "WINNER!") : (isBR ? "DERROTA" : "LOST")}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
