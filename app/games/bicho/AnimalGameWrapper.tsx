"use client";

import { useRouter } from "next/navigation";
import AnimalGame from "@/components/games/bicho/AnimalGame";

export default function AnimalGameWrapper() {
  const router = useRouter();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(95vw, 1200px)",
          height: "min(90vh, 800px)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 120px rgba(212,168,67,0.1)",
        }}
      >
        <AnimalGame onBack={() => router.push("/")} />
      </div>
    </div>
  );
}
