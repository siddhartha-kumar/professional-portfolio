import { Star } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import {
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
} from "@/components/ui/ScrollReveal";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { certifications } from "@/content/certifications";
import { ISSUER_DOMAINS } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Certifications() {
  const featured = certifications.find((c) => c.featured);
  const others = certifications.filter((c) => !c.featured);

  return (
    <Section id="certifications">
      <SectionHeader
        eyebrow="06 / Credentials"
        title="Validated, not just claimed."
      />

      {/* Featured certification */}
      {featured && (
        <ScrollReveal>
          <div className="mb-10 group relative rounded-xl overflow-hidden">
            {/* Animated gradient border */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-cyan to-brand-violet rounded-xl opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                backgroundSize: "200% 100%",
                animation: "gradient-shift 8s ease infinite",
              }}
            />

            <div className="relative m-[1.5px] rounded-[10px] bg-bg-surface p-6 md:p-8">
              <div className="flex items-start gap-5">
                <CompanyLogo
                  name={featured.issuer}
                  domain={ISSUER_DOMAINS[featured.issuer]}
                  size={64}
                  shape="rounded"
                  className="hidden sm:block flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-red text-white text-[10px] font-bold font-mono tracking-wider uppercase shadow-[0_0_16px_rgba(229,9,20,0.45)]">
                      <Star size={10} className="fill-current" />
                      Featured
                    </span>
                    {featured.year && (
                      <span className="font-mono text-xs text-text-tertiary">
                        {featured.year}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-1">
                    {featured.name}
                  </h3>
                  <p className="text-sm text-text-tertiary mb-3 font-mono">
                    {featured.issuer}
                  </p>
                  {featured.description && (
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                      {featured.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Other certifications grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((c) => (
          <StaggerItem key={c.id}>
            <div
              className={cn(
                "h-full p-5 rounded-lg",
                "bg-bg-surface border border-border-subtle",
                "transition-all duration-300",
                "hover:-translate-y-1 hover:border-[rgba(0,212,255,0.3)] hover:bg-bg-elevated"
              )}
            >
              <div className="flex items-start gap-3">
                <CompanyLogo
                  name={c.issuer}
                  domain={ISSUER_DOMAINS[c.issuer]}
                  size={40}
                  shape="rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm md:text-base text-text-primary leading-snug mb-1">
                    {c.name}
                  </h4>
                  <p className="text-xs font-mono text-text-tertiary">
                    {c.issuer}
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
