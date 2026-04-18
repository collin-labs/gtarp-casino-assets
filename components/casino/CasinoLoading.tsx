"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UI } from "@/lib/assets";

interface CasinoLoadingProps {
  visible: boolean;
}

export default function CasinoLoading({ visible }: CasinoLoadingProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000000",
          }}
        >
          {/* Fundo com particulas douradas sutis */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(30,25,10,1) 0%, rgba(10,8,4,1) 50%, #000000 100%)",
            }}
          />

          {/* Raios de luz vindos de tras da logo */}
          <div
            style={{
              position: "absolute",
              width: "clamp(400px, 60vw, 900px)",
              height: "clamp(400px, 60vw, 900px)",
              background: "conic-gradient(from 0deg, transparent 0%, rgba(212,168,67,0.03) 10%, transparent 20%, rgba(212,168,67,0.02) 30%, transparent 40%, rgba(212,168,67,0.04) 50%, transparent 60%, rgba(212,168,67,0.02) 70%, transparent 80%, rgba(212,168,67,0.03) 90%, transparent 100%)",
              borderRadius: "50%",
              animation: "spin 20s linear infinite",
            }}
          />

          {/* Aura pulsante atras da logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "clamp(250px, 35vw, 500px)",
              height: "clamp(250px, 35vw, 500px)",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.04) 40%, transparent 70%)",
            }}
          />

          {/* Logo principal — grande e centralizada */}
          <motion.img
            src={UI.logo4x2}
            alt="Blackout Casino"
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "clamp(200px, 30vw, 450px)",
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(212,168,67,0.3)) drop-shadow(0 0 60px rgba(0,0,0,0.8))",
              zIndex: 2,
            }}
          />

          {/* Linha dourada decorativa */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              marginTop: "clamp(16px, 2vw, 28px)",
              width: "clamp(100px, 15vw, 200px)",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.5), rgba(255,215,0,0.7), rgba(212,168,67,0.5), transparent)",
              zIndex: 2,
            }}
          />

          {/* Barra de loading animada */}
          <div
            style={{
              marginTop: "clamp(12px, 1.5vw, 20px)",
              width: "clamp(140px, 18vw, 260px)",
              height: "2px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.04)",
              overflow: "hidden",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "35%",
                height: "100%",
                borderRadius: "2px",
                background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.5), rgba(255,215,0,0.8), rgba(212,168,67,0.5), transparent)",
                animation: "loadingBar 1.8s ease-in-out infinite",
              }}
            />
          </div>

          {/* Texto loading */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "clamp(8px, 1vw, 14px)",
              fontSize: "clamp(9px, 0.75vw, 12px)",
              color: "rgba(212,168,67,0.4)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              zIndex: 2,
            }}
          >
            Carregando
          </motion.span>

          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-150%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
