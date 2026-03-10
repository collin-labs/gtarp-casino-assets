"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { SlotsView } from "./SlotsGame";
import VideoGrid from "./components/VideoGrid";
import JackpotTicker from "./components/JackpotTicker";
import BetControls from "./components/BetControls";
import WinDisplay from "./components/WinDisplay";
import Tooltip from "./components/Tooltip";
import { soundManager } from "./SoundManager";

interface VideoSlotProps {
  onBack: () => void;
  isBR: boolean;
  setView: (v: SlotsView) => void;
}

const COLS = 6, ROWS = 5;
const ALL_SYMS = ["calice","dados","ficha","rubi","esmeralda","safira","A","K","Q","J","10","wild","scatter"];
const WEIGHTED = [...Array(3).fill("wild"),...Array(4).fill("scatter"),
  ...Array(5).fill("calice"),...Array(5).fill("dados"),...Array(6).fill("ficha"),
  ...Array(7).fill("rubi"),...Array(7).fill("esmeralda"),...Array(7).fill("safira"),
  ...Array(10).fill("A"),...Array(11).fill("K"),...Array(12).fill("Q"),
  ...Array(12).fill("J"),...Array(12).fill("10")];

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
  const [showLose, setShowLose] = useState(false);
  const [turbo, setTurbo] = useState(false);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    // Init SoundManager no primeiro click (requisito browser)
    soundManager.init();
    soundManager.play("spin_start");
    setSpinning(true);
    setShowWin(false);
    setShowLose(false);
    setWinAmount(0);
    setMultiplier(1);
    setTumbles([]);

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
        soundManager.play("win_medium");
      } else {
        setTumbles([]);
        setBalance(p => p - bet);
        setShowLose(true);
        soundManager.play("button_click", { volume: 0.3 });
        // Mostrar feedback de perda por 1.5s antes de liberar
        setTimeout(() => {
          setShowLose(false);
          setSpinning(false);
        }, turbo ? 750 : 1500);
      }
    }, turbo ? 750 : 1500);
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
    <div style={{
      width:"100%", height:"100%", display:"flex", flexDirection:"column",
      backgroundImage: "url(/slots/video/video-bg.png)",
      backgroundSize: "cover", backgroundPosition: "center",
      backgroundRepeat: "no-repeat", position: "relative",
    }}>
      {/* Overlay pra contraste */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
      }} />
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
            🪙 {balance.toFixed(2).replace(".",",")}
          </div>
        </Tooltip>
      </div>

      {/* ÁREA CENTRAL — Grid + Multiplicador */}
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        padding:"clamp(4px,0.5vw,8px)",
      }}>
        {/* Container do grid com moldura (DS P1 §4.2) */}
        <div style={{
          background:"linear-gradient(180deg, rgba(212,168,67,0.08), rgba(139,105,20,0.04))",
          border:"1px solid rgba(212,168,67,0.2)",
          borderRadius:"10px",
          padding:"clamp(6px, 0.6vw, 10px)",
          boxShadow:"inset 0 1px 0 rgba(212,168,67,0.06), 0 2px 8px rgba(0,0,0,0.3)",
          position:"relative",
        }}>
          {/* Brilho no topo */}
          <div style={{
            position:"absolute", top:0, left:"20%", right:"20%", height:"1px",
            background:"linear-gradient(90deg, transparent, rgba(212,168,67,0.25), rgba(246,226,122,0.4), rgba(212,168,67,0.25), transparent)",
            pointerEvents:"none",
          }} />
          <VideoGrid
            grid={grid}
            tumbles={tumbles}
            spinning={spinning}
            multiplier={multiplier}
            onTumbleComplete={handleTumbleComplete}
            turbo={turbo}
          />
        </div>
      </div>

      {/* WIN / LOSE DISPLAY */}
      <div style={{height:"clamp(28px,3.5vh,40px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <WinDisplay amount={winAmount} visible={showWin} isBR={isBR} />
        {showLose && (
          <div style={{
            fontFamily:"'Inter',sans-serif",
            fontSize:"clamp(12px,1.2vw,16px)",
            fontWeight:700,
            color:"#FF1744",
            textShadow:"0 0 8px rgba(255,23,68,0.3)",
            animation:"fadeInUp 0.3s ease",
          }}>
            {isBR ? "Sem premiação" : "No win"}
          </div>
        )}
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
              background: spinning ? "linear-gradient(180deg, #333 0%, #222 100%)" : "linear-gradient(180deg, #00E676 0%, #00C853 40%, #004D25 100%)",
              opacity: spinning ? 0.4 : 1,
              fontFamily:"'Cinzel',serif", fontSize:"clamp(11px,1.1vw,16px)", fontWeight:800,
              color:"#FFF", letterSpacing:"2px",
              boxShadow: spinning ? "inset 0 2px 4px rgba(0,0,0,0.5)" : "0 0 10px rgba(0,230,118,0.3), 0 0 20px rgba(0,230,118,0.15), inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.4)",
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
