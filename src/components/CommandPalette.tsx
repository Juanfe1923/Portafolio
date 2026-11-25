import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Terminal,
  ExternalLink,
  Mail,
  Copy,
  Sparkles,
  Volume2,
  VolumeX,
  Code2,
  FolderGit2,
  X,
  Check,
} from "lucide-react";
import { profile } from "@/data/portfolioData";
import { soundManager } from "@/utils/audio";
import { scrollToSectionById } from "@/utils/scroll";

interface CommandItem {
  id: string;
  title: string;
  category: "Navegación" | "Acciones" | "Enlaces" | "Interactivo";
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  const items: CommandItem[] = useMemo(() => {
    const scrollToSection = (id: string) => {
      scrollToSectionById(id);
      onClose();
    };

    return [
      {
        id: "nav-inicio",
        title: "Ir al Inicio",
        category: "Navegación",
        icon: Terminal,
        shortcut: "G I",
        action: () => scrollToSection("inicio"),
      },
      {
        id: "nav-habilidades",
        title: "Ver Habilidades y Stack Tecnológico",
        category: "Navegación",
        icon: Code2,
        shortcut: "G H",
        action: () => scrollToSection("habilidades"),
      },
      {
        id: "nav-proyecto",
        title: "Explorar Proyecto Sigif (Showcase)",
        category: "Navegación",
        icon: FolderGit2,
        shortcut: "G P",
        action: () => scrollToSection("proyecto"),
      },
      {
        id: "nav-trayectoria",
        title: "Ver Trayectoria & Formación",
        category: "Navegación",
        icon: Terminal,
        shortcut: "G T",
        action: () => scrollToSection("trayectoria"),
      },
      {
        id: "nav-contacto",
        title: "Ir a Contacto",
        category: "Navegación",
        icon: Mail,
        shortcut: "G C",
        action: () => scrollToSection("contacto"),
      },
      {
        id: "act-copy-email",
        title: "Copiar correo electrónico",
        category: "Acciones",
        icon: Copy,
        action: () => {
          navigator.clipboard.writeText(profile.email);
          soundManager.playSuccess();
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            onClose();
          }, 1500);
        },
      },
      {
        id: "act-sigif-demo",
        title: "Abrir demo en vivo de Sigif",
        category: "Enlaces",
        icon: ExternalLink,
        action: () => {
          window.open("https://sigif-final.vercel.app/", "_blank");
          onClose();
        },
      },
      {
        id: "act-github",
        title: "Ver perfil de GitHub (@juanfe1923)",
        category: "Enlaces",
        icon: ExternalLink,
        action: () => {
          window.open(profile.github, "_blank");
          onClose();
        },
      },
      {
        id: "act-toggle-sound",
        title: soundEnabled ? "Silenciar efectos sonoros" : "Activar efectos sonoros sci-fi",
        category: "Interactivo",
        icon: soundEnabled ? VolumeX : Volume2,
        action: async () => {
          const next = await soundManager.toggle();
          setSoundEnabled(next);
        },
      },
      {
        id: "act-warp-sound",
        title: "Lanzar pulso cuántico de sonido",
        category: "Interactivo",
        icon: Sparkles,
        action: async () => {
          if (!soundManager.isEnabled()) {
            const next = await soundManager.toggle();
            setSoundEnabled(next);
          }
          soundManager.playWarp();
        },
      },
    ];
  }, [onClose, soundEnabled]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        soundManager.playHover();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundManager.playHover();
        setSelectedIndex((prev) =>
          prev === 0 ? (filtered.length || 1) - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-28">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0B0F19] shadow-2xl shadow-cyan-500/10"
          >
            {/* Top Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 px-4 py-3.5">
              <Search size={18} className="text-cyan-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe un comando o busca algo… (ej: contacto, sigif, react)"
                className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={15} />
                </button>
              )}
              <span className="hidden sm:inline-block rounded-md border border-slate-700/60 bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                ESC
              </span>
            </div>

            {/* Notification if copied */}
            {copied && (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 py-2 font-mono text-xs text-emerald-300">
                <Check size={14} /> Correo copiado exitosamente al portapapeles
              </div>
            )}

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center font-mono text-xs text-slate-500">
                  No se encontraron comandos para &quot;{query}&quot;
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundManager.playClick();
                          item.action();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left transition-all ${
                          isSelected
                            ? "bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-sm"
                            : "text-slate-300 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-cyan-500 text-slate-950"
                                : "bg-slate-800/80 text-slate-400"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="font-mono text-[10px] text-slate-500">
                              {item.category}
                            </p>
                          </div>
                        </div>

                        {item.shortcut && (
                          <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5 font-mono text-[11px] text-slate-500 bg-slate-950/50">
              <span className="flex items-center gap-2">
                <span>↑↓ para navegar</span>
                <span>·</span>
                <span>↵ para ejecutar</span>
              </span>
              <span className="text-cyan-400/80">JuanFe Dev Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
