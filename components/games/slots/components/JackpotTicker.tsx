"use client";

import { useState, useEffect } from "react";
import Tooltip from "./Tooltip";

interface JackpotTickerProps {
  mode: "classic" | "video";
  isBR: boolean;
}

const TIER_COLORS: Record<string, string> = {
  mini: "#A8A8A8", minor: "#00E676", major: "#D4A843", grand: "#FFD700",
};

const INITIAL_VIDEO = { mini: 142.5, minor: 1205.0, major: 8430.0, grand: 52100.0 };
const INITIAL_CLASSIC = { mini: 142.5, grand: 5230.0 };

export default function JackpotTicker({ mode, isBR }: JackpotTickerProps) {
  const initial = mode === "video" ? INITIAL_VIDEO : INITIAL_CLASSIC;
  const [pools, setPools] = useState<Record<string, number>>(initial);

  // Mock incremento em tempo real
  useEffect(() => {
    const iv = setInterval(() => {
      setPools(prev => {
        const next = { ...prev };
        for (const tier of Object.keys(next)) {
          const rate = tier === "grand" ? 0.8 : tier === "major" ? 0.4 : tier === "minor" ? 0.15 : 0.05;
          next[tier] += Math.random() * rate;
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(iv);
  }, [mode]);

  // Listener para updates do server (produção FiveM)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'casino:slots:jackpot_update') {
        const { pools: serverPools } = event.data.data;
        if (serverPools) setPools(serverPools);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const tiers = Object.entries(pools);

  return (
    <Tooltip text={isBR ? "Jackpot progressivo — cada aposta alimenta o prêmio" : "Progressive jackpot — every bet feeds the prize"}>
      <div style={{
        display: "flex", gap: "clamp(8px, 1.2vw, 20px)", alignItems: "center",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(8px, 0.8vw, 12px)",
      }}>
        {tiers.map(([tier, amount]) => (
          <span key={tier} style={{ color: "#A8A8A8", whiteSpace: "nowrap" }}>
            {tier.toUpperCase()}{" "}
            <span style={{
              color: TIER_COLORS[tier] || "#FFF",
              fontWeight: tier === "grand" ? 800 : 600,
              textShadow: tier === "grand" ? "0 0 8px rgba(255,215,0,0.4)" : "none",
            }}>
              🪙 {amount.toFixed(2).replace(".", ",")}
            </span>
          </span>
        ))}
      </div>
    </Tooltip>
  );
}
