import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Rocket,
  GitBranch,
  Mail,
  Volume2,
  VolumeX,
  Command,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { soundManager } from "@/utils/audio";
import { scrollToSectionById } from "@/utils/scroll";

interface NavItemConfig {
  id: string;
  label: string;
  tag: string;
  icon: React.ElementType;
  color: string;
}

const navItems: NavItemConfig[] = [
  {
    id: "inicio",
    label: "Inicio",
    tag: "01 // CORE",
    icon: Terminal,
    color: "#38bdf8",
  },
  {
    id: "habilidades",
    label: "Stack",
    tag: "02 // STACK",
    icon: Cpu,
    color: "#c084fc",
  },
  {
    id: "proyecto",
    label: "Sigif",
    tag: "03 // PROYECTO",
    icon: Rocket,
    color: "#38bdf8",
  },
  {
    id: "trayectoria",
    label: "Trayectoria",
    tag: "04 // CARRERA",
    icon: GitBranch,
    color: "#34d399",
  },
  {
    id: "contacto",
    label: "Contacto",
    tag: "05 // CONECTAR",
    icon: Mail,
    color: "#fbbf24",
  },
];

export default function Navbar({
  onOpenCommand,
}: {
  onOpenCommand?: () => void;
}) {
  const [active, setActive] = useState("inicio");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());

    const onScroll = () => {
      // Calculate scroll progress percentage (0 - 100)
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, Math.round(progress))));

      // Probe active section
      const probe = window.innerHeight * 0.38;
      let current = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= probe) {
          current = item.id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSound = async () => {
    const next = await soundManager.toggle();
    setSoundEnabled(next);
  };

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    soundManager.playClick();
    scrollToSectionById(id);
  };

  // Circular gauge math for scroll progress
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* 1. TOP MINIMALIST CYBER TELEMETRY HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Brand Logo with Live Terminal Glow */}
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, "inicio")}
            className="pointer-events-auto group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#070A12]/85 px-3.5 py-2 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/15"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-slate-950 font-black shadow-md shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-105">
              <Terminal size={15} strokeWidth={2.6} />
              <span className="absolute -inset-0.5 rounded-xl bg-cyan-400/40 blur-xs -z-10 group-hover:opacity-100 opacity-0 transition-opacity" />
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold tracking-tight text-slate-100 group-hover:text-cyan-200 transition-colors">
                JuanFe<span className="text-cyan-400">.dev</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Full Stack Architect
              </span>
            </div>
          </a>

          {/* Center Availability Beacon (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#070A12]/85 px-4 py-1.5 font-mono text-xs text-emerald-300 backdrop-blur-xl shadow-lg shadow-emerald-500/5">
            <span className="relative flex h-2 w-2">
              <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </span>
            <span>MEDELLÍN, CO</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">DISPONIBLE</span>
          </div>

          {/* Right Action Quick Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Command Center Button */}
            {onOpenCommand && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenCommand();
                }}
                className="group flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-[#070A12]/85 px-3 py-2 font-mono text-xs text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/15"
                title="Abrir Command Center (Ctrl+K)"
              >
                <Command size={13} className="text-cyan-400" />
                <span className="hidden sm:inline">Buscar</span>
                <kbd className="hidden sm:inline-block rounded-md bg-slate-900 border border-slate-700/60 px-1.5 py-0.5 text-[10px] text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Direct Contact Button */}
            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, "contacto")}
              className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110"
            >
              <Sparkles size={13} />
              <span>Hablemos</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. REVOLUTIONARY FLOATING CYBER HUD COCKPIT DOCK (Anchored Bottom Center) */}
      <nav
        aria-label="Navegación principal de cabina"
        className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-auto relative flex items-center gap-1 sm:gap-2 rounded-3xl border border-cyan-500/30 bg-[#0B0F19]/90 p-1.5 sm:p-2 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.18)]"
        >
          {/* Subtle neon border shimmer */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-emerald-500/30 -z-10 opacity-70 blur-[1px]" />

          {/* Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative">
                  {/* Floating Holographic Tooltip on Hover */}
                  <AnimatePresence>
                    {hoveredItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.85 }}
                        animate={{ opacity: 1, y: -44, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-cyan-500/40 bg-[#070A12]/95 px-3 py-1 font-mono text-[10px] font-bold text-cyan-300 shadow-xl shadow-cyan-500/20 backdrop-blur-md"
                      >
                        {item.tag}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#070A12]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    onMouseEnter={() => {
                      soundManager.playHover();
                      setHoveredItem(item.id);
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative flex items-center gap-2 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 ${
                      isActive
                        ? "text-slate-950 font-bold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Glowing active neon background pill */}
                    {isActive && (
                      <motion.div
                        layoutId="active-cyber-dock"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center">
                      <Icon
                        size={17}
                        className={
                          isActive
                            ? "text-slate-950"
                            : "transition-transform group-hover:scale-110"
                        }
                      />
                    </span>

                    <span className="relative z-10 hidden sm:inline-block font-mono text-xs">
                      {item.label}
                    </span>
                  </a>
                </div>
              );
            })}
          </div>

          <div className="h-6 w-px bg-slate-800/80 mx-1" />

          {/* Sound FX Synthesizer with Equalizer Animation */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 rounded-2xl px-2.5 py-2 transition-all duration-300 ${
              soundEnabled
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
            title={
              soundEnabled
                ? "Silenciar efectos sonoros sci-fi"
                : "Activar efectos sonoros sci-fi"
            }
            aria-label="Alternar efectos sonoros"
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1">
                <Volume2 size={16} />
                {/* 3 Animated Equalizer Frequency Bars */}
                <span className="hidden sm:flex items-end gap-[2px] h-3">
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-[ping-soft_1s_ease-in-out_infinite] h-full" />
                  <span className="w-[2px] bg-cyan-300 rounded-full animate-[ping-soft_1.4s_ease-in-out_infinite_0.2s] h-2/3" />
                  <span className="w-[2px] bg-violet-400 rounded-full animate-[ping-soft_0.8s_ease-in-out_infinite_0.4s] h-4/5" />
                </span>
              </div>
            ) : (
              <VolumeX size={16} />
            )}
          </button>

          {/* Circular Scroll Progress Gauge & Back-to-Top Button */}
          <button
            onClick={scrollToTop}
            className="group relative flex h-9 w-9 items-center justify-center rounded-2xl text-slate-400 transition-all hover:text-cyan-300 hover:bg-slate-800/40"
            title={`Progreso: ${scrollProgress}% · Clic para volver arriba`}
            aria-label="Progreso de lectura y volver arriba"
          >
            {/* SVG Circular Progress Track */}
            <svg className="absolute h-8 w-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-cyan-400 transition-all duration-200"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {scrollProgress > 92 ? (
              <ArrowUp size={14} className="text-cyan-400 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <span className="font-mono text-[9px] font-bold text-slate-300">
                {scrollProgress}%
              </span>
            )}
          </button>
        </motion.div>
      </nav>
    </>
  );
}
