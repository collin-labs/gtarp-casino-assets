"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SlotsView } from "./SlotsGame";
import BetControls from "./components/BetControls";
import SpinButton from "./components/SpinButton";
import WinDisplay from "./components/WinDisplay";
import Tooltip from "./components/Tooltip";
import ClassicReel from "./ClassicReel";

interface ClassicSlotProps {
  onBack: () => void;
  isBR: boolean;
  setView: (v: SlotsView) => void;
}

const MOCK_SYMBOLS = [["cereja","sino","estrela"],["limao","777","cereja"],["bar_triplo","estrela","sino"]];
const MOCK_JACKPOTS = { mini: 142.5, grand: 5230.0 };

export default function ClassicSlot({ onBack, isBR, setView }: ClassicSlotProps) {
  const [bet, setBet] = useState(20);
  const [balance, setBalance] = useState(1234.56);
  const [spinning, setSpinning] = useState(false);
  const [grid, setGrid] = useState(MOCK_SYMBOLS);
  const [winAmount, setWinAmount] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [jackpots, setJackpots] = useState(MOCK_JACKPOTS);
  const [winPaylines, setWinPaylines] = useState<number[]>([]);
  const reelRefs = useRef<Array<{ spin: (t: string[], cb: () => void) => void }>>([]);

  // Jackpot ticker mock
  useEffect(() => {
    const iv = setInterval(() => {
      setJackpots(p => ({ mini: p.mini + Math.random() * 0.15, grand: p.grand + Math.random() * 0.8 }));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setShowWin(false);
    setWinAmount(0);
    setWinPaylines([]);

    // Mock resultado (em produção: NUI callback casino:slots:spin)
    const syms = ["cereja","limao","sino","estrela","bar_triplo","777","diamante","blank"];
    const newGrid = Array.from({length:3}, () => Array.from({length:3}, () => syms[Math.floor(Math.random()*syms.length)]));

    let done = 0;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        reelRefs.current[i]?.spin(newGrid[i], () => {
          done++;
          if (done === 3) {
            setGrid(newGrid);
            // Mock win check: centro iguais
            if (newGrid[0][1] === newGrid[1][1] && newGrid[1][1] === newGrid[2][1] && newGrid[0][1] !== "blank") {
              const w = bet * 25;
              setWinAmount(w);
              setShowWin(true);
              setBalance(p => p + w);
              setWinPaylines([1]);
            } else { setBalance(p => p - bet); }
            setSpinning(false);
          }
        });
      }, i * 500);
    }
  }, [spinning, bet]);

  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column" }}>
      {/* HEADER */}
      <div style={{
        height:"clamp(38px,5vh,52px)", display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 clamp(12px,1.5vw,24px)",
        borderBottom:"1px solid rgba(212,168,67,0.15)", flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"clamp(8px,0.8vw,14px)" }}>
          <Tooltip text={isBR?"Voltar":"Back"}>
            <motion.button whileHover={{scale:1.15,color:"#FFD700"}} whileTap={{scale:0.9}}
              onClick={onBack} style={{background:"transparent",border:"none",cursor:"pointer",
              fontSize:"clamp(16px,1.8vw,24px)",color:"#A8A8A8",fontFamily:"'Inter',sans-serif",padding:0}}>
              ‹
            </motion.button>
          </Tooltip>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(13px,1.4vw,20px)",
            fontWeight:800,color:"#D4A843",letterSpacing:"2px"}}>777 GOLD</span>
        </div>
        <Tooltip text={isBR?"Jackpot progressivo":"Progressive jackpot"}>
          <div style={{display:"flex",gap:"clamp(12px,1.5vw,24px)",fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,0.9vw,13px)"}}>
            <span style={{color:"#A8A8A8"}}>MINI <span style={{color:"#FFD700"}}>R$ {jackpots.mini.toFixed(2).replace(".",",")}</span></span>
            <span style={{color:"#A8A8A8"}}>GRAND <span style={{color:"#FFD700",textShadow:"0 0 8px rgba(255,215,0,0.4)"}}>R$ {jackpots.grand.toFixed(2).replace(".",",")}</span></span>
          </div>
        </Tooltip>
        <Tooltip text={isBR?"Seu saldo atual":"Your balance"}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(11px,1.2vw,16px)",color:"#00E676",fontWeight:700}}>
            {isBR?"Saldo:":"Balance:"} R$ {balance.toFixed(2).replace(".",",")}
          </div>
        </Tooltip>
      </div>

      {/* ÁREA CENTRAL — Máquina */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{
          position:"relative",
          background:"linear-gradient(135deg,rgba(212,168,67,0.1),rgba(139,105,20,0.05))",
          border:"3px solid #D4A843", borderRadius:"16px",
          padding:"clamp(12px,1.5vw,22px)",
          boxShadow:"0 0 30px rgba(212,168,67,0.15),inset 0 0 20px rgba(0,0,0,0.5),0 8px 30px rgba(0,0,0,0.6)",
        }}>
          {/* LEDs */}
          <div style={{position:"absolute",top:"-2px",left:"10%",right:"10%",display:"flex",justifyContent:"space-around",transform:"translateY(-50%)"}}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{
                width:"clamp(5px,0.5vw,8px)",height:"clamp(5px,0.5vw,8px)",borderRadius:"50%",
                background:i%3===0?"#FFD700":i%3===1?"#FF1744":"#00E676",
                boxShadow:`0 0 6px ${i%3===0?"rgba(255,215,0,0.6)":i%3===1?"rgba(255,23,68,0.6)":"rgba(0,230,118,0.6)"}`,
                animation:`sled ${1.5+i*0.2}s ease-in-out ${i*0.15}s infinite alternate`,
              }}/>
            ))}
          </div>

          {/* Grid 3×3 */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:"clamp(3px,0.3vw,5px)", background:"#F5F5F0",
            borderRadius:"8px", padding:"clamp(4px,0.4vw,6px)",
            border:"2px solid rgba(212,168,67,0.5)",
            boxShadow:"inset 0 2px 8px rgba(0,0,0,0.3)",
          }}>
            {[0,1,2].map(col => (
              <ClassicReel key={col}
                ref={(el:any) => { if(el) reelRefs.current[col]=el; }}
                symbols={grid[col]} colIndex={col} winPaylines={winPaylines} />
            ))}
          </div>

          {/* Borda inferior */}
          <div style={{position:"absolute",bottom:"-2px",left:"15%",right:"15%",height:"3px",
            background:"linear-gradient(90deg,transparent,#FFD700 30%,#D4A843 50%,#FFD700 70%,transparent)",
            boxShadow:"0 0 8px rgba(255,215,0,0.4)"}}/>
        </div>

        {/* Alavanca */}
        <Tooltip text={isBR?"Puxe para girar!":"Pull to spin!"} position="left">
          <motion.div whileTap={{rotate:25}} onClick={handleSpin}
            transition={{type:"spring",stiffness:300,damping:15}}
            style={{marginLeft:"clamp(8px,1vw,16px)",display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}}>
            <div style={{width:"clamp(20px,2vw,28px)",height:"clamp(20px,2vw,28px)",borderRadius:"50%",
              background:"linear-gradient(135deg,#FFD700,#D4A843)",boxShadow:"0 0 8px rgba(255,215,0,0.4)"}}/>
            <div style={{width:"clamp(8px,0.8vw,12px)",height:"clamp(60px,7vh,100px)",
              background:"linear-gradient(90deg,#8B6914,#D4A843,#8B6914)",borderRadius:"4px"}}/>
          </motion.div>
        </Tooltip>
      </div>

      {/* WIN DISPLAY */}
      <div style={{height:"clamp(28px,3.5vh,40px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <WinDisplay amount={winAmount} visible={showWin} isBR={isBR} />
      </div>

      {/* CONTROLES */}
      <div style={{
        height:"clamp(56px,8vh,80px)", display:"flex", alignItems:"center", justifyContent:"center",
        gap:"clamp(16px,2vw,32px)", borderTop:"1px solid rgba(212,168,67,0.15)",
        padding:"0 clamp(12px,1.5vw,24px)", flexShrink:0,
      }}>
        <BetControls bet={bet} setBet={setBet} min={5} max={2000} disabled={spinning} isBR={isBR} />
        <SpinButton onClick={handleSpin} disabled={spinning} isBR={isBR} />
        <Tooltip text={isBR?"Ver pagamentos":"View paytable"}>
          <motion.button whileHover={{background:"#333"}} whileTap={{scale:0.9}}
            onClick={() => setView("paytable")}
            style={{width:"clamp(30px,3vw,38px)",height:"clamp(30px,3vw,38px)",borderRadius:"50%",
              background:"#222",border:"1px solid rgba(212,168,67,0.3)",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"#D4A843",fontSize:"clamp(14px,1.4vw,20px)",fontWeight:700,fontFamily:"serif"}}>
            i
          </motion.button>
        </Tooltip>
      </div>

      <style>{`@keyframes sled { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
    </div>
  );
}
