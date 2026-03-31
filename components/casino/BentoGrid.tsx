"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Game, TabLayout } from "@/lib/games";
import GameCard from "./GameCard";
import SpotlightLayout from "./SpotlightLayout";

interface BentoGridProps {
  games: Game[];
  heroGames?: Game[];
  heroContent?: React.ReactNode;
  layout: TabLayout;
  lang: "br" | "in";
  onGameSelect: (game: Game) => void;
}

export default function BentoGrid({
  games,
  heroGames,
  heroContent,
  layout,
  lang,
  onGameSelect,
}: BentoGridProps) {
  const isBR = lang === "br";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={layout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 5,
          paddingBottom: "clamp(55px, 8vh, 110px)",
          boxSizing: "border-box",
        }}
      >
        {/* Keyframe para pontos de luz */}
        <style>{`
          @keyframes pulseDot {
            0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
          }
        `}</style>
        {/* Linha dourada divisória + pontos de luz aleatórios */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(45px, 7vh, 95px)",
            left: "5%",
            right: "5%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 5%, #D4A843 15%, #FFD700 25%, #D4A843 32%, transparent 38%, transparent 62%, #D4A843 68%, #FFD700 75%, #D4A843 85%, transparent 95%)",
            opacity: 0.6,
            zIndex: 10,
          }}
        >
          {/* Pontos de luz aleatórios ao longo da linha */}
          {[12, 25, 42, 58, 74, 88].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${pos}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "clamp(3px, 0.4vw, 6px)",
                height: "clamp(3px, 0.4vw, 6px)",
                borderRadius: "50%",
                background: i % 2 === 0
                  ? "radial-gradient(circle, #FFD700 0%, rgba(255,215,0,0.4) 50%, transparent 70%)"
                  : "radial-gradient(circle, #00E676 0%, rgba(0,230,118,0.3) 50%, transparent 70%)",
                boxShadow: i % 2 === 0
                  ? "0 0 8px rgba(255,215,0,0.6), 0 0 16px rgba(255,215,0,0.3)"
                  : "0 0 8px rgba(0,230,118,0.5), 0 0 16px rgba(0,230,118,0.2)",
                animation: `pulseDot ${2 + (i * 0.7)}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {layout === "arcade" && (
          <ArcadeLayout games={games} isBR={isBR} onGameSelect={onGameSelect} heroContent={heroContent} />
        )}
        {layout === "casino" && (
          <CasinoLayout games={games} isBR={isBR} onGameSelect={onGameSelect} heroContent={heroContent} />
        )}
        {layout === "pvp" && (
          <TripleLayout games={games} isBR={isBR} onGameSelect={onGameSelect} />
        )}
        {layout === "loja" && (
          <QuadLayout games={games} isBR={isBR} onGameSelect={onGameSelect} />
        )}
        {layout === "eventos" && (
          <SpotlightLayout games={games} isBR={isBR} onGameSelect={onGameSelect} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* Padding interno dos grids — SEM bottom (já está no wrapper acima) */
const GP = "clamp(8px, 1vw, 16px)";

/* ============================================= */
/* ARCADE: Hero ~60% left + 4 cards grandes 2×2  */
/* ============================================= */
function ArcadeLayout({
  games,
  isBR,
  onGameSelect,
  heroContent,
}: {
  games: Game[];
  isBR: boolean;
  onGameSelect: (game: Game) => void;
  heroContent?: React.ReactNode;
}) {
  const cards = games.slice(0, 4);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "clamp(10px, 1.2vw, 20px)",
        width: "100%",
        height: "100%",
        padding: GP,
      }}
    >
      {/* Hero com borda falhada + feixos de luz */}
      <div
        style={{
          gridColumn: "1",
          gridRow: "1 / 3",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(212,168,67,0.15), inset 0 0 25px rgba(0,0,0,0.4), 0 8px 25px rgba(0,0,0,0.5)",
        }}
      >
        {heroContent}
        <HeroBeams />
        <HeroBrokenBorder />
      </div>
      {cards.map((game, i) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 350, damping: 25 }}
          style={{ minWidth: 0, minHeight: 0 }}
        >
          <GameCard
            game={game}
            isBR={isBR}
            onClick={() => onGameSelect(game)}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================= */
/* CASINO: Hero + 4 direita (2×2) + 2 abaixo    */
/* ============================================= */
function CasinoLayout({
  games,
  isBR,
  onGameSelect,
  heroContent,
}: {
  games: Game[];
  isBR: boolean;
  onGameSelect: (game: Game) => void;
  heroContent?: React.ReactNode;
}) {
  const rightCards = games.slice(0, 4);
  const bottomCards = games.slice(4, 6);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 0.65fr",
        gap: "clamp(10px, 1.2vw, 20px)",
        width: "100%",
        height: "100%",
        padding: GP,
      }}
    >
      {/* Hero com borda falhada + feixos de luz */}
      <div
        style={{
          gridColumn: "1 / 3",
          gridRow: "1 / 3",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(212,168,67,0.15), inset 0 0 25px rgba(0,0,0,0.4), 0 8px 25px rgba(0,0,0,0.5)",
        }}
      >
        {heroContent}
        <HeroBeams />
        {/* Borda falhada — segmentos interrompidos */}
        <HeroBrokenBorder />
      </div>

      {/* 4 cards a direita (2x2) */}
      {rightCards.map((game, i) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 350, damping: 25 }}
          style={{
            gridColumn: i % 2 === 0 ? "3" : "4",
            gridRow: i < 2 ? "1" : "2",
            minWidth: 0,
            minHeight: 0,
            height: "100%",
          }}
        >
          <GameCard
            game={game}
            isBR={isBR}
            onClick={() => onGameSelect(game)}
          />
        </motion.div>
      ))}

      {/* Banner inferior — col 1 livre (logo), Roleta Brasileira col 2, Bingo col 3-4 */}
      {bottomCards.map((game, i) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.55 + i * 0.1, type: "spring", stiffness: 350, damping: 25 }}
          style={{
            gridColumn: i === 0 ? "2 / 3" : "3 / 5",
            gridRow: "3",
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            ...(i === 0 ? { marginLeft: "-5vw", width: "calc(100% + 5vw)" } : {}),
          }}
        >
          <GameCard
            game={game}
            isBR={isBR}
            onClick={() => onGameSelect(game)}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================= */
/* PVP / EVENTOS: 3 cards enormes lado a lado    */
/* ============================================= */
function TripleLayout({
  games,
  isBR,
  onGameSelect,
}: {
  games: Game[];
  isBR: boolean;
  onGameSelect: (game: Game) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(games.length, 3)}, 1fr)`,
        gap: "clamp(10px, 1.2vw, 20px)",
        width: "100%",
        height: "100%",
        padding: GP,
        alignItems: "center",
      }}
    >
      {games.slice(0, 3).map((game, i) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.12, type: "spring", stiffness: 300, damping: 22 }}
          style={{ height: "100%", minWidth: 0, minHeight: 0 }}
        >
          <GameCard
            game={game}
            isBR={isBR}
            onClick={() => onGameSelect(game)}
            largeCard
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================= */
/* LOJA: 4 cards grandes em grid 2×2             */
/* ============================================= */
function QuadLayout({
  games,
  isBR,
  onGameSelect,
}: {
  games: Game[];
  isBR: boolean;
  onGameSelect: (game: Game) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "clamp(10px, 1.2vw, 20px)",
        width: "100%",
        height: "100%",
        padding: GP,
      }}
    >
      {games.slice(0, 4).map((game, i) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 350, damping: 25 }}
          style={{ minWidth: 0, minHeight: 0 }}
        >
          <GameCard
            game={game}
            isBR={isBR}
            onClick={() => onGameSelect(game)}
            largeCard
            feixoColor="gold"
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================= */
/* HERO BEAMS: Feixos de luz aleatórios          */
/* ============================================= */
const BEAM_CONFIG = [
  { side: "top", pos: 15, color: "gold", size: 35, delay: 0 },
  { side: "top", pos: 55, color: "green", size: 25, delay: 1.2 },
  { side: "top", pos: 85, color: "gold", size: 30, delay: 0.6 },
  { side: "bottom", pos: 25, color: "green", size: 40, delay: 0.3 },
  { side: "bottom", pos: 65, color: "gold", size: 28, delay: 1.5 },
  { side: "bottom", pos: 90, color: "green", size: 22, delay: 0.9 },
  { side: "left", pos: 30, color: "gold", size: 30, delay: 0.4 },
  { side: "left", pos: 70, color: "green", size: 25, delay: 1.8 },
  { side: "right", pos: 20, color: "gold", size: 28, delay: 0.7 },
  { side: "right", pos: 60, color: "green", size: 32, delay: 1.1 },
];

function HeroBeams() {
  return (
    <>
      <style>{`
        @keyframes beamPulse {
          0% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.15; transform: scale(0.7); }
        }
      `}</style>
      {BEAM_CONFIG.map((beam, i) => {
        const isGold = beam.color === "gold";
        const color = isGold ? "255,215,0" : "0,230,118";

        const style: React.CSSProperties = {
          position: "absolute",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 8,
          width: `${beam.size}px`,
          height: `${beam.size}px`,
          background: `radial-gradient(circle, rgba(${color},0.6) 0%, rgba(${color},0.2) 40%, transparent 70%)`,
          boxShadow: `0 0 ${beam.size / 2}px rgba(${color},0.4), 0 0 ${beam.size}px rgba(${color},0.15)`,
          filter: `blur(${beam.size / 8}px)`,
          animation: `beamPulse ${2.5 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${beam.delay}s`,
        };

        if (beam.side === "top") {
          style.top = `-${beam.size / 3}px`;
          style.left = `${beam.pos}%`;
          style.transform = "translateX(-50%)";
        } else if (beam.side === "bottom") {
          style.bottom = `-${beam.size / 3}px`;
          style.left = `${beam.pos}%`;
          style.transform = "translateX(-50%)";
        } else if (beam.side === "left") {
          style.left = `-${beam.size / 3}px`;
          style.top = `${beam.pos}%`;
          style.transform = "translateY(-50%)";
        } else {
          style.right = `-${beam.size / 3}px`;
          style.top = `${beam.pos}%`;
          style.transform = "translateY(-50%)";
        }

        return <div key={i} style={style} />;
      })}
    </>
  );
}

/* ============================================= */
/* HERO BROKEN BORDER: borda falhada/interrompida */
/* ============================================= */
function HeroBrokenBorder() {
  /* Segmentos de borda — com gaps aleatórios para efeito imperfeito */
  const segments = [
    /* TOP: 3 segmentos com gaps */
    { side: "top", start: 2, end: 28, color: "gold" },
    { side: "top", start: 35, end: 62, color: "gold" },
    { side: "top", start: 70, end: 97, color: "gold" },
    /* BOTTOM: 3 segmentos */
    { side: "bottom", start: 5, end: 38, color: "green" },
    { side: "bottom", start: 45, end: 72, color: "gold" },
    { side: "bottom", start: 78, end: 95, color: "green" },
    /* LEFT: 2 segmentos */
    { side: "left", start: 5, end: 45, color: "gold" },
    { side: "left", start: 58, end: 95, color: "gold" },
    /* RIGHT: 2 segmentos */
    { side: "right", start: 8, end: 42, color: "gold" },
    { side: "right", start: 55, end: 92, color: "gold" },
  ];

  return (
    <>
      {segments.map((seg, i) => {
        const isGold = seg.color === "gold";
        const baseColor = isGold ? "rgba(212,168,67" : "rgba(0,230,118";
        const isHorizontal = seg.side === "top" || seg.side === "bottom";
        const length = seg.end - seg.start;

        const style: React.CSSProperties = {
          position: "absolute",
          pointerEvents: "none",
          zIndex: 9,
          borderRadius: "2px",
        };

        if (isHorizontal) {
          style.left = `${seg.start}%`;
          style.width = `${length}%`;
          style.height = "2px";
          style.background = `linear-gradient(90deg, transparent, ${baseColor},0.6) 20%, ${baseColor},0.8) 50%, ${baseColor},0.6) 80%, transparent)`;
          style.boxShadow = `0 0 6px ${baseColor},0.4), 0 0 12px ${baseColor},0.15)`;
          if (seg.side === "top") style.top = "0";
          else style.bottom = "0";
        } else {
          style.top = `${seg.start}%`;
          style.height = `${length}%`;
          style.width = "2px";
          style.background = `linear-gradient(180deg, transparent, ${baseColor},0.6) 20%, ${baseColor},0.8) 50%, ${baseColor},0.6) 80%, transparent)`;
          style.boxShadow = `0 0 6px ${baseColor},0.4), 0 0 12px ${baseColor},0.15)`;
          if (seg.side === "left") style.left = "0";
          else style.right = "0";
        }

        return <div key={i} style={style} />;
      })}

      {/* Cantos dourados — pequenos arcos nos 4 cantos */}
      {[
        { top: "0", left: "0", borderTop: "2px solid rgba(212,168,67,0.7)", borderLeft: "2px solid rgba(212,168,67,0.7)", borderRadius: "16px 0 0 0" },
        { top: "0", right: "0", borderTop: "2px solid rgba(212,168,67,0.7)", borderRight: "2px solid rgba(212,168,67,0.7)", borderRadius: "0 16px 0 0" },
        { bottom: "0", left: "0", borderBottom: "2px solid rgba(212,168,67,0.7)", borderLeft: "2px solid rgba(212,168,67,0.7)", borderRadius: "0 0 0 16px" },
        { bottom: "0", right: "0", borderBottom: "2px solid rgba(212,168,67,0.7)", borderRight: "2px solid rgba(212,168,67,0.7)", borderRadius: "0 0 16px 0" },
      ].map((corner, i) => (
        <div
          key={`corner-${i}`}
          style={{
            position: "absolute",
            width: "clamp(16px, 2vw, 30px)",
            height: "clamp(16px, 2vw, 30px)",
            pointerEvents: "none",
            zIndex: 9,
            boxShadow: "0 0 8px rgba(212,168,67,0.3)",
            ...corner,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}