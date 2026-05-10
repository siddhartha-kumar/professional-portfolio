"use client";

import * as React from "react";
import { getTechIcon, getConceptFallback } from "@/lib/icons";
import { cn } from "@/lib/utils";

type TechIconProps = {
  name: string;
  size?: number;
  className?: string;
  /** Force the brand color background even when icon loads (useful for tiny icons) */
  branded?: boolean;
};

/**
 * Renders just the icon for a given tech/tool name.
 * Fallback chain:
 *   1. Simple Icons CDN logo (full color)
 *   2. Concept emoji (e.g. 🔄 for ETL)
 *   3. Brand-colored badge with the first letter (so it still looks branded)
 *   4. Neutral letter chip (only if no brand info exists at all)
 */
export function TechIcon({ name, size = 16, className, branded = false }: TechIconProps) {
  const [failed, setFailed] = React.useState(false);
  const icon = getTechIcon(name);
  const concept = getConceptFallback(name);

  // 2. Concept emoji fallback (no real logo)
  if (!icon && concept) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center select-none",
          className
        )}
        style={{ fontSize: size, lineHeight: 1, width: size, height: size }}
      >
        {concept}
      </span>
    );
  }

  // 3. Brand-colored letter badge (when icon URL fails OR when forced branded)
  if (!icon || failed || branded) {
    const letter = name.trim().charAt(0).toUpperCase();
    const bg = icon?.brandColor ?? "rgba(255,255,255,0.06)";
    const fg = icon ? "#FFFFFF" : "#C5CCD6";
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-[3px] font-display font-bold select-none flex-shrink-0",
          className
        )}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.55,
          background: bg,
          color: fg,
          boxShadow: icon ? `0 0 0 1px rgba(0,0,0,0.15) inset` : "none",
        }}
      >
        {letter}
      </span>
    );
  }

  // 1. Real logo from Simple Icons CDN
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon.url}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("inline-block flex-shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}

type TechChipProps = {
  name: string;
  size?: "sm" | "md";
  variant?: "default" | "outline" | "tinted";
  className?: string;
};

const chipSizeStyles = {
  sm: "px-2 py-1 text-[11px] gap-1.5",
  md: "px-3 py-1.5 text-xs gap-2",
} as const;

const chipVariantStyles = {
  default:
    "bg-bg-elevated/80 text-text-secondary border border-border-default hover:border-border-strong hover:text-text-primary",
  outline:
    "bg-transparent text-text-tertiary border border-border-default hover:text-text-secondary hover:border-border-strong",
  tinted:
    "bg-[rgba(0,212,255,0.08)] text-brand-cyan border border-[rgba(0,212,255,0.25)]",
} as const;

/** Tech chip with logo + name, used in project tech stacks. */
export function TechChip({
  name,
  size = "sm",
  variant = "default",
  className,
}: TechChipProps) {
  const iconSize = size === "sm" ? 14 : 16;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-mono font-medium tracking-tight transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap",
        chipSizeStyles[size],
        chipVariantStyles[variant],
        className
      )}
      title={name}
    >
      <TechIcon name={name} size={iconSize} />
      <span>{name}</span>
    </span>
  );
}

/**
 * Cinematic floating logo "pill" — used at the top of project cards.
 * Always shows a brand-colored badge so it never looks empty.
 */
export function TechBadge({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const iconSize = Math.round(size * 0.55);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md flex-shrink-0",
        "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/30",
        "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]",
        className
      )}
      style={{ width: size, height: size }}
      title={name}
      aria-label={name}
    >
      <TechIcon name={name} size={iconSize} />
    </span>
  );
}

type TechTileProps = {
  name: string;
  level?: "expert" | "advanced" | "proficient";
  className?: string;
};

const levelRing = {
  expert: "ring-2 ring-brand-red/50",
  advanced: "ring-1 ring-border-strong",
  proficient: "ring-1 ring-border-subtle",
} as const;

const levelLabel = {
  expert: "Expert",
  advanced: "Advanced",
  proficient: "Proficient",
} as const;

const levelColor = {
  expert: "text-brand-red",
  advanced: "text-text-secondary",
  proficient: "text-text-tertiary",
} as const;

/** Tile for showcasing a single skill — logo + name + proficiency. */
export function TechTile({ name, level = "advanced", className }: TechTileProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg",
        "bg-bg-surface/60 border border-border-subtle",
        "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:bg-bg-elevated hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
        "hover:border-[rgba(229,9,20,0.30)]",
        className
      )}
      title={`${name} — ${levelLabel[level]}`}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md bg-white",
          "transition-transform duration-300 group-hover:scale-110",
          levelRing[level]
        )}
      >
        <TechIcon name={name} size={22} />
      </div>
      <p className="font-display font-semibold text-[11px] text-text-primary text-center leading-tight line-clamp-2">
        {name}
      </p>
      <p
        className={cn(
          "font-mono text-[9px] uppercase tracking-wider",
          levelColor[level]
        )}
      >
        {levelLabel[level]}
      </p>
    </div>
  );
}
