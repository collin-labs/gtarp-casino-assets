"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Bet } from "./RouletteGame";

// European roulette layout
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

// Payout multipliers (European)
const PAYOUTS: Record<string, number> = {
  straight: 35, // single number
  split: 17, // 2 numbers
  street: 11, // 3 numbers (row)
  corner: 8, // 4 numbers
  sixLine: 5, // 6 numbers (2 rows)
  column: 2, // 12 numbers (column)
  dozen: 2, // 12 numbers (1-12, 13-24, 25-36)
  red: 1, // 18 numbers
  black: 1,
  even: 1,
  odd: 1,
  low: 1, // 1-18
  high: 1, // 19-36
};

// Chip values
const CHIP_VALUES = [1, 5, 25, 100, 500, 1000];

interface BettingTableProps {
  bets: Bet[];
  onPlaceBet: (bet: Bet) => void;
  onRemoveBet: (index: number) => void;
  onClearBets: () => void;
  disabled?: boolean;
  isBR: boolean;
  luckyNumbers?: Map<number, number>;
  selectedChip: number;
  onSelectChip: (value: number) => void;
}

export default function BettingTable({
  bets,
  onPlaceBet,
  onRemoveBet,
  onClearBets,
  disabled = false,
  isBR,
  luckyNumbers = new Map(),
  selectedChip,
  onSelectChip,
}: BettingTableProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Get bet amount for a specific cell
  const getBetAmount = useCallback(
    (type: string, numbers: number[]) => {
      const key = `${type}-${numbers.sort((a, b) => a - b).join(",")}`;
      return bets
        .filter((b) => `${b.type}-${b.numbers.sort((a, b) => a - b).join(",")}` === key)
        .reduce((sum, b) => sum + b.amount, 0);
    },
    [bets]
  );

  // Handle cell click
  const handleCellClick = useCallback(
    (type: string, numbers: number[]) => {
      if (disabled) return;
      const payout = PAYOUTS[type] || 35;
      onPlaceBet({
        type,
        numbers,
        amount: selectedChip,
        payout,
      });
    },
    [disabled, selectedChip, onPlaceBet]
  );

  // Number cell component
  const NumberCell = ({
    num,
    style,
  }: {
    num: number;
    style?: React.CSSProperties;
  }) => {
    const color =
      num === 0 ? "green" : RED_NUMBERS.includes(num) ? "red" : "black";
    const isLucky = luckyNumbers.has(num);
    const multiplier = luckyNumbers.get(num);
    const betAmount = getBetAmount("straight", [num]);
    const isHovered = hoveredCell === `num-${num}`;

    return (
      <motion.div
        whileHover={disabled ? {} : { scale: 1.05, zIndex: 10 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onMouseEnter={() => setHoveredCell(`num-${num}`)}
        onMouseLeave={() => setHoveredCell(null)}
        onClick={() => handleCellClick("straight", [num])}
        style={{
          width: "clamp(28px, 3vw, 42px)",
          height: "clamp(36px, 4vw, 54px)",
          background:
            color === "green"
              ? "linear-gradient(180deg, #00C853, #004D25)"
              : color === "red"
              ? "linear-gradient(180deg, #E53935, #8B0000)"
              : "linear-gradient(180deg, #1A1A1A, #0A0A0A)",
          border: `1px solid ${
            isLucky ? "#FFD700" : "rgba(212,168,67,0.3)"
          }`,
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          position: "relative",
          boxShadow: isLucky
            ? "0 0 12px rgba(255,215,0,0.5), inset 0 0 8px rgba(255,215,0,0.2)"
            : isHovered
            ? "0 0 8px rgba(212,168,67,0.3)"
            : "inset 0 1px 0 rgba(255,255,255,0.1)",
          transition: "box-shadow 0.2s",
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(12px, 1.3vw, 18px)",
            fontWeight: 700,
            color: "#FFF",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {num}
        </span>

        {/* Lucky multiplier badge */}
        {isLucky && multiplier && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "linear-gradient(135deg, #FFD700, #FF6B00)",
              borderRadius: "4px",
              padding: "1px 4px",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              fontWeight: 800,
              color: "#000",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              zIndex: 5,
            }}
          >
            {multiplier}x
          </motion.div>
        )}

        {/* Bet chip indicator */}
        {betAmount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              minWidth: "clamp(16px, 1.8vw, 24px)",
              height: "clamp(16px, 1.8vw, 24px)",
              background: "linear-gradient(135deg, #D4A843, #8B6914)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              fontWeight: 700,
              color: "#000",
              border: "1px solid #FFD700",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              zIndex: 5,
            }}
          >
            {betAmount >= 1000 ? `${(betAmount / 1000).toFixed(0)}K` : betAmount}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Outside bet cell component
  const OutsideBetCell = ({
    label,
    type,
    numbers,
    color,
    style,
  }: {
    label: string;
    type: string;
    numbers: number[];
    color?: "red" | "black";
    style?: React.CSSProperties;
  }) => {
    const betAmount = getBetAmount(type, numbers);
    const isHovered = hoveredCell === `outside-${type}`;

    return (
      <motion.div
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        onMouseEnter={() => setHoveredCell(`outside-${type}`)}
        onMouseLeave={() => setHoveredCell(null)}
        onClick={() => handleCellClick(type, numbers)}
        style={{
          height: "clamp(28px, 3vw, 40px)",
          background:
            color === "red"
              ? "linear-gradient(180deg, #E53935, #8B0000)"
              : color === "black"
              ? "linear-gradient(180deg, #1A1A1A, #0A0A0A)"
              : "linear-gradient(180deg, #1A1A1A, #0A0A0A)",
          border: "1px solid rgba(212,168,67,0.3)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          position: "relative",
          boxShadow: isHovered
            ? "0 0 8px rgba(212,168,67,0.3)"
            : "inset 0 1px 0 rgba(255,255,255,0.1)",
          transition: "box-shadow 0.2s",
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(9px, 1vw, 14px)",
            fontWeight: 700,
            color: "#D4A843",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          {label}
        </span>

        {/* Bet chip indicator */}
        {betAmount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              minWidth: "clamp(16px, 1.8vw, 24px)",
              height: "clamp(16px, 1.8vw, 24px)",
              background: "linear-gradient(135deg, #D4A843, #8B6914)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              fontWeight: 700,
              color: "#000",
              border: "1px solid #FFD700",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              zIndex: 5,
            }}
          >
            {betAmount >= 1000 ? `${(betAmount / 1000).toFixed(0)}K` : betAmount}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Generate number rows (3 rows of 12)
  const numberRows = useMemo(() => {
    const rows: number[][] = [[], [], []];
    for (let i = 1; i <= 36; i++) {
      rows[(i - 1) % 3].push(i);
    }
    return rows;
  }, []);

  // Total bet amount
  const totalBet = useMemo(
    () => bets.reduce((sum, b) => sum + b.amount, 0),
    [bets]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(8px, 1vw, 14px)",
        padding: "clamp(8px, 1vw, 14px)",
        background: "rgba(10,10,10,0.9)",
        border: "1px solid rgba(212,168,67,0.3)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* Chip selector */}
      <div
        style={{
          display: "flex",
          gap: "clamp(4px, 0.5vw, 8px)",
          justifyContent: "center",
          padding: "clamp(4px, 0.5vw, 8px)",
          background: "rgba(20,20,20,0.8)",
          borderRadius: "8px",
          border: "1px solid rgba(212,168,67,0.2)",
        }}
      >
        {CHIP_VALUES.map((value) => {
          const isSelected = selectedChip === value;
          const chipImage = `/assets/roulette/chips/chip-${value}.png`;
          return (
            <motion.button
              key={value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectChip(value)}
              style={{
                width: "clamp(32px, 3.5vw, 48px)",
                height: "clamp(32px, 3.5vw, 48px)",
                borderRadius: "50%",
                border: isSelected
                  ? "2px solid #FFD700"
                  : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                position: "relative",
                boxShadow: isSelected
                  ? "0 0 12px rgba(255,215,0,0.5)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              <img
                src={chipImage}
                alt={`${value}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: isSelected ? "brightness(1.2)" : "brightness(0.8)",
                  transition: "filter 0.2s",
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Main betting table */}
      <div
        style={{
          display: "flex",
          gap: "clamp(2px, 0.3vw, 4px)",
        }}
      >
        {/* Zero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2px, 0.3vw, 4px)" }}>
          <NumberCell
            num={0}
            style={{
              height: `calc((clamp(36px, 4vw, 54px) + clamp(2px, 0.3vw, 4px)) * 3 - clamp(2px, 0.3vw, 4px))`,
            }}
          />
        </div>

        {/* Number grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(2px, 0.3vw, 4px)",
          }}
        >
          {/* Numbers 1-36 (displayed in 3 rows) */}
          {[2, 1, 0].map((rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: "flex",
                gap: "clamp(2px, 0.3vw, 4px)",
              }}
            >
              {numberRows[rowIdx].map((num) => (
                <NumberCell key={num} num={num} />
              ))}
            </div>
          ))}

          {/* Dozens row */}
          <div
            style={{
              display: "flex",
              gap: "clamp(2px, 0.3vw, 4px)",
            }}
          >
            <OutsideBetCell
              label={isBR ? "1-12" : "1st 12"}
              type="dozen"
              numbers={Array.from({ length: 12 }, (_, i) => i + 1)}
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label={isBR ? "13-24" : "2nd 12"}
              type="dozen"
              numbers={Array.from({ length: 12 }, (_, i) => i + 13)}
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label={isBR ? "25-36" : "3rd 12"}
              type="dozen"
              numbers={Array.from({ length: 12 }, (_, i) => i + 25)}
              style={{ flex: 1 }}
            />
          </div>

          {/* Outside bets row */}
          <div
            style={{
              display: "flex",
              gap: "clamp(2px, 0.3vw, 4px)",
            }}
          >
            <OutsideBetCell
              label={isBR ? "1-18" : "1-18"}
              type="low"
              numbers={Array.from({ length: 18 }, (_, i) => i + 1)}
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label={isBR ? "PAR" : "EVEN"}
              type="even"
              numbers={Array.from({ length: 18 }, (_, i) => (i + 1) * 2)}
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label=""
              type="red"
              numbers={RED_NUMBERS}
              color="red"
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label=""
              type="black"
              numbers={Array.from({ length: 36 }, (_, i) => i + 1).filter(
                (n) => !RED_NUMBERS.includes(n)
              )}
              color="black"
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label={isBR ? "IMPAR" : "ODD"}
              type="odd"
              numbers={Array.from({ length: 18 }, (_, i) => i * 2 + 1)}
              style={{ flex: 1 }}
            />
            <OutsideBetCell
              label={isBR ? "19-36" : "19-36"}
              type="high"
              numbers={Array.from({ length: 18 }, (_, i) => i + 19)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Column bets */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(2px, 0.3vw, 4px)",
          }}
        >
          {[2, 1, 0].map((colIdx) => (
            <OutsideBetCell
              key={colIdx}
              label="2:1"
              type="column"
              numbers={numberRows[colIdx]}
              style={{
                width: "clamp(28px, 3vw, 42px)",
                height: "clamp(36px, 4vw, 54px)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(4px, 0.5vw, 8px) 0",
        }}
      >
        {/* Total bet display */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(11px, 1.2vw, 16px)",
            color: "#D4A843",
          }}
        >
          {isBR ? "Total:" : "Total:"}{" "}
          <span style={{ color: "#00E676", fontWeight: 700 }}>
            {totalBet.toLocaleString()}
          </span>
        </div>

        {/* Clear bets button */}
        <motion.button
          whileHover={
            bets.length === 0 || disabled
              ? {}
              : { scale: 1.05, background: "rgba(255,23,68,0.3)" }
          }
          whileTap={bets.length === 0 || disabled ? {} : { scale: 0.95 }}
          onClick={onClearBets}
          disabled={bets.length === 0 || disabled}
          style={{
            padding: "clamp(4px, 0.5vw, 8px) clamp(12px, 1.2vw, 20px)",
            background: "rgba(255,23,68,0.15)",
            border: "1px solid rgba(255,23,68,0.4)",
            borderRadius: "6px",
            cursor: bets.length === 0 || disabled ? "not-allowed" : "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(9px, 1vw, 13px)",
            fontWeight: 700,
            color: bets.length === 0 || disabled ? "#666" : "#FF1744",
            letterSpacing: "1px",
            opacity: bets.length === 0 || disabled ? 0.5 : 1,
            transition: "all 0.2s",
          }}
        >
          {isBR ? "LIMPAR" : "CLEAR"}
        </motion.button>
      </div>
    </div>
  );
}
