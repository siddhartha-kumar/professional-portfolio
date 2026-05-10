"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type MagneticOptions = {
  /** Pull strength multiplier (default: 0.35) */
  strength?: number;
  /** Distance in px from center where magnetism activates (default: 80) */
  radius?: number;
  /** Reset duration in ms when leaving (default: 500) */
  reset?: number;
};

/**
 * Magnetic pull effect — element gravitates toward the cursor when nearby.
 * Pure transform, no layout shifts, accessibility-aware.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.35,
  radius = 80,
  reset = 500,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    let raf = 0;
    let bounds: DOMRect | null = null;

    const updateBounds = () => {
      bounds = el.getBoundingClientRect();
    };

    const onEnter = () => {
      updateBounds();
      el.style.willChange = "transform";
    };

    const onMove = (e: MouseEvent) => {
      if (!bounds) updateBounds();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!bounds) return;
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius * 2) return; // soft falloff

        const pull = Math.max(0, 1 - dist / (radius * 2)) * strength;
        el.style.transition = "transform 80ms ease-out";
        el.style.transform = `translate(${(dx * pull).toFixed(1)}px, ${(dy * pull).toFixed(1)}px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = `transform ${reset}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      el.style.transform = "translate(0, 0)";
      bounds = null;
    };

    el.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", updateBounds);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [strength, radius, reset, reduced]);

  return ref;
}
