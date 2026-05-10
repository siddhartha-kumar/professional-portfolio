"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { stackCategories } from "@/content/stack";

type Node = {
  name: string;
  category: string;
  cx: number; // base center x (relative)
  cy: number; // base center y (relative)
  x: number; // current x
  y: number; // current y
  vx: number;
  vy: number;
  radius: number;
  level: "expert" | "advanced" | "proficient";
  hover: number; // 0–1 hover blend
  pulse: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  languages: "#00D4FF",
  aws: "#FF9F1C",
  "data-platforms": "#7B61FF",
  distributed: "#00FF88",
  engineering: "#FF6B9D",
  devops: "#A78BFA",
  analytics: "#4ECDC4",
};

const LEVEL_RADIUS = {
  expert: 7,
  advanced: 5.5,
  proficient: 4,
} as const;

/**
 * Interactive skill constellation:
 *   • Each skill is a node clustered by category.
 *   • Same-category nodes are connected by faint lines.
 *   • Slow organic drift.
 *   • Hover a node → highlights it + neighbors + connecting lines.
 *   • Honors prefers-reduced-motion (renders static layout).
 */
export function SkillConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let dpr = 1;
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999, in: false };
    let nodes: Node[] = [];

    const layout = () => {
      nodes = [];
      const categories = stackCategories;
      const categoryCount = categories.length;
      const baseRadius = Math.min(width, height) * 0.32;

      categories.forEach((cat, ci) => {
        const angle = (ci / categoryCount) * Math.PI * 2 - Math.PI / 2;
        const clusterCx = width / 2 + Math.cos(angle) * baseRadius;
        const clusterCy = height / 2 + Math.sin(angle) * baseRadius;

        cat.items.forEach((item, ii) => {
          const sub = (ii / cat.items.length) * Math.PI * 2;
          const r = 50 + Math.random() * 30;
          const x = clusterCx + Math.cos(sub) * r;
          const y = clusterCy + Math.sin(sub) * r;
          nodes.push({
            name: item.name,
            category: cat.id,
            cx: x,
            cy: y,
            x,
            y,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            radius: LEVEL_RADIUS[item.level ?? "advanced"],
            level: item.level ?? "advanced",
            hover: 0,
            pulse: Math.random() * Math.PI * 2,
          });
        });
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.in = true;
    };
    const onLeave = () => {
      mouse.in = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Find hovered node
      let hovered: Node | null = null;
      let minDist = Infinity;
      if (mouse.in) {
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 18 && d < minDist) {
            minDist = d;
            hovered = n;
          }
        }
      }

      // Update positions (drift + return to base)
      for (const n of nodes) {
        if (!reduced) {
          n.pulse += 0.02;
          n.x += n.vx + Math.sin(n.pulse) * 0.08;
          n.y += n.vy + Math.cos(n.pulse * 0.9) * 0.08;
          // Soft return to base
          n.x += (n.cx - n.x) * 0.005;
          n.y += (n.cy - n.y) * 0.005;
        }
        // Hover lerp
        const targetHover =
          hovered === n ||
          (hovered && hovered.category === n.category) ? 1 : 0;
        n.hover += (targetHover - n.hover) * 0.18;
      }

      // Draw lines (same category only)
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.category !== b.category) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 130) continue;
          const dim = Math.max(a.hover, b.hover);
          const baseAlpha = (1 - d / 130) * 0.12;
          const alpha = hovered
            ? baseAlpha * 0.3 + dim * 0.5
            : baseAlpha;
          const color = CATEGORY_COLORS[a.category] ?? "#00D4FF";
          ctx.strokeStyle = hexToRgba(color, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const color = CATEGORY_COLORS[n.category] ?? "#00D4FF";
        const isDimmed = hovered && n.hover < 0.1;
        const baseScale = 1 + n.hover * 0.6;
        const r = n.radius * baseScale;

        // Glow halo
        const haloR = r * (2.5 + n.hover * 1.5);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        grad.addColorStop(0, hexToRgba(color, isDimmed ? 0.05 : 0.35 + n.hover * 0.3));
        grad.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = hexToRgba(color, isDimmed ? 0.25 : 0.95);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight ring
        if (n.level === "expert") {
          ctx.strokeStyle = hexToRgba("#FFFFFF", isDimmed ? 0.1 : 0.4);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label — show on hover or always for expert
        const showLabel = n.hover > 0.05 || (!hovered && n.level === "expert");
        if (showLabel) {
          const labelAlpha = Math.max(n.hover, n.level === "expert" ? 0.5 : 0);
          ctx.font = "500 11px ui-sans-serif, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = hexToRgba("#FFFFFF", labelAlpha);
          ctx.fillText(n.name, n.x, n.y + r + 6);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <div className="relative w-full h-[560px] md:h-[640px] rounded-xl bg-bg-surface/40 border border-border-subtle overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-mono text-text-tertiary uppercase tracking-wider pointer-events-none">
        {stackCategories.map((cat) => (
          <span key={cat.id} className="inline-flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: CATEGORY_COLORS[cat.id] ?? "#00D4FF" }}
            />
            {cat.title}
          </span>
        ))}
      </div>

      {/* Hover hint */}
      <div className="absolute top-3 right-3 text-[10px] font-mono text-text-muted tracking-wider uppercase pointer-events-none">
        Hover a node
      </div>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}
