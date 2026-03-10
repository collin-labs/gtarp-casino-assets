"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./components/Tooltip";

interface Battle {
  id: number;
  creator: string;
  max_players: number;
  player_count: number;
  entry_fee: number;
  cases: string[];
  created_at: string;
}

// Mock battles
const MOCK_BATTLES: Battle[] = [
  { id: 1, creator: "carlos_rp", max_players: 2, player_count: 1, entry_fee: 500, cases: ["Arsenal Dourado"], created_at: "2m" },
  { id: 2, creator: "maria_ls", max_players: 4, player_count: 2, entry_fee: 2000, cases: ["Cofre Secreto"], created_at: "5m" },
  { id: 3, creator: "joao_grau", max_players: 2, player_count: 1, entry_fee: 1000, cases: ["Garagem VIP"], created_at: "8m" },
];

interface CaseBattleLobbyProps {
  isBR: boolean;
  onJoinBattle: (battleId: number) => void;
  onCreateBattle: () => void;
  onBack: () => void;
}

export default function CaseBattleLobby({ isBR, onJoinBattle, onCreateBattle, onBack }: CaseBattleLobbyProps) {
  const [battles] = useState<Battle[]>(MOCK_BATTLES);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      gap: "clamp(8px, 1vw, 14px)",
      padding: "clamp(8px, 1vw, 14px)",
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
          {isBR ? "BATALHAS PVP" : "PVP BATTLES"}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip text={isBR ? "Criar nova batalha" : "Create new battle"}>
            <motion.button
              whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateBattle}
              style={{
                background: "linear-gradient(180deg, #C62828, #E53935 30%, #B71C1C 100%)",
                border: "none", borderRadius: "8px",
                padding: "clamp(6px, 0.8vw, 10px) clamp(14px, 1.5vw, 24px)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                fontWeight: 800, color: "#FFFFFF",
                letterSpacing: "1px", cursor: "pointer",
                boxShadow: "0 0 16px rgba(235,75,75,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {isBR ? "+ CRIAR BATALHA" : "+ CREATE BATTLE"}
            </motion.button>
          </Tooltip>

          <Tooltip text={isBR ? "Voltar ao catalogo" : "Back to catalog"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              style={{
                background: "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: "8px",
                padding: "clamp(6px, 0.8vw, 10px) clamp(10px, 1vw, 16px)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                fontWeight: 700, color: "#A8A8A8",
                letterSpacing: "1px", cursor: "pointer",
              }}
            >
              {isBR ? "VOLTAR" : "BACK"}
            </motion.button>
          </Tooltip>
        </div>
      </div>

      {/* Battle list */}
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "8px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(235,75,75,0.15) transparent",
      }}>
        <AnimatePresence>
          {battles.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: "flex", alignItems: "center",
                gap: "clamp(8px, 1vw, 16px)",
                padding: "clamp(8px, 1vw, 14px)",
                background: "linear-gradient(180deg, #1A1A1A, #141414)",
                border: "1px solid rgba(235,75,75,0.15)",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* Creator */}
              <div style={{ minWidth: "80px" }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(10px, 1vw, 13px)",
                  fontWeight: 600, color: "#FFFFFF",
                }}>
                  {b.creator}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(8px, 0.75vw, 10px)",
                  color: "#666",
                }}>
                  {b.created_at} {isBR ? "atras" : "ago"}
                </div>
              </div>

              {/* Cases */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(9px, 0.9vw, 12px)",
                  color: "#D4A843",
                }}>
                  {b.cases.join(", ")}
                </div>
              </div>

              {/* Players */}
              <div style={{
                display: "flex", gap: "4px", alignItems: "center",
              }}>
                {Array.from({ length: b.max_players }).map((_, pi) => (
                  <div key={pi} style={{
                    width: "clamp(20px, 2vw, 28px)",
                    height: "clamp(20px, 2vw, 28px)",
                    borderRadius: "50%",
                    background: pi < b.player_count
                      ? "linear-gradient(135deg, #EB4B4B, #C62828)"
                      : "rgba(255,255,255,0.05)",
                    border: pi < b.player_count
                      ? "2px solid rgba(235,75,75,0.5)"
                      : "2px dashed rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(8px, 0.8vw, 11px)",
                    color: pi < b.player_count ? "#FFF" : "#444",
                    fontWeight: 700,
                  }}>
                    {pi < b.player_count ? "P" + (pi + 1) : "?"}
                  </div>
                ))}
              </div>

              {/* Entry fee */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(11px, 1.1vw, 15px)",
                fontWeight: 700, color: "#FFD700",
                minWidth: "80px", textAlign: "right",
              }}>
                🪙 {b.entry_fee.toLocaleString("pt-BR")}
              </div>

              {/* Join button */}
              <Tooltip text={isBR ? "Entrar na batalha" : "Join battle"}>
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(235,75,75,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onJoinBattle(b.id)}
                  style={{
                    background: "linear-gradient(180deg, #C62828, #E53935)",
                    border: "none", borderRadius: "6px",
                    padding: "clamp(6px, 0.7vw, 10px) clamp(10px, 1.2vw, 18px)",
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "clamp(8px, 0.85vw, 11px)",
                    fontWeight: 800, color: "#FFF",
                    letterSpacing: "1px", cursor: "pointer",
                    boxShadow: "0 0 12px rgba(235,75,75,0.2)",
                  }}
                >
                  {isBR ? "ENTRAR" : "JOIN"}
                </motion.button>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>

        {battles.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px",
            color: "#555", fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(11px, 1.1vw, 14px)",
          }}>
            {isBR ? "Nenhuma batalha aberta. Crie uma!" : "No open battles. Create one!"}
          </div>
        )}
      </div>
    </div>
  );
}
