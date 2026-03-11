"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { SpinResult } from "./RouletteGame";

// European roulette number sequence (clockwise from 0)
const EUROPEAN_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

// Colors for each number
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

function getNumberColor(num: number): "red" | "black" | "green" {
  if (num === 0) return "green";
  return RED_NUMBERS.includes(num) ? "red" : "black";
}

interface RouletteWheelProps {
  size?: number;
  luckyNumbers?: Map<number, number>;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinResult) => void;
}

export interface RouletteWheelRef {
  spin: (targetNumber?: number) => void;
  isSpinning: () => boolean;
}

const RouletteWheel = forwardRef<RouletteWheelRef, RouletteWheelProps>(
  function RouletteWheel(
    { size = 400, luckyNumbers = new Map(), onSpinStart, onSpinEnd },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wheelImageRef = useRef<HTMLImageElement | null>(null);
    const ballImageRef = useRef<HTMLImageElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Animation state
    const wheelAngleRef = useRef(0);
    const ballAngleRef = useRef(0);
    const ballRadiusRef = useRef(0);
    const spinningRef = useRef(false);
    const rafRef = useRef<number>(0);

    // Preload images
    useEffect(() => {
      let mounted = true;

      const wheelImg = new Image();
      wheelImg.crossOrigin = "anonymous";
      wheelImg.src = "/assets/roulette/04.wheel-european.png";

      const ballImg = new Image();
      ballImg.crossOrigin = "anonymous";
      ballImg.src = "/assets/roulette/05.ball.png";

      let loadedCount = 0;
      const onLoad = () => {
        loadedCount++;
        if (loadedCount === 2 && mounted) {
          wheelImageRef.current = wheelImg;
          ballImageRef.current = ballImg;
          setIsLoaded(true);
        }
      };

      wheelImg.onload = onLoad;
      ballImg.onload = onLoad;

      return () => {
        mounted = false;
      };
    }, []);

    // Draw wheel
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const wheelImg = wheelImageRef.current;
      const ballImg = ballImageRef.current;

      if (!canvas || !ctx || !wheelImg || !ballImg) return;

      const dpr = window.devicePixelRatio || 1;
      const displaySize = size;
      canvas.width = displaySize * dpr;
      canvas.height = displaySize * dpr;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
      ctx.scale(dpr, dpr);

      const cx = displaySize / 2;
      const cy = displaySize / 2;
      const wheelRadius = displaySize * 0.45;

      // Clear
      ctx.clearRect(0, 0, displaySize, displaySize);

      // Draw glow behind wheel
      const glowGradient = ctx.createRadialGradient(cx, cy, wheelRadius * 0.8, cx, cy, wheelRadius * 1.2);
      glowGradient.addColorStop(0, "rgba(212, 168, 67, 0.15)");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, displaySize, displaySize);

      // Draw wheel (rotated)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(wheelAngleRef.current);
      ctx.drawImage(
        wheelImg,
        -wheelRadius,
        -wheelRadius,
        wheelRadius * 2,
        wheelRadius * 2
      );
      ctx.restore();

      // Draw lucky number highlights on wheel
      if (luckyNumbers.size > 0) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(wheelAngleRef.current);

        const pocketAngle = (Math.PI * 2) / 37;
        luckyNumbers.forEach((multiplier, num) => {
          const index = EUROPEAN_SEQUENCE.indexOf(num);
          if (index === -1) return;

          const angle = -Math.PI / 2 + index * pocketAngle;
          const highlightRadius = wheelRadius * 0.75;

          ctx.save();
          ctx.rotate(angle + pocketAngle / 2);

          // Glow effect
          const glow = ctx.createRadialGradient(
            0,
            -highlightRadius,
            0,
            0,
            -highlightRadius,
            wheelRadius * 0.15
          );
          glow.addColorStop(0, "rgba(255, 215, 0, 0.8)");
          glow.addColorStop(0.5, "rgba(255, 215, 0, 0.3)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, -highlightRadius, wheelRadius * 0.15, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        ctx.restore();
      }

      // Draw ball if it has a radius (during/after spin)
      if (ballRadiusRef.current > 0) {
        const ballR = ballRadiusRef.current;
        const ballX = cx + Math.cos(ballAngleRef.current) * ballR;
        const ballY = cy + Math.sin(ballAngleRef.current) * ballR;
        const ballSize = displaySize * 0.04;

        // Ball shadow
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(
          ballImg,
          ballX - ballSize / 2,
          ballY - ballSize / 2,
          ballSize,
          ballSize
        );
        ctx.restore();

        // Ball trail effect when spinning fast
        if (spinningRef.current) {
          for (let i = 1; i <= 3; i++) {
            const trailAngle = ballAngleRef.current - i * 0.15;
            const trailX = cx + Math.cos(trailAngle) * ballR;
            const trailY = cy + Math.sin(trailAngle) * ballR;
            ctx.globalAlpha = 0.3 - i * 0.08;
            ctx.drawImage(
              ballImg,
              trailX - ballSize / 2,
              trailY - ballSize / 2,
              ballSize,
              ballSize
            );
          }
          ctx.globalAlpha = 1;
        }
      }

      // Draw center cap
      const capGradient = ctx.createRadialGradient(
        cx - wheelRadius * 0.05,
        cy - wheelRadius * 0.05,
        0,
        cx,
        cy,
        wheelRadius * 0.15
      );
      capGradient.addColorStop(0, "#FFD700");
      capGradient.addColorStop(0.5, "#D4A843");
      capGradient.addColorStop(1, "#8B6914");

      ctx.beginPath();
      ctx.arc(cx, cy, wheelRadius * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = capGradient;
      ctx.fill();
      ctx.strokeStyle = "#8B6914";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pointer at top
      ctx.save();
      ctx.translate(cx, cy - wheelRadius - 8);
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(-10, -8);
      ctx.lineTo(10, -8);
      ctx.closePath();
      const pointerGradient = ctx.createLinearGradient(0, -8, 0, 12);
      pointerGradient.addColorStop(0, "#FFD700");
      pointerGradient.addColorStop(1, "#8B6914");
      ctx.fillStyle = pointerGradient;
      ctx.fill();
      ctx.strokeStyle = "#D4A843";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }, [size, luckyNumbers]);

    // Initial draw
    useEffect(() => {
      if (isLoaded) {
        draw();
      }
    }, [isLoaded, draw]);

    // Spin function
    const spin = useCallback(
      (targetNumber?: number) => {
        if (spinningRef.current) return;

        const finalNumber =
          targetNumber ?? Math.floor(Math.random() * 37);
        const finalIndex = EUROPEAN_SEQUENCE.indexOf(finalNumber);

        spinningRef.current = true;
        onSpinStart?.();

        const wheelRadius = size * 0.45;
        const pocketAngle = (Math.PI * 2) / 37;

        // Starting positions
        const startWheelAngle = wheelAngleRef.current;
        const startBallAngle = Math.random() * Math.PI * 2;
        ballAngleRef.current = startBallAngle;
        ballRadiusRef.current = wheelRadius * 0.85;

        // Target angles (wheel spins one way, ball the other)
        const wheelSpins = 3 + Math.random() * 2; // 3-5 full rotations
        const ballSpins = 5 + Math.random() * 3; // 5-8 full rotations (opposite)

        // Final pocket position (where ball lands)
        const targetPocketAngle =
          -Math.PI / 2 + finalIndex * pocketAngle + pocketAngle / 2;

        // Calculate final angles so ball lands in correct pocket
        // Ball angle relative to wheel = targetPocketAngle
        // finalBallAngle - finalWheelAngle = targetPocketAngle
        const finalWheelAngle =
          startWheelAngle + wheelSpins * Math.PI * 2;
        const finalBallAngle =
          startBallAngle -
          ballSpins * Math.PI * 2 +
          targetPocketAngle +
          finalWheelAngle;

        const finalBallRadius = wheelRadius * 0.7; // Ball settles in pocket

        const duration = 6000; // 6 seconds
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing: fast start, slow end (cubic ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);

          // Ball slows down more dramatically
          const ballEase = 1 - Math.pow(1 - progress, 4);

          // Update wheel angle
          wheelAngleRef.current =
            startWheelAngle +
            (finalWheelAngle - startWheelAngle) * easeOut;

          // Update ball angle (opposite direction)
          ballAngleRef.current =
            startBallAngle +
            (finalBallAngle - startBallAngle) * ballEase;

          // Ball spirals inward
          const radiusProgress = Math.pow(progress, 2); // Slow at first, fast at end
          ballRadiusRef.current =
            wheelRadius * 0.85 +
            (finalBallRadius - wheelRadius * 0.85) * radiusProgress;

          // Add some bounce when ball enters pockets (last 20%)
          if (progress > 0.8) {
            const bounceProgress = (progress - 0.8) / 0.2;
            const bounce =
              Math.sin(bounceProgress * Math.PI * 4) *
              (1 - bounceProgress) *
              8;
            ballRadiusRef.current += bounce;
          }

          draw();

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            // Spin complete
            spinningRef.current = false;

            const result: SpinResult = {
              number: finalNumber,
              color: getNumberColor(finalNumber),
              isLucky: luckyNumbers.has(finalNumber),
              multiplier: luckyNumbers.get(finalNumber),
            };

            onSpinEnd?.(result);
          }
        };

        rafRef.current = requestAnimationFrame(animate);
      },
      [size, luckyNumbers, draw, onSpinStart, onSpinEnd]
    );

    useImperativeHandle(ref, () => ({
      spin,
      isSpinning: () => spinningRef.current,
    }));

    // Cleanup
    useEffect(() => {
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, []);

    return (
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
        }}
      >
        {/* Outer ring glow */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,168,67,0.1) 60%, transparent 70%)",
            pointerEvents: "none",
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
          }}
        />

        {/* Loading state */}
        {!isLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4A843",
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(12px, 1.2vw, 16px)",
            }}
          >
            Carregando...
          </div>
        )}

        <style>{`
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
        `}</style>
      </div>
    );
  }
);

export default RouletteWheel;
