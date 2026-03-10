"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./components/Tooltip";

interface AutoPlayModalProps {
  visible: boolean;
  isBR: boolean;
  onStart: (config: AutoPlayConfig) => void;
  onCancel: () => void;
}

export interface AutoPlayConfig {
  spins: number;
  stopOnBalanceBelow: number | null;
  stopOnWinAbove: number | null;
  stopOnFreeSpins: boolean;
  stopOnJackpot: boolean;
}

const SPIN_OPTIONS = [10, 25, 50, 100, -1]; // -1 = infinito

export default function AutoPlayModal({ visible, isBR, onStart, onCancel }: AutoPlayModalProps) {
  const [selectedSpins, setSelectedSpins] = useState(25);
  const [stopBalance, setStopBalance] = useState<string>("");
  const [stopWin, setStopWin] = useState<string>("");
  const [stopFreeSpins, setStopFreeSpins] = useState(true);
  const [stopJackpot, setStopJackpot] = useState(true);

  const handleStart = () => {
    onStart({
      spins: selectedSpins,
      stopOnBalanceBelow: stopBalance ? parseFloat(stopBalance) : null,
      stopOnWinAbove: stopWin ? parseFloat(stopWin) : null,
      stopOnFreeSpins: stopFreeSpins,
      stopOnJackpot: stopJackpot,
    });
  };

  const checkboxStyle = (checked: boolean): React.CSSProperties => ({
    width: "18px", height: "18px", borderRadius: "4px", cursor: "pointer",
    border: `2px solid ${checked ? "#D4A843" : "rgba(212,168,67,0.3)"}`,
    background: checked ? "#D4A843" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s", flexShrink: 0,
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"absolute",inset:0,zIndex:60,display:"flex",alignItems:"center",
            justifyContent:"center",background:"rgba(0,0,0,0.8)",borderRadius:"inherit"}}
          onClick={onCancel}>
          <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.85,opacity:0}}
            transition={{duration:0.2}} onClick={e=>e.stopPropagation()}
            style={{width:"clamp(280px,30vw,360px)",
              background:"rgba(17,17,17,0.92)",
              backdropFilter:"blur(20px) saturate(1.2)",
              WebkitBackdropFilter:"blur(20px) saturate(1.2)",
              border:"1px solid rgba(212,168,67,0.25)",
              borderRadius:"12px",padding:"clamp(16px,2vw,24px)",
              boxShadow:"0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,168,67,0.08)",
              display:"flex",flexDirection:"column",gap:"clamp(12px,1.5vw,18px)"}}>

            <h3 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(14px,1.5vw,20px)",fontWeight:800,
              color:"#D4A843",margin:0,letterSpacing:"1.5px",textAlign:"center"}}>
              AUTO PLAY
            </h3>

            {/* Número de spins */}
            <div>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,13px)",color:"#A8A8A8",
                marginBottom:"6px",display:"block"}}>
                {isBR ? "Número de spins:" : "Number of spins:"}
              </span>
              <div style={{display:"flex",gap:"6px"}}>
                {SPIN_OPTIONS.map(n => (
                  <motion.button key={n} whileHover={{background:"#D4A843",color:"#000"}} whileTap={{scale:0.95}}
                    onClick={() => setSelectedSpins(n)}
                    style={{
                      flex:1, height:"clamp(30px,3vw,38px)", borderRadius:"6px", cursor:"pointer",
                      background: selectedSpins===n ? "#D4A843" : "#222",
                      color: selectedSpins===n ? "#000" : "#FFF",
                      border:"none", fontFamily:"'Inter',sans-serif",
                      fontSize:"clamp(10px,1vw,14px)", fontWeight:600,
                      transition:"background 0.2s, color 0.2s",
                    }}>
                    {n === -1 ? "∞" : n}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stop conditions */}
            <div style={{display:"flex",flexDirection:"column",gap:"clamp(8px,0.8vw,12px)"}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,13px)",color:"#A8A8A8"}}>
                {isBR ? "Parar quando:" : "Stop when:"}
              </span>

              {/* Saldo menor que */}
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,12px)",color:"#FFF",flex:1}}>
                  {isBR ? "GCoin menor que 🪙" : "GCoin below 🪙"}
                </span>
                <input value={stopBalance} onChange={e=>setStopBalance(e.target.value.replace(/[^0-9.]/g,""))}
                  placeholder="0" style={{
                    width:"clamp(50px,5vw,70px)",height:"28px",background:"#222",border:"1px solid rgba(212,168,67,0.3)",
                    borderRadius:"4px",color:"#FFF",fontFamily:"'JetBrains Mono',monospace",
                    fontSize:"clamp(10px,1vw,13px)",textAlign:"center",outline:"none",
                  }}/>
              </div>

              {/* Win maior que */}
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,12px)",color:"#FFF",flex:1}}>
                  {isBR ? "Ganho maior que 🪙" : "Win above 🪙"}
                </span>
                <input value={stopWin} onChange={e=>setStopWin(e.target.value.replace(/[^0-9.]/g,""))}
                  placeholder="0" style={{
                    width:"clamp(50px,5vw,70px)",height:"28px",background:"#222",border:"1px solid rgba(212,168,67,0.3)",
                    borderRadius:"4px",color:"#FFF",fontFamily:"'JetBrains Mono',monospace",
                    fontSize:"clamp(10px,1vw,13px)",textAlign:"center",outline:"none",
                  }}/>
              </div>

              {/* Free Spins ativarem */}
              <div style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}}
                onClick={() => setStopFreeSpins(!stopFreeSpins)}>
                <div style={checkboxStyle(stopFreeSpins)}>
                  {stopFreeSpins && <span style={{color:"#000",fontSize:"12px",fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,12px)",color:"#FFF"}}>
                  {isBR ? "Free Spins ativarem" : "Free Spins triggered"}
                </span>
              </div>

              {/* Jackpot ativar */}
              <div style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}}
                onClick={() => setStopJackpot(!stopJackpot)}>
                <div style={checkboxStyle(stopJackpot)}>
                  {stopJackpot && <span style={{color:"#000",fontSize:"12px",fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,12px)",color:"#FFF"}}>
                  {isBR ? "Jackpot ativar" : "Jackpot triggered"}
                </span>
              </div>
            </div>

            {/* Botões */}
            <Tooltip text={isBR ? "Iniciar auto play" : "Start auto play"}>
              <motion.button whileHover={{backgroundColor:"#00E676",color:"#000"}} whileTap={{scale:0.95}}
                onClick={handleStart}
                style={{width:"100%",height:"clamp(36px,3.8vw,44px)",background:"#004D25",border:"none",
                  borderRadius:"8px",cursor:"pointer",fontFamily:"'Inter',sans-serif",
                  fontSize:"clamp(11px,1.1vw,15px)",fontWeight:700,color:"#00E676",
                  letterSpacing:"1px",transition:"background 0.2s, color 0.2s"}}>
                {isBR ? "INICIAR" : "START"}
              </motion.button>
            </Tooltip>

            <motion.button whileHover={{color:"#FFF"}} whileTap={{scale:0.95}}
              onClick={onCancel}
              style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",
                fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,13px)",color:"#A8A8A8",
                transition:"color 0.2s"}}>
              {isBR ? "CANCELAR" : "CANCEL"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
