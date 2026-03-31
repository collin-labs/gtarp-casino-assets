"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { Game } from "@/lib/games";

type Lang = "br" | "in";

interface CasinoState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  activeGame: string | null;
  setActiveGame: (game: string | null) => void;
  saldo: number;
  setSaldo: (saldo: number) => void;
}

const CasinoContext = createContext<CasinoState | null>(null);

export function CasinoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("br");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(500);

  const valor = useMemo(() => ({
    lang, setLang,
    activeTab, setActiveTab,
    selectedGame, setSelectedGame,
    activeGame, setActiveGame,
    saldo, setSaldo,
  }), [lang, activeTab, selectedGame, activeGame, saldo]);

  return (
    <CasinoContext.Provider value={valor}>
      {children}
    </CasinoContext.Provider>
  );
}

export function useCasino(): CasinoState {
  const ctx = useContext(CasinoContext);
  if (!ctx) throw new Error("useCasino precisa estar dentro de CasinoProvider");
  return ctx;
}
