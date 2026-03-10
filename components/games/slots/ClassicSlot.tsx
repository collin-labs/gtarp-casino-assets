"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SlotsView } from "./SlotsGame";
import BetControls from "./components/BetControls";
import SpinButton from "./components/SpinButton";
import WinDisplay from "./components/WinDisplay";
import Tooltip from "./components/Tooltip";
import ClassicReel from "./ClassicReel";
import { soundManager } from "./SoundManager";

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
  const [showLose, setShowLose] = useState(false);
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
    soundManager.init();
    soundManager.play("spin_start");
    setSpinning(true);
    setShowWin(false);
    setShowLose(false);
    setWinAmount(0);
    setWinPaylines([]);

    // Mock resultado (em produção: NUI callback casino:slots:spin)
    const syms = ["cereja","limao","sino","estrela","bar_triplo","777","diamante"];
    const newGrid = Array.from({length:3}, () => Array.from({length:3}, () => syms[Math.floor(Math.random()*syms.length)]));

    let done = 0;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        reelRefs.current[i]?.spin(newGrid[i], () => {
          done++;
          if (done === 3) {
            setGrid(newGrid);
            soundManager.play("reel_stop");
            // Mock win check: centro iguais
            if (newGrid[0][1] === newGrid[1][1] && newGrid[1][1] === newGrid[2][1] && newGrid[0][1] !== "blank") {
              const w = bet * 25;
              setWinAmount(w);
              setShowWin(true);
              setBalance(p => p + w);
              setWinPaylines([1]);
              soundManager.play("win_big");
            } else {
              setBalance(p => p - bet);
              setShowLose(true);
              setTimeout(() => setShowLose(false), 1500);
            }
            setSpinning(false);
          }
        });
      }, i * 700);
    }
  }, [spinning, bet]);

  return (
    <div style={{
      width:"100%", height:"100%", display:"flex", flexDirection:"column",
      backgroundImage: "url(/slots/classic/classic-bg.png)",
      backgroundSize: "cover", backgroundPosition: "center",
      backgroundRepeat: "no-repeat", position: "relative",
    }}>
      {/* Overlay pra contraste */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
      }} />
      {/* HEADER */}
      <div style={{
        height:"clamp(38px,5vh,52px)", display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 clamp(12px,1.5vw,24px)",
        borderBottom:"1px solid rgba(212,168,67,0.15)",
        backgroundImage:"linear-gradient(180deg, rgba(212,168,67,0.03), transparent)",
        flexShrink:0,
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
            <span style={{color:"#A8A8A8"}}>MINI <span style={{color:"#FFD700"}}>🪙 {jackpots.mini.toFixed(2).replace(".",",")}</span></span>
            <span style={{color:"#A8A8A8"}}>GRAND <span style={{color:"#FFD700",textShadow:"0 0 8px rgba(255,215,0,0.4)"}}>🪙 {jackpots.grand.toFixed(2).replace(".",",")}</span></span>
          </div>
        </Tooltip>
        <Tooltip text={isBR?"Seu saldo atual":"Your balance"}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(11px,1.2vw,16px)",color:"#00E676",fontWeight:700}}>
            {isBR?"GCoin:":"GCoin:"} 🪙 {balance.toFixed(2).replace(".",",")}
          </div>
        </Tooltip>
      </div>

      {/* ÁREA CENTRAL — Máquina */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{
          position:"relative",
          background:"linear-gradient(180deg, #CB9B51 0%, #F6E27A 25%, #D4A843 50%, #F6E27A 75%, #8B6914 100%)",
          borderRadius:"16px", padding:"3px",
          boxShadow:[
            "0 4px 12px rgba(0,0,0,0.6)",
            "0 12px 32px rgba(0,0,0,0.4)",
            "0 0 16px rgba(212,168,67,0.1)",
          ].join(", "),
        }}>
          <div style={{
            background:"linear-gradient(180deg, #1A1A1A 0%, #111111 50%, #0A0A0A 100%)",
            borderRadius:"14px", padding:"clamp(12px,1.5vw,22px)",
            position:"relative",
            boxShadow:"inset 0 1px 0 rgba(212,168,67,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)",
          }}>
          {/* LEDs */}
          <div style={{position:"absolute",top:"-2px",left:"10%",right:"10%",display:"flex",justifyContent:"space-around",transform:"translateY(-50%)"}}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{
                width:"clamp(6px,0.6vw,9px)",height:"clamp(6px,0.6vw,9px)",borderRadius:"50%",
                background:i%3===0?"#FFD700":i%3===1?"#FF1744":"#00E676",
                boxShadow:`0 0 ${i%3===0?"6px rgba(255,215,0,0.6)":i%3===1?"6px rgba(255,23,68,0.5)":"6px rgba(0,230,118,0.5)"}`,
                animation:`ledBlink 1.5s ease-in-out ${i*0.15}s infinite alternate`,
              }}/>
            ))}
          </div>

          {/* Grid 3×3 */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:"clamp(3px,0.3vw,5px)",
            background:"linear-gradient(180deg, #F5F5F0, #E8E5D8)",
            borderRadius:"8px", padding:"clamp(4px,0.4vw,6px)",
            border:"2px solid rgba(212,168,67,0.5)",
            boxShadow:"inset 0 2px 6px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.5), 0 0 0 1px rgba(212,168,67,0.15)",
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
        </div>

        {/* Alavanca */}
        <Tooltip text={isBR?"Puxe para girar!":"Pull to spin!"} position="left">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ y: 30, scale: 0.95 }}
            onClick={() => { if (!spinning) handleSpin(); }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            style={{
              marginLeft: "clamp(8px,1vw,16px)",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: spinning ? "not-allowed" : "pointer",
              opacity: spinning ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}>
            <div style={{
              width: "clamp(22px,2.2vw,30px)", height: "clamp(22px,2.2vw,30px)", borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #FFD700, #D4A843, #8B6914)",
              boxShadow: "0 0 10px rgba(255,215,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)",
            }}/>
            <div style={{
              width: "clamp(10px,1vw,14px)", height: "clamp(60px,7vh,100px)",
              background: "linear-gradient(90deg, #8B6914 0%, #CB9B51 30%, #D4A843 50%, #CB9B51 70%, #8B6914 100%)",
              borderRadius: "4px",
              boxShadow: "2px 0 4px rgba(0,0,0,0.3), -1px 0 2px rgba(0,0,0,0.2)",
            }}/>
          </motion.div>
        </Tooltip>
      </div>

      {/* WIN / LOSE DISPLAY */}
      <div style={{height:"clamp(28px,3.5vh,40px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <WinDisplay amount={winAmount} visible={showWin} isBR={isBR} />
        {showLose && (
          <div style={{
            fontFamily:"'Inter',sans-serif",
            fontSize:"clamp(12px,1.3vw,17px)",
            fontWeight:700,
            color:"#FF1744",
            textShadow:"0 0 8px rgba(255,23,68,0.3)",
            animation:"fadeInUp 0.3s ease",
          }}>
            {isBR ? "Sem premiação" : "No win"}
          </div>
        )}
      </div>

      {/* CONTROLES */}
      <div style={{
        height:"clamp(56px,8vh,80px)", display:"flex", alignItems:"center", justifyContent:"center",
        gap:"clamp(16px,2vw,32px)", borderTop:"1px solid rgba(212,168,67,0.15)",
        padding:"0 clamp(12px,1.5vw,24px)", flexShrink:0,
      }}>
        <BetControls bet={bet} setBet={setBet} min={5} max={2000} disabled={spinning} isBR={isBR} />
        <Tooltip text={isBR?"Girar os rolos":"Spin the reels"}>
          <motion.button
            whileHover={spinning ? {} : { brightness: 1.1, boxShadow: "0 0 15px rgba(0,230,118,0.4)" }}
            whileTap={spinning ? {} : { scale: 0.95 }}
            onClick={spinning ? undefined : handleSpin}
            style={{
              width:"clamp(90px,9vw,130px)", height:"clamp(34px,3.5vw,44px)",
              borderRadius:"8px", border:"none", cursor: spinning ? "not-allowed" : "pointer",
              background: spinning
                ? "linear-gradient(180deg, #333 0%, #222 100%)"
                : "linear-gradient(180deg, #00E676 0%, #00C853 40%, #004D25 100%)",
              opacity: spinning ? 0.4 : 1,
              fontFamily:"'Cinzel',serif", fontSize:"clamp(11px,1.1vw,16px)", fontWeight:800,
              color:"#FFF", letterSpacing:"2px",
              boxShadow: spinning
                ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                : "0 0 10px rgba(0,230,118,0.3), 0 0 20px rgba(0,230,118,0.15), inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.4)",
              transition: "all 0.2s",
            }}>
            {isBR?"GIRAR":"SPIN"}
          </motion.button>
        </Tooltip>
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

      <style>{`
        @keyframes ledBlink { 0%,100%{opacity:0.4;filter:brightness(0.7)} 50%{opacity:1;filter:brightness(1.3)} }
        @keyframes slotShimmer { 0%{transform:translateX(-100%) rotate(25deg)} 50%,100%{transform:translateX(250%) rotate(25deg)} }
        @keyframes winFlash { 0%{opacity:1;transform:scale(0.8)} 100%{opacity:0;transform:scale(1.5)} }
      `}</style>
    </div>
  );
}
