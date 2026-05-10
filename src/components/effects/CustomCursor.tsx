"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';

/**
 * Decorative cursor companion — adds a glowing accent that follows the
 * native cursor. The OS cursor stays visible (better usability + accessibility).
 *
 *   • Glow halo lerps to cursor (slight delay)
 *   • Inner accent dot snaps to cursor
 *   • Halo expands + brightens over interactive elements
 *   • Disabled on touch devices and when prefers-reduced-motion is set
 */
export function CustomCursor() {
  const haloRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setEnabled(true);

    const halo = haloRef.current;
    const dot = dotRef.current;
    if (!halo || !dot) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const haloPos = { x: target.x, y: target.y };
    let hovering = false;
    let pressing = false;
    let visible = false;

    const tick = () => {
      // Smooth lerp for halo
      haloPos.x += (target.x - haloPos.x) * 0.18;
      haloPos.y += (target.y - haloPos.y) * 0.18;

      const haloScale = pressing ? 0.7 : hovering ? 1.8 : 1;
      halo.style.transform = `translate3d(${haloPos.x}px, ${haloPos.y}px, 0) translate(-50%, -50%) scale(${haloScale})`;

      // Dot snaps directly to cursor
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%) scale(${pressing ? 0.6 : 1})`;

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        halo.style.opacity = "1";
        dot.style.opacity = "1";
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      hovering = !!(t && t.closest(INTERACTIVE_SELECTOR));
      halo.dataset.hovering = String(hovering);
    };

    const onDown = () => {
      pressing = true;
    };
    const onUp = () => {
      pressing = false;
    };

    const onLeaveWindow = () => {
      halo.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onEnterWindow = () => {
      halo.style.opacity = "1";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer glow halo — soft, follows with delay */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-12 h-12 rounded-full opacity-0 transition-opacity duration-200 data-[hovering=true]:bg-[radial-gradient(circle,rgba(0,212,255,0.45),rgba(0,212,255,0)_70%)] bg-[radial-gradient(circle,rgba(0,212,255,0.30),rgba(0,212,255,0)_70%)]"
        style={{ willChange: "transform, opacity" }}
      />
      {/* Inner accent dot — snaps to cursor */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,212,255,0.8)] opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform, opacity" }}
      />
    </>
  );
}
