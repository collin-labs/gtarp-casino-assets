"use client";

import { useState, useEffect, useCallback } from "react";
import { useCasino } from "@/contexts/CasinoContext";

const isFiveM =
  typeof window !== "undefined" &&
  window.location.href.includes("cfx-nui-");

const resourceName = "bc_casino";

async function fetchNui<T>(evento: string, payload?: unknown): Promise<T> {
  const resp = await fetch(`https://${resourceName}/${evento}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return resp.json();
}

export interface CurrencyConfig {
  name: string;
  symbol: string;
  icon: string;
  rate: number;
  rateLabel: string;
  depositFee: number;
  withdrawFee: number;
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  dailyDepositLimit: number;
  dailyWithdrawLimit: number;
  cooldownSeconds: number;
  texts: {
    depositExplanationBR: string;
    depositExplanationEN: string;
    withdrawExplanationBR: string;
    withdrawExplanationEN: string;
    feeExplanationBR: string;
    feeExplanationEN: string;
    helpTitleBR: string;
    helpTitleEN: string;
  };
}

const DEFAULTS: CurrencyConfig = {
  name: "GCoin",
  symbol: "GC",
  icon: "/assets/shared/icons/icon-gcoin.png",
  rate: 1.05,
  rateLabel: "1 GCoin = $1.05",
  depositFee: 0,
  withdrawFee: 2,
  minDeposit: 10,
  maxDeposit: 50000,
  minWithdraw: 50,
  maxWithdraw: 100000,
  dailyDepositLimit: 200000,
  dailyWithdrawLimit: 100000,
  cooldownSeconds: 3,
  texts: {
    depositExplanationBR:
      "Converte dinheiro da sua carteira em fichas para jogar no casino. O valor e debitado instantaneamente.",
    depositExplanationEN:
      "Converts money from your wallet into chips to play at the casino. The amount is debited instantly.",
    withdrawExplanationBR:
      "Converte fichas do casino de volta para dinheiro na sua carteira. O valor e creditado instantaneamente.",
    withdrawExplanationEN:
      "Converts casino chips back into money in your wallet. The amount is credited instantly.",
    feeExplanationBR:
      "Depositos nao possuem taxa. Saques possuem uma taxa de 2%.",
    feeExplanationEN:
      "Deposits have no fee. Withdrawals have a 2% fee.",
    helpTitleBR: "Como funciona?",
    helpTitleEN: "How does it work?",
  },
};

let cachedConfig: CurrencyConfig | null = null;
let fetchPromise: Promise<CurrencyConfig> | null = null;

function parseServerConfig(raw: Record<string, string>): CurrencyConfig {
  const num = (key: string, fallback: number) =>
    parseFloat(raw[key] ?? "") || fallback;

  const str = (key: string, fallback: string) => raw[key] ?? fallback;

  const wFee = num("withdraw_tax_percent", DEFAULTS.withdrawFee);

  const feeBR = str("fee_explanation_br", DEFAULTS.texts.feeExplanationBR)
    .replace("{withdraw_tax_percent}", String(wFee));
  const feeEN = str("fee_explanation_en", DEFAULTS.texts.feeExplanationEN)
    .replace("{withdraw_tax_percent}", String(wFee));

  return {
    name: str("currency_name", DEFAULTS.name),
    symbol: str("currency_symbol", DEFAULTS.symbol),
    icon: str("currency_icon", DEFAULTS.icon),
    rate: num("gcoin_rate", DEFAULTS.rate),
    rateLabel: str("currency_rate_label", DEFAULTS.rateLabel),
    depositFee: num("deposit_fee_percent", DEFAULTS.depositFee),
    withdrawFee: wFee,
    minDeposit: num("min_deposit", DEFAULTS.minDeposit),
    maxDeposit: num("max_deposit", DEFAULTS.maxDeposit),
    minWithdraw: num("min_withdraw", DEFAULTS.minWithdraw),
    maxWithdraw: num("max_withdraw", DEFAULTS.maxWithdraw),
    dailyDepositLimit: num("daily_deposit_limit", DEFAULTS.dailyDepositLimit),
    dailyWithdrawLimit: num("daily_withdraw_limit", DEFAULTS.dailyWithdrawLimit),
    cooldownSeconds: num("cooldown_seconds", DEFAULTS.cooldownSeconds),
    texts: {
      depositExplanationBR: str("deposit_explanation_br", DEFAULTS.texts.depositExplanationBR),
      depositExplanationEN: str("deposit_explanation_en", DEFAULTS.texts.depositExplanationEN),
      withdrawExplanationBR: str("withdraw_explanation_br", DEFAULTS.texts.withdrawExplanationBR),
      withdrawExplanationEN: str("withdraw_explanation_en", DEFAULTS.texts.withdrawExplanationEN),
      feeExplanationBR: feeBR,
      feeExplanationEN: feeEN,
      helpTitleBR: str("help_title_br", DEFAULTS.texts.helpTitleBR),
      helpTitleEN: str("help_title_en", DEFAULTS.texts.helpTitleEN),
    },
  };
}

async function loadConfig(): Promise<CurrencyConfig> {
  if (cachedConfig) return cachedConfig;

  if (!isFiveM) {
    cachedConfig = DEFAULTS;
    return DEFAULTS;
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = fetchNui<Record<string, string>>("casino:panel:getConfig")
    .then((raw) => {
      const parsed = parseServerConfig(raw ?? {});
      cachedConfig = parsed;
      fetchPromise = null;
      return parsed;
    })
    .catch(() => {
      cachedConfig = DEFAULTS;
      fetchPromise = null;
      return DEFAULTS;
    });

  return fetchPromise;
}

export function useCurrencyConfig() {
  const { lang } = useCasino();
  const [config, setConfig] = useState<CurrencyConfig>(cachedConfig ?? DEFAULTS);
  const [loading, setLoading] = useState(!cachedConfig);

  useEffect(() => {
    let mounted = true;
    loadConfig().then((cfg) => {
      if (!mounted) return;
      setConfig(cfg);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const reload = useCallback(() => {
    cachedConfig = null;
    fetchPromise = null;
    setLoading(true);
    loadConfig().then((cfg) => {
      setConfig(cfg);
      setLoading(false);
    });
  }, []);

  const formatCurrency = useCallback(
    (valor: number): string => {
      const formatted =
        lang === "br"
          ? valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : valor.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${formatted} ${config.symbol}`;
    },
    [lang, config.symbol],
  );

  const getLocalizedText = useCallback(
    (brKey: keyof CurrencyConfig["texts"], enKey: keyof CurrencyConfig["texts"]): string =>
      lang === "br" ? config.texts[brKey] : config.texts[enKey],
    [lang, config.texts],
  );

  return { config, loading, reload, formatCurrency, getLocalizedText };
}
