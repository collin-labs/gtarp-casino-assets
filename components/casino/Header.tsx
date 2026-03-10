"use client";

import { motion } from "framer-motion";
import { UI } from "@/lib/assets";

interface HeaderProps {
  lang: "br" | "in";
  setLang: (lang: "br" | "in") => void;
}

export default function Header({ lang }: HeaderProps) {
  return (
    <div className="relative z-[5] grid grid-cols-[25%_50%_25%] items-center px-[clamp(8px,1.5vw,24px)] h-full">
      {/* Logo Blackout Casino */}
      <motion.div
        className="flex items-center h-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src={UI.logo4x2}
          alt="Blackout Casino"
          className="h-[95%] max-h-[110px] object-contain"
          style={{
            filter: "drop-shadow(0 0 15px rgba(212,168,67,0.6))",
          }}
        />
      </motion.div>

      {/* Centro -- vazio, mantém grid */}
      <div />

      {/* Saldo GCoin */}
      <motion.div
        className="flex flex-col items-end justify-start h-full"
        style={{paddingTop: "8px" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: "45px" }}
      >
        <motion.div
          whileHover={{
            boxShadow:
              "0 0 25px rgba(0,230,118,0.3), 0 0 15px rgba(212,168,67,0.4), inset 0 0 10px rgba(0,0,0,0.4)",
            borderColor: "rgba(0,230,118,0.8)",
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(10,18,8,0.95), rgba(5,12,3,0.98))",
            border: "1.5px solid rgba(212,168,67,0.6)",
            borderRadius: "12px",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow:
              "0 0 15px rgba(212,168,67,0.2), inset 0 1px 0 rgba(255,215,0,0.1), inset 0 0 10px rgba(0,0,0,0.4)",
            cursor: "default",
            transition: "all 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: "clamp(12px, 1.3vw, 18px)",
              filter: "drop-shadow(0 0 4px rgba(0,230,118,0.5))",
            }}
          >
            🪙
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 1.2vw, 17px)",
              color: "#00E676",
              fontWeight: 700,
              textShadow: "0 0 10px rgba(0,230,118,0.5), 0 0 20px rgba(0,230,118,0.2)",
              letterSpacing: "1.5px",
            }}
          >
            509
          </span>
          <span
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(7px, 0.7vw, 10px)",
              color: "rgba(212,168,67,0.7)",
              fontWeight: 600,
              letterSpacing: "2px",
              marginLeft: "-4px",
            }}
          >
            GC
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
