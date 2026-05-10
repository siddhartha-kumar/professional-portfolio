"use client";

import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
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
        {/* Vertical connecting line */}
        <div
          aria-hidden
          className="absolute left-4 md:left-[60px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-cyan via-border-default to-transparent"
        />

        <StaggerContainer className="space-y-10 md:space-y-12">
          {experiences.map((exp) => (
            <StaggerItem key={exp.id}>
              <div className="relative flex gap-6 md:gap-12">
                {/* Timeline node */}
                <div className="relative flex-shrink-0 pt-1.5">
                  <div className="relative flex items-center justify-center w-9 h-9 md:w-[120px]">
                    {/* Year label (desktop) */}
                    <div className="hidden md:flex absolute right-12 items-center font-mono text-xs text-text-tertiary whitespace-nowrap">
                      {exp.startYear} — {exp.endYear === "Present" ? "Present" : exp.endYear}
                    </div>

                    {/* Dot */}
                    <div className="relative">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2",
                          exp.current
                            ? "bg-brand-red border-brand-red shadow-[0_0_16px_rgba(229,9,20,0.7)]"
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
                </div>

                {/* Card */}
                <div className="flex-1 group">
                  <div
                    className={cn(
                      "relative rounded-lg p-6 md:p-7",
                      "bg-bg-surface border border-border-subtle",
                      "transition-all duration-300",
                      "hover:border-[rgba(0,212,255,0.3)] hover:bg-bg-elevated"
                    )}
                  >
                    {/* Mobile-only year */}
                    <p className="md:hidden font-mono text-xs text-text-tertiary mb-2">
                      {exp.period}
                    </p>

                    {/* Header: Logo + role */}
                    <div className="flex items-start gap-4 mb-1">
                      <CompanyLogo
                        name={exp.company}
                        domain={exp.domain}
                        size={48}
                        shape="rounded"
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[rgba(229,9,20,0.10)] border border-[rgba(229,9,20,0.30)] text-brand-red text-[10px] font-bold font-mono tracking-wider uppercase">
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

                    <div className="my-5 h-px bg-border-subtle" />

                    {/* Highlights */}
                    <ul className="space-y-2.5">
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
