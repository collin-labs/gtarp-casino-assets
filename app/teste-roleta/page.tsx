// app/teste-roleta/page.tsx
// TESTE v4 — transform-origin fix
"use client";

import { useRef } from "react";
import RouletteWheel, {
  type RouletteWheelRef,
} from "@/components/games/roulette/RouletteWheel";

export default function TesteRoleta() {
  const wheelRef = useRef<RouletteWheelRef>(null);

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        fontFamily: "monospace",
        color: "#fff",
      }}
    >
      <h1 style={{ color: "#D4A843", fontSize: 22, margin: 0 }}>
        Teste v4 — Transform-Origin Fix
      </h1>
      <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
        A roda deve girar PLANA no centro, sem deslocar
      </p>

      {/* Container com borda visível para debug */}
      <div
        style={{
          border: "2px dashed #333",
          padding: 0,
          lineHeight: 0,
        }}
      >
        <RouletteWheel
          ref={wheelRef}
          size={380}
          onSpinEnd={(result) => {
            alert(`Resultado: ${result.number} (${result.color})`);
          }}
        />
      </div>

      <button
        onClick={() => wheelRef.current?.spin()}
        style={{
          padding: "12px 32px",
          fontSize: 16,
          fontWeight: "bold",
          background: "#D4A843",
          color: "#000",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        GIRAR ROLETA
      </button>

      <p style={{ color: "#555", fontSize: 11 }}>
        A borda tracejada mostra o container. A roda NÃO pode sair dela.
      </p>
    </div>
  );
}
