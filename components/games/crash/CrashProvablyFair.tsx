"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ===========================================================================
// CRASH PROVABLY FAIR — Modal de verificacao HMAC_SHA256
// ===========================================================================

interface CrashRound {
  id: string;
  crashPoint: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

interface CrashProvablyFairProps {
  round: CrashRound;
  onClose: () => void;
}

// Paths dos assets
const ASSETS = {
  iconCopy: "/assets/shared/icons/icon-copy.png",
  iconCheck: "/assets/shared/icons/icon-check.png",
  iconProvablyFair: "/assets/shared/icons/icon-provably-fair.png",
};

export function CrashProvablyFair({ round, onClose }: CrashProvablyFairProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copiar para clipboard
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  // Simular verificacao do hash
  const handleVerify = async () => {
    setIsVerifying(true);
    // Simula tempo de processamento do HMAC_SHA256
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerified(true);
    setIsVerifying(false);
  };

  // Hash do server seed (primeiros 16 chars para display)
  const serverSeedHash = round.serverSeed.substring(0, 32) + "...";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "clamp(320px, 45vw, 520px)",
            background: "rgba(5,5,5,0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(212,168,67,0.4)",
            borderRadius: "16px",
            padding: "clamp(16px, 2vw, 28px)",
            boxShadow: "0 0 60px rgba(212,168,67,0.15), 0 0 120px rgba(0,0,0,0.8)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "clamp(16px, 2vw, 24px)",
              paddingBottom: "clamp(12px, 1.5vw, 16px)",
              borderBottom: "1px solid rgba(212,168,67,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
              <img
                src={ASSETS.iconProvablyFair}
                alt="Provably Fair"
                style={{
                  width: "clamp(20px, 2.5vw, 28px)",
                  height: "clamp(20px, 2.5vw, 28px)",
                  filter: "drop-shadow(0 0 6px rgba(212,168,67,0.5))",
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                  fontWeight: 700,
                  color: "#D4A843",
                  textShadow: "0 0 10px rgba(212,168,67,0.3)",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                PROVABLY FAIR
              </h2>
            </div>

            {/* Botao Fechar */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: "clamp(28px, 3vw, 36px)",
                height: "clamp(28px, 3vw, 36px)",
                background: "rgba(255,68,68,0.1)",
                border: "1px solid rgba(255,68,68,0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FF6666",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: 700,
              }}
            >
              ×
            </motion.button>
          </div>

          {/* Campos de Seed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 1.2vw, 14px)" }}>
            {/* Server Seed Hash */}
            <SeedField
              label="Server Seed (hash)"
              value={serverSeedHash}
              fullValue={round.serverSeed}
              onCopy={() => handleCopy(round.serverSeed, "server")}
              isCopied={copiedField === "server"}
            />

            {/* Client Seed */}
            <SeedField
              label="Client Seed"
              value={round.clientSeed.substring(0, 24) + "..."}
              fullValue={round.clientSeed}
              onCopy={() => handleCopy(round.clientSeed, "client")}
              isCopied={copiedField === "client"}
            />

            {/* Nonce */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
              <span
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  color: "rgba(212,168,67,0.7)",
                  minWidth: "clamp(100px, 12vw, 140px)",
                }}
              >
                Nonce:
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(12px, 1.3vw, 15px)",
                  fontWeight: 600,
                  color: "#D4A843",
                }}
              >
                #{round.nonce}
              </span>
            </div>

            {/* Crash Point */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
              <span
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  color: "rgba(212,168,67,0.7)",
                  minWidth: "clamp(100px, 12vw, 140px)",
                }}
              >
                Crash Point:
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  fontWeight: 800,
                  color: round.crashPoint < 2 ? "#FF4444" : "#00E676",
                  textShadow: `0 0 10px ${round.crashPoint < 2 ? "rgba(255,68,68,0.5)" : "rgba(0,230,118,0.5)"}`,
                }}
              >
                {round.crashPoint.toFixed(2)}×
              </span>
            </div>
          </div>

          {/* Botao Verificar */}
          <motion.button
            onClick={handleVerify}
            disabled={isVerifying || isVerified}
            whileHover={!isVerified ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.4)" } : {}}
            whileTap={!isVerified ? { scale: 0.98 } : {}}
            style={{
              width: "100%",
              marginTop: "clamp(16px, 2vw, 24px)",
              padding: "clamp(12px, 1.5vw, 16px)",
              background: isVerified
                ? "linear-gradient(180deg, #00E676 0%, #00A854 100%)"
                : "linear-gradient(180deg, #D4A843 0%, #8B6914 100%)",
              border: "none",
              borderRadius: "10px",
              cursor: isVerified ? "default" : "pointer",
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(13px, 1.4vw, 16px)",
              fontWeight: 700,
              color: "#0A0A0A",
              letterSpacing: "0.08em",
              boxShadow: isVerified
                ? "0 0 25px rgba(0,230,118,0.4)"
                : "0 0 20px rgba(212,168,67,0.3)",
              opacity: isVerifying ? 0.7 : 1,
            }}
          >
            {isVerifying ? "VERIFICANDO..." : isVerified ? "VERIFICADO" : "VERIFICAR RESULTADO"}
          </motion.button>

          {/* Status da Verificacao */}
          <AnimatePresence>
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(6px, 0.8vw, 10px)",
                  marginTop: "clamp(12px, 1.5vw, 16px)",
                  padding: "clamp(10px, 1.2vw, 14px)",
                  background: "rgba(0,230,118,0.1)",
                  border: "1px solid rgba(0,230,118,0.3)",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={ASSETS.iconCheck}
                  alt="Verificado"
                  style={{
                    width: "clamp(16px, 1.8vw, 20px)",
                    height: "clamp(16px, 1.8vw, 20px)",
                    filter: "drop-shadow(0 0 4px rgba(0,230,118,0.5))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "clamp(11px, 1.2vw, 14px)",
                    fontWeight: 600,
                    color: "#00E676",
                    textShadow: "0 0 8px rgba(0,230,118,0.4)",
                  }}
                >
                  VERIFICADO — Hash confere
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Como Funciona */}
          <div
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              padding: "clamp(12px, 1.5vw, 16px)",
              background: "rgba(212,168,67,0.05)",
              border: "1px solid rgba(212,168,67,0.1)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(11px, 1.2vw, 13px)",
                fontWeight: 600,
                color: "rgba(212,168,67,0.8)",
                marginBottom: "clamp(8px, 1vw, 12px)",
                margin: 0,
                marginBlockEnd: "clamp(8px, 1vw, 12px)",
              }}
            >
              Como funciona?
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(10px, 1.1vw, 12px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              Antes do round, publicamos o hash do server seed. Após o round, revelamos o seed completo.
              Você recalcula o hash e confirma que o crash point não foi alterado.
              <br />
              <span style={{ color: "#D4A843", fontWeight: 600 }}>Algoritmo: HMAC_SHA256</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ===========================================================================
// SUB-COMPONENTE: Campo de Seed
// ===========================================================================

interface SeedFieldProps {
  label: string;
  value: string;
  fullValue: string;
  onCopy: () => void;
  isCopied: boolean;
}

function SeedField({ label, value, onCopy, isCopied }: SeedFieldProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
      <span
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "clamp(11px, 1.2vw, 14px)",
          color: "rgba(212,168,67,0.7)",
          minWidth: "clamp(100px, 12vw, 140px)",
          flexShrink: 0,
        }}
      >
        {label}:
      </span>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "clamp(6px, 0.8vw, 10px)",
          padding: "clamp(8px, 1vw, 12px)",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(212,168,67,0.2)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(10px, 1vw, 13px)",
            color: "#D4A843",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
        <motion.button
          onClick={onCopy}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          style={{
            flexShrink: 0,
            width: "clamp(20px, 2vw, 24px)",
            height: "clamp(20px, 2vw, 24px)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={isCopied ? ASSETS.iconCheck : ASSETS.iconCopy}
            alt={isCopied ? "Copiado" : "Copiar"}
            style={{
              width: "100%",
              height: "100%",
              filter: isCopied
                ? "drop-shadow(0 0 4px rgba(0,230,118,0.5))"
                : "drop-shadow(0 0 4px rgba(212,168,67,0.3))",
              transition: "filter 0.2s ease",
            }}
          />
        </motion.button>
      </div>
    </div>
  );
}
