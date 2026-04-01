"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";
import { useCrashSound } from "./useCrashSound";
import { CrashCanvas } from "./CrashCanvas";
import { CrashControls } from "./CrashControls";
import { CrashHistory } from "./CrashHistory";
import { CrashBetFeed } from "./CrashBetFeed";
import { CrashProvablyFair } from "./CrashProvablyFair";
import { CrashHistoryPanel } from "./CrashHistoryPanel";

// ═══════════════════════════════════════════════════════════════════════════
// CRASH GAME — Blackout Casino
// Estados: WAITING → BETTING → RISING → CRASHED
// ═══════════════════════════════════════════════════════════════════════════

export type CrashPhase = "WAITING" | "BETTING" | "RISING" | "CRASHED";

export interface CrashBet {
  id: string;
  playerName: string;
  amount: number;
  autoCashout: number | null;
  cashedOut: boolean;
  cashoutMultiplier: number | null;
}

interface CrashRound {
  id: string;
  crashPoint: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

// Paths dos assets
const ASSETS = {
  frameCanvas: "/assets/games/crash/frame-canvas.png",
  starsBg: "/assets/games/crash/stars-bg.png",
  explosion: "/assets/games/crash/explosion.png",
  particlesGold: "/assets/games/crash/particles-gold.png",
  bgCasino: "/assets/shared/ui/bg-casino.png",
  iconGcoin: "/assets/shared/icons/icon-gcoin.png",
  iconHistory: "/assets/shared/icons/icon-history.png",
  iconProvablyFair: "/assets/shared/icons/icon-provably-fair.png",
  iconSoundOn: "/assets/shared/icons/icon-sound-on.png",
  iconSoundOff: "/assets/shared/icons/icon-sound-off.png",
  logoCrash: "/assets/logos-br-para-cards/1.LOGO-BR-CRASH.png",
};

// Configuracoes do jogo
const CONFIG = {
  BETTING_DURATION: 5000, // 5 segundos para apostar
  MIN_BET: 1,
  MAX_BET: 10000,
  HOUSE_EDGE: 0.01, // 1% house edge (RTP 99%)
};

// Gerar crash point (Provably Fair HMAC_SHA256)
function generateCrashPoint(): number {
  // Simulacao simplificada - em producao usa HMAC_SHA256 real
  const random = Math.random();
  // Formula: 99 / (1 - X) onde X eh random [0, 0.99]
  // Isso gera distribuicao com house edge de 1%
  const crashPoint = Math.max(1, Math.floor(100 * (99 / (1 - random * 0.99))) / 100);
  return Math.min(crashPoint, 1000); // Cap em 1000x
}

// Gerar seed aleatorio
function generateSeed(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export default function CrashGame({ onBack }: { onBack: () => void }) {
  const { saldo, setSaldo, lang } = useCasino();
  const sound = useCrashSound();
  
  // Estado do jogo
  const [phase, setPhase] = useState<CrashPhase>("WAITING");
  const [countdown, setCountdown] = useState(5);
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [curvePoints, setCurvePoints] = useState<{ x: number; y: number }[]>([]);
  
  // Estado da aposta do jogador
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  
  // Feed de apostas (outros jogadores simulados)
  const [bets, setBets] = useState<CrashBet[]>([]);
  
  // Historico de rounds
  const [history, setHistory] = useState<CrashRound[]>([]);
  
  // Som
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Modais
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const [selectedRound, setSelectedRound] = useState<CrashRound | null>(null);
  
  // Resultados do jogador por round
  const [playerResults] = useState<Map<string, { status: "won" | "lost" | "none"; amount: number; cashoutMultiplier?: number }>>(new Map());
  
  // Refs para animacao
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<CrashPhase>("WAITING");
  
  // Manter phaseRef sincronizado
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ══════════════════════════════════════════════════════════════════════════
  // GAME LOOP
  // ══════════════════════════════════════════════════════════════════════════
  
  const startNewRound = useCallback(() => {
    // Reset estado
    setMultiplier(1.00);
    setCurvePoints([]);
    setHasPlacedBet(false);
    setHasCashedOut(false);
    setCashoutMultiplier(null);
    setBets([]);
    
    // Gerar crash point para este round
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    
    // Iniciar fase WAITING com countdown
    setPhase("WAITING");
    setCountdown(5);
    
    if (soundEnabled) sound.playCountdown();
    
    // Countdown de 5 segundos
    let count = 5;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        setPhase("BETTING");
        
        // Fase BETTING por 5 segundos
        setTimeout(() => {
          if (phaseRef.current === "BETTING") {
            startRising(newCrashPoint);
          }
        }, CONFIG.BETTING_DURATION);
      }
    }, 1000);
  }, [soundEnabled, sound]);

  const startRising = useCallback((targetCrashPoint: number) => {
    setPhase("RISING");
    startTimeRef.current = performance.now();
    
    if (soundEnabled) sound.startRisingTone();
    
    // Simular outras apostas
    const fakeBets: CrashBet[] = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
      id: `bot-${i}`,
      playerName: `Player${Math.floor(Math.random() * 999)}`,
      amount: Math.floor(Math.random() * 500) + 10,
      autoCashout: Math.random() > 0.5 ? Math.floor(Math.random() * 300 + 120) / 100 : null,
      cashedOut: false,
      cashoutMultiplier: null,
    }));
    setBets(prev => [...prev, ...fakeBets]);
    
    // Loop de animacao
    const animate = () => {
      if (phaseRef.current !== "RISING") return;
      
      const elapsed = performance.now() - startTimeRef.current;
      // Formula exponencial: mult = e^(t * k) onde k controla velocidade
      // Ajustado para dar ~10s ate 10x
      const k = 0.00023;
      const newMultiplier = Math.exp(elapsed * k);
      
      setMultiplier(newMultiplier);
      
      // Atualizar pontos da curva
      setCurvePoints(prev => {
        const newPoint = {
          x: elapsed / 50, // Normalizado para largura do canvas
          y: Math.log(newMultiplier) * 50, // Escala logaritmica
        };
        return [...prev.slice(-200), newPoint]; // Manter ultimos 200 pontos
      });
      
      // Atualizar tom ascendente
      if (soundEnabled) {
        sound.updateRisingTone(newMultiplier);
      }
      
      // Auto-cashout do jogador
      if (hasPlacedBet && !hasCashedOut && autoCashout && newMultiplier >= autoCashout) {
        handleCashout(newMultiplier);
      }
      
      // Auto-cashout dos bots
      setBets(prev => prev.map(bet => {
        if (!bet.cashedOut && bet.autoCashout && newMultiplier >= bet.autoCashout) {
          return { ...bet, cashedOut: true, cashoutMultiplier: bet.autoCashout };
        }
        return bet;
      }));
      
      // Verificar crash
      if (newMultiplier >= targetCrashPoint) {
        triggerCrash(targetCrashPoint);
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [soundEnabled, sound, hasPlacedBet, hasCashedOut, autoCashout]);

  const triggerCrash = useCallback((finalMultiplier: number) => {
    cancelAnimationFrame(animationRef.current);
    setPhase("CRASHED");
    setMultiplier(finalMultiplier);
    
    if (soundEnabled) {
      sound.stopRisingTone();
      sound.playCrash();
    }
    
    // Adicionar ao historico
    const newRound: CrashRound = {
      id: Date.now().toString(),
      crashPoint: finalMultiplier,
      serverSeed: generateSeed(),
      clientSeed: generateSeed(),
      nonce: history.length + 1,
    };
    setHistory(prev => [newRound, ...prev.slice(0, 49)]);
    
    // Marcar bots que nao sacaram como perdedores
    setBets(prev => prev.map(bet => {
      if (!bet.cashedOut) {
        return { ...bet, cashedOut: false, cashoutMultiplier: 0 };
      }
      return bet;
    }));
    
    // Resultado do jogador
    if (hasPlacedBet && !hasCashedOut) {
      // Perdeu
      if (soundEnabled) sound.playLose();
    }
    
    // Proximo round em 3 segundos
    setTimeout(() => {
      startNewRound();
    }, 3000);
  }, [soundEnabled, sound, history.length, hasPlacedBet, hasCashedOut, startNewRound]);

  // ══════════════════════════════════════════════════════════════════════════
  // ACOES DO JOGADOR
  // ══════════════════════════════════════════════════════════════════════════
  
  const handlePlaceBet = useCallback(() => {
    if (phase !== "BETTING" || hasPlacedBet) return;
    if (betAmount > saldo || betAmount < CONFIG.MIN_BET) return;
    
    setSaldo(saldo - betAmount);
    setHasPlacedBet(true);
    
    if (soundEnabled) sound.playBet();
    
    // Adicionar aposta do jogador ao feed
    const playerBet: CrashBet = {
      id: "player",
      playerName: lang === "br" ? "VOCÊ" : "YOU",
      amount: betAmount,
      autoCashout,
      cashedOut: false,
      cashoutMultiplier: null,
    };
    setBets(prev => [playerBet, ...prev]);
  }, [phase, hasPlacedBet, betAmount, saldo, autoCashout, soundEnabled, sound, lang, setSaldo]);

  const handleCashout = useCallback((currentMultiplier?: number) => {
    if (phase !== "RISING" || !hasPlacedBet || hasCashedOut) return;
    
    const mult = currentMultiplier || multiplier;
    const winnings = Math.floor(betAmount * mult * 100) / 100;
    
    setSaldo(saldo + winnings);
    setHasCashedOut(true);
    setCashoutMultiplier(mult);
    
    if (soundEnabled) sound.playCashout();
    
    // Atualizar aposta do jogador no feed
    setBets(prev => prev.map(bet => {
      if (bet.id === "player") {
        return { ...bet, cashedOut: true, cashoutMultiplier: mult };
      }
      return bet;
    }));
  }, [phase, hasPlacedBet, hasCashedOut, multiplier, betAmount, saldo, soundEnabled, sound, setSaldo]);

  // ══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    // Gerar historico inicial
    const initialHistory: CrashRound[] = Array.from({ length: 20 }, (_, i) => ({
      id: `init-${i}`,
      crashPoint: generateCrashPoint(),
      serverSeed: generateSeed(),
      clientSeed: generateSeed(),
      nonce: 20 - i,
    }));
    setHistory(initialHistory);
    
    // Iniciar primeiro round
    startNewRound();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      sound.cleanup();
    };
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-cinzel)",
        backgroundImage: `url("${ASSETS.bgCasino}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Vinheta escura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER — Logo, Saldo, Controles
          ═══════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(8px, 1.5vw, 16px) clamp(12px, 2vw, 24px)",
          borderBottom: "1px solid rgba(212,168,67,0.2)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      >
        {/* Botao Voltar */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05, borderColor: "rgba(212,168,67,0.8)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 0.8vw, 10px)",
            padding: "clamp(6px, 1vw, 12px) clamp(12px, 1.5vw, 20px)",
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(212,168,67,0.4)",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#D4A843",
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(10px, 1vw, 14px)",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: "clamp(14px, 1.2vw, 18px)" }}>←</span>
          {lang === "br" ? "VOLTAR" : "BACK"}
        </motion.button>

        {/* Logo Crash */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 1vw, 12px)",
          }}
        >
          <img
            src={ASSETS.logoCrash}
            alt="Crash"
            style={{
              height: "clamp(30px, 4vw, 50px)",
              filter: "drop-shadow(0 0 10px rgba(212,168,67,0.5))",
            }}
          />
        </div>

        {/* Saldo + Botoes */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 16px)" }}>
          {/* Botao Historico */}
          <motion.button
            onClick={() => setShowHistoryPanel(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "clamp(32px, 3vw, 44px)",
              height: "clamp(32px, 3vw, 44px)",
              borderRadius: "50%",
              background: "rgba(10,10,10,0.8)",
              border: "1px solid rgba(212,168,67,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            title={lang === "br" ? "Histórico" : "History"}
          >
            <img
              src={ASSETS.iconHistory}
              alt="Histórico"
              style={{ width: "60%", height: "60%" }}
            />
          </motion.button>

          {/* Botao Provably Fair */}
          <motion.button
            onClick={() => {
              if (history.length > 0) {
                setSelectedRound(history[0]);
                setShowProvablyFair(true);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "clamp(32px, 3vw, 44px)",
              height: "clamp(32px, 3vw, 44px)",
              borderRadius: "50%",
              background: "rgba(10,10,10,0.8)",
              border: "1px solid rgba(212,168,67,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            title="Provably Fair"
          >
            <img
              src={ASSETS.iconProvablyFair}
              alt="Provably Fair"
              style={{ width: "60%", height: "60%" }}
            />
          </motion.button>

          {/* Toggle Som */}
          <motion.button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) sound.playClick();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "clamp(32px, 3vw, 44px)",
              height: "clamp(32px, 3vw, 44px)",
              borderRadius: "50%",
              background: "rgba(10,10,10,0.8)",
              border: "1px solid rgba(212,168,67,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <img
              src={soundEnabled ? ASSETS.iconSoundOn : ASSETS.iconSoundOff}
              alt={soundEnabled ? "Som ligado" : "Som desligado"}
              style={{
                width: "60%",
                height: "60%",
                opacity: soundEnabled ? 1 : 0.5,
              }}
            />
          </motion.button>

          {/* Saldo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(6px, 0.8vw, 10px)",
              padding: "clamp(6px, 1vw, 10px) clamp(12px, 1.5vw, 18px)",
              background: "linear-gradient(135deg, rgba(10,18,8,0.95), rgba(5,12,3,0.98))",
              border: "1px solid rgba(212,168,67,0.5)",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(212,168,67,0.15), inset 0 0 10px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={ASSETS.iconGcoin}
              alt="GCoin"
              style={{
                width: "clamp(16px, 1.8vw, 24px)",
                height: "clamp(16px, 1.8vw, 24px)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(12px, 1.4vw, 18px)",
                fontWeight: 700,
                color: "#00E676",
                textShadow: "0 0 10px rgba(0,230,118,0.5)",
                letterSpacing: "1px",
              }}
            >
              {saldo.toLocaleString("pt-BR")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(8px, 0.8vw, 11px)",
                color: "rgba(212,168,67,0.7)",
                fontWeight: 600,
                letterSpacing: "1.5px",
              }}
            >
              GC
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN — Canvas + Controles
          ═══════════════════════════════════════════════════════════════════ */}
      <main
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr clamp(200px, 22vw, 320px)",
          gap: "clamp(8px, 1vw, 16px)",
          padding: "clamp(8px, 1.5vw, 16px)",
          minHeight: 0,
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            AREA DO CANVAS — Curva + Multiplicador
            ═══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(6px, 0.8vw, 12px)",
          }}
        >
          {/* Historico de rounds (badges) */}
          <CrashHistory history={history} />

          {/* Canvas Container com Frame */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Frame dourado art-deco */}
            <img
              src={ASSETS.frameCanvas}
              alt=""
              style={{
                position: "absolute",
                inset: "-2%",
                width: "104%",
                height: "104%",
                objectFit: "fill",
                pointerEvents: "none",
                zIndex: 10,
                filter: "drop-shadow(0 0 20px rgba(212,168,67,0.3))",
              }}
            />

            {/* Canvas da curva */}
            <CrashCanvas
              phase={phase}
              multiplier={multiplier}
              curvePoints={curvePoints}
              countdown={countdown}
              crashPoint={phase === "CRASHED" ? crashPoint : undefined}
            />

            {/* Overlay de resultado (vitoria/derrota) */}
            <AnimatePresence>
              {phase === "CRASHED" && hasPlacedBet && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: hasCashedOut 
                      ? "radial-gradient(ellipse at center, rgba(0,230,118,0.15) 0%, transparent 70%)"
                      : "radial-gradient(ellipse at center, rgba(255,68,68,0.15) 0%, transparent 70%)",
                    zIndex: 15,
                  }}
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    style={{
                      textAlign: "center",
                      padding: "clamp(16px, 2vw, 32px)",
                      background: "rgba(5,5,5,0.9)",
                      border: `2px solid ${hasCashedOut ? "rgba(0,230,118,0.6)" : "rgba(255,68,68,0.6)"}`,
                      borderRadius: "16px",
                      boxShadow: hasCashedOut
                        ? "0 0 40px rgba(0,230,118,0.3)"
                        : "0 0 40px rgba(255,68,68,0.3)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        fontSize: "clamp(14px, 1.8vw, 24px)",
                        fontWeight: 700,
                        color: hasCashedOut ? "#00E676" : "#FF4444",
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                        marginBottom: "clamp(8px, 1vw, 16px)",
                        textShadow: hasCashedOut
                          ? "0 0 20px rgba(0,230,118,0.8)"
                          : "0 0 20px rgba(255,68,68,0.8)",
                      }}
                    >
                      {hasCashedOut 
                        ? (lang === "br" ? "VOCÊ SACOU!" : "YOU CASHED OUT!")
                        : (lang === "br" ? "VOCÊ PERDEU!" : "YOU LOST!")
                      }
                    </div>
                    {hasCashedOut && cashoutMultiplier && (
                      <>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(24px, 4vw, 48px)",
                            fontWeight: 800,
                            color: "#00E676",
                            textShadow: "0 0 30px rgba(0,230,118,0.8), 0 0 60px rgba(0,230,118,0.4)",
                          }}
                        >
                          {cashoutMultiplier.toFixed(2)}x
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(14px, 1.6vw, 22px)",
                            fontWeight: 600,
                            color: "#FFD700",
                            marginTop: "clamp(8px, 1vw, 12px)",
                          }}
                        >
                          +{(betAmount * cashoutMultiplier).toFixed(2)} GC
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SIDEBAR — Controles + Feed de Apostas
            ═══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(8px, 1vw, 12px)",
          }}
        >
          {/* Controles de aposta */}
          <CrashControls
            phase={phase}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            autoCashout={autoCashout}
            setAutoCashout={setAutoCashout}
            hasPlacedBet={hasPlacedBet}
            hasCashedOut={hasCashedOut}
            multiplier={multiplier}
            saldo={saldo}
            onPlaceBet={handlePlaceBet}
            onCashout={handleCashout}
            lang={lang}
          />

          {/* Feed de apostas */}
          <CrashBetFeed bets={bets} lang={lang} />
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAIS
          ═══════════════════════════════════════════════════════════════════ */}
      
      {/* History Panel (Drawer) */}
      <AnimatePresence>
        {showHistoryPanel && (
          <CrashHistoryPanel
            history={history}
            playerResults={playerResults}
            onClose={() => setShowHistoryPanel(false)}
            onOpenPF={(round) => {
              setSelectedRound(round);
              setShowProvablyFair(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Provably Fair Modal */}
      <AnimatePresence>
        {showProvablyFair && selectedRound && (
          <CrashProvablyFair
            round={selectedRound}
            onClose={() => {
              setShowProvablyFair(false);
              setSelectedRound(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
