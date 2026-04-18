"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";
import { useGameAPI } from "@/hooks/use-game-api";
import { useCurrencyConfig } from "@/hooks/use-currency-config";
import HelpPanel from "@/components/shared/HelpPanel";
import HistoryPanel from "@/components/casino/HistoryPanel";

const isFiveM =
  typeof window !== "undefined" && window.location.href.includes("cfx-nui-");

async function fetchWalletBalance(): Promise<{
  carteira: number;
  banco: number;
}> {
  if (!isFiveM) return { carteira: 1500000, banco: 1000000 };
  try {
    const resp = await fetch(
      "https://bc_casino/casino:panel:getWalletBalance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }
    );
    return resp.json();
  } catch {
    return { carteira: 0, banco: 0 };
  }
}

// Paleta fixa (hex puro, zero oklch, compativel Chrome 103 CEF)
const COR = {
  fundo: "rgba(8,8,14,0.96)",
  fundoGradiente:
    "linear-gradient(180deg, rgba(18,15,8,0.98) 0%, rgba(8,8,14,0.99) 100%)",
  goldPrimario: "#D4A843",
  goldClaro: "#F5D77A",
  goldEscuro: "#B38728",
  goldBorda: "rgba(212,168,67,0.18)",
  goldBordaAtiva: "rgba(212,168,67,0.45)",
  goldGlow: "rgba(212,168,67,0.25)",
  goldTexto: "#FFD700",
  goldTextoSutil: "rgba(212,168,67,0.5)",
  sucesso: "#22C55E",
  erro: "#EF4444",
  txtPrimario: "#F0F0F0",
  txtSecundario: "rgba(255,255,255,0.45)",
  carteira: "rgba(34,197,94,0.85)",
  banco: "rgba(100,181,246,0.85)",
};

const CHIPS = [100, 500, 1000, 5000];

const textos = {
  br: {
    depositar: "DEPOSITAR",
    sacar: "SACAR",
    seuSaldo: "Seu saldo",
    confirmar: "CONFIRMAR",
    max: "MAX",
    fechar: "Fechar",
    ajuda: "Ajuda",
    carteira: "Carteira",
    banco: "Banco",
    depositoLabel: "Digite o valor para depositar",
    saqueLabel: "Digite o valor para sacar",
    insuficienteCarteira: "Dinheiro insuficiente na carteira",
    insuficienteSaldo: "Saldo insuficiente",
    depositoSucesso: "Deposito realizado!",
    saqueSucesso: "Saque realizado!",
    erroGenerico: "Erro na operacao",
    historico: "Ultimas transacoes",
    minDeposit: "Min deposito",
    minWithdraw: "Min saque",
  },
  in: {
    depositar: "DEPOSIT",
    sacar: "WITHDRAW",
    seuSaldo: "Your balance",
    confirmar: "CONFIRM",
    max: "MAX",
    fechar: "Close",
    ajuda: "Help",
    carteira: "Wallet",
    banco: "Bank",
    depositoLabel: "Enter the amount to deposit",
    saqueLabel: "Enter the amount to withdraw",
    insuficienteCarteira: "Insufficient wallet funds",
    insuficienteSaldo: "Insufficient balance",
    depositoSucesso: "Deposit successful!",
    saqueSucesso: "Withdrawal successful!",
    erroGenerico: "Operation error",
    historico: "Recent transactions",
    minDeposit: "Min deposit",
    minWithdraw: "Min withdraw",
  },
};

interface DepositModalProps {
  onClose: () => void;
}

interface Transacao {
  tipo: string;
  valor: number;
  saldo_depois?: number;
  jogo?: string;
  detalhes?: string;
  created_at?: string;
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const { lang, saldo, setSaldo } = useCasino();
  const { comprarGCoin, sacarGCoin, getHistorico } = useGameAPI();
  const { config: cc, formatCurrency } = useCurrencyConfig();
  const t = textos[lang];
  const inputRef = useRef<HTMLInputElement>(null);

  const [aba, setAba] = useState<"depositar" | "sacar">("depositar");
  const [valor, setValor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "ok" | "erro";
    texto: string;
  } | null>(null);
  const [saldoPulse, setSaldoPulse] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [walletBal, setWalletBal] = useState({ carteira: 0, banco: 0 });
  const [historico, setHistorico] = useState<Transacao[]>([]);

  useEffect(() => {
    fetchWalletBalance().then(setWalletBal);
    getHistorico().then((rows) => {
      const recentes = (rows || []).slice(0, 8) as Transacao[];
      setHistorico(recentes);
    });
  }, []);

  // ESC: se ajuda aberta fecha ajuda, senao fecha modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (showHistory) {
          setShowHistory(false);
        } else if (showHelp) {
          setShowHelp(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showHelp, showHistory, onClose]);

  const valorNum = parseFloat(valor) || 0;
  const ehDeposito = aba === "depositar";
  const custoDeposito = valorNum * cc.rate;
  const taxaSaque = valorNum * (cc.withdrawFee / 100);
  const gcoinAposTaxa = valorNum - taxaSaque;
  const dinheiroRecebido = gcoinAposTaxa * cc.rate;
  const depositoExcedeCarteira =
    ehDeposito && valorNum > 0 && custoDeposito > walletBal.carteira;
  const saqueExcedeSaldo = !ehDeposito && valorNum > 0 && valorNum > saldo;
  const abaixoMinimo = valorNum > 0 && (
    (ehDeposito && valorNum < cc.minDeposit) ||
    (!ehDeposito && valorNum < cc.minWithdraw)
  );
  const valorInvalido =
    valorNum <= 0 || depositoExcedeCarteira || saqueExcedeSaldo || abaixoMinimo;

  const handleInput = (raw: string) => {
    const limpo = raw.replace(/[^0-9.]/g, "");
    const partes = limpo.split(".");
    if (partes.length > 2) return;
    setValor(limpo);
    setMensagem(null);
  };

  const handleChip = (qtd: number) => {
    setValor(String(qtd));
    setMensagem(null);
  };

  const handleMax = () => {
    if (!ehDeposito) {
      setValor(String(Math.floor(saldo)));
    } else {
      const maxByWallet = Math.floor(walletBal.carteira / cc.rate);
      const teto = Math.min(maxByWallet, cc.maxDeposit);
      setValor(String(Math.max(0, teto)));
    }
    setMensagem(null);
  };

  const handleConfirmar = async () => {
    if (valorInvalido || carregando) return;
    setCarregando(true);
    setMensagem(null);

    try {
      const resultado = ehDeposito
        ? await comprarGCoin(valorNum)
        : await sacarGCoin(valorNum);

      if (resultado.sucesso) {
        setSaldo(resultado.novoSaldo);
        setMensagem({
          tipo: "ok",
          texto: ehDeposito ? t.depositoSucesso : t.saqueSucesso,
        });
        setValor("");
        setSaldoPulse(true);
        setTimeout(() => setSaldoPulse(false), 800);
        fetchWalletBalance().then(setWalletBal);
        getHistorico().then((rows) =>
          setHistorico((rows || []).slice(0, 8) as Transacao[])
        );
      } else {
        setMensagem({
          tipo: "erro",
          texto: resultado.mensagem || t.erroGenerico,
        });
        setInputShake(true);
        setTimeout(() => setInputShake(false), 500);
      }
    } catch {
      setMensagem({ tipo: "erro", texto: t.erroGenerico });
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
    }
    setCarregando(false);
  };

  const fmtNum = (n: number) =>
    n.toLocaleString(lang === "br" ? "pt-BR" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const buildLegenda = (): { texto: string; cor: string } => {
    if (valorNum <= 0) {
      return {
        texto: ehDeposito ? t.depositoLabel : t.saqueLabel,
        cor: COR.goldTextoSutil,
      };
    }
    if (abaixoMinimo) {
      const minVal = ehDeposito ? cc.minDeposit : cc.minWithdraw;
      return {
        texto: lang === "br" ? `Minimo: ${minVal} ${cc.symbol}` : `Minimum: ${minVal} ${cc.symbol}`,
        cor: COR.erro,
      };
    }
    if (depositoExcedeCarteira)
      return { texto: t.insuficienteCarteira, cor: COR.erro };
    if (saqueExcedeSaldo)
      return { texto: t.insuficienteSaldo, cor: COR.erro };
    if (ehDeposito) {
      return {
        texto: `${valorNum} ${cc.name} x $${cc.rate} = -$${fmtNum(custoDeposito)} ${lang === "br" ? "da carteira" : "from wallet"}`,
        cor: COR.goldTextoSutil,
      };
    }
    if (cc.withdrawFee > 0) {
      return {
        texto: lang === "br"
          ? `Saque: -${valorNum} ${cc.symbol} (taxa ${cc.withdrawFee}%: -${fmtNum(taxaSaque)}) → Recebe +$${fmtNum(dinheiroRecebido)}`
          : `Withdraw: -${valorNum} ${cc.symbol} (${cc.withdrawFee}% fee: -${fmtNum(taxaSaque)}) → Receive +$${fmtNum(dinheiroRecebido)}`,
        cor: COR.goldTextoSutil,
      };
    }
    return {
      texto: lang === "br"
        ? `Saque: -${valorNum} ${cc.symbol} → Recebe +$${fmtNum(valorNum * cc.rate)}`
        : `Withdraw: -${valorNum} ${cc.symbol} → Receive +$${fmtNum(valorNum * cc.rate)}`,
      cor: COR.goldTextoSutil,
    };
  };

  const legenda = buildLegenda();

  const tipoConfig = (tipo: string) => {
    switch (tipo) {
      case "deposit":
        return { cor: COR.sucesso, sinal: "+", label: "Dep" };
      case "withdraw":
        return { cor: COR.erro, sinal: "-", label: lang === "br" ? "Saq" : "Wth" };
      case "win":
        return { cor: COR.sucesso, sinal: "+", label: "Win" };
      case "bet":
        return { cor: COR.erro, sinal: "-", label: "Bet" };
      default:
        return { cor: COR.goldTextoSutil, sinal: "", label: tipo };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 70,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
      }}
    >
      <style>{`
        .help-scroll::-webkit-scrollbar { width: 6px; }
        .help-scroll::-webkit-scrollbar-track { background: rgba(212,168,67,0.06); border-radius: 3px; }
        .help-scroll::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.25); border-radius: 3px; }
        .help-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,168,67,0.4); }
        .deposit-modal-scroll::-webkit-scrollbar { width: 4px; }
        .deposit-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .deposit-modal-scroll::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.15); border-radius: 2px; }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="deposit-modal-scroll"
        style={{
          width: "clamp(300px, 38vw, 440px)",
          borderRadius: 16,
          border: `1.5px solid ${COR.goldBorda}`,
          background: COR.fundoGradiente,
          boxShadow: `0 0 60px ${COR.goldGlow}, 0 12px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,168,67,0.12)`,
          padding: "clamp(18px, 2.5vw, 28px)",
          display: "flex", flexDirection: "column" as const,
          gap: "clamp(10px, 1.2vw, 16px)",
          maxHeight: "85vh", overflowY: "auto" as const,
          position: "relative" as const,
        }}
      >
        {/* ZONA 1 — Topo: ajuda + ornamento + fechar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: -4 }}>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setShowHelp((v) => !v)}
            title={t.ajuda} aria-label={t.ajuda}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: `1.5px solid ${showHelp ? COR.goldBordaAtiva : COR.goldBorda}`,
              background: "transparent", cursor: "pointer",
              color: showHelp ? COR.goldTexto : COR.goldTextoSutil,
              fontSize: "clamp(11px, 1vw, 14px)", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >?</motion.button>
          <div style={{
            flex: 1, height: 1, margin: "0 12px",
            background: `linear-gradient(90deg, transparent 0%, ${COR.goldBorda} 30%, ${COR.goldBorda} 70%, transparent 100%)`,
          }} />
          <motion.button
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={onClose} title={t.fechar} aria-label={t.fechar}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: COR.goldTextoSutil, fontSize: "clamp(16px, 1.5vw, 22px)", lineHeight: 1,
            }}
          >✕</motion.button>
        </div>

        {/* ZONA 2 — Saldo GCoin grande + carteira/banco */}
        <div style={{ textAlign: "center" }}>
          <span style={{
            color: COR.goldTextoSutil, fontSize: "clamp(9px, 0.9vw, 11px)",
            letterSpacing: "1.5px", textTransform: "uppercase" as const,
          }}>{t.seuSaldo}</span>
          <motion.div
            animate={saldoPulse ? {
              scale: [1, 1.1, 1],
              textShadow: ["0 0 12px rgba(255,215,0,0.3)", "0 0 30px rgba(255,215,0,0.7)", "0 0 12px rgba(255,215,0,0.3)"],
            } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 2 }}
          >
            {cc.icon && (
              <img src={cc.icon} alt={cc.name} style={{
                width: "clamp(22px, 2.5vw, 30px)", height: "clamp(22px, 2.5vw, 30px)",
                filter: "drop-shadow(0 0 6px rgba(255,215,0,0.4))",
              }} />
            )}
            <span style={{
              fontWeight: 900, fontSize: "clamp(22px, 3vw, 34px)",
              color: COR.goldTexto, textShadow: "0 0 12px rgba(255,215,0,0.3)",
            }}>{formatCurrency(saldo)}</span>
          </motion.div>
          <div style={{
            display: "flex", justifyContent: "center", gap: "clamp(10px, 1.5vw, 20px)",
            fontSize: "clamp(9px, 0.85vw, 11px)", color: COR.txtSecundario, marginTop: 6,
          }}>
            <span title={lang === "br" ? "Dinheiro na carteira" : "Wallet money"}>
              {t.carteira}: <span style={{ color: COR.carteira }}>${walletBal.carteira.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}</span>
            </span>
            <span style={{ color: COR.goldBorda }}>|</span>
            <span title={lang === "br" ? "Dinheiro no banco" : "Bank money"}>
              {t.banco}: <span style={{ color: COR.banco }}>${walletBal.banco.toLocaleString(lang === "br" ? "pt-BR" : "en-US")}</span>
            </span>
          </div>
        </div>

        {/* ZONA 3 — Segmented control com layoutId animado */}
        <div style={{
          display: "flex", gap: 0, borderRadius: 10,
          background: "rgba(255,255,255,0.03)", padding: 4,
          border: `1px solid ${COR.goldBorda}`, position: "relative" as const,
        }}>
          {(["depositar", "sacar"] as const).map((tab) => {
            const ativo = aba === tab;
            const tooltip = tab === "depositar"
              ? (lang === "br" ? `Converte dinheiro em ${cc.name}` : `Convert money to ${cc.name}`)
              : (lang === "br" ? `Converte ${cc.name} em dinheiro` : `Convert ${cc.name} to money`);
            return (
              <button key={tab}
                onClick={() => { setAba(tab); setValor(""); setMensagem(null); setShowHelp(false); }}
                title={tooltip}
                style={{
                  flex: 1, padding: "clamp(8px, 1vw, 12px)", borderRadius: 8,
                  border: "none", cursor: "pointer", background: "transparent",
                  position: "relative" as const, zIndex: 1,
                  color: ativo ? COR.goldTexto : COR.goldTextoSutil,
                  fontWeight: 700, fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "2px",
                  textShadow: ativo ? "0 0 8px rgba(255,215,0,0.4)" : "none",
                  transition: "color 0.2s, text-shadow 0.2s",
                }}
              >
                {ativo && (
                  <motion.span
                    layoutId="depositActiveTab"
                    style={{
                      position: "absolute" as const, inset: 0, borderRadius: 8,
                      background: "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.08) 100%)",
                      border: `1px solid ${COR.goldBordaAtiva}`,
                      boxShadow: "0 0 15px rgba(212,168,67,0.1), inset 0 1px 0 rgba(255,215,0,0.1)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {tab === "depositar" ? t.depositar : t.sacar}
              </button>
            );
          })}
        </div>

        {/* ZONA 4 — Input com icone de moeda */}
        <motion.div animate={inputShake ? { x: [0, -4, 4, -3, 3, 0] } : {}} transition={{ duration: 0.35 }}>
          <div style={{ position: "relative" as const, display: "flex", alignItems: "center" }}>
            {cc.icon && (
              <img src={cc.icon} alt="" style={{
                position: "absolute" as const, left: "clamp(10px, 1.2vw, 16px)",
                width: 20, height: 20, opacity: 0.6, pointerEvents: "none" as const,
              }} />
            )}
            <input ref={inputRef} type="text" inputMode="decimal"
              value={valor} onChange={(e) => handleInput(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%",
                padding: `clamp(10px, 1.2vw, 14px) clamp(10px, 1.2vw, 16px) clamp(10px, 1.2vw, 14px) ${cc.icon ? "clamp(38px, 3vw, 46px)" : "clamp(10px, 1.2vw, 16px)"}`,
                borderRadius: 10, border: `1px solid ${COR.goldBorda}`,
                background: "rgba(0,0,0,0.4)", color: COR.goldTexto,
                fontWeight: 700, fontSize: "clamp(18px, 2vw, 24px)",
                textAlign: "center" as const, outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = COR.goldBordaAtiva; e.target.style.boxShadow = `0 0 12px ${COR.goldGlow}`; }}
              onBlur={(e) => { e.target.style.borderColor = COR.goldBorda; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </motion.div>

        {/* ZONA 5 — Legenda contextual */}
        <AnimatePresence mode="wait">
          <motion.div key={`${aba}-${valorNum}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              textAlign: "center" as const, fontSize: "clamp(8.5px, 0.85vw, 11px)",
              color: legenda.cor, minHeight: 16, marginTop: -4, lineHeight: 1.5,
            }}
          >{legenda.texto}</motion.div>
        </AnimatePresence>

        {/* ZONA 6 — Chips de valor */}
        <div style={{ display: "flex", gap: "clamp(4px, 0.5vw, 8px)", flexWrap: "wrap" as const }}>
          {CHIPS.map((qtd) => {
            const sel = valorNum === qtd;
            return (
              <motion.button key={qtd}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                onClick={() => handleChip(qtd)} title={`${qtd} ${cc.name}`}
                style={{
                  flex: 1, minWidth: 50, padding: "clamp(7px, 0.8vw, 10px)",
                  borderRadius: 8,
                  border: sel ? `1.5px solid ${COR.goldBordaAtiva}` : `1px solid ${COR.goldBorda}`,
                  background: sel
                    ? "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.08) 100%)"
                    : "rgba(255,255,255,0.02)",
                  color: sel ? COR.goldTexto : COR.goldTextoSutil,
                  fontWeight: 700, fontSize: "clamp(10px, 1.1vw, 13px)", cursor: "pointer",
                  textShadow: sel ? "0 0 6px rgba(255,215,0,0.3)" : "none",
                  boxShadow: sel ? "0 0 12px rgba(212,168,67,0.15)" : "none",
                  transition: "all 0.2s",
                }}
              >{qtd >= 1000 ? `${qtd / 1000}K` : qtd}</motion.button>
            );
          })}
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            onClick={handleMax}
            title={ehDeposito
              ? `${lang === "br" ? "Maximo" : "Maximum"}: ${cc.maxDeposit.toLocaleString()} ${cc.symbol}`
              : `${lang === "br" ? "Sacar tudo" : "Withdraw all"}: ${formatCurrency(saldo)}`}
            style={{
              flex: 1, minWidth: 50, padding: "clamp(7px, 0.8vw, 10px)",
              borderRadius: 8, border: "1.5px solid rgba(34,197,94,0.4)",
              background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)",
              color: COR.sucesso, fontWeight: 700,
              fontSize: "clamp(10px, 1.1vw, 13px)", cursor: "pointer",
              textShadow: "0 0 8px rgba(34,197,94,0.4)", transition: "all 0.2s",
            }}
          >{t.max}</motion.button>
        </div>

        {/* ZONA 8 — Feedback */}
        <AnimatePresence>
          {mensagem && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontSize: "clamp(10px, 1vw, 13px)",
                color: mensagem.tipo === "ok" ? COR.sucesso : COR.erro,
                padding: "4px 0",
              }}
            >
              {mensagem.tipo === "ok" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COR.sucesso} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M4.5 12.75l6 6 9-13.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COR.erro} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M6 6l12 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
                  <motion.path d="M18 6l-12 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.1 }} />
                </svg>
              )}
              {mensagem.texto}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ZONA 7 — Botao CONFIRMAR */}
        <motion.button
          whileHover={!valorInvalido && valorNum > 0 ? { scale: 1.02, boxShadow: `0 0 30px ${COR.goldGlow}, 0 0 60px rgba(212,168,67,0.1)` } : {}}
          whileTap={!valorInvalido && valorNum > 0 ? { scale: 0.97 } : {}}
          onClick={handleConfirmar}
          disabled={valorInvalido || carregando}
          title={ehDeposito ? t.depositar : t.sacar}
          style={{
            width: "100%", padding: "clamp(12px, 1.4vw, 18px)", borderRadius: 10,
            border: !valorInvalido && valorNum > 0 ? `1.5px solid ${COR.goldBordaAtiva}` : `1px solid ${COR.goldBorda}`,
            background: !valorInvalido && valorNum > 0
              ? "linear-gradient(135deg, rgba(212,168,67,0.25) 0%, rgba(179,135,40,0.15) 50%, rgba(212,168,67,0.2) 100%)"
              : "rgba(255,255,255,0.02)",
            color: !valorInvalido && valorNum > 0 ? COR.goldTexto : "rgba(212,168,67,0.25)",
            fontWeight: 900, fontSize: "clamp(13px, 1.4vw, 17px)", letterSpacing: "3px",
            textShadow: !valorInvalido && valorNum > 0 ? "0 0 10px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.6)" : "none",
            boxShadow: !valorInvalido && valorNum > 0 ? "0 0 20px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,215,0,0.15)" : "none",
            cursor: !valorInvalido && valorNum > 0 ? "pointer" : "not-allowed",
            opacity: carregando ? 0.5 : 1,
            transition: "all 0.25s",
          }}
        >
          {carregando ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
              <circle cx="12" cy="12" r="9" stroke="rgba(212,168,67,0.3)" strokeWidth="2.5" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke={COR.goldTexto} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : t.confirmar}
        </motion.button>

        {/* Info minimo */}
        <div style={{ textAlign: "center" as const, fontSize: "clamp(8px, 0.75vw, 10px)", color: "rgba(212,168,67,0.3)" }}>
          {ehDeposito ? `${t.minDeposit}: ${cc.minDeposit} ${cc.symbol}` : `${t.minWithdraw}: ${cc.minWithdraw} ${cc.symbol}`}
        </div>

        {/* ZONA 9 — Historico compacto */}
        {historico.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: "clamp(8px, 0.8vw, 10px)", color: COR.goldTextoSutil,
              letterSpacing: "1px", textTransform: "uppercase" as const, marginBottom: 6,
            }}>
              <span>{t.historico}</span>
              <button
                onClick={() => setShowHistory(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: COR.goldTextoSutil, fontSize: "clamp(8px, 0.75vw, 10px)",
                  textDecoration: "underline", textUnderlineOffset: 2,
                  letterSpacing: "0.5px", textTransform: "none" as const,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = COR.goldTexto; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = COR.goldTextoSutil; }}
              >{lang === "br" ? "Ver tudo" : "View all"}</button>
            </div>
            <div className="help-scroll" style={{
              maxHeight: 78, overflowY: "auto" as const,
              display: "flex", flexDirection: "column" as const, gap: 2,
            }}>
              {historico.map((tx, i) => {
                const cfg = tipoConfig(tx.tipo);
                const dataStr = tx.created_at
                  ? new Date(tx.created_at).toLocaleString(
                      lang === "br" ? "pt-BR" : "en-US",
                      { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }
                    )
                  : "";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "4px 8px", borderRadius: 6,
                    background: "rgba(255,255,255,0.02)",
                    fontSize: "clamp(8.5px, 0.8vw, 10.5px)",
                  }}>
                    <span style={{ color: COR.txtSecundario, minWidth: 70, fontSize: "clamp(7.5px, 0.7vw, 9px)" }}>{dataStr}</span>
                    <span style={{ color: cfg.cor, fontWeight: 700, minWidth: 30, textAlign: "center" as const }}>{cfg.label}</span>
                    <span style={{ color: cfg.cor, fontWeight: 600, flex: 1, textAlign: "right" as const }}>
                      {cfg.sinal}{Math.abs(tx.valor).toLocaleString(lang === "br" ? "pt-BR" : "en-US")} {cc.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ZONA 10 — HelpPanel overlay (dentro do modal, sobre o conteudo) */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute" as const,
                inset: 0,
                borderRadius: 16,
                background: "rgba(8,8,14,0.97)",
                zIndex: 10,
                display: "flex",
                flexDirection: "column" as const,
                padding: "clamp(18px, 2.5vw, 28px)",
              }}
            >
              {/* Header da ajuda */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 12, flexShrink: 0,
              }}>
                <span style={{
                  color: COR.goldTexto, fontWeight: 700,
                  fontSize: "clamp(12px, 1.2vw, 15px)", letterSpacing: "1.5px",
                }}>
                  {lang === "br" ? "COMO FUNCIONA" : "HOW IT WORKS"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelp(false)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: COR.goldTextoSutil, fontSize: "clamp(16px, 1.5vw, 22px)", lineHeight: 1,
                  }}
                >✕</motion.button>
              </div>
              {/* Conteudo com scroll estilizado */}
              <div
                className="help-scroll"
                style={{
                  flex: 1, overflowY: "auto" as const,
                  paddingRight: 4,
                }}
              >
                <HelpPanel visible={true} config={cc} lang={lang} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Historico completo overlay */}
        <HistoryPanel
          visible={showHistory}
          onClose={() => setShowHistory(false)}
          config={cc}
          lang={lang}
        />
      </motion.div>
    </motion.div>
  );
}
