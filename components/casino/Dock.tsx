"use client";

import { UI } from "@/lib/assets";
import { TABS } from "@/lib/games";

interface DockProps {
  lang: "br" | "in";
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function Dock({ lang, activeTab, setActiveTab }: DockProps) {
  const isBR = lang === "br";
  const tabs = isBR ? TABS.br : TABS.en;

  // Ícones para cada tab
  const icons = ["♦", "⚔", "■", "★", "●"];
  const iconStyle = { marginRight: "6px", fontSize: "0.75em", verticalAlign: "middle" };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Menu ornamentado PNG MODELO2 */}
      <img
        src={UI.dock}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          pointerEvents: "none",
          filter: "drop-shadow(0 0 15px rgba(212,168,67,0.3))",
        }}
      />

      {/* 5 tabs sobrepostos no PNG — posição central do body */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "8%",
          right: "8%",
          transform: "translateY(-30%)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          alignItems: "center",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="bg-transparent border-none cursor-pointer text-center p-0 transition-all duration-300"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(11px, 1.4vw, 20px)",
              fontWeight: 900,
              color: i === activeTab ? "#00E676" : "#D4A843",
              textShadow:
                i === activeTab
                  ? "0 0 12px rgba(0,230,118,0.7), 0 0 25px rgba(0,230,118,0.35)"
                  : "0 0 4px rgba(212,168,67,0.3)",
              letterSpacing: "2px",
            }}
            onMouseEnter={(e) => {
              if (i !== activeTab) {
                (e.currentTarget as HTMLButtonElement).style.color = "#FFD700";
                (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 10px rgba(255,215,0,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== activeTab) {
                (e.currentTarget as HTMLButtonElement).style.color = "#D4A843";
                (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 4px rgba(212,168,67,0.3)";
              }
            }}
            title={tab}
          >
            <span style={iconStyle}>{icons[i]}</span>
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
