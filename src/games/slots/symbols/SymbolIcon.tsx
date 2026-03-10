"use client";

interface SymbolIconProps { name: string; size?: string; }

export default function SymbolIcon({ name, size = "48px" }: SymbolIconProps) {
  const s = { width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" } as const;

  switch (name) {
    case "diamante":
      return (<div style={s}><svg viewBox="0 0 48 48" width="80%" height="80%">
        <polygon points="24,4 44,20 24,44 4,20" fill="url(#dg)" stroke="#FFD700" strokeWidth="1.5"/>
        <polygon points="24,4 34,20 24,36 14,20" fill="rgba(255,255,255,0.2)"/>
        <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#D4A843"/><stop offset="100%" stopColor="#8B6914"/>
        </linearGradient></defs></svg></div>);

    case "777":
      return (<div style={{...s,fontFamily:"serif",fontSize:`calc(${size}*0.45)`,fontWeight:900,color:"#FF1744",
        textShadow:"0 0 4px rgba(255,23,68,0.4),1px 1px 0 #8B6914",letterSpacing:"1px"}}>777</div>);

    case "bar_triplo":
      return (<div style={{...s,flexDirection:"column",gap:"2px"}}>{[0,1,2].map(i=>
        <div key={i} style={{background:"#1A1A1A",borderRadius:"3px",padding:"1px 6px",
          fontFamily:"sans-serif",fontSize:`calc(${size}*0.16)`,fontWeight:900,
          color:"#D4A843",letterSpacing:"1px",border:"1px solid #D4A843"}}>BAR</div>)}</div>);

    case "sino":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <path d="M24 6C24 6,12 12,12 28L36 28C36 12,24 6,24 6Z" fill="#FFD700" stroke="#D4A843" strokeWidth="1"/>
        <rect x="11" y="28" width="26" height="4" rx="2" fill="#D4A843"/>
        <circle cx="24" cy="36" r="4" fill="#FFD700" stroke="#D4A843" strokeWidth="1"/>
        <line x1="24" y1="2" x2="24" y2="6" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"/></svg></div>);

    case "estrela":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <polygon points="24,4 29,18 44,18 32,28 36,42 24,33 12,42 16,28 4,18 19,18" fill="#FFD700" stroke="#D4A843" strokeWidth="1"/>
        <polygon points="24,8 28,18 38,18 30,25 33,36 24,29 15,36 18,25 10,18 20,18" fill="rgba(255,255,255,0.15)"/></svg></div>);

    case "cereja":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <circle cx="16" cy="30" r="10" fill="#E53935"/><circle cx="32" cy="30" r="10" fill="#E53935"/>
        <circle cx="13" cy="26" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="29" cy="26" r="3" fill="rgba(255,255,255,0.3)"/>
        <path d="M16 20Q24 12,32 20" stroke="#4CAF50" strokeWidth="2.5" fill="none"/></svg></div>);

    case "limao":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <ellipse cx="24" cy="26" rx="14" ry="16" fill="#FFD54F" stroke="#F9A825" strokeWidth="1"/>
        <ellipse cx="22" cy="24" rx="6" ry="8" fill="rgba(255,255,255,0.2)"/>
        <path d="M24 10Q26 6,28 8" stroke="#4CAF50" strokeWidth="2" fill="none"/></svg></div>);

    case "blank": return <div style={{...s,opacity:0.1}}/>;

    case "wild":
      return (<div style={{...s,fontFamily:"'Cinzel',serif",fontSize:`calc(${size}*0.35)`,fontWeight:900,
        background:"linear-gradient(135deg,#FFD700,#FF6B00)",WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 4px rgba(255,215,0,0.5))"}}>WILD</div>);

    case "scatter":
      return (<div style={s}><svg viewBox="0 0 48 48" width="80%" height="80%">
        <polygon points="24,2 30,16 46,18 34,28 38,44 24,36 10,44 14,28 2,18 18,16" fill="#111" stroke="#00E5FF" strokeWidth="2"/>
        <polygon points="24,8 28,16 38,18 31,25 33,36 24,30 15,36 17,25 10,18 20,16" fill="rgba(0,229,255,0.15)"/></svg></div>);

    case "calice":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <path d="M16 8L14 24Q14 30,24 30Q34 30,34 24L32 8Z" fill="#D4A843" stroke="#8B6914" strokeWidth="1"/>
        <rect x="21" y="30" width="6" height="8" fill="#D4A843"/>
        <ellipse cx="24" cy="42" rx="10" ry="3" fill="#8B6914"/></svg></div>);

    case "dados":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <rect x="4" y="14" width="24" height="24" rx="4" fill="#D4A843" stroke="#8B6914" strokeWidth="1" transform="rotate(-10 16 26)"/>
        <rect x="20" y="10" width="24" height="24" rx="4" fill="#FFD700" stroke="#D4A843" strokeWidth="1" transform="rotate(10 32 22)"/>
        <circle cx="26" cy="16" r="2" fill="#1A1A1A"/><circle cx="38" cy="16" r="2" fill="#1A1A1A"/>
        <circle cx="32" cy="22" r="2" fill="#1A1A1A"/></svg></div>);

    case "ficha":
      return (<div style={s}><svg viewBox="0 0 48 48" width="75%" height="75%">
        <circle cx="24" cy="24" r="18" fill="#1A1A1A" stroke="#D4A843" strokeWidth="3"/>
        <circle cx="24" cy="24" r="12" fill="none" stroke="#D4A843" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="24" y="28" textAnchor="middle" fill="#D4A843" fontSize="10" fontWeight="bold" fontFamily="serif">BC</text></svg></div>);

    case "rubi":
      return (<div style={s}><svg viewBox="0 0 48 48" width="70%" height="70%">
        <polygon points="24,6 40,18 36,38 12,38 8,18" fill="#E53935" stroke="#B71C1C" strokeWidth="1"/>
        <polygon points="24,6 32,18 24,34 16,18" fill="rgba(255,255,255,0.15)"/></svg></div>);

    case "esmeralda":
      return (<div style={s}><svg viewBox="0 0 48 48" width="70%" height="70%">
        <polygon points="24,4 38,14 38,34 24,44 10,34 10,14" fill="#00E676" stroke="#004D25" strokeWidth="1"/>
        <polygon points="24,8 32,14 32,30 24,38 16,30 16,14" fill="rgba(255,255,255,0.12)"/></svg></div>);

    case "A": case "K":
      return (<div style={{...s,fontFamily:"'Cinzel',serif",fontSize:`calc(${size}*0.5)`,fontWeight:900,
        color:"#D4A843",textShadow:"0 1px 2px rgba(0,0,0,0.5)"}}>{name}</div>);

    case "Q": case "J": case "10":
      return (<div style={{...s,fontFamily:"'Cinzel',serif",fontSize:`calc(${size}*0.45)`,fontWeight:800,
        color:"#9E9E9E",textShadow:"0 1px 2px rgba(0,0,0,0.5)"}}>{name}</div>);

    default: return <div style={{...s,color:"#555",fontSize:"10px"}}>{name}</div>;
  }
}
