"use client";

// Deteccao de ambiente: FiveM NUI vs browser local
const isFiveM = typeof window !== "undefined"
  && typeof (window as any).GetParentResourceName === "function";

const resourceName = isFiveM
  ? (window as any).GetParentResourceName()
  : "blackout-casino";

// Wrapper generico pro fetch NUI do FiveM
async function fetchNui<T>(evento: string, payload?: unknown): Promise<T> {
  const resp = await fetch(`https://${resourceName}/${evento}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return resp.json();
}

// Dados mock pro desenvolvimento local (browser sem FiveM)
const MOCK = {
  saldo: 500,
  historico: [
    { id: 1, tipo: "deposit", valor: 1000, data: "2026-03-29T10:00:00Z" },
    { id: 2, tipo: "bet", valor: -200, jogo: "slots", data: "2026-03-29T10:05:00Z" },
    { id: 3, tipo: "win", valor: 450, jogo: "slots", data: "2026-03-29T10:05:30Z" },
  ],
};

interface SaldoResponse {
  gcoin_balance: number;
}

interface TransacaoResponse {
  id: number;
  tipo: string;
  valor: number;
  jogo?: string;
  data: string;
}

interface BetResponse {
  sucesso: boolean;
  novoSaldo: number;
  mensagem?: string;
}

export function useGameAPI() {
  const getSaldo = async (): Promise<number> => {
    if (!isFiveM) return MOCK.saldo;
    try {
      const res = await fetchNui<SaldoResponse>("casino:panel:getSaldo");
      return res.gcoin_balance;
    } catch {
      return MOCK.saldo;
    }
  };

  const comprarGCoin = async (valor: number): Promise<BetResponse> => {
    if (!isFiveM) {
      MOCK.saldo += valor;
      return { sucesso: true, novoSaldo: MOCK.saldo };
    }
    return fetchNui<BetResponse>("casino:panel:buyGCoin", { amount: valor });
  };

  const sacarGCoin = async (valor: number): Promise<BetResponse> => {
    if (!isFiveM) {
      MOCK.saldo -= valor;
      return { sucesso: true, novoSaldo: MOCK.saldo };
    }
    return fetchNui<BetResponse>("casino:panel:cashoutGCoin", { amount: valor });
  };

  const getHistorico = async (): Promise<TransacaoResponse[]> => {
    if (!isFiveM) return MOCK.historico;
    try {
      return await fetchNui<TransacaoResponse[]>("casino:panel:getHistory");
    } catch {
      return MOCK.historico;
    }
  };

  return { getSaldo, comprarGCoin, sacarGCoin, getHistorico, isFiveM };
}
