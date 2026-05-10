import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center container-page relative overflow-hidden">
      <GlowOrb color="cyan" size="xl" className="-top-20 -left-20 opacity-50" />
      <GlowOrb color="violet" size="lg" className="-bottom-20 -right-20 opacity-50" />

      <div className="relative max-w-2xl text-center">
        <p className="font-mono text-xs text-state-error tracking-[0.3em] uppercase mb-6">
          ERROR · 404
        </p>
        <h1 className="font-display font-bold text-5xl sm:text-7xl md:text-8xl text-text-primary mb-6 leading-none tracking-tight">
          Signal <span className="text-gradient">Lost.</span>
        </h1>
        <p className="text-lg text-text-tertiary mb-10 leading-relaxed">
          Looks like you&apos;ve ventured off the grid.
          <br />
          The page you&apos;re looking for doesn&apos;t exist — or maybe never did.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-brand text-bg-base font-semibold shadow-[0_4px_24px_rgba(0,212,255,0.3)] hover:shadow-[0_8px_32px_rgba(0,212,255,0.5)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Return to mission control
        </Link>
      </div>
    </main>
  );
}
