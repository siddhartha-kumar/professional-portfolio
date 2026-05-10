"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-following spotlight hook.
 * Sets --spot-x / --spot-y CSS variables on the element on mousemove.
 * Pair with the `.spotlight-card` CSS class for a soft radial glow that
 * follows the cursor across the card surface (Vercel/Linear style).
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

  return ref;
}
