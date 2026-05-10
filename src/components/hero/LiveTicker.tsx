type LiveTickerProps = {
  items: readonly string[];
};

export function LiveTicker({ items }: LiveTickerProps) {
  // Duplicate the items so the loop is seamless
  const repeated = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden border-y border-border-subtle bg-bg-surface/40 backdrop-blur-sm py-3"
      role="marquee"
      aria-label="Career highlights"
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-bg-base to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-bg-base to-transparent pointer-events-none" />
      <div className="flex animate-ticker whitespace-nowrap gap-8 will-change-transform">
        {repeated.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 font-mono text-xs md:text-sm text-text-secondary"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(0,255,136,0.6)] animate-pulse-glow" />
            <span>{item}</span>
            <span className="text-text-muted">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
