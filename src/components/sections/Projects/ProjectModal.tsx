"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { TechChip } from "@/components/ui/TechIcon";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const accentText = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  green: "text-brand-green",
} as const;

const accentBg = {
  cyan: "bg-[rgba(0,212,255,0.10)]",
  violet: "bg-[rgba(123,97,255,0.10)]",
  green: "bg-[rgba(0,255,136,0.10)]",
} as const;

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-${project.id}-title`}
            className="fixed inset-0 z-[101] flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-y-auto pointer-events-none"
          >
            <div className="w-full max-w-4xl pointer-events-auto">
              <div className="relative rounded-xl overflow-hidden bg-bg-surface border border-border-default shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close project details"
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-md flex items-center justify-center bg-bg-base/60 backdrop-blur border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Header band */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-base" />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-80",
                      accentBg[project.accentColor]
                    )}
                    style={{
                      maskImage:
                        "radial-gradient(ellipse at top left, black, transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-end">
                    <p
                      className={cn(
                        "font-mono text-[11px] tracking-[0.2em] uppercase mb-2",
                        accentText[project.accentColor]
                      )}
                    >
                      {project.client} · {project.clientType}
                    </p>
                    <h2
                      id={`project-${project.id}-title`}
                      className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-text-primary leading-tight pr-12"
                    >
                      {project.title}
                    </h2>
                    <p className="font-mono text-xs text-text-tertiary mt-2">
                      {project.period}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Tagline */}
                  <p className="text-lg text-text-primary leading-relaxed font-medium">
                    {project.tagline}
                  </p>

                  {/* Tech stack */}
                  <div>
                    <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-tertiary mb-3">
                      Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((t) => (
                        <TechChip key={t} name={t} size="md" />
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Problem */}
                    <div>
                      <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-state-error mb-3">
                        The Problem
                      </h3>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    {/* Approach */}
                    <div>
                      <h3
                        className={cn(
                          "font-mono text-[11px] tracking-[0.2em] uppercase mb-3",
                          accentText[project.accentColor]
                        )}
                      >
                        The Approach
                      </h3>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {project.approach}
                      </p>
                    </div>
                  </div>

                  {/* Decisions (optional) */}
                  {project.decisions && project.decisions.length > 0 && (
                    <div>
                      <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-tertiary mb-3">
                        Key Decisions
                      </h3>
                      <ul className="space-y-2">
                        {project.decisions.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed"
                          >
                            <span className={cn("mt-1.5 w-1 h-1 rounded-full flex-shrink-0", accentText[project.accentColor], "bg-current")} />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Outcomes */}
                  <div>
                    <h3 className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-green mb-3">
                      The Outcome
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {project.outcomes.map((o, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-md bg-bg-elevated border border-border-subtle"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-brand-green flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-text-secondary leading-relaxed">
                            {o}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 sm:px-8 py-4 border-t border-border-subtle flex items-center justify-between bg-bg-elevated/40">
                  <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-border-default text-text-secondary">ESC</kbd> to close
                  </span>
                  <a
                    href="#contact"
                    onClick={onClose}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-semibold hover:underline",
                      accentText[project.accentColor]
                    )}
                  >
                    Discuss this work
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
