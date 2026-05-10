"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Node = {
  // World position in unit cube [-1, 1]
  x: number;
  y: number;
  z: number;
  // Drift velocity
  vx: number;
  vy: number;
  vz: number;
  // Pulse state (0–1) for occasional "data activity" highlight
  pulse: number;
  // Color tier: 0=cyan, 1=violet, 2=red, 3=green
  tier: 0 | 1 | 2 | 3;
};

type Pulse = {
  fromIdx: number;
  toIdx: number;
  /** Progress 0 → 1 along the line */
  t: number;
};

const NODE_COUNT = 56;
const CONNECTION_DIST = 0.55; // in unit-cube space
const MAX_CONNECTIONS_PER_NODE = 3;
const PULSE_SPAWN_PROBABILITY = 0.005; // per frame, per visible connection
const PULSE_SPEED = 0.022;
const TARGET_FPS = 30; // frame cap to keep CPU low across the whole page

const TIER_COLORS = ["#00E5FF", "#8B6CFF", "#FF0A1F", "#00FFA3"];

/**
 * Persistent full-page 3D data-network backdrop.
 *
 *   • 56 nodes drifting slowly in 3D space (perspective-projected)
 *   • Connection lines between nearby nodes (max 3 per node, anti-clutter)
 *   • Occasional "data pulses" travel from node to node along connections
 *   • Colors cycle: cyan, violet, red, green — Netflix + data palette
 *   • Renders at ~30fps to keep CPU minimal
 *   • Only animates when in viewport (IntersectionObserver pause)
 *   • Honors prefers-reduced-motion (renders static layout)
 *
 * Sits at z-index 0, behind all content (which is z-1+).
 */
export function GlobalDataBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let lastFrame = 0;
    const minFrameMs = 1000 / TARGET_FPS;
    let dpr = 1;
    let width = 0;
    let height = 0;
    let visible = true;
    const mouse = { x: 0, y: 0, active: false };

    // Generate nodes in 3D unit cube
    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 0.0008,
        vy: (Math.random() - 0.5) * 0.0008,
        vz: (Math.random() - 0.5) * 0.0008,
        pulse: 0,
        tier: (i % 4) as 0 | 1 | 2 | 3,
      });
    }

    // Compute static neighbor list (recomputed periodically)
    const neighbors: number[][] = [];
    let neighborTick = 0;
    const recomputeNeighbors = () => {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const candidates: { idx: number; dist: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d < CONNECTION_DIST) {
            candidates.push({ idx: j, dist: d });
          }
        }
        candidates.sort((a, b) => a.dist - b.dist);
        neighbors[i] = candidates.slice(0, MAX_CONNECTIONS_PER_NODE).map((c) => c.idx);
      }
    };
    recomputeNeighbors();

    // Active data pulses traveling along connections
    const pulses: Pulse[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4; // small parallax
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      mouse.active = true;
    };

    // Project 3D node → 2D screen coords
    const project = (n: Node) => {
      // Apply mouse parallax tilt
      const cosY = Math.cos(mouse.x);
      const sinY = Math.sin(mouse.x);
      const rx = n.x * cosY + n.z * sinY;
      const rz = -n.x * sinY + n.z * cosY;
      const cosX = Math.cos(mouse.y);
      const sinX = Math.sin(mouse.y);
      const ry = n.y * cosX - rz * sinX;
      const rzp = n.y * sinX + rz * cosX;

      const persp = 1 / (1 + (rzp + 1.5) * 0.25);
      const sx = width / 2 + rx * width * 0.42 * persp;
      const sy = height / 2 + ry * height * 0.42 * persp;
      return { sx, sy, depth: rzp, persp };
    };

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (ts - lastFrame < minFrameMs) return;
      lastFrame = ts;

      ctx.clearRect(0, 0, width, height);

      // Drift nodes (skip if reduced motion)
      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          n.z += n.vz;
          // Bounce within unit cube
          if (n.x < -1 || n.x > 1) n.vx *= -1;
          if (n.y < -1 || n.y > 1) n.vy *= -1;
          if (n.z < -1 || n.z > 1) n.vz *= -1;
          // Decay pulse
          n.pulse *= 0.93;
        }

        // Recompute neighbors every ~5 seconds (drift slowly changes proximity)
        neighborTick++;
        if (neighborTick > 150) {
          neighborTick = 0;
          recomputeNeighbors();
        }
      }

      // Project all nodes once
      const projected = nodes.map(project);

      // ── Spawn new pulses occasionally ──
      if (!reduced && pulses.length < 6) {
        for (let i = 0; i < nodes.length; i++) {
          for (const j of neighbors[i] ?? []) {
            if (Math.random() < PULSE_SPAWN_PROBABILITY) {
              pulses.push({ fromIdx: i, toIdx: j, t: 0 });
              break;
            }
          }
        }
      }

      // ── Draw connection lines ──
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (const j of neighbors[i] ?? []) {
          if (j <= i) continue; // draw each connection once
          const a = projected[i];
          const b = projected[j];
          const avgDepth = (a.depth + b.depth) / 2;
          const alpha = ((avgDepth + 1.5) / 3) * 0.18;
          if (alpha < 0.02) continue;

          const tier = nodes[i].tier;
          const color = TIER_COLORS[tier];
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const bb = parseInt(color.slice(5, 7), 16);

          ctx.strokeStyle = `rgba(${r},${g},${bb},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }

      // ── Animate + draw pulses ──
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        if (!reduced) pulse.t += PULSE_SPEED;
        if (pulse.t >= 1) {
          // Trigger receiver glow
          nodes[pulse.toIdx].pulse = 1;
          pulses.splice(p, 1);
          continue;
        }
        const a = projected[pulse.fromIdx];
        const b = projected[pulse.toIdx];
        const x = a.sx + (b.sx - a.sx) * pulse.t;
        const y = a.sy + (b.sy - a.sy) * pulse.t;
        const tier = nodes[pulse.fromIdx].tier;
        const color = TIER_COLORS[tier];
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const bb = parseInt(color.slice(5, 7), 16);

        // Glow halo around pulse
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 14);
        halo.addColorStop(0, `rgba(${r},${g},${bb},0.6)`);
        halo.addColorStop(1, `rgba(${r},${g},${bb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Bright dot
        ctx.fillStyle = `rgba(${r},${g},${bb},0.95)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Draw nodes ──
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = projected[i];
        const baseSize = 1.3 + ((n.z + 1) / 2) * 1.6;
        const size = baseSize + n.pulse * 4;
        const tier = n.tier;
        const color = TIER_COLORS[tier];
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const bb = parseInt(color.slice(5, 7), 16);
        const alpha = 0.4 + ((n.z + 1) / 2) * 0.45 + n.pulse * 0.3;

        // Pulse halo
        if (n.pulse > 0.05) {
          const ghalo = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 5);
          ghalo.addColorStop(0, `rgba(${r},${g},${bb},${0.4 * n.pulse})`);
          ghalo.addColorStop(1, `rgba(${r},${g},${bb},0)`);
          ctx.fillStyle = ghalo;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${r},${g},${bb},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Pause when tab/canvas not visible (perf)
    const onVisibility = () => {
      visible = !document.hidden;
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-50"
    />
  );
}
