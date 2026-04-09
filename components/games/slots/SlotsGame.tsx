"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";
import {
  createProvablyFairSession, generateGrid as engineGenerateGrid,
  executeVideoSpin, executeClassicSpin, executeBuyBonus,
} from "./SlotsEngine";
import type { SpinResult, Grid as EngineGrid, GridCell } from "./SlotsTypes";
import { VIDEO_SYMBOLS, CLASSIC_SYMBOLS as ENGINE_CLASSIC_SYMBOLS, MIN_BET, MAX_BET, BUY_BONUS_MULTIPLIER, GRID_COLS, GRID_ROWS } from "./SlotsConstants";
import DevToolbar from "@/components/casino/DevToolbar";
import {
  HistoryModal, WinAmount, MultiBadge,
  ProvablyFairModal, PaytableModal,
  useEscStack,
  type HistoryColumn, type PFData, type SeedRecord,
  type PaytableCategory,
} from "@/components/shared";

// ===========================================================================
// SLOTS GAME — Blackout Casino
// Telas 1-4: ModeSelect, VideoIdle, Spinning/Tumble, FSTrigger
// ===========================================================================

export type SlotsScreen = 
  | "modeSelect" 
  | "videoIdle" 
  | "spinning" 
  | "fsTrigger"
  | "fsPlaying"
  | "winOverlay"
  | "classicIdle"
  | "classicSpinning";

export type SlotMode = "classic" | "video";

// Paths dos assets
const ASSETS = {
  bgCasino: "/assets/shared/ui/bg-casino.png",
  iconGcoin: "/assets/shared/icons/icon-gcoin.png",
  iconInfo: "/assets/shared/icons/icon-info.png",
  iconHistory: "/assets/shared/icons/icon-history.png",
  iconPaytable: "/assets/shared/icons/icon-paytable.png",
  iconCopy: "/assets/shared/icons/icon-copy.png",
  iconProvablyFair: "/assets/shared/icons/icon-provably-fair.png",
  iconSoundOn: "/assets/shared/icons/icon-sound-on.png",
  iconSoundOff: "/assets/shared/icons/icon-sound-off.png",
  logoSlotsBr: "/assets/logos-br-para-cards/2.LOGO-BR-SLOT-MACHINE.png",
  logoSlotsEn: "/assets/logos-in-para-cards/2.LOGO-IN-SLOT-MACHINE.png",
};

// Simbolos regulares (sem scatter/orb para grid visual)
const REGULAR_SYMBOLS = VIDEO_SYMBOLS.filter(s => s.id !== "scatter" && s.id !== "multiplier_orb");

// Simbolos do Classic Slot (7 simbolos)
const CLASSIC_SYMBOLS = [
  { id: "seven", path: "/assets/games/slots/classic/seven.png", color: "#FF1744" },
  { id: "bar", path: "/assets/games/slots/classic/bar.png", color: "#D4A843" },
  { id: "cherry", path: "/assets/games/slots/classic/cherry.png", color: "#FF5252" },
  { id: "diamond", path: "/assets/games/slots/classic/diamond.png", color: "#64B5F6" },
  { id: "bell", path: "/assets/games/slots/classic/bell.png", color: "#FFD700" },
  { id: "lemon", path: "/assets/games/slots/classic/lemon.png", color: "#FFEB3B" },
  { id: "star", path: "/assets/games/slots/classic/star.png", color: "#FFD700" },
];

// Win overlay images
const WIN_OVERLAYS = {
  big: "/assets/games/slots/overlays/win_big.png",
  mega: "/assets/games/slots/overlays/win_mega.png",
  jackpot: "/assets/games/slots/overlays/win_jackpot.png",
};

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
  videoDesc: { br: "Grid 8x4, Scatter Pays + Tumble", en: "Grid 8x4, Scatter Pays + Tumble" },
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
  total: { br: "TOTAL", en: "TOTAL" },
  bigWin: { br: "BIG WIN!", en: "BIG WIN!" },
  megaWin: { br: "MEGA WIN!", en: "MEGA WIN!" },
  jackpotWin: { br: "JACKPOT!", en: "JACKPOT!" },
  continue: { br: "CONTINUAR", en: "CONTINUE" },
  backToVideo: { br: "VOLTAR AO VIDEO", en: "BACK TO VIDEO" },
  fsRemaining: { br: "FREE SPINS", en: "FREE SPINS" },
  multiplier: { br: "MULTIPLICADOR", en: "MULTIPLIER" },
  paytable: { br: "TABELA DE PAGAMENTOS", en: "PAYTABLE" },
  history: { br: "HISTÓRICO", en: "HISTORY" },
  provablyFair: { br: "PROVABLY FAIR", en: "PROVABLY FAIR" },
  highSymbols: { br: "SÍMBOLOS PREMIUM", en: "HIGH SYMBOLS" },
  lowSymbols: { br: "SÍMBOLOS GEMAS", en: "LOW SYMBOLS" },
  specialSymbols: { br: "ESPECIAIS", en: "SPECIAL" },
  triggersFs: { br: "Ativa Free Spins", en: "Triggers Free Spins" },
  multipliesWin: { br: "Multiplica ganhos", en: "Multiplies wins" },
  serverSeedHash: { br: "Hash do Server Seed", en: "Server Seed Hash" },
  clientSeed: { br: "Client Seed", en: "Client Seed" },
  nonce: { br: "Nonce", en: "Nonce" },
  verify: { br: "VERIFICAR", en: "VERIFY" },
  provablyFairDesc: { br: "Cada resultado é verificável criptograficamente. O server seed é revelado após cada rodada.", en: "Each result is cryptographically verifiable. Server seed is revealed after each round." },
  buyFreeSpins: { br: "COMPRAR FREE SPINS", en: "BUY FREE SPINS" },
  guaranteedSpins: { br: "10 giros grátis garantidos", en: "10 guaranteed free spins" },
  cost: { br: "CUSTO", en: "COST" },
  currentBalance: { br: "Saldo", en: "Balance" },
  confirm: { br: "CONFIRMAR", en: "CONFIRM" },
  cancel: { br: "CANCELAR", en: "CANCEL" },
  copied: { br: "Copiado!", en: "Copied!" },
  noHistory: { br: "Nenhuma rodada ainda", en: "No rounds yet" },
};

// Paytable data (multiplicadores por quantidade de simbolos)
const PAYTABLE = {
  crown:     { name: { br: "Coroa", en: "Crown" }, payouts: { 8: 2, 9: 3, 10: 5, 11: 8, 12: 15 } },
  ring:      { name: { br: "Anel", en: "Ring" }, payouts: { 8: 1.5, 9: 2.5, 10: 4, 11: 6, 12: 12 } },
  hourglass: { name: { br: "Ampulheta", en: "Hourglass" }, payouts: { 8: 1.5, 9: 2, 10: 3, 11: 5, 12: 10 } },
  chalice:   { name: { br: "Cálice", en: "Chalice" }, payouts: { 8: 1, 9: 1.5, 10: 2.5, 11: 4, 12: 8 } },
  ruby:      { name: { br: "Rubi", en: "Ruby" }, payouts: { 8: 0.5, 9: 0.8, 10: 1.2, 11: 2, 12: 4 } },
  sapphire:  { name: { br: "Safira", en: "Sapphire" }, payouts: { 8: 0.5, 9: 0.8, 10: 1.2, 11: 2, 12: 4 } },
  emerald:   { name: { br: "Esmeralda", en: "Emerald" }, payouts: { 8: 0.4, 9: 0.6, 10: 1, 11: 1.5, 12: 3 } },
  amethyst:  { name: { br: "Ametista", en: "Amethyst" }, payouts: { 8: 0.4, 9: 0.6, 10: 1, 11: 1.5, 12: 3 } },
  topaz:     { name: { br: "Topázio", en: "Topaz" }, payouts: { 8: 0.3, 9: 0.5, 10: 0.8, 11: 1.2, 12: 2.5 } },
  scatter:   { name: { br: "Scatter", en: "Scatter" }, payouts: { 4: "10FS", 5: "15FS", 6: "20FS" } },
};

// Mock history data
const MOCK_HISTORY = [
  { id: 1, bet: 10, win: 45, multi: "x4.5", time: "12:34" },
  { id: 2, bet: 10, win: 0, multi: "-", time: "12:33" },
  { id: 3, bet: 25, win: 312, multi: "x12.5", time: "12:31" },
  { id: 4, bet: 25, win: 0, multi: "-", time: "12:30" },
  { id: 5, bet: 10, win: 18, multi: "x1.8", time: "12:28" },
  { id: 6, bet: 50, win: 0, multi: "-", time: "12:26" },
  { id: 7, bet: 50, win: 125, multi: "x2.5", time: "12:24" },
  { id: 8, bet: 10, win: 0, multi: "-", time: "12:22" },
  { id: 9, bet: 10, win: 0, multi: "-", time: "12:20" },
  { id: 10, bet: 100, win: 850, multi: "x8.5", time: "12:18" },
  { id: 11, bet: 25, win: 37, multi: "x1.5", time: "12:15" },
  { id: 12, bet: 25, win: 0, multi: "-", time: "12:13" },
  { id: 13, bet: 10, win: 22, multi: "x2.2", time: "12:10" },
  { id: 14, bet: 10, win: 0, multi: "-", time: "12:08" },
  { id: 15, bet: 50, win: 0, multi: "-", time: "12:05" },
  { id: 16, bet: 50, win: 175, multi: "x3.5", time: "12:02" },
  { id: 17, bet: 100, win: 0, multi: "-", time: "11:58" },
  { id: 18, bet: 10, win: 15, multi: "x1.5", time: "11:55" },
  { id: 19, bet: 25, win: 0, multi: "-", time: "11:52" },
  { id: 20, bet: 25, win: 62, multi: "x2.5", time: "11:48" },
];

// Grid mockado com simbolos aleatorios
function generateMockGrid(): { id: string; path: string; tier: string; color: string; uniqueKey: string }[][] {
  const grid: { id: string; path: string; tier: string; color: string; uniqueKey: string }[][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const rowSymbols: { id: string; path: string; tier: string; color: string; uniqueKey: string }[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
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
    const row = Math.floor(Math.random() * GRID_ROWS);
    const col = Math.floor(Math.random() * GRID_COLS);
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
  const rawLang = propLang || contextLang || "br";
  const lang = rawLang === "in" ? "en" : rawLang as "br" | "en";
  
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
  const [fsExitConfirm, setFsExitConfirm] = useState(false);
  
  // Win Overlay
  const [winOverlayData, setWinOverlayData] = useState<{ amount: number; ratio: number } | null>(null);
  const [countUpValue, setCountUpValue] = useState(0);
  
  // Classic Slot
  const [classicReels, setClassicReels] = useState<typeof CLASSIC_SYMBOLS[number][][]>([[], [], []]);
  const [classicSpinning, setClassicSpinning] = useState([false, false, false]);
  const [classicStopped, setClassicStopped] = useState([false, false, false]);
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  const [classicFeedback, setClassicFeedback] = useState<"win" | "lose" | null>(null);
  const [videoFeedback, setVideoFeedback] = useState<"win" | "lose" | null>(null);
  
  // Modais
  const [showPaytable, setShowPaytable] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState(0);
  const [showBuyBonus, setShowBuyBonus] = useState(false);
  const [clientSeed, setClientSeed] = useState("a1b2c3d4e5f6");
  const [nonce, setNonce] = useState(0);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [serverSeed, setServerSeed] = useState("");
  const [serverSeedHash, setServerSeedHash] = useState("carregando...");
  const [lastSpinResult, setLastSpinResult] = useState<SpinResult | null>(null);
  const [pfVerifying, setPfVerifying] = useState(false);
  const [pfIsValid, setPfIsValid] = useState<boolean | null>(null);
  const [pfRevealedSeed, setPfRevealedSeed] = useState("");
  const [seedHistory, setSeedHistory] = useState<SeedRecord[]>([]);

  // Refs
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countUpRef = useRef<number | null>(null);
  const fsSpinRef = useRef<() => void>(() => {});

  // Provably Fair — sessao real (browser mock ou server)
  useEffect(() => {
    createProvablyFairSession().then(session => {
      setServerSeed(session.serverSeed);
      setServerSeedHash(session.serverSeedHash);
      setClientSeed(session.clientSeed);
      setNonce(0);
    });
  }, []);
  
  // Sons — 16 arquivos em public/assets/sounds/slots/
  const soundCacheRef = useRef<Record<string, HTMLAudioElement>>({});
  const playSound = useCallback((name: string, volume = 0.5) => {
    try {
      const path = `/assets/sounds/slots/${name}.mp3`;
      if (!soundCacheRef.current[name]) {
        soundCacheRef.current[name] = new Audio(path);
      }
      const audio = soundCacheRef.current[name];
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  }, []);
  
  const playWinSound = useCallback((amount: number, betVal: number) => {
    const ratio = amount / betVal;
    if (ratio >= 50) playSound("win_mega", 0.7);
    else if (ratio >= 15) playSound("win_big", 0.6);
    else if (ratio >= 5) playSound("win_medium", 0.5);
    else playSound("win_small", 0.4);
  }, [playSound]);
  
  // Gerar reels classicos (3 reels, cada um com 3 simbolos visiveis)
  const generateClassicReels = useCallback(() => {
    return [0, 1, 2].map(() => {
      const reel: typeof CLASSIC_SYMBOLS[number][] = [];
      for (let i = 0; i < 3; i++) {
        reel.push(CLASSIC_SYMBOLS[Math.floor(Math.random() * CLASSIC_SYMBOLS.length)]);
      }
      return reel;
    });
  }, []);
  
  // Inicializar grid
  useEffect(() => {
    setGrid(generateMockGrid());
    setClassicReels(generateClassicReels());
  }, [generateClassicReels]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (countUpRef.current) cancelAnimationFrame(countUpRef.current);
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
    } else if (selectedMode === "classic") {
      setScreen("classicIdle");
      setClassicReels(generateClassicReels());
      setClassicStopped([false, false, false]);
    }
  }, [generateClassicReels]);

  // Helper: reconstruir grid visual apos tumble step
  const applyTumbleStep = useCallback((
    currentGrid: ReturnType<typeof generateMockGrid>,
    step: { removedPositions: Array<{ row: number; col: number }>; newSymbols: Array<{ row: number; col: number; symbol: { id: string; path: string; tier: string; color: string } }> }
  ): ReturnType<typeof generateMockGrid> => {
    const removedSet = new Set(step.removedPositions.map(p => `${p.row}-${p.col}`));
    const newGrid: ReturnType<typeof generateMockGrid> = [];

    for (let col = 0; col < GRID_COLS; col++) {
      const surviving: ReturnType<typeof generateMockGrid>[0] = [];
      for (let row = 0; row < GRID_ROWS; row++) {
        if (!removedSet.has(`${row}-${col}`)) {
          surviving.push(currentGrid[row]?.[col] || currentGrid[0][0]);
        }
      }

      const newForCol = step.newSymbols
        .filter(s => s.col === col)
        .sort((a, b) => a.row - b.row)
        .map(s => ({
          id: s.symbol.id,
          path: s.symbol.path,
          tier: s.symbol.tier,
          color: s.symbol.color,
          uniqueKey: `t-${col}-${Date.now()}-${Math.random()}`,
        }));

      const fullCol = [...newForCol, ...surviving];

      for (let row = 0; row < GRID_ROWS; row++) {
        if (!newGrid[row]) newGrid[row] = [];
        newGrid[row][col] = fullCol[row] || surviving[surviving.length - 1] || currentGrid[0][0];
      }
    }

    return newGrid;
  }, []);

  // Win countup animation
  const startCountUp = useCallback((targetValue: number, ratio: number) => {
    const duration = ratio >= 500 ? 4000 : ratio >= 50 ? 3000 : 2000;
    const startTime = performance.now();
    setCountUpValue(0);
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      
      setCountUpValue(Math.floor(targetValue * eased));
      
      if (progress < 1) {
        countUpRef.current = requestAnimationFrame(animate);
      }
    };
    
    countUpRef.current = requestAnimationFrame(animate);
  }, []);

  const handleSpin = useCallback(async () => {
    if (isSpinning || bet > saldo) return;

    const totalBet = anteBet ? Math.floor(bet * 1.25) : bet;
    setSaldo(saldo - totalBet);
    setIsSpinning(true);
    setScreen("spinning");
    setCurrentWin(0);
    setTumbleCount(0);
    setShowWinHighlight(false);
    setWinningPositions(new Set());
    setGrid(generateMockGrid());
    playSound("spin_start", 0.4);

    const currentNonce = nonce;
    setNonce(prev => prev + 1);

    const isFS = screen === "fsPlaying" || freeSpinsRemaining > 0;

    try {
      const { result, newJackpotPool } = await executeVideoSpin(
        bet, anteBet, serverSeed, clientSeed, currentNonce, isFS, jackpotPool
      );
      setJackpotPool(newJackpotPool);
      setLastSpinResult(result);

      // Atraso de animacao do spin
      const spinDuration = turboMode ? 800 : 1600;
      spinTimeoutRef.current = setTimeout(() => {
        // Converter grid da engine (column-major) para visual (row-major)
        const engineGrid = result.initialGrid;
        const visualGrid: ReturnType<typeof generateMockGrid> = [];
        for (let row = 0; row < GRID_ROWS; row++) {
          const rowSymbols: ReturnType<typeof generateMockGrid>[0] = [];
          for (let col = 0; col < GRID_COLS; col++) {
            const cell = engineGrid[col][row];
            rowSymbols.push({
              id: cell.symbol.id,
              path: cell.symbol.path,
              tier: cell.symbol.tier,
              color: cell.symbol.color,
              uniqueKey: `${row}-${col}-${Date.now()}-${Math.random()}`,
            });
          }
          visualGrid.push(rowSymbols);
        }
        setGrid(visualGrid);

        if (result.tumbleSteps.length > 0) {
          // Tumble cascade animado — passo a passo
          const highlightDur = turboMode ? 300 : 600;
          const cascadeDur = turboMode ? 250 : 450;
          let accWin = 0;

          const animateStep = (stepIdx: number) => {
            const step = result.tumbleSteps[stepIdx];

            const positions = new Set<string>();
            for (const cluster of step.winClusters) {
              for (const pos of cluster.positions) {
                positions.add(`${pos.row}-${pos.col}`);
              }
            }
            setWinningPositions(positions);
            setShowWinHighlight(true);
            setTumbleCount(stepIdx + 1);
            accWin += step.totalWin;
            setCurrentWin(accWin);
            playSound(stepIdx === 0 ? "win_small" : "tumble_drop", 0.3);

            spinTimeoutRef.current = setTimeout(() => {
              setShowWinHighlight(false);
              setWinningPositions(new Set());
              setGrid(prev => applyTumbleStep(prev, step));

              spinTimeoutRef.current = setTimeout(() => {
                if (stepIdx + 1 < result.tumbleSteps.length) {
                  animateStep(stepIdx + 1);
                } else {
                  if (result.triggeredFreeSpins && !isFS) {
                    playSound("free_spins_trigger", 0.6);
                    setScreen("fsTrigger");
                    setFreeSpinsTotal(result.freeSpinsAwarded);
                    setFreeSpinsRemaining(result.freeSpinsAwarded);
                    setFsMultiplier(1);
                    setFsTotalWin(0);
                    setIsSpinning(false);
                  } else {
                    const ratio = result.totalWin / bet;
                    setSaldo(prev => prev + result.totalWin);

                    if (ratio >= 5) {
                      setWinOverlayData({ amount: result.totalWin, ratio });
                      setScreen("winOverlay");
                      startCountUp(result.totalWin, ratio);
                    } else {
                      setScreen(isFS ? "fsPlaying" : "videoIdle");
                    }
                    setIsSpinning(false);
                  }
                }
              }, cascadeDur);
            }, highlightDur);
          };

          playWinSound(result.totalWin, bet);
          setVideoFeedback("win");
          setTimeout(() => setVideoFeedback(null), 1600);
          animateStep(0);
        } else {
          // Sem win
          setVideoFeedback("lose");
          setTimeout(() => setVideoFeedback(null), 1600);
          setTimeout(() => {
            setIsSpinning(false);
            setScreen(isFS ? "fsPlaying" : "videoIdle");
          }, turboMode ? 200 : 400);
        }
      }, spinDuration);
    } catch (err) {
      // Fallback: devolver aposta se engine falhar
      setSaldo(prev => prev + totalBet);
      setIsSpinning(false);
      setScreen("videoIdle");
    }
  }, [isSpinning, bet, saldo, anteBet, turboMode, setSaldo, nonce, serverSeed, clientSeed, jackpotPool, screen, freeSpinsRemaining, applyTumbleStep, startCountUp]);
  
  const handleFSStart = useCallback(() => {
    setScreen("fsPlaying");
    setTimeout(() => fsSpinRef.current(), 500);
  }, []);
  
  // Free Spin handler — usa engine real, ref pra recursao sem closure stale
  const handleFSSpin = useCallback(() => {
    setFreeSpinsRemaining(prev => {
      if (prev <= 0) return prev;
      
      setIsSpinning(true);
      setShowWinHighlight(false);
      setWinningPositions(new Set());
      setGrid(generateMockGrid());
      
      const currentNonce = nonce;
      setNonce(n => n + 1);
      
      const spinDur = turboMode ? 800 : 1600;

      (async () => {
        try {
          const { result, newJackpotPool } = await executeVideoSpin(
            bet, anteBet, serverSeed, clientSeed, currentNonce, true, jackpotPool
          );
          setJackpotPool(newJackpotPool);
          setLastSpinResult(result);

          spinTimeoutRef.current = setTimeout(() => {
            const engineGrid = result.initialGrid;
            const visualGrid: ReturnType<typeof generateMockGrid> = [];
            for (let row = 0; row < GRID_ROWS; row++) {
              const rowSymbols: ReturnType<typeof generateMockGrid>[0] = [];
              for (let col = 0; col < GRID_COLS; col++) {
                const cell = engineGrid[col][row];
                rowSymbols.push({
                  id: cell.symbol.id,
                  path: cell.symbol.path,
                  tier: cell.symbol.tier,
                  color: cell.symbol.color,
                  uniqueKey: `fs-${row}-${col}-${Date.now()}-${Math.random()}`,
                });
              }
              visualGrid.push(rowSymbols);
            }
            setGrid(visualGrid);

            if (result.tumbleSteps.length > 0) {
              const firstStep = result.tumbleSteps[0];
              const positions = new Set<string>();
              for (const cluster of firstStep.winClusters) {
                for (const pos of cluster.positions) {
                  positions.add(`${pos.row}-${pos.col}`);
                }
              }
              setWinningPositions(positions);
              setShowWinHighlight(true);
              setTumbleCount(result.tumbleSteps.length);
              
              const spinWin = result.totalWin;
              setCurrentWin(spinWin);
              playWinSound(spinWin, bet);

              if (result.totalMultiplier > 1) {
                setFsMultiplier(m => m + (result.totalMultiplier - 1));
              }
              
              setFsTotalWin(curTotal => {
                const newTotal = curTotal + spinWin;
                
                setTimeout(() => {
                  setShowWinHighlight(false);
                  setWinningPositions(new Set());
                  setIsSpinning(false);
                  
                  if (result.triggeredFreeSpins) {
                    setFreeSpinsRemaining(r => r + result.freeSpinsAwarded);
                    setFreeSpinsTotal(t => t + result.freeSpinsAwarded);
                  }
                  
                  if (prev <= 1 && !result.triggeredFreeSpins) {
                    if (newTotal > 0) {
                      const ratio = newTotal / bet;
                      if (ratio >= 5) {
                        setWinOverlayData({ amount: newTotal, ratio });
                        setScreen("winOverlay");
                        startCountUp(newTotal, ratio);
                      } else {
                        setSaldo(s => s + newTotal);
                        setScreen("videoIdle");
                        setFsMultiplier(1);
                        setFsTotalWin(0);
                      }
                    } else {
                      setScreen("videoIdle");
                      setFsMultiplier(1);
                      setFsTotalWin(0);
                    }
                  } else {
                    setTimeout(() => fsSpinRef.current(), turboMode ? 400 : 800);
                  }
                }, turboMode ? 600 : 1200);
                
                return newTotal;
              });
            } else {
              setTimeout(() => {
                setIsSpinning(false);
                
                if (prev <= 1) {
                  setFsTotalWin(curTotal => {
                    if (curTotal > 0) {
                      const ratio = curTotal / bet;
                      if (ratio >= 5) {
                        setWinOverlayData({ amount: curTotal, ratio });
                        setScreen("winOverlay");
                        startCountUp(curTotal, ratio);
                      } else {
                        setSaldo(s => s + curTotal);
                        setScreen("videoIdle");
                        setFsMultiplier(1);
                        setFsTotalWin(0);
                      }
                    } else {
                      setScreen("videoIdle");
                      setFsMultiplier(1);
                      setFsTotalWin(0);
                    }
                    return curTotal;
                  });
                } else {
                  setTimeout(() => fsSpinRef.current(), turboMode ? 400 : 800);
                }
              }, turboMode ? 200 : 400);
            }
          }, spinDur);
        } catch {
          setIsSpinning(false);
        }
      })();
      
      return prev - 1;
    });
  }, [turboMode, bet, anteBet, nonce, serverSeed, clientSeed, jackpotPool, setSaldo, startCountUp]);
  
  // Manter ref atualizado
  useEffect(() => {
    fsSpinRef.current = handleFSSpin;
  }, [handleFSSpin]);

  // Auto-play loop
  useEffect(() => {
    if (autoPlay > 0 && screen === "videoIdle" && !isSpinning && bet <= saldo) {
      const timer = setTimeout(() => {
        setAutoPlay(prev => prev - 1);
        handleSpin();
      }, turboMode ? 500 : 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, screen, isSpinning, bet, saldo, turboMode, handleSpin]);
  
  // Win overlay continue
  const handleWinContinue = useCallback(() => {
    if (winOverlayData) {
      setSaldo(prev => prev + winOverlayData.amount);
    }
    setWinOverlayData(null);
    setCountUpValue(0);
    setScreen("videoIdle");
    setFsMultiplier(1);
    setFsTotalWin(0);
    setCurrentWin(0);
  }, [winOverlayData, setSaldo]);
  
  // Classic Spin handler
  const handleClassicSpin = useCallback(async () => {
    if (classicSpinning.some(s => s) || bet > saldo) return;

    const totalBet = bet;
    setSaldo(saldo - totalBet);
    setJackpotPool(prev => prev + Math.floor(totalBet * 0.015));
    setCurrentWin(0);
    setClassicSpinning([true, true, true]);
    setClassicStopped([false, false, false]);
    setScreen("classicSpinning");
    playSound("spin_start", 0.4);

    const currentNonce = nonce;
    setNonce(prev => prev + 1);

    try {
      const classicResult = await executeClassicSpin(bet, serverSeed, clientSeed, currentNonce);
      const baseTimes = turboMode ? [500, 700, 1100] : [1000, 1400, 2200];

      // Converter resultado da engine para formato visual
      const finalReels = classicResult.visibleReels.map(reel =>
        reel.map(sym => ({
          id: sym.id, path: sym.path, color: sym.color,
          weight: sym.weight, payout3: sym.payout3, payout2: sym.payout2,
        }))
      );

      baseTimes.forEach((time, reelIndex) => {
        setTimeout(() => {
          setClassicReels(prev => {
            const newReels = [...prev];
            newReels[reelIndex] = finalReels[reelIndex];
            return newReels;
          });
          setClassicSpinning(prev => {
            const ns = [...prev]; ns[reelIndex] = false; return ns;
          });
          setClassicStopped(prev => {
            const ns = [...prev]; ns[reelIndex] = true; return ns;
          });

          if (reelIndex === 2) {
            setTimeout(() => {
              setScreen("classicIdle");
              if (classicResult.totalWin > 0) {
                setCurrentWin(classicResult.totalWin);
                setSaldo(prev => prev + classicResult.totalWin);
                setClassicFeedback("win");
                playWinSound(classicResult.totalWin, bet);
              } else {
                setClassicFeedback("lose");
              }
              playSound("reel_stop", 0.3);
              setTimeout(() => setClassicFeedback(null), 1800);
            }, 200);
          }
        }, time);
      });
    } catch (_) {
      setSaldo(prev => prev + totalBet);
      setClassicSpinning([false, false, false]);
      setScreen("classicIdle");
    }
  }, [classicSpinning, bet, saldo, turboMode, setSaldo, nonce, serverSeed, clientSeed]);
  
  const handleBetChange = useCallback((action: "min" | "half" | "double" | "max") => {
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
  
  // Copy server seed hash
  const handleCopyHash = useCallback(() => {
    navigator.clipboard.writeText(serverSeedHash);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  }, [serverSeedHash]);
  
  // Buy bonus (100x bet)
  const handleBuyBonus = useCallback(async () => {
    const cost = bet * BUY_BONUS_MULTIPLIER;
    if (cost > saldo) return;

    setSaldo(saldo - cost);
    setShowBuyBonus(false);
    playSound("buy_bonus", 0.5);

    const currentNonce = nonce;
    setNonce(prev => prev + 1);

    try {
      const { result, newJackpotPool } = await executeBuyBonus(
        bet, serverSeed, clientSeed, currentNonce, jackpotPool
      );
      setJackpotPool(newJackpotPool);
      setLastSpinResult(result);
      setFreeSpinsRemaining(result.freeSpinsAwarded);
      setFreeSpinsTotal(result.freeSpinsAwarded);
      setFsMultiplier(1);
      setFsTotalWin(0);
      setScreen("fsTrigger");
    } catch (_) {
      setSaldo(prev => prev + cost);
    }
  }, [bet, saldo, setSaldo, nonce, serverSeed, clientSeed, jackpotPool]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  
  const t = (key: keyof typeof TEXTS) => TEXTS[key][lang];

  // ==========================================================================
  // TELA 1 - MODE SELECT
  // ==========================================================================

  const [hoveredMode, setHoveredMode] = useState<"classic" | "video" | null>(null);

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
          whileHover={{ y: -6, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect("classic")}
          onMouseEnter={() => setHoveredMode("classic")}
          onMouseLeave={() => setHoveredMode(null)}
          title={t("playClassicTooltip")}
          style={{
            width: "clamp(180px, 28vw, 280px)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <motion.img
            src="/assets/games/slots/mode-classic.png"
            alt="Classic Slot"
            animate={{ scale: hoveredMode === "classic" ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          <AnimatePresence>
            {hoveredMode === "classic" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,67,0.06) 0%, rgba(0,0,0,0.96) 40%, rgba(0,0,0,0.98) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "clamp(16px, 3vw, 28px)",
                  zIndex: 4,
                  gap: "clamp(8px, 1.2vw, 14px)",
                }}
              >
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: "clamp(20px, 3.2vw, 32px)",
                    color: "#FFD700",
                    textTransform: "uppercase",
                    letterSpacing: 5,
                    textShadow: "0 0 20px rgba(255,215,0,0.7), 0 0 50px rgba(255,215,0,0.3), 0 2px 8px rgba(0,0,0,0.9)",
                    textAlign: "center",
                  }}
                >
                  {t("classic")}
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  style={{
                    width: "clamp(40px, 8vw, 70px)",
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #F6E27A, #D4A843, #F6E27A, transparent)",
                  }}
                />
                <motion.p
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(10px, 1.2vw, 13px)",
                    color: "#F6E27A",
                    lineHeight: 1.7,
                    textAlign: "center",
                    maxWidth: "85%",
                    letterSpacing: 0.4,
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {lang === "br"
                    ? "3 rolos classicos com paylines tradicionais e simbolos iconicos de Las Vegas. Rapido, nostalgico."
                    : "3 classic reels with traditional paylines and iconic Las Vegas symbols. Fast, nostalgic."}
                </motion.p>
                <motion.div
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  style={{
                    display: "flex",
                    gap: "clamp(4px, 0.6vw, 8px)",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "clamp(2px, 0.3vw, 4px)",
                  }}
                >
                  {["3 Reels", "Paylines", lang === "br" ? "Rapido" : "Fast"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "clamp(7px, 0.9vw, 10px)",
                        color: "#D4A843",
                        border: "1px solid rgba(212,168,67,0.25)",
                        borderRadius: 4,
                        padding: "clamp(2px, 0.3vw, 3px) clamp(6px, 0.8vw, 10px)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          whileHover={{ y: -6, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect("video")}
          onMouseEnter={() => setHoveredMode("video")}
          onMouseLeave={() => setHoveredMode(null)}
          title={t("playVideoTooltip")}
          style={{
            width: "clamp(180px, 28vw, 280px)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <motion.img
            src="/assets/games/slots/mode-video.png"
            alt="Video Slot"
            animate={{ scale: hoveredMode === "video" ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          <AnimatePresence>
            {hoveredMode === "video" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,67,0.06) 0%, rgba(0,0,0,0.96) 40%, rgba(0,0,0,0.98) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "clamp(16px, 3vw, 28px)",
                  zIndex: 4,
                  gap: "clamp(8px, 1.2vw, 14px)",
                }}
              >
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: "clamp(20px, 3.2vw, 32px)",
                    color: "#FFD700",
                    textTransform: "uppercase",
                    letterSpacing: 5,
                    textShadow: "0 0 20px rgba(255,215,0,0.7), 0 0 50px rgba(255,215,0,0.3), 0 2px 8px rgba(0,0,0,0.9)",
                    textAlign: "center",
                  }}
                >
                  {t("video")}
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  style={{
                    width: "clamp(40px, 8vw, 70px)",
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #F6E27A, #D4A843, #F6E27A, transparent)",
                  }}
                />
                <motion.p
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(10px, 1.2vw, 13px)",
                    color: "#F6E27A",
                    lineHeight: 1.7,
                    textAlign: "center",
                    maxWidth: "85%",
                    letterSpacing: 0.4,
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {lang === "br"
                    ? "Grid 8x4 com Scatter Pays e Tumble Cascade. Multiplicadores acumulados, Free Spins e Buy Bonus."
                    : "8x4 grid with Scatter Pays and Tumble Cascade. Running multipliers, Free Spins and Buy Bonus."}
                </motion.p>
                <motion.div
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  style={{
                    display: "flex",
                    gap: "clamp(4px, 0.6vw, 8px)",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "clamp(2px, 0.3vw, 4px)",
                  }}
                >
                  {["8x4 Grid", "Tumble", "Free Spins", "Buy Bonus"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "clamp(7px, 0.9vw, 10px)",
                        color: "#D4A843",
                        border: "1px solid rgba(212,168,67,0.25)",
                        borderRadius: 4,
                        padding: "clamp(2px, 0.3vw, 3px) clamp(6px, 0.8vw, 10px)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
        {/* Header — FORA da cabine, padrao Classic */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1.5vw, 16px)",
            borderBottom: "1px solid rgba(212,168,67,0.1)",
            flexShrink: 0,
            zIndex: 5,
            width: "100%",
          }}
        >
          <motion.button
            onClick={() => { setScreen("modeSelect"); setMode(null); setCurrentWin(0); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("backTooltip")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(4px, 0.5vw, 8px)",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(212,168,67,0.4)",
              borderRadius: 8,
              padding: "clamp(5px, 0.6vw, 8px) clamp(8px, 1.2vw, 14px)",
              color: "#D4A843",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(10px, 1.2vw, 13px)",
              cursor: "pointer",
              minHeight: 44,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: "clamp(12px, 1.2vw, 16px)" }}>←</span>
            {t("back")}
          </motion.button>

          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 800,
              fontSize: "clamp(14px, 2.2vw, 24px)",
              color: "#D4A843",
              textTransform: "uppercase",
              letterSpacing: "4px",
              textShadow: "0 0 15px rgba(255,215,0,0.4), 0 2px 6px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            VIDEO SLOT {t("slotMachine")}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 10px)" }}>
            <div title={t("balanceTooltip")} style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 0.5vw, 6px)" }}>
              <img src={ASSETS.iconGcoin} alt="GCoin" style={{ width: "clamp(14px, 1.5vw, 20px)", height: "clamp(14px, 1.5vw, 20px)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "clamp(12px, 1.6vw, 18px)", color: "#00E676", textShadow: "0 0 8px rgba(0,230,118,0.4)" }}>
                {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}
              </span>
            </div>
            <motion.button
              onClick={() => setShowHelp(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={lang === "br" ? "Ajuda" : "Help"}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(212,168,67,0.08)",
                border: "1px solid rgba(212,168,67,0.25)",
                color: "rgba(212,168,67,0.5)",
                fontFamily: "'Cinzel', serif",
                fontWeight: 700, fontSize: 13,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              ?
            </motion.button>
          </div>
        </div>

        {/* Area da cabine — centralizada no espaco disponivel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, padding: "clamp(2px, 0.4vw, 6px)" }}>

        {/* CABINE VIDEO SLOT — tudo dentro */}
        <div
          style={{
            position: "relative",
            width: "clamp(340px, 68vw, 620px)",
            maxWidth: "95%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 20,
            border: "1.5px solid rgba(212,168,67,0.35)",
            background: "linear-gradient(180deg, #1A1610 0%, #0F0D08 40%, #080704 100%)",
            overflow: "visible",
            boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Borda verde+dourado girando (Hero style) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 3,
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor" as any,
              padding: "2px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-50%",
                background: "conic-gradient(from 0deg, transparent 0%, transparent 65%, #00E676 75%, #FFD700 85%, #00E676 95%, transparent 100%)",
                animation: "spin 4s linear infinite",
              }}
            />
          </div>

          {/* Glow sutil verde atras da cabine */}
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: 24,
              background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,230,118,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Placa "VIDEO SLOT" com luzes decorativas */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "clamp(8px, 1vw, 14px) 0 clamp(6px, 0.8vw, 10px) 0",
              flexShrink: 0,
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", gap: "clamp(6px, 1vw, 12px)", marginBottom: "clamp(2px, 0.3vw, 4px)" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#00E676", boxShadow: "0 0 6px rgba(0,230,118,0.6)" }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                fontSize: "clamp(12px, 1.8vw, 20px)",
                color: "#FFD700",
                textShadow: "0 0 10px rgba(255,215,0,0.5), 0 0 25px rgba(255,215,0,0.15)",
                letterSpacing: 3,
                textAlign: "center",
                textTransform: "uppercase",
                padding: "clamp(3px, 0.4vw, 6px) clamp(12px, 2vw, 24px)",
                background: "linear-gradient(180deg, rgba(212,168,67,0.1) 0%, rgba(212,168,67,0.03) 100%)",
                border: "1px solid rgba(212,168,67,0.2)",
                borderRadius: 6,
              }}
            >
              VIDEO SLOT
            </div>
          </div>

          {/* Area do Grid — dentro da cabine */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(2px, 0.3vw, 4px) clamp(6px, 1vw, 14px)",
              minHeight: 0,
              overflow: "hidden",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* Grid window com sombra interna (profundidade como Classic) */}
            <div style={{ position: "relative", width: "100%" }}>
            <div
              style={{
                position: "relative",
                padding: "clamp(4px, 0.5vw, 8px)",
                borderRadius: "12px",
                background: "linear-gradient(180deg, #0A0A0A 0%, #060606 100%)",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "inset 0 4px 14px rgba(0,0,0,0.7), inset 0 -4px 14px rgba(0,0,0,0.5), inset 4px 0 10px rgba(0,0,0,0.3), inset -4px 0 10px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(212,168,67,0.15)",
              }}
            >
            {/* CAMADA 1 — SHIMMER SWEEP diagonal (SpotlightLayout L170-184) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 4,
                borderRadius: 18,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "35%",
                  height: "200%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.06) 40%, rgba(255,255,255,0.08) 50%, rgba(255,215,0,0.06) 60%, transparent 100%)",
                  animation: "slotsShimmerSweep 5s ease-in-out 0s infinite",
                }}
              />
            </div>

            {/* CAMADA 2 — PARTICULAS douradas (SpotlightLayout L187-210) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 4,
                borderRadius: 18,
              }}
            >
              {[
                { w: 3, bg: "rgba(255,215,0,0.8)", left: "15%", bottom: "25%", dur: 2.5, del: 0.3 },
                { w: 2.5, bg: "rgba(212,168,67,0.6)", left: "35%", bottom: "40%", dur: 3.2, del: 1.1 },
                { w: 3.5, bg: "rgba(0,230,118,0.5)", left: "55%", bottom: "20%", dur: 4, del: 0.7 },
                { w: 2, bg: "rgba(255,215,0,0.8)", left: "75%", bottom: "35%", dur: 2.8, del: 2.1 },
                { w: 3, bg: "rgba(212,168,67,0.6)", left: "45%", bottom: "55%", dur: 3.5, del: 1.8 },
                { w: 2.5, bg: "rgba(0,230,118,0.5)", left: "85%", bottom: "30%", dur: 4.2, del: 0.5 },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: p.w,
                    height: p.w,
                    borderRadius: "50%",
                    background: p.bg,
                    left: p.left,
                    bottom: p.bottom,
                    animation: `slotsFloatParticle ${p.dur}s ease-in-out ${p.del}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* CAMADA 3 — FEIXES DE LUZ nas bordas (SpotlightLayout L213-264) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 3,
                borderRadius: 18,
              }}
            >
              {/* Feixe esquerdo */}
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "-2px",
                  width: "40%",
                  height: "2px",
                  background: "linear-gradient(90deg, rgba(255,215,0,0.5), transparent)",
                  filter: "blur(1px)",
                  animation: "slotsShimmerSweep 6s ease-in-out 0s infinite",
                  opacity: 0.6,
                }}
              />
              {/* Feixe direito */}
              <div
                style={{
                  position: "absolute",
                  top: "65%",
                  right: "-2px",
                  width: "35%",
                  height: "2px",
                  background: "linear-gradient(270deg, rgba(255,215,0,0.5), transparent)",
                  filter: "blur(1px)",
                  animation: "slotsShimmerSweep 7s ease-in-out 2s infinite",
                  opacity: 0.5,
                }}
              />
              {/* Feixe topo */}
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "30%",
                  width: "2px",
                  height: "30%",
                  background: "linear-gradient(180deg, rgba(255,215,0,0.4), transparent)",
                  filter: "blur(1px)",
                  animation: "slotsShimmerSweep 5s ease-in-out 1s infinite",
                  opacity: 0.5,
                }}
              />
              {/* Glow corner top-left dourado */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "clamp(30px, 5vw, 60px)",
                  height: "clamp(30px, 5vw, 60px)",
                  background: "radial-gradient(circle at 0% 0%, rgba(255,215,0,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              {/* Glow corner bottom-right verde */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "clamp(30px, 5vw, 60px)",
                  height: "clamp(30px, 5vw, 60px)",
                  background: "radial-gradient(circle at 100% 100%, rgba(0,230,118,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* CAMADA 4 — BORDA GLOW externa (SpotlightLayout L267-277) */}
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: 20,
                boxShadow: "0 0 18px rgba(255,215,0,0.3), 0 0 40px rgba(0,230,118,0.12)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* CAMADA 5 — SPOTLIGHT CONE do topo (SpotlightLayout L283-297) */}
            <div
              style={{
                position: "absolute",
                top: "-10%",
                left: "10%",
                right: "10%",
                height: "70%",
                background: "conic-gradient(from 250deg at 50% 0%, transparent 0deg, rgba(255,215,0,0.1) 10deg, rgba(255,215,0,0.2) 20deg, rgba(255,215,0,0.1) 30deg, transparent 40deg)",
                filter: "blur(16px)",
                animation: "slotsSpotlightBreathe 4s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 3,
                borderRadius: 18,
              }}
            />

            {/* CAMADA 6 — GLOW base inferior (SpotlightLayout L300-312) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "5%",
                right: "5%",
                height: "50%",
                background: "radial-gradient(ellipse at 50% 100%, rgba(255,215,0,0.12) 0%, rgba(0,230,118,0.06) 30%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 3,
                borderRadius: "0 0 18px 18px",
              }}
            />

            {/* Tumble Badge */}
            <AnimatePresence>
              {tumbleCount > 0 && (
                <motion.div
                  key={tumbleCount}
                  initial={{ scale: 1.4, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  title={t("tumbleTooltip")}
                  style={{
                    position: "absolute",
                    top: "clamp(6px, 0.8vw, 10px)",
                    right: "clamp(6px, 0.8vw, 10px)",
                    background: "linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,200,100,0.08) 100%)",
                    border: "1px solid rgba(0,230,118,0.4)",
                    borderRadius: "8px",
                    padding: "clamp(3px, 0.4vw, 6px) clamp(8px, 1vw, 14px)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: "clamp(10px, 1.2vw, 14px)",
                    color: "#00E676",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    zIndex: 10,
                    boxShadow: "0 0 12px rgba(0,230,118,0.2), inset 0 0 8px rgba(0,230,118,0.05)",
                    textShadow: "0 0 6px rgba(0,230,118,0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {t("tumble")} x{tumbleCount}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Grid 8x4 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                gap: "clamp(2px, 0.3vw, 4px)",
                width: "100%",
                aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
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
                          filter: isDimmed ? "grayscale(0.5)" : "grayscale(0)",
                        }}
                        exit={{ opacity: 0, scale: 0.3, filter: "blur(4px)", transition: { duration: 0.25, ease: "easeIn" } }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          mass: 0.8,
                          delay: isSpinning ? colIndex * 0.15 : 0,
                        }}
                        style={{
                          aspectRatio: "1",
                          borderRadius: "8px",
                          background: isScatter
                            ? "radial-gradient(circle, rgba(100,180,255,0.06) 0%, transparent 70%)"
                            : isWinning
                            ? `radial-gradient(circle, ${symbol.color}15 0%, transparent 70%)`
                            : "rgba(255,255,255,0.03)",
                          border: isScatter
                            ? "1px solid rgba(100,180,255,0.25)"
                            : isWinning
                            ? `1.5px solid ${symbol.color}`
                            : isDimmed
                            ? "1px solid rgba(255,255,255,0.02)"
                            : "1px solid rgba(255,255,255,0.05)",
                          boxShadow: isScatter
                            ? "0 0 8px rgba(100,180,255,0.1)"
                            : isWinning
                            ? `0 0 12px ${symbol.color}30, inset 0 0 8px ${symbol.color}10`
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
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

            {/* Video Win/Lose feedback — estilo arcade stamp */}
            <AnimatePresence>
              {videoFeedback && (
                <motion.div
                  key={videoFeedback + Date.now()}
                  initial={{ opacity: 0, scale: 2.5 }}
                  animate={{ opacity: [0, 1, 1, 1, 0], scale: [2.5, 0.9, 1.05, 1, 1] }}
                  transition={{ duration: 1.6, times: [0, 0.15, 0.25, 0.35, 1] }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                    pointerEvents: "none",
                    background: videoFeedback === "win"
                      ? "radial-gradient(ellipse at center, rgba(0,230,118,0.12) 0%, transparent 60%)"
                      : "radial-gradient(ellipse at center, rgba(255,68,68,0.08) 0%, transparent 60%)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 900,
                      fontSize: "clamp(28px, 6vw, 52px)",
                      textTransform: "uppercase",
                      letterSpacing: "clamp(4px, 1vw, 8px)",
                      color: videoFeedback === "win" ? "#00E676" : "#FF4444",
                      textShadow: videoFeedback === "win"
                        ? "0 0 30px rgba(0,230,118,0.8), 0 0 60px rgba(0,230,118,0.4), 0 4px 12px rgba(0,0,0,0.9)"
                        : "0 0 30px rgba(255,68,68,0.6), 0 0 60px rgba(255,68,68,0.3), 0 4px 12px rgba(0,0,0,0.9)",
                      WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                    }}
                  >
                    {videoFeedback === "win"
                      ? (lang === "br" ? "GANHOU!" : "YOU WIN!")
                      : (lang === "br" ? "SEM SORTE" : "NO LUCK")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          </div>
          
          {/* Painel LED premium — CREDITO / APOSTA / GANHO / JACKPOT */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "2px",
              padding: "clamp(3px, 0.4vw, 5px)",
              margin: "clamp(8px, 1.2vw, 16px) clamp(8px, 1.2vw, 16px) clamp(6px, 0.8vw, 10px)",
              background: "linear-gradient(180deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.06) 100%)",
              border: "1px solid rgba(212,168,67,0.25)",
              borderRadius: 10,
              flexShrink: 0,
              zIndex: 5,
              boxShadow: "inset 0 1px 0 rgba(212,168,67,0.1), 0 2px 8px rgba(0,0,0,0.3)",
              width: "100%",
            }}
          >
            {[
              { label: lang === "br" ? "CRÉDITO" : "CREDIT", value: saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US"), color: "#00E676" },
              { label: lang === "br" ? "APOSTA" : "BET", value: String(anteBet ? Math.floor(bet * 1.25) : bet), color: "#00E676" },
              { label: lang === "br" ? "GANHO" : "WIN", value: currentWin > 0 ? currentWin.toLocaleString(lang === "br" ? "pt-BR" : "en-US") : "--", color: currentWin > 0 ? "#00E676" : "#555" },
              { label: "JACKPOT", value: jackpotPool.toLocaleString(lang === "br" ? "pt-BR" : "en-US"), color: "#00E676" },
            ].map((item, i) => (
              <div key={i} style={{
                textAlign: "center",
                padding: "clamp(6px, 0.8vw, 10px) clamp(4px, 0.6vw, 8px)",
                background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
                borderRadius: 6,
              }} title={item.label === "JACKPOT" ? t("jackpotTooltip") : undefined}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: "clamp(8px, 0.85vw, 11px)",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "clamp(2px, 0.3vw, 4px)",
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: "clamp(14px, 1.8vw, 22px)",
                  color: item.color,
                  textShadow: item.color !== "#555"
                    ? "0 0 8px rgba(0,230,118,0.5), 0 0 16px rgba(0,230,118,0.15)"
                    : "none",
                  transition: "all 0.3s ease",
                  lineHeight: 1.1,
                  fontVariantNumeric: "tabular-nums",
                  minHeight: "clamp(16px, 2vw, 24px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* MANIVELA — filho direto da cabine, fora do grid */}
          <motion.div
            onClick={handleSpin}
            whileHover={!isSpinning && bet <= saldo ? { scale: 1.08 } : {}}
            whileTap={!isSpinning && bet <= saldo ? { scale: 0.95 } : {}}
            title={lang === "br" ? "Puxar alavanca para girar" : "Pull lever to spin"}
            style={{
              position: "absolute",
              right: "clamp(-18px, -2.2vw, -24px)",
              top: "30%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: isSpinning || bet > saldo ? "not-allowed" : "pointer",
              zIndex: 10,
              opacity: isSpinning ? 0.4 : 1,
              transition: "opacity 0.3s ease",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <motion.div
              animate={{ y: isSpinning ? 35 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                width: "clamp(20px, 2.8vw, 30px)",
                height: "clamp(20px, 2.8vw, 30px)",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #F6E27A, #D4A843, #8B6914)",
                boxShadow: "0 0 12px rgba(212,168,67,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)",
                marginBottom: 3,
                zIndex: 2,
              }}
            />
            <div
              style={{
                width: "clamp(8px, 1vw, 12px)",
                height: "clamp(70px, 12vh, 110px)",
                background: "linear-gradient(90deg, #8B6914, #D4A843, #8B6914)",
                borderRadius: 4,
                boxShadow: "2px 0 6px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                width: "clamp(16px, 2vw, 22px)",
                height: "clamp(6px, 0.8vw, 10px)",
                background: "linear-gradient(180deg, #D4A843, #8B6914)",
                borderRadius: "0 0 4px 4px",
              }}
            />
          </motion.div>

        {/* Fim da cabine */}
        </div>
        {/* Fim da area centralizada */}
        </div>
        
        {/* Bet Controls Bar — FORA da cabine, padrao Classic */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(4px, 0.5vw, 8px)",
            padding: "clamp(6px, 0.8vw, 12px) clamp(8px, 1.5vw, 16px)",
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
            onClick={() => setShowPaytable(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={t("paytable")}
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
            onClick={() => setShowHistory(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={t("history")}
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
          
          {/* Provably Fair Button */}
          <motion.button
            onClick={() => setShowProvablyFair(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Provably Fair"
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
              src={ASSETS.iconProvablyFair}
              alt="Provably Fair"
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: anteBet ? "rgba(212,168,67,0.15)" : "rgba(0,0,0,0.3)",
              border: anteBet ? "1px solid rgba(212,168,67,0.3)" : "1px solid rgba(255,255,255,0.05)",
              borderRadius: "6px",
              color: anteBet ? "#D4A843" : "#666666",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
              padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
              background: autoPlay > 0 ? "rgba(0,230,118,0.1)" : "rgba(255,255,255,0.05)",
              border: autoPlay > 0 ? "1px solid rgba(0,230,118,0.3)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: autoPlay > 0 ? "#00E676" : "#A8A8A8",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.2vw, 13px)",
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
            onClick={() => setShowBuyBonus(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("buyFreeSpins")}
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
  // TELA 5 — FREE SPINS PLAYING (com HUD)
  // ==========================================================================
  
  const renderFSPlaying = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tint dourado sutil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(212,168,67,0.03)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      
      {/* HUD Free Spins — com botao voltar (pede confirmacao) */}
      <div
        style={{
          display: "flex",
          gap: "clamp(8px, 1.2vw, 16px)",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(8px, 1vw, 14px) clamp(12px, 2vw, 24px)",
          background: "linear-gradient(180deg, rgba(212,168,67,0.18), rgba(212,168,67,0.06))",
          borderBottom: "2px solid rgba(255,215,0,0.3)",
          flexShrink: 0,
          zIndex: 5,
          flexWrap: "wrap",
        }}
      >
        {/* Botao Voltar com confirmacao */}
        <motion.button
          onClick={() => {
            if (fsExitConfirm) {
              setScreen("videoIdle");
              setFreeSpinsRemaining(0);
              setFsMultiplier(1);
              setFsTotalWin(0);
              setCurrentWin(0);
              setIsSpinning(false);
              setFsExitConfirm(false);
            } else {
              setFsExitConfirm(true);
              setTimeout(() => setFsExitConfirm(false), 3000);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "br" ? "Voltar (perde free spins restantes)" : "Back (lose remaining free spins)"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(3px, 0.4vw, 6px)",
            background: fsExitConfirm ? "rgba(255,68,68,0.15)" : "rgba(0,0,0,0.5)",
            border: fsExitConfirm ? "1px solid rgba(255,68,68,0.5)" : "1px solid rgba(255,215,0,0.3)",
            borderRadius: 8,
            padding: "clamp(4px, 0.5vw, 7px) clamp(6px, 0.8vw, 12px)",
            color: fsExitConfirm ? "#FF4444" : "#D4A843",
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(8px, 1vw, 11px)",
            cursor: "pointer",
            minHeight: 36,
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}
        >
          <span style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}>←</span>
          {fsExitConfirm
            ? (lang === "br" ? "CONFIRMAR?" : "CONFIRM?")
            : (lang === "br" ? "SAIR" : "EXIT")}
        </motion.button>

        {/* Badge FREE SPINS */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: "clamp(11px, 1.4vw, 16px)",
            color: "#FFD700",
            textTransform: "uppercase",
            letterSpacing: "3px",
            textShadow: "0 0 12px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
            padding: "clamp(3px, 0.4vw, 6px) clamp(8px, 1vw, 14px)",
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: "8px",
          }}
        >
          FREE SPINS
        </motion.div>

        {/* FS Counter */}
        <motion.div
          key={freeSpinsRemaining}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: "clamp(13px, 1.6vw, 19px)",
            color: "#00E676",
            textShadow: "0 0 10px rgba(0,230,118,0.5)",
          }}
        >
          {freeSpinsRemaining}/{freeSpinsTotal}
        </motion.div>
        
        {/* Separador */}
        <div style={{ width: 1, height: "clamp(16px, 2vw, 24px)", background: "rgba(255,215,0,0.25)" }} />

        {/* Multiplicador */}
        <motion.div
          key={fsMultiplier}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(3px, 0.4vw, 6px)",
          }}
        >
          <img
            src="/assets/games/slots/symbols/multiplier_orb.png"
            alt="Multiplier"
            style={{
              width: "clamp(20px, 2.5vw, 30px)",
              height: "clamp(20px, 2.5vw, 30px)",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 900,
              fontSize: "clamp(14px, 1.8vw, 22px)",
              color: "#FFD700",
              textShadow: "0 0 12px rgba(255,215,0,0.6)",
            }}
          >
            x{fsMultiplier}
          </span>
        </motion.div>

        {/* Separador */}
        <div style={{ width: 1, height: "clamp(16px, 2vw, 24px)", background: "rgba(255,215,0,0.25)" }} />
        
        {/* Total Win */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: "clamp(11px, 1.4vw, 16px)",
            color: "#00E676",
            textShadow: "0 0 8px rgba(0,230,118,0.4)",
          }}
        >
          {t("win")}: {fsTotalWin.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC
        </div>

        {/* Separador */}
        <div style={{ width: 1, height: "clamp(16px, 2vw, 24px)", background: "rgba(255,215,0,0.25)" }} />

        {/* Saldo */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(3px, 0.4vw, 5px)" }}>
          <img src={ASSETS.iconGcoin} alt="GCoin" style={{ width: "clamp(12px, 1.3vw, 16px)", height: "clamp(12px, 1.3vw, 16px)" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "clamp(11px, 1.4vw, 16px)",
              color: "#00E676",
              textShadow: "0 0 6px rgba(0,230,118,0.3)",
            }}
          >
            {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}
          </span>
        </div>
      </div>
      
      {/* Grid Area (frame dourado mais forte para FS) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(4px, 0.6vw, 10px)",
          minHeight: 0,
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* Frame Dourado FS */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 40px rgba(255,215,0,0.12), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)",
              "0 0 50px rgba(255,215,0,0.2), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)",
              "0 0 40px rgba(255,215,0,0.12), 0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "relative",
            padding: "clamp(4px, 0.6vw, 10px)",
            border: "2px solid #FFD700",
            outline: "3px solid rgba(255,215,0,0.25)",
            outlineOffset: "4px",
            borderRadius: "18px",
            background: "linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)",
            width: "clamp(280px, 65vw, 560px)",
            maxHeight: "clamp(200px, 42vh, 360px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
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
          
          {/* Grid 8x4 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              gap: "clamp(2px, 0.3vw, 4px)",
              width: "100%",
              aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
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
                          ? "radial-gradient(circle, rgba(100,180,255,0.06) 0%, transparent 70%)"
                          : "rgba(255,255,255,0.03)",
                        border: isScatter
                          ? "1px solid rgba(100,180,255,0.25)"
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
        </motion.div>
        
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
          {t("win")}: {currentWin > 0 ? `${currentWin.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC` : "-- GC"}
        </div>
      </div>
      
      {/* Footer FS — spin dourado + bet */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 2vw, 24px)",
          padding: "clamp(6px, 0.8vw, 10px) clamp(12px, 2vw, 20px)",
          background: "rgba(0,0,0,0.6)",
          borderTop: "1px solid rgba(255,215,0,0.2)",
          flexShrink: 0,
          zIndex: 5,
        }}
      >
        {/* Bet display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(4px, 0.5vw, 8px)",
            padding: "clamp(3px, 0.4vw, 6px) clamp(8px, 1vw, 14px)",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: "6px",
          }}
        >
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: "clamp(8px, 1vw, 11px)", color: "#A8A8A8", textTransform: "uppercase", letterSpacing: "1px" }}>
            {t("bet")}:
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "clamp(12px, 1.4vw, 16px)", color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.4)" }}>
            {bet} GC
          </span>
        </div>

        {/* Spin button DOURADO (FS) */}
        <motion.button
          onClick={() => { if (!isSpinning && freeSpinsRemaining > 0) handleSpin(); }}
          disabled={isSpinning || freeSpinsRemaining <= 0}
          whileHover={!isSpinning && freeSpinsRemaining > 0 ? { scale: 1.08 } : {}}
          whileTap={!isSpinning && freeSpinsRemaining > 0 ? { scale: 0.92 } : {}}
          animate={!isSpinning && freeSpinsRemaining > 0 ? {
            boxShadow: [
              "0 0 15px rgba(255,215,0,0.3), 0 4px 12px rgba(0,0,0,0.5)",
              "0 0 25px rgba(255,215,0,0.5), 0 4px 12px rgba(0,0,0,0.5)",
              "0 0 15px rgba(255,215,0,0.3), 0 4px 12px rgba(0,0,0,0.5)",
            ],
          } : {}}
          transition={!isSpinning ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          title={lang === "br" ? "Girar (Free Spin gratuito)" : "Spin (Free Spin)"}
          style={{
            width: "clamp(48px, 6vw, 64px)",
            height: "clamp(48px, 6vw, 64px)",
            borderRadius: "50%",
            background: freeSpinsRemaining > 0
              ? "linear-gradient(135deg, #FFD700 0%, #D4A843 50%, #8B6914 100%)"
              : "linear-gradient(135deg, #444 0%, #333 100%)",
            border: "2px solid rgba(255,255,255,0.2)",
            cursor: freeSpinsRemaining > 0 && !isSpinning ? "pointer" : "not-allowed",
            opacity: isSpinning ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: "clamp(9px, 1.1vw, 12px)",
            color: "#0A0A0A",
            letterSpacing: "1px",
            textTransform: "uppercase",
            minWidth: 44,
            minHeight: 44,
          }}
        >
          {isSpinning ? "..." : t("spin")}
        </motion.button>

        {/* Win atual */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: "clamp(11px, 1.4vw, 16px)",
            color: currentWin > 0 ? "#00E676" : "#555",
            textShadow: currentWin > 0 ? "0 0 8px rgba(0,230,118,0.4)" : "none",
            minWidth: "clamp(60px, 8vw, 100px)",
            textAlign: "center",
          }}
        >
          {currentWin > 0 ? `+${currentWin.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC` : "-- GC"}
        </div>
      </div>
    </motion.div>
  );

  // ==========================================================================
  // TELA 6 — WIN OVERLAY (4 tiers)
  // ==========================================================================
  
  const renderWinOverlay = () => {
    if (!winOverlayData) return null;
    
    const { ratio } = winOverlayData;
    
    // Determinar tier
    let tier: "big" | "mega" | "jackpot" = "big";
    let titleText = t("bigWin");
    let titleStyle: React.CSSProperties = {
      fontFamily: "'Cinzel', serif",
      fontWeight: 800,
      fontSize: "clamp(18px, 3vw, 32px)",
      color: "#FFD700",
      textTransform: "uppercase" as const,
      letterSpacing: "3px",
      textShadow: "0 0 15px rgba(255,215,0,0.5), 0 2px 6px rgba(0,0,0,1)",
    };
    let overlayStyle: React.CSSProperties = {
      position: "absolute" as const,
      inset: 0,
      zIndex: 80,
      background: "rgba(0,0,0,0.5)",
      
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: "clamp(12px, 2vw, 24px)",
    };
    
    if (ratio >= 500) {
      tier = "jackpot";
      titleText = t("jackpotWin");
      titleStyle = {
        ...titleStyle,
        fontWeight: 900,
        fontSize: "clamp(26px, 5vw, 48px)",
        letterSpacing: "5px",
        textShadow: "0 0 30px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4), 0 0 120px rgba(255,215,0,0.2)",
      };
      overlayStyle = {
        ...overlayStyle,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        
      };
    } else if (ratio >= 50) {
      tier = "mega";
      titleText = t("megaWin");
      titleStyle = {
        ...titleStyle,
        fontWeight: 900,
        fontSize: "clamp(22px, 4vw, 40px)",
        letterSpacing: "4px",
        textShadow: "0 0 25px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3), 0 2px 8px rgba(0,0,0,1)",
      };
      overlayStyle = {
        ...overlayStyle,
        zIndex: 90,
        background: "rgba(0,0,0,0.75)",
        
      };
    }
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          x: tier === "jackpot" ? [0, -3, 3, -2, 2, -1, 1, 0] : 0,
        }}
        transition={{ 
          opacity: { duration: 0.3 },
          x: { duration: 0.5, delay: 0.3 },
        }}
        style={overlayStyle}
      >
        {/* Overlay Image */}
        <img
          src={WIN_OVERLAYS[tier]}
          alt={tier}
          style={{
            position: "absolute",
            width: "80%",
            maxWidth: "400px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        
        {/* Titulo */}
        <motion.h2
          initial={{ scale: 0, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
          style={titleStyle}
        >
          {titleText}
        </motion.h2>
        
        {/* Win Amount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: "clamp(18px, 3.5vw, 36px)",
            color: "#00E676",
            textShadow: "0 0 15px rgba(0,230,118,0.6)",
          }}
        >
          +{countUpValue.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC
        </motion.div>
        
        {/* Botao Continuar */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ratio >= 500 ? 4.5 : ratio >= 50 ? 3.5 : 2.5 }}
          onClick={handleWinContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: "clamp(8px, 1.5vw, 16px)",
            padding: "clamp(8px, 1vw, 12px) clamp(20px, 3vw, 36px)",
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
          {t("continue")}
        </motion.button>
      </motion.div>
    );
  };

  // ==========================================================================
  // TELA 7 - CLASSIC SLOT (Maquina Fisica)
  // ==========================================================================

  const handleLeverPull = useCallback(() => {
    if (classicSpinning.some(s => s) || bet > saldo) return;
    setIsLeverPulled(true);
    setTimeout(() => {
      setIsLeverPulled(false);
      handleClassicSpin();
    }, 400);
  }, [classicSpinning, bet, saldo, handleClassicSpin]);

  const renderClassicSlot = () => (
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
      {/* Header - FORA da cabine */}
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
        <motion.button
          onClick={() => {
            setScreen("modeSelect");
            setMode(null);
            setCurrentWin(0);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={t("backTooltip")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(4px, 0.5vw, 8px)",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(212,168,67,0.4)",
            borderRadius: 8,
            padding: "clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 14px)",
            color: "#D4A843",
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            cursor: "pointer",
            minHeight: 44,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: "clamp(12px, 1.2vw, 16px)" }}>←</span>
          {t("back")}
        </motion.button>

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
          {t("classic")} {t("slotMachine")}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 0.8vw, 10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 0.5vw, 6px)" }}>
            <img
              src={ASSETS.iconGcoin}
              alt="GCoin"
              style={{
                width: "clamp(14px, 1.5vw, 20px)",
                height: "clamp(14px, 1.5vw, 20px)",
              }}
            />
            <span
              title={t("balanceTooltip")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(12px, 1.6vw, 18px)",
                color: "#00E676",
                textShadow: "0 0 8px rgba(0,230,118,0.4)",
              }}
            >
              {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}
            </span>
          </div>
          <motion.button
            onClick={() => setShowHelp(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={lang === "br" ? "Ajuda" : "Help"}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(212,168,67,0.08)",
              border: "1px solid rgba(212,168,67,0.25)",
              color: "rgba(212,168,67,0.5)",
              fontFamily: "'Cinzel', serif",
              fontWeight: 700, fontSize: 13,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            ?
          </motion.button>
        </div>
      </div>

      {/* Area central - cabine */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(8px, 1vw, 16px) clamp(32px, 5vw, 48px)",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* CABINE METALICA */}
        <div
          style={{
            width: "clamp(260px, 45vw, 440px)",
            maxHeight: "clamp(280px, 52vh, 480px)",
            background: "linear-gradient(180deg, #2A2215 0%, #1A1610 40%, #0D0B07 100%)",
            border: "3px solid #D4A843",
            borderRadius: 24,
            boxShadow: "0 0 40px rgba(212,168,67,0.1), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,168,67,0.2), inset 0 -2px 0 rgba(0,0,0,0.4)",
            padding: "clamp(8px, 1.5vw, 18px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* PLACA "CLASSIC SLOTS" com luzes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "clamp(8px, 1.5vw, 16px)",
            }}
          >
            {/* Luzes decorativas */}
            <div
              style={{
                display: "flex",
                gap: "clamp(8px, 1.2vw, 14px)",
                marginBottom: "clamp(4px, 0.5vw, 6px)",
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#FFD700",
                    boxShadow: "0 0 8px rgba(255,215,0,0.6)",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                fontSize: "clamp(14px, 2.2vw, 22px)",
                color: "#FFD700",
                textShadow: "0 0 12px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.2)",
                letterSpacing: 4,
                textAlign: "center",
                padding: "clamp(6px, 1vw, 12px) clamp(16px, 3vw, 32px)",
                background: "linear-gradient(180deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)",
                border: "1px solid rgba(212,168,67,0.3)",
                borderRadius: 8,
              }}
            >
              CLASSIC SLOTS
            </div>
          </div>

          {/* JANELA DOS REELS com profundidade */}
          <div
            style={{
              display: "flex",
              gap: "clamp(4px, 0.6vw, 8px)",
              background: "linear-gradient(180deg, #050505 0%, #0A0A0A 50%, #050505 100%)",
              border: "2px solid rgba(212,168,67,0.4)",
              borderRadius: 12,
              padding: "clamp(4px, 0.5vw, 8px)",
              boxShadow: "inset 0 8px 20px rgba(0,0,0,0.8), inset 0 -8px 20px rgba(0,0,0,0.8), 0 0 20px rgba(212,168,67,0.05)",
              position: "relative",
            }}
          >
            {/* Payline indicators - setas */}
            <div
              style={{
                position: "absolute",
                left: -14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid #D4A843",
                filter: "drop-shadow(0 0 4px rgba(212,168,67,0.5))",
                zIndex: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid #D4A843",
                filter: "drop-shadow(0 0 4px rgba(212,168,67,0.5))",
                zIndex: 4,
              }}
            />
            {/* Linha central */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 1,
                background: "rgba(212,168,67,0.2)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />

            {/* 3 REELS */}
            {[0, 1, 2].map((reelIndex) => (
              <div
                key={reelIndex}
                style={{
                  width: "clamp(60px, 10vw, 90px)",
                  height: "clamp(180px, 28vh, 270px)",
                  overflow: "hidden",
                  position: "relative",
                  borderLeft: reelIndex > 0 ? "1px solid rgba(212,168,67,0.1)" : "none",
                }}
              >
                {/* Sombra topo (profundidade) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
                {/* Sombra fundo (profundidade) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />

                {/* Reel inner com animacao */}
                <motion.div
                  animate={
                    classicSpinning[reelIndex]
                      ? { y: [0, -270, -540, -810] }
                      : { y: 0 }
                  }
                  transition={
                    classicSpinning[reelIndex]
                      ? { duration: 0.3, repeat: Infinity, ease: "linear" }
                      : { type: "spring", stiffness: 300, damping: 25 }
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {classicReels[reelIndex]?.map((symbol, symbolIndex) => (
                    <div
                      key={`${reelIndex}-${symbolIndex}`}
                      style={{
                        width: "100%",
                        height: "clamp(60px, 9.3vh, 90px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={symbol.path}
                        alt={symbol.id}
                        style={{
                          width: "75%",
                          height: "75%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* MANIVELA — encaixada na borda da cabine */}
          <motion.div
            onClick={handleLeverPull}
            whileHover={{ scale: 1.05 }}
            title={t("spinTooltip")}
            style={{
              position: "absolute",
              right: "clamp(-18px, -2.2vw, -24px)",
              top: "35%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: classicSpinning.some(s => s) ? "not-allowed" : "pointer",
              zIndex: 10,
              opacity: classicSpinning.some(s => s) ? 0.5 : 1,
            }}
          >
            {/* Bola topo */}
            <motion.div
              animate={{ y: isLeverPulled ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                width: "clamp(20px, 3vw, 28px)",
                height: "clamp(20px, 3vw, 28px)",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #F6E27A, #D4A843, #8B6914)",
                boxShadow: "0 0 10px rgba(212,168,67,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)",
                marginBottom: 4,
                zIndex: 2,
              }}
            />
            {/* Barra vertical */}
            <div
              style={{
                width: "clamp(8px, 1vw, 12px)",
                height: "clamp(80px, 12vh, 120px)",
                background: "linear-gradient(90deg, #8B6914, #D4A843, #8B6914)",
                borderRadius: 4,
                boxShadow: "2px 0 6px rgba(0,0,0,0.4)",
              }}
            />
            {/* Base */}
            <div
              style={{
                width: "clamp(16px, 2vw, 22px)",
                height: "clamp(6px, 0.8vw, 10px)",
                background: "linear-gradient(180deg, #D4A843, #8B6914)",
                borderRadius: "0 0 4px 4px",
              }}
            />
          </motion.div>

          {/* Win/Lose feedback — estilo arcade stamp */}
          <AnimatePresence>
            {classicFeedback && (
              <motion.div
                key={classicFeedback + Date.now()}
                initial={{ opacity: 0, scale: 2.5 }}
                animate={{ opacity: [0, 1, 1, 1, 0], scale: [2.5, 0.9, 1.05, 1, 1] }}
                transition={{ duration: 1.6, times: [0, 0.15, 0.25, 0.35, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                  pointerEvents: "none",
                  background: classicFeedback === "win"
                    ? "radial-gradient(ellipse at center, rgba(0,230,118,0.1) 0%, transparent 60%)"
                    : "radial-gradient(ellipse at center, rgba(255,68,68,0.08) 0%, transparent 60%)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: "clamp(28px, 6vw, 52px)",
                    textTransform: "uppercase",
                    letterSpacing: "clamp(4px, 1vw, 8px)",
                    color: classicFeedback === "win" ? "#00E676" : "#FF4444",
                    textShadow: classicFeedback === "win"
                      ? "0 0 30px rgba(0,230,118,0.8), 0 0 60px rgba(0,230,118,0.4), 0 0 100px rgba(0,230,118,0.2), 0 4px 12px rgba(0,0,0,0.9)"
                      : "0 0 30px rgba(255,68,68,0.6), 0 0 60px rgba(255,68,68,0.3), 0 0 100px rgba(255,68,68,0.15), 0 4px 12px rgba(0,0,0,0.9)",
                    WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                  }}
                >
                  {classicFeedback === "win"
                    ? (lang === "br" ? "GANHOU!" : "YOU WIN!")
                    : (lang === "br" ? "SEM SORTE" : "NO LUCK")}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PAINEL LED INFERIOR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginTop: "clamp(8px, 1.5vw, 16px)",
              padding: "clamp(6px, 1vw, 12px)",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(212,168,67,0.15)",
              borderRadius: 8,
            }}
          >
            {/* Credito */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(8px, 1vw, 11px)",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                {lang === "br" ? "CREDITO" : "CREDIT"}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: "clamp(12px, 1.6vw, 18px)",
                  color: "#00E676",
                  textShadow: "0 0 8px rgba(0,230,118,0.4)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}
              </div>
            </div>
            {/* Aposta */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(8px, 1vw, 11px)",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                {t("bet")}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: "clamp(12px, 1.6vw, 18px)",
                  color: "#D4A843",
                  textShadow: "0 0 8px rgba(212,168,67,0.3)",
                }}
              >
                {bet}
              </div>
            </div>
            {/* Ganho */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(8px, 1vw, 11px)",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                {t("win")}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: "clamp(12px, 1.6vw, 18px)",
                  color: currentWin > 0 ? "#00E676" : "#666666",
                  textShadow: currentWin > 0 ? "0 0 10px rgba(0,230,118,0.5)" : "none",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {currentWin > 0 ? currentWin.toLocaleString(lang === "br" ? "pt-BR" : "en-US") : "--"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar - FORA da cabine, INTEGRADA embaixo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(8px, 1vw, 16px)",
          padding: "clamp(8px, 1vw, 14px) clamp(12px, 2vw, 20px)",
          background: "rgba(0,0,0,0.6)",
          borderTop: "1px solid rgba(212,168,67,0.15)",
          flexShrink: 0,
          zIndex: 5,
          opacity: classicSpinning.some(s => s) ? 0.4 : 1,
          pointerEvents: classicSpinning.some(s => s) ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        <motion.button
          onClick={() => handleBetChange("min")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "br" ? "Aposta minima" : "Minimum bet"}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "#A8A8A8",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            cursor: "pointer",
          }}
        >
          MIN
        </motion.button>

        <motion.button
          onClick={() => handleBetChange("half")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "br" ? "Dividir aposta por 2" : "Halve bet"}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "#A8A8A8",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            cursor: "pointer",
          }}
        >
          ÷2
        </motion.button>

        <div
          style={{
            padding: "clamp(6px, 0.8vw, 10px) clamp(12px, 1.5vw, 18px)",
            background: "rgba(212,168,67,0.08)",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(8px, 0.9vw, 10px)",
              color: "rgba(212,168,67,0.6)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("bet")}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "clamp(12px, 1.5vw, 16px)",
              color: "#D4A843",
            }}
          >
            {bet} GC
          </div>
        </div>

        <motion.button
          onClick={() => handleBetChange("double")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "br" ? "Dobrar aposta" : "Double bet"}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "#A8A8A8",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            cursor: "pointer",
          }}
        >
          x2
        </motion.button>

        <motion.button
          onClick={() => handleBetChange("max")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "br" ? "Aposta maxima" : "Maximum bet"}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: "clamp(4px, 0.5vw, 6px) clamp(8px, 1vw, 12px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "#A8A8A8",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(10px, 1.2vw, 13px)",
            cursor: "pointer",
          }}
        >
          MAX
        </motion.button>

        {/* Spin circular */}
        <motion.button
          onClick={handleLeverPull}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px rgba(0,230,118,0.5)" }}
          whileTap={{ scale: 0.95 }}
          disabled={classicSpinning.some(s => s) || bet > saldo}
          title={t("spinTooltip")}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: classicSpinning.some(s => s)
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
            border: "2px solid rgba(0,230,118,0.3)",
            boxShadow: "0 0 16px rgba(0,230,118,0.3), 0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: classicSpinning.some(s => s) ? "not-allowed" : "pointer",
            opacity: classicSpinning.some(s => s) ? 0.4 : 1,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "clamp(16px, 2vw, 22px)",
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            ▶
          </span>
        </motion.button>

        {/* Voltar ao Video */}
        <motion.button
          onClick={() => {
            setMode("video");
            setScreen("videoIdle");
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title={lang === "br" ? "Trocar para modo Video" : "Switch to Video mode"}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: "clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 16px)",
            background: "rgba(212,168,67,0.08)",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: 8,
            color: "#D4A843",
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            fontSize: "clamp(9px, 1.1vw, 12px)",
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          {t("backToVideo")}
        </motion.button>
      </div>
    </motion.div>
  );
  // ==========================================================================
  // TELA 8 — PAYTABLE MODAL (shared component)
  // ==========================================================================

  // Categorias de simbolos pra PaytableModal shared
  const paytableCategories: PaytableCategory[] = [
    {
      id: "premium",
      label: lang === "br" ? "SIMBOLOS PREMIUM" : "PREMIUM SYMBOLS",
      symbols: (["crown", "ring", "hourglass", "chalice"] as const).map(id => {
        const sym = VIDEO_SYMBOLS.find(s => s.id === id)!;
        const info = PAYTABLE[id];
        return {
          id, name: info.name[lang as "br" | "en"], imagePath: sym.path,
          color: sym.color, payouts: info.payouts as Record<number, number>,
        };
      }),
      payoutLabels: ["8+", "9+", "10+", "11+", "12+"],
    },
    {
      id: "gems",
      label: lang === "br" ? "SIMBOLOS GEMAS" : "GEM SYMBOLS",
      symbols: (["ruby", "sapphire", "emerald", "amethyst", "topaz"] as const).map(id => {
        const sym = VIDEO_SYMBOLS.find(s => s.id === id)!;
        const info = PAYTABLE[id];
        return {
          id, name: info.name[lang as "br" | "en"], imagePath: sym.path,
          color: sym.color, payouts: info.payouts as Record<number, number>,
        };
      }),
      payoutLabels: ["8+", "9+", "10+", "11+", "12+"],
    },
    {
      id: "special",
      label: lang === "br" ? "SIMBOLOS ESPECIAIS" : "SPECIAL SYMBOLS",
      symbols: [{
        id: "scatter",
        name: "Scatter",
        imagePath: VIDEO_SYMBOLS.find(s => s.id === "scatter")!.path,
        color: "#FFD700",
        payouts: { 4: 10, 5: 15, 6: 20 },
        description: lang === "br" ? "Free Spins" : "Free Spins",
      }],
      payoutLabels: ["4+", "5+", "6+"],
    },
  ];

  // PF data memoizado — evita recriar objeto a cada render
  const pfData: PFData = useMemo(() => ({
    serverSeedHash, clientSeed, nonce,
    serverSeed: pfRevealedSeed,
    isValid: pfIsValid,
  }), [serverSeedHash, clientSeed, nonce, pfRevealedSeed, pfIsValid]);

  // Callbacks estaveis para fechar modais (evita recriar a cada render)
  const closePaytable = useCallback(() => setShowPaytable(false), []);
  const closeHistory = useCallback(() => setShowHistory(false), []);
  const closePf = useCallback(() => setShowProvablyFair(false), []);

  // Handler: verificar PF (browser mock — recalcula SHA256)
  const handlePfVerify = useCallback(async () => {
    if (pfVerifying) return;
    setPfIsValid(null);
    setPfVerifying(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setPfRevealedSeed(serverSeed);
      setPfIsValid(true);
    } catch {
      setPfIsValid(false);
    } finally {
      setPfVerifying(false);
    }
  }, [serverSeed, nonce, pfVerifying]);

  // Handler: rotacionar seed
  const handlePfRotate = useCallback(async () => {
    // Salvar seed atual no historico
    if (serverSeed) {
      setSeedHistory(prev => [{
        serverSeed, serverSeedHash, clientSeed, nonce,
        revealedAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }, ...prev].slice(0, 5));
    }
    // Gerar nova sessao
    const session = await createProvablyFairSession();
    setServerSeed(session.serverSeed);
    setServerSeedHash(session.serverSeedHash);
    setClientSeed(session.clientSeed);
    setNonce(0);
    setPfRevealedSeed("");
    setPfIsValid(null);
  }, [serverSeed, serverSeedHash, clientSeed, nonce]);

  // ==========================================================================
  // ==========================================================================
  // TELA 9 — HISTORY (shared component — ver render section)
  // ==========================================================================

  // Colunas do historico para HistoryModal shared
  const historyColumns: HistoryColumn<typeof MOCK_HISTORY[0]>[] = [
    {
      id: "time", label: lang === "br" ? "HORA" : "TIME", width: "20%",
      render: (row) => <span style={{ color: "rgba(255,255,255,0.45)" }}>{row.time}</span>,
    },
    {
      id: "bet", label: lang === "br" ? "APOSTA" : "BET", width: "22%",
      render: (row) => <span style={{ fontWeight: 700 }}>{row.bet} GC</span>,
    },
    {
      id: "win", label: lang === "br" ? "GANHO" : "WIN", width: "28%",
      render: (row) => <WinAmount value={row.win} prefix="GC" />,
    },
    {
      id: "multi", label: "MULTI", width: "30%", align: "right" as const,
      render: (row) => <MultiBadge multi={row.multi} />,
    },
  ];

  // ==========================================================================
  // TELA 10 — BUY BONUS MODAL
  // ==========================================================================
  // MODAL DE AJUDA — "?" com abas
  // ==========================================================================

  const helpTabs = [
    { br: "Como Jogar", en: "How to Play" },
    { br: "Simbolos", en: "Symbols" },
    { br: "Recursos", en: "Features" },
    { br: "Provably Fair", en: "Provably Fair" },
  ];

  const renderHelpModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(8px, 1.5vw, 16px)",
      }}
      onClick={() => setShowHelp(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          width: "clamp(320px, 65vw, 560px)",
          maxHeight: "85vh",
          background: "linear-gradient(180deg, #1A1610 0%, #0F0D08 100%)",
          border: "1.5px solid rgba(212,168,67,0.35)",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,168,67,0.08)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(10px, 1.5vw, 16px) clamp(14px, 2vw, 20px)",
          borderBottom: "1px solid rgba(212,168,67,0.15)",
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 800,
            fontSize: "clamp(14px, 2vw, 20px)",
            color: "#FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.4)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            {lang === "br" ? "Ajuda" : "Help"}
          </span>
          <motion.button
            onClick={() => setShowHelp(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(212,168,67,0.1)",
          padding: "0 clamp(8px, 1vw, 14px)",
          gap: 2,
          flexShrink: 0,
          overflowX: "auto",
        }}>
          {helpTabs.map((tab, i) => (
            <motion.button
              key={i}
              onClick={() => setHelpTab(i)}
              whileHover={{ scale: 1.02 }}
              style={{
                padding: "clamp(8px, 1vw, 12px) clamp(10px, 1.2vw, 16px)",
                fontFamily: "'Cinzel', serif",
                fontWeight: helpTab === i ? 700 : 500,
                fontSize: "clamp(9px, 1.1vw, 12px)",
                color: helpTab === i ? "#FFD700" : "#888",
                background: helpTab === i ? "rgba(212,168,67,0.1)" : "transparent",
                border: "none",
                borderBottom: helpTab === i ? "2px solid #D4A843" : "2px solid transparent",
                cursor: "pointer",
                letterSpacing: 1,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              {lang === "br" ? tab.br : tab.en}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "clamp(12px, 1.5vw, 20px)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(11px, 1.2vw, 14px)",
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.8,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={helpTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {helpTab === 0 && (
                <div>
                  <h3 style={{ color: "#D4A843", fontFamily: "'Cinzel', serif", fontSize: "clamp(13px, 1.5vw, 17px)", marginBottom: 12, fontWeight: 700 }}>
                    {lang === "br" ? "Como Jogar" : "How to Play"}
                  </h3>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "O Slot Machine possui dois modos: Video Slot (grid 8x4 com Tumble Cascade) e Classic Slot (3 rolos tradicionais com paylines)."
                      : "The Slot Machine has two modes: Video Slot (8x4 grid with Tumble Cascade) and Classic Slot (3 traditional reels with paylines)."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>Video Slot:</p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "1. Ajuste sua aposta usando os botoes MIN, /2, x2, MAX. 2. Clique SPIN ou puxe a manivela. 3. Simbolos caem no grid 8x4. 4. Se 8+ simbolos iguais aparecerem em qualquer posicao, voce ganha! 5. Simbolos vencedores explodem e novos caem de cima (Tumble). 6. O processo repete ate nao haver mais vitorias. 7. Voce paga UMA vez, todos os tumbles sao gratis."
                      : "1. Adjust your bet using MIN, /2, x2, MAX buttons. 2. Click SPIN or pull the lever. 3. Symbols drop into the 8x4 grid. 4. If 8+ matching symbols land anywhere, you win! 5. Winning symbols explode and new ones fall from above (Tumble). 6. This repeats until no more wins occur. 7. You pay ONCE, all tumbles are free."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>Classic Slot:</p>
                  <p>
                    {lang === "br"
                      ? "3 rolos verticais com simbolos classicos (7, BAR, cereja, diamante, sino, limao, estrela). Alinhe simbolos iguais nas paylines para ganhar. Puxe a manivela ou clique SPIN."
                      : "3 vertical reels with classic symbols (7, BAR, cherry, diamond, bell, lemon, star). Match symbols on paylines to win. Pull the lever or click SPIN."}
                  </p>
                </div>
              )}

              {helpTab === 1 && (
                <div>
                  <h3 style={{ color: "#D4A843", fontFamily: "'Cinzel', serif", fontSize: "clamp(13px, 1.5vw, 17px)", marginBottom: 12, fontWeight: 700 }}>
                    {lang === "br" ? "Simbolos e Pagamentos" : "Symbols & Payouts"}
                  </h3>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 8 }}>
                    {lang === "br" ? "Simbolos Premium (Video):" : "Premium Symbols (Video):"}
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Coroa, Anel, Ampulheta, Calice — pagam mais. Precisam de 8+ para vencer."
                      : "Crown, Ring, Hourglass, Chalice — pay more. Need 8+ to win."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 8 }}>
                    {lang === "br" ? "Gemas (Video):" : "Gems (Video):"}
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Rubi, Safira, Esmeralda, Ametista, Topazio — pagam menos, aparecem mais."
                      : "Ruby, Sapphire, Emerald, Amethyst, Topaz — pay less, appear more often."}
                  </p>
                  <p style={{ color: "#FFD700", fontWeight: 600, marginBottom: 8 }}>
                    {lang === "br" ? "Simbolos Especiais:" : "Special Symbols:"}
                  </p>
                  <p style={{ marginBottom: 8 }}>
                    {lang === "br"
                      ? "Scatter — 4+ ativam Free Spins. Multiplier Orb — aparece durante Free Spins, soma ao multiplicador total."
                      : "Scatter — 4+ trigger Free Spins. Multiplier Orb — appears during Free Spins, adds to total multiplier."}
                  </p>
                </div>
              )}

              {helpTab === 2 && (
                <div>
                  <h3 style={{ color: "#D4A843", fontFamily: "'Cinzel', serif", fontSize: "clamp(13px, 1.5vw, 17px)", marginBottom: 12, fontWeight: 700 }}>
                    {lang === "br" ? "Recursos do Jogo" : "Game Features"}
                  </h3>
                  <p style={{ color: "#00E676", fontWeight: 600, marginBottom: 6 }}>Tumble Cascade:</p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Apos cada vitoria, simbolos vencedores sao removidos e novos caem. Isso pode criar vitorias consecutivas em um unico spin. Maximo de 20 cascatas por rodada."
                      : "After each win, winning symbols are removed and new ones fall. This can create consecutive wins from a single spin. Maximum 20 cascades per round."}
                  </p>
                  <p style={{ color: "#FFD700", fontWeight: 600, marginBottom: 6 }}>Free Spins:</p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "4+ Scatters ativam rodadas gratis. Multiplicadores sao CUMULATIVOS durante Free Spins — cada orbe soma ao total. 3+ Scatters durante FS concedem +5 spins extras."
                      : "4+ Scatters trigger free rounds. Multipliers are CUMULATIVE during Free Spins — each orb adds to total. 3+ Scatters during FS grant +5 extra spins."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>Buy Bonus:</p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Pague 100x sua aposta para entrar diretamente em Free Spins sem esperar Scatters."
                      : "Pay 100x your bet to enter Free Spins directly without waiting for Scatters."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>Ante Bet:</p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Ative para aumentar sua aposta em 25% e dobrar a chance de ativar Free Spins."
                      : "Activate to increase your bet by 25% and double the chance of triggering Free Spins."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>Jackpot:</p>
                  <p>
                    {lang === "br"
                      ? "1.5% de cada aposta contribui para o jackpot progressivo. Vitorias acima de 500x seu bet ativam o Jackpot."
                      : "1.5% of each bet contributes to the progressive jackpot. Wins above 500x your bet trigger the Jackpot."}
                  </p>
                </div>
              )}

              {helpTab === 3 && (
                <div>
                  <h3 style={{ color: "#D4A843", fontFamily: "'Cinzel', serif", fontSize: "clamp(13px, 1.5vw, 17px)", marginBottom: 12, fontWeight: 700 }}>
                    Provably Fair
                  </h3>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "Este jogo usa o sistema Provably Fair com HMAC-SHA256, o mesmo padrao do Stake.com. Cada resultado pode ser verificado matematicamente."
                      : "This game uses the Provably Fair system with HMAC-SHA256, the same standard as Stake.com. Every result can be mathematically verified."}
                  </p>
                  <p style={{ color: "#D4A843", fontWeight: 600, marginBottom: 6 }}>
                    {lang === "br" ? "Como funciona:" : "How it works:"}
                  </p>
                  <p style={{ marginBottom: 12 }}>
                    {lang === "br"
                      ? "1. O servidor gera uma Server Seed e publica seu hash SHA-256 ANTES de voce jogar. 2. Voce define sua Client Seed (pode mudar a qualquer momento). 3. Cada spin usa: HMAC_SHA256(server_seed, client_seed:nonce). 4. Ao rotacionar a seed, a Server Seed real eh revelada. 5. Voce pode verificar: SHA256(seed_revelada) == hash_publicado."
                      : "1. The server generates a Server Seed and publishes its SHA-256 hash BEFORE you play. 2. You set your Client Seed (can change anytime). 3. Each spin uses: HMAC_SHA256(server_seed, client_seed:nonce). 4. When you rotate seeds, the real Server Seed is revealed. 5. You can verify: SHA256(revealed_seed) == published_hash."}
                  </p>
                  <p style={{ color: "#00E676", fontWeight: 600 }}>
                    RTP: 96.50% | {lang === "br" ? "Volatilidade: Alta" : "Volatility: High"}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderBuyBonusModal = () => {
    const cost = bet * 100;
    const canAfford = cost <= saldo;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowBuyBonus(false)}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 90,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(135deg, rgba(26,26,46,0.95), rgba(10,10,10,0.98))",
            border: "1px solid rgba(212,168,67,0.5)",
            borderRadius: "18px",
            padding: "clamp(24px, 4vw, 48px)",
            textAlign: "center",
            boxShadow: "0 0 80px rgba(212,168,67,0.15)",
            maxWidth: "clamp(280px, 50vw, 420px)",
          }}
        >
          {/* Scatter Icon */}
          <img
            src="/assets/games/slots/symbols/scatter.png"
            alt="Free Spins"
            style={{
              width: "64px",
              height: "64px",
              marginBottom: "clamp(12px, 1.5vw, 20px)",
            }}
          />
          
          {/* Title */}
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(16px, 2.2vw, 24px)",
              color: "#D4A843",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "clamp(6px, 0.8vw, 10px)",
              textShadow: "0 0 15px rgba(212,168,67,0.4)",
            }}
          >
            {t("buyFreeSpins")}
          </h2>
          
          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(11px, 1.3vw, 15px)",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "clamp(16px, 2vw, 24px)",
            }}
          >
            {t("guaranteedSpins")}
          </p>
          
          {/* Cost */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.5vw, 28px)",
              color: "#FFD700",
              textShadow: "0 0 12px rgba(255,215,0,0.4)",
              marginBottom: "clamp(6px, 0.8vw, 10px)",
            }}
          >
            {t("cost")}: {cost.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC
          </div>
          
          {/* Current Balance */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(10px, 1.2vw, 14px)",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "clamp(20px, 2.5vw, 32px)",
            }}
          >
            {t("currentBalance")}: {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")} GC
          </p>
          
          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "clamp(10px, 1.2vw, 16px)",
              justifyContent: "center",
            }}
          >
            {/* Cancel */}
            <motion.button
              onClick={() => setShowBuyBonus(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "clamp(10px, 1.2vw, 14px) clamp(20px, 2.5vw, 32px)",
                background: "transparent",
                border: "1.5px solid rgba(212,168,67,0.4)",
                borderRadius: "10px",
                color: "#D4A843",
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "clamp(11px, 1.3vw, 15px)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              {t("cancel")}
            </motion.button>
            
            {/* Confirm */}
            <motion.button
              onClick={handleBuyBonus}
              disabled={!canAfford}
              whileHover={canAfford ? { scale: 1.05 } : {}}
              whileTap={canAfford ? { scale: 0.95 } : {}}
              style={{
                padding: "clamp(10px, 1.2vw, 14px) clamp(20px, 2.5vw, 32px)",
                background: canAfford
                  ? "linear-gradient(180deg, #00C853 0%, #004D25 100%)"
                  : "rgba(128,128,128,0.3)",
                border: canAfford
                  ? "1.5px solid rgba(0,230,118,0.3)"
                  : "1.5px solid rgba(128,128,128,0.3)",
                borderRadius: "10px",
                color: canAfford ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                fontSize: "clamp(11px, 1.3vw, 15px)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: canAfford ? "pointer" : "not-allowed",
                minHeight: "44px",
              }}
            >
              {t("confirm")}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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
      {/* Keyframes — copiados do SpotlightLayout (Hero) */}
      <style>{`
        @keyframes slotsShimmerSweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes slotsSpotlightBreathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        @keyframes slotsFloatParticle {
          0% { opacity: 0; transform: translateY(8px) scale(0.4); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-35px) scale(0.15); }
        }
        .slots-modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .slots-modal-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        .slots-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(212,168,67,0.3);
          border-radius: 3px;
        }
        .slots-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(212,168,67,0.5);
        }
      `}</style>

      {/* Header Global — so aparece no modeSelect */}
      {screen === "modeSelect" && (
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(6px, 0.8vw, 10px) clamp(8px, 1.5vw, 16px)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Botao Voltar */}
        <motion.button
          onClick={screen === "modeSelect" ? onBack : () => {
            setScreen("modeSelect");
            setMode(null);
            setCurrentWin(0);
          }}
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
              GC {saldo.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}
            </span>
          </div>
        )}
      </header>
      )}
      
      {/* Conteudo da Tela */}
      <AnimatePresence mode="wait">
        {screen === "modeSelect" && renderModeSelect()}
        {(screen === "videoIdle" || screen === "spinning") && renderVideoSlot()}
        {screen === "fsPlaying" && renderFSPlaying()}
        {(screen === "classicIdle" || screen === "classicSpinning") && renderClassicSlot()}
      </AnimatePresence>
      
      {/* Overlay Free Spins Trigger */}
      <AnimatePresence>
        {screen === "fsTrigger" && renderFSTrigger()}
      </AnimatePresence>
      
      {/* Win Overlay */}
      <AnimatePresence>
        {screen === "winOverlay" && renderWinOverlay()}
      </AnimatePresence>
      
      {/* Paytable Modal (shared) */}
      <PaytableModal
        open={showPaytable}
        onClose={closePaytable}
        title={lang === "br" ? "TABELA DE PAGAMENTOS" : "PAYTABLE"}
        lang={lang === "en" ? "in" : "br"}
        categories={paytableCategories}
        footerInfo={
          <span>RTP: 96.50% | {lang === "br" ? "Grid 8x4 | Scatter Pays 8+ OAK" : "Grid 8x4 | Scatter Pays 8+ OAK"}</span>
        }
      />

      {/* History Modal (shared) */}
      <HistoryModal
        open={showHistory}
        onClose={closeHistory}
        title={lang === "br" ? "HISTORICO" : "HISTORY"}
        lang={lang === "en" ? "in" : "br"}
        columns={historyColumns}
        data={MOCK_HISTORY}
      />

      {/* Provably Fair Modal (shared) */}
      <ProvablyFairModal
        open={showProvablyFair}
        onClose={closePf}
        lang={lang === "en" ? "in" : "br"}
        pfData={pfData}
        seedHistory={seedHistory}
        onClientSeedChange={setClientSeed}
        onVerify={handlePfVerify}
        onRotateSeed={handlePfRotate}
        verifying={pfVerifying}
      />

      {/* Buy Bonus Modal */}
      <AnimatePresence>
        {showBuyBonus && renderBuyBonusModal()}
        {showHelp && renderHelpModal()}
      </AnimatePresence>

      {/* Dev Toolbar — so aparece no localhost */}
      <DevToolbar
        currentScreen={screen}
        screens={[
          { key: "1", label: "Mode Select", action: () => { setScreen("modeSelect"); setMode(null); } },
          { key: "2", label: "Video Idle", action: () => { setScreen("videoIdle"); setMode("video"); } },
          { key: "3", label: "Spinning", action: () => { setScreen("spinning"); setMode("video"); } },
          { key: "4", label: "FS Trigger", action: () => { setScreen("fsTrigger"); setFreeSpinsTotal(10); setFreeSpinsRemaining(10); } },
          { key: "5", label: "FS Playing", action: () => { setScreen("fsPlaying"); setFreeSpinsTotal(10); setFreeSpinsRemaining(7); setFsMultiplier(12); setFsTotalWin(450); } },
          { key: "6", label: "Win Overlay", action: () => { setWinOverlayData({ amount: 250, ratio: 25 }); setScreen("winOverlay"); } },
          { key: "7", label: "Classic Idle", action: () => { setScreen("classicIdle"); setMode("classic"); } },
          { key: "8", label: "Paytable", action: () => setShowPaytable(true) },
          { key: "9", label: "History", action: () => setShowHistory(true) },
          { key: "0", label: "Buy Bonus", action: () => setShowBuyBonus(true) },
        ]}
        extraInfo={{
          saldo: saldo,
          bet: bet,
          mode: mode || "none",
          fsRemaining: freeSpinsRemaining,
          nonce: nonce,
        }}
      />
    </motion.div>
  );
}
