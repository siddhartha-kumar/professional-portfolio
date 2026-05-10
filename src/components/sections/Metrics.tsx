"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { metrics } from "@/content/metrics";
import { AnimatedCounter } from "./AnimatedCounter";
import { useTilt } from "@/hooks/useTilt";
import { useSpotlight } from "@/hooks/useSpotlight";
import { cn, mergeRefs } from "@/lib/utils";

const colorClass = {
  cyan: {
    text: "text-brand-cyan",
    glow: "hover:shadow-[0_0_48px_rgba(0,229,255,0.30)]",
    border: "hover:border-[rgba(0,229,255,0.50)]",
    accent: "from-[rgba(0,229,255,0.20)] to-transparent",
    spotlight: "cyan",
  },
  violet: {
    text: "text-brand-violet",
    glow: "hover:shadow-[0_0_48px_rgba(139,108,255,0.30)]",
    border: "hover:border-[rgba(139,108,255,0.50)]",
    accent: "from-[rgba(139,108,255,0.20)] to-transparent",
    spotlight: "violet",
  },
  green: {
    text: "text-brand-green",
    glow: "hover:shadow-[0_0_48px_rgba(0,255,163,0.30)]",
    border: "hover:border-[rgba(0,255,163,0.50)]",
    accent: "from-[rgba(0,255,163,0.20)] to-transparent",
    spotlight: "green",
  },
} as const;

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const color = colorClass[metric.color];
  const tiltRef = useTilt<HTMLDivElement>({ max: 5, lift: 6, reset: 450 });
  const spotRef = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={mergeRefs(tiltRef, spotRef)}
      data-accent={color.spotlight}
      className={cn(
        "spotlight-card relative h-full rounded-lg p-5 sm:p-6 md:p-8",
        "bg-bg-surface border border-border-subtle",
        "transition-shadow duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        color.border,
        color.glow
      )}
    >
      {/* Subtle accent gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-50 rounded-lg pointer-events-none bg-gradient-to-br",
          color.accent
        )}
        style={{
          maskImage: "radial-gradient(ellipse at top right, black, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div
          className={cn(
            "font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-3 md:mb-4",
            color.text
          )}
          style={{ textShadow: "0 0 24px currentColor" }}
        >
          <AnimatedCounter
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
          />
        </div>
        <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg text-text-primary mb-1.5 md:mb-2">
          {metric.label}
        </h3>
        <p className="text-xs sm:text-sm text-text-tertiary leading-snug mt-auto">
          {metric.description}
        </p>
      </div>
    </div>
  );
}

export function Metrics() {
  return (
    <Section id="metrics">
      <SectionHeader
        eyebrow="02 / Impact"
        title="Numbers that ship."
        description="Every metric below ran in production. None of them are estimates."
      />

      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {metrics.map((m) => (
          <StaggerItem key={m.id}>
            <MetricCard metric={m} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
