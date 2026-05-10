"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigation } from "@/content/navigation";
import { profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const sectionIds = navigation.map((n) => n.id);

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const active = useActiveSection(sectionIds);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-base/90 backdrop-blur-xl border-b border-border-default shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="container-page flex items-center justify-between gap-4 h-16 md:h-20"
      >
        {/* Avatar + name — leftmost identity (never wraps, never shrinks) */}
        <Link
          href="#hero"
          className="group flex items-center gap-3 flex-shrink-0 min-w-0"
          aria-label="Siddhartha Kumar — back to top"
        >
          <Avatar
            src={profile.avatarUrl}
            fallbackSrc={profile.avatarFallbackUrl}
            name={profile.name}
            size={40}
            status="online"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden md:flex flex-col leading-tight whitespace-nowrap">
            <span className="font-display font-semibold text-sm text-text-primary group-hover:text-brand-red transition-colors">
              Siddhartha Kumar
            </span>
            <span className="font-mono text-[10px] text-text-tertiary tracking-wider uppercase">
              Data Engineer
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden xl:flex items-center gap-1 flex-shrink min-w-0">
          {navigation.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative px-4 py-2 rounded-md transition-colors duration-200",
                    "text-sm font-medium",
                    isActive
                      ? "text-text-primary"
                      : "text-text-tertiary hover:text-text-primary"
                  )}
                >
                  <span className="font-mono text-[10px] text-brand-red/80 mr-1.5">
                    {item.number}
                  </span>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute bottom-1 left-3 right-3 h-[2px] bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.6)] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right-side group: Cmd+K hint + Resume CTA (desktop) */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => {
              const isMac = navigator.platform.toUpperCase().includes("MAC");
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: isMac,
                ctrlKey: !isMac,
              });
              window.dispatchEvent(event);
            }}
            aria-label="Open command palette (Ctrl/Cmd+K)"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-text-tertiary border border-border-subtle bg-bg-surface/40 hover:border-border-default hover:text-text-secondary transition-all backdrop-blur-sm font-mono"
          >
            <span>Search</span>
            <kbd className="px-1 py-px rounded bg-bg-base border border-border-default text-[10px]">⌘K</kbd>
          </button>
          <a
            href="/resume/Siddhartha_Kumar_DataEngineer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group/resume relative inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold text-white bg-brand-red shadow-[0_4px_16px_rgba(229,9,20,0.35)] hover:shadow-[0_8px_24px_rgba(229,9,20,0.55)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Resume
            <span className="transition-transform duration-200 group-hover/resume:translate-x-0.5 group-hover/resume:-translate-y-0.5">↗</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors flex-shrink-0"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden bg-bg-base/95 backdrop-blur-xl border-t border-border-default"
          >
            <ul className="container-page py-4 flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                        isActive
                          ? "bg-bg-elevated text-text-primary"
                          : "text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
                      )}
                    >
                      <span className="font-mono text-xs text-brand-cyan/70 w-8">
                        {item.number}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 pt-2 border-t border-border-subtle">
                <a
                  href="/resume/Siddhartha_Kumar_DataEngineer.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mx-3 px-5 py-3 rounded-md text-sm font-bold bg-brand-red text-white shadow-[0_4px_16px_rgba(229,9,20,0.35)]"
                >
                  Download Resume <span>↗</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
