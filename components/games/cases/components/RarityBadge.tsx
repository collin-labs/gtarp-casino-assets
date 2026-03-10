"use client";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

const RARITY_CONFIG: Record<Rarity, { label: string; bg: string; color: string; border: string }> = {
  common:    { label: "COMUM",      bg: "rgba(75,105,255,0.15)",  color: "#4B69FF", border: "rgba(75,105,255,0.3)" },
  uncommon:  { label: "INCOMUM",    bg: "rgba(136,71,255,0.15)",  color: "#8847FF", border: "rgba(136,71,255,0.3)" },
  rare:      { label: "RARO",       bg: "rgba(211,44,230,0.15)",  color: "#D32CE6", border: "rgba(211,44,230,0.3)" },
  epic:      { label: "EPICO",      bg: "rgba(235,75,75,0.15)",   color: "#EB4B4B", border: "rgba(235,75,75,0.3)" },
  legendary: { label: "LENDARIO",   bg: "rgba(255,215,0,0.2)",    color: "#FFD700", border: "rgba(255,215,0,0.4)" },
};

export default function RarityBadge({ rarity, lang }: { rarity: Rarity; lang?: "br" | "in" }) {
  const cfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
  const isBR = lang !== "in";

  const labels: Record<Rarity, { br: string; en: string }> = {
    common:    { br: "COMUM",    en: "COMMON" },
    uncommon:  { br: "INCOMUM",  en: "UNCOMMON" },
    rare:      { br: "RARO",     en: "RARE" },
    epic:      { br: "EPICO",    en: "EPIC" },
    legendary: { br: "LENDARIO", en: "LEGENDARY" },
  };

  return (
    <span style={{
      display: "inline-block",
      background: `linear-gradient(180deg, ${cfg.bg}, rgba(0,0,0,0.3))`,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: "5px",
      padding: "3px 10px",
      fontFamily: "var(--font-cinzel), 'Inter', sans-serif",
      fontSize: "clamp(9px, 0.85vw, 12px)",
      fontWeight: 800,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      lineHeight: 1.5,
      boxShadow: `0 0 10px ${cfg.border}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      textShadow: `0 0 8px ${cfg.color}88`,
    }}>
      {isBR ? labels[rarity].br : labels[rarity].en}
    </span>
  );
}
