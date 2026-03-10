"use client";

/* ═══════════════════════════════════════════════════
   SymbolIcon — Renderiza símbolos como PNG (upgrade visual)
   Antes: SVG inline com formas geométricas flat
   Depois: Imagens PNG geradas por IA com profundidade 2.5D
   ═══════════════════════════════════════════════════ */

interface SymbolIconProps {
  name: string;
  size?: string;
}

const SYMBOL_MAP: Record<string, string> = {
  cereja:     "/slots/classic/classic-cherry.png",
  limao:      "/slots/classic/classic-lemon.png",
  sino:       "/slots/classic/classic-bell.png",
  estrela:    "/slots/classic/classic-star.png",
  bar_triplo: "/slots/classic/classic-bar.png",
  "777":      "/slots/classic/classic-777.png",
  diamante:   "/slots/classic/classic-diamond.png",
  rubi:       "/slots/video/video-ruby.png",
  esmeralda:  "/slots/video/video-emerald.png",
  safira:     "/slots/video/video-sapphire.png",
  calice:     "/slots/video/video-chalice.png",
  dados:      "/slots/video/video-dice.png",
  ficha:      "/slots/video/video-chip.png",
  wild:       "/slots/video/video-wild.png",
  scatter:    "/slots/video/video-scatter.png",
  A:          "/slots/video/video-letter-a.png",
  K:          "/slots/video/video-letter-k.png",
  Q:          "/slots/video/video-letter-q.png",
  J:          "/slots/video/video-letter-j.png",
  "10":       "/slots/video/video-letter-10.png",
};

export default function SymbolIcon({ name, size = "48px" }: SymbolIconProps) {
  const src = SYMBOL_MAP[name];

  if (!src || name === "blank") {
    return (
      <div style={{
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: name === "blank" ? 0.1 : 0.4,
        color: "#555", fontSize: "10px", fontFamily: "sans-serif",
      }}>
        {name === "blank" ? "" : name}
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <img
        src={src}
        alt={name}
        draggable={false}
        style={{
          width: "85%",
          height: "85%",
          objectFit: "contain",
          imageRendering: "auto",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          transition: "filter 0.2s ease, transform 0.2s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
