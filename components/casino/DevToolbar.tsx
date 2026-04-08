"use client";

// DevToolbar — ferramenta de dev para testar layout
// SO APARECE no localhost. Invisivel no FiveM.
// Tecla ` abre/fecha. Numeros 1-9,0 navegam. Tab troca nivel.
// Generico: qualquer jogo passa suas telas como props.
// No painel: BlackoutCasino passa lista de jogos.

import { useState, useEffect, useCallback } from "react";

const IS_DEV = typeof window !== "undefined" && (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0"
);

interface DevScreen {
  key: string;
  label: string;
  action: () => void;
}

interface DevToolbarProps {
  screens: DevScreen[];
  currentScreen: string;
  gameName?: string;
  extraInfo?: Record<string, string | number>;
}

export default function DevToolbar({ screens, currentScreen, gameName, extraInfo }: DevToolbarProps) {
  const [visible, setVisible] = useState(false);
  const [mini, setMini] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!IS_DEV) return;
    if (e.key === "`" || e.key === "~") { e.preventDefault(); setVisible(v => !v); return; }
    if (!visible) return;
    if (e.key === "m" || e.key === "M") { setMini(v => !v); return; }

    const map: Record<string, number> = { "1":0,"2":1,"3":2,"4":3,"5":4,"6":5,"7":6,"8":7,"9":8,"0":9 };
    if (e.key in map && map[e.key] < screens.length) {
      e.preventDefault();
      screens[map[e.key]].action();
    }
  }, [visible, screens]);

  useEffect(() => {
    if (!IS_DEV) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!IS_DEV) return null;

  if (!visible) return (
    <div
      onClick={() => setVisible(true)}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
      style={{
        position: "fixed", bottom: 6, right: 6, zIndex: 99999,
        background: "rgba(0,0,0,0.75)", border: "1px solid rgba(0,230,118,0.3)",
        borderRadius: 6, padding: "3px 8px", cursor: "pointer", opacity: 0.4,
        fontFamily: "monospace", fontSize: 10, color: "#00E676",
        transition: "opacity 0.2s",
      }}
    >
      DEV [`]
    </div>
  );

  const S: React.CSSProperties = {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999,
    background: "rgba(0,0,0,0.94)", borderTop: "2px solid #00E676",
    padding: mini ? "3px 10px" : "6px 10px",
    fontFamily: "monospace", fontSize: 11, color: "#CCC",
    display: "flex", flexDirection: mini ? "row" : "column", gap: mini ? 10 : 4,
  };

  return (
    <div style={S}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ color: "#00E676", fontWeight: 700 }}>
          {gameName ? `DEV: ${gameName}` : "DEV"}
        </span>
        <span style={{ color: "#FFD700" }}>
          [{currentScreen}]
        </span>
        {extraInfo && !mini && Object.entries(extraInfo).map(([k, v]) => (
          <span key={k} style={{ color: "#666" }}>
            {k}:<span style={{ color: "#D4A843" }}>{v}</span>
          </span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button onClick={() => setMini(v => !v)} style={{ background: "none", border: "1px solid #444", borderRadius: 3, color: "#888", padding: "1px 6px", cursor: "pointer", fontSize: 9 }}>
            {mini ? "▲" : "▼"}
          </button>
          <button onClick={() => setVisible(false)} style={{ background: "none", border: "1px solid #444", borderRadius: 3, color: "#F44", padding: "1px 6px", cursor: "pointer", fontSize: 9 }}>
            ✕
          </button>
        </div>
      </div>

      {!mini && (
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {screens.map((s, i) => {
            const active = currentScreen.toLowerCase() === s.label.toLowerCase() ||
              currentScreen.toLowerCase().includes(s.label.toLowerCase().split(" ")[0].toLowerCase());
            return (
              <button key={s.key} onClick={s.action} style={{
                background: active ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.04)",
                border: active ? "1px solid #00E676" : "1px solid #2A2A2A",
                borderRadius: 3, padding: "3px 8px", cursor: "pointer",
                color: active ? "#00E676" : "#888", fontSize: 10,
                fontFamily: "monospace", transition: "all 0.12s",
              }}>
                <span style={{ color: "#FFD700", marginRight: 3 }}>{s.key}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {!mini && (
        <div style={{ color: "#444", fontSize: 8 }}>
          [ ` ] toggle &nbsp; [ 1-0 ] telas &nbsp; [ M ] mini &nbsp; localhost only
        </div>
      )}
    </div>
  );
}
