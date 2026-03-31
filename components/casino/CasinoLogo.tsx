"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UI } from "@/lib/assets";

interface CasinoLogoProps {
  visible: boolean;
}

const SPARK_COUNT = 10;
const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
  const angle = (360 / SPARK_COUNT) * i + Math.random() * 20 - 10;
  const rad = (angle * Math.PI) / 180;
  const dist = 30 + Math.random() * 28;
  return {
    id: i,
    endX: Math.cos(rad) * dist,
    endY: Math.sin(rad) * dist,
    delay: i * 0.25,
    duration: 1.6 + Math.random() * 1.2,
    size: 2 + Math.random() * 2.5,
    color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFA500" : "#F6E27A",
  };
});

export default function CasinoLogo({ visible }: CasinoLogoProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,                                           /* posicao horizontal base */
        top: "78%",
        transform: "translate(-19%, -50%)",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "clamp(4px, 0.8vw, 12px)",                    /* espaco escudo↔texto */
        cursor: "default",
      }}
    >
      {/* Container do escudo com efeitos */}
      <div style={{ position: "relative", width: "clamp(65px, 8vw, 110px)", height: "clamp(65px, 8vw, 110px)" }}>  {/* L51: tamanho escudo — 8vw padrao */}

        {/* C1: Mascara de nevoa na borda */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "280%",
            height: "280%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0.15) 55%, transparent 72%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* C2: Aura de energia pulsante */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "180%",
            height: "180%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(212,168,67,0.25) 0%, rgba(255,215,0,0.1) 30%, rgba(212,168,67,0.04) 55%, transparent 75%)",
            pointerEvents: "none",
            zIndex: 1,
            animation: "logoAuraPulse 3s ease-in-out infinite",
            opacity: hovered ? 0.8 : 0.15,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* C3: Segundo anel de energia */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "220%",
            height: "220%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(255,165,0,0.08) 0%, rgba(212,168,67,0.04) 40%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 1,
            animation: "logoAuraPulse 5s ease-in-out infinite reverse",
            opacity: hovered ? 0.6 : 0.1,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* C4: Particulas de faisca via Framer Motion */}
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: s.color,
              boxShadow: `0 0 ${s.size + 2}px ${s.color}`,
              pointerEvents: "none",
              zIndex: 3,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
            }}
            animate={{
              x: [0, s.endX * 0.4, s.endX],
              y: [0, s.endY * 0.4, s.endY],
              opacity: [0, hovered ? 0.9 : 0.12, 0],
              scale: [1, 0.8, 0.1],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* C5: Escudo principal */}
        <motion.img
          src={UI.logoIcone}
          alt=""
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: hovered
              ? "drop-shadow(0 0 8px rgba(255,215,0,0.7)) drop-shadow(0 0 20px rgba(212,168,67,0.5)) drop-shadow(0 0 35px rgba(255,165,0,0.3))"
              : "drop-shadow(0 0 4px rgba(255,215,0,0.2)) drop-shadow(0 0 10px rgba(0,0,0,0.6))",
            zIndex: 2,
            transition: "filter 0.4s ease",
          }}
        />

        {/* C6: Shimmer sweep sobre o escudo */}
        <div
          style={{
            position: "absolute",
            inset: "5%",
            background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.15) 48%, rgba(255,255,255,0.2) 50%, rgba(255,215,0,0.15) 52%, transparent 60%)",
            backgroundSize: "250% 100%",
            animation: "logoShimmer 4s ease infinite",
            pointerEvents: "none",
            zIndex: 4,
            borderRadius: "50%",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Texto "BLACKOUT CASINO" ao lado com particulas */}
      <div style={{ position: "relative" }}>
        {/* Faiscas saindo do texto */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`txt-spark-${i}`}
            style={{
              position: "absolute",
              left: `${15 + i * 14}%`,
              top: "50%",
              width: 2 + Math.random() * 1.5,
              height: 2 + Math.random() * 1.5,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#FFD700" : "#F6E27A",
              boxShadow: `0 0 4px ${i % 2 === 0 ? "#FFD700" : "#F6E27A"}`,
              pointerEvents: "none",
              zIndex: 3,
            }}
            animate={{
              y: [0, -12 - i * 4, -25 - i * 6],
              x: [0, (i % 2 === 0 ? 3 : -3), (i % 2 === 0 ? 6 : -5)],
              opacity: [0, hovered ? 0.8 : 0.15, 0],
              scale: [0.8, 1, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.3,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.img
          src={UI.logoTexto}
          alt="Blackout Casino"
          animate={hovered ? { scale: 1.04 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: "clamp(90px, 12vw, 180px)",
            height: "auto",
            objectFit: "contain",
            filter: hovered
              ? "drop-shadow(0 2px 4px rgba(0,0,0,1)) drop-shadow(0 0 12px rgba(212,168,67,0.4))"
              : "drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(212,168,67,0.2))",
            zIndex: 2,
            opacity: hovered ? 1 : 0.85,
            transition: "filter 0.4s ease, opacity 0.3s ease",
          }}
        />
      </div>
    </motion.div>
    </div>
  );
}
