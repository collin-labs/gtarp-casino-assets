// RouletteWheel.tsx — VERSÃO FINAL COM BOLINHA
// Imagem: roda gira via CSS transform rotate
// Bolinha: div posicionada via trigonometria (cos/sin), gira sentido oposto

"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { SpinResult } from "./RouletteGame";

/* ─── Constantes ─── */
const EUROPEAN_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const POCKETS = 37;
const DEG_PER_POCKET = 360 / POCKETS;

/* Raios da bolinha (como fração do raio da roda) */
const BALL_TRACK_RADIUS = 0.82; // pista externa (início)
const BALL_SETTLE_RADIUS = 0.62; // bolso (final, onde para)
const BALL_SIZE = 14; // diâmetro em px

function getColor(n: number): "red" | "black" | "green" {
  if (n === 0) return "green";
  return RED_NUMBERS.includes(n) ? "red" : "black";
}

/* ─── Tipos ─── */
interface Props {
  size?: number;
  luckyNumbers?: Map<number, number>;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinResult) => void;
}
export interface RouletteWheelRef {
  spin: (target?: number) => void;
  isSpinning: () => boolean;
}

/* ─── Componente ─── */
const RouletteWheel = forwardRef<RouletteWheelRef, Props>(
  function RouletteWheel(
    { size = 400, luckyNumbers = new Map(), onSpinStart, onSpinEnd },
    ref
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const ballRef = useRef<HTMLDivElement>(null);
    const spinning = useRef(false);
    const raf = useRef(0);
    const angle = useRef(0);
    const [loaded, setLoaded] = useState(false);
    const [ballVisible, setBallVisible] = useState(false);

    /* ─── Spin ─── */
    const spin = useCallback(
      (target?: number) => {
        if (spinning.current || !wrapperRef.current) return;

        const num = target ?? Math.floor(Math.random() * 37);
        const idx = EUROPEAN_SEQUENCE.indexOf(num);
        spinning.current = true;
        setBallVisible(true);
        onSpinStart?.();

        // ── Roda ──
        const pocketOffset = idx * DEG_PER_POCKET;
        const startWheel = angle.current;
        let endWheel = startWheel + 5 * 360 + (360 - pocketOffset);
        while (endWheel - startWheel < 720) endWheel += 360;

        // ── Bolinha ──
        const halfSize = size / 2;
        const trackR = halfSize * BALL_TRACK_RADIUS;
        const settleR = halfSize * BALL_SETTLE_RADIUS;
        const ballSpins = 7; // bola gira mais voltas que a roda
        // Bola gira no sentido OPOSTO (negativo = anti-horário)
        const ballStartAngle = 0;
        const ballEndAngle = -(ballSpins * 360) - (360 - pocketOffset);

        const duration = 5500; // 5.5 segundos
        const t0 = performance.now();
        const wheelEl = wrapperRef.current;
        const ballEl = ballRef.current;

        const frame = (now: number) => {
          const elapsed = now - t0;
          const t = Math.min(elapsed / duration, 1);
          // Ease-out cúbico para a roda
          const wheelEase = 1 - Math.pow(1 - t, 3);
          // Ease-out mais agressivo para a bola (para mais rápido)
          const ballEase = 1 - Math.pow(1 - t, 4);

          // ── Atualizar roda ──
          const currentWheelAngle = startWheel + (endWheel - startWheel) * wheelEase;
          wheelEl.style.transform = `rotate(${currentWheelAngle}deg)`;

          // ── Atualizar bolinha ──
          if (ballEl) {
            const currentBallAngleDeg = ballStartAngle + (ballEndAngle - ballStartAngle) * ballEase;
            // Converter para radianos (-90 para começar do topo)
            const ballAngleRad = (currentBallAngleDeg - 90) * (Math.PI / 180);

            // Raio diminui conforme a bola "cai" no bolso
            // Começa na pista externa, vai para o bolso
            // Usa uma curva que mantém na pista até ~70% do tempo, depois cai rápido
            let radiusT: number;
            if (t < 0.6) {
              // Primeiros 60%: bola fica na pista externa com leve oscilação
              radiusT = 0;
            } else if (t < 0.85) {
              // 60-85%: começa a cair
              radiusT = (t - 0.6) / 0.25; // 0 → 1
              radiusT = radiusT * radiusT; // ease-in quadrático
            } else {
              // 85-100%: cai rápido e para
              radiusT = 1;
            }

            const currentRadius = trackR + (settleR - trackR) * radiusT;

            // Bounce nos últimos 10% (bola quica no bolso)
            let bounceOffset = 0;
            if (t > 0.85 && t < 0.95) {
              const bounceT = (t - 0.85) / 0.1;
              bounceOffset = Math.sin(bounceT * Math.PI * 3) * 8 * (1 - bounceT);
            }

            const finalRadius = currentRadius + bounceOffset;
            const ballX = halfSize + Math.cos(ballAngleRad) * finalRadius - BALL_SIZE / 2;
            const ballY = halfSize + Math.sin(ballAngleRad) * finalRadius - BALL_SIZE / 2;

            ballEl.style.transform = `translate(${ballX}px, ${ballY}px)`;
            ballEl.style.opacity = "1";
          }

          if (t < 1) {
            raf.current = requestAnimationFrame(frame);
          } else {
            angle.current = endWheel;
            spinning.current = false;
            onSpinEnd?.({
              number: num,
              color: getColor(num),
              isLucky: luckyNumbers.has(num),
              multiplier: luckyNumbers.get(num),
            });
          }
        };

        raf.current = requestAnimationFrame(frame);
      },
      [size, luckyNumbers, onSpinStart, onSpinEnd]
    );

    useImperativeHandle(ref, () => ({
      spin,
      isSpinning: () => spinning.current,
    }));

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    /* ─── Render ─── */
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          overflow: "visible",
          transformStyle: "flat",
          perspective: "none",
          transform: "none",
        }}
      >
        {/* Wrapper que gira — a RODA */}
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: "50% 50%",
            transform: "rotate(0deg)",
            willChange: "transform",
            transformStyle: "flat",
            transition: "none",
            animation: "none",
          }}
        >
          <img
            src="/assets/roulette/04.wheel-european.png"
            alt=""
            onLoad={() => setLoaded(true)}
            draggable={false}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "none",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        {/* BOLINHA — posicionada absoluta, movida via transform translate */}
        <div
          ref={ballRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E8E8E8 30%, #BEBEBE 60%, #909090 100%)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.6), " +
              "0 0 8px rgba(255,255,255,0.4), " +
              "inset 0 -2px 4px rgba(0,0,0,0.3), " +
              "inset 0 1px 2px rgba(255,255,255,0.8)",
            zIndex: 5,
            opacity: ballVisible ? 1 : 0,
            pointerEvents: "none",
            transition: "none",
            willChange: "transform, opacity",
          }}
        />

        {/* Ponteiro fixo no topo */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
            <path
              d="M12 0L0 24h24L12 0z"
              fill="#D4A843"
              stroke="#FFD700"
              strokeWidth="1"
            />
            <path d="M12 4L4 22h16L12 4z" fill="#FFD700" opacity="0.5" />
          </svg>
        </div>

        {/* Loading */}
        {!loaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              color: "#D4A843",
              fontSize: 14,
              zIndex: 5,
            }}
          >
            Carregando...
          </div>
        )}
      </div>
    );
  }
);

export default RouletteWheel;
