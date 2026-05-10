"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  FileText,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { profile } from "@/content/profile";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: open mail client
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="contact" className="relative overflow-hidden">
      <GlowOrb color="cyan" size="xl" className="-top-20 -left-20 opacity-50" />
      <GlowOrb color="violet" size="lg" className="-bottom-20 -right-20 opacity-50" />

      <div className="relative max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="font-mono text-xs md:text-sm text-brand-cyan tracking-[0.25em] uppercase mb-6">
            08 / Direct Line
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
            <span className="text-text-primary">Let&apos;s build something</span>
            <br />
            <span className="text-gradient">that scales.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg md:text-xl text-text-tertiary leading-relaxed max-w-2xl mx-auto mb-12">
            {profile.contact.subtitle}
          </p>
        </ScrollReveal>

        {/* Email — primary CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mb-8 inline-flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-md bg-gradient-brand text-bg-base font-semibold text-base shadow-[0_8px_32px_rgba(0,212,255,0.35)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Mail size={18} />
              <span className="font-mono text-sm tracking-tight">
                {profile.email}
              </span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <button
              onClick={copyEmail}
              aria-label="Copy email to clipboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-md border border-border-default bg-bg-surface/40 backdrop-blur-sm text-text-primary font-medium text-sm hover:border-brand-cyan/50 hover:bg-bg-elevated transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-2 text-brand-green"
                  >
                    <Check size={16} />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </ScrollReveal>

        {/* Secondary channels */}
        <ScrollReveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default text-sm text-text-secondary hover:text-text-primary hover:border-brand-cyan/50 hover:bg-bg-elevated transition-all duration-200"
            >
              <Linkedin size={14} />
              LinkedIn
              <ArrowUpRight size={12} className="text-text-tertiary" />
            </a>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default text-sm text-text-secondary hover:text-text-primary hover:border-brand-cyan/50 hover:bg-bg-elevated transition-all duration-200"
            >
              <Github size={14} />
              GitHub
              <ArrowUpRight size={12} className="text-text-tertiary" />
            </a>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-default text-sm text-text-secondary hover:text-text-primary hover:border-brand-cyan/50 hover:bg-bg-elevated transition-all duration-200"
            >
              <FileText size={14} />
              Resume PDF
              <ArrowUpRight size={12} className="text-text-tertiary" />
            </a>
          </div>
        </ScrollReveal>

        {/* Status indicator */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-bg-surface/50 border border-border-subtle backdrop-blur-sm">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-50 animate-pulse-glow" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
            </span>
            <span className="font-mono text-xs text-text-secondary">
              Open to senior data engineering & architecture roles
            </span>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
