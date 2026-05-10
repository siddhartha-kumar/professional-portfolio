import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "cyan" | "violet" | "green" | "outline";
type BadgeSize = "sm" | "md";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  mono?: boolean;
};

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-bg-elevated text-text-secondary border border-border-default",
  cyan: "bg-[rgba(0,212,255,0.10)] text-brand-cyan border border-[rgba(0,212,255,0.30)]",
  violet:
    "bg-[rgba(123,97,255,0.10)] text-brand-violet border border-[rgba(123,97,255,0.30)]",
  green:
    "bg-[rgba(0,255,136,0.10)] text-brand-green border border-[rgba(0,255,136,0.30)]",
  outline:
    "bg-transparent text-text-tertiary border border-border-default hover:border-border-strong hover:text-text-secondary",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  variant = "default",
  size = "sm",
  mono = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-200",
        variantStyles[variant],
        sizeStyles[size],
        mono && "font-mono tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
