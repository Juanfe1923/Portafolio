import { motion } from "framer-motion";
import { GraduationCap, Rocket, CheckCircle2, Sparkles, type LucideIcon } from "lucide-react";
import { timeline } from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";

const icons: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  rocket: Rocket,
};

export default function Timeline() {
  return (
    <section
      id="trayectoria"
      className="relative mx-auto w-full max-w-4xl px-5 pt-14 pb-20 sm:pt-16 sm:pb-24 sm:px-8 scroll-mt-14"
    >
      <SectionHeading
        eyebrow="// trayectoria & evolución"
        title="Formación y Carrera"
        subtitle="Hitos clave en la consolidación como desarrollador de software integral."
      />

      <div className="relative ml-4 sm:ml-8">
        {/* Línea vertical luminosa láser */}
        <div className="absolute top-3 bottom-3 left-0 w-[2px] bg-gradient-to-b from-cyan-400 via-violet-500 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />

        <div className="space-y-12">
          {timeline.map((entry, idx) => {
            const Icon = icons[entry.icon] ?? Rocket;
            return (
              <motion.div
                key={entry.title}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                className="relative pl-8 sm:pl-12"
              >
                {/* Nodo 3D luminoso interactivo */}
                <span className="absolute top-2 -left-[14px] flex h-[30px] w-[30px] items-center justify-center">
                  <span className="ping-soft absolute h-5 w-5 rounded-full bg-cyan-400/50" />
                  <span className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full border border-cyan-400/80 bg-[#070A12] text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                    <Icon size={14} />
                  </span>
                </span>

                <TiltCard
                  maxTilt={6}
                  glareColor={
                    idx === 0
                      ? "rgba(56, 189, 248, 0.12)"
                      : "rgba(168, 85, 247, 0.12)"
                  }
                  hoverSound
                >
                  <div className="glass group relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-slate-800/80 transition-all duration-300 hover:border-cyan-500/50 shadow-xl">
                    {/* Header: Period & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-cyan-300 ring-1 ring-cyan-500/30">
                        <Sparkles size={12} />
                        {entry.period}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                        {entry.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-extrabold text-slate-100 group-hover:text-cyan-200 transition-colors">
                      {entry.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                      {entry.description}
                    </p>

                    {/* Highlights pills */}
                    {entry.highlights && (
                      <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-slate-800/60">
                        {entry.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1 font-mono text-xs text-slate-400"
                          >
                            <CheckCircle2 size={12} className="text-cyan-400" />
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
