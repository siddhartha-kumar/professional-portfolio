"use client";

import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { experiences } from "@/content/experience";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="04 / Trajectory"
        title="The path so far."
      />

      <div className="relative max-w-4xl">
        {/* Vertical connecting line — passes through dot centers
            Mobile: dot column is w-9 with dot at center → line at left-[18px]
            Desktop: year(108) + gap(24) + dot center(6) = left-[138px] */}
        <div
          aria-hidden
          className="absolute left-[18px] md:left-[138px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-red via-border-default to-transparent"
        />

        <StaggerContainer className="space-y-8 md:space-y-10">
          {experiences.map((exp) => (
            <StaggerItem key={exp.id}>
              <div className="relative flex gap-3 md:gap-6">
                {/* DESKTOP — Year column (right-aligned, fully visible) */}
                <div className="hidden md:flex w-[108px] flex-shrink-0 pt-3.5 justify-end items-start">
                  <span
                    className={cn(
                      "font-mono text-xs whitespace-nowrap tabular-nums",
                      exp.current ? "text-brand-red font-bold" : "text-text-tertiary"
                    )}
                  >
                    {exp.startYear} – {exp.endYear}
                  </span>
                </div>

                {/* Timeline dot column */}
                <div className="flex-shrink-0 pt-3.5 w-9 md:w-3 flex justify-center">
                  <div className="relative">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border-2 transition-shadow",
                        exp.current
                          ? "bg-brand-red border-brand-red shadow-[0_0_16px_rgba(255,10,31,0.7)]"
                          : "bg-bg-base border-border-strong"
                      )}
                    />
                    {exp.current && (
                      <motion.div
                        aria-hidden
                        className="absolute inset-0 rounded-full border-2 border-brand-red"
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 group min-w-0">
                  <div
                    className={cn(
                      "relative rounded-lg p-5 sm:p-6 md:p-7",
                      "bg-bg-surface border border-border-subtle",
                      "transition-all duration-300",
                      "hover:border-[rgba(0,229,255,0.35)] hover:bg-bg-elevated hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    )}
                  >
                    {/* MOBILE — Period chip (year column hidden on mobile) */}
                    <p
                      className={cn(
                        "md:hidden inline-block font-mono text-[11px] tabular-nums mb-3 px-2 py-0.5 rounded-md border",
                        exp.current
                          ? "text-brand-red border-brand-red/40 bg-brand-red/10 font-bold"
                          : "text-text-tertiary border-border-subtle bg-bg-elevated"
                      )}
                    >
                      {exp.startYear} – {exp.endYear}
                    </p>

                    {/* Header: Logo + role */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-1">
                      <CompanyLogo
                        name={exp.company}
                        domain={exp.domain}
                        size={48}
                        shape="rounded"
                        className="mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-text-primary leading-tight">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-red/15 border border-brand-red/40 text-brand-red text-[10px] font-bold font-mono tracking-wider uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-glow" />
                              Currently here
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary font-medium">
                          {exp.company}
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-xs text-text-tertiary mt-1">
                          <MapPin size={11} />
                          {exp.location}
                        </p>
                      </div>
                    </div>

                    <div className="my-4 sm:my-5 h-px bg-border-subtle" />

                    {/* Highlights */}
                    <ul className="space-y-2 sm:space-y-2.5">
                      {exp.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm md:text-base text-text-secondary leading-relaxed"
                        >
                          <ChevronRight
                            size={14}
                            className="text-brand-cyan flex-shrink-0 mt-1"
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Section>
  );
}
