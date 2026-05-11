"use client";

import { motion } from "framer-motion";
import { Play, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Avatar } from "@/components/ui/Avatar";
import { profile } from "@/content/profile";
import { GlobeBackground } from "./GlobeBackground";
import { TypewriterHeadline } from "./TypewriterHeadline";
import { LiveTicker } from "./LiveTicker";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12 sm:pb-16"
    >
      {/* 3D rotating data globe — cinematic background */}
      <div className="absolute inset-0 -z-10">
        <GlobeBackground />
      </div>

      {/* Cinematic glow stack */}
      <GlowOrb color="cyan" size="xl" className="-top-40 -left-40 opacity-70" />
      <GlowOrb color="violet" size="lg" className="bottom-20 -right-20 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-[10%] w-[36rem] h-[36rem] rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(229,9,20,0.32), transparent 70%)",
        }}
      />

      <div className="container-page flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — Text content */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Pre-headline / eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <span className="w-8 h-px bg-brand-red" />
              <p className="font-mono text-xs sm:text-sm text-brand-red tracking-[0.25em] uppercase font-bold">
                Architecting and Engineering Data at Scale
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-red/15 border border-brand-red/40 shadow-[0_0_16px_rgba(229,9,20,0.25)]">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-brand-red opacity-60 animate-pulse-glow" />
                  <span className="relative inline-flex w-full h-full rounded-full bg-brand-red" />
                </span>
                <span className="font-mono text-[10px] text-brand-red tracking-wider uppercase font-bold">
                  Now Streaming
                </span>
              </span>
            </motion.div>

            {/* Headline (typewriter) */}
            <div className="mb-6">
              <TypewriterHeadline
                line1={profile.tagline.line1}
                line2={profile.tagline.line2}
              />
            </div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-base sm:text-lg md:text-xl text-text-tertiary leading-relaxed mb-10"
            >
              {profile.subheadline}
            </motion.p>

            {/* CTA buttons — Netflix-style "Play" + "More Info" */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button href="#projects" size="lg" variant="primary">
                <Play size={18} className="fill-current" />
                Explore Featured Systems
              </Button>
              <Button
                href={profile.resumePath}
                external
                size="lg"
                variant="ghost"
              >
                <Download size={18} />
                Download Resume
              </Button>
            </motion.div>
          </div>

          {/* RIGHT — Cinematic avatar portrait (responsive sizing) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] lg:w-[210px] lg:h-[210px] flex items-center justify-center">
              {/* Concentric glow rings */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full blur-2xl opacity-60"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,10,31,0.55), transparent 60%)",
                  transform: "scale(1.4)",
                }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-brand-red/35"
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-brand-cyan/30"
                animate={{ scale: [1.15, 1.35, 1.15], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-brand-violet/25"
                animate={{ scale: [1.3, 1.55, 1.3], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />

              {/* The avatar — fills its container */}
              <div className="relative w-full h-full">
                <Avatar
                  src={profile.avatarUrl}
                  fallbackSrc={profile.avatarFallbackUrl}
                  name={profile.name}
                  size={210}
                  status="online"
                  className="!w-full !h-full shadow-[0_24px_64px_rgba(255,10,31,0.45)]"
                />
              </div>

              {/* Status badge below avatar */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-base/95 backdrop-blur-md border border-border-default shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(0,255,163,0.7)] animate-pulse-glow" />
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-secondary tracking-wider uppercase whitespace-nowrap">
                    Open to opportunities
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="relative z-10 mt-10 lg:mt-14"
      >
        <LiveTicker items={profile.liveTickerItems} />
      </motion.div>

      {/* Scroll cue — generous breathing room below the ticker */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="relative z-10 mt-14 sm:mt-16 mb-2 self-center inline-flex flex-col items-center gap-2 text-text-tertiary hover:text-brand-red transition-colors group"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
          Scroll to dive in
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  );
}
