"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cinematic atmospheric overlays — pure CSS, GPU-accelerated, accessibility-aware.
 *
 *   1. Film grain  — animated noise texture, very low opacity (~3%)
 *   2. Vignette   — soft corner darkening for depth
 *   3. Scan-line  — subtle horizontal sweep every few seconds (CRT vibe)
 *
 * All layers sit at z-[5] so content (z-10+) stays interactive.
 * Pointer-events disabled on every layer.
 */
export function CinematicEffects() {
  const reduced = useReducedMotion();

  return (
    <>
      {/* ── 1. FILM GRAIN ────────────────────────────────────────────
         SVG fractal noise, animated by shifting position to give the
         "live grain" texture without re-rendering the SVG every frame. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
          animation: reduced ? "none" : "grain-shift 0.6s steps(6) infinite",
          willChange: "transform",
        }}
      />

      {/* ── 2. VIGNETTE ──────────────────────────────────────────────
         Soft corner darkening for depth and focus. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ── 3. AMBIENT SCAN LINES ────────────────────────────────────
         Faint horizontal lines for the analog/CRT-monitor cinematic feel.
         Static — no animation overhead. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[4] opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* ── 4. SUBTLE COLOR-GRADE WASH ───────────────────────────────
         Very faint red tint on edges — Netflix-style cinematic grading. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[4]"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(229,9,20,0.04), transparent 60%)",
        }}
      />

      {/* Inline keyframe — registered via style tag so we don't pollute globals */}
      <style>{`
        @keyframes grain-shift {
          0%   { transform: translate(0, 0); }
          20%  { transform: translate(-5%, 8%); }
          40%  { transform: translate(7%, -3%); }
          60%  { transform: translate(-3%, -7%); }
          80%  { transform: translate(4%, 5%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </>
  );
}
