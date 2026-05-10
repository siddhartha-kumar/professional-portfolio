"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type CardVariant = "surface" | "elevated" | "feature";

type CardProps = HTMLMotionProps<"div"> & {
  variant?: CardVariant;
  hoverable?: boolean;
  children: React.ReactNode;
};

const variantStyles: Record<CardVariant, string> = {
  surface:
    "bg-bg-surface/80 border border-border-subtle backdrop-blur-sm",
  elevated:
    "bg-bg-surface border border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
  feature:
    "bg-bg-surface/90 border border-border-default backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
};

const hoverStyles =
  "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,212,255,0.4)] hover:-translate-y-1";

export function Card({
  variant = "elevated",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-lg p-6 md:p-8 relative overflow-hidden",
        variantStyles[variant],
        hoverable && hoverStyles,
        className
      )}
      {...props}
    >
      {variant === "feature" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(0,212,255,0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(123,97,255,0.10), transparent 50%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
