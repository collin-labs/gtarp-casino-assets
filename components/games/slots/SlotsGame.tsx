"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";

// ===========================================================================
// SLOTS GAME — Blackout Casino
// Telas 1-4: ModeSelect, VideoIdle, Spinning/Tumble, FSTrigger
// ===========================================================================

export type SlotsScreen = 
  | "modeSelect" 
  | "videoIdle" 
  | "spinning" 
  | "fsTrigger"
  | "fsPlaying";

export type SlotMode = "classic" | "video";

// Paths dos assets
const ASSETS = {
  bgCasino: "/assets/shared/ui/bg-casino.png",
  iconGcoin: "/assets/shared/icons/icon-gcoin.png",
  iconInfo: "/assets/shared/icons/icon-info.png",
  iconHistory: "/assets/shared/icons/icon-history.png",
  iconSoundOn: "/assets/shared/icons/icon-sound-on.png",
  iconSoundOff: "/assets/shared/icons/icon-sound-off.png",
  logoSlotsBr: "/assets/logos-br-para-cards/2.LOGO-BR-SLOT-MACHINE.png",
  logoSlotsEn: "/assets/logos-in-para-cards/2.LOGO-IN-SLOT-MACHINE.png",
};

// Simbolos do Video Slot (11 simbolos)
const VIDEO_SYMBOLS = [
  { id: "crown", path: "/assets/games/slots/symbols/crown.png", tier: "premium", color: "#FFD700" },
  { id: "ring", path: "/assets/games/slots/symbols/ring.png", tier: "premium", color: "#D4A843" },
  { id: "hourglass", path: "/assets/games/slots/symbols/hourglass.png", tier: "premium", color: "#CB9B51" },
  { id: "chalice", path: "/assets/games/slots/symbols/chalice.png", tier: "premium", color: "#8B6914" },
  { id: "ruby", path: "/assets/games/slots/symbols/ruby.png", tier: "gem", color: "#FF1744" },
  { id: "sapphire", path: "/assets/games/slots/symbols/sapphire.png", tier: "gem", color: "#1E88E5" },
  { id: "emerald", path: "/assets/games/slots/symbols/emerald.png", tier: "gem", color: "#43A047" },
  { id: "amethyst", path: "/assets/games/slots/symbols/amethyst.png", tier: "gem", color: "#8E24AA" },
  { id: "topaz", path: "/assets/games/slots/symbols/topaz.png", tier: "gem", color: "#FF8F00" },
  { id: "scatter", path: "/assets/games/slots/symbols/scatter.png", tier: "special", color: "#FFD700" },
  { id: "multiplier_orb", path: "/assets/games/slots/symbols/multiplier_orb.png", tier: "special", color: "#FFD700" },
];

// Simbolos regulares (sem scatter/orb para grid normal)
const REGULAR_SYMBOLS = VIDEO_SYMBOLS.filter(s => s.tier !== "special");

// Textos bilingues
const TEXTS = {
  back: { br: "VOLTAR", en: "BACK" },
  backTooltip: { br: "Retorna ao cassino", en: "Return to casino" },
  balanceTooltip: { br: "Seu saldo atual de GCoins", en: "Your current GCoin balance" },
  slotMachine: { br: "SLOT MACHINE", en: "SLOT MACHINE" },
  chooseMode: { br: "Escolha seu modo de jogo", en: "Choose your game mode" },
  classic: { br: "CLASSIC", en: "CLASSIC" },
  video: { br: "VIDEO", en: "VIDEO" },
  classicDesc: { br: "3 rolos, rápido e nostálgico", en: "3 reels, fast and simple" },
  videoDesc: { br: "Grid 6x5, Scatter Pays + Tumble", en: "Grid 6x5, Scatter Pays + Tumble" },
  play: { br: "JOGAR", en: "PLAY" },
  playClassicTooltip: { br: "Iniciar modo Classic", en: "Start Classic mode" },
  playVideoTooltip: { br: "Iniciar modo Video", en: "Start Video mode" },
  jackpot: { br: "JACKPOT", en: "JACKPOT" },
  jackpotTooltip: { br: "Jackpot progressivo — 1.5% de cada aposta alimenta o prêmio", en: "Progressive jackpot — 1.5% of every bet feeds the prize" },
  bet: { br: "APOSTA", en: "BET" },
  win: { br: "GANHO", en: "WIN" },
  spin: { br: "GIRAR", en: "SPIN" },
  spinTooltip: { br: "Girar os rolos! Custo: valor da aposta atual", en: "Spin the reels! Cost: current bet value" },
  ante: { br: "ANTE", en: "ANTE" },
  anteTooltip: { br: "Ativa: +25% no custo do spin, dobra chance de Free Spins", en: "Active: +25% spin cost, doubles Free Spins chance" },
  turbo: { br: "TURBO", en: "TURBO" },
  auto: { br: "AUTO", en: "AUTO" },
  tumble: { br: "TUMBLE", en: "TUMBLE" },
  tumbleTooltip: { br: "Número de cascatas consecutivas neste spin", en: "Number of consecutive cascades in this spin" },
  freeSpins: { br: "FREE SPINS!", en: "FREE SPINS!" },
  rounds: { br: "RODADAS", en: "ROUNDS" },
  start: { br: "COMEÇAR", en: "START" },
  bonus: { br: "BONUS", en: "BONUS" },
};

// Grid mockado com simbolos aleatorios
function generateMockGrid(): { id: string; path: string; tier: string; color: string; uniqueKey: string }[][] {
  const grid: { id: string; path: string; tier: string; color: string; uniqueKey: string }[][] = [];
  for (let row = 0; row < 5; row++) {
    const rowSymbols: { id: string; path: string; tier: string; color: string; uniqueKey: string }[] = [];
    for (let col = 0; col < 6; col++) {
      const symbol = REGULAR_SYMBOLS[Math.floor(Math.random() * REGULAR_SYMBOLS.length)];
      rowSymbols.push({
        ...symbol,
        uniqueKey: `${row}-${col}-${Date.now()}-${Math.random()}`,
      });
    }
    grid.push(rowSymbols);
  }
  return grid;
}

// Gerar posicoes de winning aleatorias (para demo)
function generateWinningPositions(): Set<string> {
  const positions = new Set<string>();
  const symbol = REGULAR_SYMBOLS[Math.floor(Math.random() * REGULAR_SYMBOLS.length)];
  const count = Math.floor(Math.random() * 4) + 8; // 8-11 matches
  
  while (positions.size < count) {
    const row = Math.floor(Math.random() * 5);
    const col = Math.floor(Math.random() * 6);
    positions.add(`${row}-${col}`);
  }
  return positions;
}

// Props do componente
interface SlotsGameProps {
  onBack: () => void;
  lang?: "br" | "en";
  playerId?: string;
  initialBalance?: number;
}

export default function SlotsGame({ 
  onBack, 
  lang: propLang,
  playerId = "player1",
  initialBalance,
}: SlotsGameProps) {
  const { saldo, setSaldo, lang: contextLang } = useCasino();
  const lang = propLang || contextLang || "br";
  
  // Estados principais
  const [screen, setScreen] = useState<SlotsScreen>("modeSelect");
  const [mode, setMode] = useState<SlotMode | null>(null);
  const [grid, setGrid] = useState<ReturnType<typeof generateMockGrid>>([]);
  const [winningPositions, setWinningPositions] = useState<Set<string>>(new Set());
  const [isSpinning, setIsSpinning] = useState(false);
  const [tumbleCount, setTumbleCount] = useState(0);
  const [showWinHighlight, setShowWinHighlight] = useState(false);
  
  // Estados de aposta
  const [bet, setBet] = useState(10);
  const [currentWin, setCurrentWin] = useState(0);
  const [jackpotPool, setJackpotPool] = useState(47350);
  const [anteBet, setAnteBet] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(0);
  
  // Free Spins
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [freeSpinsTotal, setFreeSpinsTotal] = useState(0);
  const [fsMultiplier, setFsMultiplier] = useState(1);
  const [fsTotalWin, setFsTotalWin] = useState(0);
  
  // Refs
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Inicializar grid
  useEffect(() => {
    setGrid(generateMockGrid());
  }, []);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  
  const handleModeSelect = useCallback((selectedMode: SlotMode) => {
    setMode(selectedMode);
    if (selectedMode === "video") {
      setScreen("videoIdle");
      setGrid(generateMockGrid());
    }
    // Classic mode seria implementado na Parte 2
  }, []);
  
  const handleSpin = useCallback(() => {
    if (isSpinning || bet > saldo) return;
    
    // Deduzir aposta
    const totalBet = anteBet ? Math.floor(bet * 1.25) : bet;
    setSaldo(saldo - totalBet);
    
    // Contribuir para jackpot (1.5%)
    setJackpotPool(prev => prev + Math.floor(totalBet * 0.015));
    
    setIsSpinning(true);
    setScreen("spinning");
    setCurrentWin(0);
    setTumbleCount(0);
    setShowWinHighlight(false);
    
    // Simular spin com stagger por coluna
    const spinDuration = turboMode ? 800 : 1600;
    
    spinTimeoutRef.current = setTimeout(() => {
      // Gerar novo grid
      const newGrid = generateMockGrid();
      setGrid(newGrid);
      
      // Simular chance de win (70% para demo)
      const hasWin = Math.random() < 0.7;
      
      if (hasWin) {
        // Gerar posicoes vencedoras
        const positions = generateWinningPositions();
        setWinningPositions(positions);
        setShowWinHighlight(true);
        setTumbleCount(1);
        
        // Calcular win
        const winAmount = Math.floor(bet * (1 + Math.random() * 3));
        setCurrentWin(winAmount);
        
        // Simular tumble
        setTimeout(() => {
          // Chance de FS trigger (10% quando win, 20% com ante)
          const fsTriggerChance = anteBet ? 0.2 : 0.1;
          if (Math.random() < fsTriggerChance) {
            setScreen("fsTrigger");
            setFreeSpinsTotal(10);
            setFreeSpinsRemaining(10);
            setFsMultiplier(1);
            setFsTotalWin(0);
          } else {
            // Continuar tumble ou finalizar
            setTimeout(() => {
              setShowWinHighlight(false);
              setWinningPositions(new Set());
              setSaldo(prev => prev + winAmount);
              setIsSpinning(false);
              setScreen("videoIdle");
            }, turboMode ? 400 : 800);
          }
        }, turboMode ? 600 : 1200);
      } else {
        // Sem win
        setTimeout(() => {
          setIsSpinning(false);
          setScreen("videoIdle");
        }, turboMode ? 200 : 400);
      }
    }, spinDuration);
  }, [isSpinning, bet, saldo, anteBet, turboMode, setSaldo]);
  
  const handleFSStart = useCallback(() => {
    setScreen("fsPlaying");
    // FS Playing seria implementado na Parte 2
  }, []);
  
  const handleBetChange = useCallback((action: "min" | "half" | "double" | "max") => {
    const MIN_BET = 1;
    const MAX_BET = 1000;
    
    switch (action) {
      case "min":
        setBet(MIN_BET);
        break;
      case "half":
        setBet(Math.max(MIN_BET, Math.floor(bet / 2)));
        break;
      case "double":
        setBet(Math.min(MAX_BET, bet * 2));
        break;
      case "max":
        setBet(Math.min(MAX_BET, saldo));
        break;
    }
  }, [bet, saldo]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  
  const t = (key: keyof typeof TEXTS) => TEXTS[key][lang];

  // ==========================================================================
  // TELA 1 — MODE SELECT
  // ==========================================================================
  
  const renderModeSelect = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "clamp(16px, 3vw, 32px)",
        padding: "clamp(16px, 3vw, 32px)",
      }}
    >
      {/* Titulo */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: "clamp(24px, 4.5vw, 48px)",
            textTransform: "uppercase",
            letterSpacing: "4px",
            color: "#D4A843",
            textShadow: "0 0 25px rgba(212,168,67,0.5), 0 2px 10px rgba(0,0,0,1)",
            margin: 0,
          }}
        >
          {t("slotMachine")}
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(10px, 1.3vw, 16px)",
            color: "#A8A8A8",
            fontStyle: "italic",
            marginTop: "clamp(4px, 0.5vw, 8px)",
          }}
        >
          {t("chooseMode")}
        </p>
      </div>
      
      {/* Mode Cards */}
      <div
        style={{
          display: "flex",
          gap: "clamp(16px, 3vw, 32px)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Classic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect("classic")}
          style={{
            width: "clamp(180px, 28vw, 280px)",
            padding: "clamp(16px, 2.5vw, 32px)",
            background: "rgba(5,5,5,0.9)",
            border: "1.5px solid rgba(212,168,67,0.2)",
            borderRadius: "14px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(8px, 1.2vw, 16px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            transition: "border-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.2)";
          }}
        >
          {/* Icone */}
          <div
            style={{
              width: "clamp(48px, 7vw, 72px)",
              height: "clamp(48px, 7vw, 72px)",
              borderRadius: "12px",
              background: "rgba(212,168,67,0.08)",
              border: "1px solid rgba(212,168,67,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(24px, 3.5vw, 36px)",
            }}
          >
            🎰
          </div>
          
          {/* Nome */}
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 1.8vw, 20px)",
              color: "#D4A843",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {t("classic")}
          </span>
          
          {/* Descricao */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "#A8A8A8",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {t("classicDesc")}
          </span>
          
          {/* Botao Jogar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("playClassicTooltip")}
            style={{
              width: "100%",
              padding: "clamp(8px, 1vw, 12px) clamp(16px, 2.5vw, 28px)",
              background: "linear-gradient(180deg, #00C853 0%, #004D25 100%)",
              border: "1.5px solid rgba(0,230,118,0.3)",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(10px, 1.3vw, 14px)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            {t("play")}
          </motion.button>
        </motion.div>
        
        {/* Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect("video")}
          style={{
            width: "clamp(180px, 28vw, 280px)",
            padding: "clamp(16px, 2.5vw, 32px)",
            background: "rgba(5,5,5,0.9)",
            border: "1.5px solid rgba(212,168,67,0.2)",
            borderRadius: "14px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(8px, 1.2vw, 16px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            transition: "border-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.2)";
          }}
        >
          {/* Icone */}
          <div
            style={{
              width: "clamp(48px, 7vw, 72px)",
              height: "clamp(48px, 7vw, 72px)",
              borderRadius: "12px",
              background: "rgba(212,168,67,0.08)",
              border: "1px solid rgba(212,168,67,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(24px, 3.5vw, 36px)",
            }}
          >
            🎲
          </div>
          
          {/* Nome */}
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 1.8vw, 20px)",
              color: "#D4A843",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {t("video")}
          </span>
          
          {/* Descricao */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "#A8A8A8",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {t("videoDesc")}
          </span>
          
          {/* Botao Jogar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("playVideoTooltip")}
            style={{
              width: "100%",
              padding: "clamp(8px, 1vw, 12px) clamp(16px, 2.5vw, 28px)",
              background: "linear-gradient(180deg, #00C853 0%, #004D25 100%)",
              border: "1.5px solid rgba(0,230,118,0.3)",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(10px, 1.3vw, 14px)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            {t("play")}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );

  // ==========================================================================
  // TELA 2/3 — VIDEO SLOT (IDLE / SPINNING)
  // ==========================================================================
  
  const renderVideoSlot = () => {
    const isFS = screen === "fsPlaying";
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Header do jogo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1.5vw, 16px)",
            borderBottom: "1px solid rgba(212,168,67,0.1)",
            flexShrink: 0,
            zIndex: 5,
          }}
        >
          {/* Titulo */}
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 2vw, 22px)",
              color: "#D4A843",
              textTransform: "uppercase",
              letterSpacing: "3px",
              textShadow: "0 0 12px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {t("slotMachine")}
          </span>
          
          {/* Jackpot */}
          <div
            title={t("jackpotTooltip")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 0.5vw, 8px)",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "clamp(9px, 1vw, 12px)",
                color: "#A8A8A8",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {t("jackpot")}:
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(11px, 1.4vw, 16px)",
                color: "#FFD700",
                textShadow: "0 0 8px rgba(255,215,0,0.4)",
              }}
            >
              GC {jackpotPool.toLocaleString("pt-BR")}
            </span>
          </div>
          
          {/* Saldo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 0.5vw, 6px)",
            }}
          >
            <img
              src={ASSETS.iconGcoin}
              alt="GCoin"
              style={{
                width: "clamp(14px, 1.5vw, 20px)",
                height: "clamp(14px, 1.5vw, 20px)",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(12px, 1.6vw, 18px)",
                color: "#00E676",
                textShadow: "0 0 8px rgba(0,230,118,0.4)",
              }}
            >
              {saldo.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
        
        {/* Area do Grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(8px, 1vw, 16px)",
            minHeight: 0,
          }}
        >
          {/* Frame Dourado */}
          <div
            style={{
              position: "relative",
              margin: "clamp(4px, 0.8vw, 8px) auto",
              padding: "clamp(6px, 1vw, 12px)",
              border: isFS ? "2px solid #FFD700" : "2px solid #D4A843",
              outline: isFS ? "3px solid rgba(255,215,0,0.25)" : "3px solid rgba(212,168,67,0.15)",
              outlineOffset: "4px",
              borderRadius: "18px",
              boxShadow: isFS
                ? "0 0 40px rgba(255,215,0,0.12), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)"
                : "0 0 30px rgba(212,168,67,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.4)",
              background: "linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)",
              width: "clamp(300px, 70vw, 600px)",
              maxHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.5s ease",
            }}
          >
            {/* Tumble Badge */}
            <AnimatePresence>
              {tumbleCount > 0 && (
                <motion.div
                  key={tumbleCount}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  title={t("tumbleTooltip")}
                  style={{
                    position: "absolute",
                    top: "clamp(4px, 0.5vw, 8px)",
                    right: "clamp(4px, 0.5vw, 8px)",
                    background: "rgba(0,230,118,0.1)",
                    border: "1px solid rgba(0,230,118,0.3)",
                    borderRadius: "6px",
                    padding: "clamp(2px, 0.3vw, 4px) clamp(6px, 0.8vw, 10px)",
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    fontSize: "clamp(9px, 1.1vw, 13px)",
                    color: "#00E676",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    zIndex: 10,
                  }}
                >
                  {t("tumble")} x{tumbleCount}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Grid 6x5 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridTemplateRows: "repeat(5, 1fr)",
                gap: "clamp(3px, 0.4vw, 6px)",
                width: "100%",
                aspectRatio: "6 / 5",
              }}
            >
              <AnimatePresence mode="popLayout">
                {grid.map((row, rowIndex) =>
                  row.map((symbol, colIndex) => {
                    const posKey = `${rowIndex}-${colIndex}`;
                    const isWinning = winningPositions.has(posKey);
                    const isDimmed = showWinHighlight && !isWinning;
                    const isScatter = symbol.id === "scatter";
                    
                    return (
                      <motion.div
                        key={symbol.uniqueKey}
                        layout
                        initial={{ opacity: 0, y: -60, scale: 0.8 }}
                        animate={{
                          opacity: isDimmed ? 0.3 : 1,
                          y: 0,
                          scale: isWinning ? 1.05 : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.2 } }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                          mass: 0.8,
                          delay: isSpinning ? colIndex * 0.15 : 0,
                        }}
                        style={{
                          aspectRatio: "1",
                          borderRadius: "8px",
                          background: isScatter
                            ? "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)"
                            : "rgba(255,255,255,0.03)",
                          border: isScatter
                            ? "2px solid rgba(255,215,0,0.4)"
                            : isWinning
                            ? `1.5px solid ${symbol.color}80`
                            : "1px solid rgba(255,255,255,0.04)",
                          boxShadow: isWinning
                            ? `0 0 15px ${symbol.color}80`
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transition: "opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                      >
                        <img
                          src={symbol.path}
                          alt={symbol.id}
                          style={{
                            width: "80%",
                            height: "80%",
                            objectFit: "contain",
                          }}
                        />
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Win Display */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(4px, 0.5vw, 6px)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "clamp(12px, 1.6vw, 18px)",
              color: currentWin > 0 ? "#00E676" : "#666666",
              textShadow: currentWin > 0 ? "0 0 10px rgba(0,230,118,0.5)" : "none",
              minHeight: "clamp(20px, 2.5vw, 28px)",
              transition: "all 0.3s ease",
            }}
          >
            {t("win")}: {currentWin > 0 ? `${currentWin.toLocaleString("pt-BR")} GC` : "-- GC"}
          </div>
        </div>
        
        {/* Bet Controls Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(4px, 0.5vw, 8px)",
            padding: "clamp(6px, 0.8vw, 12px) clamp(8px, 1.5vw, 16px)",
            background: "rgba(0,0,0,0.6)",
            borderTop: "1px solid rgba(212,168,67,0.15)",
            backdropFilter: "blur(4px)",
            flexShrink: 0,
            zIndex: 5,
            flexWrap: "wrap",
            opacity: isSpinning ? 0.4 : 1,
            pointerEvents: isSpinning ? "none" : "auto",
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Info Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ASSETS.iconInfo}
              alt="Info"
              style={{ width: "20px", height: "20px", opacity: 0.7 }}
            />
          </motion.button>
          
          {/* History Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ASSETS.iconHistory}
              alt="History"
              style={{ width: "20px", height: "20px", opacity: 0.7 }}
            />
          </motion.button>
          
          {/* Separator */}
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          
          {/* Bet Buttons */}
          <motion.button
            onClick={() => handleBetChange("min")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpinning}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            MIN
          </motion.button>
          
          <motion.button
            onClick={() => handleBetChange("half")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpinning}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ÷2
          </motion.button>
          
          {/* Bet Display */}
          <div
            style={{
              padding: "clamp(4px, 0.5vw, 8px) clamp(12px, 1.5vw, 20px)",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(0,230,118,0.3)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 0.5vw, 8px)",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "clamp(8px, 1vw, 11px)",
                color: "#A8A8A8",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {t("bet")}:
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(12px, 1.4vw, 16px)",
                color: "#00E676",
                textShadow: "0 0 6px rgba(0,230,118,0.4)",
              }}
            >
              {bet} GC
            </span>
          </div>
          
          <motion.button
            onClick={() => handleBetChange("double")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpinning}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            x2
          </motion.button>
          
          <motion.button
            onClick={() => handleBetChange("max")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpinning}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            MAX
          </motion.button>
          
          {/* Separator */}
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          
          {/* Ante Toggle */}
          <motion.button
            onClick={() => setAnteBet(!anteBet)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("anteTooltip")}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: anteBet ? "rgba(212,168,67,0.15)" : "rgba(0,0,0,0.3)",
              border: anteBet ? "1px solid rgba(212,168,67,0.3)" : "1px solid rgba(255,255,255,0.05)",
              borderRadius: "6px",
              color: anteBet ? "#D4A843" : "#666666",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {t("ante")}
          </motion.button>
          
          {/* Spin Button */}
          <motion.button
            onClick={handleSpin}
            disabled={isSpinning || bet > saldo}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title={t("spinTooltip")}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: isFS
                ? "linear-gradient(180deg, #FFD700 0%, #8B6914 100%)"
                : "linear-gradient(180deg, #00C853 0%, #004D25 100%)",
              border: isFS
                ? "2px solid rgba(255,215,0,0.6)"
                : "2px solid rgba(0,230,118,0.4)",
              color: isFS ? "#0A0A0A" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isSpinning || bet > saldo ? "not-allowed" : "pointer",
              boxShadow: isFS
                ? "0 0 20px rgba(255,215,0,0.4)"
                : "0 0 15px rgba(0,230,118,0.3)",
              fontSize: "20px",
              fontWeight: 900,
              flexShrink: 0,
              opacity: isSpinning || bet > saldo ? 0.4 : 1,
              transition: "all 0.2s ease",
            }}
          >
            ▶
          </motion.button>
          
          {/* Auto Toggle */}
          <motion.button
            onClick={() => setAutoPlay(autoPlay > 0 ? 0 : 10)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: autoPlay > 0 ? "rgba(0,230,118,0.1)" : "rgba(255,255,255,0.05)",
              border: autoPlay > 0 ? "1px solid rgba(0,230,118,0.3)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: autoPlay > 0 ? "#00E676" : "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.2s ease",
            }}
          >
            {t("auto")}
            {autoPlay > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: "rgba(0,230,118,0.15)",
                  border: "1px solid rgba(0,230,118,0.3)",
                  fontSize: "8px",
                  color: "#00E676",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                }}
              >
                {autoPlay}
              </span>
            )}
          </motion.button>
          
          {/* Turbo Toggle */}
          <motion.button
            onClick={() => setTurboMode(!turboMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px)",
              background: turboMode ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)",
              border: turboMode ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: turboMode ? "#FFD700" : "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {t("turbo")}
          </motion.button>
          
          {/* Separator */}
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          
          {/* Bonus Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              minWidth: "44px",
              minHeight: "44px",
              padding: "clamp(4px, 0.5vw, 6px) clamp(10px, 1.2vw, 16px)",
              background: "linear-gradient(180deg, rgba(212,168,67,0.2) 0%, rgba(139,105,20,0.2) 100%)",
              border: "1px solid rgba(212,168,67,0.4)",
              borderRadius: "6px",
              color: "#D4A843",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(9px, 1.1vw, 12px)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {t("bonus")}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // ==========================================================================
  // TELA 4 — FREE SPINS TRIGGER
  // ==========================================================================
  
  const renderFSTrigger = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(12px, 2vw, 24px)",
      }}
    >
      {/* Titulo FREE SPINS! */}
      <motion.h2
        initial={{ scale: 0, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          fontSize: "clamp(24px, 5vw, 48px)",
          color: "#FFD700",
          textTransform: "uppercase",
          letterSpacing: "4px",
          textShadow: "0 0 25px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)",
          margin: 0,
        }}
      >
        {t("freeSpins")}
      </motion.h2>
      
      {/* Contagem de rodadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: "clamp(16px, 3vw, 28px)",
          color: "#FFFFFF",
        }}
      >
        {freeSpinsTotal} {t("rounds")}
      </motion.div>
      
      {/* Botao Comecar */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        onClick={handleFSStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: "clamp(8px, 1.5vw, 16px)",
          padding: "clamp(12px, 1.5vw, 18px) clamp(32px, 4vw, 56px)",
          background: "linear-gradient(180deg, #00C853 0%, #004D25 100%)",
          border: "2px solid rgba(0,230,118,0.4)",
          borderRadius: "12px",
          color: "#FFFFFF",
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "clamp(12px, 1.6vw, 18px)",
          textTransform: "uppercase",
          letterSpacing: "3px",
          cursor: "pointer",
          minHeight: "44px",
          boxShadow: "0 0 20px rgba(0,230,118,0.3)",
        }}
      >
        {t("start")}
      </motion.button>
    </motion.div>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        backgroundColor: "#0A0A0A",
        backgroundImage: `url('${ASSETS.bgCasino}'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)`,
        backgroundSize: "cover, 100% 100%, 100% 100%",
        boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)",
        borderRadius: "inherit",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header Global */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1.5vw, 16px)",
          borderBottom: screen === "modeSelect" ? "none" : "1px solid rgba(212,168,67,0.1)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Botao Voltar */}
        <motion.button
          onClick={screen === "modeSelect" ? onBack : () => setScreen("modeSelect")}
          whileHover={{ scale: 1.05, borderColor: "rgba(212,168,67,0.8)" }}
          whileTap={{ scale: 0.95 }}
          title={t("backTooltip")}
          style={{
            position: screen === "modeSelect" ? "absolute" : "relative",
            top: screen === "modeSelect" ? "clamp(8px, 1.5vw, 16px)" : "auto",
            left: screen === "modeSelect" ? "clamp(8px, 1.5vw, 16px)" : "auto",
            display: "flex",
            alignItems: "center",
            gap: "clamp(4px, 0.5vw, 8px)",
            padding: "clamp(5px, 0.6vw, 8px) clamp(8px, 1.2vw, 14px)",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(212,168,67,0.4)",
            borderRadius: "8px",
            color: "#D4A843",
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(10px, 1.2vw, 14px)",
            letterSpacing: "2px",
            cursor: "pointer",
            minHeight: "44px",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: "clamp(12px, 1.2vw, 16px)" }}>←</span>
          {t("back")}
        </motion.button>
        
        {/* Saldo (apenas em modeSelect) */}
        {screen === "modeSelect" && (
          <div
            title={t("balanceTooltip")}
            style={{
              position: "absolute",
              top: "clamp(8px, 1.5vw, 16px)",
              right: "clamp(8px, 1.5vw, 16px)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 0.5vw, 6px)",
            }}
          >
            <img
              src={ASSETS.iconGcoin}
              alt="GCoin"
              style={{
                width: "clamp(14px, 1.5vw, 20px)",
                height: "clamp(14px, 1.5vw, 20px)",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(12px, 1.6vw, 18px)",
                color: "#00E676",
                textShadow: "0 0 8px rgba(0,230,118,0.4)",
              }}
            >
              GC {saldo.toLocaleString("pt-BR")}
            </span>
          </div>
        )}
      </header>
      
      {/* Conteudo da Tela */}
      <AnimatePresence mode="wait">
        {screen === "modeSelect" && renderModeSelect()}
        {(screen === "videoIdle" || screen === "spinning" || screen === "fsPlaying") && renderVideoSlot()}
      </AnimatePresence>
      
      {/* Overlay Free Spins Trigger */}
      <AnimatePresence>
        {screen === "fsTrigger" && renderFSTrigger()}
      </AnimatePresence>
    </motion.div>
  );
}
