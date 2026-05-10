"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  FileText,
  Hash,
  Copy,
} from "lucide-react";
import { navigation } from "@/content/navigation";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Connect" | "Actions";
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  const navTo = React.useCallback(
    (hash: string) => {
      close();
      // Allow modal to close before scroll
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", hash);
        }
      });
    },
    [close]
  );

  const openExternal = React.useCallback(
    (url: string) => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [close]
  );

  const copyEmail = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
    close();
  }, [close]);

  const items = React.useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = navigation.map((n) => ({
      id: `nav-${n.id}`,
      label: n.label,
      hint: `Section ${n.number}`,
      group: "Navigate",
      icon: <Hash size={14} />,
      action: () => navTo(n.href),
      keywords: n.label.toLowerCase(),
    }));

    const connectItems: CommandItem[] = [
      {
        id: "email",
        label: "Send Email",
        hint: profile.email,
        group: "Connect",
        icon: <Mail size={14} />,
        action: () => {
          window.location.href = `mailto:${profile.email}`;
          close();
        },
        keywords: "email contact mail",
      },
      {
        id: "copy-email",
        label: "Copy Email Address",
        hint: profile.email,
        group: "Actions",
        icon: <Copy size={14} />,
        action: copyEmail,
        keywords: "copy email clipboard",
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "linkedin.com/in/siddhartha--kumar",
        group: "Connect",
        icon: <Linkedin size={14} />,
        action: () => openExternal(profile.social.linkedin),
        keywords: "linkedin social",
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: `github.com/${profile.social.githubUsername}`,
        group: "Connect",
        icon: <Github size={14} />,
        action: () => openExternal(profile.social.github),
        keywords: "github code repos",
      },
      {
        id: "resume",
        label: "Download Resume",
        hint: "PDF",
        group: "Actions",
        icon: <FileText size={14} />,
        action: () => openExternal(profile.resumePath),
        keywords: "resume cv pdf download",
      },
    ];

    return [...navItems, ...connectItems];
  }, [navTo, openExternal, copyEmail, close]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.hint?.toLowerCase().includes(q) ||
        i.keywords?.includes(q)
    );
  }, [query, items]);

  // Group filtered items
  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Reset active index when query changes
  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Global keyboard listener
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIdx];
        if (item) item.action();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, filtered, activeIdx]);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Track flat index for active highlight
  let flatIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed inset-x-0 top-[15vh] z-[201] mx-auto max-w-xl w-[calc(100%-2rem)] rounded-xl bg-bg-surface/95 border border-border-default shadow-[0_24px_64px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle">
              <Search size={16} className="text-text-tertiary flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, jump anywhere…"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                aria-label="Search commands"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-bg-elevated border border-border-default text-text-tertiary">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-sm text-text-tertiary">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                grouped.map(([group, groupItems]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                      {group}
                    </p>
                    {groupItems.map((item) => {
                      flatIdx++;
                      const isActive = flatIdx === activeIdx;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setActiveIdx(flatIdx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-bg-elevated text-text-primary"
                              : "text-text-secondary"
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0",
                              isActive
                                ? "bg-brand-cyan/15 text-brand-cyan"
                                : "bg-bg-elevated text-text-tertiary"
                            )}
                          >
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.label}
                            </p>
                            {item.hint && (
                              <p className="text-xs text-text-tertiary truncate font-mono">
                                {item.hint}
                              </p>
                            )}
                          </div>
                          {isActive && (
                            <ArrowRight
                              size={14}
                              className="text-brand-cyan flex-shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border-subtle bg-bg-elevated/30">
              <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-px rounded bg-bg-base border border-border-default">↑↓</kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-px rounded bg-bg-base border border-border-default">↵</kbd>
                  select
                </span>
              </div>
              <p className="text-[11px] font-mono text-text-tertiary">
                <kbd className="px-1 py-px rounded bg-bg-base border border-border-default">⌘K</kbd>{" "}
                anywhere
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
