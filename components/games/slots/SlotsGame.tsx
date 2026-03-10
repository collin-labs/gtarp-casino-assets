"use client";

import { useState, useCallback } from "react";
import ModeSelect from "./ModeSelect";
import ClassicSlot from "./ClassicSlot";
import VideoSlot from "./VideoSlot";
import PaytableOverlay from "./PaytableOverlay";
import HistoryOverlay from "./HistoryOverlay";
import AutoPlayModal from "./AutoPlayModal";
import BonusBuyModal from "./BonusBuyModal";
import BigWinOverlay from "./BigWinOverlay";
import JackpotHitOverlay from "./JackpotHitOverlay";
import FreeSpinsOverlay from "./FreeSpinsOverlay";

export type SlotsView =
  | "modeSelect" | "classicGame" | "videoGame" | "freeSpins"
  | "bonusBuyModal" | "autoPlayModal" | "paytable" | "history"
  | "bigWin" | "jackpotHit";

interface SlotsGameProps {
  onBack: () => void;
  lang?: "br" | "in";
}

export default function SlotsGame({ onBack, lang = "br" }: SlotsGameProps) {
  // Tela principal ativa
  const [screen, setScreen] = useState<"modeSelect" | "classicGame" | "videoGame">("modeSelect");
  const [selectedMode, setSelectedMode] = useState<"classic" | "video">("classic");
  const isBR = lang === "br";

  // Overlays (podem abrir sobre o jogo)
  const [showPaytable, setShowPaytable] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAutoPlay, setShowAutoPlay] = useState(false);
  const [showBonusBuy, setShowBonusBuy] = useState(false);
  const [showFreeSpins, setShowFreeSpins] = useState(false);

  // Win overlays
  const [bigWinData, setBigWinData] = useState<{ tier: "big"|"mega"|"epic"; amount: number } | null>(null);
  const [jackpotData, setJackpotData] = useState<{ tier: "mini"|"minor"|"major"|"grand"; amount: number } | null>(null);

  const handleSelectMode = useCallback((mode: "classic" | "video") => {
    setSelectedMode(mode);
    setScreen(mode === "classic" ? "classicGame" : "videoGame");
  }, []);

  // Handler que os jogos chamam via setView
  const handleSetView = useCallback((v: SlotsView) => {
    switch (v) {
      case "modeSelect": setScreen("modeSelect"); break;
      case "paytable": setShowPaytable(true); break;
      case "history": setShowHistory(true); break;
      case "autoPlayModal": setShowAutoPlay(true); break;
      case "bonusBuyModal": setShowBonusBuy(true); break;
      case "freeSpins": setShowFreeSpins(true); break;
      default: break;
    }
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0A0A0A",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
      position: "relative", overflow: "hidden",
      fontFamily: "'Cinzel', serif", borderRadius: "inherit",
    }}>
      {/* Vinheta (DS P1 §6.3) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        boxShadow: "inset 0 0 120px rgba(0,0,0,0.6), inset 0 0 240px rgba(0,0,0,0.2)",
      }} />
      {/* TELA: Seleção de modo */}
      {screen === "modeSelect" && (
        <ModeSelect
          onSelectMode={handleSelectMode}
          onBack={onBack}
          isBR={isBR}
        />
      )}

      {/* TELA: Classic Slot */}
      {screen === "classicGame" && (
        <ClassicSlot
          onBack={() => setScreen("modeSelect")}
          isBR={isBR}
          setView={handleSetView}
        />
      )}

      {/* TELA: Video Slot */}
      {screen === "videoGame" && (
        <VideoSlot
          onBack={() => setScreen("modeSelect")}
          isBR={isBR}
          setView={handleSetView}
        />
      )}

      {/* OVERLAY: Paytable */}
      <PaytableOverlay
        visible={showPaytable}
        mode={selectedMode}
        isBR={isBR}
        onClose={() => setShowPaytable(false)}
      />

      {/* OVERLAY: History */}
      <HistoryOverlay
        visible={showHistory}
        isBR={isBR}
        onClose={() => setShowHistory(false)}
      />

      {/* OVERLAY: Auto Play */}
      <AutoPlayModal
        visible={showAutoPlay}
        isBR={isBR}
        onStart={(config) => {
          setShowAutoPlay(false);
        }}
        onCancel={() => setShowAutoPlay(false)}
      />

      {/* OVERLAY: Bonus Buy */}
      <BonusBuyModal
        visible={showBonusBuy}
        betAmount={100}
        costMultiplier={25}
        balance={1234.56}
        isBR={isBR}
        onConfirm={() => {
          setShowBonusBuy(false);
          setShowFreeSpins(true);
        }}
        onCancel={() => setShowBonusBuy(false)}
      />

      {/* OVERLAY: Free Spins */}
      <FreeSpinsOverlay
        active={showFreeSpins}
        spinsRemaining={10}
        totalSpins={10}
        multiplier={1}
        totalWin={0}
        betAmount={100}
        retriggered={false}
        isComplete={false}
        isBR={isBR}
        onSpin={() => {}}
        onContinue={() => setShowFreeSpins(false)}
        spinning={false}
        turbo={false}
        onToggleTurbo={() => {}}
      />

      {/* OVERLAY: Big Win */}
      {bigWinData && (
        <BigWinOverlay
          visible={true}
          tier={bigWinData.tier}
          amount={bigWinData.amount}
          isBR={isBR}
          onClose={() => setBigWinData(null)}
        />
      )}

      {/* OVERLAY: Jackpot Hit */}
      {jackpotData && (
        <JackpotHitOverlay
          visible={true}
          tier={jackpotData.tier}
          amount={jackpotData.amount}
          isBR={isBR}
          onClose={() => setJackpotData(null)}
        />
      )}
    </div>
  );
}
