"use client";

import { useState } from "react";
import { GAMES } from "@/lib/games";
import GameCard from "./GameCard";

const CARDS_PER_PAGE = 8;

interface Props {
  lang: "br" | "in";
}

export default function GameCarousel({ lang }: Props) {
  const [page, setPage] = useState(0);
  const isBR = lang === "br";
  const totalPages = Math.ceil(GAMES.length / CARDS_PER_PAGE);
  const visibleGames = GAMES.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <div
      className="relative z-[5] flex flex-col h-full"
      style={{
        padding: "clamp(4px, 0.8vw, 12px) clamp(8px, 2vw, 30px) clamp(20px, 3vw, 45px)",
        gap: "clamp(2px, 0.5vw, 8px)",
      }}
    >
      {/* Título + Setas */}
      <div className="flex justify-between items-center">
        <span
          className="font-bold tracking-[2px]"
          style={{
            fontSize: "clamp(8px, 0.9vw, 13px)",
            color: "#D4A843",
            fontFamily: "var(--font-cinzel)",
          }}
        >
          {isBR ? "TODOS OS JOGOS" : "ALL GAMES"}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center justify-center rounded-md text-xs font-bold p-0 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            style={{
              width: "24px",
              height: "24px",
              background: "rgba(212,168,67,0.15)",
              border: "1px solid rgba(212,168,67,0.3)",
              color: page === 0 ? "rgba(212,168,67,0.2)" : "#FFD700",
            }}
          >
            ◀
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center justify-center rounded-md text-xs font-bold p-0 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            style={{
              width: "24px",
              height: "24px",
              background: "rgba(212,168,67,0.15)",
              border: "1px solid rgba(212,168,67,0.3)",
              color: page >= totalPages - 1 ? "rgba(212,168,67,0.2)" : "#FFD700",
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Cards Grid — 8 cards, quadrados */}
      <div
        className="flex-1 min-h-0 flex items-center"
        style={{ width: "100%" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${CARDS_PER_PAGE}, 1fr)`,
            gap: "clamp(3px, 0.6vw, 10px)",
            width: "100%",
          }}
        >
        {visibleGames.map((game) => (
          <GameCard key={game.id} game={game} isBR={isBR} />
        ))}
        </div>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className="p-0 rounded-full cursor-pointer transition-all duration-300"
            style={{
              width: "6px",
              height: "6px",
              background: i === page ? "#FFD700" : "rgba(212,168,67,0.3)",
              border: "none",
              boxShadow: i === page ? "0 0 4px rgba(255,215,0,0.5)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
