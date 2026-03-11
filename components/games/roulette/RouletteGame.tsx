"use client";

import { useState, useCallback } from "react";
import ModeSelect from "./ModeSelect";
import RouletteTable from "./RouletteTable";
import ResultOverlay from "./ResultOverlay";
import BigWinOverlay from "./BigWinOverlay";
import HistoryOverlay from "./HistoryOverlay";
import LightningOverlay from "./LightningOverlay";

export type RouletteView =
  | "modeSelect"
  | "classicGame"
  | "lightningGame"
  | "result"
  | "bigWin"
  | "history"
  | "lightning";

export type RouletteMode = "classic" | "lightning";

export interface Bet {
  type: string;
  numbers: number[];
  amount: number;
  payout: number;
}

export interface SpinResult {
  number: number;
  color: "red" | "black" | "green";
  isLucky?: boolean;
  multiplier?: number;
}

export interface HistoryEntry {
  number: number;
  color: "red" | "black" | "green";
  win: boolean;
  amount: number;
  isLucky?: boolean;
  multiplier?: number;
}

interface RouletteGameProps {
  onBack: () => void;
  lang?: "br" | "in";
}

export default function RouletteGame({ onBack, lang = "br" }: RouletteGameProps) {
  const isBR = lang === "br";
  
  // Screen state
  const [screen, setScreen] = useState<"modeSelect" | "classicGame" | "lightningGame">("modeSelect");
  const [selectedMode, setSelectedMode] = useState<RouletteMode>("classic");
  
  // Shared history state (lifted from RouletteTable)
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Overlays
  const [showHistory, setShowHistory] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  
  // Win overlays
  const [resultData, setResultData] = useState<{
    result: SpinResult;
    bets: Bet[];
    totalWin: number;
  } | null>(null);
  const [bigWinData, setBigWinData] = useState<{
    tier: "big" | "mega" | "epic";
    amount: number;
  } | null>(null);
  
  // Lightning mode lucky numbers (regenerated each spin)
  const [luckyNumbers, setLuckyNumbers] = useState<Map<number, number>>(new Map());
  
  const handleSelectMode = useCallback((mode: RouletteMode) => {
    setSelectedMode(mode);
    setScreen(mode === "classic" ? "classicGame" : "lightningGame");
  }, []);
  
  const handleSetView = useCallback((v: RouletteView) => {
    switch (v) {
      case "modeSelect":
        setScreen("modeSelect");
        break;
      case "history":
        setShowHistory(true);
        break;
      case "lightning":
        setShowLightning(true);
        break;
      default:
        break;
    }
  }, []);
  
  const handleSpinComplete = useCallback((result: SpinResult, bets: Bet[], totalWin: number) => {
    // Add to history
    setHistory(prev => [{
      number: result.number,
      color: result.color,
      win: totalWin > 0,
      amount: totalWin,
      isLucky: result.isLucky,
      multiplier: result.multiplier,
    }, ...prev.slice(0, 49)]);
    
    // Show result overlay
    setResultData({ result, bets, totalWin });
    
    // Determine win tier for big win overlay
    if (totalWin >= 5000) {
      setBigWinData({ tier: "epic", amount: totalWin });
    } else if (totalWin >= 1000) {
      setBigWinData({ tier: "mega", amount: totalWin });
    } else if (totalWin >= 250) {
      setBigWinData({ tier: "big", amount: totalWin });
    }
  }, []);
  
  const generateLuckyNumbers = useCallback(() => {
    const count = Math.floor(Math.random() * 5) + 1;
    const lucky = new Map<number, number>();
    const usedNumbers = new Set<number>();
    
    for (let i = 0; i < count; i++) {
      let num: number;
      do {
        num = Math.floor(Math.random() * 37);
      } while (usedNumbers.has(num));
      usedNumbers.add(num);
      
      const rand = Math.random();
      let mult: number;
      if (rand < 0.5) mult = 50;
      else if (rand < 0.8) mult = 100;
      else if (rand < 0.95) mult = 200;
      else mult = 500;
      
      lucky.set(num, mult);
    }
    
    setLuckyNumbers(lucky);
    return lucky;
  }, []);
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0A0A0A",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Cinzel', serif",
        borderRadius: "inherit",
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          boxShadow:
            "inset 0 0 120px rgba(0,0,0,0.6), inset 0 0 240px rgba(0,0,0,0.2)",
        }}
      />
      
      {/* Mode Select Screen */}
      {screen === "modeSelect" && (
        <ModeSelect
          onSelectMode={handleSelectMode}
          onBack={onBack}
          isBR={isBR}
        />
      )}
      
      {/* Classic Game Screen */}
      {screen === "classicGame" && (
        <RouletteTable
          mode="classic"
          onBack={() => setScreen("modeSelect")}
          isBR={isBR}
          setView={handleSetView}
          onSpinComplete={handleSpinComplete}
          luckyNumbers={new Map()}
          generateLuckyNumbers={() => new Map()}
          history={history}
        />
      )}
      
      {/* Lightning Game Screen */}
      {screen === "lightningGame" && (
        <RouletteTable
          mode="lightning"
          onBack={() => setScreen("modeSelect")}
          isBR={isBR}
          setView={handleSetView}
          onSpinComplete={handleSpinComplete}
          luckyNumbers={luckyNumbers}
          generateLuckyNumbers={generateLuckyNumbers}
          history={history}
        />
      )}
      
      {/* History Overlay */}
      <HistoryOverlay
        visible={showHistory}
        isBR={isBR}
        onClose={() => setShowHistory(false)}
        history={history}
      />
      
      {/* Lightning Animation Overlay */}
      <LightningOverlay
        visible={showLightning}
        luckyNumbers={luckyNumbers}
        onComplete={() => setShowLightning(false)}
        isBR={isBR}
      />
      
      {/* Result Overlay */}
      {resultData && !bigWinData && (
        <ResultOverlay
          visible={true}
          result={resultData.result}
          bets={resultData.bets}
          totalWin={resultData.totalWin}
          isBR={isBR}
          onClose={() => setResultData(null)}
        />
      )}
      
      {/* Big Win Overlay */}
      {bigWinData && (
        <BigWinOverlay
          visible={true}
          tier={bigWinData.tier}
          amount={bigWinData.amount}
          isBR={isBR}
          onClose={() => {
            setBigWinData(null);
            setResultData(null);
          }}
        />
      )}
    </div>
  );
}
