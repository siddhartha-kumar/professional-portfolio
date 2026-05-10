"use client";

import { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { Section } from "@/components/ui/Section";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { TechTile } from "@/components/ui/TechIcon";
import { stackCategories } from "@/content/stack";
import { cn } from "@/lib/utils";
import { SkillConstellation } from "./SkillConstellation";

type View = "list" | "constellation";

export function Stack() {
  const [view, setView] = useState<View>("list");

  return (
    <Section id="stack">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-12 md:mb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-xs md:text-sm text-brand-red tracking-[0.2em] uppercase mb-4">
            05 / Tech Arsenal
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05] tracking-tight">
            The tools I trust in production.
          </h2>
          <p className="mt-6 text-lg md:text-xl text-text-tertiary leading-relaxed">
            Everything below has shipped in real systems — not just listed for keywords.
          </p>
        </div>

        {/* View toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-md bg-bg-surface border border-border-subtle">
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all",
              view === "list"
                ? "bg-bg-elevated text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <LayoutGrid size={12} />
            Grid
          </button>
          <button
            onClick={() => setView("constellation")}
            aria-pressed={view === "constellation"}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all",
              view === "constellation"
                ? "bg-bg-elevated text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <Network size={12} />
            Constellation
          </button>
        </div>
      </div>

      {view === "list" ? (
        <>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stackCategories.map((category) => (
              <StaggerItem key={category.id}>
                <div className="relative h-full rounded-xl p-5 bg-bg-surface border border-border-subtle hover:border-[rgba(229,9,20,0.20)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <div className="mb-4 pb-4 border-b border-border-subtle">
                    <h3 className="font-display font-bold text-base text-text-primary mb-1">
                      {category.title}
                    </h3>
                    <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                    {category.items.map((item) => (
                      <TechTile
                        key={item.name}
                        name={item.name}
                        level={item.level}
                      />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Legend */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-text-tertiary">
            <span className="font-mono uppercase tracking-wider">Proficiency:</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm ring-2 ring-brand-red/40 bg-bg-elevated" />
              <span className="font-mono text-brand-red">Expert</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm ring-1 ring-border-strong bg-bg-elevated" />
              <span className="font-mono text-text-secondary">Advanced</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm ring-1 ring-border-subtle bg-bg-elevated" />
              <span className="font-mono text-text-tertiary">Proficient</span>
            </span>
          </div>
        </>
      ) : (
        <SkillConstellation />
      )}
    </Section>
  );
}
