"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CurrencyConfig } from "@/hooks/use-currency-config";

const isFiveM =
  typeof window !== "undefined" && window.location.href.includes("cfx-nui-");

const COR = {
  goldTexto: "#FFD700",
  goldTextoSutil: "rgba(212,168,67,0.5)",
  goldBorda: "rgba(212,168,67,0.18)",
  goldBordaAtiva: "rgba(212,168,67,0.45)",
  goldGlow: "rgba(212,168,67,0.25)",
  sucesso: "#22C55E",
  erro: "#EF4444",
  amarelo: "#F59E0B",
  azul: "#3B82F6",
  txtSecundario: "rgba(255,255,255,0.45)",
};

const TIPOS = ["all", "deposit", "withdraw", "bet", "win", "refund", "bonus"] as const;
type TipoFiltro = (typeof TIPOS)[number];

interface Transacao {
  tipo: string;
  valor: number;
  saldo_antes?: number;
  saldo_depois?: number;
  jogo?: string;
  detalhes?: string;
  created_at?: string;
}

interface HistoryPanelProps {
  visible: boolean;
  onClose: () => void;
  config: CurrencyConfig;
  lang: "br" | "in";
  identifier?: string;
}

// dados mock pra modo web
const MOCK_HISTORY: Transacao[] = Array.from({ length: 35 }, (_, i) => {
  const tipos: string[] = ["deposit", "withdraw", "bet", "win", "bet", "bet", "win"];
  const tipo = tipos[i % tipos.length];
  const valor = tipo === "deposit" ? 500 + i * 100
    : tipo === "withdraw" ? 200 + i * 50
    : tipo === "bet" ? 50 + i * 10
    : 80 + i * 15;
  const jogos = ["slots", "bicho", "crash", null];
  const d = new Date();
  d.setDate(d.getDate() - i);
  d.setHours(10 + (i % 12), (i * 7) % 60);
  return {
    tipo,
    valor,
    saldo_antes: 1000 + i * 20,
    saldo_depois: tipo === "bet" || tipo === "withdraw" ? 1000 + i * 20 - valor : 1000 + i * 20 + valor,
    jogo: tipo === "bet" || tipo === "win" ? jogos[i % jogos.length] : null,
    created_at: d.toISOString(),
  } as Transacao;
});

async function fetchHistoryFiltered(filtros: {
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  page: number;
  limit: number;
}): Promise<{ rows: Transacao[]; total: number }> {
  if (!isFiveM) {
    let filtered = [...MOCK_HISTORY];
    if (filtros.tipo && filtros.tipo !== "all") {
      filtered = filtered.filter((t) => t.tipo === filtros.tipo);
    }
    if (filtros.dataInicio) {
      const inicio = new Date(filtros.dataInicio);
      filtered = filtered.filter((t) => t.created_at && new Date(t.created_at) >= inicio);
    }
    if (filtros.dataFim) {
      const fim = new Date(filtros.dataFim + "T23:59:59");
      filtered = filtered.filter((t) => t.created_at && new Date(t.created_at) <= fim);
    }
    const total = filtered.length;
    const start = (filtros.page - 1) * filtros.limit;
    const rows = filtered.slice(start, start + filtros.limit);
    return { rows, total };
  }
  try {
    const resp = await fetch("https://bc_casino/casino:panel:getHistoryFiltered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros),
    });
    return resp.json();
  } catch {
    return { rows: [], total: 0 };
  }
}

function tipoConfig(tipo: string, lang: "br" | "in") {
  switch (tipo) {
    case "deposit": return { cor: COR.sucesso, sinal: "+", label: lang === "br" ? "Deposito" : "Deposit" };
    case "withdraw": return { cor: COR.erro, sinal: "-", label: lang === "br" ? "Saque" : "Withdraw" };
    case "win": return { cor: COR.sucesso, sinal: "+", label: lang === "br" ? "Ganho" : "Win" };
    case "bet": return { cor: COR.erro, sinal: "-", label: lang === "br" ? "Aposta" : "Bet" };
    case "refund": return { cor: COR.azul, sinal: "+", label: lang === "br" ? "Reembolso" : "Refund" };
    case "bonus": return { cor: COR.amarelo, sinal: "+", label: lang === "br" ? "Bonus" : "Bonus" };
    default: return { cor: COR.txtSecundario, sinal: "", label: tipo };
  }
}

function tipoLabelFiltro(tipo: TipoFiltro, lang: "br" | "in"): string {
  const map: Record<TipoFiltro, { br: string; in: string }> = {
    all: { br: "Todos", in: "All" },
    deposit: { br: "Deposito", in: "Deposit" },
    withdraw: { br: "Saque", in: "Withdraw" },
    bet: { br: "Aposta", in: "Bet" },
    win: { br: "Ganho", in: "Win" },
    refund: { br: "Reembolso", in: "Refund" },
    bonus: { br: "Bonus", in: "Bonus" },
  };
  return map[tipo]?.[lang] ?? tipo;
}

export default function HistoryPanel({ visible, onClose, config, lang }: HistoryPanelProps) {
  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>("all");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Transacao[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const limit = 15;
  const pages = Math.max(1, Math.ceil(total / limit));

  const buscar = useCallback(async () => {
    setLoading(true);
    const resultado = await fetchHistoryFiltered({
      tipo: filtroTipo === "all" ? undefined : filtroTipo,
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
      page,
      limit,
    });
    setRows(resultado.rows);
    setTotal(resultado.total);
    setLoading(false);
  }, [filtroTipo, dataInicio, dataFim, page]);

  useEffect(() => {
    if (visible) buscar();
  }, [visible, buscar]);

  useEffect(() => { setPage(1); }, [filtroTipo, dataInicio, dataFim]);

  const copiarCSV = () => {
    const header = lang === "br"
      ? "Data;Tipo;Valor;Saldo;Jogo"
      : "Date;Type;Amount;Balance;Game";
    const linhas = rows.map((tx) => {
      const data = tx.created_at ? new Date(tx.created_at).toLocaleString(lang === "br" ? "pt-BR" : "en-US") : "";
      return `${data};${tx.tipo};${tx.valor};${tx.saldo_depois ?? ""};${tx.jogo ?? ""}`;
    });
    const csv = [header, ...linhas].join("\n");
    navigator.clipboard.writeText(csv).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const t = {
    titulo: lang === "br" ? "HISTORICO DE TRANSACOES" : "TRANSACTION HISTORY",
    de: lang === "br" ? "De" : "From",
    ate: lang === "br" ? "Ate" : "To",
    copiar: lang === "br" ? "Copiar CSV" : "Copy CSV",
    copiado: lang === "br" ? "Copiado!" : "Copied!",
    semDados: lang === "br" ? "Nenhuma transacao encontrada" : "No transactions found",
    mostrando: lang === "br" ? "Mostrando" : "Showing",
    deTotal: lang === "br" ? "de" : "of",
    anterior: lang === "br" ? "Anterior" : "Previous",
    proxima: lang === "br" ? "Proxima" : "Next",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute" as const, inset: 0, borderRadius: 16,
            background: "rgba(8,8,14,0.98)", zIndex: 12,
            display: "flex", flexDirection: "column" as const,
            padding: "clamp(14px, 2vw, 22px)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0 }}>
            <span style={{ color: COR.goldTexto, fontWeight: 700, fontSize: "clamp(11px, 1.1vw, 14px)", letterSpacing: "1.5px" }}>
              {t.titulo}
            </span>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: COR.goldTextoSutil, fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: 1 }}
            >✕</motion.button>
          </div>

          {/* Filtros tipo */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const, marginBottom: 8, flexShrink: 0 }}>
            {TIPOS.map((tipo) => {
              const ativo = filtroTipo === tipo;
              const tooltips: Record<TipoFiltro, { br: string; in: string }> = {
                all: { br: "Mostrar todas as transacoes", in: "Show all transactions" },
                deposit: { br: "Dinheiro convertido em fichas do casino", in: "Money converted to casino chips" },
                withdraw: { br: "Fichas convertidas de volta em dinheiro", in: "Chips converted back to money" },
                bet: { br: "Apostas feitas nos jogos", in: "Bets placed in games" },
                win: { br: "Premios ganhos nos jogos", in: "Prizes won in games" },
                refund: { br: "Valores devolvidos por erro ou cancelamento", in: "Amounts returned due to error or cancellation" },
                bonus: { br: "Bonus recebidos (promocoes, fidelidade)", in: "Bonuses received (promos, loyalty)" },
              };
              return (
                <button key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  title={tooltips[tipo]?.[lang] ?? ""}
                  style={{
                    padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                    border: ativo ? `1px solid ${COR.goldBordaAtiva}` : `1px solid ${COR.goldBorda}`,
                    background: ativo ? "rgba(212,168,67,0.15)" : "transparent",
                    color: ativo ? COR.goldTexto : COR.goldTextoSutil,
                    fontSize: "clamp(8px, 0.8vw, 10px)", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >{tipoLabelFiltro(tipo, lang)}</button>
              );
            })}
          </div>

          {/* Filtros data */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexShrink: 0, flexWrap: "wrap" as const }}>
            <label style={{ color: COR.txtSecundario, fontSize: "clamp(8px, 0.8vw, 10px)" }}>{t.de}</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
              style={{
                padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${COR.goldBorda}`, background: "rgba(0,0,0,0.4)",
                color: COR.goldTexto, fontSize: "clamp(9px, 0.85vw, 11px)",
                outline: "none", colorScheme: "dark",
              }}
            />
            <label style={{ color: COR.txtSecundario, fontSize: "clamp(8px, 0.8vw, 10px)" }}>{t.ate}</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
              style={{
                padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${COR.goldBorda}`, background: "rgba(0,0,0,0.4)",
                color: COR.goldTexto, fontSize: "clamp(9px, 0.85vw, 11px)",
                outline: "none", colorScheme: "dark",
              }}
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={copiarCSV}
              title={t.copiar}
              style={{
                marginLeft: "auto", padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${COR.goldBorda}`, background: "transparent",
                color: copiado ? COR.sucesso : COR.goldTextoSutil,
                fontSize: "clamp(8px, 0.8vw, 10px)", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >{copiado ? t.copiado : t.copiar}</motion.button>
          </div>

          {/* Info quantidade */}
          <div style={{ fontSize: "clamp(8px, 0.75vw, 9px)", color: COR.txtSecundario, marginBottom: 6, flexShrink: 0 }}>
            {t.mostrando} {rows.length} {t.deTotal} {total}
          </div>

          {/* Lista com scroll */}
          <div className="help-scroll" style={{
            flex: 1, overflowY: "auto" as const, display: "flex",
            flexDirection: "column" as const, gap: 2, minHeight: 0,
          }}>
            {loading ? (
              <div style={{ textAlign: "center" as const, padding: 20, color: COR.goldTextoSutil }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="9" stroke="rgba(212,168,67,0.3)" strokeWidth="2.5" />
                  <path d="M12 3a9 9 0 0 1 9 9" stroke={COR.goldTexto} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            ) : rows.length === 0 ? (
              <div style={{ textAlign: "center" as const, padding: 20, color: COR.goldTextoSutil, fontSize: "clamp(9px, 0.9vw, 11px)" }}>
                {t.semDados}
              </div>
            ) : (
              rows.map((tx, i) => {
                const cfg = tipoConfig(tx.tipo, lang);
                const dataStr = tx.created_at
                  ? new Date(tx.created_at).toLocaleString(
                      lang === "br" ? "pt-BR" : "en-US",
                      { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }
                    )
                  : "";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 8px", borderRadius: 6,
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    fontSize: "clamp(8.5px, 0.8vw, 10.5px)",
                  }}>
                    <span style={{ color: COR.txtSecundario, minWidth: "clamp(60px, 8vw, 90px)", fontSize: "clamp(7.5px, 0.7vw, 9px)" }}>
                      {dataStr}
                    </span>
                    <span style={{
                      color: cfg.cor, fontWeight: 700, minWidth: "clamp(40px, 5vw, 60px)",
                      textAlign: "center" as const, fontSize: "clamp(7.5px, 0.75vw, 9.5px)",
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ color: cfg.cor, fontWeight: 600, minWidth: 60, textAlign: "right" as const }}>
                      {cfg.sinal}{Math.abs(tx.valor).toLocaleString(lang === "br" ? "pt-BR" : "en-US")} {config.symbol}
                    </span>
                    {tx.jogo && (
                      <span style={{ color: COR.txtSecundario, fontSize: "clamp(7px, 0.65vw, 8.5px)", marginLeft: "auto" }}>
                        {tx.jogo}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Paginacao */}
          {pages > 1 && (
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: 12, marginTop: 8, flexShrink: 0,
            }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: "4px 12px", borderRadius: 6,
                  border: `1px solid ${COR.goldBorda}`, background: "transparent",
                  color: page <= 1 ? "rgba(212,168,67,0.2)" : COR.goldTextoSutil,
                  fontSize: "clamp(8px, 0.8vw, 10px)", cursor: page <= 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >{t.anterior}</button>
              <span style={{ color: COR.goldTextoSutil, fontSize: "clamp(9px, 0.85vw, 11px)" }}>
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                style={{
                  padding: "4px 12px", borderRadius: 6,
                  border: `1px solid ${COR.goldBorda}`, background: "transparent",
                  color: page >= pages ? "rgba(212,168,67,0.2)" : COR.goldTextoSutil,
                  fontSize: "clamp(8px, 0.8vw, 10px)", cursor: page >= pages ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >{t.proxima}</button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
