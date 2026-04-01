"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ===========================================================================
// CRASH HISTORY PANEL — Drawer lateral com historico completo
// ===========================================================================

interface CrashRound {
  id: string;
  crashPoint: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

interface PlayerResult {
  status: "won" | "lost" | "none";
  amount: number;
  cashoutMultiplier?: number;
}

interface CrashHistoryPanelProps {
  history: CrashRound[];
  playerResults: Map<string, PlayerResult>;
  onClose: () => void;
  onOpenPF: (round: CrashRound) => void;
}

// Paths dos assets
const ASSETS = {
  iconProvablyFair: "/assets/shared/icons/icon-provably-fair.png",
};

type FilterType = "all" | "mine" | "verified";

// Faixas de cor conforme o crash point
function getBadgeColor(crashPoint: number): { bg: string; text: string; border: string } {
  if (crashPoint < 1.5) {
    return { bg: "rgba(255,68,68,0.2)", text: "#FF6666", border: "rgba(255,68,68,0.4)" };
  }
  if (crashPoint < 2) {
    return { bg: "rgba(255,140,0,0.2)", text: "#FFA500", border: "rgba(255,140,0,0.4)" };
  }
  if (crashPoint < 5) {
    return { bg: "rgba(212,168,67,0.2)", text: "#FFD700", border: "rgba(212,168,67,0.4)" };
  }
  if (crashPoint < 10) {
    return { bg: "rgba(0,230,118,0.2)", text: "#00E676", border: "rgba(0,230,118,0.4)" };
  }
  return { bg: "rgba(186,85,211,0.2)", text: "#DA70D6", border: "rgba(186,85,211,0.4)" };
}

export function CrashHistoryPanel({ history, playerResults, onClose, onOpenPF }: CrashHistoryPanelProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  // Filtrar historico
  const filteredHistory = history.filter((round) => {
    if (filter === "all") return true;
    if (filter === "mine") {
      const result = playerResults.get(round.id);
      return result && result.status !== "none";
    }
    if (filter === "verified") {
      // Simula rounds verificados (em producao, viria do backend)
      return round.nonce % 3 === 0;
    }
    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "TODAS" },
    { key: "mine", label: "MINHAS" },
    { key: "verified", label: "VERIFICADAS" },
  ];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 90,
        }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "clamp(300px, 35vw, 450px)",
          background: "rgba(5,5,5,0.98)",
          borderLeft: "1px solid rgba(212,168,67,0.3)",
          display: "flex",
          flexDirection: "column",
          zIndex: 95,
          boxShadow: "-10px 0 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "clamp(16px, 2vw, 24px)",
            borderBottom: "1px solid rgba(212,168,67,0.2)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(14px, 1.6vw, 18px)",
              fontWeight: 700,
              color: "#D4A843",
              textShadow: "0 0 10px rgba(212,168,67,0.3)",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            HISTÓRICO DE RODADAS
          </h2>

          {/* Botao Fechar */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "clamp(28px, 3vw, 36px)",
              height: "clamp(28px, 3vw, 36px)",
              background: "rgba(255,68,68,0.1)",
              border: "1px solid rgba(255,68,68,0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FF6666",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 700,
            }}
          >
            ×
          </motion.button>
        </div>

        {/* Tabs de Filtro */}
        <div
          style={{
            display: "flex",
            gap: "clamp(6px, 0.8vw, 10px)",
            padding: "clamp(12px, 1.5vw, 16px)",
            borderBottom: "1px solid rgba(212,168,67,0.15)",
          }}
        >
          {filters.map(({ key, label }) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1,
                padding: "clamp(8px, 1vw, 12px)",
                background: filter === key ? "rgba(212,168,67,0.15)" : "transparent",
                border: `1px solid ${filter === key ? "rgba(212,168,67,0.5)" : "rgba(212,168,67,0.15)"}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(10px, 1vw, 12px)",
                fontWeight: filter === key ? 700 : 500,
                color: filter === key ? "#D4A843" : "rgba(212,168,67,0.5)",
                letterSpacing: "0.05em",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Lista de Rounds */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "clamp(8px, 1vw, 12px)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(212,168,67,0.3) transparent",
          }}
        >
          {filteredHistory.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(12px, 1.3vw, 14px)",
                color: "rgba(212,168,67,0.4)",
                fontStyle: "italic",
              }}
            >
              Nenhuma rodada encontrada
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 0.8vw, 10px)" }}>
              {filteredHistory.map((round, index) => {
                const colors = getBadgeColor(round.crashPoint);
                const result = playerResults.get(round.id) || { status: "none", amount: 0 };

                return (
                  <motion.div
                    key={round.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ background: "rgba(212,168,67,0.05)" }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(8px, 1vw, 12px)",
                      padding: "clamp(10px, 1.2vw, 14px)",
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(212,168,67,0.1)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* Nonce */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(10px, 1vw, 12px)",
                        color: "rgba(255,255,255,0.4)",
                        minWidth: "clamp(40px, 5vw, 55px)",
                      }}
                    >
                      #{round.nonce}
                    </span>

                    {/* Badge Crash Point */}
                    <div
                      style={{
                        padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "6px",
                        minWidth: "clamp(50px, 6vw, 70px)",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(11px, 1.1vw, 13px)",
                          fontWeight: 700,
                          color: colors.text,
                        }}
                      >
                        {round.crashPoint.toFixed(2)}×
                      </span>
                    </div>

                    {/* Status do Jogador */}
                    <div style={{ flex: 1 }}>
                      {result.status === "won" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 0.5vw, 6px)" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-cinzel)",
                              fontSize: "clamp(10px, 1vw, 12px)",
                              fontWeight: 600,
                              color: "#00E676",
                            }}
                          >
                            ✓ SACOU
                          </span>
                          {result.cashoutMultiplier && (
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "clamp(9px, 0.9vw, 11px)",
                                color: "rgba(0,230,118,0.7)",
                              }}
                            >
                              @{result.cashoutMultiplier.toFixed(2)}×
                            </span>
                          )}
                        </div>
                      )}
                      {result.status === "lost" && (
                        <span
                          style={{
                            fontFamily: "var(--font-cinzel)",
                            fontSize: "clamp(10px, 1vw, 12px)",
                            fontWeight: 600,
                            color: "#FF4444",
                          }}
                        >
                          ✗ PERDEU
                        </span>
                      )}
                      {result.status === "none" && (
                        <span
                          style={{
                            fontFamily: "var(--font-cinzel)",
                            fontSize: "clamp(10px, 1vw, 12px)",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          — NÃO APOSTOU
                        </span>
                      )}
                    </div>

                    {/* Resultado em GC */}
                    {result.status !== "none" && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(11px, 1.1vw, 13px)",
                          fontWeight: 700,
                          color: result.status === "won" ? "#00E676" : "#FF4444",
                          textShadow: result.status === "won"
                            ? "0 0 8px rgba(0,230,118,0.4)"
                            : "0 0 8px rgba(255,68,68,0.4)",
                        }}
                      >
                        {result.status === "won" ? "+" : ""}
                        {result.amount.toLocaleString("pt-BR")} GC
                      </span>
                    )}

                    {/* Botao PF */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPF(round);
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: "clamp(24px, 2.5vw, 30px)",
                        height: "clamp(24px, 2.5vw, 30px)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                      }}
                      title="Ver Provably Fair"
                    >
                      <img
                        src={ASSETS.iconProvablyFair}
                        alt="Provably Fair"
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: 0.6,
                          filter: "drop-shadow(0 0 4px rgba(212,168,67,0.3))",
                          transition: "opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "clamp(12px, 1.5vw, 16px)",
            borderTop: "1px solid rgba(212,168,67,0.15)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(10px, 1vw, 12px)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Mostrando {filteredHistory.length} de {history.length} rodadas
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
