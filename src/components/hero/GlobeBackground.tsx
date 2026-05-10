"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Point3D = { x: number; y: number; z: number };

const POINT_COUNT = 88; // points distributed on sphere surface
const CONNECTION_THRESHOLD = 0.55; // angular distance (radians) for line connections
const ROTATION_SPEED = 0.0035;

/**
 * 3D rotating wireframe globe — pure canvas, no Three.js dependency.
 *
 *   • 88 points distributed evenly via Fibonacci spiral
 *   • Y-axis auto-rotation + mouse parallax (X tilt + Y rotation offset)
 *   • Perspective projection — closer points are bigger and brighter
 *   • Lines drawn between angularly-close points (creates wireframe mesh)
 *   • Color gradient: cyan (front/top) → violet (back) → red (rim)
 *   • Honors prefers-reduced-motion (still renders, just doesn't auto-rotate)
 *
 * This is the cinematic data-network visualization in the hero background.
 */
export function GlobeBackground() {
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
    let rotY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // ── Generate Fibonacci-distributed points on a unit sphere ──
    const points: Point3D[] = [];
    const golden = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < POINT_COUNT; i++) {
      const theta = (2 * Math.PI * i) / golden;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / POINT_COUNT);
      points.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      });
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetTiltY = nx * 0.35;
      targetTiltX = -ny * 0.25;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.34;

      if (!reduced) rotY += ROTATION_SPEED;
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      const totalRotY = rotY + currentTiltY;
      const cosY = Math.cos(totalRotY);
      const sinY = Math.sin(totalRotY);
      const cosX = Math.cos(currentTiltX);
      const sinX = Math.sin(currentTiltX);

      // Project all points
      const projected = points.map((p) => {
        const rx = p.x * cosY + p.z * sinY;
        const rz1 = -p.x * sinY + p.z * cosY;
        const ry = p.y * cosX - rz1 * sinX;
        const rz = p.y * sinX + rz1 * cosX;
        const persp = 1 / (1 + (rz + 1) * 0.42);
        return {
          screenX: cx + rx * radius * persp,
          screenY: cy + ry * radius * persp,
          z: rz, // -1 (back) to 1 (front)
          y: p.y,
          origIdx: 0,
        };
      });
      projected.forEach((p, i) => (p.origIdx = i));

      // Sort by Z (back to front) so closer items overlap correctly
      projected.sort((a, b) => a.z - b.z);

      // ── Lines between angularly-close points ──
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const aP = points[a.origIdx];
          const bP = points[b.origIdx];
          const dot = aP.x * bP.x + aP.y * bP.y + aP.z * bP.z;
          const angDist = Math.acos(Math.max(-1, Math.min(1, dot)));
          if (angDist > CONNECTION_THRESHOLD) continue;

          const avgZ = (a.z + b.z) / 2;
          const depthAlpha = ((avgZ + 1) / 2) * 0.45;

          // Gradient: cyan (#00E5FF) → violet (#8B6CFF)
          const t = (a.y + b.y) / 4 + 0.5; // 0..1
          const r = Math.round(0 + (139 - 0) * t);
          const g = Math.round(229 + (108 - 229) * t);
          const bb = 255;

          ctx.strokeStyle = `rgba(${r}, ${g}, ${bb}, ${depthAlpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(a.screenX, a.screenY);
          ctx.lineTo(b.screenX, b.screenY);
          ctx.stroke();
        }
      }

      // ── Points ──
      for (const p of projected) {
        const depth = (p.z + 1) / 2; // 0=back 1=front
        const size = 1.2 + depth * 3.6;

        // Color: front points cyan, back points violet, top/bottom rim more red
        const yT = (p.y + 1) / 2;
        const r = Math.round(0 + (229 - 0) * (1 - depth) * 0.6 + (yT > 0.85 ? 100 : 0));
        const g = Math.round(229 - (229 - 108) * (1 - depth) * 0.5);
        const bb = 255;

        const alpha = 0.55 + depth * 0.45;

        // Halo glow on front-facing points
        if (depth > 0.6) {
          const halo = ctx.createRadialGradient(
            p.screenX,
            p.screenY,
            0,
            p.screenX,
            p.screenY,
            size * 4
          );
          halo.addColorStop(0, `rgba(${r}, ${g}, ${bb}, ${0.35 * depth})`);
          halo.addColorStop(1, `rgba(${r}, ${g}, ${bb}, 0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${bb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}
