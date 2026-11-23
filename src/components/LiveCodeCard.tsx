import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileCode2, RotateCcw, CheckCircle2, LoaderCircle } from "lucide-react";
import { liveCodeLines } from "@/data/portfolioData";

/**
 * Widget de simulación de código en vivo: escribe `JuanFeDev.config.ts`
 * carácter a carácter, con resaltado de sintaxis, cursor parpadeante
 * y líneas reactivas al cursor. Sustituye al avatar estático.
 */
export default function LiveCodeCard() {
  const flat = useMemo(
    () =>
      liveCodeLines.reduce<
        { tokens: (typeof liveCodeLines)[number]; start: number; length: number }[]
      >((lines, tokens) => {
        const length = tokens.reduce((acc, t) => acc + t.text.length, 0);
        const previous = lines[lines.length - 1];
        const start = previous ? previous.start + previous.length : 0;
        return [...lines, { tokens, start, length }];
      }, []),
    []
  );

  const totalChars = useMemo(
    () => flat.reduce((acc, line) => acc + line.length, 0),
    [flat]
  );

  const [visible, setVisible] = useState(0);
  const [runId, setRunId] = useState(0);
  const done = visible >= totalChars;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible((v) => {
        if (v >= totalChars) {
          window.clearInterval(interval);
          return v;
        }
        return Math.min(v + 2, totalChars);
      });
    }, 26);
    return () => window.clearInterval(interval);
  }, [totalChars, runId]);

  const replay = () => {
    setVisible(0);
    setRunId((n) => n + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.015 }}
      className="glass group relative overflow-hidden rounded-3xl shadow-2xl shadow-cyan-500/5 transition-colors duration-300 hover:border-cyan-500/40"
    >
      {/* Resplandor superior */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Barra de ventana */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 px-2.5 py-1 font-mono text-xs text-slate-300">
            <FileCode2 size={13} className="text-cyan-400" />
            JuanFeDev.config.ts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-300">
            TS
          </span>
          <button
            onClick={replay}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-cyan-300"
            aria-label="Reejecutar simulación de código"
            title="Reejecutar"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Código */}
      <div className="overflow-x-auto px-2 py-4 font-mono text-[13px] leading-6 sm:text-sm">
        {flat.map((line, lineIdx) => {
          const lineVisible = Math.max(
            0,
            Math.min(visible - line.start, line.length)
          );
          const caretOffset =
            !done && visible > line.start && visible <= line.start + line.length
              ? visible - line.start
              : null;
          let consumed = 0;
          return (
            <div
              key={lineIdx}
              className="flex rounded-lg px-2 transition-colors duration-150 hover:bg-cyan-500/5"
            >
              <span className="w-8 shrink-0 select-none text-right text-slate-600">
                {lineIdx + 1}
              </span>
              <span className="pl-4 whitespace-pre">
                {line.tokens.map((token, tokenIdx) => {
                  const before = consumed;
                  const remaining = lineVisible - before;
                  consumed += token.text.length;
                  if (remaining <= 0) return null;
                  const text = token.text.slice(0, remaining);
                  const caretHere =
                    caretOffset !== null &&
                    caretOffset > before &&
                    caretOffset <= consumed;
                  return (
                    <span key={tokenIdx} className={`tok-${token.className}`}>
                      {text}
                      {caretHere && (
                        <span className="caret-blink -mb-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-cyan-400" />
                      )}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Barra de estado */}
      <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5 font-mono text-xs">
        <span className="flex items-center gap-1.5">
          {done ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-emerald-400">
                compilado · disponible: true
              </span>
            </>
          ) : (
            <>
              <LoaderCircle size={13} className="animate-spin text-cyan-400" />
              <span className="text-slate-400">escribiendo configuración…</span>
            </>
          )}
        </span>
        <span className="hidden text-slate-600 sm:block">UTF-8 · TypeScript</span>
      </div>
    </motion.div>
  );
}