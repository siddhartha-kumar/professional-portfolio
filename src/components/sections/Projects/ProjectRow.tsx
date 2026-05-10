"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

type ProjectRowProps = {
  title: string;
  description: string;
  projects: Project[];
  onSelect: (project: Project) => void;
};

export function ProjectRow({ title, description, projects, onSelect }: ProjectRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-end justify-between mb-6 gap-6">
        <div>
          <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-tertiary">{description}</p>
        </div>

        {/* Scroll arrow buttons (desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center border transition-all",
              canScrollLeft
                ? "border-border-default text-text-primary hover:border-brand-cyan hover:bg-bg-elevated"
                : "border-border-subtle text-text-muted cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center border transition-all",
              canScrollRight
                ? "border-border-default text-text-primary hover:border-brand-cyan hover:bg-bg-elevated"
                : "border-border-subtle text-text-muted cursor-not-allowed opacity-40"
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div className="relative -mx-6 md:-mx-12 xl:-mx-24">
        {/* Edge fades */}
        {canScrollLeft && (
          <div className="hidden md:block absolute left-0 top-0 bottom-3 w-12 z-10 bg-gradient-to-r from-bg-base to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="hidden md:block absolute right-0 top-0 bottom-3 w-12 z-10 bg-gradient-to-l from-bg-base to-transparent pointer-events-none" />
        )}

        <div
          ref={scrollerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-6 md:px-12 xl:px-24"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
