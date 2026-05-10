import { MapPin, Calendar, Globe, Award } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { profile } from "@/content/profile";
import { TerminalCard } from "./TerminalCard";

const iconMap = {
  MapPin,
  Calendar,
  Globe,
  Award,
} as const;

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        eyebrow="01 / The Architect"
        title={profile.about.title}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Narrative — left column (7/12 on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {profile.about.paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                {p}
              </p>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap gap-3 pt-4">
              {profile.about.quickFacts.map((fact) => {
                const Icon = iconMap[fact.icon as keyof typeof iconMap];
                return (
                  <Badge key={fact.label} variant="outline" size="md">
                    <Icon size={12} className="text-brand-cyan" />
                    {fact.label}
                  </Badge>
                );
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* Terminal card — right column (5/12 on desktop) */}
        <ScrollReveal delay={0.2} className="lg:col-span-5">
          <TerminalCard />
        </ScrollReveal>
      </div>
    </Section>
  );
}
