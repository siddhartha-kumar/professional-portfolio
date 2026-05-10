"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type TiltOptions = {
  /** Max rotation in degrees (default: 8) */
  max?: number;
  /** Z-axis lift in pixels on hover (default: 12) */
  lift?: number;
  /** Animation easing duration in ms when leaving (default: 400) */
  reset?: number;
  /** Disable on touch devices (default: true) */
  touchDisable?: boolean;
};

/**
 * Premium 3D tilt effect that follows the cursor.
 * Pure CSS transforms via requestAnimationFrame — no library, no jank.
 * Honors prefers-reduced-motion and skips on touch.
 */
export function useTilt<T extends HTMLElement = HTMLElement>({
  max = 8,
  lift = 12,
  reset = 400,
  touchDisable = true,
}: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    if (touchDisable && typeof window !== "undefined" && "ontouchstart" in window) {
      // Touch device — skip
      return;
    }

    let raf = 0;
    let bounds: DOMRect | null = null;

    const updateBounds = () => {
      bounds = el.getBoundingClientRect();
    };

    const onEnter = () => {
      updateBounds();
      el.style.transition = "transform 100ms ease-out";
      el.style.transformStyle = "preserve-3d";
      el.style.willChange = "transform";
    };

    const onMove = (e: MouseEvent) => {
      if (!bounds) updateBounds();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!bounds) return;
        // Normalize to [-0.5, 0.5]
        const x = (e.clientX - bounds.left) / bounds.width - 0.5;
        const y = (e.clientY - bounds.top) / bounds.height - 0.5;
        const rotY = x * max * 2;
        const rotX = -y * max * 2;
        el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${lift}px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = `transform ${reset}ms cubic-bezier(0.32, 0.72, 0, 1)`;
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      bounds = null;
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", updateBounds);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [max, lift, reset, reduced, touchDisable]);

  return ref;
}
