// ═══════════════════════════════════════════════════════
// BLACKOUT CASINO — Dados dos 22 Jogos
// ═══════════════════════════════════════════════════════

import { cardPath, logoBRPath, logoINPath, goldPath, pedestalPath } from "./assets";

export interface Game {
  id: number;
  cardName: string;    // Nome no arquivo do card
  logoName: string;    // Nome no arquivo do logo
  goldName: string;    // Nome no arquivo da imagem dourada
  labelBR: string;
  labelEN: string;
  descBR: string;
  descEN: string;
  cardUrl: string;
  logoBR: string;
  logoIN: string;
  goldUrl: string;
  pedestalUrl: string;
  tier: "S" | "A" | "B" | "C";
}

const RAW: [number, string, string, string, string, string, string, string, Game["tier"]][] = [
  [1,  "CRASH",              "CRASH",              "CRASH",              "Crash",             "Crash",              "Aposte e saia antes do crash!",         "Bet and cash out before crash!",       "S"],
  [2,  "SLOTS",              "SLOT-MACHINE",       "SLOTS",              "Caça-Níquel",       "Slot Machine",       "Gire os rolos e conquiste o jackpot!",  "Spin the reels and hit the jackpot!",  "S"],
  [3,  "MINES",              "MINES",              "MINES",              "Mines",             "Mines",              "Encontre as gemas, evite as bombas!",   "Find gems, avoid the bombs!",          "S"],
  [4,  "BLACKJACK",          "BLACKJACK",          "BLACKJACK",          "Blackjack",         "Blackjack",          "Chegue o mais perto de 21!",            "Get as close to 21!",                  "A"],
  [5,  "ROULETTE",           "ROULETTE",           "ROULETTE",           "Roleta",            "Roulette",           "Aposte no seu número da sorte!",        "Bet on your lucky number!",            "S"],
  [6,  "POKER",              "POKER",              "POKER",              "Poker",             "Poker",              "Mostre sua melhor mão!",                "Show your best hand!",                 "A"],
  [7,  "DICE",               "DICE",               "DICE",               "Dados",             "Dice",               "Lance os dados da sorte!",              "Roll the lucky dice!",                 "B"],
  [8,  "PLINKO",             "PLINKO",             "PLINKO",             "Plinko",            "Plinko",             "Solte a bola e torça!",                 "Drop the ball and hope!",              "A"],
  [9,  "ANIMA-GAME",         "ANIMAL-GAME",        "ANIMA-GAME",         "Jogo do Bicho",     "Animal Game",        "Acerte o seu animal favorito!",         "Pick your favorite animal!",           "S"],
  [10, "BRAZILIAN-ROULETTE", "BRAZILIAN-ROULETTE",  "BRAZILIAN-ROULETTE", "Roleta Brasileira", "Brazilian Roulette", "Roleta com sabor brasileiro!",          "Roulette with Brazilian flavor!",      "A"],
  [11, "CASE-BATTLE",        "CASE-BATTLE",        "CASE-BATTLE",        "Case Battle",       "Case Battle",        "Abra caixas em batalha!",               "Open cases in battle!",                "B"],
  [12, "CONIFLIP",           "CONIFLIP",           "CONIFLIP",           "Coinflip",          "Coinflip",           "Cara ou coroa?",                        "Heads or tails?",                      "B"],
  [13, "JACKPOT",            "JACKPOT",            "JACKPOT",            "Jackpot",           "Jackpot",            "Ganhe o grande prêmio!",                "Win the big prize!",                   "A"],
  [14, "CASES",              "CASES",              "CASES",              "Cases",             "Cases",              "Abra caixas misteriosas!",              "Open mystery cases!",                  "B"],
  [15, "UPGRADE",            "UPGRADE",            "UPGRADE",            "Upgrade",           "Upgrade",            "Melhore seus itens!",                   "Upgrade your items!",                  "B"],
  [16, "MARKETPLACE",        "MARKETPLACE",        "MARKETPLACE",        "Marketplace",       "Marketplace",        "Compre e venda itens!",                 "Buy and sell items!",                  "C"],
  [17, "INVENTORY",          "INVENTORY",          "INVENTORY",          "Inventário",        "Inventory",          "Gerencie seus itens!",                  "Manage your items!",                   "C"],
  [18, "LOTTERY",            "LOTTERY",            "LOTTERY",            "Loteria",           "Lottery",            "Tente a sorte grande!",                 "Try your big luck!",                   "B"],
  [19, "DAILY-FREE",         "DAILY-FREE",         "DAILY-FREE",         "Daily Free",        "Daily Free",         "Sua recompensa diária!",                "Your daily reward!",                   "C"],
  [20, "GIVEAWAYS",          "GIVEAWAYS",          "GIVEAWAYS",          "Giveaways",         "Giveaways",          "Participe dos sorteios!",               "Join the giveaways!",                  "C"],
  [21, "BINGO",              "BINGO",              "BINGO",              "Bingo",             "Bingo",              "Bingo premiado!",                       "Premium Bingo!",                       "B"],
  [22, "POOL-GAME",          "POOL-GAME",          "POOL-GAME",          "Sinuca",            "Pool Game",          "Mostre suas tacadas!",                  "Show your shots!",                     "B"],
];

export const GAMES: Game[] = RAW.map(([id, cardName, logoName, goldName, labelBR, labelEN, descBR, descEN, tier]) => ({
  id,
  cardName,
  logoName,
  goldName,
  labelBR,
  labelEN,
  descBR,
  descEN,
  tier,
  cardUrl: cardPath(id, cardName),
  logoBR: logoBRPath(id, logoName),
  logoIN: logoINPath(id, logoName),
  goldUrl: goldPath(id, goldName),
  pedestalUrl: pedestalPath(id, cardName),
}));

// 5 jogos em destaque no Hero (sugestão do roteiro)
export const HERO_IDS = [1, 9, 2, 3, 5]; // Crash, Bicho, Slots, Mines, Roleta
export const HERO_GAMES = HERO_IDS.map((id) => GAMES.find((g) => g.id === id)!);

// Tabs do dock
export const TABS = {
  br: ["CASSINO", "PVP", "LOJA", "EVENTOS", "PERFIL"],
  en: ["CASINO", "PVP", "STORE", "EVENTS", "PROFILE"],
};
