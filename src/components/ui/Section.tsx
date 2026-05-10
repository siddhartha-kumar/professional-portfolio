import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./ScrollReveal";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id: string;
  children: React.ReactNode;
};

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 py-16 sm:py-20 md:py-28 lg:py-32 container-page",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div
        className={cn(
          "mb-10 sm:mb-12 md:mb-16 max-w-3xl",
          align === "center" && "mx-auto text-center",
          className
        )}
      >
        {eyebrow && (
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-brand-red tracking-[0.2em] uppercase mb-3 sm:mb-4 font-bold">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] sm:leading-[1.05] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-text-tertiary leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
