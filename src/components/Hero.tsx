"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Mail,
  Rocket,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Code2,
  Box,
  Layers,
  Zap,
} from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import { profile } from "@/data/portfolioData";
import LiveCodeCard from "./LiveCodeCard";
import ThreeDScene from "./ThreeDScene";
import TiltCard from "./TiltCard";
import { soundManager } from "@/utils/audio";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"3d" | "code">("3d");

  return (
    <section
      id="inicio"
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 pt-20 pb-20 sm:pt-24 sm:pb-24 sm:px-8 scroll-mt-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Columna de presentación */}
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge de disponibilidad con animación holográfica */}
          <motion.div variants={item}>
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-300 border-emerald-500/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              </span>
              Disponible para nuevas oportunidades laborales
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl xl:text-6xl"
          >
            Juan Felipe{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]">
              Uribe Romero
            </span>
          </motion.h1>

          <motion.div variants={item} className="mt-3 flex items-center gap-2">
            <span className="text-xl font-bold text-slate-200 sm:text-2xl">
              {profile.role}
            </span>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-300">
              NEXT GEN
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-mono"
          >
            <MapPin size={14} className="text-cyan-400" />
            {profile.location}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300/90"
          >
            {profile.focus} Especializado en crear aplicaciones robustas,
            escalables y atractivas de punta a punta, uniendo la precisión del backend
            con la interactividad 3D y fluidez del frontend.
          </motion.p>

          {/* Quick Metrics Pills */}
          <motion.div variants={item} className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-300">
              <Zap size={12} className="text-amber-400" />
              Alto Rendimiento
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-300">
              <Box size={12} className="text-cyan-400" />
              Arquitectura 3D & WebGL
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-300">
              <Layers size={12} className="text-violet-400" />
              Django + React + Supabase
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#proyecto"
              onClick={() => soundManager.playClick()}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/50 hover:brightness-110"
            >
              <Rocket
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span>Explorar Sigif Showcase</span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </a>

            <a
              href="#contacto"
              onClick={() => soundManager.playClick()}
              className="glass group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-slate-900/60"
            >
              <span>Contáctame</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Enlaces sociales */}
          <motion.div variants={item} className="mt-6 flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playHover()}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-300 transition-colors duration-300 hover:border-cyan-500/50 hover:text-cyan-300"
            >
              <GithubIcon size={16} />
              <span>{profile.githubUser}</span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              onClick={() => soundManager.playHover()}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-300 transition-colors duration-300 hover:border-violet-500/50 hover:text-violet-300"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">{profile.email}</span>
              <span className="sm:hidden">Correo</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Columna Interactiva Derecha: Switcher entre 3D Core y Live Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex flex-col"
        >
          {/* Tab Selector Header */}
          <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 p-1.5 backdrop-blur-md">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab("3d");
                }}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  activeTab === "3d"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Box size={14} />
                <span>Núcleo 3D WebGL</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab("code");
                }}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  activeTab === "code"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 size={14} />
                <span>Consola de Código</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-slate-500 pr-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400/80 animate-pulse" />
              INTERACTIVO
            </div>
          </div>

          {/* Interactive Screen Display */}
          <TiltCard
            maxTilt={6}
            glareColor={
              activeTab === "3d"
                ? "rgba(56, 189, 248, 0.15)"
                : "rgba(168, 85, 247, 0.15)"
            }
            className="overflow-hidden rounded-3xl"
          >
            <div className="glass relative min-h-[460px] overflow-hidden rounded-3xl border border-slate-800/80 transition-colors duration-500 hover:border-cyan-500/40">
              {activeTab === "3d" ? <ThreeDScene /> : <LiveCodeCard />}
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.a
        href="#habilidades"
        aria-label="Bajar a habilidades"
        onClick={() => soundManager.playHover()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-slate-500 transition-colors hover:text-cyan-300 md:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 font-mono text-[11px]"
        >
          <span>EXPLORAR</span>
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
