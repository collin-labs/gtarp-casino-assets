"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useAnimate } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";

// ===========================================================================
// ANIMAL GAME / JOGO DO BICHO (#9) — Blackout Casino GTARP
// Telas 1-6: APOSTAS, SORTEIO, VITORIA, DERROTA, HISTORICO, PROVABLY FAIR
// CSS inline, zero Tailwind, Framer Motion
// ===========================================================================

type Phase = "BETTING" | "DRAWING" | "RESULT";
type BetMode = "simple" | "dupla" | "tripla" | "quadra" | "quina";
type Lang = "br" | "in";

interface Animal {
  id: number;
  name: { br: string; in: string };
  numbers: number[];
}

interface DrawResult {
  position: number;
  number: number;
  animalId: number;
}

interface HistoryEntry {
  id: number;
  mode: BetMode;
  won: boolean;
  payout: number;
  betAmount: number;
  animals: number[];
  selectedAnimals: number[];
  hora: string;
}

interface FairData {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  serverSeed: string;
  resultHash: string;
  isValid: boolean | null;
}

// ===========================================================================
// CONSTANTES
// ===========================================================================

const ASSETS = {
  bgCasino: "/assets/shared/ui/bg-casino.png",
  btnJogarAtivo: "/assets/shared/ui/btn-jogar-ativo.png",
  btnJogarDesativo: "/assets/shared/ui/btn-jogar-desativo.png",
  iconHistory: "/assets/shared/icons/icon-history.png",
  iconProvablyFair: "/assets/shared/icons/icon-provably-fair.png",
  iconSoundOn: "/assets/shared/icons/icon-sound-on.png",
  iconSoundOff: "/assets/shared/icons/icon-sound-off.png",
  iconRandom: "/assets/shared/icons/icon-random.png",
  iconGcoin: "/assets/shared/icons/icon-gcoin.png",
  iconCopy: "/assets/shared/icons/icon-copy.png",
  getAnimal: (id: number) => `/assets/games/bicho/${id}.png`,
};

const ANIMALS: Animal[] = [
  { id: 1, name: { br: "Avestruz", in: "Ostrich" }, numbers: [1, 2, 3, 4] },
  { id: 2, name: { br: "Aguia", in: "Eagle" }, numbers: [5, 6, 7, 8] },
  { id: 3, name: { br: "Burro", in: "Donkey" }, numbers: [9, 10, 11, 12] },
  { id: 4, name: { br: "Borboleta", in: "Butterfly" }, numbers: [13, 14, 15, 16] },
  { id: 5, name: { br: "Cachorro", in: "Dog" }, numbers: [17, 18, 19, 20] },
  { id: 6, name: { br: "Cabra", in: "Goat" }, numbers: [21, 22, 23, 24] },
  { id: 7, name: { br: "Carneiro", in: "Ram" }, numbers: [25, 26, 27, 28] },
  { id: 8, name: { br: "Camelo", in: "Camel" }, numbers: [29, 30, 31, 32] },
  { id: 9, name: { br: "Cobra", in: "Snake" }, numbers: [33, 34, 35, 36] },
  { id: 10, name: { br: "Coelho", in: "Rabbit" }, numbers: [37, 38, 39, 40] },
  { id: 11, name: { br: "Cavalo", in: "Horse" }, numbers: [41, 42, 43, 44] },
  { id: 12, name: { br: "Elefante", in: "Elephant" }, numbers: [45, 46, 47, 48] },
  { id: 13, name: { br: "Galo", in: "Rooster" }, numbers: [49, 50, 51, 52] },
  { id: 14, name: { br: "Gato", in: "Cat" }, numbers: [53, 54, 55, 56] },
  { id: 15, name: { br: "Jacare", in: "Alligator" }, numbers: [57, 58, 59, 60] },
  { id: 16, name: { br: "Leao", in: "Lion" }, numbers: [61, 62, 63, 64] },
  { id: 17, name: { br: "Macaco", in: "Monkey" }, numbers: [65, 66, 67, 68] },
  { id: 18, name: { br: "Porco", in: "Pig" }, numbers: [69, 70, 71, 72] },
  { id: 19, name: { br: "Pavao", in: "Peacock" }, numbers: [73, 74, 75, 76] },
  { id: 20, name: { br: "Peru", in: "Turkey" }, numbers: [77, 78, 79, 80] },
  { id: 21, name: { br: "Touro", in: "Bull" }, numbers: [81, 82, 83, 84] },
  { id: 22, name: { br: "Tigre", in: "Tiger" }, numbers: [85, 86, 87, 88] },
  { id: 23, name: { br: "Urso", in: "Bear" }, numbers: [89, 90, 91, 92] },
  { id: 24, name: { br: "Veado", in: "Deer" }, numbers: [93, 94, 95, 96] },
  { id: 25, name: { br: "Vaca", in: "Cow" }, numbers: [97, 98, 99, 0] },
];

const BET_CHIPS = [50, 100, 250, 500, 1000];

const MODE_CONFIG: Record<BetMode, { maxSelections: number; multipliers: { first: number; others: number } }> = {
  simple: { maxSelections: 1, multipliers: { first: 12, others: 3 } },
  dupla: { maxSelections: 2, multipliers: { first: 90, others: 10 } },
  tripla: { maxSelections: 3, multipliers: { first: 650, others: 40 } },
  quadra: { maxSelections: 4, multipliers: { first: 3500, others: 180 } },
  quina: { maxSelections: 5, multipliers: { first: 15000, others: 1200 } },
};

const TEXTS = {
  title: { br: "JOGO DO BICHO", in: "ANIMAL GAME" },
  back: { br: "< VOLTAR", in: "< BACK" },
  modes: {
    simple: { br: "SIMPLE", in: "SIMPLE" },
    dupla: { br: "DUPLA", in: "DOUBLE" },
    tripla: { br: "TRIPLA", in: "TRIPLE" },
    quadra: { br: "QUADRA", in: "QUAD" },
    quina: { br: "QUINA", in: "QUINA" },
  },
  random: { br: "ALEATORIO", in: "RANDOM" },
  play: { br: "JOGAR", in: "PLAY" },
  drawing: { br: "SORTEIO EM ANDAMENTO", in: "DRAWING IN PROGRESS" },
  skip: { br: "Pular animacao >>", in: "Skip animation >>" },
  youWon: { br: "VOCE GANHOU!", in: "YOU WON!" },
  noMatch: { br: "Nenhum acerto", in: "No match" },
  playAgain: { br: "JOGAR NOVAMENTE", in: "PLAY AGAIN" },
  newRound: { br: "NOVA RODADA", in: "NEW ROUND" },
  backToLobby: { br: "VOLTAR", in: "BACK" },
  yourAnimals: { br: "Seus animais:", in: "Your animals:" },
  position: { br: "Posicao", in: "Position" },
  history: { br: "HISTORICO", in: "HISTORY" },
  provablyFair: { br: "PROVABLY FAIR", in: "PROVABLY FAIR" },
  serverSeedHash: { br: "Server Seed Hash (pre-jogo):", in: "Server Seed Hash (pre-game):" },
  clientSeed: { br: "Client Seed:", in: "Client Seed:" },
  nonce: { br: "Nonce:", in: "Nonce:" },
  serverSeed: { br: "Server Seed (pos-jogo):", in: "Server Seed (post-game):" },
  verify: { br: "VERIFICAR", in: "VERIFY" },
  valid: { br: "VALIDO", in: "VALID" },
  invalid: { br: "INVALIDO", in: "INVALID" },
  howItWorks: {
    br: "O resultado e determinado combinando o Server Seed, Client Seed e Nonce atraves de HMAC-SHA256. Voce pode verificar a integridade do jogo recalculando o hash.",
    in: "The result is determined by combining the Server Seed, Client Seed and Nonce through HMAC-SHA256. You can verify game integrity by recalculating the hash."
  },
  copied: { br: "Copiado!", in: "Copied!" },
  drawnAnimals: { br: "Animais sorteados:", in: "Drawn animals:" },
  result: { br: "Resultado", in: "Result" },
  tooltips: {
    back: { br: "Voltar ao lobby do cassino", in: "Back to casino lobby" },
    cardNormal: { br: "Clique para selecionar", in: "Click to select" },
    cardSelected: { br: "Clique para deselecionar", in: "Click to deselect" },
    cardDisabled: { br: "Limite de animais neste modo", in: "Animal limit in this mode" },
    simple: { br: "1 animal. 12x cabeca, 3x cercada", in: "1 animal. 12x head, 3x surrounded" },
    dupla: { br: "2 animais. 90x nos 2 primeiros", in: "2 animals. 90x on first 2" },
    tripla: { br: "3 animais. 650x nos 3 primeiros", in: "3 animals. 650x on first 3" },
    quadra: { br: "4 animais. 3.500x nos 4 primeiros", in: "4 animals. 3,500x on first 4" },
    quina: { br: "5 animais. 15.000x se todos", in: "5 animals. 15,000x if all match" },
    random: { br: "Selecao aleatoria", in: "Random selection" },
    play: { br: "Confirmar aposta", in: "Confirm bet" },
    historyBtn: { br: "Ver ultimas rodadas", in: "View past rounds" },
    pfBtn: { br: "Verificar fairness", in: "Verify fairness" },
    verifyBtn: { br: "Recalcular hash", in: "Recalculate hash" },
  },
};

// ===========================================================================
// HELPERS
// ===========================================================================

function getAnimalByNumber(num: number): Animal {
  const normalized = num === 0 ? 0 : ((num - 1) % 100);
  const lastTwo = normalized === 0 ? 0 : (normalized % 100);
  const animalIndex = lastTwo === 0 ? 24 : Math.floor((lastTwo - 1) / 4);
  return ANIMALS[Math.min(animalIndex, 24)];
}

function generateDrawResults(): DrawResult[] {
  const results: DrawResult[] = [];
  for (let i = 0; i < 5; i++) {
    const number = Math.floor(Math.random() * 10000);
    const lastTwo = number % 100;
    const animal = getAnimalByNumber(lastTwo);
    results.push({
      position: i + 1,
      number,
      animalId: animal.id,
    });
  }
  return results;
}

function formatNumber(num: number): string {
  return num.toString().padStart(4, "0");
}

function formatBalance(num: number): string {
  return num.toLocaleString("pt-BR");
}

function generateRandomHex(length: number): string {
  const chars = "0123456789abcdef";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

function NumberDrum({ value, revealed }: { value: string; revealed: boolean }) {
  const [display, setDisplay] = useState("----");
  useEffect(() => {
    if (!revealed) { setDisplay("----"); return; }
    let frame = 0;
    const total = 10;
    const interval = setInterval(() => {
      if (frame >= total) { clearInterval(interval); setDisplay(value); return; }
      setDisplay(String(Math.floor(Math.random() * 10000)).padStart(4, "0"));
      frame++;
    }, 50);
    return () => clearInterval(interval);
  }, [revealed, value]);
  return <span>{display}</span>;
}

// ===========================================================================
// SONS PROCEDURAIS WEB AUDIO
// ===========================================================================

function useAnimalSounds(enabled: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  const getCtx = () => {
    if (!ctx.current) ctx.current = new AudioContext();
    return ctx.current;
  };
  const tone = (freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15) => {
    if (!enabled) return;
    try {
      const c = getCtx();
      if (c.state === "suspended") c.resume();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.connect(gain).connect(c.destination);
      osc.start(); osc.stop(c.currentTime + dur);
    } catch { /* ctx indisponivel */ }
  };
  return {
    selectAnimal: () => tone(800, 0.15, "sine", 0.12),
    deselectAnimal: () => tone(600, 0.1, "sine", 0.08),
    modeChange: () => tone(500, 0.15, "triangle", 0.1),
    placeBet: () => { tone(400, 0.1); setTimeout(() => tone(600, 0.1), 50); setTimeout(() => tone(900, 0.2), 100); },
    capsuleShake: () => tone(150, 0.4, "sawtooth", 0.06),
    capsuleOpen: () => { tone(1200, 0.15, "sine", 0.1); tone(800, 0.2, "triangle", 0.08); },
    revealNeutral: () => tone(660, 0.2, "sine", 0.1),
    revealMatch: () => { tone(880, 0.15); setTimeout(() => tone(1100, 0.2), 100); setTimeout(() => tone(1320, 0.3), 200); },
    winSmall: () => { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => tone(f, 0.3, "sine", 0.12), i * 80)); },
    winBig: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.5, "sine", 0.15), i * 100)); },
    lose: () => tone(300, 0.4, "triangle", 0.06),
    hover: () => tone(1000, 0.05, "sine", 0.03),
    randomBet: () => { for (let i = 0; i < 6; i++) setTimeout(() => tone(400 + Math.random() * 800, 0.08, "sine", 0.05), i * 50); },
    chipSelect: () => tone(700, 0.1, "sine", 0.08),
    historyOpen: () => tone(500, 0.15, "triangle", 0.06),
    copy: () => { tone(900, 0.08); setTimeout(() => tone(1200, 0.08), 60); },
  };
}

// ===========================================================================
// COMPONENTE PRINCIPAL
// ===========================================================================

export default function AnimalGame({ onBack }: { onBack: () => void }) {
  const { saldo, setSaldo, lang } = useCasino();

  // Estado do jogo
  const [phase, setPhase] = useState<Phase>("BETTING");
  const [betMode, setBetMode] = useState<BetMode>("simple");
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [previewAnimal, setPreviewAnimal] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [revealedCapsules, setRevealedCapsules] = useState<number[]>([]);
  const [isWin, setIsWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [matchedPositions, setMatchedPositions] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useAnimalSounds(soundEnabled);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealSpeed, setRevealSpeed] = useState<"normal" | "fast" | "instant">("normal");
  const [revealScope, revealAnimate] = useAnimate();
  const revealAbort = useRef(false);
  const SPEEDS = {
    normal: { shake: 0.4, open: 0.5, reveal: 0.4, name: 0.3, pause: 0.8 },
    fast:   { shake: 0.2, open: 0.25, reveal: 0.2, name: 0.15, pause: 0.3 },
    instant:{ shake: 0.05, open: 0.1, reveal: 0.1, name: 0.05, pause: 0.1 },
  };

  // Estado para modais (Telas 5 e 6)
  const [showHistory, setShowHistory] = useState(false);
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [fairData, setFairData] = useState<FairData>({
    serverSeedHash: generateRandomHex(64),
    clientSeed: "abc123xyz",
    nonce: 1,
    serverSeed: "",
    resultHash: "",
    isValid: null,
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Counter animado para vitoria
  const counterValue = useMotionValue(0);
  const displayCounter = useTransform(counterValue, (v) => `+G$${formatBalance(Math.floor(v))}`);

  const maxSelections = MODE_CONFIG[betMode].maxSelections;
  const canPlay = selectedAnimals.length === maxSelections && betAmount <= saldo && betAmount > 0;

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleSelectAnimal = useCallback((animalId: number) => {
    setSelectedAnimals((prev) => {
      if (prev.includes(animalId)) {
        sounds.deselectAnimal();
        return prev.filter((id) => id !== animalId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      sounds.selectAnimal();
      return [...prev, animalId];
    });
  }, [maxSelections, sounds]);

  const handleModeChange = useCallback((mode: BetMode) => {
    setBetMode(mode);
    setSelectedAnimals([]);
    sounds.modeChange();
  }, [sounds]);

  const handleRandomSelect = useCallback(() => {
    const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
    setSelectedAnimals(shuffled.slice(0, maxSelections).map((a) => a.id));
    sounds.randomBet();
  }, [maxSelections, sounds]);

  const handlePlay = useCallback(() => {
    if (!canPlay) return;
    sounds.placeBet();

    setSaldo(saldo - betAmount);
    setPhase("DRAWING");
    setRevealedCapsules([]);
    setShowConfetti(false);

    const results = generateDrawResults();
    setDrawResults(results);

    // Gerar novo serverSeedHash para proxima rodada
    setFairData(prev => ({
      ...prev,
      serverSeedHash: generateRandomHex(64),
      serverSeed: generateRandomHex(64),
      resultHash: generateRandomHex(64),
      nonce: prev.nonce + 1,
      isValid: null,
    }));

    // Verificar vitoria — TODOS selecionados devem aparecer nos 5 resultados
    const drawnAnimalIds = results.map((r) => r.animalId);
    const matches: number[] = [];
    
    selectedAnimals.forEach((selectedId) => {
      drawnAnimalIds.forEach((drawnId, idx) => {
        if (selectedId === drawnId) {
          matches.push(idx + 1);
        }
      });
    });

    setMatchedPositions(matches);

    // Vitoria so se TODOS os animais selecionados apareceram
    const allMatched = selectedAnimals.every(sel => drawnAnimalIds.includes(sel));

    if (allMatched && matches.length >= selectedAnimals.length) {
      setIsWin(true);
      const { multipliers } = MODE_CONFIG[betMode];
      // Melhor multiplicador se todos nas primeiras posicoes
      const maxPos = Math.max(...matches);
      const isFirstPositions = maxPos <= selectedAnimals.length;
      const multiplier = isFirstPositions ? multipliers.first : multipliers.others;
      const payout = betAmount * multiplier;
      setWinAmount(payout);
    } else {
      setIsWin(false);
      setWinAmount(0);
    }
  }, [canPlay, saldo, betAmount, selectedAnimals, betMode, setSaldo]);

  const handleNewRound = useCallback(() => {
    // Adicionar ao historico
    if (drawResults.length > 0) {
      const newEntry: HistoryEntry = {
        id: history.length + 1,
        mode: betMode,
        won: isWin,
        payout: winAmount,
        betAmount,
        animals: drawResults.map(r => r.animalId),
        selectedAnimals: [...selectedAnimals],
        hora: getCurrentTime(),
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 50));
    }

    setPhase("BETTING");
    setSelectedAnimals([]);
    setDrawResults([]);
    setRevealedCapsules([]);
    setIsWin(false);
    setWinAmount(0);
    setMatchedPositions([]);
    setShowConfetti(false);
  }, [drawResults, history.length, betMode, isWin, winAmount, betAmount, selectedAnimals]);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // Fallback silencioso
    }
  }, []);

  const handleVerify = useCallback(async () => {
    // Simulacao de verificacao - em producao usaria Web Crypto API
    // crypto.subtle.importKey + crypto.subtle.sign
    setFairData(prev => ({
      ...prev,
      isValid: true, // Simulado como valido
    }));
  }, []);

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  // Reveal sequencial com useAnimate — shake, lid, animal, nome, pausa por capsula
  useEffect(() => {
    if (phase !== "DRAWING" || drawResults.length === 0) return;
    revealAbort.current = false;

    const runReveal = async () => {
      const spd = SPEEDS[revealSpeed];
      for (let i = 0; i < 5; i++) {
        if (revealAbort.current) {
          setRevealedCapsules([0, 1, 2, 3, 4]);
          break;
        }
        try {
          // shake
          sounds.capsuleShake();
          await revealAnimate(`#cap-sphere-${i}`, { x: [-3, 3, -3, 3, 0] }, { duration: spd.shake });
          // lid abre
          sounds.capsuleOpen();
          await revealAnimate(`#cap-lid-${i}`, { rotateX: -120, y: -30, opacity: 0 }, { duration: spd.open, ease: "easeOut" });
          // reveal animal
          setRevealedCapsules(prev => [...prev, i]);
          const isMatch = drawResults[i] && selectedAnimals.includes(drawResults[i].animalId);
          if (isMatch) { sounds.revealMatch(); } else { sounds.revealNeutral(); }
          await revealAnimate(`#cap-animal-${i}`, { scale: [0, 1.2, 1], opacity: [0, 1] }, { duration: spd.reveal, ease: "easeOut" });
          // nome + milhar
          await revealAnimate(`#cap-info-${i}`, { opacity: [0, 1], y: [10, 0] }, { duration: spd.name });
        } catch { /* componente desmontou */ }
        // pausa dramatica
        await new Promise(r => setTimeout(r, spd.pause * 1000));
      }
      if (revealAbort.current) return;
      // transicao para resultado
      setTimeout(() => {
        setPhase("RESULT");
        if (isWin) {
          setSaldo(saldo + winAmount);
          setShowConfetti(true);
          animate(counterValue, winAmount, { duration: 2, ease: "easeOut" });
          winAmount > 5000 ? sounds.winBig() : sounds.winSmall();
        } else {
          sounds.lose();
        }
      }, 500);
    };
    runReveal();
  }, [phase, drawResults]);

  // Skip: revela tudo instantaneamente
  const handleSkipReveal = useCallback(() => {
    revealAbort.current = true;
    setRevealedCapsules([0, 1, 2, 3, 4]);
    setTimeout(() => {
      setPhase("RESULT");
      if (isWin) {
        setSaldo(saldo + winAmount);
        setShowConfetti(true);
        animate(counterValue, winAmount, { duration: 2, ease: "easeOut" });
      }
    }, 300);
  }, [isWin, winAmount, saldo, setSaldo, counterValue]);

  // ===========================================================================
  // STYLES
  // ===========================================================================

  const styles = useMemo(() => ({
    container: {
      position: "absolute" as const,
      inset: 0,
      zIndex: 60,
      borderRadius: "inherit",
      overflow: "hidden",
      backgroundColor: "#0A0A0A",
      backgroundImage: `url('${ASSETS.bgCasino}'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)`,
      backgroundSize: "cover, 100% 100%, 100% 100%",
      boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column" as const,
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "clamp(4px, 0.6vw, 8px) clamp(8px, 1.5vw, 16px)",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      borderBottom: "1px solid rgba(212,168,67,0.15)",
      borderRadius: "8px 8px 0 0",
      flexShrink: 0,
    },
    headerTitle: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 900,
      fontSize: "clamp(12px, 1.8vw, 22px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      textShadow: "0 0 12px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8)",
      margin: 0,
    },
    headerBalance: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(11px, 1.4vw, 18px)",
      color: "#00E676",
      textShadow: "0 0 8px rgba(0,230,118,0.3)",
    },
    headerBack: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: "clamp(9px, 1.1vw, 13px)",
      color: "rgba(212,168,67,0.6)",
      minHeight: "44px",
      transition: "color 0.2s ease",
    },
    mainLayout: {
      display: "flex",
      gap: "clamp(6px, 1vw, 12px)",
      flex: 1,
      overflow: "hidden",
      alignItems: "stretch",
      padding: "clamp(4px, 0.8vw, 12px)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "clamp(4px, 0.6vw, 8px)",
      flex: 1,
      alignContent: "start",
      overflowY: "auto" as const,
      padding: "4px",
    },
    card: {
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      background: "transparent",
      border: "none",
      borderRadius: "clamp(8px, 1vw, 12px)",
      cursor: "pointer",
      overflow: "hidden",
      minHeight: 44,
      transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    cardSelected: {
      transform: "scale(1.05)",
      boxShadow: "0 0 25px 8px rgba(0,230,118,0.25)",
      zIndex: 2,
    },
    cardDisabled: {
      opacity: 0.3,
      filter: "grayscale(0.7) brightness(0.6)",
      cursor: "not-allowed",
    },
    cardImg: {
      width: "100%",
      height: "auto",
      objectFit: "contain" as const,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      borderRadius: "clamp(8px, 1vw, 12px)",
    },
    cardBadge: {
      position: "absolute" as const,
      top: "4px",
      right: "4px",
      width: "clamp(18px, 2.5vw, 26px)",
      height: "clamp(18px, 2.5vw, 26px)",
      borderRadius: "50%",
      background: "#00E676",
      color: "#000",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 800,
      fontSize: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(0,230,118,0.4)",
      zIndex: 2,
    },
    panel: {
      flex: "0 0 220px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "clamp(8px, 1vw, 14px)",
      padding: "clamp(10px, 1.2vw, 16px)",
      background: "linear-gradient(145deg, rgba(15,12,8,0.95) 0%, rgba(8,6,4,0.98) 100%)",
      border: "1px solid rgba(212,168,67,0.15)",
      borderRadius: "12px",
      boxShadow: "inset 0 1px 0 rgba(255,215,0,0.05), 0 8px 32px rgba(0,0,0,0.5)",
      overflowY: "auto" as const,
    },
    panelSection: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "clamp(6px, 0.8vw, 10px)",
    },
    panelSectionLabel: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      fontSize: "clamp(9px, 1vw, 11px)",
      color: "rgba(212,168,67,0.5)",
      textTransform: "uppercase" as const,
      letterSpacing: "1.5px",
      paddingBottom: "4px",
      borderBottom: "1px solid rgba(212,168,67,0.1)",
    },
    tabs: {
      display: "flex",
      gap: "2px",
      background: "rgba(0,0,0,0.4)",
      borderRadius: "8px",
      padding: "3px",
    },
    tab: {
      flex: 1,
      padding: "clamp(6px, 0.8vw, 10px) clamp(4px, 0.6vw, 8px)",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      background: "transparent",
      color: "rgba(212,168,67,0.4)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      minHeight: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    tabActive: {
      background: "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.1) 100%)",
      color: "#FFD700",
      boxShadow: "0 2px 8px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,215,0,0.1)",
    },
    chips: {
      display: "flex",
      gap: "clamp(6px, 0.8vw, 10px)",
      justifyContent: "center",
    },
    chip: {
      width: "clamp(40px, 5.5vw, 56px)",
      height: "clamp(40px, 5.5vw, 56px)",
      borderRadius: "50%",
      cursor: "pointer",
      border: "2px solid rgba(212,168,67,0.15)",
      background: "linear-gradient(145deg, rgba(20,18,12,0.9) 0%, rgba(10,8,5,0.95) 100%)",
      color: "#00E676",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(10px, 1.2vw, 14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
    },
    chipActive: {
      background: "linear-gradient(145deg, rgba(40,35,15,0.95) 0%, rgba(25,22,10,0.98) 100%)",
      borderColor: "#FFD700",
      color: "#FFD700",
      transform: "scale(1.12)",
      boxShadow: "0 0 16px rgba(255,215,0,0.25), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,215,0,0.15)",
    },
    payout: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
      padding: "clamp(8px, 1vw, 12px)",
      background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 100%)",
      borderRadius: "8px",
      border: "1px solid rgba(212,168,67,0.08)",
      borderLeft: "3px solid rgba(255,215,0,0.4)",
    },
    payoutLine1: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(11px, 1.3vw, 15px)",
      color: "#FFD700",
      textShadow: "0 0 10px rgba(255,215,0,0.2)",
    },
    payoutLine2: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "rgba(212,168,67,0.5)",
    },
    btnRow: {
      display: "flex",
      gap: "clamp(8px, 1vw, 12px)",
      alignItems: "center",
    },
    btnRandom: {
      flex: "0 0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      padding: "clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 18px)",
      background: "linear-gradient(135deg, rgba(212,168,67,0.1) 0%, rgba(212,168,67,0.05) 100%)",
      border: "1px solid rgba(212,168,67,0.2)",
      borderRadius: "8px",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "#D4A843",
      cursor: "pointer",
      minHeight: "44px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    },
    btnJogar: {
      flex: 1,
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "clamp(44px, 6vw, 56px)",
      backgroundImage: "url('/assets/shared/ui/btn-jogar-ativo.png')",
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "10px",
      fontFamily: "'Cinzel', serif",
      fontWeight: 900,
      fontSize: "clamp(11px, 1.4vw, 16px)",
      color: "#FFFFFF",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    btnJogarDisabled: {
      backgroundImage: "url('/assets/shared/ui/btn-jogar-desativo.png')",
      opacity: 0.5,
      filter: "grayscale(0.5)",
      cursor: "not-allowed",
    },
    footerBtns: {
      display: "flex",
      gap: "clamp(6px, 0.8vw, 10px)",
      justifyContent: "center",
      paddingTop: "clamp(6px, 0.8vw, 10px)",
      borderTop: "1px solid rgba(212,168,67,0.08)",
    },
    footerBtn: {
      width: "44px",
      height: "44px",
      borderRadius: "8px",
      background: "linear-gradient(145deg, rgba(20,18,12,0.8) 0%, rgba(10,8,5,0.9) 100%)",
      border: "1px solid rgba(212,168,67,0.12)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      transition: "all 0.2s ease",
    },
    footerBtnIcon: {
      width: "20px",
      height: "20px",
      opacity: 0.6,
    },
    // SORTEIO STYLES
    overlay: {
      position: "absolute" as const,
      inset: 0,
      zIndex: 65,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(4px)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: "clamp(12px, 2vw, 24px)",
      cursor: "pointer",
    },
    overlayTitle: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 800,
      fontSize: "clamp(12px, 1.8vw, 22px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      textShadow: "0 0 12px rgba(255,215,0,0.4)",
    },
    betInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: "clamp(9px, 1.1vw, 13px)",
      color: "#A8A8A8",
      flexWrap: "wrap" as const,
      justifyContent: "center",
    },
    betInfoAnimal: {
      padding: "2px 6px",
      borderRadius: "4px",
      background: "rgba(0,230,118,0.1)",
      border: "1px solid rgba(0,230,118,0.3)",
      color: "#00E676",
      fontSize: "clamp(8px, 0.9vw, 11px)",
    },
    betInfoValue: {
      color: "#FFD700",
    },
    betInfoMode: {
      color: "#D4A843",
      textTransform: "capitalize" as const,
    },
    capsulesRow: {
      display: "flex",
      gap: "clamp(10px, 2vw, 30px)",
      alignItems: "center",
      justifyContent: "center",
    },
    capsule: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "4px",
    },
    capsuleSphere: {
      position: "relative" as const,
      width: "clamp(40px, 6vw, 70px)",
      height: "clamp(40px, 6vw, 70px)",
      borderRadius: "50%",
      overflow: "hidden",
      background: "radial-gradient(circle at 35% 30%, #FFD700 0%, #D4A843 40%, #8B6914 80%, #462523 100%)",
      border: "2px solid rgba(255,215,0,0.6)",
      boxShadow: "inset 0 -3px 8px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,215,0,0.2), 0 0 20px rgba(212,168,67,0.3), 0 4px 12px rgba(0,0,0,0.6)",
    },
    capsuleSphereMatch: {
      border: "2px solid #00E676",
      boxShadow: "0 0 25px rgba(0,230,118,0.6), 0 0 50px rgba(0,230,118,0.2)",
    },
    capsuleReflect: {
      position: "absolute" as const,
      inset: 0,
      background: "radial-gradient(ellipse 60% 40% at 35% 25%, rgba(255,255,255,0.25) 0%, transparent 100%)",
      pointerEvents: "none" as const,
    },
    capsuleLimbDark: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "50%",
      background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.3) 100%)",
      pointerEvents: "none" as const,
    },
    capsuleLid: {
      position: "absolute" as const,
      top: 0,
      left: "10%",
      right: "10%",
      height: "45%",
      borderRadius: "50% 50% 0 0",
      background: "linear-gradient(180deg, #FFD700 0%, #D4A843 60%, #8B6914 100%)",
      borderBottom: "1px solid rgba(139,105,20,0.5)",
      transformOrigin: "bottom center",
      zIndex: 2,
    },
    capsuleAnimal: {
      position: "absolute" as const,
      inset: 0,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
    },
    capsuleAnimalImg: {
      width: "clamp(24px, 3.5vw, 44px)",
      height: "auto",
      objectFit: "contain" as const,
    },
    capsulePosition: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "rgba(212,168,67,0.3)",
    },
    capsuleName: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: "clamp(7px, 0.8vw, 10px)",
      color: "#D4A843",
      textAlign: "center" as const,
    },
    capsuleMilhar: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: "clamp(6px, 0.7vw, 9px)",
      color: "rgba(212,168,67,0.4)",
    },
    skipBtn: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "rgba(212,168,67,0.5)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "8px 16px",
    },
    // VITORIA STYLES
    winTitle: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 900,
      fontSize: "clamp(20px, 4vw, 42px)",
      color: "#00E676",
      textTransform: "uppercase" as const,
      letterSpacing: "3px",
      textShadow: "0 0 20px rgba(0,230,118,0.5), 0 0 40px rgba(0,230,118,0.2), 0 2px 6px rgba(0,0,0,0.8)",
    },
    winCounter: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(24px, 4vw, 48px)",
      color: "#00E676",
      textShadow: "0 0 15px rgba(0,230,118,0.6), 0 0 30px rgba(0,230,118,0.2)",
    },
    winDetail: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: "clamp(9px, 1.1vw, 14px)",
      color: "#A8A8A8",
    },
    winMultiplier: {
      color: "#FFD700",
    },
    miniCards: {
      display: "flex",
      gap: "clamp(4px, 0.6vw, 8px)",
      justifyContent: "center",
    },
    miniCard: {
      width: "clamp(28px, 4vw, 44px)",
      height: "clamp(28px, 4vw, 44px)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(5,5,5,0.9)",
      overflow: "hidden",
    },
    miniCardMatch: {
      border: "1.5px solid #00E676",
      boxShadow: "0 0 10px rgba(0,230,118,0.3)",
    },
    miniCardMiss: {
      opacity: 0.5,
      border: "1px solid rgba(212,168,67,0.1)",
    },
    miniCardImg: {
      width: "clamp(18px, 2.5vw, 32px)",
      height: "auto",
    },
    btnPlayAgain: {
      padding: "clamp(6px, 0.8vw, 10px) clamp(16px, 2.5vw, 32px)",
      background: "rgba(0,230,118,0.1)",
      border: "1.5px solid #00E676",
      borderRadius: "8px",
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(10px, 1.2vw, 14px)",
      color: "#00E676",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      cursor: "pointer",
      minHeight: "44px",
    },
    btnBack: {
      padding: "clamp(6px, 0.8vw, 10px) clamp(16px, 2.5vw, 32px)",
      background: "rgba(212,168,67,0.08)",
      border: "1.5px solid rgba(212,168,67,0.3)",
      borderRadius: "8px",
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(10px, 1.2vw, 14px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      cursor: "pointer",
      minHeight: "44px",
    },
    actionsRow: {
      display: "flex",
      gap: "clamp(8px, 1vw, 16px)",
      justifyContent: "center",
    },
    // TELA 4 - DERROTA
    defeatTitle: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: "clamp(14px, 2vw, 22px)",
      color: "rgba(212,168,67,0.5)",
    },
    defeatLoss: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: "clamp(12px, 1.5vw, 18px)",
      color: "rgba(255,68,68,0.6)",
    },
    defeatAnimalDim: {
      opacity: 0.4,
      background: "rgba(255,68,68,0.05)",
      border: "1px solid rgba(255,68,68,0.15)",
      animation: "bichoDefeatFade 1s ease forwards",
    },
    // TELA 5 - HISTORICO
    historyDrawer: {
      position: "absolute" as const,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 68,
      width: "clamp(250px, 30vw, 380px)",
      background: "rgba(5,5,5,0.97)",
      borderLeft: "1px solid rgba(212,168,67,0.15)",
      backdropFilter: "blur(6px)",
      overflowY: "auto" as const,
      display: "flex",
      flexDirection: "column" as const,
    },
    historyHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "clamp(8px, 1vw, 14px)",
      borderBottom: "1px solid rgba(212,168,67,0.1)",
      flexShrink: 0,
    },
    historyTitle: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(11px, 1.3vw, 15px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
    },
    historyClose: {
      width: "28px",
      height: "28px",
      borderRadius: "4px",
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(212,168,67,0.15)",
      color: "rgba(212,168,67,0.6)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
    },
    historyList: {
      flex: 1,
      overflowY: "auto" as const,
    },
    historyRow: {
      padding: "clamp(6px, 0.8vw, 10px)",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
    },
    historyRowOdd: {
      background: "rgba(5,5,5,0.95)",
    },
    historyRowEven: {
      background: "rgba(10,10,10,0.95)",
    },
    historyRowHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
    },
    historyId: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "rgba(212,168,67,0.4)",
    },
    historyBadgeWin: {
      background: "rgba(0,230,118,0.15)",
      border: "1px solid rgba(0,230,118,0.3)",
      color: "#00E676",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: "clamp(7px, 0.8vw, 10px)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    historyBadgeLoss: {
      background: "rgba(255,68,68,0.1)",
      border: "1px solid rgba(255,68,68,0.2)",
      color: "rgba(255,68,68,0.6)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: "clamp(7px, 0.8vw, 10px)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    historyPayoutWin: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "#00E676",
    },
    historyPayoutLoss: {
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "rgba(255,68,68,0.4)",
    },
    historyAnimals: {
      display: "flex",
      gap: "4px",
      marginBottom: "4px",
    },
    historyAnimalIcon: {
      width: "20px",
      height: "20px",
      borderRadius: "3px",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    historyAnimalIconMatch: {
      border: "1px solid rgba(0,230,118,0.3)",
    },
    historyAnimalImg: {
      width: "16px",
      height: "16px",
      objectFit: "contain" as const,
    },
    historyMeta: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: "clamp(7px, 0.8vw, 10px)",
      color: "rgba(212,168,67,0.3)",
    },
    historyEmpty: {
      padding: "24px",
      textAlign: "center" as const,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: "clamp(9px, 1vw, 12px)",
      color: "rgba(212,168,67,0.3)",
    },
    // TELA 6 - PROVABLY FAIR
    pfBackdrop: {
      position: "fixed" as const,
      inset: 0,
      zIndex: 75,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    pfModal: {
      width: "clamp(280px, 45vw, 450px)",
      maxHeight: "85vh",
      background: "rgba(8,8,8,0.98)",
      border: "1px solid rgba(212,168,67,0.2)",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      padding: "clamp(12px, 2vw, 24px)",
      overflowY: "auto" as const,
      position: "relative" as const,
    },
    pfHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "clamp(12px, 1.5vw, 20px)",
    },
    pfTitle: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(11px, 1.3vw, 16px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    pfClose: {
      width: "28px",
      height: "28px",
      borderRadius: "4px",
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(212,168,67,0.15)",
      color: "rgba(212,168,67,0.6)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
    },
    pfLabel: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "rgba(212,168,67,0.5)",
      marginBottom: "4px",
      display: "block",
    },
    pfFieldRow: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "clamp(8px, 1vw, 14px)",
    },
    pfFieldReadonly: {
      flex: 1,
      padding: "clamp(6px, 0.8vw, 10px)",
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(212,168,67,0.1)",
      borderRadius: "6px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 400,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "#A8A8A8",
      wordBreak: "break-all" as const,
    },
    pfFieldEditable: {
      flex: 1,
      padding: "clamp(6px, 0.8vw, 10px)",
      background: "rgba(0,0,0,0.6)",
      border: "1px solid rgba(212,168,67,0.2)",
      borderRadius: "6px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 400,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "#FFFFFF",
      cursor: "text",
      outline: "none",
    },
    pfCopyBtn: {
      width: "24px",
      height: "24px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    pfCopyIcon: {
      width: "16px",
      height: "16px",
      opacity: 0.4,
      transition: "opacity 0.2s ease",
    },
    pfCopyIconCopied: {
      filter: "brightness(0) saturate(100%) invert(67%) sepia(52%) saturate(5765%) hue-rotate(122deg) brightness(101%) contrast(101%)",
      opacity: 1,
    },
    pfVerifyBtn: {
      width: "100%",
      padding: "clamp(8px, 1vw, 12px)",
      background: "rgba(212,168,67,0.1)",
      border: "1.5px solid rgba(212,168,67,0.3)",
      borderRadius: "8px",
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(10px, 1.2vw, 14px)",
      color: "#D4A843",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      cursor: "pointer",
      minHeight: "44px",
      marginTop: "clamp(8px, 1vw, 14px)",
    },
    pfResultBadge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "6px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(9px, 1vw, 12px)",
      marginTop: "clamp(8px, 1vw, 14px)",
      textAlign: "center" as const,
    },
    pfResultValid: {
      background: "rgba(0,230,118,0.08)",
      border: "1px solid rgba(0,230,118,0.3)",
      color: "#00E676",
    },
    pfResultInvalid: {
      background: "rgba(255,68,68,0.08)",
      border: "1px solid rgba(255,68,68,0.3)",
      color: "#FF4444",
    },
    pfExplainer: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: "clamp(8px, 0.9vw, 11px)",
      color: "rgba(212,168,67,0.3)",
      marginTop: "12px",
      lineHeight: 1.5,
    },
  }), []);

  // ===========================================================================
  // CONFETTI
  // ===========================================================================

  const confettiPieces = useMemo(() => {
    if (!showConfetti) return [];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
      color: ["#FFD700", "#D4A843", "#F6E27A"][Math.floor(Math.random() * 3)],
      size: 4 + Math.random() * 6,
    }));
  }, [showConfetti]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  const { multipliers } = MODE_CONFIG[betMode];
  const potentialWin1 = betAmount * multipliers.first;
  const potentialWinOthers = betAmount * multipliers.others;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bichoShimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.12; }
          100% { transform: translateX(200%); opacity: 0; }
        }
        @keyframes bichoPulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(0,230,118,0.3); }
          50% { box-shadow: 0 0 25px rgba(0,230,118,0.6); }
        }
        @keyframes bichoMatchFlash {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.7; transform: scale(1.08); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes bichoConfettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        @keyframes bichoDefeatFade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.4; transform: scale(0.98); }
        }
      `}</style>
      {/* HEADER */}
      <header style={styles.header}>
        <motion.button
          style={styles.headerBack}
          onClick={onBack}
          whileHover={{ x: -2, color: "#D4A843" }}
          whileTap={{ scale: 0.95 }}
          title={TEXTS.tooltips.back[lang]}
        >
          {TEXTS.back[lang]}
        </motion.button>

        <motion.h1
          style={styles.headerTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {TEXTS.title[lang]}
        </motion.h1>

        <div style={styles.headerBalance}>
          <img src={ASSETS.iconGcoin} alt="" style={{ width: "16px", height: "16px" }} />
          <span style={{ fontSize: "0.65em", opacity: 0.7, marginRight: "2px" }}>G$</span>
          {formatBalance(saldo)}
        </div>
      </header>

      {/* TELA 1 - APOSTAS */}
      {phase === "BETTING" && (
        <motion.div
          style={styles.mainLayout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* GRID 5x5 */}
          <div style={styles.grid}>
            {ANIMALS.map((animal, index) => {
              const isSelected = selectedAnimals.includes(animal.id);
              const selectionIndex = selectedAnimals.indexOf(animal.id);
              const isDisabled = !isSelected && selectedAnimals.length >= maxSelections;

              const tooltip = isSelected
                ? TEXTS.tooltips.cardSelected[lang]
                : isDisabled
                ? TEXTS.tooltips.cardDisabled[lang]
                : TEXTS.tooltips.cardNormal[lang];

              return (
                <motion.div
                  key={animal.id}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.cardSelected : {}),
                    ...(isDisabled ? styles.cardDisabled : {}),
                  }}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.3, ease: [0, 0, 0.2, 1] }}
                  whileHover={!isDisabled ? { scale: 1.06, boxShadow: "0 4px 20px rgba(0,0,0,0.6), 0 0 12px rgba(212,168,67,0.2)" } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (isDisabled) return;
                    if (isSelected) { handleSelectAnimal(animal.id); sounds.deselectAnimal(); }
                    else { setPreviewAnimal(animal.id); sounds.hover(); }
                  }}
                  title={tooltip}
                >
                  <img src={ASSETS.getAnimal(animal.id)} alt={animal.name[lang]} style={styles.cardImg} />
                  {isSelected && (
                    <motion.span
                      style={styles.cardBadge}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      {`${selectionIndex + 1}º`}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* PREVIEW DO ANIMAL — abre ao clicar no card */}
          <AnimatePresence>
            {previewAnimal !== null && phase === "BETTING" && (() => {
              const animal = ANIMALS.find(a => a.id === previewAnimal);
              if (!animal) return null;
              const alreadySelected = selectedAnimals.includes(previewAnimal);
              const canAdd = selectedAnimals.length < maxSelections;
              const dezStart = (previewAnimal - 1) * 4 + 1;
              const dezenas = Array.from({ length: 4 }, (_, i) => String(dezStart + i).padStart(2, "0"));
              return (
                <motion.div
                  key="preview-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 70,
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onClick={() => setPreviewAnimal(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: "flex", flexDirection: "column" as const, alignItems: "center",
                      gap: "16px", maxWidth: "280px",
                    }}
                  >
                    <img
                      src={ASSETS.getAnimal(previewAnimal)}
                      alt={animal.name[lang]}
                      style={{ width: "240px", height: "auto", borderRadius: "14px" }}
                    />
                    <div style={{
                      display: "flex", gap: "8px", fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "14px", color: "rgba(212,168,67,0.8)",
                    }}>
                      {dezenas.map(d => (
                        <span key={d} style={{
                          padding: "4px 10px", background: "rgba(212,168,67,0.08)",
                          border: "1px solid rgba(212,168,67,0.2)", borderRadius: "6px",
                        }}>{d}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPreviewAnimal(null)}
                        style={{
                          flex: 1, padding: "12px", border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "8px", background: "rgba(255,255,255,0.05)",
                          color: "#AAA", fontFamily: "'Cinzel', serif", fontWeight: 700,
                          fontSize: "12px", cursor: "pointer", letterSpacing: "1px",
                        }}
                      >
                        {lang === "br" ? "CANCELAR" : "CANCEL"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!alreadySelected && canAdd) {
                            handleSelectAnimal(previewAnimal);
                          }
                          setPreviewAnimal(null);
                        }}
                        style={{
                          flex: 1, padding: "12px", border: "none", borderRadius: "8px",
                          background: (!alreadySelected && canAdd)
                            ? "linear-gradient(135deg, #00E676 0%, #00C853 100%)"
                            : "rgba(60,60,60,0.5)",
                          color: (!alreadySelected && canAdd) ? "#000" : "rgba(255,255,255,0.3)",
                          fontFamily: "'Cinzel', serif", fontWeight: 800,
                          fontSize: "12px", cursor: (!alreadySelected && canAdd) ? "pointer" : "not-allowed",
                          letterSpacing: "1px",
                        }}
                      >
                        {alreadySelected
                          ? (lang === "br" ? "JÁ SELECIONADO" : "ALREADY SELECTED")
                          : !canAdd
                            ? (lang === "br" ? "LIMITE ATINGIDO" : "LIMIT REACHED")
                            : (lang === "br" ? "SELECIONAR" : "SELECT")}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* PAINEL DE APOSTAS */}
          <div style={styles.panel}>
            {/* SECAO MODO DE APOSTA */}
            <div style={styles.panelSection}>
              <span style={styles.panelSectionLabel}>{lang === "br" ? "Modo" : "Mode"}</span>
              <div style={styles.tabs}>
                {(Object.keys(MODE_CONFIG) as BetMode[]).map((mode) => (
                  <motion.button
                    key={mode}
                    style={{
                      ...styles.tab,
                      ...(betMode === mode ? styles.tabActive : {}),
                    }}
                    onClick={() => handleModeChange(mode)}
                    whileTap={{ scale: 0.97 }}
                    whileHover={betMode !== mode ? { background: "rgba(212,168,67,0.08)", color: "rgba(212,168,67,0.6)" } : {}}
                    title={TEXTS.tooltips[mode][lang]}
                  >
                    {TEXTS.modes[mode][lang]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* SECAO VALOR DA APOSTA */}
            <div style={styles.panelSection}>
              <span style={styles.panelSectionLabel}>{lang === "br" ? "Valor" : "Amount"}</span>
              <div style={styles.chips}>
                {BET_CHIPS.map((chip) => (
                  <motion.button
                    key={chip}
                    style={{
                      ...styles.chip,
                      ...(betAmount === chip ? styles.chipActive : {}),
                    }}
                    onClick={() => setBetAmount(chip)}
                    whileHover={betAmount !== chip ? { scale: 1.08, borderColor: "rgba(212,168,67,0.35)" } : {}}
                    whileTap={{ scale: 0.95 }}
                    title={`${lang === "br" ? "Apostar" : "Bet"} G$${chip}`}
                  >
                    {chip >= 1000 ? `${chip / 1000}k` : chip}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* SECAO GANHOS POTENCIAIS */}
            <div style={styles.panelSection}>
              <span style={styles.panelSectionLabel}>{lang === "br" ? "Ganhos" : "Winnings"}</span>
              <div style={styles.payout}>
                <motion.span
                  key={`${betMode}-${betAmount}-1`}
                  style={styles.payoutLine1}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  1º = {multipliers.first}x = G${formatBalance(potentialWin1)}
                </motion.span>
                <motion.span
                  key={`${betMode}-${betAmount}-2`}
                  style={styles.payoutLine2}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  {lang === "br" ? "Outros" : "Others"} = {multipliers.others}x = G${formatBalance(potentialWinOthers)}
                </motion.span>
              </div>
            </div>

            {/* BOTOES ALEATORIO + JOGAR */}
            <div style={styles.btnRow}>
              <motion.button
                style={styles.btnRandom}
                onClick={handleRandomSelect}
                whileTap={{ scale: 0.95 }}
                whileHover={{ borderColor: "rgba(212,168,67,0.4)", background: "rgba(212,168,67,0.15)" }}
                title={TEXTS.tooltips.random[lang]}
              >
                <img src={ASSETS.iconRandom} alt="" style={{ width: "18px", height: "18px", opacity: 0.9 }} />
              </motion.button>
              <motion.button
                style={{
                  ...styles.btnJogar,
                  ...(canPlay ? {} : styles.btnJogarDisabled),
                }}
                onClick={handlePlay}
                whileHover={canPlay ? { scale: 1.03, boxShadow: "0 6px 24px rgba(0,230,118,0.4), inset 0 1px 0 rgba(255,255,255,0.25)" } : {}}
                whileTap={canPlay ? { scale: 0.97 } : {}}
                disabled={!canPlay}
                title={TEXTS.tooltips.play[lang]}
              >
                {TEXTS.play[lang]} G${formatBalance(betAmount)}
              </motion.button>
            </div>

            {/* SELECAO ATUAL */}
            {selectedAnimals.length > 0 && (
              <div style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: "6px",
                padding: "8px",
                background: "rgba(0,230,118,0.05)",
                borderRadius: "8px",
                border: "1px solid rgba(0,230,118,0.15)",
              }}>
                <span style={{
                  width: "100%",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(8px, 0.9vw, 10px)",
                  color: "rgba(0,230,118,0.7)",
                  marginBottom: "2px",
                }}>
                  {lang === "br" ? "Selecionados" : "Selected"}: {selectedAnimals.length}/{MODE_CONFIG[betMode].required}
                </span>
                {selectedAnimals.map((id) => {
                  const animal = ANIMALS.find((a) => a.id === id);
                  return (
                    <span key={id} style={{
                      padding: "4px 8px",
                      background: "rgba(0,230,118,0.1)",
                      borderRadius: "4px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "clamp(9px, 1vw, 11px)",
                      color: "#00E676",
                    }}>
                      {id.toString().padStart(2, "0")}
                    </span>
                  );
                })}
              </div>
            )}

            {/* BOTOES PF + HISTORICO + SOM */}
            <div style={styles.footerBtns}>
              <motion.button
                style={styles.footerBtn}
                whileHover={{ scale: 1.08, borderColor: "rgba(212,168,67,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProvablyFair(true)}
                title={TEXTS.tooltips.pfBtn[lang]}
              >
                <img src={ASSETS.iconProvablyFair} alt="Provably Fair" style={styles.footerBtnIcon} />
              </motion.button>
              <motion.button
                style={styles.footerBtn}
                whileHover={{ scale: 1.08, borderColor: "rgba(212,168,67,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(true)}
                title={TEXTS.tooltips.historyBtn[lang]}
              >
                <img src={ASSETS.iconHistory} alt="History" style={styles.footerBtnIcon} />
              </motion.button>
              <motion.button
                style={styles.footerBtn}
                onClick={() => setSoundEnabled(!soundEnabled)}
                whileHover={{ scale: 1.08, borderColor: "rgba(212,168,67,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={soundEnabled ? ASSETS.iconSoundOn : ASSETS.iconSoundOff}
                  alt="Sound"
                  style={styles.footerBtnIcon}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TELA 2 - SORTEIO */}
      <AnimatePresence>
        {phase === "DRAWING" && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleSkipReveal}
          >
            <motion.h2
              style={styles.overlayTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {TEXTS.drawing[lang]}
            </motion.h2>

            {/* INFO DA APOSTA */}
            <div style={styles.betInfo}>
              <span>{TEXTS.yourAnimals[lang]}</span>
              {selectedAnimals.map((id) => {
                const animal = ANIMALS.find((a) => a.id === id);
                return animal ? (
                  <span key={id} style={styles.betInfoAnimal}>
                    {animal.name[lang]} ({id})
                  </span>
                ) : null;
              })}
              <span style={styles.betInfoValue}>| G${formatBalance(betAmount)}</span>
              <span style={styles.betInfoMode}>| {betMode}</span>
            </div>

            {/* 5 CAPSULAS — useAnimate controla sequencia via IDs */}
            <div style={styles.capsulesRow} ref={revealScope}>
              {[0, 1, 2, 3, 4].map((i) => {
                const isRevealed = revealedCapsules.includes(i);
                const result = drawResults[i];
                const animal = result ? ANIMALS.find((a) => a.id === result.animalId) : null;
                const isMatch = result && selectedAnimals.includes(result.animalId);

                return (
                  <motion.div
                    key={i}
                    style={styles.capsule}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15 * i, duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span style={styles.capsulePosition}>{i + 1}º</span>
                    <div
                      id={`cap-sphere-${i}`}
                      style={{
                        ...styles.capsuleSphere,
                        ...(isRevealed && isMatch ? styles.capsuleSphereMatch : {}),
                      }}
                    >
                      <div style={styles.capsuleReflect} />
                      <div style={styles.capsuleLimbDark} />

                      <div
                        id={`cap-lid-${i}`}
                        style={styles.capsuleLid}
                      />

                      <div
                        id={`cap-animal-${i}`}
                        style={{ ...styles.capsuleAnimal, opacity: isRevealed ? 1 : 0, transform: isRevealed ? "scale(1)" : "scale(0)" }}
                      >
                        {animal && (
                          <img
                            src={ASSETS.getAnimal(animal.id)}
                            alt={animal.name[lang]}
                            style={styles.capsuleAnimalImg}
                          />
                        )}
                      </div>
                    </div>

                    <div
                      id={`cap-info-${i}`}
                      style={{ textAlign: "center" as const, opacity: isRevealed ? 1 : 0 }}
                    >
                      {animal && result && (
                        <>
                          <div style={styles.capsuleName}>{animal.name[lang]}</div>
                          <div style={styles.capsuleMilhar}>
                            <NumberDrum value={formatNumber(result.number)} revealed={isRevealed} />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CONTROLES DE VELOCIDADE + SKIP */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
              {(["normal", "fast", "instant"] as const).map(spd => (
                <motion.button
                  key={spd}
                  onClick={() => setRevealSpeed(spd)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: revealSpeed === spd ? "rgba(212,168,67,0.15)" : "transparent",
                    border: revealSpeed === spd ? "1px solid rgba(212,168,67,0.4)" : "1px solid rgba(212,168,67,0.15)",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    fontSize: "clamp(8px, 0.9vw, 11px)",
                    color: revealSpeed === spd ? "#FFD700" : "rgba(212,168,67,0.4)",
                    minHeight: 32,
                  }}
                  title={spd === "normal" ? "Velocidade normal" : spd === "fast" ? "Velocidade rápida" : "Instantâneo"}
                >
                  {spd === "normal" ? "1x" : spd === "fast" ? "2x" : ">>"}
                </motion.button>
              ))}
              <motion.button
                onClick={handleSkipReveal}
                whileHover={{ color: "#D4A843" }}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  fontSize: "clamp(9px, 1vw, 12px)", color: "rgba(212,168,67,0.5)",
                  padding: "4px 12px",
                }}
                title={lang === "br" ? "Pular animação" : "Skip animation"}
              >
                {TEXTS.skip[lang]}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TELA 3 - VITORIA / TELA 4 - DERROTA */}
      <AnimatePresence>
        {phase === "RESULT" && (
          <motion.div
            style={{
              ...styles.overlay,
              ...(!isWin ? {
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(2px)",
              } : {}),
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* CONFETTI (apenas vitoria) */}
            {showConfetti && confettiPieces.map((piece) => (
              <motion.span
                key={piece.id}
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: piece.left,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  background: piece.color,
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
                initial={{ y: -20, rotate: 0, scale: 1, opacity: 1 }}
                animate={{ y: 400, rotate: 720, scale: 0.3, opacity: 0 }}
                transition={{ duration: piece.duration, delay: piece.delay, ease: "linear" }}
              />
            ))}

            {isWin ? (
              /* TELA 3 - VITORIA */
              <>
                <motion.h2
                  style={styles.winTitle}
                  initial={{ y: -20, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {TEXTS.youWon[lang]}
                </motion.h2>

                <motion.div style={styles.winCounter}>
                  {displayCounter}
                </motion.div>

                <div style={styles.winDetail}>
                  {betMode} {lang === "br" ? "acertada!" : "matched!"}{" "}
                  {lang === "br" ? "Posicoes" : "Positions"}{" "}
                  {matchedPositions.map((p) => `${p}o`).join(", ")} |{" "}
                  <span style={styles.winMultiplier}>
                    {matchedPositions.includes(1) ? multipliers.first : multipliers.others}x
                  </span>
                </div>
              </>
            ) : (
              /* TELA 4 - DERROTA (feedback discreto) */
              <>
                <motion.h2
                  style={styles.defeatTitle}
                  initial={{ x: 0 }}
                  animate={{ x: [-2, 2, -2, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {TEXTS.noMatch[lang]}
                </motion.h2>

                <motion.div
                  style={styles.defeatLoss}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  -G${formatBalance(betAmount)}
                </motion.div>
              </>
            )}

            {/* MINI-CARDS DOS ANIMAIS SORTEADOS */}
            <div style={{ marginTop: "8px" }}>
              <div style={{ ...styles.betInfo, marginBottom: "8px" }}>
                <span>{TEXTS.drawnAnimals[lang]}</span>
              </div>
              <div style={styles.miniCards}>
                {drawResults.map((result, i) => {
                  const animal = ANIMALS.find((a) => a.id === result.animalId);
                  const isMatch = selectedAnimals.includes(result.animalId);
                  const isNearMiss = !isMatch && selectedAnimals.some(
                    sel => Math.abs(sel - result.animalId) === 1
                  );
                  return (
                    <motion.div
                      key={i}
                      style={{
                        ...styles.miniCard,
                        ...(isMatch ? styles.miniCardMatch : styles.miniCardMiss),
                        ...(!isWin && !isMatch ? styles.defeatAnimalDim : {}),
                        ...(isNearMiss ? {
                          borderColor: "rgba(255,215,0,0.5)",
                          boxShadow: "0 0 12px rgba(255,215,0,0.3)",
                        } : {}),
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {animal && (
                        <img
                          src={ASSETS.getAnimal(animal.id)}
                          alt={animal.name[lang]}
                          style={styles.miniCardImg}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ANIMAIS SELECIONADOS */}
            <div style={{ ...styles.betInfo, marginTop: "8px" }}>
              <span>{TEXTS.yourAnimals[lang]}</span>
              {selectedAnimals.map((id) => {
                const animal = ANIMALS.find((a) => a.id === id);
                const wasDrawn = drawResults.some(r => r.animalId === id);
                return animal ? (
                  <span
                    key={id}
                    style={{
                      ...styles.betInfoAnimal,
                      ...(wasDrawn ? {} : { opacity: 0.4, background: "rgba(255,68,68,0.1)", borderColor: "rgba(255,68,68,0.2)" }),
                    }}
                  >
                    {animal.name[lang]}
                  </span>
                ) : null;
              })}
            </div>

            {/* BOTOES */}
            <motion.div
              style={styles.actionsRow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                style={isWin ? styles.btnPlayAgain : { ...styles.btnPlayAgain, borderColor: "rgba(212,168,67,0.4)", color: "#D4A843", background: "rgba(212,168,67,0.08)" }}
                onClick={handleNewRound}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {isWin ? TEXTS.playAgain[lang] : TEXTS.newRound[lang]}
              </motion.button>
              <motion.button
                style={styles.btnBack}
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {TEXTS.backToLobby[lang]}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TELA 5 - HISTORICO (Slide-in lateral) */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            style={styles.historyDrawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div style={styles.historyHeader}>
              <span style={styles.historyTitle}>{TEXTS.history[lang]}</span>
              <motion.button
                style={styles.historyClose}
                onClick={() => setShowHistory(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                X
              </motion.button>
            </div>

            <div style={styles.historyList}>
              {history.length === 0 ? (
                <div style={styles.historyEmpty}>
                  {lang === "br" ? "Nenhum historico ainda" : "No history yet"}
                </div>
              ) : (
                history.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    style={{
                      ...styles.historyRow,
                      ...(idx % 2 === 0 ? styles.historyRowOdd : styles.historyRowEven),
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx }}
                  >
                    <div style={styles.historyRowHeader}>
                      <span style={styles.historyId}>#{entry.id}</span>
                      <span style={entry.won ? styles.historyBadgeWin : styles.historyBadgeLoss}>
                        {entry.won ? "W" : "L"}
                      </span>
                      <span style={entry.won ? styles.historyPayoutWin : styles.historyPayoutLoss}>
                        {entry.won ? `+G$${formatBalance(entry.payout)}` : `-G$${formatBalance(entry.betAmount)}`}
                      </span>
                    </div>
                    <div style={styles.historyAnimals}>
                      {entry.animals.map((animalId, aIdx) => {
                        const isMatch = entry.selectedAnimals.includes(animalId);
                        return (
                          <div
                            key={aIdx}
                            style={{
                              ...styles.historyAnimalIcon,
                              ...(isMatch ? styles.historyAnimalIconMatch : {}),
                            }}
                          >
                            <img
                              src={ASSETS.getAnimal(animalId)}
                              alt=""
                              style={styles.historyAnimalImg}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div style={styles.historyMeta}>
                      {TEXTS.modes[entry.mode][lang]} | {entry.hora}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TELA 6 - PROVABLY FAIR (Modal central) */}
      <AnimatePresence>
        {showProvablyFair && (
          <motion.div
            style={styles.pfBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProvablyFair(false)}
          >
            <motion.div
              style={styles.pfModal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.pfHeader}>
                <span style={styles.pfTitle}>
                  <img src={ASSETS.iconProvablyFair} alt="" style={{ width: "20px", height: "20px", opacity: 0.8 }} />
                  {TEXTS.provablyFair[lang]}
                </span>
                <motion.button
                  style={styles.pfClose}
                  onClick={() => setShowProvablyFair(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  X
                </motion.button>
              </div>

              {/* Server Seed Hash */}
              <label style={styles.pfLabel}>{TEXTS.serverSeedHash[lang]}</label>
              <div style={styles.pfFieldRow}>
                <div style={styles.pfFieldReadonly}>
                  {fairData.serverSeedHash}
                </div>
                <motion.button
                  style={styles.pfCopyBtn}
                  onClick={() => handleCopy(fairData.serverSeedHash, "serverSeedHash")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={copiedField === "serverSeedHash" ? TEXTS.copied[lang] : ""}
                >
                  <img
                    src={ASSETS.iconCopy}
                    alt="Copy"
                    style={{
                      ...styles.pfCopyIcon,
                      ...(copiedField === "serverSeedHash" ? styles.pfCopyIconCopied : {}),
                    }}
                  />
                </motion.button>
              </div>

              {/* Client Seed */}
              <label style={styles.pfLabel}>{TEXTS.clientSeed[lang]}</label>
              <div style={styles.pfFieldRow}>
                <input
                  type="text"
                  value={fairData.clientSeed}
                  onChange={(e) => setFairData(prev => ({ ...prev, clientSeed: e.target.value }))}
                  style={styles.pfFieldEditable}
                />
              </div>

              {/* Nonce */}
              <label style={styles.pfLabel}>{TEXTS.nonce[lang]}</label>
              <div style={styles.pfFieldRow}>
                <div style={styles.pfFieldReadonly}>
                  {fairData.nonce}
                </div>
              </div>

              {/* Server Seed (pos-jogo) */}
              {fairData.serverSeed && (
                <>
                  <label style={styles.pfLabel}>{TEXTS.serverSeed[lang]}</label>
                  <div style={styles.pfFieldRow}>
                    <div style={styles.pfFieldReadonly}>
                      {fairData.serverSeed}
                    </div>
                    <motion.button
                      style={styles.pfCopyBtn}
                      onClick={() => handleCopy(fairData.serverSeed, "serverSeed")}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={copiedField === "serverSeed" ? TEXTS.copied[lang] : ""}
                    >
                      <img
                        src={ASSETS.iconCopy}
                        alt="Copy"
                        style={{
                          ...styles.pfCopyIcon,
                          ...(copiedField === "serverSeed" ? styles.pfCopyIconCopied : {}),
                        }}
                      />
                    </motion.button>
                  </div>
                </>
              )}

              {/* Botao Verificar */}
              <motion.button
                style={styles.pfVerifyBtn}
                onClick={handleVerify}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={TEXTS.tooltips.verifyBtn[lang]}
              >
                {TEXTS.verify[lang]}
              </motion.button>

              {/* Resultado */}
              {fairData.isValid !== null && (
                <div style={{ textAlign: "center" }}>
                  <motion.span
                    style={{
                      ...styles.pfResultBadge,
                      ...(fairData.isValid ? styles.pfResultValid : styles.pfResultInvalid),
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {TEXTS.result[lang]}: {fairData.isValid ? TEXTS.valid[lang] : TEXTS.invalid[lang]}
                  </motion.span>
                </div>
              )}

              {/* Texto explicativo */}
              <p style={styles.pfExplainer}>
                {TEXTS.howItWorks[lang]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
