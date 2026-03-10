"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { SlotsView } from "../SlotsGame";
import VideoGrid from "./VideoGrid";
import JackpotTicker from "./JackpotTicker";
import BetControls from "./BetControls";
import WinDisplay from "./WinDisplay";
import Tooltip from "./Tooltip";

interface VideoSlotProps {
  onBack: () => void;
  isBR: boolean;
  setView: (v: SlotsView) => void;
}

const COLS = 6, ROWS = 5;
const ALL_SYMS = ["calice","dados","ficha","rubi","esmeralda","A","K","Q","J","10","wild","scatter"];
const WEIGHTED = [...Array(3).fill("wild"),...Array(4).fill("scatter"),
  ...Array(5).fill("calice"),...Array(5).fill("dados"),...Array(6).fill("ficha"),
  ...Array(8).fill("rubi"),...Array(8).fill("esmeralda"),...Array(10).fill("A"),
  ...Array(11).fill("K"),...Array(12).fill("Q"),...Array(12).fill("J"),...Array(12).fill("10")];

function randomGrid(): string[][] {
  return Array.from({length:COLS}, () =>
    Array.from({length:ROWS}, () => WEIGHTED[Math.floor(Math.random()*WEIGHTED.length)])
  );
}

// Mock: gera grid com possível cluster para demonstração
function mockInitialGrid(): string[][] {
  const g = randomGrid();
  // Forçar um pequeno cluster de rubi para demo visual
  g[2][1]="rubi"; g[2][2]="rubi"; g[3][1]="rubi"; g[3][2]="rubi"; g[4][2]="rubi";
  return g;
}

export default function VideoSlot({ onBack, isBR, setView }: VideoSlotProps) {
  const [bet, setBet] = useState(100);
  const [balance, setBalance] = useState(1234.56);
  const [spinning, setSpinning] = useState(false);
  const [grid, setGrid] = useState(mockInitialGrid);
  const [tumbles, setTumbles] = useState<any[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [winAmount, setWinAmount] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [turbo, setTurbo] = useState(false);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setShowWin(false);
    setWinAmount(0);
    setMultiplier(1);
    setTumbles([]);

    // Em produção: NUI callback casino:slots:spin com mode="video"
    // Mock: gerar resultado com possível tumble
    setTimeout(() => {
      const newGrid = randomGrid();
      setGrid(newGrid);

      // Mock tumble simples (50% chance)
      if (Math.random() > 0.5) {
        const mockTumble = {
          tumbleIndex: 0,
          clusters: [{ symbol: "rubi", count: 5, cells: [[1,2],[1,3],[2,2],[2,3],[3,3]], payout: 0.5 }],
          multiplier: 2,
          removedCells: [[1,2],[1,3],[2,2],[2,3],[3,3]],
          gridBefore: newGrid,
        };
        setTumbles([mockTumble]);
        setWinAmount(bet * 0.5 * 2);
        setShowWin(true);
        setBalance(p => p + bet * 0.5 * 2 - bet);
      } else {
        setTumbles([]);
        setBalance(p => p - bet);
        setSpinning(false);
      }
    }, 800);
  }, [spinning, bet]);

  const handleTumbleComplete = useCallback(() => {
    setSpinning(false);
  }, []);

  const btnSmall: React.CSSProperties = {
    width: "clamp(34px,3.5vw,44px)", height: "clamp(34px,3.5vw,44px)",
    borderRadius: "8px", background: "#1A1A1A",
    border: "1px solid rgba(212,168,67,0.3)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#D4A843", fontSize: "clamp(14px,1.4vw,20px)",
    transition: "background 0.2s, border-color 0.2s",
  };

  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column" }}>
      {/* HEADER */}
      <div style={{
        height:"clamp(36px,4.5vh,48px)", display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 clamp(10px,1.2vw,20px)",
        borderBottom:"1px solid rgba(212,168,67,0.12)", flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"clamp(6px,0.6vw,12px)" }}>
          <Tooltip text={isBR?"Voltar":"Back"}>
            <motion.button whileHover={{scale:1.15,color:"#FFD700"}} whileTap={{scale:0.9}}
              onClick={onBack} style={{background:"transparent",border:"none",cursor:"pointer",
              fontSize:"clamp(16px,1.6vw,22px)",color:"#A8A8A8",padding:0}}>‹</motion.button>
          </Tooltip>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(11px,1.2vw,17px)",
            fontWeight:800,color:"#D4A843",letterSpacing:"1.5px"}}>BLACKOUT FORTUNE</span>
        </div>

        <JackpotTicker mode="video" isBR={isBR} />

        <Tooltip text={isBR?"Seu saldo atual":"Your balance"}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",
            fontSize:"clamp(10px,1.1vw,15px)",color:"#00E676",fontWeight:700}}>
            R$ {balance.toFixed(2).replace(".",",")}
          </div>
        </Tooltip>
      </div>

      {/* ÁREA CENTRAL — Grid + Multiplicador */}
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        padding:"clamp(4px,0.5vw,8px)",
      }}>
        <VideoGrid
          grid={grid}
          tumbles={tumbles}
          spinning={spinning}
          multiplier={multiplier}
          onTumbleComplete={handleTumbleComplete}
        />
      </div>

      {/* WIN DISPLAY */}
      <div style={{height:"clamp(24px,3vh,36px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <WinDisplay amount={winAmount} visible={showWin} isBR={isBR} />
      </div>

      {/* CONTROLES — barra horizontal */}
      <div style={{
        height:"clamp(50px,7vh,70px)", display:"flex", alignItems:"center", justifyContent:"center",
        gap:"clamp(8px,1vw,14px)", borderTop:"1px solid rgba(212,168,67,0.12)",
        padding:"0 clamp(8px,1vw,16px)", flexShrink:0, flexWrap:"wrap",
      }}>
        <BetControls bet={bet} setBet={setBet} min={10} max={5000} disabled={spinning} isBR={isBR} />

        {/* SPIN retangular */}
        <Tooltip text={isBR?"Girar os rolos":"Spin the reels"}>
          <motion.button
            whileHover={spinning ? {} : { brightness: 1.1, boxShadow: "0 0 15px rgba(0,230,118,0.4)" }}
            whileTap={spinning ? {} : { scale: 0.95 }}
            onClick={spinning ? undefined : handleSpin}
            style={{
              width:"clamp(90px,9vw,130px)", height:"clamp(34px,3.5vw,44px)",
              borderRadius:"8px", border:"none", cursor: spinning ? "not-allowed" : "pointer",
              background: spinning ? "linear-gradient(90deg,#333,#222)" : "linear-gradient(90deg,#004D25,#00E676)",
              opacity: spinning ? 0.4 : 1,
              fontFamily:"'Cinzel',serif", fontSize:"clamp(11px,1.1vw,16px)", fontWeight:800,
              color:"#FFF", letterSpacing:"2px",
              boxShadow: spinning ? "none" : "0 0 10px rgba(0,230,118,0.25)",
            }}>
            {isBR?"GIRAR":"SPIN"}
          </motion.button>
        </Tooltip>

        {/* BONUS BUY */}
        <Tooltip text={isBR?"Comprar entrada nos Free Spins (25x aposta)":"Buy Free Spins entry (25x bet)"}>
          <motion.button whileHover={{background:"#D4A843",color:"#000"}} whileTap={{scale:0.95}}
            onClick={() => setView("bonusBuyModal")}
            style={{
              height:"clamp(34px,3.5vw,44px)", padding:"0 clamp(8px,0.8vw,14px)",
              borderRadius:"8px", background:"#1A1A1A",
              border:"1px solid #D4A843", cursor:"pointer",
              fontFamily:"'Inter',sans-serif", fontSize:"clamp(8px,0.85vw,12px)", fontWeight:600,
              color:"#D4A843", letterSpacing:"0.5px", whiteSpace:"nowrap",
              transition:"background 0.2s, color 0.2s",
            }}>
            FREE SPINS
          </motion.button>
        </Tooltip>

        {/* AUTO */}
        <Tooltip text={isBR?"Girar automaticamente":"Auto spin"}>
          <motion.button whileHover={{background:"#333"}} whileTap={{scale:0.9}}
            onClick={() => setView("autoPlayModal")}
            style={btnSmall}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="4,2 14,8 4,14" fill="#D4A843"/>
            </svg>
          </motion.button>
        </Tooltip>

        {/* TURBO */}
        <Tooltip text={isBR?"Acelerar animações (2x)":"Speed up animations (2x)"}>
          <motion.button whileHover={{background:"#333"}} whileTap={{scale:0.9}}
            onClick={() => setTurbo(!turbo)}
            style={{...btnSmall, borderColor: turbo ? "#00E676" : "rgba(212,168,67,0.3)",
              color: turbo ? "#00E676" : "#D4A843"}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" fill="currentColor"/>
            </svg>
          </motion.button>
        </Tooltip>

        {/* PAYTABLE */}
        <Tooltip text={isBR?"Ver tabela de pagamentos":"View paytable"}>
          <motion.button whileHover={{background:"#333"}} whileTap={{scale:0.9}}
            onClick={() => setView("paytable")}
            style={{...btnSmall, fontFamily:"serif", fontWeight:700}}>i</motion.button>
        </Tooltip>

        {/* HISTÓRICO */}
        <Tooltip text={isBR?"Ver últimas rodadas":"View recent rounds"}>
          <motion.button whileHover={{background:"#333"}} whileTap={{scale:0.9}}
            onClick={() => setView("history")}
            style={btnSmall}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </Tooltip>
      </div>
    </div>
  );
}
