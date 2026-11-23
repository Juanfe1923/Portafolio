"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  RefreshCw,
  FileBarChart2,
  Smartphone,
  Package,
  Receipt,
  TrendingUp,
  CheckCircle2,
  Database,
  Server,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import { sigifProject } from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import { soundManager } from "@/utils/audio";

const featureIcons = [RefreshCw, FileBarChart2, Smartphone];

export default function ProjectSigif() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "architecture" | "security">("dashboard");
  const [salesCount, setSalesCount] = useState(32);
  const [revenue, setRevenue] = useState(4.2);
  const [stockCount, setStockCount] = useState(1248);
  const [chartBars, setChartBars] = useState([42, 65, 50, 78, 60, 90, 72]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [recentAction, setRecentAction] = useState<string | null>(null);

  const simulateSale = () => {
    soundManager.playSuccess();
    setIsSyncing(true);
    setSalesCount((prev) => prev + 1);
    setRevenue((prev) => Number((prev + 0.15).toFixed(2)));
    setStockCount((prev) => Math.max(0, prev - 1));
    setRecentAction("Venta registrada: -$150.000 COP · Stock sincronizado");

    // Randomize one chart bar to show dynamic live activity
    setChartBars((prev) => {
      const next = [...prev];
      next[next.length - 1] = Math.min(100, next[next.length - 1] + 6);
      return next;
    });

    setTimeout(() => {
      setIsSyncing(false);
    }, 1800);

    setTimeout(() => {
      setRecentAction(null);
    }, 4000);
  };

  return (
    <section
      id="proyecto"
      className="relative mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:pt-16 sm:pb-24 sm:px-8 scroll-mt-14"
    >
      <SectionHeading
        eyebrow="// proyecto insignia & producción"
        title="Showcase 3D: Sigif"
        subtitle="Un ecosistema empresarial real en producción: sincronización de inventario en tiempo real entre plataforma web y aplicación móvil."
      />

      <TiltCard
        maxTilt={5}
        glareColor="rgba(56, 189, 248, 0.12)"
        className="overflow-hidden rounded-3xl"
      >
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass group relative overflow-hidden rounded-3xl border border-slate-800/80 transition-colors duration-500 hover:border-cyan-500/50 shadow-2xl"
        >
          {/* Resplandores ambientales de fondo */}
          <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />

          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            {/* Información del Proyecto */}
            <div>
              <div className="flex items-center gap-3">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 text-2xl font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                  S
                  <span className="absolute -inset-0.5 rounded-2xl bg-cyan-400/40 blur-sm -z-10" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-50">
                      {sigifProject.name}
                    </h3>
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      EN PRODUCCIÓN
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-cyan-300">
                    {sigifProject.tagline}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300/90">
                {sigifProject.summary}
              </p>

              {/* Lista de características clave */}
              <ul className="mt-6 space-y-3.5">
                {sigifProject.features.map((feature, idx) => {
                  const Icon = featureIcons[idx] ?? CheckCircle2;
                  return (
                    <motion.li
                      key={feature.title}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                      className="flex gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5 transition-colors hover:border-slate-700"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-200">
                          {feature.title}
                        </p>
                        <p className="text-xs leading-relaxed text-slate-400 mt-0.5">
                          {feature.description}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Tecnologías */}
              <div className="mt-6 flex flex-wrap gap-2">
                {sigifProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-1 font-mono text-xs text-slate-300 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Botón CTA hacia la demo en vivo */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={sigifProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110"
                >
                  <span>Abrir Aplicación en Vercel</span>
                  <ExternalLink
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/translate-x-[100%] transition-transform duration-700" />
                </a>

                <span className="font-mono text-xs text-slate-400">
                  Desplegado y verificado ✓
                </span>
              </div>
            </div>

            {/* Vista Previa Interactiva 3D con Tabs y Simulación de Venta */}
            <div className="flex flex-col">
              {/* Tab Selector for Preview */}
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 p-1 backdrop-blur-md">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("dashboard");
                    }}
                    className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                      activeTab === "dashboard"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Dashboard en Vivo
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("architecture");
                    }}
                    className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                      activeTab === "architecture"
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Arquitectura Cloud
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("security");
                    }}
                    className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                      activeTab === "security"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Seguridad
                  </button>
                </div>

                <span className="hidden sm:inline-block font-mono text-[10px] text-cyan-400 pr-2">
                  INTERACTIVO
                </span>
              </div>

              {/* Window Container */}
              <div className="glass overflow-hidden rounded-3xl border border-slate-800/80 shadow-2xl">
                {/* Titlebar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-xs text-slate-300">
                      sigif · control hub
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      API 200 OK
                    </span>
                  </div>
                </div>

                {/* Content according to Tab */}
                <div className="p-5">
                  {activeTab === "dashboard" && (
                    <div className="space-y-4">
                      {/* Interactive Metrics */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 transition-transform hover:scale-105">
                          <Package size={14} className="text-cyan-400" />
                          <p className="mt-1.5 text-base sm:text-lg font-black text-slate-100 font-mono">
                            {stockCount}
                          </p>
                          <p className="text-[10px] text-slate-400">Stock Total</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 transition-transform hover:scale-105">
                          <Receipt size={14} className="text-violet-400" />
                          <p className="mt-1.5 text-base sm:text-lg font-black text-slate-100 font-mono">
                            {salesCount}
                          </p>
                          <p className="text-[10px] text-slate-400">Facturas</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 transition-transform hover:scale-105">
                          <TrendingUp size={14} className="text-emerald-400" />
                          <p className="mt-1.5 text-base sm:text-lg font-black text-emerald-400 font-mono">
                            ${revenue}M
                          </p>
                          <p className="text-[10px] text-slate-400">Ventas Hoy</p>
                        </div>
                      </div>

                      {/* Chart preview */}
                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            Flujo de Operaciones (Semana)
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            Supabase Realtime
                          </span>
                        </div>
                        <div className="flex h-24 items-end gap-2">
                          {chartBars.map((height, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              style={{ height: `${height}%`, originY: 1 }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className={`flex-1 rounded-t-md transition-all duration-300 ${
                                idx === chartBars.length - 1
                                  ? "bg-gradient-to-t from-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                                  : "bg-gradient-to-t from-cyan-500/20 to-cyan-400/60"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Interactive Simulation Button */}
                      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">
                              Simulador de Transacciones
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Prueba la reactividad en tiempo real del sistema.
                            </p>
                          </div>
                          <button
                            onClick={simulateSale}
                            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                          >
                            <Zap size={13} />
                            Simular Venta
                          </button>
                        </div>

                        <AnimatePresence>
                          {recentAction && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-mono text-emerald-300"
                            >
                              <CheckCircle2 size={13} />
                              <span>{recentAction}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Sync status */}
                      <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-2 font-mono text-[11px]">
                        <span className="flex items-center gap-2 text-emerald-300">
                          <span className="relative flex h-2 w-2">
                            <span
                              className={`absolute h-full w-full rounded-full bg-emerald-400 ${
                                isSyncing ? "animate-ping" : ""
                              }`}
                            />
                            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                          {isSyncing ? "Sincronizando con Móvil…" : "Canal Web ↔ Móvil Sincronizado"}
                        </span>
                        <span className="text-slate-500">PostgreSQL</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "architecture" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-2 text-cyan-300 mb-2">
                          <Server size={15} />
                          <span className="font-bold">Backend: Django + REST API</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Lógica de negocio estructurada con Django REST Framework. Control de
                          permisos, endpoints modulares y serializadores para productos,
                          facturas y reportes contables.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-2 text-violet-300 mb-2">
                          <Database size={15} />
                          <span className="font-bold">Database: Supabase (PostgreSQL)</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Base de datos relacional robusta con soporte para suscripciones
                          en tiempo real, asegurando que cualquier cambio se refleje en la app
                          móvil de inmediato.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-2 text-emerald-300 mb-2">
                          <Smartphone size={15} />
                          <span className="font-bold">Frontend & Móvil</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Interfaz web optimizada y comunicación continua con la aplicación móvil
                          nativa para inventarios en punto de venta.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-2 text-emerald-300 mb-2">
                          <ShieldCheck size={16} />
                          <span className="font-bold">Autenticación & Roles</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Protección mediante tokens JWT y control de acceso basado en roles (RBAC)
                          para administradores, cajeros y auditores.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                        <div className="flex items-center gap-2 text-cyan-300 mb-2">
                          <Activity size={16} />
                          <span className="font-bold">Auditoría de Transacciones</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                          Trazabilidad completa: cada actualización de stock o factura queda
                          registrada con timestamp y usuario responsable para evitar fraudes.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </TiltCard>
    </section>
  );
}
