"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/contexts/CasinoContext";
import { useGameAPI } from "@/hooks/use-game-api";

interface DepositModalProps {
  onClose: () => void;
}

const textos = {
  br: {
    depositar: "DEPOSITAR", sacar: "SACAR",
    seuSaldo: "Seu saldo", valor: "Valor em GCoin",
    confirmar: "CONFIRMAR", max: "MAX",
    sucesso: "Operação realizada!",
    erro: "Erro na operação",
    minDeposit: "Mínimo: 10 GC", minWithdraw: "Mínimo: 50 GC",
    fechar: "Fechar painel de depósito",
  },
  in: {
    depositar: "DEPOSIT", sacar: "WITHDRAW",
    seuSaldo: "Your balance", valor: "Amount in GCoin",
    confirmar: "CONFIRM", max: "MAX",
    sucesso: "Operation successful!",
    erro: "Operation error",
    minDeposit: "Minimum: 10 GC", minWithdraw: "Minimum: 50 GC",
    fechar: "Close deposit panel",
  },
};

const ATALHOS = [100, 500, 1000, 5000];

export default function DepositModal({ onClose }: DepositModalProps) {
  const { lang, saldo, setSaldo } = useCasino();
  const { comprarGCoin, sacarGCoin } = useGameAPI();
  const t = textos[lang];

  const [aba, setAba] = useState<"depositar" | "sacar">("depositar");
  const [valor, setValor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const valorNum = parseFloat(valor) || 0;
  const ehDeposito = aba === "depositar";

  const handleInput = (raw: string) => {
    const limpo = raw.replace(/[^0-9.]/g, "");
    const partes = limpo.split(".");
    if (partes.length > 2) return;
    setValor(limpo);
    setMensagem(null);
  };

  const handleAtalho = (qtd: number) => {
    setValor(String(qtd));
    setMensagem(null);
  };

  const handleMax = () => {
    if (!ehDeposito) setValor(String(saldo));
    else setValor("50000");
    setMensagem(null);
  };

  const handleConfirmar = async () => {
    if (valorNum <= 0 || carregando) return;
    setCarregando(true);
    setMensagem(null);

    try {
      const resultado = ehDeposito
        ? await comprarGCoin(valorNum)
        : await sacarGCoin(valorNum);

      if (resultado.sucesso) {
        setSaldo(resultado.novoSaldo);
        setMensagem({ tipo: "ok", texto: t.sucesso });
        setValor("");
      } else {
        setMensagem({ tipo: "erro", texto: resultado.mensagem || t.erro });
      }
    } catch {
      setMensagem({ tipo: "erro", texto: t.erro });
    }
    setCarregando(false);
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
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "clamp(280px, 35vw, 420px)",
          borderRadius: 16,
          border: "1.5px solid rgba(212,168,67,0.4)",
          background: "linear-gradient(180deg, rgba(25,20,10,0.98) 0%, rgba(12,10,5,0.99) 100%)",
          boxShadow: "0 0 60px rgba(212,168,67,0.15), 0 0 120px rgba(212,168,67,0.05), 0 12px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,168,67,0.15)",
          padding: "clamp(20px, 2.5vw, 32px)",
          display: "flex", flexDirection: "column", gap: "clamp(10px, 1.5vw, 18px)",
        }}
      >
        {/* Fechar */}
        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={onClose}
          title={t.fechar}
          style={{
            position: "absolute", top: 12, right: 14,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(212,168,67,0.6)", fontSize: "clamp(16px, 1.5vw, 22px)",
          }}
        >✕</motion.button>

        {/* Saldo */}
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "rgba(212,168,67,0.5)", fontSize: "clamp(10px, 1vw, 13px)", fontFamily: "sans-serif" }}>
            {t.seuSaldo}
          </span>
          <div style={{
            fontFamily: "'Cinzel', serif", fontWeight: 900,
            fontSize: "clamp(20px, 2.5vw, 32px)", color: "#FFD700",
            textShadow: "0 0 12px rgba(255,215,0,0.3)",
          }}>
            {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} GC
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderRadius: 10, background: "rgba(255,255,255,0.03)", padding: 4, border: "1px solid rgba(212,168,67,0.1)" }}>
          {(["depositar", "sacar"] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => { setAba(tab); setValor(""); setMensagem(null); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title={tab === "depositar" ? t.depositar : t.sacar}
              style={{
                flex: 1, padding: "clamp(8px, 1vw, 12px)", borderRadius: 8,
                border: aba === tab ? "1px solid rgba(212,168,67,0.4)" : "1px solid transparent",
                cursor: "pointer",
                background: aba === tab
                  ? "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.08) 100%)"
                  : "transparent",
                color: aba === tab ? "#FFD700" : "rgba(212,168,67,0.4)",
                fontFamily: "'Cinzel', serif", fontWeight: 700,
                fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "2px",
                textShadow: aba === tab ? "0 0 8px rgba(255,215,0,0.4)" : "none",
                boxShadow: aba === tab ? "0 0 15px rgba(212,168,67,0.1), inset 0 1px 0 rgba(255,215,0,0.1)" : "none",
                transition: "all 0.25s",
              }}
            >
              {tab === "depositar" ? t.depositar : t.sacar}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div>
          <label style={{ color: "rgba(212,168,67,0.4)", fontSize: "clamp(9px, 0.9vw, 11px)", fontFamily: "sans-serif", marginBottom: 4, display: "block" }}>
            {t.valor}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={valor}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="0.00"
            style={{
              width: "100%", padding: "clamp(8px, 1vw, 14px) clamp(10px, 1.2vw, 16px)",
              borderRadius: 8, border: "1px solid rgba(212,168,67,0.2)",
              background: "rgba(0,0,0,0.4)", color: "#FFD700",
              fontFamily: "'Cinzel', serif", fontWeight: 700,
              fontSize: "clamp(16px, 1.8vw, 22px)", textAlign: "center",
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(212,168,67,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(212,168,67,0.2)"; }}
          />
        </div>

        {/* Atalhos */}
        <div style={{ display: "flex", gap: "clamp(4px, 0.5vw, 8px)", flexWrap: "wrap" }}>
          {ATALHOS.map((qtd) => (
            <motion.button
              key={qtd}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => handleAtalho(qtd)}
              title={`${qtd} GCoin`}
              style={{
                flex: 1, minWidth: 50, padding: "clamp(7px, 0.8vw, 10px)",
                borderRadius: 8,
                border: valorNum === qtd
                  ? "1.5px solid rgba(212,168,67,0.5)"
                  : "1px solid rgba(212,168,67,0.15)",
                background: valorNum === qtd
                  ? "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.08) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                color: valorNum === qtd ? "#FFD700" : "rgba(212,168,67,0.6)",
                fontFamily: "'Cinzel', serif", fontWeight: 700,
                fontSize: "clamp(10px, 1.1vw, 13px)", cursor: "pointer",
                textShadow: valorNum === qtd ? "0 0 6px rgba(255,215,0,0.3)" : "none",
                boxShadow: valorNum === qtd ? "0 0 12px rgba(212,168,67,0.15)" : "none",
                transition: "all 0.2s",
              }}
            >
              {qtd >= 1000 ? `${qtd / 1000}K` : qtd}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            onClick={handleMax}
            title={ehDeposito ? "Máximo 50.000 GC" : `Sacar tudo: ${saldo} GC`}
            style={{
              flex: 1, minWidth: 50, padding: "clamp(7px, 0.8vw, 10px)",
              borderRadius: 8, border: "1.5px solid rgba(0,230,118,0.4)",
              background: "linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,230,118,0.05) 100%)",
              color: "#00E676", fontFamily: "'Cinzel', serif", fontWeight: 700,
              fontSize: "clamp(10px, 1.1vw, 13px)", cursor: "pointer",
              textShadow: "0 0 8px rgba(0,230,118,0.4)",
              boxShadow: "0 0 12px rgba(0,230,118,0.1), inset 0 1px 0 rgba(0,230,118,0.15)",
              transition: "all 0.2s",
            }}
          >
            {t.max}
          </motion.button>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {mensagem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{
                textAlign: "center", fontSize: "clamp(10px, 1vw, 13px)", fontFamily: "sans-serif",
                color: mensagem.tipo === "ok" ? "#00E676" : "#FF5252",
                padding: "4px 0",
              }}
            >
              {mensagem.texto}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmar */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(212,168,67,0.3), 0 0 60px rgba(212,168,67,0.1)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirmar}
          disabled={valorNum <= 0 || carregando}
          title={ehDeposito ? t.depositar : t.sacar}
          style={{
            width: "100%", padding: "clamp(12px, 1.4vw, 18px)",
            borderRadius: 10,
            border: valorNum > 0
              ? "1.5px solid rgba(212,168,67,0.5)"
              : "1px solid rgba(212,168,67,0.1)",
            background: valorNum > 0
              ? "linear-gradient(135deg, rgba(212,168,67,0.25) 0%, rgba(212,168,67,0.1) 50%, rgba(212,168,67,0.2) 100%)"
              : "rgba(255,255,255,0.02)",
            color: valorNum > 0 ? "#FFD700" : "rgba(212,168,67,0.25)",
            fontFamily: "'Cinzel', serif", fontWeight: 900,
            fontSize: "clamp(13px, 1.4vw, 17px)", letterSpacing: "3px",
            textShadow: valorNum > 0 ? "0 0 10px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.6)" : "none",
            boxShadow: valorNum > 0
              ? "0 0 20px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,215,0,0.15)"
              : "none",
            cursor: valorNum > 0 ? "pointer" : "not-allowed",
            opacity: carregando ? 0.5 : 1,
            transition: "all 0.25s",
          }}
        >
          {carregando ? "..." : t.confirmar}
        </motion.button>

        {/* Info minimo */}
        <div style={{
          textAlign: "center", fontSize: "clamp(8px, 0.8vw, 10px)",
          color: "rgba(212,168,67,0.3)", fontFamily: "sans-serif",
        }}>
          {ehDeposito ? t.minDeposit : t.minWithdraw}
        </div>
      </motion.div>
    </motion.div>
  );
}
