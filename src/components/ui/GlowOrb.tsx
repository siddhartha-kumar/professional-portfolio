import { cn } from "@/lib/utils";

type GlowOrbProps = {
  color?: "cyan" | "violet" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  blur?: "md" | "lg" | "xl";
};

const colorMap = {
  cyan: "bg-[radial-gradient(circle,rgba(0,212,255,0.25),transparent_70%)]",
  violet:
    "bg-[radial-gradient(circle,rgba(123,97,255,0.20),transparent_70%)]",
  green:
    "bg-[radial-gradient(circle,rgba(0,255,136,0.15),transparent_70%)]",
};

const sizeMap = {
  sm: "w-48 h-48",
  md: "w-72 h-72",
  lg: "w-96 h-96",
  xl: "w-[40rem] h-[40rem]",
};

const blurMap = {
  md: "blur-2xl",
  lg: "blur-3xl",
  xl: "blur-[100px]",
};

export function GlowOrb({
  color = "cyan",
  size = "lg",
  blur = "xl",
  className,
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full",
        colorMap[color],
        sizeMap[size],
        blurMap[blur],
        className
      )}
    />
  );
}
