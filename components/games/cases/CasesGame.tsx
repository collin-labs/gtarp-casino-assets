"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import CaseCatalog from "./CaseCatalog";
import CasePreview from "./CasePreview";
import CaseOpening from "./CaseOpening";
import CaseResult from "./CaseResult";
import RecentDrops from "./RecentDrops";
import CaseBattle from "./CaseBattle";
import Tooltip from "./components/Tooltip";
import { useCasesSounds } from "./SoundManagerCases";

interface CasesGameProps {
  onBack: () => void;
  lang?: "br" | "in";
}

export type CaseData = {
  id: number; name: string; slug: string; description: string;
  price: number; image_url: string | null; theme_color: string;
  category: string; item_count: number;
  preview: { name: string; rarity: string; rarity_color: string; value: number }[];
};

export default function CasesGame({ onBack, lang = "br" }: CasesGameProps) {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [openingCase, setOpeningCase] = useState<CaseData | null>(null);
  const [resultItem, setResultItem] = useState<any>(null);
  const [resultMeta, setResultMeta] = useState<{ openingId: number; hash: string } | null>(null);
  const [fastMode, setFastMode] = useState(false);
  const [showBattles, setShowBattles] = useState(false);
  const isBR = lang === "br";
  const caseSounds = useCasesSounds();

  const handleBack = useCallback(() => {
    if (resultItem) {
      setResultItem(null); setResultMeta(null); setOpeningCase(null);
    } else if (openingCase) {
      setOpeningCase(null);
    } else if (selectedCase) {
      setSelectedCase(null);
    } else {
      onBack();
    }
  }, [resultItem, openingCase, selectedCase, onBack]);

  // Mock items para abertura (sera fetchNui na producao)
  const CASE_ITEMS: Record<number, { id: number; name: string; rarity: string; rarity_color: string; value: number; sell_back_value: number; probability: number; image_url: string }[]> = {
    // ── ARSENAL DOURADO ──────────────────────────────────────────────────────
    1: [
      { id: 1, name: "Pistola Tática",         rarity: "common",    rarity_color: "#4B69FF", value: 150,   sell_back_value: 105, probability: 28, image_url: "/assets/cases/itens/arsenal/1-Itens-Arsenal-Dourado-Pistola-Tatica.png" },
      { id: 2, name: "SMG Compacta",            rarity: "common",    rarity_color: "#4B69FF", value: 200,   sell_back_value: 140, probability: 24, image_url: "/assets/cases/itens/arsenal/2-Itens-Arsenal-Dourado-SMG-Compacta.png" },
      { id: 3, name: "Carabina MK2",            rarity: "uncommon",  rarity_color: "#8847FF", value: 500,   sell_back_value: 350, probability: 18, image_url: "/assets/cases/itens/arsenal/3-Itens-Arsenal-Dourado-Carabina-MK2.png" },
      { id: 4, name: "Shotgun de Combate",      rarity: "uncommon",  rarity_color: "#8847FF", value: 700,   sell_back_value: 490, probability: 13, image_url: "/assets/cases/itens/arsenal/4-Itens-Arsenal-Dourado-Shotgun-de-Combate.png" },
      { id: 5, name: "Sniper Pesada",           rarity: "rare",      rarity_color: "#D32CE6", value: 1500,  sell_back_value: 1050, probability: 9, image_url: "/assets/cases/itens/arsenal/5-Itens-Arsenal-Dourado-Sniper-Pesada.png" },
      { id: 6, name: "Minigun Dourada",         rarity: "epic",      rarity_color: "#EB4B4B", value: 4000,  sell_back_value: 2800, probability: 5, image_url: "/assets/cases/itens/arsenal/6-Itens-Arsenal-Dourado-Minigun-Dourada.png" },
      { id: 7, name: "RPG Ed. Limitada",        rarity: "epic",      rarity_color: "#EB4B4B", value: 6000,  sell_back_value: 4200, probability: 2, image_url: "/assets/cases/itens/arsenal/7-Itens-Arsenal-Dourado-RPG-Edicao-Limitada.png" },
      { id: 8, name: "Railgun Blackout",        rarity: "legendary", rarity_color: "#FFD700", value: 15000, sell_back_value: 10500, probability: 1, image_url: "/assets/cases/itens/arsenal/8-Itens-Arsenal-Dourado-Railgun-Blackout-(LEGENDARY).png" },
    ],
    // ── GARAGEM VIP ─────────────────────────────────────────────────────────
    2: [
      { id: 1, name: "Futo GTX",                rarity: "common",    rarity_color: "#4B69FF", value: 500,   sell_back_value: 350,  probability: 28, image_url: "/assets/cases/itens/garagem/1-Itens-Garagem-VIP-Futo-GTX-(common).png" },
      { id: 2, name: "Sultan RS",               rarity: "common",    rarity_color: "#4B69FF", value: 800,   sell_back_value: 560,  probability: 24, image_url: "/assets/cases/itens/garagem/2-Itens-Garagem-VIP-Sultan-RS-(common).png" },
      { id: 3, name: "Elegy RH8",               rarity: "uncommon",  rarity_color: "#8847FF", value: 2000,  sell_back_value: 1400, probability: 18, image_url: "/assets/cases/itens/garagem/3-Itens-Garagem-VIP-Elegy-RH8-(uncommon).png" },
      { id: 4, name: "Jester Classic",          rarity: "uncommon",  rarity_color: "#8847FF", value: 3000,  sell_back_value: 2100, probability: 13, image_url: "/assets/cases/itens/garagem/4-Itens-Garagem-VIP-Jester-Classic-(uncommon).png" },
      { id: 5, name: "Itali GTO",               rarity: "rare",      rarity_color: "#D32CE6", value: 6000,  sell_back_value: 4200, probability: 9,  image_url: "/assets/cases/itens/garagem/5-Itens-Garagem-VIP-Itali-GTO-(rare).png" },
      { id: 6, name: "21 Thrax",                rarity: "rare",      rarity_color: "#D32CE6", value: 9000,  sell_back_value: 6300, probability: 5,  image_url: "/assets/cases/itens/garagem/6-Itens-Garagem-VIP-21-Thrax-(rare).png" },
      { id: 7, name: "Tezeract",                rarity: "epic",      rarity_color: "#EB4B4B", value: 18000, sell_back_value: 12600, probability: 2, image_url: "/assets/cases/itens/garagem/7-Itens-Garagem-VIP-Tezeract-(epic).png" },
      { id: 8, name: "Scramjet Dourado",        rarity: "legendary", rarity_color: "#FFD700", value: 35000, sell_back_value: 24500, probability: 1, image_url: "/assets/cases/itens/garagem/8-Itens-Garagem-VIP-Scramjet-Dourado-(LEGENDARY).png" },
    ],
    // ── CAIXAS SEM ITENS PNG (fallback genérico) ─────────────────────────────
    3: [
      { id: 1, name: "R$ 50 GCoin",    rarity: "common",    rarity_color: "#4B69FF", value: 50,   sell_back_value: 35,  probability: 35, image_url: "" },
      { id: 2, name: "R$ 100 GCoin",   rarity: "common",    rarity_color: "#4B69FF", value: 100,  sell_back_value: 70,  probability: 28, image_url: "" },
      { id: 3, name: "R$ 250 GCoin",   rarity: "uncommon",  rarity_color: "#8847FF", value: 250,  sell_back_value: 175, probability: 18, image_url: "" },
      { id: 4, name: "Passe VIP 3d",   rarity: "uncommon",  rarity_color: "#8847FF", value: 500,  sell_back_value: 350, probability: 11, image_url: "" },
      { id: 5, name: "Passe VIP 7d",   rarity: "rare",      rarity_color: "#D32CE6", value: 1000, sell_back_value: 700, probability: 5,  image_url: "" },
      { id: 6, name: "R$ 2.000 GCoin", rarity: "legendary", rarity_color: "#FFD700", value: 2000, sell_back_value: 1400, probability: 3, image_url: "" },
    ],
    4: [
      { id: 1, name: "R$ 500 GCoin",    rarity: "common",    rarity_color: "#4B69FF", value: 500,   sell_back_value: 350,  probability: 28, image_url: "" },
      { id: 2, name: "R$ 1.000 GCoin",  rarity: "common",    rarity_color: "#4B69FF", value: 1000,  sell_back_value: 700,  probability: 22, image_url: "" },
      { id: 3, name: "Passe VIP 7d",    rarity: "uncommon",  rarity_color: "#8847FF", value: 1500,  sell_back_value: 1050, probability: 18, image_url: "" },
      { id: 4, name: "Passe VIP 30d",   rarity: "rare",      rarity_color: "#D32CE6", value: 5000,  sell_back_value: 3500, probability: 10, image_url: "" },
      { id: 5, name: "Visser Dourado",  rarity: "epic",      rarity_color: "#EB4B4B", value: 12000, sell_back_value: 8400, probability: 4,  image_url: "" },
      { id: 6, name: "Deluxo Blackout", rarity: "epic",      rarity_color: "#EB4B4B", value: 20000, sell_back_value: 14000, probability: 2, image_url: "" },
      { id: 7, name: "Lazer Dourado",   rarity: "legendary", rarity_color: "#FFD700", value: 50000, sell_back_value: 35000, probability: 1, image_url: "" },
    ],
    5: [
      { id: 1, name: "Máscara Neón",    rarity: "common",    rarity_color: "#4B69FF", value: 150,  sell_back_value: 105, probability: 32, image_url: "" },
      { id: 2, name: "Óculos LED",      rarity: "common",    rarity_color: "#4B69FF", value: 200,  sell_back_value: 140, probability: 26, image_url: "" },
      { id: 3, name: "Roupa Noturna",   rarity: "uncommon",  rarity_color: "#8847FF", value: 600,  sell_back_value: 420, probability: 18, image_url: "" },
      { id: 4, name: "Cadeia Diamante", rarity: "rare",      rarity_color: "#D32CE6", value: 1500, sell_back_value: 1050, probability: 12, image_url: "" },
      { id: 5, name: "Skin Platina",    rarity: "epic",      rarity_color: "#EB4B4B", value: 4000, sell_back_value: 2800, probability: 5,  image_url: "" },
      { id: 6, name: "Skin Diamante",   rarity: "legendary", rarity_color: "#FFD700", value: 8000, sell_back_value: 5600, probability: 2,  image_url: "" },
    ],
    6: [
      { id: 1, name: "R$ 50 GCoin",    rarity: "common",    rarity_color: "#4B69FF", value: 50,  sell_back_value: 35,  probability: 40, image_url: "" },
      { id: 2, name: "R$ 100 GCoin",   rarity: "common",    rarity_color: "#4B69FF", value: 100, sell_back_value: 70,  probability: 30, image_url: "" },
      { id: 3, name: "R$ 250 GCoin",   rarity: "uncommon",  rarity_color: "#8847FF", value: 250, sell_back_value: 175, probability: 18, image_url: "" },
      { id: 4, name: "Passe VIP 1d",   rarity: "rare",      rarity_color: "#D32CE6", value: 500, sell_back_value: 350, probability: 9,  image_url: "" },
      { id: 5, name: "R$ 500 GCoin",   rarity: "legendary", rarity_color: "#FFD700", value: 500, sell_back_value: 350, probability: 3,  image_url: "" },
    ],
  };
  const getMockItems = (caseId: number) => CASE_ITEMS[caseId] ?? CASE_ITEMS[3];

  const handleOpenCase = useCallback((fast: boolean) => {
    if (!selectedCase) return;
    caseSounds.play("case_open");
    setFastMode(fast);
    setOpeningCase(selectedCase);
    setSelectedCase(null);
  }, [selectedCase, caseSounds]);

  const handleRevealComplete = useCallback((item: any) => {
    caseSounds.play("reveal_stop");
    const raritySound = `rarity_${item.rarity}` as any;
    setTimeout(() => caseSounds.play(raritySound), 200);
    setResultItem(item);
    setResultMeta({ openingId: Date.now(), hash: "mock_" + Math.random().toString(36).substring(2, 18) });
  }, [caseSounds]);

  const handleSell = useCallback(() => {
    caseSounds.play("sell_item");
    console.log("[CASES] Sell item:", resultItem?.name);
    setResultItem(null); setResultMeta(null); setOpeningCase(null);
  }, [resultItem, caseSounds]);

  const handleKeep = useCallback(() => {
    caseSounds.play("keep_item");
    console.log("[CASES] Keep item:", resultItem?.name);
    setResultItem(null); setResultMeta(null); setOpeningCase(null);
  }, [resultItem, caseSounds]);

  const handleOpenAnother = useCallback(() => {
    if (openingCase) {
      setResultItem(null); setResultMeta(null);
      // Re-trigger opening
      const c = openingCase;
      setOpeningCase(null);
      setTimeout(() => setOpeningCase(c), 50);
    }
  }, [openingCase]);

  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      backgroundImage: "url(/assets/cases/backgrounds/cases-bg.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-cinzel)",
    }}>
      {/* Overlay escuro sobre bg-image para legibilidade */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "rgba(0,0,0,0.5)",
        zIndex: 0,
      }} />
      {/* Ambient orbs for Dark Glassmorphism */}
      <div style={{
        position: "absolute", top: "-10%", right: "-5%",
        width: "40%", height: "50%",
        background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: "35%", height: "45%",
        background: "radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translateX(-50%)",
        width: "50%", height: "30%",
        background: "radial-gradient(circle, rgba(136,71,255,0.03) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* ══ Header premium ══ */}
      <div style={{
        position: "relative", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(10px, 1.2vw, 18px) clamp(14px, 1.8vw, 24px)",
        background: "linear-gradient(180deg, rgba(212,168,67,0.06) 0%, transparent 100%)",
        zIndex: 10,
      }}>
        {/* Linha separadora dourada com glow */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 2%, rgba(212,168,67,0.15) 15%, rgba(212,168,67,0.55) 35%, #D4A843 50%, rgba(212,168,67,0.55) 65%, rgba(212,168,67,0.15) 85%, transparent 98%)",
          boxShadow: "0 0 8px rgba(212,168,67,0.2), 0 1px 6px rgba(212,168,67,0.08)",
        }} />

        {/* Botão VOLTAR com tooltip */}
        <Tooltip text={isBR ? "Voltar ao cassino" : "Back to casino"}>
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            style={{
              background: "transparent",
              border: "1px solid rgba(212,168,67,0.1)",
              color: "#A8A8A8", cursor: "pointer",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(9px, 0.9vw, 13px)",
              fontWeight: 700, letterSpacing: "2px",
              padding: "5px 13px", borderRadius: "6px",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "5px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#D4A843";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,67,0.35)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px rgba(212,168,67,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#A8A8A8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,67,0.1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            ‹ {isBR ? "VOLTAR" : "BACK"}
          </motion.button>
        </Tooltip>

        {/* Título decorado */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px,0.8vw,12px)" }}>
          <div style={{
            width: "clamp(20px,2.5vw,36px)", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.6))",
          }} />
          <div style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(13px, 1.5vw, 22px)",
            fontWeight: 900, color: "#D4A843",
            letterSpacing: "4px",
            textShadow: "0 0 18px rgba(212,168,67,0.5), 0 2px 8px rgba(0,0,0,0.8)",
          }}>
            {isBR ? "✦ CAIXAS ✦" : "✦ CASES ✦"}
          </div>
          <div style={{
            width: "clamp(20px,2.5vw,36px)", height: "1px",
            background: "linear-gradient(90deg, rgba(212,168,67,0.6), transparent)",
          }} />
        </div>

        {/* Botão BATALHAS */}
        <Tooltip text={isBR ? "Abrir várias caixas em batalha PvP" : "Open cases in PvP battle"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBattles(!showBattles)}
            style={{
              background: showBattles
                ? "linear-gradient(180deg, #C62828, #E53935)"
                : "linear-gradient(180deg, #2A1A1A, #1A1010)",
              border: showBattles
                ? "1px solid rgba(235,75,75,0.5)"
                : "1px solid rgba(235,75,75,0.2)",
              borderRadius: "6px",
              padding: "5px 14px",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(8px, 0.85vw, 12px)",
              fontWeight: 800,
              color: showBattles ? "#FFF" : "#EB4B4B",
              letterSpacing: "1px", cursor: "pointer",
              boxShadow: showBattles
                ? "0 0 16px rgba(235,75,75,0.4), 0 4px 12px rgba(0,0,0,0.5)"
                : "0 0 6px rgba(235,75,75,0.1)",
              transition: "all 0.2s",
            }}
          >
            ⚔ {isBR ? "BATALHAS" : "BATTLES"}
          </motion.button>
        </Tooltip>
      </div>

      {/* Content area — FULL WIDTH com dimensões absolutas */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0 }}>
        {showBattles ? (
          <CaseBattle isBR={isBR} onBack={() => setShowBattles(false)} />
        ) : (
        <CaseCatalog
          isBR={isBR}
          onSelectCase={setSelectedCase}
        />
        )}
        </div>

        {/* Preview overlay */}
        {selectedCase && (
          <CasePreview
            caseData={selectedCase}
            isBR={isBR}
            onClose={() => setSelectedCase(null)}
            onOpen={() => handleOpenCase(false)}
            onFastOpen={() => handleOpenCase(true)}
          />
        )}

        {/* Opening animation */}
        {openingCase && !resultItem && (
          <CaseOpening
            caseName={openingCase.name}
            themeColor={openingCase.theme_color}
            items={getMockItems(openingCase.id)}
            targetItemIndex={Math.floor(Math.random() * 6)}
            isBR={isBR}
            fastMode={fastMode}
            onComplete={handleRevealComplete}
            onClose={() => setOpeningCase(null)}
          />
        )}

        {/* Result screen */}
        {resultItem && resultMeta && (
          <CaseResult
            item={resultItem}
            openingId={resultMeta.openingId}
            hash={resultMeta.hash}
            isBR={isBR}
            onSell={handleSell}
            onKeep={handleKeep}
            onOpenAnother={handleOpenAnother}
            onClose={() => { setResultItem(null); setResultMeta(null); setOpeningCase(null); }}
          />
        )}
      </div>
    </div>
  );
}
