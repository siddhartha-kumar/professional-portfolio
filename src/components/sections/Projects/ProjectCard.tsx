"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { TechChip, TechBadge } from "@/components/ui/TechIcon";
import { useTilt } from "@/hooks/useTilt";
import { useSpotlight } from "@/hooks/useSpotlight";
import type { Project } from "@/content/projects";
import { cn, mergeRefs } from "@/lib/utils";

const accentMap = {
  cyan: {
    glow: "group-hover:shadow-[0_20px_60px_-12px_rgba(0,229,255,0.55)]",
    border: "group-hover:border-[rgba(0,229,255,0.6)]",
    arrow: "text-brand-cyan",
    overlay: "from-[rgba(0,229,255,0.22)] via-transparent to-transparent",
    spotlight: "cyan",
  },
  violet: {
    glow: "group-hover:shadow-[0_20px_60px_-12px_rgba(139,108,255,0.55)]",
    border: "group-hover:border-[rgba(139,108,255,0.6)]",
    arrow: "text-brand-violet",
    overlay: "from-[rgba(139,108,255,0.22)] via-transparent to-transparent",
    spotlight: "violet",
  },
  green: {
    glow: "group-hover:shadow-[0_20px_60px_-12px_rgba(0,255,163,0.55)]",
    border: "group-hover:border-[rgba(0,255,163,0.6)]",
    arrow: "text-brand-green",
    overlay: "from-[rgba(0,255,163,0.22)] via-transparent to-transparent",
    spotlight: "green",
  },
} as const;

type ProjectCardProps = {
  project: Project;
  onSelect: (project: Project) => void;
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const accent = accentMap[project.accentColor];
  const tiltRef = useTilt<HTMLButtonElement>({ max: 6, lift: 8, reset: 500 });
  const spotRef = useSpotlight<HTMLButtonElement>();

  return (
    <motion.button
      ref={mergeRefs(tiltRef, spotRef)}
      type="button"
      onClick={() => onSelect(project)}
      data-accent={accent.spotlight}
      className={cn(
        "spotlight-card group relative w-[88vw] xs:w-[85vw] sm:w-[420px] lg:w-[480px] flex-shrink-0",
        "snap-start text-left rounded-xl overflow-hidden",
        "bg-bg-surface border border-border-subtle",
        "transition-shadow duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        accent.border,
        accent.glow
      )}
      whileTap={{ scale: 0.98 }}
      aria-label={`${project.title} — ${project.tagline}`}
    >
      {/* Visual — gradient panel with project marker */}
      <div className="relative h-44 sm:h-52 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-base" />

        {/* Accent overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity duration-500",
            accent.overlay,
            "group-hover:opacity-100"
          )}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating tech logos cluster (top-left) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
          {project.techStack.slice(0, 5).map((t, i) => (
            <div
              key={t}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <TechBadge name={t} size={30} />
            </div>
          ))}
          {project.techStack.length > 5 && (
            <div className="w-[30px] h-[30px] rounded-md bg-bg-base/85 border border-border-default flex items-center justify-center font-mono text-[10px] text-text-tertiary backdrop-blur-sm font-bold">
              +{project.techStack.length - 5}
            </div>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <div className={cn("w-9 h-9 rounded-md flex items-center justify-center bg-bg-base/80 backdrop-blur border border-border-default", accent.arrow)}>
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Project title + period */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" size="sm" mono>
              {project.period}
            </Badge>
            <p className="font-mono text-[10px] text-text-tertiary tracking-wider uppercase truncate">
              {project.client}
            </p>
          </div>
          <h3 className="font-display font-bold text-2xl md:text-[1.7rem] leading-tight text-text-primary">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-5 min-h-[3.5rem]">
          {project.tagline}
        </p>

        {/* Tech stack chips with logos — first 4 */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <TechChip key={t} name={t} size="sm" />
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="outline" size="sm" mono>
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>

        {/* View details link */}
        <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-between">
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">
            View Architecture
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-300 group-hover:translate-x-1",
              accent.arrow
            )}
          >
            Open
            <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
