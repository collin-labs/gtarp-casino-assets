"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GridCell from "./GridCell";
import MultiplierDisplay from "./MultiplierDisplay";

interface TumbleData {
  tumbleIndex: number;
  clusters: Array<{ symbol: string; count: number; cells: number[][]; payout: number }>;
  multiplier: number;
  removedCells: number[][];
  gridBefore: string[][];
}

interface VideoGridProps {
  grid: string[][];
  tumbles: TumbleData[];
  spinning: boolean;
  multiplier: number;
  onTumbleComplete: () => void;
}

const COLS = 6, ROWS = 5;
const CELL_SIZE = "clamp(52px, 5vw, 72px)";
const GAP = "clamp(2px, 0.3vw, 3px)";

// Mock símbolos para animação de spin
const ALL_SYMS = ["calice","dados","ficha","rubi","esmeralda","A","K","Q","J","10"];

export default function VideoGrid({ grid, tumbles, spinning, multiplier, onTumbleComplete }: VideoGridProps) {
  const [displayGrid, setDisplayGrid] = useState<string[][]>(grid);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [explodingCells, setExplodingCells] = useState<Set<string>>(new Set());
  const [newCells, setNewCells] = useState<Set<string>>(new Set());
  const [currentMultiplier, setCurrentMultiplier] = useState(multiplier);
  const [isTumbling, setIsTumbling] = useState(false);
  const tumbleIdx = useRef(0);

  // Atualizar grid quando recebe novo resultado
  useEffect(() => {
    setDisplayGrid(grid);
    setHighlightedCells(new Set());
    setExplodingCells(new Set());
    setNewCells(new Set());
    setCurrentMultiplier(multiplier);
    tumbleIdx.current = 0;
  }, [grid, multiplier]);

  // Processar sequência de tumbles
  useEffect(() => {
    if (!tumbles || tumbles.length === 0 || isTumbling) return;

    const processTumble = async (idx: number) => {
      if (idx >= tumbles.length) {
        setIsTumbling(false);
        onTumbleComplete();
        return;
      }

      setIsTumbling(true);
      const t = tumbles[idx];

      // 1. Mostrar grid desta tumble
      setDisplayGrid(t.gridBefore);
      setNewCells(new Set());
      setExplodingCells(new Set());

      // 2. Highlight clusters (300ms pausa dramática)
      const hlSet = new Set<string>();
      for (const cluster of t.clusters) {
        for (const [c, r] of cluster.cells) hlSet.add(`${c}-${r}`);
      }
      setHighlightedCells(hlSet);
      await delay(600);

      // 3. Explodir células
      setExplodingCells(hlSet);
      setHighlightedCells(new Set());
      await delay(300);

      // 4. Multiplicador sobe
      setCurrentMultiplier(t.multiplier);

      // 5. Novos símbolos caem (marcar como new)
      const nwSet = new Set<string>();
      for (const [c, r] of t.removedCells) nwSet.add(`${c}-${r}`);
      setExplodingCells(new Set());
      setNewCells(nwSet);

      // Atualizar grid com próxima tumble ou grid final
      if (idx + 1 < tumbles.length) {
        setDisplayGrid(tumbles[idx + 1].gridBefore);
      } else {
        // Grid final (sem mais clusters)
        setDisplayGrid(grid);
      }
      await delay(400);

      setNewCells(new Set());

      // Próxima tumble
      processTumble(idx + 1);
    };

    if (tumbles.length > 0 && !isTumbling) {
      processTumble(0);
    }
  }, [tumbles]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "clamp(12px, 1.5vw, 24px)",
    }}>
      {/* GRID 6×5 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE})`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE})`,
        gap: GAP,
        background: "#111111",
        border: "1px solid rgba(212,168,67,0.15)",
        borderRadius: "8px",
        padding: "clamp(4px, 0.4vw, 6px)",
        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.5)",
      }}>
        {/* Grid renderiza col-major: col0row0, col0row1, ... mas CSS grid é row-major */}
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            const key = `${col}-${row}`;
            const sym = displayGrid[col]?.[row] || "blank";
            return (
              <GridCell
                key={`${key}-${sym}`}
                symbol={sym}
                isHighlighted={highlightedCells.has(key)}
                isExploding={explodingCells.has(key)}
                isNew={newCells.has(key)}
                cellSize={CELL_SIZE}
              />
            );
          })
        )}
      </div>

      {/* MULTIPLICADOR — lado direito do grid */}
      <MultiplierDisplay value={currentMultiplier} />
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
