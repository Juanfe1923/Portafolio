"use client";

import { useEffect, useRef, useState } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  drift: number;
  colorType: 0 | 1 | 2; // 0: White, 1: Cyan, 2: Violet
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  dx: number;
  dy: number;
  alpha: number;
  color: string;
  headRadius: number;
  life: number;
  maxLife: number;
};

type CursorSpark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  decay: number;
};

/**
 * Fondo cósmico animado de alta fidelidad:
 * - Planetas 3D en movimiento orbital suave (Gigante con anillos Saturno + Luna Esmeralda + Exoplaneta distante).
 * - Lluvia constante de estrellas fugaces (meteoros con estela de luz resplandeciente).
 * - Campo estelar 3D titilante con parallax reactivo al mouse.
 * - Polvo estelar interactivo que brilla al mover el cursor.
 * - Auroras espaciales nebulosas en movimiento continuo.
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let cursorSparks: CursorSpark[] = [];
    let animationId = 0;
    let width = 0;
    let height = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let lastMeteorSpawnTime = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const seedStars = () => {
      const count = Math.min(240, Math.floor((width * height) / 7500));
      stars = Array.from({ length: count }, () => {
        const rand = Math.random();
        const colorType = rand < 0.65 ? 0 : rand < 0.85 ? 1 : 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 2.2 + 0.5,
          radius: Math.random() * 1.5 + 0.35,
          baseAlpha: Math.random() * 0.55 + 0.25,
          twinkleSpeed: Math.random() * 1.8 + 0.5,
          phase: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.025 + 0.008,
          colorType,
        };
      });
    };

    const spawnShootingStar = () => {
      // Spawn meteors from top/right quadrant traveling diagonally across screen
      const startX = Math.random() * (width * 1.2) - width * 0.1;
      const startY = Math.random() * (height * 0.4) - 40;
      const angle = (Math.random() * 25 + 35) * (Math.PI / 180); // 35 to 60 degrees down-left or down-right
      const speed = Math.random() * 14 + 16;
      const maxLife = Math.random() * 45 + 50;
      const isCyan = Math.random() > 0.4;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 140 + 120,
        speed,
        angle,
        dx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        dy: Math.sin(angle) * speed,
        alpha: 1,
        color: isCyan ? "56, 189, 248" : "192, 132, 252",
        headRadius: Math.random() * 1.5 + 1.2,
        life: 0,
        maxLife,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      targetParallaxX = normX * 24;
      targetParallaxY = normY * 24;

      // Spawn subtle stardust trail on mouse movement
      const dist = Math.hypot(e.clientX - prevMouseX, e.clientY - prevMouseY);
      if (dist > 18 && cursorSparks.length < 35) {
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        const color =
          Math.random() > 0.5 ? "rgba(56, 189, 248," : "rgba(168, 85, 247,";
        cursorSparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.4,
          radius: Math.random() * 2 + 1,
          alpha: 0.85,
          color,
          decay: Math.random() * 0.025 + 0.02,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    };

    // DRAWING PLANET 1: Saturn-like Gas Giant with Rings
    const drawRingedPlanet = (
      baseX: number,
      baseY: number,
      radius: number,
      time: number
    ) => {
      // Slow orbital bob & drift
      const px = baseX + Math.sin(time * 0.07) * 22;
      const py = baseY + Math.cos(time * 0.05) * 14;

      ctx.save();
      ctx.translate(px, py);

      // Back half of planetary rings (drawn behind planet)
      ctx.save();
      ctx.rotate(-0.35); // Ring tilt
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.3, radius * 0.55, 0, Math.PI, 0);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.35)";
      ctx.lineWidth = 14;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.1, radius * 0.48, 0, Math.PI, 0);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Atmospheric outer glow
      const atmosphereGlow = ctx.createRadialGradient(
        -radius * 0.3,
        -radius * 0.3,
        radius * 0.6,
        0,
        0,
        radius * 1.45
      );
      atmosphereGlow.addColorStop(0, "rgba(56, 189, 248, 0.25)");
      atmosphereGlow.addColorStop(0.7, "rgba(168, 85, 247, 0.15)");
      atmosphereGlow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.45, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGlow;
      ctx.fill();

      // Planet Sphere Body with realistic lighting
      const planetGrad = ctx.createRadialGradient(
        -radius * 0.4,
        -radius * 0.4,
        radius * 0.15,
        radius * 0.2,
        radius * 0.2,
        radius
      );
      planetGrad.addColorStop(0, "#38bdf8");
      planetGrad.addColorStop(0.3, "#1e1b4b");
      planetGrad.addColorStop(0.7, "#0f172a");
      planetGrad.addColorStop(1, "#070a12");

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();

      // Planetary stripes / cloud bands
      ctx.save();
      ctx.clip(); // Clip stripes inside planet circle
      ctx.rotate(-0.1);
      for (let i = -radius; i < radius; i += 12) {
        ctx.fillStyle =
          i % 24 === 0
            ? "rgba(56, 189, 248, 0.08)"
            : "rgba(168, 85, 247, 0.08)";
        ctx.fillRect(-radius, i, radius * 2, 6);
      }
      ctx.restore();

      // Front half of planetary rings (drawn in front of planet)
      ctx.save();
      ctx.rotate(-0.35);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.3, radius * 0.55, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.45)";
      ctx.lineWidth = 14;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.1, radius * 0.48, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    // DRAWING PLANET 2: Bioluminescent Emerald Moon
    const drawEmeraldMoon = (
      baseX: number,
      baseY: number,
      radius: number,
      time: number
    ) => {
      const px = baseX + Math.cos(time * 0.09) * 18;
      const py = baseY + Math.sin(time * 0.07) * 12;

      ctx.save();
      ctx.translate(px, py);

      // Atmospheric Halo
      const moonGlow = ctx.createRadialGradient(
        -radius * 0.3,
        -radius * 0.3,
        radius * 0.4,
        0,
        0,
        radius * 1.8
      );
      moonGlow.addColorStop(0, "rgba(52, 211, 153, 0.35)");
      moonGlow.addColorStop(0.6, "rgba(16, 185, 129, 0.12)");
      moonGlow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();

      // Crescent & Body
      const bodyGrad = ctx.createRadialGradient(
        -radius * 0.4,
        -radius * 0.4,
        radius * 0.1,
        radius * 0.2,
        radius * 0.2,
        radius
      );
      bodyGrad.addColorStop(0, "#34d399");
      bodyGrad.addColorStop(0.35, "#065f46");
      bodyGrad.addColorStop(0.7, "#0f172a");
      bodyGrad.addColorStop(1, "#070a12");

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      ctx.restore();
    };

    // DRAWING PLANET 3: Distant Violet Exoplanet
    const drawExoplanet = (
      baseX: number,
      baseY: number,
      radius: number,
      time: number
    ) => {
      const px = baseX + Math.sin(time * 0.04) * 10;
      const py = baseY + Math.cos(time * 0.03) * 8;

      ctx.save();
      ctx.translate(px, py);

      const glow = ctx.createRadialGradient(
        -radius * 0.3,
        -radius * 0.3,
        radius * 0.2,
        0,
        0,
        radius * 1.6
      );
      glow.addColorStop(0, "rgba(168, 85, 247, 0.3)");
      glow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      const grad = ctx.createRadialGradient(
        -radius * 0.4,
        -radius * 0.4,
        radius * 0.1,
        0,
        0,
        radius
      );
      grad.addColorStop(0, "#c084fc");
      grad.addColorStop(0.4, "#3b0764");
      grad.addColorStop(1, "#070a12");

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;

      // Parallax easing
      mouseParallaxX += (targetParallaxX - mouseParallaxX) * 0.04;
      mouseParallaxY += (targetParallaxY - mouseParallaxY) * 0.04;

      // 1. DRAW MOVING PLANETS IN BACKGROUND
      // Planet 1: Ringed Gas Giant (Upper Right area)
      drawRingedPlanet(
        width * 0.84 + mouseParallaxX * 0.4,
        height * 0.22 + mouseParallaxY * 0.4,
        48,
        t
      );

      // Planet 2: Emerald Moon (Lower Left area)
      drawEmeraldMoon(
        width * 0.14 + mouseParallaxX * 0.6,
        height * 0.72 + mouseParallaxY * 0.6,
        28,
        t
      );

      // Planet 3: Distant Violet Exoplanet (Upper Left area)
      drawExoplanet(
        width * 0.18 + mouseParallaxX * 0.3,
        height * 0.16 + mouseParallaxY * 0.3,
        18,
        t
      );

      // 2. DRAW TWINKLING STARS
      for (const star of stars) {
        const alpha = reducedMotion
          ? star.baseAlpha
          : star.baseAlpha *
            (0.55 + 0.45 * Math.sin(t * star.twinkleSpeed + star.phase));

        const posX = star.x + mouseParallaxX * star.z;
        const posY = star.y + mouseParallaxY * star.z;

        ctx.beginPath();
        ctx.arc(posX, posY, star.radius * (star.z * 0.55), 0, Math.PI * 2);

        if (star.colorType === 1) {
          ctx.fillStyle = `rgba(56, 189, 248, ${(alpha * 0.95).toFixed(3)})`;
        } else if (star.colorType === 2) {
          ctx.fillStyle = `rgba(192, 132, 252, ${(alpha * 0.85).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${alpha.toFixed(3)})`;
        }
        ctx.fill();

        if (!reducedMotion) {
          star.y -= star.drift;
          if (star.y < -4) star.y = height + 4;
        }
      }

      // 3. SHOOTING STARS / METEOR SHOWER (Lluvia de Estrellas)
      if (!reducedMotion && time - lastMeteorSpawnTime > 2400) {
        lastMeteorSpawnTime = time;
        spawnShootingStar();
        // Occasional double meteor burst
        if (Math.random() > 0.6) {
          setTimeout(spawnShootingStar, 400);
        }
      }

      // Update and render shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];
        meteor.x += meteor.dx;
        meteor.y += meteor.dy;
        meteor.life++;

        const progress = meteor.life / meteor.maxLife;
        meteor.alpha = Math.sin(progress * Math.PI); // Smooth fade in and fade out

        // Tail vector
        const tailX = meteor.x - (meteor.dx / meteor.speed) * meteor.length;
        const tailY = meteor.y - (meteor.dy / meteor.speed) * meteor.length;

        // Draw meteor luminous tail
        const grad = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          tailX,
          tailY
        );
        grad.addColorStop(0, `rgba(${meteor.color}, ${meteor.alpha.toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${meteor.color}, ${(meteor.alpha * 0.4).toFixed(3)})`);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = meteor.headRadius * 1.5;
        ctx.stroke();

        // Draw meteor shining head
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.headRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${meteor.color}, 1)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (meteor.life >= meteor.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      // 4. DRAW MOUSE INTERACTIVE STARDUST SPARKS
      for (let i = cursorSparks.length - 1; i >= 0; i--) {
        const spark = cursorSparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0) {
          cursorSparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${spark.color} ${spark.alpha.toFixed(3)})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base espacial void */}
      <div className="absolute inset-0 bg-[#070A12]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0B0F19_0%,#070A12_70%)]" />

      {/* Cyber Grid Matrix Pattern (Perspective Floor) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, #000 60%, transparent 100%)",
        }}
      />

      {/* Auroras bioluminiscentes en movimiento continuo */}
      <div className="aurora aurora-1 -top-40 -left-32 h-[42rem] w-[42rem] bg-cyan-500/15" />
      <div className="aurora aurora-2 top-1/3 -right-40 h-[38rem] w-[38rem] bg-violet-600/15" />
      <div className="aurora aurora-3 -bottom-48 left-1/4 h-[36rem] w-[36rem] bg-emerald-500/12" />

      {/* Foco de luz interactivo que sigue el cursor */}
      <div
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          background:
            "radial-gradient(circle 350px, rgba(56, 189, 248, 0.08), rgba(168, 85, 247, 0.04), transparent 70%)",
        }}
        className="pointer-events-none absolute -top-[350px] -left-[350px] h-[700px] w-[700px] rounded-full transition-transform duration-75 ease-out"
      />

      {/* Canvas dinámico con Planetas orbitando, Meteoros y Estrellas 3D */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Viñeta sutil para fundir los bordes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#070A12_100%)]" />
    </div>
  );
}
