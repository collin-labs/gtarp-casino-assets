"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CaseCard from "./components/CaseCard";
import Tooltip from "./components/Tooltip";
import type { CaseData } from "./CasesGame";

// Mock data (sera substituido por fetchNui na Fase 7)
const MOCK_CASES: CaseData[] = [
  { id: 1, name: "Arsenal Dourado",  slug: "arsenal-dourado",  description: "Armas exclusivas do submundo",    price: 500,  image_url: "/assets/cases/caixas/1-Caixa-Arsenal-Dourado-FECHADA.png",  theme_color: "#D4A843", category: "standard",   item_count: 8, preview: [{ name: "Railgun Blackout",  rarity: "legendary", rarity_color: "#FFD700", value: 15000 }, { name: "Minigun Dourada",   rarity: "epic",      rarity_color: "#EB4B4B", value: 4000 }, { name: "Sniper Pesada",      rarity: "rare",      rarity_color: "#D32CE6", value: 1500 }] },
  { id: 2, name: "Garagem VIP",      slug: "garagem-vip",      description: "Veículos de luxo e esportivos",   price: 1000, image_url: "/assets/cases/caixas/2-Caixa-Garagem-VIP-FECHADA.png",     theme_color: "#00E676", category: "premium",    item_count: 8, preview: [{ name: "Scramjet Dourado", rarity: "legendary", rarity_color: "#FFD700", value: 35000 }, { name: "Tezeract",          rarity: "epic",      rarity_color: "#EB4B4B", value: 18000 }, { name: "21 Thrax",           rarity: "rare",      rarity_color: "#D32CE6", value: 9000  }] },
  { id: 3, name: "Pacote Urbano",    slug: "pacote-urbano",    description: "Mix de itens do dia a dia",       price: 100,  image_url: "/assets/cases/caixas/3-Caixa-Pacote-Urbano-FECHADA.png",    theme_color: "#4B69FF", category: "budget",     item_count: 6, preview: [{ name: "R$ 2.000 GCoin",  rarity: "legendary", rarity_color: "#FFD700", value: 2000  }, { name: "Passe VIP 7d",      rarity: "rare",      rarity_color: "#D32CE6", value: 1000  }, { name: "R$ 250 GCoin",      rarity: "uncommon",  rarity_color: "#8847FF", value: 250   }] },
  { id: 4, name: "Cofre Secreto",    slug: "cofre-secreto",    description: "O cofre mais exclusivo",          price: 2500, image_url: "/assets/cases/caixas/4-Caixa-Cofre-Secreto-FECHADA.png",    theme_color: "#FFD700", category: "premium",    item_count: 7, preview: [{ name: "Lazer Dourado",    rarity: "legendary", rarity_color: "#FFD700", value: 50000 }, { name: "Deluxo Blackout",   rarity: "epic",      rarity_color: "#EB4B4B", value: 20000 }, { name: "Visser Dourado",     rarity: "epic",      rarity_color: "#EB4B4B", value: 12000 }] },
  { id: 5, name: "Caixa Noturna",    slug: "caixa-noturna",    description: "Itens da vida noturna",           price: 300,  image_url: "/assets/cases/caixas/5-Caixa-Noturna-FECHADA.png",          theme_color: "#D32CE6", category: "standard",   item_count: 6, preview: [{ name: "Skin Diamante",    rarity: "legendary", rarity_color: "#FFD700", value: 8000  }, { name: "Skin Platina",      rarity: "epic",      rarity_color: "#EB4B4B", value: 4000  }, { name: "Cadeia Diamante",    rarity: "rare",      rarity_color: "#D32CE6", value: 1500  }] },
  { id: 6, name: "Caixa Diária",     slug: "caixa-diaria",     description: "Recompensa diária gratuita!",     price: 0,    image_url: "/assets/cases/caixas/6-Caixa-Diaria-FECHADA.png",           theme_color: "#00E676", category: "daily_free", item_count: 5, preview: [{ name: "R$ 500 GCoin",    rarity: "legendary", rarity_color: "#FFD700", value: 500   }, { name: "Passe VIP 1d",      rarity: "rare",      rarity_color: "#D32CE6", value: 500   }, { name: "R$ 250 GCoin",      rarity: "uncommon",  rarity_color: "#8847FF", value: 250   }] },
];

const FILTERS = [
  { key: "all",        br: "TODAS",   en: "ALL",      tip: "Ver todas as caixas disponíveis" },
  { key: "premium",    br: "PREMIUM", en: "PREMIUM",  tip: "Caixas premium — itens ultra-raros" },
  { key: "standard",   br: "PADRAO",  en: "STANDARD", tip: "Caixas padrão — melhor custo-benefício" },
  { key: "budget",     br: "BASICA",  en: "BUDGET",   tip: "Caixas básicas — mais acessíveis" },
  { key: "daily_free", br: "GRATIS",  en: "FREE",     tip: "Caixa gratuita — 1× por dia, sem custo!" },
];

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `${r},${g},${b}`;
}

interface CaseCatalogProps {
  isBR: boolean;
  onSelectCase: (c: CaseData) => void;
}

// ─────────────────────────────────────────────
// CARD HERO — caixa principal (maior destaque)
// ─────────────────────────────────────────────
function HeroCard({ caseData, isBR, onSelectCase }: { caseData: CaseData; isBR: boolean; onSelectCase: (c: CaseData) => void }) {
  const [hov, setHov] = useState(false);
  const tc  = caseData.theme_color || "#D4A843";
  const rgb = hexToRgb(tc);
  const imgClosed = caseData.image_url;
  const imgSemi   = caseData.image_url?.replace("-FECHADA", "-SEMI-ABERTA") ?? null;

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectCase(caseData)}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={{
        width: "100%", height: "100%", minHeight: 0,
        borderRadius: "14px", cursor: "pointer",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 80%, rgba(${rgb},0.2) 0%, rgba(${rgb},0.07) 45%, #080808 75%)`,
        border: hov ? `2px solid rgba(${rgb},0.85)` : `2px solid rgba(${rgb},0.3)`,
        boxShadow: hov
          ? `0 0 32px rgba(${rgb},0.28), 0 16px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(${rgb},0.2)`
          : `0 6px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(${rgb},0.08)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        padding: "clamp(10px,1.4vw,20px)",
        transition: "border 0.3s, box-shadow 0.3s",
        boxSizing: "border-box",
      }}
    >
      {/* Linha neon superior */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.5) 30%, ${tc} 50%, rgba(${rgb},0.5) 70%, transparent 95%)`,
        boxShadow: `0 0 14px rgba(${rgb},0.5)`,
      }} />

      {/* Badge TOP */}
      <div style={{
        position: "absolute", top: "10px", right: "10px",
        background: `linear-gradient(135deg, ${tc}, rgba(${rgb},0.55))`,
        borderRadius: "5px", padding: "2px 9px",
        fontFamily: "var(--font-cinzel)", fontSize: "clamp(7px,0.7vw,10px)",
        fontWeight: 900, color: "#000", letterSpacing: "1px",
        boxShadow: `0 0 10px rgba(${rgb},0.45)`, zIndex: 5,
      }}>✦ TOP</div>

      {/* Glow atmosférico */}
      <div style={{
        position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
        width: "90%", height: "50%",
        background: `radial-gradient(ellipse, rgba(${rgb},${hov ? "0.28" : "0.12"}) 0%, transparent 70%)`,
        filter: "blur(22px)", pointerEvents: "none", transition: "all 0.4s",
      }} />

      {/* Imagem (troca fechada → semi no hover) */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", zIndex: 2 }}>
        <div style={{ position: "relative", width: "clamp(90px,12vw,190px)", height: "clamp(90px,12vw,190px)" }}>
          {imgClosed && (
            <img src={imgClosed} alt={caseData.name} loading="lazy" style={{
              width: "100%", height: "100%", objectFit: "contain",
              filter: `drop-shadow(0 6px 20px rgba(${rgb},${hov ? "0.9" : "0.4"}))`,
              opacity: hov ? 0 : 1, transition: "opacity 0.35s ease, filter 0.35s ease",
            }} />
          )}
          {imgSemi && (
            <img src={imgSemi} alt="semi" loading="lazy" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
              filter: `drop-shadow(0 10px 30px rgba(${rgb},0.9)) brightness(1.15)`,
              opacity: hov ? 1 : 0,
              transform: hov ? "scale(1.08) translateY(-4px)" : "scale(0.92)",
              transition: "opacity 0.35s ease, transform 0.4s ease",
            }} />
          )}
        </div>
      </div>

      {/* Nome */}
      <div style={{
        fontFamily: "var(--font-cinzel)", fontWeight: 900,
        fontSize: "clamp(11px,1.2vw,18px)", color: hov ? "#FFD700" : tc,
        letterSpacing: "2px", textAlign: "center",
        textShadow: `0 0 14px rgba(${rgb},0.6)`,
        marginBottom: "6px", zIndex: 2, transition: "color 0.3s",
      }}>
        {caseData.name}
      </div>

      {/* Preview 3 itens top */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "8px", flexWrap: "wrap", justifyContent: "center", zIndex: 2 }}>
        {caseData.preview?.slice(0, 3).map((item, i) => (
          <div key={i} style={{
            background: `${item.rarity_color}20`,
            border: `1px solid ${item.rarity_color}55`,
            borderRadius: "4px", padding: "2px 7px",
            fontSize: "clamp(7px,0.65vw,9px)",
            fontFamily: "var(--font-mono)",
            color: item.rarity_color, letterSpacing: "0.5px",
            boxShadow: `0 0 5px ${item.rarity_color}33`,
            whiteSpace: "nowrap",
          }}>
            {item.name.length > 14 ? item.name.slice(0, 13) + "…" : item.name}
          </div>
        ))}
      </div>

      {/* Preço */}
      <div style={{
        fontFamily: "var(--font-mono)", fontWeight: 700,
        fontSize: "clamp(13px,1.4vw,22px)", color: "#FFD700",
        textShadow: "0 0 12px rgba(255,215,0,0.5)", zIndex: 2,
      }}>
        🪙 {caseData.price.toLocaleString("pt-BR")}
      </div>

      {/* Linha neon inferior */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, transparent 5%, ${tc} 50%, transparent 95%)`,
        boxShadow: `0 0 18px rgba(${rgb},0.7)`,
      }} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// BANNER CAIXA DIÁRIA (faixa horizontal full)
// ─────────────────────────────────────────────
function DailyBanner({ caseData, isBR, onSelectCase }: { caseData: CaseData; isBR: boolean; onSelectCase: (c: CaseData) => void }) {
  const [hov, setHov] = useState(false);
  const imgClosed = caseData.image_url;
  const imgSemi   = caseData.image_url?.replace("-FECHADA", "-SEMI-ABERTA") ?? null;

  return (
    <Tooltip text={isBR ? "Caixa gratuita — 1× por dia, sem custo!" : "Free daily case — once per day!"}>
      <motion.div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.988 }}
        onClick={() => onSelectCase(caseData)}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          width: "100%",
          height: "clamp(60px,7.5vw,88px)",
          borderRadius: "12px", cursor: "pointer",
          overflow: "hidden", position: "relative",
          background: "linear-gradient(90deg, #081510 0%, #0A1A0F 50%, #081510 100%)",
          border: hov ? "2px solid rgba(0,230,118,0.75)" : "2px solid rgba(0,230,118,0.28)",
          boxShadow: hov
            ? "0 0 24px rgba(0,230,118,0.22), 0 8px 20px rgba(0,0,0,0.6)"
            : "0 4px 12px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center",
          padding: "0 clamp(10px,1.4vw,20px)",
          gap: "clamp(8px,1.2vw,16px)",
          transition: "border 0.3s, box-shadow 0.3s",
          boxSizing: "border-box",
        }}
      >
        {/* Glow esquerdo */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "35%",
          background: "radial-gradient(ellipse at 5% 50%, rgba(0,230,118,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Pulso de borda */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "10px",
          border: "1px solid rgba(0,230,118,0.15)",
          animation: "breathe 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Imagem */}
        <div style={{ position: "relative", width: "clamp(44px,6vw,70px)", height: "clamp(44px,6vw,70px)", flexShrink: 0, zIndex: 2 }}>
          {imgClosed && (
            <img src={imgClosed} alt={caseData.name} loading="lazy" style={{
              width: "100%", height: "100%", objectFit: "contain",
              filter: "drop-shadow(0 4px 12px rgba(0,230,118,0.55))",
              opacity: hov ? 0 : 1, transition: "opacity 0.32s",
            }} />
          )}
          {imgSemi && (
            <img src={imgSemi} alt="semi" loading="lazy" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
              filter: "drop-shadow(0 6px 18px rgba(0,230,118,0.8))",
              opacity: hov ? 1 : 0, transition: "opacity 0.32s",
            }} />
          )}
        </div>

        {/* Texto */}
        <div style={{ flex: 1, zIndex: 2 }}>
          <div style={{
            fontFamily: "var(--font-cinzel)", fontSize: "clamp(9px,1vw,14px)",
            fontWeight: 900, color: "#00E676", letterSpacing: "2px",
            textShadow: "0 0 10px rgba(0,230,118,0.5)",
          }}>
            {caseData.name.toUpperCase()}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(8px,0.8vw,11px)",
            color: "rgba(0,230,118,0.55)", marginTop: "2px",
          }}>
            {isBR ? caseData.description : "Daily free reward!"}
          </div>
        </div>

        {/* Badge GRÁTIS */}
        <div style={{
          background: "linear-gradient(135deg, #00E676, #00BFA5)",
          borderRadius: "6px", padding: "4px 12px", flexShrink: 0,
          fontFamily: "var(--font-cinzel)", fontSize: "clamp(8px,0.85vw,11px)",
          fontWeight: 900, color: "#000", letterSpacing: "1px",
          boxShadow: "0 0 14px rgba(0,230,118,0.4)", zIndex: 2,
        }}>
          {isBR ? "GRÁTIS" : "FREE"}
        </div>

        {/* Badge 1×/DIA */}
        <div style={{
          border: "1px solid rgba(0,230,118,0.38)",
          borderRadius: "6px", padding: "4px 10px", flexShrink: 0,
          fontFamily: "var(--font-mono)", fontSize: "clamp(7px,0.75vw,10px)",
          color: "rgba(0,230,118,0.65)", letterSpacing: "0.8px", zIndex: 2,
        }}>
          {isBR ? "1× / DIA" : "1× / DAY"}
        </div>

        {/* Linha inferior verde */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent 5%, #00E676 50%, transparent 95%)",
          boxShadow: "0 0 10px rgba(0,230,118,0.55)",
        }} />
      </motion.div>
    </Tooltip>
  );
}

// ─────────────────────────────────────────────
// LAYOUT BENTO ADAPTATIVO
// ─────────────────────────────────────────────
function BentoLayout({ cases, isBR, onSelectCase }: { cases: CaseData[]; isBR: boolean; onSelectCase: (c: CaseData) => void }) {
  const daily  = cases.find(c => c.category === "daily_free");
  const paid   = cases.filter(c => c.category !== "daily_free").sort((a, b) => b.price - a.price);
  const n      = cases.length;

  // Vazio
  if (n === 0) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(212,168,67,0.35)", fontFamily: "var(--font-cinzel)", fontSize: "clamp(10px,1vw,13px)", letterSpacing: "2px" }}>
        {isBR ? "NENHUMA CAIXA NESTA CATEGORIA" : "NO CASES IN THIS CATEGORY"}
      </p>
    </div>
  );

  // Só daily
  if (n === 1 && daily) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(8px,1vw,12px)" }}>
      <div style={{ width: "clamp(200px,32vw,340px)" }}>
        <DailyBanner caseData={daily} isBR={isBR} onSelectCase={onSelectCase} />
      </div>
    </div>
  );

  // 1 caixa paga
  if (paid.length === 1 && !daily) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(8px,1vw,12px)" }}>
      <div style={{ width: "clamp(180px,24vw,280px)", height: "clamp(220px,30vw,360px)" }}>
        <motion.div key={paid[0].id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ width: "100%", height: "100%" }}>
          <CaseCard caseData={paid[0]} isBR={isBR} onClick={() => onSelectCase(paid[0])} />
        </motion.div>
      </div>
    </div>
  );

  // 2 pagas sem daily
  if (paid.length === 2 && !daily) return (
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px,1vw,12px)", padding: "clamp(8px,1vw,12px)", alignContent: "start" }}>
      {paid.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }}>
          <CaseCard caseData={c} isBR={isBR} onClick={() => onSelectCase(c)} />
        </motion.div>
      ))}
    </div>
  );

  // 2 pagas + daily
  if (paid.length === 2 && daily) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vw,11px)", padding: "clamp(8px,1vw,12px)" }}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(7px,0.9vw,11px)", minHeight: 0 }}>
        {paid.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }} style={{ minHeight: 0 }}>
            <CaseCard caseData={c} isBR={isBR} onClick={() => onSelectCase(c)} />
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} style={{ flexShrink: 0 }}>
        <DailyBanner caseData={daily} isBR={isBR} onSelectCase={onSelectCase} />
      </motion.div>
    </div>
  );

  // Layout principal: 5 pagas + daily — BentoGrid estilo CasinoLayout
  const hero      = paid[0];
  const secondary = paid.slice(1, 5); // máximo 4

  return (
    <div style={{ flex: 1, minHeight: 0, padding: "clamp(6px,0.8vw,10px)", boxSizing: "border-box" }}>

      {/* Grid 4 cols × 3 rows — hero(2×2) + 4 cards(2×2) + daily(2 cols bottom) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: daily ? "1fr 1fr 0.55fr" : "1fr 1fr",
        gap: "clamp(8px, 1vw, 16px)",
        width: "100%",
        height: "100%",
      }}>
        {/* HERO — span 2 cols × 2 rows */}
        <motion.div
          key={`hero-${hero.id}`}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ gridColumn: "1 / 3", gridRow: "1 / 3", minHeight: 0 }}
        >
          <CaseCard caseData={hero} isBR={isBR} onClick={() => onSelectCase(hero)} isHero />
        </motion.div>

        {/* 4 cards secundários — 2×2 grid */}
        {secondary.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridColumn: (i % 2 === 0) ? "3" : "4",
              gridRow: i < 2 ? "1" : "2",
              minWidth: 0, minHeight: 0,
            }}
          >
            <CaseCard caseData={c} isBR={isBR} onClick={() => onSelectCase(c)} />
          </motion.div>
        ))}

        {/* Daily — span 4 cols na linha 3, usa CaseCard com bg temático */}
        {daily && (
          <motion.div
            key="daily-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.28 }}
            style={{ gridColumn: "1 / 5", gridRow: "3", minHeight: 0 }}
          >
            <CaseCard caseData={daily} isBR={isBR} onClick={() => onSelectCase(daily)} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function CaseCatalog({ isBR, onSelectCase }: CaseCatalogProps) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? MOCK_CASES
    : MOCK_CASES.filter(c => c.category === filter);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      padding: "clamp(8px,1vw,12px)",
      gap: "clamp(6px,0.8vw,10px)",
      boxSizing: "border-box",
    }}>

      {/* ── Filtros com tooltips ── */}
      <div style={{ display: "flex", gap: "clamp(4px,0.5vw,7px)", flexWrap: "wrap", flexShrink: 0 }}>
        {FILTERS.map(f => {
          const isActive  = filter === f.key;
          const isGratis  = f.key === "daily_free";
          return (
            <Tooltip key={f.key} text={f.tip}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFilter(f.key)}
                style={{
                  background: isActive
                    ? isGratis
                      ? "linear-gradient(135deg, #00E676, #00BFA5)"
                      : "linear-gradient(135deg, #D4A843, #B8892F)"
                    : "linear-gradient(180deg, #2A2A2A, #1A1A1A)",
                  color: isActive ? "#000" : "#A0A0A0",
                  border: isActive
                    ? isGratis ? "1px solid #00E676" : "1px solid #D4A843"
                    : "1px solid rgba(212,168,67,0.14)",
                  borderRadius: "6px", padding: "4px 13px",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(8px,0.85vw,11px)",
                  fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                  boxShadow: isActive
                    ? isGratis ? "0 0 14px rgba(0,230,118,0.32)" : "0 0 14px rgba(212,168,67,0.32)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: "all 0.2s",
                }}
              >
                {isBR ? f.br : f.en}
              </motion.button>
            </Tooltip>
          );
        })}
      </div>

      {/* ── Layout bento com transição de filtro ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
        >
          <BentoLayout cases={filtered} isBR={isBR} onSelectCase={onSelectCase} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
