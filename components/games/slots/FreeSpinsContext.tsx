"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface FreeSpinsState {
  active: boolean;
  sessionId: number | null;
  spinsRemaining: number;
  totalSpins: number;
  accumulatedMultiplier: number;
  totalWin: number;
  betAmount: number;
  retriggerCount: number;
}

interface FreeSpinsContextType {
  state: FreeSpinsState;
  startSession: (sessionId: number, spins: number, bet: number) => void;
  decrementSpin: () => void;
  updateMultiplier: (m: number) => void;
  addWin: (amount: number) => void;
  retrigger: (extraSpins: number) => void;
  endSession: () => void;
}

const initial: FreeSpinsState = {
  active: false, sessionId: null, spinsRemaining: 0, totalSpins: 0,
  accumulatedMultiplier: 1, totalWin: 0, betAmount: 0, retriggerCount: 0,
};

const Ctx = createContext<FreeSpinsContextType | null>(null);

export function FreeSpinsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FreeSpinsState>(initial);

  const startSession = useCallback((sessionId: number, spins: number, bet: number) => {
    setState({
      active: true, sessionId, spinsRemaining: spins, totalSpins: spins,
      accumulatedMultiplier: 1, totalWin: 0, betAmount: bet, retriggerCount: 0,
    });
  }, []);

  const decrementSpin = useCallback(() => {
    setState(p => ({ ...p, spinsRemaining: Math.max(0, p.spinsRemaining - 1) }));
  }, []);

  const updateMultiplier = useCallback((m: number) => {
    setState(p => ({ ...p, accumulatedMultiplier: m }));
  }, []);

  const addWin = useCallback((amount: number) => {
    setState(p => ({ ...p, totalWin: p.totalWin + amount }));
  }, []);

  const retrigger = useCallback((extraSpins: number) => {
    setState(p => ({
      ...p,
      spinsRemaining: p.spinsRemaining + extraSpins,
      totalSpins: p.totalSpins + extraSpins,
      retriggerCount: p.retriggerCount + 1,
    }));
  }, []);

  const endSession = useCallback(() => {
    setState(initial);
  }, []);

  return (
    <Ctx.Provider value={{ state, startSession, decrementSpin, updateMultiplier, addWin, retrigger, endSession }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFreeSpins() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFreeSpins must be used within FreeSpinsProvider");
  return ctx;
}
