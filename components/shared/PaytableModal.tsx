"use client";

// PaytableModal — tabela de pagamentos compartilhada para todos os 22 jogos
// Recebe categorias de simbolos com payouts — layout premium com cards
// Suporta abas por categoria, imagem do simbolo, payouts progressivos

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import GameModal from "./GameModal";

// Simbolo generico que qualquer jogo pode usar
export interface PaytableSymbol {
  id: string;
  name: string;
  imagePath: string;
  color: string;
  // Payouts: chave = quantidade minima, valor = multiplicador
  payouts: Record<number | string, number>;
  description?: string;
}

// Categoria de simbolos (ex: Premium, Gemas, Especiais)
export interface PaytableCategory {
  id: string;
  label: string;
  symbols: PaytableSymbol[];
  // Formato das colunas de payout (ex: ["8+", "9+", "10+", "11+", "12+"])
  payoutLabels?: string[];
}

// Props publicas
export interface PaytableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  lang?: "br" | "in";
  categories: PaytableCategory[];
  // Info extra no rodape (ex: RTP, regras especiais)
  footerInfo?: ReactNode;
  // ESC stack
  escPush?: (id: string, close: () => void) => void;
  escPop?: (id: string) => void;
}

const GOLD = "#D4A843";

export default function PaytableModal({
  open,
  onClose,
  title = "TABELA DE PAGAMENTOS",
  lang = "br",
  categories,
  footerInfo,
  escPush,
  escPop,
}: PaytableModalProps) {
  return (
    <GameModal
      open={open}
      onClose={onClose}
      title={title}
      icon="/assets/shared/icons/icon-paytable.png"
      escId="paytable-modal"
      escPush={escPush}
      escPop={escPop}
      width="clamp(380px, 62vw, 740px)"
      tabs={categories.length > 1
        ? categories.map(c => ({ id: c.id, label: c.label }))
        : undefined
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} lang={lang} />
        ))}

        {/* Info extra no rodape */}
        {footerInfo && (
          <div
            style={{
              borderTop: "1px solid rgba(212,168,67,0.08)",
              paddingTop: "14px",
              fontSize: "clamp(10px, 0.95vw, 12px)",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
            }}
          >
            {footerInfo}
          </div>
        )}
      </div>
    </GameModal>
  );
}

// =============================================================================
// SECAO DE CATEGORIA
// =============================================================================

function CategorySection({
  category,
  lang,
}: {
  category: PaytableCategory;
  lang: string;
}) {
  const payKeys = category.payoutLabels
    || Object.keys(category.symbols[0]?.payouts || {}).sort((a, b) => Number(a) - Number(b)).map(k => `${k}+`);

  return (
    <div>
      {/* Titulo da categoria */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(11px, 1.2vw, 14px)",
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "1.5px",
          marginBottom: "10px",
          paddingBottom: "6px",
          borderBottom: "1px solid rgba(212,168,67,0.1)",
          textShadow: "0 0 8px rgba(212,168,67,0.15)",
        }}
      >
        {category.label}
      </div>

      {/* Cards de simbolo */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {category.symbols.map((symbol, idx) => (
          <SymbolCard key={symbol.id} symbol={symbol} payKeys={payKeys} index={idx} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CARD DE SIMBOLO
// =============================================================================

function SymbolCard({
  symbol,
  payKeys,
  index,
}: {
  symbol: PaytableSymbol;
  payKeys: string[];
  index: number;
}) {
  // Extrair numeros das payKeys pra buscar payouts
  const payoutValues = payKeys.map(key => {
    const num = parseInt(key);
    return symbol.payouts[num] ?? symbol.payouts[key] ?? 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5) }}
      whileHover={{ background: "rgba(212,168,67,0.04)" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 1vw, 14px)",
        padding: "clamp(8px, 1vw, 12px)",
        borderRadius: "8px",
        background: index % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      {/* Imagem do simbolo */}
      <div
        style={{
          width: "clamp(36px, 4vw, 48px)",
          height: "clamp(36px, 4vw, 48px)",
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${symbol.color}22`,
          background: `radial-gradient(circle at center, ${symbol.color}08, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={symbol.imagePath}
          alt={symbol.name}
          style={{
            width: "clamp(28px, 3.2vw, 40px)",
            height: "clamp(28px, 3.2vw, 40px)",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Nome */}
      <div
        style={{
          width: "clamp(50px, 7vw, 80px)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(11px, 1.1vw, 13px)",
          fontWeight: 600,
          color: symbol.color,
          flexShrink: 0,
        }}
      >
        {symbol.name}
      </div>

      {/* Payouts progressivos */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "clamp(4px, 0.6vw, 8px)",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {payKeys.map((key, pIdx) => {
          const val = payoutValues[pIdx];
          if (val === 0) return null;
          // Destaque progressivo: quanto maior o payout, mais brilhante
          const maxVal = Math.max(...payoutValues.filter(v => v > 0));
          const intensity = maxVal > 0 ? val / maxVal : 0;
          const isMax = val === maxVal && maxVal > 0;

          return (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "clamp(36px, 4vw, 48px)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(8px, 0.7vw, 9px)",
                  color: "rgba(212,168,67,0.35)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {key}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(10px, 1vw, 12px)",
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: isMax
                    ? "#FFD700"
                    : intensity > 0.5
                      ? "rgba(212,168,67,0.9)"
                      : "rgba(255,255,255,0.5)",
                  textShadow: isMax ? "0 0 8px rgba(255,215,0,0.3)" : "none",
                }}
              >
                x{val}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
