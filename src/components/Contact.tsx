"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Copy,
  Check,
  Send,
  MapPin,
  Sparkles,
  Clock,
  ExternalLink,
  MessageSquare,
  Shield,
} from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import { profile } from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import { soundManager } from "@/utils/audio";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [medellinTime, setMedellinTime] = useState("");

  // Live Medellín local time updater
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("es-CO", {
          timeZone: "America/Bogota",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setMedellinTime(formatter.format(now));
      } catch {
        setMedellinTime("10:00 AM (UTC-5)");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyEmail = async () => {
    soundManager.playSuccess();
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = profile.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundManager.playSuccess();
    const subject = encodeURIComponent(
      `Contacto portafolio — ${form.name || "Sin nombre"}`
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 6000);
  };

  const inputClasses =
    "w-full rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25";

  return (
    <section
      id="contacto"
      className="relative mx-auto w-full max-w-6xl px-5 pt-14 pb-28 sm:pt-16 sm:pb-32 sm:px-8 scroll-mt-14"
    >
      <SectionHeading
        eyebrow="// canales & comunicación directa"
        title="Iniciemos una Conversación"
        subtitle="¿Tienes una propuesta laboral, proyecto en mente o consulta técnica? Estoy disponible para conectar."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* Columna de Canales Directos e Información */}
        <TiltCard maxTilt={5} glareColor="rgba(56, 189, 248, 0.12)">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 border border-slate-800/80 transition-colors duration-300 hover:border-cyan-500/50 shadow-2xl"
          >
            {/* Resplandor decorativo */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />

            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-slate-950 shadow-md">
                  <Sparkles size={22} />
                </span>

                {/* Local time badge */}
                <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 font-mono text-[11px] text-slate-300">
                  <Clock size={12} className="text-cyan-400" />
                  <span>Medellín: {medellinTime || "UTC-5"}</span>
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-100">
                Construyamos el siguiente nivel
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-300/90">
                Disponible para integrarme a equipos de tecnología de alto impacto o
                desarrollar aplicaciones completas como desarrollador Full Stack.
              </p>

              {/* Security & Reliability tag */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-mono text-emerald-300">
                <Shield size={14} />
                <span>Tiempo de respuesta estimado: Menos de 24 horas</span>
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              {/* Copiar Correo con Botón Interactivo */}
              <div>
                <p className="mb-1.5 font-mono text-xs text-slate-400 uppercase tracking-wider">
                  Correo Electrónico Directo
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={() => soundManager.playHover()}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-300 transition-colors duration-200 hover:border-cyan-500/50 hover:text-cyan-300"
                  >
                    <Mail size={16} className="shrink-0 text-cyan-400" />
                    <span className="truncate font-mono">{profile.email}</span>
                  </a>
                  <button
                    onClick={copyEmail}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 ${
                      copied
                        ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20"
                        : "border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300"
                    }`}
                    aria-label="Copiar correo electrónico"
                    title="Copiar correo"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <AnimatePresence>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs font-semibold text-emerald-400 font-mono"
                    >
                      ¡Correo copiado al portapapeles!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* GitHub Link */}
              <div>
                <p className="mb-1.5 font-mono text-xs text-slate-400 uppercase tracking-wider">
                  Repositorios & Código
                </p>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playHover()}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-300 transition-all duration-200 hover:border-violet-500/50 hover:text-violet-300"
                >
                  <div className="flex items-center gap-3">
                    <GithubIcon size={18} className="text-violet-400" />
                    <span className="font-mono">github.com/{profile.githubUser}</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-500" />
                </a>
              </div>
            </div>
          </motion.div>
        </TiltCard>

        {/* Formulario de Contacto Interactivo */}
        <TiltCard maxTilt={5} glareColor="rgba(168, 85, 247, 0.12)">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 border border-slate-800/80 transition-colors duration-300 hover:border-violet-500/40 shadow-2xl"
          >
            {/* Resplandor decorativo */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />

            <div>
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <MessageSquare size={16} className="text-cyan-400" />
                <span className="font-mono text-xs font-bold text-slate-200">
                  FORMULARIO DE CONTACTO RÁPIDO
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block font-mono text-xs font-semibold text-slate-400 uppercase"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre o empresa"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-mono text-xs font-semibold text-slate-400 uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="message"
                    className="font-mono text-xs font-semibold text-slate-400 uppercase"
                  >
                    Mensaje
                  </label>
                  <span className="font-mono text-[10px] text-slate-500">
                    {form.message.length} caracteres
                  </span>
                </div>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Detalles sobre tu propuesta, oportunidad laboral o idea de proyecto…"
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                onClick={() => soundManager.playClick()}
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 sm:w-auto"
              >
                <span>Enviar Mensaje</span>
                <Send
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-xs font-semibold text-emerald-400 font-mono"
                  >
                    ¡Listo! Se abrió tu cliente de correo con el mensaje preparado.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </TiltCard>
      </div>

      {/* Footer Tecnológico */}
      <footer className="mt-24 border-t border-slate-800/70 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <p className="font-mono text-xs">
            © 2026{" "}
            <span className="font-bold text-slate-200">{profile.name}</span>.
            Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <MapPin size={14} className="text-cyan-400" />
            <span>Medellín, Colombia · Full Stack Engineer</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/40 pt-4 font-mono text-[11px] text-slate-500">
          <p>Next.js 16 · React 19 · Three.js 3D · Tailwind CSS · Turbopack</p>
          <p className="text-cyan-400/80">Código Modular · Alto Rendimiento</p>
        </div>
      </footer>
    </section>
  );
}
