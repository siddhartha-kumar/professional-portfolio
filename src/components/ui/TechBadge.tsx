"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getTechIcon, getConceptFallback } from "@/lib/icons";

type TechBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  size?: "sm" | "md";
  /** When true, render text-less circular icon (used in dense grids) */
  iconOnly?: boolean;
  /** Override visual style */
  variant?: "default" | "outline";
};

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3 py-1.5 text-sm gap-2",
} as const;

const iconSize = {
  sm: 12,
  md: 14,
} as const;

const variantStyles = {
  default: "bg-bg-elevated border-border-default text-text-secondary",
  outline:
    "bg-transparent border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
} as const;

export function TechBadge({
  name,
  size = "sm",
  iconOnly = false,
  variant = "default",
  className,
  ...props
}: TechBadgeProps) {
  const [imgError, setImgError] = React.useState(false);
  const icon = getTechIcon(name);
  const concept = getConceptFallback(name);

  const renderIcon = () => {
    if (icon && !imgError) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon.url}
          alt=""
          width={iconSize[size]}
          height={iconSize[size]}
          loading="lazy"
          referrerPolicy="no-referrer"
          decoding="async"
          onError={() => setImgError(true)}
          className="object-contain flex-shrink-0"
          style={{ width: iconSize[size], height: iconSize[size] }}
        />
      );
    }
    if (concept) {
      return <span aria-hidden className="text-[0.9em] leading-none">{concept}</span>;
    }
    return null;
  };

  if (iconOnly) {
    return (
      <span
        title={name}
        aria-label={name}
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-md",
          "bg-bg-elevated border border-border-default",
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-cyan/40",
          className
        )}
        {...props}
      >
        {icon && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon.url}
            alt={name}
            width={18}
            height={18}
            loading="lazy"
            referrerPolicy="no-referrer"
            decoding="async"
            onError={() => setImgError(true)}
            className="object-contain"
          />
        ) : (
          <span className="font-mono text-[10px] text-text-tertiary uppercase">
            {name.slice(0, 2)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-mono font-medium tracking-tight",
        "transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {renderIcon()}
      <span>{name}</span>
    </span>
  );
}
