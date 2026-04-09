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

const ANIMAL_FILES = [
  "", "01-AVESTRUZ", "02-AGUIA", "03-BURRO", "04-BORBOLETA", "05-CACHORRO",
  "06-CABRA", "07-CARNEIRO", "08-CAMELO", "09-COBRA", "10-COELHO",
  "11-CAVALO", "12-ELEFANTE", "13-GALO", "14-GATO", "15-JACARE",
  "16-LEAO", "17-MACACO", "18-PORCO", "19-PAVAO", "20-PERU",
  "21-TOURO", "22-TIGRE", "23-URSO", "24-VEADO", "25-VACA",
];

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
  getAnimal: (id: number) => `/assets/games/bicho/${ANIMAL_FILES[id]}.png`,
  getAnimalVideo: (id: number) => `/assets/games/bicho/bichos-video/${ANIMAL_FILES[id]}.mp4`,
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
  back: { br: "VOLTAR", in: "BACK" },
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState(0);
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

  // Imagem retrato com suporte a idioma (1.png ou 1-IN.png se existir)
  const getPortraitSrc = useCallback((id: number) => {
    if (lang === "in") return `/assets/games/bicho/${id}-IN.png`;
    return `/assets/games/bicho/${id}.png`;
  }, [lang]);

  // ESC fecha modais na ordem correta: preview > history > PF > volta ao painel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (previewAnimal !== null) { setPreviewAnimal(null); return; }
      if (showHelp) { setShowHelp(false); return; }
      if (showHistory) { setShowHistory(false); return; }
      if (showProvablyFair) { setShowProvablyFair(false); return; }
      if (phase === "RESULT") return;
      onBack();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [previewAnimal, showHelp, showHistory, showProvablyFair, phase, onBack]);

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
      inset: "6px",
      zIndex: 60,
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "#080604",
      backgroundImage: `url('${ASSETS.bgCasino}'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)`,
      backgroundSize: "cover, 100% 100%, 100% 100%",
      border: "1.5px solid rgba(212,168,67,0.35)",
      boxShadow: "inset 0 0 80px rgba(0,0,0,0.9), inset 0 0 2px rgba(212,168,67,0.15), 0 0 0 3px rgba(6,5,3,0.95), 0 0 0 4.5px rgba(212,168,67,0.2), 0 0 0 8px rgba(6,5,3,0.9), 0 0 30px rgba(212,168,67,0.06)",
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
      flexDirection: "column" as const,
      flex: 1,
      overflow: "hidden",
      alignItems: "center",
      padding: "clamp(4px, 0.6vw, 8px) clamp(8px, 1.2vw, 14px)",
      gap: "clamp(4px, 0.5vw, 8px)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridTemplateRows: "repeat(4, 1fr)",
      gap: "clamp(3px, 0.4vw, 5px)",
      flex: 1,
      minHeight: 0,
      aspectRatio: "7/4",
      maxHeight: "100%",
      overflow: "hidden",
    },
    card: {
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      background: "#0C0A08",
      border: "1px solid rgba(212,168,67,0.15)",
      borderRadius: "clamp(4px, 0.6vw, 8px)",
      cursor: "pointer",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      animation: "bichoBorderBrasil 6s linear infinite",
      transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.3s ease",
    },
    cardSelected: {
      border: "1.5px solid rgba(0,230,118,0.6)",
      boxShadow: "0 0 12px rgba(0,230,118,0.4), 0 0 30px rgba(0,230,118,0.15), inset 0 0 15px rgba(0,230,118,0.05)",
      animation: "bichoPulseGlow 2s ease-in-out infinite",
      zIndex: 2,
    },
    cardDisabled: {
      opacity: 0.2,
      filter: "grayscale(0.9) brightness(0.4)",
      cursor: "not-allowed",
      animation: "none",
    },
    cardImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      borderRadius: "clamp(3px, 0.5vw, 7px)",
      transition: "transform 0.4s ease, filter 0.4s ease",
    },
    cardOverlayNum: {
      position: "absolute" as const,
      top: "clamp(3px, 0.5vh, 8px)",
      right: "clamp(4px, 0.6vw, 10px)",
      fontFamily: "'Cinzel', serif",
      fontWeight: 900,
      fontSize: "clamp(10px, 1.3vw, 16px)",
      color: "rgba(255,255,255,0.85)",
      textShadow: "2px 2px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.8)",
      zIndex: 3,
      pointerEvents: "none" as const,
      lineHeight: 1,
    },
    cardOverlayName: {
      position: "absolute" as const,
      bottom: "clamp(3px, 0.5vh, 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "'Cinzel', serif",
      fontWeight: 700,
      fontSize: "clamp(7px, 0.9vw, 12px)",
      color: "rgba(212,168,67,0.9)",
      textShadow: "2px 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)",
      letterSpacing: "clamp(0.5px, 0.2vw, 2px)",
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const,
      zIndex: 3,
      pointerEvents: "none" as const,
    },
    cardBadge: {
      position: "absolute" as const,
      top: "clamp(3px, 0.5vh, 8px)",
      right: "clamp(4px, 0.6vw, 10px)",
      width: "clamp(20px, 2.5vw, 28px)",
      height: "clamp(20px, 2.5vw, 28px)",
      borderRadius: "50%",
      background: "#00E676",
      color: "#000",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 800,
      fontSize: "clamp(7px, 0.8vw, 10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "translate(25%, -15%)",
      boxShadow: "0 2px 8px rgba(0,230,118,0.5)",
      zIndex: 2,
    },
    panel: {
      flexShrink: 0,
      alignSelf: "stretch",
      display: "flex",
      flexDirection: "row" as const,
      alignItems: "center",
      gap: "clamp(10px, 1.5vw, 20px)",
      padding: "clamp(8px, 1vw, 12px) clamp(14px, 2vw, 28px)",
      background: "linear-gradient(180deg, rgba(15,12,8,0.97) 0%, rgba(6,5,3,0.99) 100%)",
      borderTop: "1px solid rgba(212,168,67,0.2)",
      borderRadius: "0 0 10px 10px",
      boxShadow: "inset 0 1px 0 rgba(212,168,67,0.06)",
    },
    panelSection: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "clamp(2px, 0.3vw, 4px)",
    },
    panelSectionLabel: {
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      fontSize: "clamp(7px, 0.7vw, 9px)",
      color: "rgba(212,168,67,0.45)",
      textTransform: "uppercase" as const,
      letterSpacing: "1.5px",
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
      width: "clamp(30px, 4vw, 42px)",
      height: "clamp(30px, 4vw, 42px)",
      borderRadius: "50%",
      cursor: "pointer",
      border: "1.5px solid rgba(212,168,67,0.15)",
      background: "rgba(15,13,8,0.9)",
      color: "#00E676",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 700,
      fontSize: "clamp(9px, 1vw, 12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
      transition: "all 0.2s ease",
    },
    chipActive: {
      borderColor: "#FFD700",
      color: "#FFD700",
      transform: "scale(1.15)",
      boxShadow: "0 0 12px rgba(255,215,0,0.25)",
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
      width: "clamp(32px, 4vw, 42px)",
      height: "clamp(32px, 4vw, 42px)",
      background: "rgba(15,13,8,0.8)",
      border: "1px solid rgba(212,168,67,0.2)",
      borderRadius: "8px",
      color: "#D4A843",
      cursor: "pointer",
      outline: "none",
      transition: "all 0.2s ease",
    },
    slotBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(6px, 0.7vw, 8px) clamp(10px, 1.2vw, 16px)",
      background: "rgba(15,13,8,0.8)",
      border: "1px solid rgba(212,168,67,0.15)",
      borderRadius: "6px",
      color: "rgba(255,255,255,0.55)",
      fontFamily: "'Cinzel', serif",
      fontWeight: 600,
      fontSize: "clamp(9px, 1vw, 12px)",
      letterSpacing: "0.5px",
      cursor: "pointer",
      outline: "none",
      textTransform: "uppercase" as const,
      transition: "all 0.2s ease",
    },
    btnJogar: {
      flex: 1,
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "clamp(36px, 5vw, 46px)",
      background: "linear-gradient(180deg, rgba(0,230,118,0.2) 0%, rgba(0,180,80,0.15) 50%, rgba(0,130,60,0.2) 100%)",
      border: "1px solid rgba(0,230,118,0.35)",
      borderRadius: "8px",
      fontFamily: "'Cinzel', serif",
      fontWeight: 800,
      fontSize: "clamp(11px, 1.3vw, 15px)",
      color: "#00E676",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
      textShadow: "0 0 10px rgba(0,230,118,0.3), 0 1px 3px rgba(0,0,0,0.8)",
      cursor: "pointer",
      outline: "none",
      transition: "all 0.2s ease",
    },
    btnJogarDisabled: {
      background: "rgba(40,40,40,0.4)",
      border: "1px solid rgba(60,60,60,0.3)",
      color: "rgba(255,255,255,0.2)",
      textShadow: "none",
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
      width: "clamp(32px, 4vw, 42px)",
      height: "clamp(32px, 4vw, 42px)",
      borderRadius: "8px",
      background: "linear-gradient(145deg, rgba(20,18,12,0.8) 0%, rgba(10,8,5,0.9) 100%)",
      border: "1px solid rgba(212,168,67,0.12)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
      transition: "all 0.2s ease",
    },
    footerBtnIcon: {
      width: "clamp(14px, 1.8vw, 20px)",
      height: "clamp(14px, 1.8vw, 20px)",
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
      width: "clamp(60px, 9vw, 110px)",
      height: "clamp(60px, 9vw, 110px)",
      borderRadius: "clamp(6px, 0.8vw, 10px)",
      overflow: "hidden",
      background: "linear-gradient(145deg, #2a2215 0%, #1a1508 100%)",
      border: "1.5px solid rgba(212,168,67,0.35)",
      boxShadow: "0 0 20px rgba(212,168,67,0.15), 0 4px 12px rgba(0,0,0,0.6), inset 0 0 15px rgba(0,0,0,0.5)",
    },
    capsuleSphereMatch: {
      border: "1.5px solid #00E676",
      boxShadow: "0 0 20px rgba(0,230,118,0.4), 0 0 40px rgba(0,230,118,0.15)",
    },
    capsuleReflect: {
      position: "absolute" as const,
      inset: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
      pointerEvents: "none" as const,
    },
    capsuleLimbDark: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "clamp(6px, 0.8vw, 10px)",
      background: "radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.2) 100%)",
      pointerEvents: "none" as const,
    },
    capsuleLid: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: "50%",
      borderRadius: "clamp(5px, 0.7vw, 9px) clamp(5px, 0.7vw, 9px) 0 0",
      background: "linear-gradient(180deg, rgba(212,168,67,0.15) 0%, rgba(15,12,8,0.95) 100%)",
      borderBottom: "1px solid rgba(212,168,67,0.15)",
      transformOrigin: "bottom center",
      zIndex: 2,
    },
    capsuleAnimal: {
      position: "absolute" as const,
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    capsuleAnimalImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      borderRadius: "clamp(5px, 0.7vw, 9px)",
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
      gap: "clamp(6px, 1vw, 12px)",
      justifyContent: "center",
    },
    miniCard: {
      width: "clamp(50px, 7vw, 80px)",
      height: "clamp(50px, 7vw, 80px)",
      borderRadius: "clamp(4px, 0.6vw, 8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(8,6,4,0.95)",
      overflow: "hidden",
    },
    miniCardMatch: {
      border: "1.5px solid #00E676",
      boxShadow: "0 0 12px rgba(0,230,118,0.3)",
    },
    miniCardMiss: {
      opacity: 0.5,
      border: "1px solid rgba(212,168,67,0.1)",
    },
    miniCardImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      borderRadius: "clamp(3px, 0.5vw, 7px)",
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
        @keyframes bichoBorderBrasil {
          0%   { border-color: rgba(0,230,118,0.35); box-shadow: 0 0 8px rgba(0,230,118,0.12), inset 0 0 8px rgba(0,230,118,0.04); }
          33%  { border-color: rgba(212,168,67,0.35); box-shadow: 0 0 8px rgba(212,168,67,0.12), inset 0 0 8px rgba(212,168,67,0.04); }
          66%  { border-color: rgba(30,120,255,0.35); box-shadow: 0 0 8px rgba(30,120,255,0.12), inset 0 0 8px rgba(30,120,255,0.04); }
          100% { border-color: rgba(0,230,118,0.35); box-shadow: 0 0 8px rgba(0,230,118,0.12), inset 0 0 8px rgba(0,230,118,0.04); }
        }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        *::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.3); border-radius: 4px; }
        *::-webkit-scrollbar-thumb:hover { background: rgba(212,168,67,0.5); }
        button:focus, button:focus-visible { outline: none !important; box-shadow: none !important; }
        button::-moz-focus-inner { border: 0; }
        @media (max-height: 600px) {
          .bicho-grid { gap: 2px !important; }
        }
        @media (min-width: 1600px) {
          .bicho-grid { gap: 6px !important; }
        }
      `}</style>
      {/* HEADER — padrao slot machine */}
      <header style={styles.header}>
        <motion.button
          style={{
            ...styles.headerBack,
            border: "1px solid rgba(212,168,67,0.25)",
            borderRadius: "6px",
            padding: "clamp(4px, 0.5vw, 8px) clamp(10px, 1.2vw, 16px)",
          }}
          onClick={onBack}
          whileHover={{ borderColor: "rgba(212,168,67,0.5)", color: "#D4A843" }}
          whileTap={{ scale: 0.95 }}
          title={TEXTS.tooltips.back[lang]}
        >
          ← {TEXTS.back[lang]}
        </motion.button>

        <motion.h1
          style={styles.headerTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {TEXTS.title[lang]}
        </motion.h1>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 10px)" }}>
          <div style={styles.headerBalance}>
            <img src={ASSETS.iconGcoin} alt="" style={{ width: "18px", height: "18px" }} />
            {formatBalance(saldo)}
          </div>
          <motion.button
            onClick={() => setShowHelp(true)}
            whileHover={{ borderColor: "rgba(212,168,67,0.5)", color: "#D4A843" }}
            whileTap={{ scale: 0.95 }}
            title={lang === "br" ? "Ajuda" : "Help"}
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              border: "1px solid rgba(212,168,67,0.25)", background: "transparent",
              color: "rgba(212,168,67,0.6)", fontFamily: "'Cinzel', serif",
              fontWeight: 700, fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            ?
          </motion.button>
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
                  whileHover={!isDisabled ? {
                    filter: "brightness(1.35)",
                    boxShadow: "0 0 15px rgba(212,168,67,0.3), 0 0 30px rgba(212,168,67,0.1), inset 0 0 20px rgba(212,168,67,0.06)",
                    borderColor: "rgba(212,168,67,0.5)",
                    transition: { duration: 0.2, ease: "easeOut" },
                  } : {}}
                  whileTap={!isDisabled ? { filter: "brightness(0.9)" } : {}}
                  onClick={() => {
                    if (isDisabled) return;
                    if (isSelected) { handleSelectAnimal(animal.id); sounds.deselectAnimal(); }
                    else { setPreviewAnimal(animal.id); sounds.hover(); }
                  }}
                  onMouseEnter={() => !isDisabled && setHoveredCard(animal.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  title={tooltip}
                >
                  {hoveredCard === animal.id ? (
                    <video
                      ref={(el) => { if (el) { el.playbackRate = 2; } }}
                      src={ASSETS.getAnimalVideo(animal.id)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      style={styles.cardImg}
                    />
                  ) : (
                    <img src={ASSETS.getAnimal(animal.id)} alt={animal.name[lang]} style={styles.cardImg} />
                  )}
                  <span style={{
                    ...styles.cardOverlayNum,
                    ...(isSelected ? {
                      background: "#00E676",
                      color: "#000",
                      width: "clamp(22px, 2.8vw, 30px)",
                      height: "clamp(22px, 2.8vw, 30px)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textShadow: "none",
                      boxShadow: "0 2px 8px rgba(0,230,118,0.5)",
                    } : {}),
                  }}>{String(animal.id).padStart(2, "0")}</span>
                  <span style={styles.cardOverlayName}>{animal.name[lang]}</span>
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
              return (
                <motion.div
                  key="preview-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute", inset: 0, zIndex: 70,
                    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onClick={() => setPreviewAnimal(null)}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: "flex", flexDirection: "column" as const, alignItems: "center",
                      gap: "clamp(12px, 2vw, 20px)",
                    }}
                  >
                    {/* Imagem retrato direta — sem frame extra (imagem ja tem borda propria) */}
                    <motion.img
                      src={getPortraitSrc(previewAnimal)}
                      alt={animal.name[lang]}
                      onError={(e) => { (e.target as HTMLImageElement).src = `/assets/games/bicho/${previewAnimal}.png`; }}
                      animate={{
                        filter: [
                          "drop-shadow(0 0 20px rgba(212,168,67,0.15)) drop-shadow(0 15px 25px rgba(0,0,0,0.6))",
                          "drop-shadow(0 0 35px rgba(212,168,67,0.3)) drop-shadow(0 20px 35px rgba(0,0,0,0.7))",
                          "drop-shadow(0 0 20px rgba(212,168,67,0.15)) drop-shadow(0 15px 25px rgba(0,0,0,0.6))",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{
                        scale: 1.04,
                        filter: "drop-shadow(0 0 30px rgba(0,230,118,0.35)) drop-shadow(0 25px 50px rgba(0,230,118,0.2)) drop-shadow(0 0 80px rgba(0,230,118,0.1)) brightness(1.1)",
                        transition: {
                          scale: { delay: 0.4, duration: 0.5, ease: "easeOut" },
                          filter: { duration: 0.4, ease: "easeOut" },
                        },
                      }}
                      style={{
                        height: "clamp(380px, 70vh, 560px)",
                        width: "auto",
                        display: "block",
                        cursor: "pointer",
                        borderRadius: "clamp(10px, 1.5vw, 16px)",
                      }}
                    />

                    {/* Botoes */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                      style={{ display: "flex", gap: "clamp(8px, 1.5vw, 14px)", width: "100%", maxWidth: "clamp(280px, 45vh, 420px)" }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setPreviewAnimal(null)}
                        style={{
                          flex: 1, padding: "clamp(10px, 1.5vh, 14px)",
                          border: "1px solid rgba(212,168,67,0.2)", borderRadius: "10px",
                          background: "rgba(212,168,67,0.05)", backdropFilter: "blur(4px)",
                          color: "rgba(212,168,67,0.7)", fontFamily: "'Cinzel', serif",
                          fontWeight: 700, fontSize: "clamp(11px, 1.3vw, 14px)",
                          cursor: "pointer", letterSpacing: "1.5px",
                          transition: "all 0.25s ease",
                        }}
                      >
                        {lang === "br" ? "CANCELAR" : "CANCEL"}
                      </motion.button>
                      <motion.button
                        whileHover={(!alreadySelected && canAdd) ? {
                          scale: 1.04,
                          boxShadow: "0 0 20px rgba(0,230,118,0.4), 0 0 40px rgba(0,230,118,0.15)",
                        } : {}}
                        whileTap={(!alreadySelected && canAdd) ? { scale: 0.96 } : {}}
                        onClick={() => {
                          if (!alreadySelected && canAdd) handleSelectAnimal(previewAnimal);
                          setPreviewAnimal(null);
                        }}
                        style={{
                          flex: 1.4, padding: "clamp(10px, 1.5vh, 14px)",
                          border: (!alreadySelected && canAdd) ? "1px solid rgba(0,230,118,0.3)" : "1px solid rgba(60,60,60,0.3)",
                          borderRadius: "10px",
                          background: (!alreadySelected && canAdd)
                            ? "linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,200,83,0.1) 100%)"
                            : "rgba(40,40,40,0.4)",
                          color: (!alreadySelected && canAdd) ? "#00E676" : "rgba(255,255,255,0.25)",
                          fontFamily: "'Cinzel', serif", fontWeight: 800,
                          fontSize: "clamp(11px, 1.3vw, 14px)",
                          cursor: (!alreadySelected && canAdd) ? "pointer" : "not-allowed",
                          letterSpacing: "1.5px",
                          textShadow: (!alreadySelected && canAdd) ? "0 0 10px rgba(0,230,118,0.3)" : "none",
                          transition: "all 0.25s ease",
                        }}
                      >
                        {alreadySelected
                          ? (lang === "br" ? "JÁ SELECIONADO" : "ALREADY SELECTED")
                          : !canAdd
                            ? (lang === "br" ? "LIMITE ATINGIDO" : "LIMIT REACHED")
                            : (lang === "br" ? "SELECIONAR" : "SELECT")}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* BARRA INFERIOR — padrao slot machine */}
          <div style={styles.panel}>
            {/* HISTORICO + PF (esquerda, como no slot) */}
            <motion.button style={styles.slotBtn} onClick={() => setShowHistory(true)} whileHover={{ borderColor: "rgba(212,168,67,0.35)" }} whileTap={{ scale: 0.95 }} title={TEXTS.tooltips.historyBtn[lang]}>
              <img src={ASSETS.iconHistory} alt="" style={{ width: "clamp(14px, 1.5vw, 18px)", height: "clamp(14px, 1.5vw, 18px)", opacity: 0.7 }} />
            </motion.button>
            <motion.button style={styles.slotBtn} onClick={() => setShowProvablyFair(true)} whileHover={{ borderColor: "rgba(212,168,67,0.35)" }} whileTap={{ scale: 0.95 }} title={TEXTS.tooltips.pfBtn[lang]}>
              <img src={ASSETS.iconProvablyFair} alt="" style={{ width: "clamp(14px, 1.5vw, 18px)", height: "clamp(14px, 1.5vw, 18px)", opacity: 0.7 }} />
            </motion.button>

            <div style={{ width: "1px", height: "28px", background: "rgba(212,168,67,0.1)" }} />

            {/* MODOS (como MIN/÷2/x2/MAX do slot) */}
            {(Object.keys(MODE_CONFIG) as BetMode[]).map((mode) => (
              <motion.button
                key={mode}
                style={{
                  ...styles.slotBtn,
                  ...(betMode === mode ? {
                    borderColor: "rgba(0,230,118,0.4)",
                    color: "#00E676",
                    background: "rgba(0,230,118,0.06)",
                  } : {}),
                }}
                onClick={() => handleModeChange(mode)}
                whileHover={betMode !== mode ? { borderColor: "rgba(212,168,67,0.3)" } : {}}
                whileTap={{ scale: 0.97 }}
                title={TEXTS.tooltips[mode][lang]}
              >
                {TEXTS.modes[mode][lang]}
              </motion.button>
            ))}

            <div style={{ width: "1px", height: "28px", background: "rgba(212,168,67,0.1)" }} />

            {/* APOSTA — caixa destacada verde (como APOSTA 10 GC do slot) */}
            <div style={{
              display: "flex", flexDirection: "column" as const, alignItems: "center",
              padding: "clamp(4px, 0.5vw, 6px) clamp(12px, 1.5vw, 20px)",
              border: "1px solid rgba(0,230,118,0.3)", borderRadius: "6px",
              background: "rgba(0,230,118,0.04)", minWidth: "clamp(60px, 8vw, 90px)",
            }}>
              <span style={{ fontSize: "clamp(7px, 0.7vw, 9px)", color: "rgba(212,168,67,0.5)", fontFamily: "'Inter', sans-serif", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
                {lang === "br" ? "APOSTA" : "BET"}
              </span>
              <div style={{ display: "flex", gap: "clamp(2px, 0.3vw, 4px)", alignItems: "center" }}>
                {BET_CHIPS.map((chip) => (
                  <motion.button
                    key={chip}
                    onClick={() => setBetAmount(chip)}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: betAmount === chip ? "rgba(0,230,118,0.12)" : "transparent",
                      border: betAmount === chip ? "1px solid rgba(0,230,118,0.4)" : "1px solid transparent",
                      borderRadius: "4px",
                      padding: "clamp(2px, 0.3vw, 4px) clamp(4px, 0.5vw, 8px)",
                      color: betAmount === chip ? "#00E676" : "rgba(255,255,255,0.4)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: "clamp(10px, 1.1vw, 13px)",
                      cursor: "pointer", outline: "none",
                    }}
                  >
                    {chip >= 1000 ? `${chip / 1000}k` : chip}
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={{ width: "1px", height: "28px", background: "rgba(212,168,67,0.1)" }} />

            {/* GANHO compacto */}
            <div style={{
              display: "flex", flexDirection: "column" as const,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ fontSize: "clamp(7px, 0.7vw, 9px)", color: "rgba(212,168,67,0.45)", letterSpacing: "1px" }}>
                {lang === "br" ? "GANHO" : "WIN"}
              </span>
              <span style={{ fontSize: "clamp(10px, 1.1vw, 14px)", fontWeight: 700, color: "#D4A843" }}>
                {multipliers.first}x = G${formatBalance(potentialWin1)}
              </span>
            </div>

            <div style={{ flex: 1 }} />

            {/* JOGAR — circulo verde (como ▶ do slot) */}
            <motion.button
              style={styles.slotBtn}
              onClick={handleRandomSelect}
              whileHover={{ borderColor: "rgba(212,168,67,0.4)" }}
              whileTap={{ scale: 0.95 }}
              title={TEXTS.tooltips.random[lang]}
            >
              <img src={ASSETS.iconRandom} alt="" style={{ width: "clamp(14px, 1.5vw, 18px)", height: "clamp(14px, 1.5vw, 18px)", opacity: 0.8 }} />
            </motion.button>

            <motion.button
              onClick={handlePlay}
              disabled={!canPlay}
              whileHover={canPlay ? { scale: 1.08, boxShadow: "0 0 20px rgba(0,230,118,0.4)" } : {}}
              whileTap={canPlay ? { scale: 0.93 } : {}}
              title={TEXTS.tooltips.play[lang]}
              style={{
                width: "clamp(36px, 4.5vw, 48px)", height: "clamp(36px, 4.5vw, 48px)",
                borderRadius: "50%",
                background: canPlay ? "#00E676" : "rgba(40,40,40,0.5)",
                border: "none", outline: "none", cursor: canPlay ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: canPlay ? "0 0 12px rgba(0,230,118,0.3)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{
                fontSize: "clamp(14px, 1.8vw, 20px)",
                color: canPlay ? "#000" : "rgba(255,255,255,0.2)",
                marginLeft: "2px",
              }}>▶</span>
            </motion.button>

            <motion.button style={styles.slotBtn} onClick={() => setSoundEnabled(!soundEnabled)} whileHover={{ borderColor: "rgba(212,168,67,0.35)" }} whileTap={{ scale: 0.95 }}>
              <img src={soundEnabled ? ASSETS.iconSoundOn : ASSETS.iconSoundOff} alt="" style={{ width: "clamp(14px, 1.5vw, 18px)", height: "clamp(14px, 1.5vw, 18px)", opacity: 0.7 }} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* MODAL AJUDA */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            key="help-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", inset: 0, zIndex: 80,
              background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "clamp(340px, 50vw, 600px)", maxHeight: "80vh",
                background: "linear-gradient(180deg, #151210 0%, #0C0A08 100%)",
                border: "1px solid rgba(212,168,67,0.2)", borderRadius: "14px",
                display: "flex", flexDirection: "column" as const, overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "clamp(12px, 1.5vw, 18px) clamp(16px, 2vw, 24px)",
                borderBottom: "1px solid rgba(212,168,67,0.12)",
              }}>
                <h2 style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 800,
                  fontSize: "clamp(16px, 2vw, 22px)", color: "#D4A843",
                  letterSpacing: "2px", margin: 0,
                }}>
                  {lang === "br" ? "AJUDA" : "HELP"}
                </h2>
                <motion.button
                  onClick={() => setShowHelp(false)}
                  whileHover={{ color: "#D4A843", scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
                    fontSize: "20px", cursor: "pointer", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Tabs */}
              <div style={{
                display: "flex", gap: "0", borderBottom: "1px solid rgba(212,168,67,0.08)",
                padding: "0 clamp(12px, 1.5vw, 20px)",
              }}>
                {[
                  { br: "COMO JOGAR", in: "HOW TO PLAY" },
                  { br: "MODOS", in: "MODES" },
                  { br: "PREMIAÇÃO", in: "PAYOUTS" },
                  { br: "PROVABLY FAIR", in: "PROVABLY FAIR" },
                ].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setHelpTab(i)}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "clamp(8px, 1vw, 12px) clamp(10px, 1.2vw, 16px)",
                      fontFamily: "'Cinzel', serif", fontWeight: 700,
                      fontSize: "clamp(9px, 1vw, 12px)", letterSpacing: "0.5px",
                      color: helpTab === i ? "#D4A843" : "rgba(255,255,255,0.35)",
                      borderBottom: helpTab === i ? "2px solid #D4A843" : "2px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab[lang]}
                  </button>
                ))}
              </div>

              {/* Conteudo */}
              <div style={{
                flex: 1, overflowY: "auto" as const,
                padding: "clamp(14px, 2vw, 22px)",
                fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 1.2vw, 14px)",
                color: "rgba(255,255,255,0.75)", lineHeight: 1.7,
                scrollbarWidth: "thin" as any,
                scrollbarColor: "rgba(212,168,67,0.3) transparent" as any,
              }}>
                {helpTab === 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", color: "#D4A843", fontSize: "clamp(14px, 1.5vw, 18px)", marginTop: 0 }}>
                      {lang === "br" ? "Como Jogar" : "How to Play"}
                    </h3>
                    <p>{lang === "br"
                      ? "O Jogo do Bicho possui 25 animais, cada um representando um grupo de 4 dezenas (01 a 00). Seu objetivo é escolher os animais certos que serão sorteados."
                      : "The Animal Game has 25 animals, each representing a group of 4 numbers (01 to 00). Your goal is to choose the right animals that will be drawn."
                    }</p>
                    <p style={{ color: "#D4A843", fontWeight: 600 }}>{lang === "br" ? "Passo a passo:" : "Step by step:"}</p>
                    <p>{lang === "br"
                      ? "1. Escolha o modo de aposta na barra inferior (Simple, Dupla, Tripla, Quadra ou Quina)."
                      : "1. Choose the bet mode in the bottom bar (Simple, Double, Triple, Quad or Quint)."
                    }</p>
                    <p>{lang === "br"
                      ? "2. Defina o valor da aposta clicando nas fichas (50, 100, 250, 500 ou 1k)."
                      : "2. Set the bet amount by clicking the chips (50, 100, 250, 500 or 1k)."
                    }</p>
                    <p>{lang === "br"
                      ? "3. Clique nos animais para visualizar e selecionar. Um preview aparece mostrando o animal em detalhe."
                      : "3. Click on animals to preview and select them. A preview shows the animal in detail."
                    }</p>
                    <p>{lang === "br"
                      ? "4. Pressione JOGAR quando todos os animais estiverem selecionados. O sorteio começa automaticamente."
                      : "4. Press PLAY when all animals are selected. The draw starts automatically."
                    }</p>
                    <p>{lang === "br"
                      ? "5. Cinco cápsulas são abertas uma a uma, revelando os animais sorteados. Se TODOS os seus animais aparecerem, você ganha!"
                      : "5. Five capsules are opened one by one, revealing the drawn animals. If ALL your animals appear, you win!"
                    }</p>
                    <p>{lang === "br"
                      ? "6. O prêmio depende do modo escolhido e das posições dos acertos."
                      : "6. The prize depends on the chosen mode and the positions of your matches."
                    }</p>
                  </div>
                )}
                {helpTab === 1 && (
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", color: "#D4A843", fontSize: "clamp(14px, 1.5vw, 18px)", marginTop: 0 }}>
                      {lang === "br" ? "Modos de Aposta" : "Bet Modes"}
                    </h3>
                    <p><strong style={{ color: "#00E676" }}>Simple</strong> — {lang === "br"
                      ? "Escolha 1 animal. Se ele aparecer em qualquer posição do sorteio, você ganha."
                      : "Choose 1 animal. If it appears in any draw position, you win."
                    }</p>
                    <p><strong style={{ color: "#00E676" }}>Dupla</strong> — {lang === "br"
                      ? "Escolha 2 animais. Ambos devem aparecer no sorteio para você ganhar."
                      : "Choose 2 animals. Both must appear in the draw for you to win."
                    }</p>
                    <p><strong style={{ color: "#00E676" }}>Tripla</strong> — {lang === "br"
                      ? "Escolha 3 animais. Todos os 3 devem aparecer no sorteio."
                      : "Choose 3 animals. All 3 must appear in the draw."
                    }</p>
                    <p><strong style={{ color: "#00E676" }}>Quadra</strong> — {lang === "br"
                      ? "Escolha 4 animais. Todos os 4 devem aparecer no sorteio."
                      : "Choose 4 animals. All 4 must appear in the draw."
                    }</p>
                    <p><strong style={{ color: "#00E676" }}>Quina</strong> — {lang === "br"
                      ? "Escolha 5 animais. Todos os 5 devem aparecer no sorteio. Risco máximo, prêmio máximo!"
                      : "Choose 5 animals. All 5 must appear in the draw. Maximum risk, maximum reward!"
                    }</p>
                  </div>
                )}
                {helpTab === 2 && (
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", color: "#D4A843", fontSize: "clamp(14px, 1.5vw, 18px)", marginTop: 0 }}>
                      {lang === "br" ? "Tabela de Premiação" : "Payout Table"}
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>{lang === "br"
                      ? "Se seus animais acertarem nas primeiras posições, o prêmio é maior."
                      : "If your animals match in the first positions, the prize is higher."
                    }</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(11px, 1.1vw, 13px)" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
                          <th style={{ padding: "8px", textAlign: "left", color: "#D4A843" }}>{lang === "br" ? "Modo" : "Mode"}</th>
                          <th style={{ padding: "8px", textAlign: "center", color: "#D4A843" }}>1º</th>
                          <th style={{ padding: "8px", textAlign: "center", color: "rgba(212,168,67,0.6)" }}>{lang === "br" ? "Outros" : "Others"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { mode: "Simple", f: "12x", o: "3x" },
                          { mode: "Dupla", f: "90x", o: "10x" },
                          { mode: "Tripla", f: "650x", o: "40x" },
                          { mode: "Quadra", f: "3.500x", o: "180x" },
                          { mode: "Quina", f: "15.000x", o: "1.200x" },
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ padding: "8px", color: "rgba(255,255,255,0.7)" }}>{row.mode}</td>
                            <td style={{ padding: "8px", textAlign: "center", color: "#00E676", fontWeight: 700 }}>{row.f}</td>
                            <td style={{ padding: "8px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>{row.o}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.4)", fontSize: "clamp(10px, 1vw, 12px)" }}>
                      {lang === "br" ? "Prêmio máximo: G$3.000.000 por rodada." : "Maximum payout: G$3,000,000 per round."}
                    </p>
                  </div>
                )}
                {helpTab === 3 && (
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", color: "#D4A843", fontSize: "clamp(14px, 1.5vw, 18px)", marginTop: 0 }}>
                      Provably Fair
                    </h3>
                    <p>{lang === "br"
                      ? "O Jogo do Bicho utiliza o sistema Provably Fair para garantir que todos os sorteios são justos e verificáveis."
                      : "The Animal Game uses the Provably Fair system to ensure all draws are fair and verifiable."
                    }</p>
                    <p style={{ color: "#D4A843", fontWeight: 600 }}>{lang === "br" ? "Como funciona:" : "How it works:"}</p>
                    <p>{lang === "br"
                      ? "1. Antes de cada rodada, o servidor gera uma seed secreta e envia o HASH dela para você."
                      : "1. Before each round, the server generates a secret seed and sends you its HASH."
                    }</p>
                    <p>{lang === "br"
                      ? "2. Você possui uma client seed que combina com a do servidor para gerar o resultado."
                      : "2. You have a client seed that combines with the server's to generate the result."
                    }</p>
                    <p>{lang === "br"
                      ? "3. Após a rodada, a seed do servidor é revelada. Você pode verificar que o HASH bate."
                      : "3. After the round, the server seed is revealed. You can verify the HASH matches."
                    }</p>
                    <p>{lang === "br"
                      ? "4. O resultado é calculado com HMAC-SHA256, impossível de manipular."
                      : "4. The result is calculated with HMAC-SHA256, impossible to manipulate."
                    }</p>
                    <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.4)", fontSize: "clamp(10px, 1vw, 12px)" }}>
                      {lang === "br"
                        ? "Clique no botão PF na barra inferior para verificar rodadas anteriores."
                        : "Click the PF button in the bottom bar to verify previous rounds."
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            key="history-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", inset: 0, zIndex: 80,
              background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "clamp(360px, 55vw, 650px)", maxHeight: "80vh",
                background: "linear-gradient(180deg, #151210 0%, #0C0A08 100%)",
                border: "1px solid rgba(212,168,67,0.2)", borderRadius: "14px",
                display: "flex", flexDirection: "column" as const, overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "clamp(12px, 1.5vw, 18px) clamp(16px, 2vw, 24px)",
                borderBottom: "1px solid rgba(212,168,67,0.12)",
              }}>
                <h2 style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 800,
                  fontSize: "clamp(16px, 2vw, 22px)", color: "#D4A843",
                  letterSpacing: "2px", margin: 0,
                }}>
                  {TEXTS.history[lang]}
                </h2>
                <motion.button
                  onClick={() => setShowHistory(false)}
                  whileHover={{ color: "#D4A843", scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
                    fontSize: "20px", cursor: "pointer", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Lista */}
              <div style={{
                flex: 1, overflowY: "auto" as const,
                padding: "clamp(12px, 1.5vw, 20px)",
                scrollbarWidth: "thin" as any,
                scrollbarColor: "rgba(212,168,67,0.3) transparent" as any,
              }}>
                {history.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(12px, 1.2vw, 14px)",
                  }}>
                    {lang === "br" ? "Nenhum historico ainda. Jogue para ver seus resultados aqui." : "No history yet. Play to see your results here."}
                  </div>
                ) : (
                  history.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * idx }}
                      style={{
                        display: "flex", flexDirection: "column" as const, gap: "8px",
                        padding: "clamp(10px, 1.2vw, 14px)",
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                        borderRadius: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      {/* Linha 1: ID + Status + Valor */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(10px, 1vw, 12px)",
                          color: "rgba(212,168,67,0.4)",
                        }}>#{entry.id}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: "4px",
                          fontSize: "clamp(9px, 0.9vw, 11px)", fontWeight: 700,
                          background: entry.won ? "rgba(0,230,118,0.1)" : "rgba(255,68,68,0.1)",
                          color: entry.won ? "#00E676" : "#FF6B6B",
                          border: `1px solid ${entry.won ? "rgba(0,230,118,0.2)" : "rgba(255,68,68,0.2)"}`,
                        }}>
                          {entry.won ? (lang === "br" ? "VITORIA" : "WIN") : (lang === "br" ? "DERROTA" : "LOSS")}
                        </span>
                        <span style={{
                          marginLeft: "auto",
                          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          fontSize: "clamp(11px, 1.2vw, 14px)",
                          color: entry.won ? "#00E676" : "#FF6B6B",
                        }}>
                          {entry.won ? `+G$${formatBalance(entry.payout)}` : `-G$${formatBalance(entry.betAmount)}`}
                        </span>
                      </div>

                      {/* Linha 2: Animais sorteados */}
                      <div style={{ display: "flex", gap: "4px" }}>
                        {entry.animals.map((animalId, aIdx) => {
                          const isMatch = entry.selectedAnimals.includes(animalId);
                          return (
                            <div key={aIdx} style={{
                              width: "clamp(28px, 3.5vw, 40px)", height: "clamp(28px, 3.5vw, 40px)",
                              borderRadius: "4px", overflow: "hidden",
                              border: isMatch ? "1px solid rgba(0,230,118,0.5)" : "1px solid rgba(255,255,255,0.06)",
                              opacity: isMatch ? 1 : 0.4,
                            }}>
                              <img src={ASSETS.getAnimal(animalId)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Linha 3: Modo + Hora */}
                      <div style={{
                        fontSize: "clamp(9px, 0.9vw, 11px)",
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {TEXTS.modes[entry.mode][lang]} | {entry.hora}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TELA 6 - PROVABLY FAIR */}
      <AnimatePresence>
        {showProvablyFair && (
          <motion.div
            key="pf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", inset: 0, zIndex: 80,
              background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowProvablyFair(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "clamp(360px, 50vw, 580px)", maxHeight: "80vh",
                background: "linear-gradient(180deg, #151210 0%, #0C0A08 100%)",
                border: "1px solid rgba(212,168,67,0.2)", borderRadius: "14px",
                display: "flex", flexDirection: "column" as const, overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "clamp(12px, 1.5vw, 18px) clamp(16px, 2vw, 24px)",
                borderBottom: "1px solid rgba(212,168,67,0.12)",
              }}>
                <h2 style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 800,
                  fontSize: "clamp(16px, 2vw, 22px)", color: "#D4A843",
                  letterSpacing: "2px", margin: 0,
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <img src={ASSETS.iconProvablyFair} alt="" style={{ width: "20px", height: "20px", opacity: 0.8 }} />
                  {TEXTS.provablyFair[lang]}
                </h2>
                <motion.button
                  onClick={() => setShowProvablyFair(false)}
                  whileHover={{ color: "#D4A843", scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: "transparent", border: "none", color: "rgba(255,255,255,0.4)",
                    fontSize: "20px", cursor: "pointer", width: "32px", height: "32px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Conteudo */}
              <div style={{
                flex: 1, overflowY: "auto" as const,
                padding: "clamp(14px, 2vw, 22px)",
                display: "flex", flexDirection: "column" as const, gap: "14px",
                scrollbarWidth: "thin" as any,
                scrollbarColor: "rgba(212,168,67,0.3) transparent" as any,
              }}>
                {/* Server Seed Hash */}
                <div>
                  <label style={{
                    fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1vw, 12px)",
                    color: "rgba(212,168,67,0.6)", letterSpacing: "1px",
                    display: "block", marginBottom: "6px",
                  }}>{TEXTS.serverSeedHash[lang]}</label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <div style={{
                      flex: 1, padding: "8px 12px",
                      background: "rgba(0,0,0,0.4)", borderRadius: "6px",
                      border: "1px solid rgba(212,168,67,0.1)",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(9px, 0.9vw, 11px)",
                      color: "rgba(255,255,255,0.6)", wordBreak: "break-all" as const,
                    }}>{fairData.serverSeedHash}</div>
                    <motion.button
                      onClick={() => handleCopy(fairData.serverSeedHash, "serverSeedHash")}
                      whileHover={{ borderColor: "rgba(212,168,67,0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "8px", background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(212,168,67,0.15)", borderRadius: "6px",
                        cursor: "pointer", outline: "none",
                      }}
                    >
                      <img src={ASSETS.iconCopy} alt="" style={{
                        width: "14px", height: "14px",
                        opacity: copiedField === "serverSeedHash" ? 1 : 0.5,
                        filter: copiedField === "serverSeedHash" ? "hue-rotate(90deg) brightness(1.5)" : "none",
                      }} />
                    </motion.button>
                  </div>
                </div>

                {/* Client Seed */}
                <div>
                  <label style={{
                    fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1vw, 12px)",
                    color: "rgba(212,168,67,0.6)", letterSpacing: "1px",
                    display: "block", marginBottom: "6px",
                  }}>{TEXTS.clientSeed[lang]}</label>
                  <input
                    type="text"
                    value={fairData.clientSeed}
                    onChange={(e) => setFairData(prev => ({ ...prev, clientSeed: e.target.value }))}
                    style={{
                      width: "100%", padding: "8px 12px",
                      background: "rgba(0,0,0,0.4)", borderRadius: "6px",
                      border: "1px solid rgba(212,168,67,0.2)",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(10px, 1vw, 12px)",
                      color: "#D4A843", outline: "none", boxSizing: "border-box" as const,
                    }}
                  />
                </div>

                {/* Nonce */}
                <div>
                  <label style={{
                    fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1vw, 12px)",
                    color: "rgba(212,168,67,0.6)", letterSpacing: "1px",
                    display: "block", marginBottom: "6px",
                  }}>{TEXTS.nonce[lang]}</label>
                  <div style={{
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.4)", borderRadius: "6px",
                    border: "1px solid rgba(212,168,67,0.1)",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(10px, 1vw, 12px)",
                    color: "rgba(255,255,255,0.6)",
                  }}>{fairData.nonce}</div>
                </div>

                {/* Server Seed (pos-jogo) */}
                {fairData.serverSeed && (
                  <div>
                    <label style={{
                      fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1vw, 12px)",
                      color: "rgba(212,168,67,0.6)", letterSpacing: "1px",
                      display: "block", marginBottom: "6px",
                    }}>{TEXTS.serverSeed[lang]}</label>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <div style={{
                        flex: 1, padding: "8px 12px",
                        background: "rgba(0,0,0,0.4)", borderRadius: "6px",
                        border: "1px solid rgba(212,168,67,0.1)",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(9px, 0.9vw, 11px)",
                        color: "rgba(255,255,255,0.6)", wordBreak: "break-all" as const,
                      }}>{fairData.serverSeed}</div>
                      <motion.button
                        onClick={() => handleCopy(fairData.serverSeed, "serverSeed")}
                        whileHover={{ borderColor: "rgba(212,168,67,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "8px", background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(212,168,67,0.15)", borderRadius: "6px",
                          cursor: "pointer", outline: "none",
                        }}
                      >
                        <img src={ASSETS.iconCopy} alt="" style={{
                          width: "14px", height: "14px",
                          opacity: copiedField === "serverSeed" ? 1 : 0.5,
                          filter: copiedField === "serverSeed" ? "hue-rotate(90deg) brightness(1.5)" : "none",
                        }} />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Verificar */}
                <motion.button
                  onClick={handleVerify}
                  whileHover={{ borderColor: "rgba(0,230,118,0.5)", background: "rgba(0,230,118,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "clamp(8px, 1vw, 12px)",
                    background: "rgba(0,230,118,0.06)",
                    border: "1px solid rgba(0,230,118,0.3)", borderRadius: "8px",
                    fontFamily: "'Cinzel', serif", fontWeight: 700,
                    fontSize: "clamp(11px, 1.2vw, 14px)", color: "#00E676",
                    textTransform: "uppercase" as const, letterSpacing: "1px",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  {TEXTS.verify[lang]}
                </motion.button>

                {/* Resultado */}
                {fairData.isValid !== null && (
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <span style={{
                      padding: "6px 16px", borderRadius: "6px",
                      fontFamily: "'Cinzel', serif", fontWeight: 700,
                      fontSize: "clamp(11px, 1.2vw, 14px)", letterSpacing: "1px",
                      background: fairData.isValid ? "rgba(0,230,118,0.1)" : "rgba(255,68,68,0.1)",
                      color: fairData.isValid ? "#00E676" : "#FF6B6B",
                      border: `1px solid ${fairData.isValid ? "rgba(0,230,118,0.3)" : "rgba(255,68,68,0.3)"}`,
                    }}>
                      {TEXTS.result[lang]}: {fairData.isValid ? TEXTS.valid[lang] : TEXTS.invalid[lang]}
                    </span>
                  </div>
                )}

                {/* Explicacao */}
                <p style={{
                  fontSize: "clamp(10px, 1vw, 12px)", color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.6, fontFamily: "'Inter', sans-serif", margin: 0,
                }}>
                  {TEXTS.howItWorks[lang]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
