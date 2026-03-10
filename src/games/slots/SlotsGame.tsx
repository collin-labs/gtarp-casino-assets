"use client";

import { useState, useCallback } from "react";
import ModeSelect from "./ModeSelect";
import ClassicSlot from "./ClassicSlot";
import VideoSlot from "./VideoSlot";

export type SlotsView =
  | "modeSelect" | "classicGame" | "videoGame" | "freeSpins"
  | "bonusBuyModal" | "autoPlayModal" | "paytable" | "history"
  | "bigWin" | "jackpotHit";

interface SlotsGameProps {
  onBack: () => void;
  lang?: "br" | "in";
}

export default function SlotsGame({ onBack, lang = "br" }: SlotsGameProps) {
  const [view, setView] = useState<SlotsView>("modeSelect");
  const [selectedMode, setSelectedMode] = useState<"classic" | "video">("classic");
  const isBR = lang === "br";

  const handleSelectMode = useCallback((mode: "classic" | "video") => {
    setSelectedMode(mode);
    setView(mode === "classic" ? "classicGame" : "videoGame");
  }, []);

  const handleBackToSelect = useCallback(() => setView("modeSelect"), []);

  return (
    <div style={{
      width: "100%", height: "100%", background: "#0A0A0A",
      position: "relative", overflow: "hidden",
      fontFamily: "'Cinzel', serif", borderRadius: "inherit",
    }}>
      {view === "modeSelect" && (
        <ModeSelect onSelectMode={handleSelectMode} onBack={onBack} isBR={isBR} />
      )}
      {view === "classicGame" && (
        <ClassicSlot onBack={handleBackToSelect} isBR={isBR} setView={setView} />
      )}
      {view === "videoGame" && (
        <VideoSlot onBack={handleBackToSelect} isBR={isBR} setView={setView} />
      )}
    </div>
  );
}
