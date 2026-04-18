"use client";

// ProvablyFairModal — compartilhado para todos os 22 jogos
// Visual premium com campo terminal, botao VERIFICAR real, rotacao de seed
// Agnostico: recebe handlers via props (FiveM ou browser mock)

import { useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameModal from "./GameModal";

// Dados PF que cada jogo gerencia no seu state
export interface PFData {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  serverSeed: string;          // vazio ate revelar
  isValid: boolean | null;     // null = nao verificado
}

// Seed anterior (historico)
export interface SeedRecord {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  revealedAt: string;          // timestamp ISO
}

// Props publicas
export interface ProvablyFairModalProps {
  open: boolean;
  onClose: () => void;
  lang?: "br" | "in";
  pfData: PFData;
  seedHistory?: SeedRecord[];
  // Handlers que o jogo implementa
  onClientSeedChange: (seed: string) => void;
  onVerify: () => Promise<void>;
  onRotateSeed?: () => Promise<void>;
  onCopy?: (text: string, field: string) => void;
  // Estado de loading
  verifying?: boolean;
  rotating?: boolean;
  // ESC stack
  escPush?: (id: string, close: () => void) => void;
  escPop?: (id: string) => void;
  // Explicacao custom por jogo (opcional)
  customExplanation?: ReactNode;
  // F1: feedback visual ao trocar client seed
  clientSeedChanged?: boolean;
  // F2: badge de spins nao verificados
  unverifiedCount?: number;
  // F3: detalhes da verificacao (hash side-by-side)
  verifyDetails?: { committedHash: string; recalculatedHash: string; match: boolean } | null;
}

const GOLD = "#D4A843";
const GREEN = "#00E676";
const RED = "#FF6B6B";

const TEXTS = {
  title: { br: "PROVABLY FAIR", in: "PROVABLY FAIR" },
  serverSeedHash: { br: "Server Seed Hash (pre-jogo):", in: "Server Seed Hash (pre-game):" },
  clientSeed: { br: "Client Seed:", in: "Client Seed:" },
  nonce: { br: "Nonce:", in: "Nonce:" },
  serverSeed: { br: "Server Seed (revelada):", in: "Server Seed (revealed):" },
  verify: { br: "VERIFICAR", in: "VERIFY" },
  verifying: { br: "VERIFICANDO...", in: "VERIFYING..." },
  rotate: { br: "ROTACIONAR SEED", in: "ROTATE SEED" },
  rotating: { br: "ROTACIONANDO...", in: "ROTATING..." },
  result: { br: "Resultado", in: "Result" },
  valid: { br: "VALIDO", in: "VALID" },
  invalid: { br: "INVALIDO", in: "INVALID" },
  seedHistory: { br: "HISTORICO DE SEEDS", in: "SEED HISTORY" },
  howTitle: { br: "COMO FUNCIONA", in: "HOW IT WORKS" },
  copied: { br: "Copiado!", in: "Copied!" },
  howSteps: {
    br: [
      "1. ANTES de jogar: o servidor gera uma Server Seed secreta e te envia apenas o HASH dela. Salve este hash — é sua prova.",
      "2. DURANTE o jogo: cada aposta usa HMAC-SHA256(serverSeed, clientSeed:nonce). Você não pode prever, o cassino não pode alterar.",
      "3. PARA VERIFICAR: clique 'Rotacionar Seed'. O servidor revela a seed secreta. Confirme: SHA256(seedRevelada) == hash salvo.",
      "4. O Histórico guarda todos os pares revelados. Use-os para verificar qualquer rodada anterior a qualquer momento.",
    ],
    in: [
      "1. BEFORE playing: the server generates a secret Server Seed and sends only its HASH. Save this hash — it's your proof.",
      "2. DURING the game: each bet uses HMAC-SHA256(serverSeed, clientSeed:nonce). You can't predict it, the casino can't change it.",
      "3. TO VERIFY: click 'Rotate Seed'. The server reveals the secret seed. Confirm: SHA256(revealedSeed) == saved hash.",
      "4. The History stores all revealed pairs. Use them to verify any previous round at any time.",
    ],
  },
  rotateNote: {
    br: "⚠️ Ao rotacionar: a seed ATUAL é revelada e aparece no Histórico. Uma nova seed secreta é gerada. Só rotacione quando quiser verificar rodadas passadas.",
    in: "⚠️ When rotating: the CURRENT seed is revealed and appears in History. A new secret seed is generated. Only rotate when you want to verify past rounds.",
  },
  verifyGuide: {
    br: "Como verificar: Histórico → copie o Hash antigo → cole acima em 'Server Seed Hash' → cole a Seed Revelada → clique VERIFICAR.",
    in: "How to verify: History → copy old Hash → paste above in 'Server Seed Hash' → paste Revealed Seed → click VERIFY.",
  },
  seedHint: {
    br: "Mínimo 4 caracteres, máximo 64. Use algo que o cassino não possa prever.",
    in: "Minimum 4 characters, maximum 64. Use something the casino can't predict.",
  },
  seedChanged: {
    br: "Seed alterada — nonce resetado para 0",
    in: "Seed changed — nonce reset to 0",
  },
  verifyDetailTitle: {
    br: "DETALHES DA VERIFICAÇÃO",
    in: "VERIFICATION DETAILS",
  },
  committedLabel: {
    br: "Hash comprometido (antes):",
    in: "Committed hash (before):",
  },
  recalcLabel: {
    br: "Hash recalculado (agora):",
    in: "Recalculated hash (now):",
  },
  hashMatch: {
    br: "Os hashes são idênticos — o servidor não alterou a seed após sua aposta.",
    in: "Hashes are identical — the server did not change the seed after your bet.",
  },
  hashMismatch: {
    br: "Os hashes NÃO coincidem — a seed pode ter sido alterada.",
    in: "Hashes do NOT match — the seed may have been tampered with.",
  },
  unverifiedBadge: {
    br: "spins sem verificar",
    in: "unverified spins",
  },
};

// Estilo terminal (fundo escuro, mono)
const terminalStyle: React.CSSProperties = {
  padding: "clamp(7px, 0.9vw, 10px) clamp(10px, 1.2vw, 14px)",
  background: "rgba(0,0,0,0.5)",
  borderRadius: "6px",
  border: "1px solid rgba(212,168,67,0.1)",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "clamp(9px, 0.85vw, 11px)",
  color: "rgba(255,255,255,0.6)",
  wordBreak: "break-all" as const,
  lineHeight: 1.5,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Cinzel', serif",
  fontSize: "clamp(10px, 1vw, 12px)",
  color: "rgba(212,168,67,0.6)",
  letterSpacing: "1px",
  display: "block",
  marginBottom: "6px",
};

export default function ProvablyFairModal({
  open,
  onClose,
  lang = "br",
  pfData,
  seedHistory = [],
  onClientSeedChange,
  onVerify,
  onRotateSeed,
  onCopy,
  verifying = false,
  rotating = false,
  escPush,
  escPop,
  customExplanation,
  clientSeedChanged = false,
  unverifiedCount,
  verifyDetails,
}: ProvablyFairModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSeedHistory, setShowSeedHistory] = useState(false);

  // Travar fechamento durante verificacao/rotacao
  const safeClose = useCallback(() => {
    if (verifying || rotating) return;
    onClose();
  }, [onClose, verifying, rotating]);

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
    onCopy?.(text, field);
  }, [onCopy]);

  const t = (key: keyof typeof TEXTS) => {
    const val = TEXTS[key];
    if (typeof val === "object" && "br" in val) return val[lang as "br" | "in"];
    return val;
  };

  return (
    <GameModal
      open={open}
      onClose={safeClose}
      title={t("title") as string}
      icon="/assets/shared/icons/icon-provably-fair.png"
      escId="provably-fair-modal"
      escPush={escPush}
      escPop={escPop}
      width="clamp(360px, 52vw, 600px)"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* === SERVER SEED HASH === */}
        <FieldBlock label={t("serverSeedHash") as string}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={terminalStyle}>{pfData.serverSeedHash}</div>
            <CopyBtn
              onClick={() => handleCopy(pfData.serverSeedHash, "hash")}
              copied={copiedField === "hash"}
            />
          </div>
        </FieldBlock>

        {/* === CLIENT SEED (editavel) === */}
        <FieldBlock label={t("clientSeed") as string}>
          <input
            type="text"
            value={pfData.clientSeed}
            onChange={(e) => onClientSeedChange(e.target.value)}
            maxLength={64}
            style={{
              ...terminalStyle,
              width: "100%",
              color: GOLD,
              border: clientSeedChanged
                ? "1px solid rgba(0,230,118,0.6)"
                : pfData.clientSeed.length < 4
                  ? "1px solid rgba(255,107,107,0.3)"
                  : "1px solid rgba(212,168,67,0.2)",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,67,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = pfData.clientSeed.length < 4 ? "rgba(255,107,107,0.3)" : "rgba(212,168,67,0.2)"; }}
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4px",
            minHeight: "16px",
          }}>
            <span style={{
              fontSize: "clamp(8px, 0.75vw, 10px)",
              fontFamily: "'Inter', sans-serif",
              color: pfData.clientSeed.length < 4 ? "rgba(255,107,107,0.6)" : "rgba(255,255,255,0.2)",
              transition: "color 0.2s",
            }}>
              {t("seedHint")} ({pfData.clientSeed.length}/64)
            </span>
            <AnimatePresence>
              {clientSeedChanged && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: "clamp(8px, 0.75vw, 10px)",
                    fontFamily: "'Inter', sans-serif",
                    color: GREEN,
                  }}
                >
                  {t("seedChanged")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </FieldBlock>

        {/* === NONCE === */}
        <FieldBlock label={t("nonce") as string}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={terminalStyle}>{pfData.nonce}</div>
            {typeof unverifiedCount === "number" && unverifiedCount > 0 && (
              <span style={{
                fontSize: "clamp(8px, 0.75vw, 10px)",
                fontFamily: "'Inter', sans-serif",
                color: unverifiedCount >= 50 ? "rgba(255,107,107,0.7)" : "rgba(212,168,67,0.5)",
                whiteSpace: "nowrap",
              }}>
                {unverifiedCount} {(TEXTS as any).unverifiedBadge[lang]}
              </span>
            )}
          </div>
        </FieldBlock>

        {/* === SERVER SEED REVELADA (pos-jogo) === */}
        <AnimatePresence>
          {pfData.serverSeed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FieldBlock label={t("serverSeed") as string}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <div style={{ ...terminalStyle, color: GREEN, border: `1px solid rgba(0,230,118,0.15)` }}>
                    {pfData.serverSeed}
                  </div>
                  <CopyBtn
                    onClick={() => handleCopy(pfData.serverSeed, "seed")}
                    copied={copiedField === "seed"}
                  />
                </div>
              </FieldBlock>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === BOTAO VERIFICAR === */}
        <motion.button
          onClick={onVerify}
          disabled={verifying}
          whileHover={verifying ? {} : { borderColor: "rgba(0,230,118,0.5)", background: "rgba(0,230,118,0.1)" }}
          whileTap={verifying ? {} : { scale: 0.97 }}
          style={{
            padding: "clamp(10px, 1.2vw, 14px)",
            background: "rgba(0,230,118,0.06)",
            border: "1px solid rgba(0,230,118,0.3)",
            borderRadius: "8px",
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(12px, 1.3vw, 15px)",
            color: GREEN,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            cursor: verifying ? "wait" : "pointer",
            outline: "none",
            opacity: verifying ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {verifying ? t("verifying") : t("verify")}
        </motion.button>

        {/* === RESULTADO VERIFICACAO === */}
        <AnimatePresence>
          {pfData.isValid !== null && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4px 0" }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: "6px",
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  letterSpacing: "1px",
                  background: pfData.isValid ? "rgba(0,230,118,0.1)" : "rgba(255,68,68,0.1)",
                  color: pfData.isValid ? GREEN : RED,
                  border: `1px solid ${pfData.isValid ? "rgba(0,230,118,0.3)" : "rgba(255,68,68,0.3)"}`,
                  textShadow: pfData.isValid ? `0 0 10px rgba(0,230,118,0.3)` : "none",
                }}
              >
                {t("result")}: {pfData.isValid ? t("valid") : t("invalid")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === F3: DETALHES DA VERIFICACAO (hash side-by-side) === */}
        <AnimatePresence>
          {verifyDetails && pfData.isValid !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                padding: "clamp(8px, 1vw, 12px)",
                background: "rgba(0,0,0,0.35)",
                borderRadius: "8px",
                border: `1px solid ${verifyDetails.match ? "rgba(0,230,118,0.12)" : "rgba(255,68,68,0.12)"}`,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(9px, 0.9vw, 11px)",
                  color: "rgba(212,168,67,0.5)",
                  letterSpacing: "1px",
                }}>
                  {t("verifyDetailTitle")}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div>
                    <span style={{
                      fontSize: "clamp(8px, 0.75vw, 10px)",
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255,255,255,0.35)",
                      display: "block",
                      marginBottom: "3px",
                    }}>
                      {t("committedLabel")}
                    </span>
                    <div style={{
                      ...terminalStyle,
                      fontSize: "clamp(8px, 0.7vw, 9px)",
                      color: verifyDetails.match ? GREEN : RED,
                      border: `1px solid ${verifyDetails.match ? "rgba(0,230,118,0.1)" : "rgba(255,68,68,0.1)"}`,
                    }}>
                      {verifyDetails.committedHash}
                    </div>
                  </div>

                  <div>
                    <span style={{
                      fontSize: "clamp(8px, 0.75vw, 10px)",
                      fontFamily: "'Inter', sans-serif",
                      color: "rgba(255,255,255,0.35)",
                      display: "block",
                      marginBottom: "3px",
                    }}>
                      {t("recalcLabel")}
                    </span>
                    <div style={{
                      ...terminalStyle,
                      fontSize: "clamp(8px, 0.7vw, 9px)",
                      color: verifyDetails.match ? GREEN : RED,
                      border: `1px solid ${verifyDetails.match ? "rgba(0,230,118,0.1)" : "rgba(255,68,68,0.1)"}`,
                    }}>
                      {verifyDetails.recalculatedHash}
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: "clamp(9px, 0.85vw, 11px)",
                  fontFamily: "'Inter', sans-serif",
                  color: verifyDetails.match ? "rgba(0,230,118,0.6)" : "rgba(255,107,107,0.7)",
                  lineHeight: 1.4,
                  margin: 0,
                  textAlign: "center",
                }}>
                  {verifyDetails.match ? t("hashMatch") : t("hashMismatch")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === ROTACIONAR SEED === */}
        {onRotateSeed && (
          <>
          <motion.button
            onClick={onRotateSeed}
            disabled={rotating}
            whileHover={rotating ? {} : { borderColor: "rgba(212,168,67,0.5)", background: "rgba(212,168,67,0.08)" }}
            whileTap={rotating ? {} : { scale: 0.97 }}
            style={{
              padding: "clamp(8px, 1vw, 12px)",
              background: "rgba(212,168,67,0.04)",
              border: "1px solid rgba(212,168,67,0.2)",
              borderRadius: "8px",
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              fontSize: "clamp(10px, 1.1vw, 13px)",
              color: GOLD,
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: rotating ? "wait" : "pointer",
              outline: "none",
              opacity: rotating ? 0.5 : 1,
            }}
          >
            {rotating ? t("rotating") : t("rotate")}
          </motion.button>
          <p style={{
            fontSize: "clamp(9px, 0.85vw, 11px)",
            color: "rgba(255,200,100,0.55)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.5,
            margin: 0,
            padding: "6px 10px",
            background: "rgba(212,168,67,0.04)",
            border: "1px solid rgba(212,168,67,0.08)",
            borderRadius: 6,
          }}>
            {(TEXTS as any).rotateNote[lang]}
          </p>
          </>
        )}

        {/* === HISTORICO DE SEEDS (toggle) === */}
        {seedHistory.length > 0 && (
          <>
            <motion.button
              onClick={() => setShowSeedHistory(!showSeedHistory)}
              whileHover={{ color: GOLD }}
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(10px, 1vw, 12px)",
                color: "rgba(212,168,67,0.5)",
                letterSpacing: "1px",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
              }}
            >
              {showSeedHistory ? "▼" : "▶"} {t("seedHistory")} ({seedHistory.length})
            </motion.button>

            <AnimatePresence>
              {showSeedHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {seedHistory.map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "6px",
                          border: "1px solid rgba(212,168,67,0.06)",
                          fontSize: "clamp(8px, 0.8vw, 10px)",
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.6,
                        }}
                      >
                        <div><span style={{ color: "rgba(212,168,67,0.5)" }}>Hash:</span> {rec.serverSeedHash.slice(0, 24)}...</div>
                        <div><span style={{ color: "rgba(212,168,67,0.5)" }}>Seed:</span> {rec.serverSeed.slice(0, 24)}...</div>
                        <div><span style={{ color: "rgba(212,168,67,0.5)" }}>Nonce:</span> {rec.nonce} | {rec.revealedAt}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* === COMO FUNCIONA === */}
        <div style={{ borderTop: "1px solid rgba(212,168,67,0.08)", paddingTop: "12px" }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(10px, 1vw, 12px)",
            color: "rgba(212,168,67,0.4)",
            letterSpacing: "1px",
            marginBottom: "10px",
          }}>
            {t("howTitle")}
          </div>

          {customExplanation || (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(TEXTS.howSteps[lang] as string[]).map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: `rgba(212,168,67,${0.08 + idx * 0.04})`,
                    border: "1px solid rgba(212,168,67,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: GOLD,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "1px",
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{
                    fontSize: "clamp(10px, 0.95vw, 12px)",
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.5,
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                  }}>
                    {step.replace(/^\d+\.\s*/, "")}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GameModal>
  );
}

// =============================================================================
// SUB-COMPONENTES INTERNOS
// =============================================================================

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function CopyBtn({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ borderColor: "rgba(212,168,67,0.4)" }}
      whileTap={{ scale: 0.9 }}
      title={copied ? "Copiado!" : "Copiar / Copy"}
      style={{
        padding: "7px",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(212,168,67,0.15)",
        borderRadius: "6px",
        cursor: "pointer",
        outline: "none",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/assets/shared/icons/icon-copy.png"
        alt=""
        style={{
          width: "14px",
          height: "14px",
          opacity: copied ? 1 : 0.5,
          filter: copied ? "hue-rotate(90deg) brightness(1.5)" : "none",
          transition: "all 0.2s",
        }}
      />
    </motion.button>
  );
}
