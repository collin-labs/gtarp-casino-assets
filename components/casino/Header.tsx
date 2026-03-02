"use client";

import { UI } from "@/lib/assets";

interface HeaderProps {
  lang: "br" | "in";
  setLang: (lang: "br" | "in") => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const isBR = lang === "br";

  return (
    <div className="relative z-[5] grid grid-cols-[25%_50%_25%] items-center px-[clamp(8px,1.5vw,24px)] h-full">
      {/* Logo Blackout Casino */}
      <div className="flex items-center h-full">
        <img
          src={UI.logo4x2}
          alt="Blackout Casino"
          className="h-[95%] max-h-[110px] object-contain drop-shadow-[0_0_15px_rgba(212,168,67,0.6)]"
        />
      </div>

      {/* Centro vazio — letreiro agora está na divider */}
      <div />

      {/* Saldo + Bandeiras — premium styling */}
      <div className="flex flex-col items-end justify-center h-full">
        {/* Saldo com estilo premium */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(20,18,8,0.95), rgba(10,8,3,0.98))",
            border: "1.5px solid rgba(212,168,67,0.6)",
            borderRadius: "10px",
            padding: "5px 14px",
            boxShadow: "0 0 15px rgba(212,168,67,0.2), inset 0 1px 0 rgba(255,215,0,0.1), inset 0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(10px, 1.1vw, 16px)",
              color: "#FFD700",
              fontWeight: 700,
              textShadow: "0 0 10px rgba(255,215,0,0.5)",
              letterSpacing: "1px",
            }}
          >
            R$ 509,25
          </span>
        </div>
      </div>
    </div>
  );
}
