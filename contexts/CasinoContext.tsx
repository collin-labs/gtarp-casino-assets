"use client";

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
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
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CasinoContext = createContext<CasinoState | null>(null);

export function CasinoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("br");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(500);
  // SEMPRE inicia fechado — evita que o build pre-renderize o casino visivel
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const noFiveM = !window.location.href.includes("cfx-nui-");

    // Browser dev: abre automaticamente
    if (noFiveM) {
      setIsOpen(true);
      return;
    }

    // FiveM: escuta mensagens do panel_client.lua
    const handler = (e: MessageEvent) => {
      if (e.data?.action === "show") setIsOpen(true);
      if (e.data?.action === "hide") setIsOpen(false);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const valor = useMemo(() => ({
    lang, setLang,
    activeTab, setActiveTab,
    selectedGame, setSelectedGame,
    activeGame, setActiveGame,
    saldo, setSaldo,
    isOpen, setIsOpen,
  }), [lang, activeTab, selectedGame, activeGame, saldo, isOpen]);

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
