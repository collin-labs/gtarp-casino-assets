"use client";

import { motion } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";

interface ComingSoonProps {
  onBack: () => void;
}

const textos = {
  br: { titulo: "EM BREVE", sub: "Este jogo está sendo preparado para você!", voltar: "VOLTAR" },
  in: { titulo: "COMING SOON", sub: "This game is being prepared for you!", voltar: "GO BACK" },
};

export default function ComingSoon({ onBack }: ComingSoonProps) {
  const { lang } = useCasino();
  const t = textos[lang];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        borderRadius: "inherit",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(12px, 2vw, 24px)",
        background: "linear-gradient(180deg, rgba(10,10,10,0.97) 0%, rgba(20,15,5,0.98) 100%)",
      }}
    >
      {/* Shimmer decorativo no fundo */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(100deg, transparent 40%, rgba(212,168,67,0.06) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "comingsoon-shimmer 2.5s ease-in-out infinite",
        }} />
      </div>

      {/* Badge EM BREVE */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
        style={{
          padding: "clamp(6px, 1vw, 12px) clamp(16px, 3vw, 32px)",
          borderRadius: 8,
          border: "1.5px solid rgba(212,168,67,0.5)",
          background: "linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)",
          boxShadow: "0 0 20px rgba(212,168,67,0.1), inset 0 1px 0 rgba(212,168,67,0.2)",
        }}
      >
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          fontSize: "clamp(18px, 3vw, 32px)",
          letterSpacing: "4px",
          color: "#D4A843",
          textShadow: "0 0 12px rgba(212,168,67,0.4)",
        }}>
          {t.titulo}
        </span>
      </motion.div>

      {/* Subtexto */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: "sans-serif",
          fontSize: "clamp(12px, 1.5vw, 16px)",
          color: "rgba(212,168,67,0.6)",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {t.sub}
      </motion.p>

      {/* Botao VOLTAR */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,230,118,0.3)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        title={lang === "br" ? "Voltar ao painel" : "Back to panel"}
        style={{
          marginTop: "clamp(8px, 1.5vw, 16px)",
          padding: "clamp(8px, 1vw, 14px) clamp(20px, 3vw, 40px)",
          borderRadius: 8,
          border: "1.5px solid rgba(0,230,118,0.4)",
          background: "linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,230,118,0.05) 100%)",
          color: "#00E676",
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "clamp(11px, 1.2vw, 14px)",
          letterSpacing: "2px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {t.voltar}
      </motion.button>

      <style>{`
        @keyframes comingsoon-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}
