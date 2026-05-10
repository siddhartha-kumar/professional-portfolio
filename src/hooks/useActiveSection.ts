"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view based on IntersectionObserver.
 * Returns the id of the most prominent visible section.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sectionIds.length === 0) return;

    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(id, entry.intersectionRatio);
          });

          let bestId = active;
          let bestRatio = 0;
          visibility.forEach((ratio, sid) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = sid;
            }
          });
          if (bestRatio > 0) setActive(bestId);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return active;
}
