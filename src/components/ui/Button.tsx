"use client";

import * as React from "react";
import Link from "next/link";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  /** Add magnetic cursor pull (default: true for primary) */
  magnetic?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
    external?: never;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 font-display font-semibold transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-brand-red shadow-[0_4px_24px_rgba(229,9,20,0.40)] hover:bg-[#F40612] hover:shadow-[0_8px_32px_rgba(229,9,20,0.65)]",
  ghost:
    "text-text-primary bg-bg-surface/40 border border-border-default hover:bg-bg-elevated hover:border-border-strong backdrop-blur-sm",
  icon: "text-text-secondary bg-transparent hover:bg-bg-elevated hover:text-brand-red rounded-full",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-3 text-base rounded-md",
  lg: "px-8 py-4 text-lg rounded-lg",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-9 h-9 p-0",
  md: "w-10 h-10 p-0",
  lg: "w-12 h-12 p-0",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    magnetic,
    ...rest
  } = props;

  // Magnetic enabled by default for primary variant
  const useMag = magnetic ?? variant === "primary";
  const magRef = useMagnetic<HTMLElement>({
    strength: 0.25,
    radius: 70,
  });

  const composed = cn(
    baseStyles,
    variantStyles[variant],
    variant === "icon" ? iconSizeStyles[size] : sizeStyles[size],
    className
  );

  const ref = useMag ? (magRef as React.Ref<HTMLElement>) : undefined;

  if ("href" in props && props.href) {
    const { href, external, ...anchorRest } = rest as ButtonAsLink;
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={external !== false ? "_blank" : undefined}
          rel={external !== false ? "noopener noreferrer" : undefined}
          className={composed}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={composed}
        {...anchorRest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={composed}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
