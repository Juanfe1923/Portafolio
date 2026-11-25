import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  FileCode2,
  Palette,
  LayoutGrid,
  Terminal,
  Hexagon,
  Braces,
  Server,
  Network,
  Database,
  DatabaseZap,
  Leaf,
  GitBranch,
  Container,
  Send,
  Monitor,
  ServerCog,
  Wrench,
  Sparkles,
  Layers,
  Cpu,
  Smartphone,
  Code2,
  type LucideIcon,
} from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import {
  skillCategories,
  type SkillCategory,
  type SkillItem,
} from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import TiltCard from "./TiltCard";
import { Mini3DBadge, FilteredCategory3DSpotlight } from "./SkillMini3D";
import { soundManager } from "@/utils/audio";

type IconComponent = ComponentType<{
  size?: number | string;
  className?: string;
}>;

const itemIcons: Record<string, IconComponent> = {
  atom: Atom,
  "file-code": FileCode2,
  palette: Palette,
  layout: LayoutGrid,
  terminal: Terminal,
  hexagon: Hexagon,
  braces: Braces,
  server: Server,
  network: Network,
  database: Database,
  "database-zap": DatabaseZap,
  leaf: Leaf,
  "git-branch": GitBranch,
  github: GithubIcon,
  container: Container,
  send: Send,
  smartphone: Smartphone,
  "code-2": Code2,
};

const categoryIcons: Record<string, LucideIcon> = {
  Frontend: Monitor,
  Backend: ServerCog,
  "Bases de Datos": Database,
  Herramientas: Wrench,
  "Mobile & Multiplataforma": Smartphone,
};

const accents: Record<
  SkillCategory["accent"],
  {
    chip: string;
    border: string;
    glow: string;
    text: string;
    bar: string;
    badge: string;
  }
> = {
  cyan: {
    chip: "from-cyan-400 to-sky-500",
    border: "border-cyan-500/40 hover:border-cyan-400/80",
    glow: "bg-cyan-500/15",
    text: "text-cyan-300",
    bar: "from-cyan-500 to-sky-400",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  violet: {
    chip: "from-violet-400 to-purple-500",
    border: "border-violet-500/40 hover:border-violet-400/80",
    glow: "bg-violet-500/15",
    text: "text-violet-300",
    bar: "from-violet-500 to-purple-400",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  },
  emerald: {
    chip: "from-emerald-400 to-teal-500",
    border: "border-emerald-500/40 hover:border-emerald-400/80",
    glow: "bg-emerald-500/15",
    text: "text-emerald-300",
    bar: "from-emerald-500 to-teal-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  sky: {
    chip: "from-sky-400 to-indigo-500",
    border: "border-sky-500/40 hover:border-sky-400/80",
    glow: "bg-sky-500/15",
    text: "text-sky-300",
    bar: "from-sky-500 to-indigo-400",
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  },
};

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(
    skillCategories[0].items[0]
  );

  const filterTabs = [
    { id: "all", label: "Todos los Campos" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "databases", label: "Bases de Datos" },
    { id: "tools", label: "Herramientas" },
    { id: "mobile", label: "Mobile" },
  ];

  const filteredCategories =
    activeFilter === "all"
      ? skillCategories
      : skillCategories.filter((c) => c.id === activeFilter);

  const handleFilterChange = (tabId: string) => {
    soundManager.playClick();
    setActiveFilter(tabId);
    if (tabId !== "all") {
      const cat = skillCategories.find((c) => c.id === tabId);
      if (cat && !cat.items.some((i) => i.name === selectedSkill.name)) {
        setSelectedSkill(cat.items[0]);
      }
    }
  };

  const handleSelectSkill = (skill: SkillItem) => {
    soundManager.playClick();
    setSelectedSkill(skill);
  };

  return (
    <section
      id="habilidades"
      className="relative mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:pt-16 sm:pb-24 sm:px-8 scroll-mt-14"
    >
      <SectionHeading
        eyebrow="// stack & arquitectura 3d"
        title="Habilidades y Conocimientos"
        subtitle="Ecosistema tecnológico integral: interfaces modernas, servicios backend resilientes y persistencia optimizada."
      />

      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`relative rounded-2xl px-4 py-2 font-mono text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "text-slate-950 shadow-lg shadow-cyan-500/25"
                  : "glass text-slate-400 hover:text-slate-100 hover:border-cyan-500/40"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="skills-pill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bento Grid: Categories + Live Tech Inspector */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categories (2 Columns in lg) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category, idx) => {
              const accent = accents[category.accent];
              const CategoryIcon = categoryIcons[category.title] ?? Monitor;

              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <TiltCard
                    maxTilt={8}
                    glareColor={
                      category.accent === "cyan"
                        ? "rgba(56, 189, 248, 0.15)"
                        : category.accent === "violet"
                        ? "rgba(168, 85, 247, 0.15)"
                        : "rgba(52, 211, 153, 0.15)"
                    }
                    className="h-full"
                  >
                    <article
                      className={`glass group/card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 transition-colors duration-300 ${accent.border}`}
                    >
                      {/* Glow background */}
                      <div
                        className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full ${accent.glow} blur-3xl opacity-70`}
                      />

                      <div>
                        {/* Header + Mini 3D Cube */}
                        <div
                          className="flex items-start justify-between gap-2"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.chip} text-slate-950 shadow-md transition-transform duration-300 group-hover/card:scale-105`}
                            >
                              <CategoryIcon size={20} strokeWidth={2.4} />
                            </span>
                            <div>
                              <h3 className="text-lg font-bold text-slate-100">
                                {category.title}
                              </h3>
                              <p className="text-xs text-slate-400">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          <Mini3DBadge accent={category.accent} />
                        </div>

                        {/* Interactive Skill Chips */}
                        <div
                          className="mt-5 flex flex-wrap gap-2"
                          style={{ transform: "translateZ(14px)" }}
                        >
                          {category.items.map((skill) => {
                            const Icon = itemIcons[skill.icon] ?? Braces;
                            const isSelected = selectedSkill.name === skill.name;

                            return (
                              <button
                                key={skill.name}
                                onClick={() => handleSelectSkill(skill)}
                                onMouseEnter={() => soundManager.playHover()}
                                className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all duration-200 ${
                                  isSelected
                                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105"
                                    : "border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:text-slate-100 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
                                }`}
                              >
                                <Icon
                                  size={13}
                                  className={
                                    isSelected ? "text-cyan-300" : "text-slate-400"
                                  }
                                />
                                <span>{skill.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Category Badge */}
                      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-500">
                        <span>{category.items.length} Tecnologías activas</span>
                        <span className={accent.text}>✦ Certificado ADSO</span>
                      </div>
                    </article>
                  </TiltCard>
                </motion.div>
              );
            })}

            {activeFilter !== "all" && filteredCategories.length === 1 && (
              <FilteredCategory3DSpotlight
                category={filteredCategories[0]}
                selectedSkill={selectedSkill}
                onSelectSkill={handleSelectSkill}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Live Tech Inspector & Architecture Panel (1 Column in lg) */}
        <div className="lg:col-span-1">
          <TiltCard
            maxTilt={6}
            glareColor="rgba(56, 189, 248, 0.15)"
            className="h-full"
          >
            <div className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/40 p-6 shadow-xl shadow-cyan-500/5">
              {/* Resplandor superior */}
              <div className="pointer-events-none absolute -top-20 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                      <Cpu size={15} />
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      INSPECTOR TÉCNICO
                    </span>
                  </div>
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                    INTERACTIVO
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-50">
                      {selectedSkill.name}
                    </span>
                    <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-[11px] text-cyan-300">
                      {selectedSkill.tag}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {selectedSkill.detail}
                  </p>

                  {/* Architectural Impact */}
                  <div className="mt-6 space-y-2 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Sparkles size={13} className="text-cyan-400" />
                      <span>Listo para Producción</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Implementado en proyectos reales con buenas prácticas, testing
                      y código estructurado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-500">
                <span>Haz clic en otra tecnología</span>
                <Layers size={13} className="text-cyan-400" />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
