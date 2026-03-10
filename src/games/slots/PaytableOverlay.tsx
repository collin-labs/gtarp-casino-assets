"use client";

import { motion, AnimatePresence } from "framer-motion";
import SymbolIcon from "./symbols/SymbolIcon";
import Tooltip from "./components/Tooltip";

interface PaytableOverlayProps {
  visible: boolean;
  mode: "classic" | "video";
  isBR: boolean;
  onClose: () => void;
}

const VIDEO_SYMBOLS = [
  { name:"calice",    label:"Cálice",     labelEN:"Chalice",   type:"premium", pays:[2,5,20,50,200] },
  { name:"dados",     label:"Dados",      labelEN:"Dice",      type:"premium", pays:[1.5,4,15,40,150] },
  { name:"ficha",     label:"Ficha VIP",  labelEN:"VIP Chip",  type:"premium", pays:[1,3,10,30,100] },
  { name:"rubi",      label:"Rubi",       labelEN:"Ruby",      type:"mid",     pays:[0.5,2,5,15,50] },
  { name:"esmeralda", label:"Esmeralda",  labelEN:"Emerald",   type:"mid",     pays:[0.5,2,5,15,50] },
  { name:"A",         label:"Ás",         labelEN:"Ace",       type:"low",     pays:[0.3,1,3,5,20] },
  { name:"K",         label:"Rei",        labelEN:"King",      type:"low",     pays:[0.3,1,3,5,20] },
  { name:"Q",         label:"Dama",       labelEN:"Queen",     type:"low",     pays:[0.2,0.6,2,3,10] },
  { name:"J",         label:"Valete",     labelEN:"Jack",      type:"low",     pays:[0.2,0.6,2,3,10] },
  { name:"10",        label:"10",         labelEN:"10",        type:"low",     pays:[0.2,0.5,1.5,2,5] },
];

const CLASSIC_SYMBOLS = [
  { name:"diamante",   label:"Diamante",    labelEN:"Diamond",  type:"premium", pays:[200] },
  { name:"777",        label:"777",         labelEN:"777",      type:"premium", pays:[100] },
  { name:"bar_triplo", label:"BAR Triplo",  labelEN:"Triple BAR",type:"premium",pays:[50] },
  { name:"sino",       label:"Sino",        labelEN:"Bell",     type:"mid",     pays:[25] },
  { name:"estrela",    label:"Estrela",     labelEN:"Star",     type:"mid",     pays:[15] },
  { name:"cereja",     label:"Cereja",      labelEN:"Cherry",   type:"low",     pays:[10,"2x=2"] },
  { name:"limao",      label:"Limão",       labelEN:"Lemon",    type:"low",     pays:[5] },
];

const TYPE_COLORS: Record<string,string> = { premium:"#FFD700", mid:"#D4A843", low:"#9E9E9E" };

export default function PaytableOverlay({ visible, mode, isBR, onClose }: PaytableOverlayProps) {
  const symbols = mode === "video" ? VIDEO_SYMBOLS : CLASSIC_SYMBOLS;
  const thresholds = mode === "video" ? ["5+","8+","12+","15+","20+"] : ["3x"];

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
              {isBR ? "TABELA DE PAGAMENTOS" : "PAYTABLE"}
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

          {/* Conteúdo scrollável */}
          <div style={{flex:1,overflowY:"auto",padding:"clamp(10px,1.2vw,18px) clamp(14px,1.5vw,24px)",
            display:"flex",flexDirection:"column",gap:"clamp(6px,0.7vw,10px)"}}>

            {/* Thresholds header */}
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
              <div style={{width:"clamp(36px,4vw,52px)"}}/>
              <div style={{flex:1,fontFamily:"'Inter',sans-serif",fontSize:"clamp(9px,0.9vw,12px)",color:"#A8A8A8"}}/>
              {thresholds.map(t => (
                <div key={t} style={{width:"clamp(40px,4.5vw,60px)",textAlign:"center",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,0.85vw,11px)",color:"#A8A8A8"}}>
                  {t}
                </div>
              ))}
            </div>

            {/* Símbolos */}
            {symbols.map(sym => (
              <div key={sym.name} style={{display:"flex",alignItems:"center",gap:"8px",
                padding:"clamp(4px,0.4vw,8px) 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{width:"clamp(36px,4vw,52px)",height:"clamp(36px,4vw,52px)",flexShrink:0}}>
                  <SymbolIcon name={sym.name} size="clamp(36px,4vw,52px)"/>
                </div>
                <div style={{flex:1}}>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,13px)",
                    color:TYPE_COLORS[sym.type]||"#FFF",fontWeight:600}}>
                    {isBR ? sym.label : sym.labelEN}
                  </span>
                </div>
                {sym.pays.map((pay,i) => (
                  <div key={i} style={{width:"clamp(40px,4.5vw,60px)",textAlign:"center",
                    fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(10px,1vw,13px)",
                    color:TYPE_COLORS[sym.type]||"#FFF",fontWeight:600}}>
                    {typeof pay === "number" ? `${pay}x` : pay}
                  </div>
                ))}
              </div>
            ))}

            {/* Regras especiais */}
            <div style={{marginTop:"clamp(12px,1.5vw,20px)",display:"flex",flexDirection:"column",gap:"clamp(8px,0.8vw,12px)"}}>
              <h4 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(11px,1.2vw,15px)",
                color:"#D4A843",margin:0,letterSpacing:"1px"}}>
                {isBR ? "REGRAS ESPECIAIS" : "SPECIAL RULES"}
              </h4>

              {mode === "video" ? (
                <>
                  <RuleRow icon="wild" isBR={isBR}
                    textBR="Substitui qualquer símbolo exceto Scatter"
                    textEN="Substitutes any symbol except Scatter"/>
                  <RuleRow icon="scatter" isBR={isBR}
                    textBR="3+ em qualquer posição = Free Spins (3=10, 4=15, 5=20)"
                    textEN="3+ anywhere = Free Spins (3=10, 4=15, 5=20)"/>
                  <RuleRow icon="×" isBR={isBR}
                    textBR="Multiplicador sobe +1x a cada cascata"
                    textEN="Multiplier increases +1x per cascade"/>
                  <RuleRow icon="↓" isBR={isBR}
                    textBR="Símbolos vencedores somem, novos caem (Tumble)"
                    textEN="Winning symbols disappear, new ones fall (Tumble)"/>
                </>
              ) : (
                <>
                  <RuleRow icon="diamante" isBR={isBR}
                    textBR="Hold & Spin: Diamantes travam, 3 respins, revelam valores"
                    textEN="Hold & Spin: Diamonds lock, 3 respins, reveal values"/>
                  <RuleRow icon="cereja" isBR={isBR}
                    textBR="Cereja paga com apenas 2 na payline (2x)"
                    textEN="Cherry pays with only 2 on payline (2x)"/>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RuleRow({ icon, isBR, textBR, textEN }: { icon:string; isBR:boolean; textBR:string; textEN:string }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
      <div style={{width:"28px",height:"28px",flexShrink:0}}>
        {icon.length <= 2 ? (
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Inter',sans-serif",fontSize:"16px",color:"#D4A843"}}>{icon}</div>
        ) : (
          <SymbolIcon name={icon} size="28px"/>
        )}
      </div>
      <span style={{fontFamily:"'Inter',sans-serif",fontSize:"clamp(10px,1vw,13px)",color:"#CCC",lineHeight:1.4}}>
        {isBR ? textBR : textEN}
      </span>
    </div>
  );
}
