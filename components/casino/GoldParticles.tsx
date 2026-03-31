"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─── Tipos de partículas para efeitos variados ─── */
interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  type: "gold" | "green" | "spark" | "orb";
  life: number;
  maxLife: number;
  angle: number;
  rotSpeed: number;
}

function createParticle(w: number, h: number): Particle {
  const rand = Math.random();
  let type: Particle["type"] = "gold";
  if (rand < 0.12) type = "green";
  else if (rand < 0.22) type = "spark";
  else if (rand < 0.30) type = "orb";

  const maxLife = 300 + Math.random() * 400;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: type === "spark" ? Math.random() * 1.5 + 0.3 : type === "orb" ? Math.random() * 3 + 1.5 : Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: type === "spark" ? -(Math.random() * 1.5 + 0.5) : -(Math.random() * 0.5 + 0.1),
    alpha: Math.random() * 0.6 + 0.2,
    type,
    life: Math.random() * maxLife,
    maxLife,
    angle: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
  };
}

export default function GoldParticles({ width, height, mouseX, mouseY, paused = false, maxCount = 50, speedMult = 1, greenProb = 0.12, sparkProb = 0.10, orbProb = 0.08 }: { width: number; height: number; mouseX: number; mouseY: number; paused?: boolean; maxCount?: number; speedMult?: number; greenProb?: number; sparkProb?: number; orbProb?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const atmosRef = useRef({ maxCount, speedMult, greenProb, sparkProb, orbProb });
  atmosRef.current = { maxCount, speedMult, greenProb, sparkProb, orbProb };
  const raf = useRef<number>(0);
  const time = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const lastDrawTime = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Atualizar ref do mouse sem re-render
  mouseRef.current.x = mouseX;
  mouseRef.current.y = mouseY;

  const draw = useCallback((timestamp: number) => {
    raf.current = requestAnimationFrame(draw);

    if (pausedRef.current) return;

    const elapsed = timestamp - lastDrawTime.current;
    if (elapsed < 33.33) return;
    lastDrawTime.current = timestamp - (elapsed % 33.33);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    time.current += 1;
    ctx.clearRect(0, 0, width, height);

    // Efeito de ambient glow pulsante no fundo
    const ambientPulse = 0.03 + Math.sin(time.current * 0.008) * 0.015;
    const ambientGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 0,
      width * 0.5, height * 0.4, width * 0.6
    );
    ambientGrad.addColorStop(0, `rgba(212,168,67,${ambientPulse})`);
    ambientGrad.addColorStop(0.5, `rgba(0,230,118,${ambientPulse * 0.3})`);
    ambientGrad.addColorStop(1, "transparent");
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(0, 0, width, height);

    for (const p of particles.current) {
      const sm = atmosRef.current.speedMult;
      p.x += p.vx * sm;
      p.y += p.vy * sm;
      p.life += 1;
      p.angle += p.rotSpeed;

      // ── FASE 7: Repulsão do mouse (segura com clamp) ──
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx > 0 && my > 0) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 90;
        if (dist < repulsionRadius && dist > 0.1) {
          // Força suave inversamente proporcional à distância
          const force = ((repulsionRadius - dist) / repulsionRadius) * 1.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
          // CLAMP obrigatório — anti-padrão #7
          p.x = Math.max(-5, Math.min(width + 5, p.x));
          p.y = Math.max(-5, Math.min(height + 5, p.y));
        }
      }

      // Fade in/out baseado em ciclo de vida
      const lifeRatio = p.life / p.maxLife;
      const fadeAlpha = lifeRatio < 0.1
        ? lifeRatio * 10 * p.alpha
        : lifeRatio > 0.85
          ? (1 - lifeRatio) * (1 / 0.15) * p.alpha
          : p.alpha;

      // Reset se sair da tela ou ciclo completou
      if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10 || p.life >= p.maxLife) {
        Object.assign(p, createParticle(width, height));
        p.y = height + 5;
        continue;
      }

      // Movimento flutuante senoidal
      p.x += Math.sin(time.current * 0.01 + p.angle) * 0.15;

      if (p.type === "gold") {
        // Particula dourada classica
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,67,${fadeAlpha})`;
        ctx.fill();
        // Halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(255,215,0,${fadeAlpha * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (p.type === "green") {
        // Particula verde emerald
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,230,118,${fadeAlpha})`;
        ctx.fill();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        grad.addColorStop(0, `rgba(0,230,118,${fadeAlpha * 0.35})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (p.type === "spark") {
        // Faisca rapida - formato de estrela (4 pontas)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const sparkLen = p.r * 4;
        ctx.beginPath();
        ctx.moveTo(0, -sparkLen);
        ctx.lineTo(p.r * 0.3, 0);
        ctx.lineTo(0, sparkLen);
        ctx.lineTo(-p.r * 0.3, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,240,200,${fadeAlpha * 0.9})`;
        ctx.fill();
        // Cruz perpendicular
        ctx.beginPath();
        ctx.moveTo(-sparkLen * 0.6, 0);
        ctx.lineTo(0, p.r * 0.3);
        ctx.lineTo(sparkLen * 0.6, 0);
        ctx.lineTo(0, -p.r * 0.3);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,215,0,${fadeAlpha * 0.6})`;
        ctx.fill();
        ctx.restore();
      } else if (p.type === "orb") {
        // Orb grande, suave, flutuante
        const orbPulse = 1 + Math.sin(time.current * 0.02 + p.angle) * 0.2;
        const orbR = p.r * orbPulse;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, orbR * 3);
        grad.addColorStop(0, `rgba(212,168,67,${fadeAlpha * 0.15})`);
        grad.addColorStop(0.5, `rgba(0,230,118,${fadeAlpha * 0.05})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, orbR * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // Ajuste dinamico de quantidade por atmosfera
    const target = atmosRef.current.maxCount;
    const current = particles.current.length;
    if (current < target) {
      particles.current.push(createParticle(width, height));
    } else if (current > target && current > 10) {
      particles.current.pop();
    }

  }, [width, height]);

  useEffect(() => {
    if (!width || !height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    particles.current = Array.from({ length: maxCount }, () => createParticle(width, height));

    draw(performance.now());
    return () => cancelAnimationFrame(raf.current);
  }, [width, height, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
