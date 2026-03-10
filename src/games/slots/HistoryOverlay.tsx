"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./components/Tooltip";

interface HistoryEntry {
  id: number;
  mode: string;
  bet_amount: number;
  total_win: number;
  profit: number;
  tumble_count: number;
  final_multiplier: number;
  jackpot_tier: string | null;
  is_free_spin: number;
  created_at: string;
}

interface HistoryOverlayProps {
  visible: boolean;
  isBR: boolean;
  onClose: () => void;
}

// Mock data
const MOCK_HISTORY: HistoryEntry[] = [
  { id:1, mode:"video", bet_amount:100, total_win:450, profit:350, tumble_count:3, final_multiplier:3, jackpot_tier:null, is_free_spin:0, created_at:"2026-03-04 14:30:00" },
  { id:2, mode:"video", bet_amount:100, total_win:0, profit:-100, tumble_count:0, final_multiplier:1, jackpot_tier:null, is_free_spin:0, created_at:"2026-03-04 14:28:30" },
  { id:3, mode:"classic", bet_amount:20, total_win:500, profit:480, tumble_count:0, final_multiplier:1, jackpot_tier:null, is_free_spin:0, created_at:"2026-03-04 14:25:00" },
  { id:4, mode:"video", bet_amount:200, total_win:0, profit:-200, tumble_count:0, final_multiplier:1, jackpot_tier:null, is_free_spin:0, created_at:"2026-03-04 14:22:00" },
  { id:5, mode:"video", bet_amount:500, total_win:12500, profit:12000, tumble_count:5, final_multiplier:8, jackpot_tier:null, is_free_spin:1, created_at:"2026-03-04 14:18:00" },
];

export default function HistoryOverlay({ visible, isBR, onClose }: HistoryOverlayProps) {
  const [entries] = useState<HistoryEntry[]>(MOCK_HISTORY);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
          transition={{type:"spring",stiffness:300,damping:30}}
          style={{
            position:"absolute",bottom:0,left:"5%",right:"5%",
            height:"80%",zIndex:55,background:"#111111",
            border:"1px solid #D4A843",borderRadius:"12px 12px 0 0",
            display:"flex",flexDirection:"column",overflow:"hidden",
            boxShadow:"0 -4px 30px rgba(0,0,0,0.6),0 0 20px rgba(212,168,67,0.15)",
          }}>

          {/* Header */}
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"clamp(10px,1.2vw,18px) clamp(14px,1.5vw,24px)",
            borderBottom:"1px solid rgba(212,168,67,0.2)",flexShrink:0,
          }}>
            <h3 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(13px,1.4vw,19px)",
              fontWeight:800,color:"#D4A843",margin:0,letterSpacing:"1.5px"}}>
              {isBR ? "HISTÓRICO" : "HISTORY"}
            </h3>
            <Tooltip text={isBR?"Fechar":"Close"}>
              <motion.button whileHover={{scale:1.15,color:"#FF1744"}} whileTap={{scale:0.9}}
                onClick={onClose}
                style={{background:"transparent",border:"none",cursor:"pointer",
                  fontSize:"clamp(18px,2vw,24px)",color:"#A8A8A8",padding:0}}>
                ✕
              </motion.button>
            </Tooltip>
          </div>

          {/* Table header */}
          <div style={{
            display:"grid",gridTemplateColumns:"clamp(50px,6vw,80px) 1fr 1fr 1fr clamp(40px,4vw,60px)",
            gap:"4px",padding:"8px clamp(14px,1.5vw,24px)",
            borderBottom:"1px solid rgba(212,168,67,0.15)",
            fontFamily:"'Inter',sans-serif",fontSize:"clamp(8px,0.85vw,11px)",
            color:"#A8A8A8",fontWeight:600,flexShrink:0,
          }}>
            <span>{isBR?"Hora":"Time"}</span>
            <span>{isBR?"Aposta":"Bet"}</span>
            <span>{isBR?"Resultado":"Result"}</span>
            <span>{isBR?"Ganho":"Win"}</span>
            <span>Multi</span>
          </div>

          {/* Entries */}
          <div style={{flex:1,overflowY:"auto",padding:"0 clamp(14px,1.5vw,24px)"}}>
            {entries.map(entry => {
              const isWin = entry.profit > 0;
              const time = entry.created_at.split(" ")[1]?.substring(0,5) || "";
              return (
                <motion.div key={entry.id}
                  whileHover={{background:"rgba(212,168,67,0.05)"}}
                  style={{
                    display:"grid",gridTemplateColumns:"clamp(50px,6vw,80px) 1fr 1fr 1fr clamp(40px,4vw,60px)",
                    gap:"4px",padding:"clamp(6px,0.7vw,10px) 0",
                    borderBottom:"1px solid rgba(255,255,255,0.03)",
                    cursor:"pointer",transition:"background 0.2s",
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize:"clamp(9px,0.95vw,13px)",
                  }}>
                  <span style={{color:"#A8A8A8"}}>{time}</span>
                  <span style={{color:"#FFF"}}>R$ {entry.bet_amount.toFixed(0)}</span>
                  <span style={{color:"#A8A8A8",fontFamily:"'Inter',sans-serif",fontSize:"clamp(8px,0.85vw,11px)"}}>
                    {entry.mode === "video" ? "Video" : "Classic"}
                    {entry.is_free_spin ? " (FS)" : ""}
                  </span>
                  <span style={{color: isWin ? "#00E676" : "#FF1744", fontWeight:700}}>
                    {isWin ? "+" : ""}R$ {entry.profit.toFixed(0)}
                  </span>
                  <span style={{color: entry.final_multiplier > 1 ? "#FFD700" : "#A8A8A8"}}>
                    x{entry.final_multiplier}
                  </span>
                </motion.div>
              );
            })}

            {entries.length === 0 && (
              <div style={{textAlign:"center",padding:"40px",color:"#A8A8A8",
                fontFamily:"'Inter',sans-serif",fontSize:"clamp(11px,1.1vw,14px)"}}>
                {isBR ? "Nenhuma rodada ainda" : "No rounds yet"}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
