"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const BOOT_KEY = "sk_portfolio_booted";
const BOOT_LINES = [
  { delay: 0, text: "▸ Mission control online" },
  { delay: 280, text: "▸ Loading systems…" },
  { delay: 560, text: "▸ Connecting to data fabric" },
  { delay: 820, text: "▸ Calibrating interface" },
  { delay: 1080, text: "▸ Ready" },
];

/**
 * First-visit cinematic boot sequence (~1.5s).
 *   • Skipped if user prefers reduced motion
 *   • Skipped on subsequent visits (sessionStorage)
 *   • Click anywhere to skip
 */
export function BootSequence() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [revealed, setRevealed] = useState<number>(0);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(BOOT_KEY)) return;

    setShow(true);
    sessionStorage.setItem(BOOT_KEY, "1");

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => setRevealed(i + 1), line.delay)
      );
    });
    const closeTimer = setTimeout(() => setShow(false), 1700);
    timeouts.push(closeTimer);

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[9999] bg-bg-base flex items-center justify-center cursor-pointer"
          aria-hidden
        >
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px bg-brand-cyan/60 shadow-[0_0_12px_rgba(0,212,255,0.6)]"
            style={{
              animation: "scan-line 1.5s linear infinite",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Center brand mark */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 rounded-lg bg-gradient-brand flex items-center justify-center shadow-[0_0_48px_rgba(0,212,255,0.5)] mb-6"
            >
              <span className="font-display font-bold text-xl text-bg-base">
                SK
              </span>
            </motion.div>

            <div className="font-mono text-xs text-text-tertiary text-center min-w-[280px]">
              {BOOT_LINES.slice(0, revealed).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-brand-cyan/80"
                >
                  {line.text}
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-16 font-mono text-[10px] text-text-muted tracking-widest uppercase"
            >
              Click to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
