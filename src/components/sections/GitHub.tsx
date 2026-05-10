import Image from "next/image";
import {
  Github,
  Star,
  GitFork,
  ArrowUpRight,
  Users,
  BookOpen,
  Activity,
  Code2,
  Sparkles,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import {
  getGitHubProfile,
  getGitHubRepos,
  computeLanguageStats,
  type GitHubRepo,
} from "@/lib/github";

const LANGUAGE_COLORS: Record<string, string> = {
  "Jupyter Notebook": "#DA5B0B",
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Shell: "#89E051",
  Java: "#B07219",
  Go: "#00ADD8",
  Rust: "#DEA584",
};

function languageColor(name: string) {
  return LANGUAGE_COLORS[name] ?? "#00E5FF";
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function describe(repo: GitHubRepo): string {
  if (repo.description && repo.description.trim().length > 0) {
    return repo.description;
  }
  // Sensible inferred description based on repo name
  const name = repo.name.toLowerCase().replace(/[-_]/g, " ");
  if (name.includes("ml") || name.includes("learn"))
    return "Machine learning experiments, notebooks, and exploratory analysis.";
  if (name.includes("data") || name.includes("capstone"))
    return "Applied data science project — analysis, modeling, and insights.";
  if (name.includes("etl") || name.includes("pipeline"))
    return "Data engineering pipeline and orchestration code.";
  return `Code, notes, and experiments for ${repo.name}.`;
}

export async function GitHub() {
  const [ghProfile, repos] = await Promise.all([
    getGitHubProfile(),
    getGitHubRepos(),
  ]);

  const featuredRepos = repos.slice(0, 4);
  const languages = computeLanguageStats(repos);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const lastActivityDays = repos[0]?.pushed_at
    ? daysSince(repos[0].pushed_at)
    : null;

  // Compute language percentages
  const langTotal = languages.reduce((s, l) => s + l.count, 0);
  const langPercents = languages.map((l) => ({
    ...l,
    pct: langTotal > 0 ? Math.round((l.count / langTotal) * 100) : 0,
    color: languageColor(l.name),
  }));

  return (
    <Section id="github">
      <SectionHeader
        eyebrow="07 / Open Source"
        title={
          <>
            Code in <span className="text-gradient">the open.</span>
          </>
        }
        description="Live activity from my GitHub. The work I'm building, learning, and shipping in public."
      />

      {!ghProfile ? (
        <ScrollReveal>
          <div className="rounded-2xl p-10 bg-bg-surface border border-border-subtle text-center">
            <Github size={36} className="mx-auto text-text-tertiary mb-4" />
            <p className="text-text-secondary mb-5">
              GitHub data is taking a moment to load.
            </p>
            <Button
              href={profile.social.github}
              external
              variant="primary"
              size="md"
            >
              <Github size={16} />
              Visit profile directly
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </ScrollReveal>
      ) : (
        <div className="space-y-6">
          {/* ── HERO PROFILE CARD ────────────────────────────── */}
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden bg-bg-surface border border-border-subtle">
              {/* Vibrant ambient gradient bg */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 80% at 0% 0%, rgba(0,229,255,0.15), transparent 50%), radial-gradient(ellipse 60% 80% at 100% 100%, rgba(255,10,31,0.12), transparent 50%), radial-gradient(ellipse 40% 60% at 50% 50%, rgba(139,108,255,0.10), transparent 60%)",
                }}
              />

              <div className="relative p-6 md:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* LEFT — avatar + identity + CTA */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="flex items-center gap-5 mb-6">
                      {ghProfile.avatar_url && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-brand-cyan/50 shadow-[0_0_32px_rgba(0,229,255,0.45)]">
                          <Image
                            src={ghProfile.avatar_url}
                            alt={ghProfile.name ?? ghProfile.login}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-2xl text-text-primary leading-tight">
                          {ghProfile.name ?? ghProfile.login}
                        </h3>
                        <a
                          href={ghProfile.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 font-mono text-xs text-brand-cyan hover:text-text-primary transition-colors"
                        >
                          <Github size={12} />@{ghProfile.login}
                        </a>
                      </div>
                    </div>

                    {ghProfile.bio && (
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">
                        {ghProfile.bio}
                      </p>
                    )}

                    <Button
                      href={ghProfile.html_url}
                      external
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto self-start mt-auto"
                    >
                      <Github size={14} />
                      View full profile
                      <ArrowUpRight size={14} />
                    </Button>
                  </div>

                  {/* RIGHT — stats grid + language breakdown */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* 4-stat grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <StatCell
                        icon={<BookOpen size={14} />}
                        value={ghProfile.public_repos}
                        label="Repos"
                        color="cyan"
                      />
                      <StatCell
                        icon={<Star size={14} />}
                        value={totalStars}
                        label="Stars"
                        color="gold"
                      />
                      <StatCell
                        icon={<Users size={14} />}
                        value={ghProfile.followers}
                        label="Followers"
                        color="violet"
                      />
                      <StatCell
                        icon={<Activity size={14} />}
                        value={
                          lastActivityDays === null
                            ? "—"
                            : lastActivityDays === 0
                            ? "Today"
                            : `${lastActivityDays}d`
                        }
                        label="Last push"
                        color={
                          lastActivityDays !== null && lastActivityDays < 30
                            ? "green"
                            : "red"
                        }
                        pulse={
                          lastActivityDays !== null && lastActivityDays < 30
                        }
                      />
                    </div>

                    {/* Language breakdown */}
                    {langPercents.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.2em] font-bold inline-flex items-center gap-2">
                            <Code2 size={12} className="text-brand-cyan" />
                            Top Languages
                          </p>
                        </div>

                        {/* Stacked progress bar */}
                        <div className="relative h-2 rounded-full overflow-hidden bg-bg-elevated mb-3">
                          {(() => {
                            let runningPct = 0;
                            return langPercents.map((l) => {
                              const left = runningPct;
                              runningPct += l.pct;
                              return (
                                <div
                                  key={l.name}
                                  className="absolute top-0 bottom-0 transition-all duration-700 ease-out"
                                  style={{
                                    left: `${left}%`,
                                    width: `${l.pct}%`,
                                    background: l.color,
                                    boxShadow: `0 0 12px ${l.color}`,
                                  }}
                                  title={`${l.name} — ${l.pct}%`}
                                />
                              );
                            });
                          })()}
                        </div>

                        {/* Language legend */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {langPercents.map((l) => (
                            <span
                              key={l.name}
                              className="inline-flex items-center gap-1.5 text-xs"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  background: l.color,
                                  boxShadow: `0 0 8px ${l.color}`,
                                }}
                              />
                              <span className="font-mono text-text-secondary">
                                {l.name}
                              </span>
                              <span className="font-mono text-text-tertiary">
                                {l.pct}%
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── FEATURED REPOSITORIES ──────────────────────── */}
          {featuredRepos.length > 0 && (
            <ScrollReveal delay={0.1}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-[11px] text-brand-red tracking-[0.25em] uppercase font-bold inline-flex items-center gap-2">
                  <Sparkles size={12} />
                  Featured Repositories
                </h3>
                <a
                  href={`${ghProfile.html_url}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-text-tertiary hover:text-brand-red transition-colors inline-flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight size={11} />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredRepos.map((repo, i) => (
                  <RepoCard key={repo.id} repo={repo} idx={i} />
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      )}
    </Section>
  );
}

// ── Sub-components ───────────────────────────────────────────

const STAT_COLORS = {
  cyan: "text-brand-cyan border-[rgba(0,229,255,0.30)] bg-[rgba(0,229,255,0.05)]",
  gold: "text-brand-gold border-[rgba(255,214,0,0.30)] bg-[rgba(255,214,0,0.05)]",
  violet:
    "text-brand-violet border-[rgba(139,108,255,0.30)] bg-[rgba(139,108,255,0.05)]",
  green:
    "text-brand-green border-[rgba(0,255,163,0.30)] bg-[rgba(0,255,163,0.05)]",
  red: "text-brand-red border-[rgba(255,10,31,0.30)] bg-[rgba(255,10,31,0.05)]",
} as const;

function StatCell({
  icon,
  value,
  label,
  color,
  pulse = false,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: keyof typeof STAT_COLORS;
  pulse?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg p-3 border ${STAT_COLORS[color]} transition-all duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="opacity-80">{icon}</span>
        {pulse && (
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-current opacity-60 animate-pulse-glow" />
            <span className="relative inline-flex w-full h-full rounded-full bg-current" />
          </span>
        )}
      </div>
      <p className="font-display font-bold text-xl text-text-primary leading-none mb-1">
        {value}
      </p>
      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono">
        {label}
      </p>
    </div>
  );
}

function RepoCard({ repo, idx }: { repo: GitHubRepo; idx: number }) {
  const lang = repo.language;
  const color = lang ? languageColor(lang) : "#00E5FF";
  const description = describe(repo);
  const lastPush = repo.pushed_at ? daysSince(repo.pushed_at) : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-xl p-5 sm:p-6 bg-bg-surface border border-border-subtle overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,229,255,0.45)] hover:shadow-[0_12px_40px_rgba(0,229,255,0.18)]"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* Accent stripe */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />

      {/* Glow on hover */}
      <div
        aria-hidden
        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl"
        style={{ background: color }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                background: `${color}25`,
                border: `1px solid ${color}55`,
              }}
            >
              <Code2 size={14} style={{ color }} />
            </div>
            <h4 className="font-display font-bold text-base sm:text-lg text-text-primary group-hover:text-brand-cyan transition-colors break-words leading-tight">
              {repo.name}
            </h4>
          </div>
          <ArrowUpRight
            size={16}
            className="flex-shrink-0 text-text-tertiary group-hover:text-brand-cyan group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-2">
          {description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary pt-4 border-t border-border-subtle">
          {lang && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
              {lang}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Star size={11} />
            {repo.stargazers_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork size={11} />
            {repo.forks_count}
          </span>
          {lastPush !== null && (
            <span className="inline-flex items-center gap-1 ml-auto">
              {lastPush === 0 ? "Updated today" : `${lastPush}d ago`}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
