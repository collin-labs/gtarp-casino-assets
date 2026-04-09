"use client";

// HistoryModal — historico compartilhado premium para todos os 22 jogos
// Recebe colunas + dados genericos — cada jogo define suas colunas
// Layout: tabela premium, linhas alternadas com stagger, wins com glow verde
// Suporta rows customizados (ex: bicho mostra animais, slots mostra multiplicador)

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import GameModal from "./GameModal";

// Coluna generica — cada jogo define as suas
export interface HistoryColumn<T = any> {
  id: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: T, index: number) => ReactNode;
  headerStyle?: React.CSSProperties;
}

// Props publicas
export interface HistoryModalProps<T = any> {
  open: boolean;
  onClose: () => void;
  title?: string;
  lang?: "br" | "in";
  columns: HistoryColumn<T>[];
  data: T[];
  emptyMessage?: string;
  // Renderizar conteudo expandido ao clicar numa row (opcional)
  renderRowDetail?: (row: T, index: number) => ReactNode;
  // Props do GameModal
  escPush?: (id: string, close: () => void) => void;
  escPop?: (id: string) => void;
  // Row customizado completo (substitui a tabela — pra jogos como bicho que tem layout especial)
  renderCustomRow?: (row: T, index: number) => ReactNode;
}

const GOLD = "#D4A843";
const GREEN = "#00E676";
const RED = "#FF6B6B";

export default function HistoryModal<T extends { id?: number | string }>({
  open,
  onClose,
  title = "HISTORICO",
  lang = "br",
  columns,
  data,
  emptyMessage,
  renderRowDetail,
  escPush,
  escPop,
  renderCustomRow,
}: HistoryModalProps<T>) {
  const empty = emptyMessage || (
    lang === "br"
      ? "Nenhum historico ainda. Jogue para ver seus resultados aqui."
      : "No history yet. Play to see your results here."
  );

  return (
    <GameModal
      open={open}
      onClose={onClose}
      title={title}
      icon="/assets/shared/icons/icon-history.png"
      escId="history-modal"
      escPush={escPush}
      escPop={escPop}
      width="clamp(370px, 60vw, 720px)"
    >
      {data.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "clamp(30px, 5vw, 60px) 20px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(12px, 1.2vw, 14px)",
          }}
        >
          <img
            src="/assets/shared/icons/icon-history.png"
            alt=""
            style={{ width: 40, height: 40, opacity: 0.15, marginBottom: 12 }}
          />
          <div>{empty}</div>
        </div>
      ) : renderCustomRow ? (
        /* === MODO CUSTOM ROW (ex: bicho com animais) === */
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {data.map((row, idx) => (
            <motion.div
              key={row.id ?? idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.6) }}
            >
              {renderCustomRow(row, idx)}
            </motion.div>
          ))}
        </div>
      ) : (
        /* === MODO TABELA (ex: slots com colunas) === */
        <div style={{ width: "100%", minWidth: 0 }}>
          {/* Header da tabela */}
          <div
            style={{
              display: "flex",
              padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1vw, 14px)",
              borderBottom: `1px solid rgba(212,168,67,0.12)`,
              marginBottom: "4px",
              position: "sticky",
              top: 0,
              background: "linear-gradient(180deg, #151210 0%, rgba(14,12,9,0.98) 100%)",
              zIndex: 2,
            }}
          >
            {columns.map((col) => (
              <div
                key={col.id}
                style={{
                  flex: col.width ? `0 0 ${col.width}` : 1,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(9px, 0.9vw, 11px)",
                  fontWeight: 700,
                  color: "rgba(212,168,67,0.5)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textAlign: col.align || "center",
                  ...col.headerStyle,
                }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {data.map((row, idx) => (
              <motion.div
                key={row.id ?? idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.025, 0.5) }}
                whileHover={{
                  background: "rgba(212,168,67,0.06)",
                  transition: { duration: 0.15 },
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "clamp(8px, 1vw, 12px) clamp(8px, 1vw, 14px)",
                  background: idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  borderRadius: "6px",
                  cursor: renderRowDetail ? "pointer" : "default",
                  transition: "background 0.15s",
                }}
              >
                {columns.map((col) => (
                  <div
                    key={col.id}
                    style={{
                      flex: col.width ? `0 0 ${col.width}` : 1,
                      textAlign: col.align || "center",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "clamp(11px, 1.1vw, 13px)",
                      color: "rgba(255,255,255,0.75)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {col.render(row, idx)}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </GameModal>
  );
}

// =============================================================================
// HELPERS — estilos prontos pra usar em colunas
// =============================================================================

/** Badge de vitoria/derrota com cor */
export function WinBadge({ won, lang = "br" }: { won: boolean; lang?: "br" | "in" }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "clamp(9px, 0.85vw, 11px)",
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        background: won ? "rgba(0,230,118,0.08)" : "rgba(255,68,68,0.08)",
        color: won ? GREEN : RED,
        border: `1px solid ${won ? "rgba(0,230,118,0.2)" : "rgba(255,68,68,0.15)"}`,
        textShadow: won ? `0 0 8px rgba(0,230,118,0.3)` : "none",
      }}
    >
      {won ? (lang === "br" ? "WIN" : "WIN") : (lang === "br" ? "LOSS" : "LOSS")}
    </span>
  );
}

/** Valor com cor verde (ganho) ou vermelho (perda) */
export function WinAmount({ value, prefix = "GC" }: { value: number; prefix?: string }) {
  const won = value > 0;
  return (
    <span
      style={{
        fontWeight: 700,
        color: won ? GREEN : value === 0 ? RED : "rgba(255,255,255,0.4)",
        textShadow: won ? `0 0 6px rgba(0,230,118,0.2)` : "none",
      }}
    >
      {won ? `+${value.toLocaleString("pt-BR")} ${prefix}` : `0 ${prefix}`}
    </span>
  );
}

/** Multiplicador com destaque progressivo */
export function MultiBadge({ multi }: { multi: string }) {
  const isWin = multi !== "-" && multi !== "0" && multi !== "";
  const numVal = parseFloat(multi.replace("x", ""));
  const isBig = numVal >= 5;
  const isMega = numVal >= 20;

  return (
    <span
      style={{
        fontWeight: 700,
        color: !isWin
          ? "rgba(255,255,255,0.2)"
          : isMega
            ? "#FFD700"
            : isBig
              ? GREEN
              : "rgba(0,230,118,0.7)",
        textShadow: isMega
          ? "0 0 10px rgba(255,215,0,0.4)"
          : isBig
            ? "0 0 6px rgba(0,230,118,0.2)"
            : "none",
      }}
    >
      {isWin ? multi : "-"}
    </span>
  );
}
