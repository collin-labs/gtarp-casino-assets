"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GAMES, type Game } from "@/lib/games";
import GameCard from "./GameCard";

interface Props {
  lang: "br" | "in";
  onGameSelect?: (game: Game) => void;
}

export default function GameCarousel({ lang, onGameSelect }: Props) {
  const isBR = lang === "br";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    setScrollProgress(
      el.scrollWidth > el.clientWidth
        ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
        : 0
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div
      className="relative z-[5] flex flex-col h-full"
      style={{
        padding:
          "clamp(10px, 1.5vw, 20px) 0 clamp(20px, 3vw, 45px)",
        gap: "clamp(4px, 0.6vw, 10px)",
      }}
    >
      {/* Fade edges para indicar scroll */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-[8]"
        style={{
          width: "clamp(20px, 3vw, 50px)",
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.9) 0%, transparent 100%)",
          opacity: canScrollLeft ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-[8]"
        style={{
          width: "clamp(20px, 3vw, 50px)",
          background:
            "linear-gradient(270deg, rgba(10,10,10,0.9) 0%, transparent 100%)",
          opacity: canScrollRight ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Scroll container horizontal */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 flex items-center overflow-x-auto overflow-y-hidden"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          padding: "0 clamp(12px, 2.5vw, 40px)",
          gap: "clamp(10px, 1.2vw, 20px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {GAMES.slice(0, 6).map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            style={{
              flex: "0 0 auto",
              width: "clamp(100px, 13vw, 200px)",
              scrollSnapAlign: "start",
            }}
          >
            <GameCard
              game={game}
              isBR={isBR}
              onClick={() => onGameSelect?.(game)}
            />
          </motion.div>
        ))}
      </div>

      {/* Barra de progresso estilo cyber */}
      <div
        className="flex justify-center"
        style={{ padding: "0 clamp(12px, 2.5vw, 40px)" }}
      >
        <div
          style={{
            width: "clamp(100px, 20vw, 300px)",
            height: "3px",
            borderRadius: "2px",
            background: "rgba(212,168,67,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ left: `${scrollProgress * 70}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "absolute",
              top: 0,
              width: "30%",
              height: "100%",
              borderRadius: "2px",
              background:
                "linear-gradient(90deg, transparent, #00E676, #FFD700, transparent)",
              boxShadow: "0 0 8px rgba(0,230,118,0.4)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
