"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CurrencyConfig } from "@/hooks/use-currency-config";

interface HelpPanelProps {
  visible: boolean;
  config: CurrencyConfig;
  lang: "br" | "in";
}

interface SectionData {
  icon: string;
  title: string;
  body: string;
  details: string[];
}

const ICONS = {
  deposit: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4A843' stroke-width='2'%3E%3Cpath d='M12 3v12m0 0l-4-4m4 4l4-4'/%3E%3Cpath d='M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2'/%3E%3C/svg%3E",
  withdraw: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4A843' stroke-width='2'%3E%3Cpath d='M12 15V3m0 0l-4 4m4-4l4 4'/%3E%3Cpath d='M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2'/%3E%3C/svg%3E",
  convert: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4A843' stroke-width='2'%3E%3Cpath d='M7 10l5-5 5 5'/%3E%3Cpath d='M17 14l-5 5-5-5'/%3E%3C/svg%3E",
};

function buildSections(config: CurrencyConfig, lang: "br" | "in"): SectionData[] {
  const isBR = lang === "br";
  const { symbol, withdrawFee, depositFee, minDeposit, maxDeposit, minWithdraw, maxWithdraw, rate } = config;

  const noFeeLabel = isBR ? "Sem taxa" : "No fee";
  const feeLabel = (pct: number) => pct > 0 ? `${pct}%` : noFeeLabel;

  const depositDetails: string[] = [];
  depositDetails.push(
    isBR
      ? `Taxa de servico: ${feeLabel(depositFee)}`
      : `Service fee: ${feeLabel(depositFee)}`
  );
  if (rate !== 1) {
    depositDetails.push(
      isBR
        ? `Conversao: 1 ${symbol} = $${rate.toFixed(2)}`
        : `Conversion: 1 ${symbol} = $${rate.toFixed(2)}`
    );
  }
  depositDetails.push(
    isBR
      ? `Limites: ${minDeposit.toLocaleString("pt-BR")} a ${maxDeposit.toLocaleString("pt-BR")} ${symbol}`
      : `Limits: ${minDeposit.toLocaleString("en-US")} to ${maxDeposit.toLocaleString("en-US")} ${symbol}`
  );

  const withdrawDetails: string[] = [];
  withdrawDetails.push(
    isBR
      ? `Taxa: ${feeLabel(withdrawFee)}`
      : `Fee: ${feeLabel(withdrawFee)}`
  );
  if (withdrawFee > 0) {
    const exemplo = 1000;
    const liquido = exemplo - (exemplo * withdrawFee / 100);
    withdrawDetails.push(
      isBR
        ? `Exemplo: em ${exemplo} ${symbol}, recebe ${liquido.toLocaleString("pt-BR")} ${symbol}`
        : `Example: from ${exemplo} ${symbol}, you receive ${liquido.toLocaleString("en-US")} ${symbol}`
    );
  }
  withdrawDetails.push(
    isBR
      ? `Limites: ${minWithdraw.toLocaleString("pt-BR")} a ${maxWithdraw.toLocaleString("pt-BR")} ${symbol}`
      : `Limits: ${minWithdraw.toLocaleString("en-US")} to ${maxWithdraw.toLocaleString("en-US")} ${symbol}`
  );

  return [
    {
      icon: ICONS.deposit,
      title: isBR ? "Como depositar" : "How to deposit",
      body: isBR ? config.texts.depositExplanationBR : config.texts.depositExplanationEN,
      details: depositDetails,
    },
    {
      icon: ICONS.withdraw,
      title: isBR ? "Como sacar" : "How to withdraw",
      body: isBR ? config.texts.withdrawExplanationBR : config.texts.withdrawExplanationEN,
      details: withdrawDetails,
    },
    {
      icon: ICONS.convert,
      title: isBR ? "Conversao" : "Conversion",
      body: config.rateLabel,
      details: [],
    },
  ];
}

const SEPARATOR: React.CSSProperties = {
  height: 1,
  background: "rgba(212,168,67,0.08)",
  margin: "8px 0",
};

export default function HelpPanel({ visible, config, lang }: HelpPanelProps) {
  const sections = buildSections(config, lang);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              borderTop: "1px solid rgba(212,168,67,0.1)",
              borderBottom: "1px solid rgba(212,168,67,0.1)",
              borderRadius: 8,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {sections.map((section, idx) => (
              <div key={section.title}>
                {idx > 0 && <div style={SEPARATOR} />}

                {/* Titulo com icone */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <img
                    src={section.icon}
                    alt=""
                    style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.7 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      fontSize: "clamp(9px, 0.95vw, 11px)",
                      color: "#D4A843",
                      letterSpacing: "1px",
                    }}
                  >
                    {section.title}
                  </span>
                </div>

                {/* Corpo */}
                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "clamp(9px, 0.85vw, 11px)",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.5,
                    margin: "2px 0 4px 24px",
                  }}
                >
                  {section.body}
                </p>

                {/* Detalhes (taxa, limites, exemplos) */}
                {section.details.length > 0 && (
                  <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 1 }}>
                    {section.details.map((detail) => (
                      <span
                        key={detail}
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: "clamp(8px, 0.8vw, 10px)",
                          color: "rgba(212,168,67,0.45)",
                          lineHeight: 1.4,
                        }}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
