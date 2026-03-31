import { cardPath, logoBRPath, logoINPath, goldPath, pedestalPath } from "./assets";

export interface Game {
  id: number;
  cardName: string;
  logoName: string;
  goldName: string;
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
  [3,  "MINES",              "MINES",              "MINES",              "Campo Minado",      "Mines",              "Encontre as gemas, evite as bombas!",   "Find gems, avoid the bombs!",          "S"],
  [4,  "BLACKJACK",          "BLACKJACK",          "BLACKJACK",          "Vinte e Um",        "Blackjack",          "Chegue o mais perto de 21!",            "Get as close to 21!",                  "A"],
  [5,  "ROULETTE",           "ROULETTE",           "ROULETTE",           "Roleta",            "Roulette",           "Aposte no seu número da sorte!",        "Bet on your lucky number!",            "S"],
  [6,  "POKER",              "POKER",              "POKER",              "Pôquer",            "Poker",              "Mostre sua melhor mão!",                "Show your best hand!",                 "A"],
  [7,  "DICE",               "DICE",               "DICE",               "Dados",             "Dice",               "Lance os dados da sorte!",              "Roll the lucky dice!",                 "B"],
  [8,  "PLINKO",             "PLINKO",             "PLINKO",             "Plinko",            "Plinko",             "Solte a bola e torça!",                 "Drop the ball and hope!",              "A"],
  [9,  "ANIMA-GAME",         "ANIMAL-GAME",        "ANIMA-GAME",         "Jogo do Bicho",     "Animal Game",        "Acerte o seu animal favorito!",         "Pick your favorite animal!",           "S"],
  [10, "BRAZILIAN-ROULETTE", "BRAZILIAN-ROULETTE",  "BRAZILIAN-ROULETTE", "Roleta Brasileira", "Brazilian Roulette", "Roleta com sabor brasileiro!",          "Roulette with Brazilian flavor!",      "A"],
  [11, "CASE-BATTLE",        "CASE-BATTLE",        "CASE-BATTLE",        "Batalha das Caixas","Case Battle",        "Abra caixas em batalha!",               "Open cases in battle!",                "B"],
  [12, "CONIFLIP",           "CONIFLIP",           "CONIFLIP",           "Cara ou Coroa",     "Coinflip",           "Cara ou coroa?",                        "Heads or tails?",                      "B"],
  [13, "JACKPOT",            "JACKPOT",            "JACKPOT",            "Jackpot",           "Jackpot",            "Ganhe o grande prêmio!",                "Win the big prize!",                   "A"],
  [14, "CASES",              "CASES",              "CASES",              "Caixas",            "Cases",              "Abra caixas misteriosas!",              "Open mystery cases!",                  "B"],
  [15, "UPGRADE",            "UPGRADE",            "UPGRADE",            "Upgrade",           "Upgrade",            "Melhore seus itens!",                   "Upgrade your items!",                  "B"],
  [16, "MARKETPLACE",        "MARKETPLACE",        "MARKETPLACE",        "Mercado",           "Marketplace",        "Compre e venda itens!",                 "Buy and sell items!",                  "C"],
  [17, "INVENTORY",          "INVENTORY",          "INVENTORY",          "Inventário",        "Inventory",          "Gerencie seus itens!",                  "Manage your items!",                   "C"],
  [18, "LOTTERY",            "LOTTERY",            "LOTTERY",            "Loteria",           "Lottery",            "Tente a sorte grande!",                 "Try your big luck!",                   "B"],
  [19, "DAILY-FREE",         "DAILY-FREE",         "DAILY-FREE",         "Bônus Diário",      "Daily Free",         "Sua recompensa diária!",                "Your daily reward!",                   "C"],
  [20, "GIVEAWAYS",          "GIVEAWAYS",          "GIVEAWAYS",          "Sorteios",          "Giveaways",          "Participe dos sorteios!",               "Join the giveaways!",                  "C"],
  [21, "BINGO",              "BINGO",              "BINGO",              "Bingo",             "Bingo",              "Bingo premiado!",                       "Premium Bingo!",                       "B"],
  [22, "POOL-GAME",          "POOL-GAME",          "POOL-GAME",          "Sinuca",            "Pool Game",          "Mostre suas tacadas!",                  "Show your shots!",                     "B"],
];

export const GAMES: Game[] = RAW.map(([id, cardName, logoName, goldName, labelBR, labelEN, descBR, descEN, tier]) => ({
  id, cardName, logoName, goldName, labelBR, labelEN, descBR, descEN, tier,
  cardUrl: cardPath(id, cardName),
  logoBR: logoBRPath(id, logoName),
  logoIN: logoINPath(id, logoName),
  goldUrl: goldPath(id, goldName),
  pedestalUrl: pedestalPath(id, cardName),
}));

export const HERO_IDS = [1, 9, 2, 3, 5];
export const HERO_GAMES = HERO_IDS.map((id) => GAMES.find((g) => g.id === id)!);

// ========== CATEGORIAS POR ABA (Fase 3) ==========

// ARCADE (4 cards + hero fixo) — Hero: 9-Bicho | Cards: 1-Crash, 2-Slots, 3-Mines, 8-Plinko
export const ARCADE_IDS = [1, 2, 3, 8];
export const ARCADE_GAMES = ARCADE_IDS.map((id) => GAMES.find((g) => g.id === id)!);
export const ARCADE_HERO_IDS = [9]; // Bicho fixo no hero

// CASSINO (6 cards + hero fixo) — Hero: 5-Roleta | Cards: 4-Blackjack, 22-Sinuca, 6-Poker, 7-Dados, 10-RoletaBR, 21-Bingo
export const CASINO_IDS = [4, 22, 6, 7, 10, 21];
export const CASINO_GAMES = CASINO_IDS.map((id) => GAMES.find((g) => g.id === id)!);
export const CASINO_HERO_IDS = [5]; // Roleta fixa no hero

// PVP (3) — IDs: 11-CaseBattle, 12-Coinflip, 13-Jackpot
export const PVP_IDS = [11, 12, 13];
export const PVP_GAMES = PVP_IDS.map((id) => GAMES.find((g) => g.id === id)!);

// LOJA (4) — IDs: 14-Cases, 15-Upgrade, 16-Marketplace, 17-Inventory
export const LOJA_IDS = [14, 15, 16, 17];
export const LOJA_GAMES = LOJA_IDS.map((id) => GAMES.find((g) => g.id === id)!);

// EVENTOS (3) — IDs: 18-Lottery, 19-DailyFree, 20-Giveaways
export const EVENTOS_IDS = [18, 19, 20];
export const EVENTOS_GAMES = EVENTOS_IDS.map((id) => GAMES.find((g) => g.id === id)!);

// Mapa tab index → jogos (ordem do Dock: CASSINO, ARCADE, PVP, LOJA, EVENTOS)
export const TAB_GAMES = [CASINO_GAMES, ARCADE_GAMES, PVP_GAMES, LOJA_GAMES, EVENTOS_GAMES];
export const TAB_HERO_IDS = [CASINO_HERO_IDS, ARCADE_HERO_IDS, [], [], []];
export const TAB_HERO_GAMES = TAB_HERO_IDS.map(
  (ids) => ids.map((id) => GAMES.find((g) => g.id === id)!)
);
export type TabLayout = "casino" | "arcade" | "pvp" | "loja" | "eventos";
export const TAB_LAYOUTS: TabLayout[] = ["casino", "arcade", "pvp", "loja", "eventos"];

// FASE 2: Atualizado — PERFIL removido, ARCADE adicionado
export const TABS = {
  br: ["CASSINO", "ARCADE", "PVP", "LOJA", "EVENTOS"],
  en: ["CASINO", "ARCADE", "PVP", "STORE", "EVENTS"],
};
