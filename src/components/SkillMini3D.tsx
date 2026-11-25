import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Monitor,
  ServerCog,
  Database,
  Wrench,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { SkillCategory, SkillItem } from "@/data/portfolioData";
import TiltCard from "./TiltCard";
import { soundManager } from "@/utils/audio";

type AccentPalette = {
  faceBorder: string;
  faceBg: string;
  ring: string;
  glow: string;
  text: string;
  badge: string;
  dot: string;
  glare: string;
  border: string;
};

const PALETTES: Record<SkillCategory["accent"], AccentPalette> = {
  cyan: {
    faceBorder: "border-cyan-400/50",
    faceBg: "bg-cyan-500/10",
    ring: "border-cyan-400/45",
    glow: "bg-cyan-500/20",
    text: "text-cyan-300",
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    dot: "bg-cyan-400 shadow-[0_0_10px_#38bdf8]",
    glare: "rgba(56, 189, 248, 0.16)",
    border: "border-cyan-500/40 hover:border-cyan-400/80",
  },
  violet: {
    faceBorder: "border-violet-400/50",
    faceBg: "bg-violet-500/10",
    ring: "border-violet-400/45",
    glow: "bg-violet-500/20",
    text: "text-violet-300",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    dot: "bg-violet-400 shadow-[0_0_10px_#c084fc]",
    glare: "rgba(168, 85, 247, 0.16)",
    border: "border-violet-500/40 hover:border-violet-400/80",
  },
  emerald: {
    faceBorder: "border-emerald-400/50",
    faceBg: "bg-emerald-500/10",
    ring: "border-emerald-400/45",
    glow: "bg-emerald-500/20",
    text: "text-emerald-300",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_10px_#34d399]",
    glare: "rgba(52, 211, 153, 0.16)",
    border: "border-emerald-500/40 hover:border-emerald-400/80",
  },
  sky: {
    faceBorder: "border-sky-400/50",
    faceBg: "bg-sky-500/10",
    ring: "border-sky-400/45",
    glow: "bg-sky-500/20",
    text: "text-sky-300",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400 shadow-[0_0_10px_#38bdf8]",
    glare: "rgba(56, 189, 248, 0.16)",
    border: "border-sky-500/40 hover:border-sky-400/80",
  },
};

/**
 * Compact floating 3D wireframe cube + orbital ring rendered inside each skill category card.
 */
export function Mini3DBadge({
  accent,
}: {
  accent: SkillCategory["accent"];
}) {
  const palette = PALETTES[accent];
  const half = 11; // 22px cube

  const faces = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none relative flex h-12 w-12 shrink-0 items-center justify-center"
      style={{ perspective: "260px", transform: "translateZ(26px)" }}
    >
      {/* Orbital ring */}
      <div
        className={`animate-orbit-3d absolute h-11 w-11 rounded-full border border-dashed ${palette.ring}`}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* 3D Cube */}
      <div
        className="animate-spin-3d group-hover/card:animate-spin-3d-fast relative h-[22px] w-[22px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {faces.map((transform, idx) => (
          <span
            key={idx}
            style={{ transform }}
            className={`absolute inset-0 rounded-[4px] border ${palette.faceBorder} ${palette.faceBg} backdrop-blur-[2px]`}
          />
        ))}
      </div>
    </div>
  );
}

type CategorySpotlightMeta = {
  eyebrow: string;
  headline: string;
  summary: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  pillars: { title: string; desc: string }[];
};

const SPOTLIGHT_META: Record<SkillCategory["id"], CategorySpotlightMeta> = {
  frontend: {
    eyebrow: "arquitectura ui 3d",
    headline: "Interfaces Reactivas & Motion",
    summary:
      "Construcción de experiencias fluidas con renderizado optimizado, diseño adaptable y micro-interacciones 3D.",
    icon: Monitor,
    pillars: [
      { title: "Componentes Modulares", desc: "Reutilización limpia y estado predecible" },
      { title: "Rendimiento & SEO", desc: "Carga rápida, semántica y accesibilidad" },
      { title: "Estilos & 3D", desc: "Glassmorphism, Tailwind y animaciones" },
    ],
  },
  mobile: {
    eyebrow: "ecosistema mobile 3d",
    headline: "Apps Nativas Multiplataforma",
    summary:
      "Desarrollo ágil para iOS y Android desde un único código base con sincronización en tiempo real.",
    icon: Smartphone,
    pillars: [
      { title: "Widgets Declarativos", desc: "UI fluida a 60fps con Flutter & Dart" },
      { title: "Estado Reactivo", desc: "Provider/Riverpod y arquitectura limpia" },
      { title: "Sync en Tiempo Real", desc: "Conexión directa con APIs y nube" },
    ],
  },
  backend: {
    eyebrow: "núcleo backend 3d",
    headline: "Lógica Segura & APIs REST",
    summary:
      "Servicios escalables orientados a objetos, validación estricta de datos y autenticación robusta.",
    icon: ServerCog,
    pillars: [
      { title: "APIs Consistentes", desc: "Endpoints RESTful, JSON y JWT" },
      { title: "ORM & Seguridad", desc: "Control de acceso y reglas de negocio" },
      { title: "Servicios Asíncronos", desc: "Procesamiento eficiente y modular" },
    ],
  },
  databases: {
    eyebrow: "persistencia 3d",
    headline: "Modelado & Datos Realtime",
    summary:
      "Estructuras relacionales normalizadas y colecciones NoSQL diseñadas para consultas rápidas e íntegras.",
    icon: Database,
    pillars: [
      { title: "Integridad Referencial", desc: "Esquemas sólidos en PostgreSQL & MySQL" },
      { title: "Consultas Optimizadas", desc: "Índices estratégicos y transacciones" },
      { title: "Flexibilidad Cloud", desc: "Supabase Realtime y documentos MongoDB" },
    ],
  },
  tools: {
    eyebrow: "flujo devops 3d",
    headline: "Entornos, Versiones & Testing",
    summary:
      "Automatización de pruebas, control de ramas limpio y contenedores reproducibles hasta producción.",
    icon: Wrench,
    pillars: [
      { title: "Git Flow Limpio", desc: "Ramas estratégicas y Pull Requests" },
      { title: "Contenedores Docker", desc: "Entornos aislados y reproducibles" },
      { title: "Validación de APIs", desc: "Colecciones y pruebas en Postman" },
    ],
  },
};

/**
 * Interactive 3D spotlight card shown in the middle column when a specific skill category is filtered.
 */
export function FilteredCategory3DSpotlight({
  category,
  selectedSkill,
  onSelectSkill,
}: {
  category: SkillCategory;
  selectedSkill: SkillItem;
  onSelectSkill: (skill: SkillItem) => void;
}) {
  const [boosted, setBoosted] = useState(false);
  const palette = PALETTES[category.accent];
  const meta = SPOTLIGHT_META[category.id];
  const CoreIcon = meta.icon;

  const half = 24; // 48px 3D holographic core
  const cubeFaces = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  const handleCoreClick = () => {
    soundManager.playClick();
    setBoosted((prev) => !prev);
    // Cycle to next skill in this filtered category
    const idx = category.items.findIndex((i) => i.name === selectedSkill.name);
    const nextSkill = category.items[(idx + 1) % category.items.length];
    if (nextSkill) {
      onSelectSkill(nextSkill);
    }
  };

  return (
    <motion.div
      key={`spotlight-${category.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="h-full"
    >
      <TiltCard maxTilt={8} glareColor={palette.glare} className="h-full">
        <article
          className={`glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 transition-colors duration-300 ${palette.border}`}
        >
          {/* Ambient glow */}
          <div
            className={`pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full ${palette.glow} blur-3xl opacity-75`}
          />

          {/* Top Header */}
          <div style={{ transform: "translateZ(18px)" }}>
            <div className="flex items-center justify-between gap-2">
              <span className={`font-mono text-[11px] uppercase tracking-wider ${palette.text}`}>
                // {meta.eyebrow}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${palette.badge}`}
              >
                3D INTERACTIVO
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-slate-100">
              {meta.headline}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {meta.summary}
            </p>
          </div>

          {/* Interactive 3D Holographic Core */}
          <button
            type="button"
            onClick={handleCoreClick}
            onMouseEnter={() => soundManager.playHover()}
            title="Haz clic para rotar el núcleo y cambiar de tecnología"
            className="group/core relative my-5 flex h-36 w-full cursor-pointer items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/60 transition-colors hover:border-slate-700"
            style={{ perspective: "600px", transform: "translateZ(24px)" }}
          >
            {/* Outer tilted orbital ring */}
            <div
              className={`animate-orbit-3d pointer-events-none absolute h-28 w-28 rounded-full border ${palette.ring}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span
                className={`absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ${palette.dot}`}
              />
            </div>

            {/* Secondary counter-orbital ring */}
            <div
              className={`animate-orbit-3d-alt pointer-events-none absolute h-24 w-24 rounded-full border border-dashed ${palette.ring}`}
              style={{ transformStyle: "preserve-3d" }}
            />

            {/* Central 3D Wireframe Cube */}
            <div
              className={`relative h-12 w-12 transition-transform duration-300 group-hover/core:scale-110 ${
                boosted ? "animate-spin-3d-fast" : "animate-spin-3d"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {cubeFaces.map((transform, idx) => (
                <span
                  key={idx}
                  style={{ transform }}
                  className={`absolute inset-0 flex items-center justify-center rounded-lg border ${palette.faceBorder} ${palette.faceBg} backdrop-blur-[2px]`}
                />
              ))}
            </div>

            {/* Floating Center Icon */}
            <div
              className={`animate-float-3d pointer-events-none absolute flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/85 ${palette.text} shadow-lg`}
            >
              <CoreIcon size={18} />
            </div>

            <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-slate-500 transition-colors group-hover/core:text-slate-300">
              clic para rotar stack ↻
            </span>
          </button>

          {/* Architecture Pillars */}
          <div
            className="space-y-2"
            style={{ transform: "translateZ(14px)" }}
          >
            {meta.pillars.map((pillar, i) => {
              const PillarIcon = i === 0 ? Layers : i === 1 ? ShieldCheck : Zap;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-800/70 bg-slate-950/50 px-3 py-2"
                >
                  <PillarIcon size={14} className={`mt-0.5 shrink-0 ${palette.text}`} />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold text-slate-200">
                      {pillar.title}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cpu size={12} className={palette.text} />
              Enfoque: <strong className="text-slate-300">{selectedSkill.name}</strong>
            </span>
            <Sparkles size={12} className={palette.text} />
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
