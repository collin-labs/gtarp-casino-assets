"use client";

import { motion } from "framer-motion";
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
          filter: "drop-shadow(0 0 20px rgba(212,168,67,0.35))",
        }}
      />

      {/* 5 tabs sobrepostos no PNG */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "8%",
          right: "8%",
          transform: "translateY(-20%)",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          alignItems: "center",
        }}
      >
        {tabs.map((tab, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveTab(i)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-none cursor-pointer text-center p-0"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(9px, 1.1vw, 16px)",
              fontWeight: 900,
              color: i === activeTab ? "#00E676" : "#D4A843",
              textShadow:
                i === activeTab
                  ? "0 0 12px rgba(0,230,118,0.7), 0 0 25px rgba(0,230,118,0.35)"
                  : "0 0 4px rgba(212,168,67,0.3)",
              letterSpacing: "2px",
              position: "relative",
              transition: "color 0.3s, text-shadow 0.3s",
              paddingTop: "6px",
            }}
            onMouseEnter={(e) => {
              if (i !== activeTab) {
                e.currentTarget.style.color = "#FFD700";
                e.currentTarget.style.textShadow =
                  "0 0 10px rgba(255,215,0,0.5), 0 0 20px rgba(255,215,0,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== activeTab) {
                e.currentTarget.style.color = "#D4A843";
                e.currentTarget.style.textShadow =
                  "0 0 4px rgba(212,168,67,0.3)";
              }
            }}
            title={tab}
          >
            {/* Barra de destaque SUPERIOR animada */}
            {i === activeTab && (
              <motion.div
                layoutId="dock-active-bar"
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "15%",
                  right: "15%",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, #00E676, transparent)",
                  boxShadow: "0 0 10px rgba(0,230,118,0.6), 0 2px 8px rgba(0,230,118,0.3)",
                  borderRadius: "0 0 2px 2px",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {tab}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
