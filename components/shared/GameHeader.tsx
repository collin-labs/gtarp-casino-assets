"use client";

// GameHeader — cabeçalho padronizado para todos os 22 jogos
// Botao voltar | Titulo/Logo central | Saldo GCoin + icones de acao
// Muda estilo aqui = muda em todos os jogos

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useCurrencyConfig } from "@/hooks/use-currency-config";
import LuxuryTooltip from "./LuxuryTooltip";

export interface HeaderAction {
  id: string;
  icon: string;
  tooltip: string;
  onClick: () => void;
  badge?: string;
}

export interface GameHeaderProps {
  onBack: () => void;
  title: string;
  logo?: string;
  balance: number;
  lang: "br" | "in" | "en";
  actions?: HeaderAction[];
  rightSlot?: ReactNode;
}

const GOLD = "#D4A843";

function formatBalance(val: number): string {
  return val >= 1000 ? val.toLocaleString("pt-BR") : String(val);
}

export default function GameHeader({
  onBack,
  title,
  logo,
  balance,
  lang,
  actions = [],
  rightSlot,
}: GameHeaderProps) {
  const { config: cc } = useCurrencyConfig();
  const backLabel = lang === "br" ? "VOLTAR" : "BACK";

  return (
    <header
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(6px, 1vw, 12px) clamp(10px, 1.5vw, 20px)",
        borderBottom: "1px solid rgba(212,168,67,0.15)",
        background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
        flexShrink: 0,
      }}
    >
      {/* Esquerda: Voltar */}
      <LuxuryTooltip text={lang === "br" ? "Voltar ao lobby do casino" : "Back to casino lobby"} position="bottom">
      <motion.button
        onClick={onBack}
        whileHover={{ borderColor: "rgba(212,168,67,0.6)", color: GOLD }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(4px, 0.5vw, 8px)",
          padding: "clamp(4px, 0.6vw, 8px) clamp(8px, 1vw, 14px)",
          background: "rgba(10,10,10,0.6)",
          border: "1px solid rgba(212,168,67,0.25)",
          borderRadius: "6px",
          cursor: "pointer",
          color: "rgba(212,168,67,0.7)",
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(9px, 0.9vw, 12px)",
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase" as const,
          transition: "all 0.2s",
          flexShrink: 0,
          minHeight: "32px",
        }}
      >
        <span style={{ fontSize: "clamp(12px, 1vw, 16px)" }}>←</span>
        {backLabel}
      </motion.button>
      </LuxuryTooltip>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(6px, 0.8vw, 10px)",
          pointerEvents: "none",
        }}
      >
        {logo && (
          <img
            src={logo}
            alt=""
            style={{
              height: "clamp(24px, 3vw, 40px)",
              filter: "drop-shadow(0 0 8px rgba(212,168,67,0.4))",
            }}
          />
        )}
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 800,
            fontSize: "clamp(12px, 1.4vw, 18px)",
            color: GOLD,
            letterSpacing: "2px",
            margin: 0,
            textShadow: "0 0 10px rgba(212,168,67,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Direita: Saldo + Acoes */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 0.6vw, 8px)", flexShrink: 0 }}>
        {/* Saldo */}
        <LuxuryTooltip text={lang === "br" ? "Saldo disponivel para apostas" : "Balance available for bets"} position="bottom">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
            background: "rgba(10,10,10,0.6)",
            border: "1px solid rgba(212,168,67,0.15)",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(11px, 1.1vw, 14px)",
            fontWeight: 700,
            color: GOLD,
            fontVariantNumeric: "tabular-nums" as const,
          }}
        >
          <img
            src={cc.icon}
            alt={cc.name}
            style={{ width: "16px", height: "16px", flexShrink: 0 }}
          />
          {formatBalance(balance)}
        </div>
        </LuxuryTooltip>
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={action.onClick}
            whileHover={{ scale: 1.1, borderColor: "rgba(212,168,67,0.5)" }}
            whileTap={{ scale: 0.9 }}
            title={action.tooltip}
            style={{
              position: "relative",
              width: "clamp(28px, 2.5vw, 34px)",
              height: "clamp(28px, 2.5vw, 34px)",
              padding: "4px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <img
              src={action.icon}
              alt=""
              style={{ width: "clamp(16px, 1.5vw, 20px)", height: "clamp(16px, 1.5vw, 20px)", opacity: 0.7 }}
            />
            {action.badge && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  padding: "1px 4px",
                  background: "#FF4444",
                  borderRadius: "8px",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {action.badge}
              </span>
            )}
          </motion.button>
        ))}

        {/* Slot customizado extra (ex: botao ?) */}
        {rightSlot}
      </div>
    </header>
  );
}
