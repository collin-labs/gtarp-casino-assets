"use client";

import { motion } from "framer-motion";
import ItemCard from "./components/ItemCard";
import Tooltip from "./components/Tooltip";
import type { CaseData } from "./CasesGame";

// Mock items (sera substituido por fetchNui casino:cases:preview)
const MOCK_ITEMS: Record<number, any[]> = {
  1: [
    { id: 1, name: "Pistola Tática",        rarity: "common",    rarity_color: "#4B69FF", value: 150,   sell_back_value: 105,  probability: 28,  image_url: "/assets/cases/itens/arsenal/1-Itens-Arsenal-Dourado-Pistola-Tatica.png" },
    { id: 2, name: "SMG Compacta",          rarity: "common",    rarity_color: "#4B69FF", value: 200,   sell_back_value: 140,  probability: 24,  image_url: "/assets/cases/itens/arsenal/2-Itens-Arsenal-Dourado-SMG-Compacta.png" },
    { id: 3, name: "Carabina MK2",          rarity: "uncommon",  rarity_color: "#8847FF", value: 500,   sell_back_value: 350,  probability: 18,  image_url: "/assets/cases/itens/arsenal/3-Itens-Arsenal-Dourado-Carabina-MK2.png" },
    { id: 4, name: "Shotgun de Combate",    rarity: "uncommon",  rarity_color: "#8847FF", value: 700,   sell_back_value: 490,  probability: 13,  image_url: "/assets/cases/itens/arsenal/4-Itens-Arsenal-Dourado-Shotgun-de-Combate.png" },
    { id: 5, name: "Sniper Pesada",         rarity: "rare",      rarity_color: "#D32CE6", value: 1500,  sell_back_value: 1050, probability: 9,   image_url: "/assets/cases/itens/arsenal/5-Itens-Arsenal-Dourado-Sniper-Pesada.png" },
    { id: 6, name: "Minigun Dourada",       rarity: "epic",      rarity_color: "#EB4B4B", value: 4000,  sell_back_value: 2800, probability: 5,   image_url: "/assets/cases/itens/arsenal/6-Itens-Arsenal-Dourado-Minigun-Dourada.png" },
    { id: 7, name: "RPG Ed. Limitada",      rarity: "epic",      rarity_color: "#EB4B4B", value: 6000,  sell_back_value: 4200, probability: 2,   image_url: "/assets/cases/itens/arsenal/7-Itens-Arsenal-Dourado-RPG-Edicao-Limitada.png" },
    { id: 8, name: "Railgun Blackout",      rarity: "legendary", rarity_color: "#FFD700", value: 15000, sell_back_value: 10500, probability: 1,  image_url: "/assets/cases/itens/arsenal/8-Itens-Arsenal-Dourado-Railgun-Blackout-(LEGENDARY).png" },
  ],
  2: [
    { id: 1, name: "Futo GTX",              rarity: "common",    rarity_color: "#4B69FF", value: 500,   sell_back_value: 350,  probability: 28,  image_url: "/assets/cases/itens/garagem/1-Itens-Garagem-VIP-Futo-GTX-(common).png" },
    { id: 2, name: "Sultan RS",             rarity: "common",    rarity_color: "#4B69FF", value: 800,   sell_back_value: 560,  probability: 24,  image_url: "/assets/cases/itens/garagem/2-Itens-Garagem-VIP-Sultan-RS-(common).png" },
    { id: 3, name: "Elegy RH8",             rarity: "uncommon",  rarity_color: "#8847FF", value: 2000,  sell_back_value: 1400, probability: 18,  image_url: "/assets/cases/itens/garagem/3-Itens-Garagem-VIP-Elegy-RH8-(uncommon).png" },
    { id: 4, name: "Jester Classic",        rarity: "uncommon",  rarity_color: "#8847FF", value: 3000,  sell_back_value: 2100, probability: 13,  image_url: "/assets/cases/itens/garagem/4-Itens-Garagem-VIP-Jester-Classic-(uncommon).png" },
    { id: 5, name: "Itali GTO",             rarity: "rare",      rarity_color: "#D32CE6", value: 6000,  sell_back_value: 4200, probability: 9,   image_url: "/assets/cases/itens/garagem/5-Itens-Garagem-VIP-Itali-GTO-(rare).png" },
    { id: 6, name: "21 Thrax",              rarity: "rare",      rarity_color: "#D32CE6", value: 9000,  sell_back_value: 6300, probability: 5,   image_url: "/assets/cases/itens/garagem/6-Itens-Garagem-VIP-21-Thrax-(rare).png" },
    { id: 7, name: "Tezeract",              rarity: "epic",      rarity_color: "#EB4B4B", value: 18000, sell_back_value: 12600, probability: 2,  image_url: "/assets/cases/itens/garagem/7-Itens-Garagem-VIP-Tezeract-(epic).png" },
    { id: 8, name: "Scramjet Dourado",      rarity: "legendary", rarity_color: "#FFD700", value: 35000, sell_back_value: 24500, probability: 1,  image_url: "/assets/cases/itens/garagem/8-Itens-Garagem-VIP-Scramjet-Dourado-(LEGENDARY).png" },
  ],
};

// Items genericos para caixas sem mock detalhado
function getDefaultItems(caseData: CaseData) {
  return MOCK_ITEMS[caseData.id] || [
    { id: 99, name: "Item Comum", rarity: "common", rarity_color: "#4B69FF", value: 50, sell_back_value: 35, probability: 50 },
    { id: 100, name: "Item Raro", rarity: "rare", rarity_color: "#D32CE6", value: 500, sell_back_value: 350, probability: 30 },
    { id: 101, name: "Item Epico", rarity: "epic", rarity_color: "#EB4B4B", value: 2000, sell_back_value: 1400, probability: 15 },
    { id: 102, name: "Item Lendario", rarity: "legendary", rarity_color: "#FFD700", value: 10000, sell_back_value: 7000, probability: 5 },
  ];
}

interface CasePreviewProps {
  caseData: CaseData;
  isBR: boolean;
  onClose: () => void;
  onOpen: () => void;
  onFastOpen?: () => void;
}

export default function CasePreview({ caseData, isBR, onClose, onOpen, onFastOpen }: CasePreviewProps) {
  const items = getDefaultItems(caseData);
  const isFree = caseData.category === "daily_free";
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(12px, 2vw, 24px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: premiumEase }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(17,17,17,0.92)",
          backdropFilter: "blur(20px) saturate(1.2)",
          border: "1px solid rgba(212,168,67,0.25)",
          borderRadius: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,168,67,0.08)",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "clamp(10px, 1.2vw, 18px) clamp(14px, 1.5vw, 24px)",
          borderBottom: "1px solid rgba(212,168,67,0.15)",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(14px, 1.6vw, 22px)",
              fontWeight: 800, color: caseData.theme_color,
              letterSpacing: "2px",
              textShadow: `0 0 12px ${caseData.theme_color}66`,
            }}>
              {caseData.name}
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(10px, 1vw, 13px)",
              color: "#A8A8A8", marginTop: "2px",
            }}>
              {caseData.description} - {items.length} {isBR ? "itens" : "items"}
            </div>
          </div>
          <Tooltip text={isBR ? "Fechar" : "Close"}>
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "1px solid transparent",
                color: "#666", cursor: "pointer", fontSize: "18px",
                padding: "4px 8px", borderRadius: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#D4A843"; e.currentTarget.style.borderColor = "rgba(212,168,67,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = "transparent"; }}
            >
              ✕
            </button>
          </Tooltip>
        </div>

        {/* Items grid */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "clamp(10px, 1.2vw, 18px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(100px, 12vw, 150px), 1fr))",
          gap: "clamp(6px, 0.8vw, 12px)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(212,168,67,0.15) transparent",
        }}>
          {items
            .sort((a: any, b: any) => {
              const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
              return (order[a.rarity as keyof typeof order] || 4) - (order[b.rarity as keyof typeof order] || 4);
            })
            .map((item: any) => (
              <ItemCard key={item.id} item={item} isBR={isBR} />
            ))}
        </div>

        {/* Footer with buttons */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(8px, 1vw, 16px)",
          padding: "clamp(10px, 1.2vw, 18px)",
          borderTop: "1px solid rgba(212,168,67,0.15)",
        }}>
          <Tooltip text={isBR ? "Abrir esta caixa" : "Open this case"}>
            <motion.button
              whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpen}
              style={{
                background: "linear-gradient(180deg, #00C853 0%, #00E676 30%, #004D25 100%)",
                border: "none", borderRadius: "8px",
                padding: "clamp(8px, 1vw, 12px) clamp(20px, 2.5vw, 36px)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(11px, 1.1vw, 15px)",
                fontWeight: 800, color: "#FFFFFF",
                letterSpacing: "2px", cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,77,37,0.3), 0 0 16px rgba(0,230,118,0.25)",
              }}
            >
              {isFree
                ? (isBR ? "ABRIR GRATIS" : "OPEN FREE")
                : `${isBR ? "ABRIR" : "OPEN"} 🪙 ${caseData.price.toLocaleString("pt-BR")}`
              }
            </motion.button>
          </Tooltip>

          <Tooltip text={isBR ? "Pular animacao" : "Skip animation"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onFastOpen || onOpen}
              style={{
                background: "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
                border: "1px solid rgba(212,168,67,0.2)",
                borderRadius: "8px",
                padding: "clamp(8px, 1vw, 12px) clamp(14px, 1.8vw, 24px)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                fontWeight: 700, color: "#A8A8A8",
                letterSpacing: "1px", cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {isBR ? "RAPIDO" : "FAST"}
            </motion.button>
          </Tooltip>
        </div>
      </motion.div>
    </motion.div>
  );
}
