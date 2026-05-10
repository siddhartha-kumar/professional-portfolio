"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getCompanyLogo } from "@/lib/icons";

type CompanyLogoProps = {
  name: string;
  domain?: string;
  size?: number;
  className?: string;
  /** Round vs square logo container */
  shape?: "rounded" | "circle" | "square";
};

const shapeStyles = {
  rounded: "rounded-lg",
  circle: "rounded-full",
  square: "rounded-none",
} as const;

export function CompanyLogo({
  name,
  domain,
  size = 48,
  className,
  shape = "rounded",
}: CompanyLogoProps) {
  const [error, setError] = React.useState(false);

  // Generate initials from company name
  const initials = name
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const showFallback = !domain || error;

  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center overflow-hidden",
        "bg-white border border-border-default shadow-sm",
        shapeStyles[shape],
        className
      )}
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <div
          className="flex items-center justify-center w-full h-full bg-gradient-to-br from-bg-elevated to-bg-surface"
          aria-label={name}
        >
          <span className="font-display font-bold text-text-primary" style={{ fontSize: size * 0.36 }}>
            {initials || "?"}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getCompanyLogo(domain, size <= 64 ? 64 : size <= 128 ? 128 : 256)}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          decoding="async"
          onError={() => setError(true)}
          className="object-contain p-1"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
}
