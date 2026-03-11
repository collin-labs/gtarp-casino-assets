"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RouletteWheel, { type RouletteWheelRef } from "./RouletteWheel";
import BettingTable from "./BettingTable";
import type { RouletteView, RouletteMode, Bet, SpinResult } from "./RouletteGame";

// Red numbers for display
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

interface RouletteTableProps {
  mode: RouletteMode;
  onBack: () => void;
  isBR: boolean;
  setView: (v: RouletteView) => void;
  onSpinComplete: (result: SpinResult, bets: Bet[], totalWin: number) => void;
  luckyNumbers: Map<number, number>;
  generateLuckyNumbers: () => Map<number, number>;
}

export default function RouletteTable({
  mode,
  onBack,
  isBR,
  setView,
  onSpinComplete,
  luckyNumbers,
  generateLuckyNumbers,
}: RouletteTableProps) {
  const wheelRef = useRef<RouletteWheelRef>(null);
  const [balance, setBalance] = useState(1234.56);
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedChip, setSelectedChip] = useState(5);
  const [spinning, setSpinning] = useState(false);
  const [lastResults, setLastResults] = useState<number[]>([]);
  const [showLightningAnimation, setShowLightningAnimation] = useState(false);
  const [currentLuckyNumbers, setCurrentLuckyNumbers] = useState<Map<number, number>>(new Map());

  // Calculate winning bets
  const calculateWinnings = useCallback(
    (result: SpinResult, placedBets: Bet[]) => {
      let totalWin = 0;
      const winningNum = result.number;

      for (const bet of placedBets) {
        if (bet.numbers.includes(winningNum)) {
          let winAmount = bet.amount * (bet.payout + 1);

          // Apply multiplier for lucky numbers in lightning mode
          if (result.isLucky && result.multiplier && bet.type === "straight") {
            winAmount = bet.amount * result.multiplier;
          }

          totalWin += winAmount;
        }
      }

      return totalWin;
    },
    []
  );

  // Handle placing a bet
  const handlePlaceBet = useCallback(
    (bet: Bet) => {
      if (spinning || bet.amount > balance) return;
      setBets((prev) => [...prev, bet]);
      setBalance((prev) => prev - bet.amount);
    },
    [spinning, balance]
  );

  // Handle removing a bet
  const handleRemoveBet = useCallback(
    (index: number) => {
      if (spinning) return;
      const bet = bets[index];
      if (bet) {
        setBalance((prev) => prev + bet.amount);
        setBets((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [spinning, bets]
  );

  // Handle clearing all bets
  const handleClearBets = useCallback(() => {
    if (spinning) return;
    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    setBalance((prev) => prev + totalBet);
    setBets([]);
  }, [spinning, bets]);

  // Handle spin
  const handleSpin = useCallback(() => {
    if (spinning || bets.length === 0) return;

    // In lightning mode, generate lucky numbers before spin
    if (mode === "lightning") {
      const lucky = generateLuckyNumbers();
      setCurrentLuckyNumbers(lucky);
      setShowLightningAnimation(true);

      // Wait for lightning animation, then spin
      setTimeout(() => {
        setShowLightningAnimation(false);
        wheelRef.current?.spin();
      }, 2000);
    } else {
      wheelRef.current?.spin();
    }
  }, [spinning, bets.length, mode, generateLuckyNumbers]);

  // Handle spin start
  const handleSpinStart = useCallback(() => {
    setSpinning(true);
  }, []);

  // Handle spin end
  const handleSpinEnd = useCallback(
    (result: SpinResult) => {
      setSpinning(false);

      // Add to history
      setLastResults((prev) => [result.number, ...prev.slice(0, 19)]);

      // Calculate winnings
      const totalWin = calculateWinnings(result, bets);

      // Update balance
      if (totalWin > 0) {
        setBalance((prev) => prev + totalWin);
      }

      // Clear bets and notify parent
      setBets([]);
      onSpinComplete(result, bets, totalWin);
    },
    [bets, calculateWinnings, onSpinComplete]
  );

  // Get color class for history number
  const getHistoryColor = (num: number) => {
    if (num === 0) return "#00C853";
    return RED_NUMBERS.includes(num) ? "#E53935" : "#1A1A1A";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#0A0A0A",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("/assets/roulette/12.felt-texture.png")`,
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      {/* Radial gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(212,168,67,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          height: "clamp(42px, 5vh, 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(12px, 1.5vw, 24px)",
          borderBottom: "1px solid rgba(212,168,67,0.15)",
          backgroundImage:
            "linear-gradient(180deg, rgba(212,168,67,0.03), transparent)",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left: Back button + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 0.8vw, 14px)",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.15, color: "#FFD700" }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(18px, 2vw, 26px)",
              color: "#A8A8A8",
              fontFamily: "'Inter', sans-serif",
              padding: 0,
            }}
          >
            &#8249;
          </motion.button>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(14px, 1.5vw, 22px)",
              fontWeight: 800,
              color: "#D4A843",
              letterSpacing: "2px",
            }}
          >
            {mode === "lightning"
              ? isBR
                ? "ROLETA BLACKOUT"
                : "BLACKOUT ROULETTE"
              : isBR
              ? "ROLETA EUROPEIA"
              : "EUROPEAN ROULETTE"}
          </span>
          {mode === "lightning" && (
            <img
              src="/assets/roulette/07.lightning-bolt.png"
              alt=""
              style={{
                height: "clamp(20px, 2.5vw, 32px)",
                filter: "drop-shadow(0 0 6px rgba(255,215,0,0.5))",
              }}
            />
          )}
        </div>

        {/* Center: History strip */}
        <div
          style={{
            display: "flex",
            gap: "clamp(3px, 0.4vw, 6px)",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(8px, 0.8vw, 11px)",
              color: "#666",
              letterSpacing: "1px",
              marginRight: "4px",
            }}
          >
            {isBR ? "HIST" : "HIST"}:
          </span>
          {lastResults.slice(0, 10).map((num, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                width: "clamp(18px, 2vw, 26px)",
                height: "clamp(18px, 2vw, 26px)",
                borderRadius: "50%",
                background: getHistoryColor(num),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${num === 0 ? "#00E676" : "rgba(255,255,255,0.2)"}`,
                fontSize: "clamp(8px, 0.9vw, 12px)",
                fontWeight: 700,
                color: num === 0 ? "#000" : "#FFF",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {num}
            </motion.div>
          ))}
          {lastResults.length === 0 && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                color: "#444",
                fontStyle: "italic",
              }}
            >
              {isBR ? "Nenhum resultado" : "No results"}
            </span>
          )}
        </div>

        {/* Right: Balance */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(12px, 1.3vw, 18px)",
            color: "#00E676",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "clamp(14px, 1.5vw, 20px)" }}>
            GC
          </span>
          {balance.toFixed(2).replace(".", ",")}
        </div>
      </div>

      {/* MAIN GAME AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px, 2vw, 40px)",
          padding: "clamp(8px, 1vw, 16px)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Wheel section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(8px, 1vw, 16px)",
          }}
        >
          <RouletteWheel
            ref={wheelRef}
            size={Math.min(window.innerWidth * 0.28, 380)}
            luckyNumbers={mode === "lightning" ? currentLuckyNumbers : new Map()}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
          />

          {/* Spin button */}
          <motion.button
            whileHover={
              spinning || bets.length === 0
                ? {}
                : {
                    scale: 1.05,
                    boxShadow:
                      mode === "lightning"
                        ? "0 0 20px rgba(255,215,0,0.6)"
                        : "0 0 20px rgba(0,230,118,0.5)",
                  }
            }
            whileTap={spinning || bets.length === 0 ? {} : { scale: 0.95 }}
            onClick={handleSpin}
            disabled={spinning || bets.length === 0}
            style={{
              width: "clamp(120px, 12vw, 180px)",
              height: "clamp(44px, 4.5vw, 60px)",
              borderRadius: "10px",
              border: "none",
              cursor:
                spinning || bets.length === 0 ? "not-allowed" : "pointer",
              background:
                spinning || bets.length === 0
                  ? "linear-gradient(180deg, #333 0%, #222 100%)"
                  : mode === "lightning"
                  ? "linear-gradient(180deg, #FFD700 0%, #D4A843 40%, #8B6914 100%)"
                  : "linear-gradient(180deg, #00E676 0%, #00C853 40%, #004D25 100%)",
              opacity: spinning || bets.length === 0 ? 0.5 : 1,
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(14px, 1.4vw, 20px)",
              fontWeight: 800,
              color: mode === "lightning" ? "#000" : "#FFF",
              letterSpacing: "3px",
              boxShadow:
                spinning || bets.length === 0
                  ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                  : mode === "lightning"
                  ? "0 0 15px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.4)"
                  : "0 0 12px rgba(0,230,118,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.4)",
              transition: "all 0.2s",
            }}
          >
            {spinning
              ? isBR
                ? "GIRANDO..."
                : "SPINNING..."
              : isBR
              ? "GIRAR"
              : "SPIN"}
          </motion.button>

          {/* Lightning mode lucky numbers display */}
          {mode === "lightning" && currentLuckyNumbers.size > 0 && !spinning && (
            <div
              style={{
                display: "flex",
                gap: "clamp(4px, 0.5vw, 8px)",
                alignItems: "center",
                padding: "clamp(4px, 0.5vw, 8px)",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "8px",
                border: "1px solid rgba(255,215,0,0.3)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(8px, 0.8vw, 11px)",
                  color: "#FFD700",
                  letterSpacing: "1px",
                }}
              >
                LUCKY:
              </span>
              {Array.from(currentLuckyNumbers.entries()).map(([num, mult]) => (
                <div
                  key={num}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <div
                    style={{
                      width: "clamp(22px, 2.4vw, 32px)",
                      height: "clamp(22px, 2.4vw, 32px)",
                      borderRadius: "50%",
                      background:
                        num === 0
                          ? "#00C853"
                          : RED_NUMBERS.includes(num)
                          ? "#E53935"
                          : "#1A1A1A",
                      border: "2px solid #FFD700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(9px, 1vw, 13px)",
                      fontWeight: 700,
                      color: "#FFF",
                      boxShadow: "0 0 8px rgba(255,215,0,0.5)",
                    }}
                  >
                    {num}
                  </div>
                  <span
                    style={{
                      fontSize: "clamp(7px, 0.7vw, 10px)",
                      fontWeight: 800,
                      color: "#FFD700",
                    }}
                  >
                    {mult}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Betting table section */}
        <BettingTable
          bets={bets}
          onPlaceBet={handlePlaceBet}
          onRemoveBet={handleRemoveBet}
          onClearBets={handleClearBets}
          disabled={spinning}
          isBR={isBR}
          luckyNumbers={mode === "lightning" ? currentLuckyNumbers : new Map()}
          selectedChip={selectedChip}
          onSelectChip={setSelectedChip}
        />
      </div>

      {/* Lightning animation overlay */}
      <AnimatePresence>
        {showLightningAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              borderRadius: "inherit",
            }}
          >
            {/* Lightning bolt animation */}
            <motion.img
              src="/assets/roulette/07.lightning-bolt.png"
              alt=""
              initial={{ scale: 0, rotate: -20 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [- 20, 0, 0],
                filter: [
                  "brightness(2) drop-shadow(0 0 20px rgba(255,215,0,1))",
                  "brightness(1.5) drop-shadow(0 0 40px rgba(255,215,0,0.8))",
                  "brightness(1) drop-shadow(0 0 20px rgba(255,215,0,0.6))",
                ],
              }}
              transition={{ duration: 0.5 }}
              style={{
                width: "clamp(100px, 15vw, 200px)",
                marginBottom: "clamp(16px, 2vw, 32px)",
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 900,
                color: "#FFD700",
                textShadow:
                  "0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3)",
                letterSpacing: "4px",
                marginBottom: "clamp(12px, 1.5vw, 24px)",
              }}
            >
              LIGHTNING ROUND
            </motion.h2>

            {/* Lucky numbers reveal */}
            <div
              style={{
                display: "flex",
                gap: "clamp(12px, 1.5vw, 24px)",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {Array.from(currentLuckyNumbers.entries()).map(
                ([num, mult], i) => (
                  <motion.div
                    key={num}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "clamp(4px, 0.5vw, 8px)",
                    }}
                  >
                    <div
                      style={{
                        width: "clamp(48px, 5vw, 72px)",
                        height: "clamp(48px, 5vw, 72px)",
                        borderRadius: "50%",
                        background:
                          num === 0
                            ? "linear-gradient(180deg, #00E676, #004D25)"
                            : RED_NUMBERS.includes(num)
                            ? "linear-gradient(180deg, #FF1744, #8B0000)"
                            : "linear-gradient(180deg, #333, #0A0A0A)",
                        border: "3px solid #FFD700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "clamp(18px, 2vw, 28px)",
                        fontWeight: 900,
                        color: "#FFF",
                        fontFamily: "'Cinzel', serif",
                        boxShadow:
                          "0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3)",
                      }}
                    >
                      {num}
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                      style={{
                        background:
                          mult >= 500
                            ? "linear-gradient(135deg, #FF1744, #B71C1C)"
                            : mult >= 200
                            ? "linear-gradient(135deg, #FF6B00, #E65100)"
                            : "linear-gradient(135deg, #FFD700, #8B6914)",
                        padding: "clamp(4px, 0.4vw, 6px) clamp(8px, 1vw, 14px)",
                        borderRadius: "4px",
                        fontSize: "clamp(12px, 1.3vw, 18px)",
                        fontWeight: 800,
                        color: mult >= 200 ? "#FFF" : "#000",
                        fontFamily: "'Cinzel', serif",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    >
                      {mult}x
                    </motion.div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
