"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  /** Primary image source (e.g. /sidd.jpg). Falls back to fallbackSrc if it 404s. */
  src?: string;
  /** Secondary fallback (e.g. GitHub avatar URL). Used if primary fails. */
  fallbackSrc?: string;
  name: string;
  size?: number;
  className?: string;
  /** Add status pulse dot in corner */
  status?: "online" | "active" | null;
  /** When true, ignore `size` and let parent CSS dictate dimensions */
  fillParent?: boolean;
};

export function Avatar({
  src,
  fallbackSrc,
  name,
  size = 40,
  className,
  status = null,
  fillParent = false,
}: AvatarProps) {
  // Try primary first, then fallback, then initials
  const candidates = [src, fallbackSrc].filter(Boolean) as string[];
  const [idx, setIdx] = React.useState(0);
  const exhausted = idx >= candidates.length;
  const currentSrc = candidates[idx];

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Detect className that requests parent-fill (presence of !w- or !h-)
  const stretching = fillParent || /\b!?w-full|!?h-full|\b!w-/.test(className ?? "");
  const sizeStyle = stretching ? undefined : { width: size, height: size };

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={sizeStyle}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-full overflow-hidden",
          "ring-2 ring-brand-red/50 shadow-[0_0_24px_rgba(229,9,20,0.30)]",
          "transition-all duration-300 hover:ring-brand-red/80 hover:shadow-[0_0_32px_rgba(229,9,20,0.55)]"
        )}
      >
        {exhausted ? (
          <div
            className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-red via-[#B30710] to-brand-violet"
            aria-label={name}
          >
            <span
              className="font-display font-bold text-white"
              style={{ fontSize: stretching ? "min(42cqi, 96px)" : size * 0.42 }}
            >
              {initials}
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentSrc}
            src={currentSrc}
            alt={name}
            loading="eager"
            referrerPolicy="no-referrer"
            decoding="async"
            onError={() => setIdx((i) => i + 1)}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {status && (
        <span
          aria-label={status === "online" ? "Online" : "Active"}
          className="absolute bottom-0 right-0 flex w-2.5 h-2.5"
        >
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-glow",
              status === "online" ? "bg-brand-green" : "bg-brand-red"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2.5 w-2.5 ring-2 ring-bg-base",
              status === "online" ? "bg-brand-green" : "bg-brand-red"
            )}
          />
        </span>
      )}
    </div>
  );
}
