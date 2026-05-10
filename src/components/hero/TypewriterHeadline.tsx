"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TypewriterHeadlineProps = {
  line1: string;
  line2: string;
};

const CHAR_DELAY = 38; // ms per character
const LINE_DELAY = 220; // ms between lines

export function TypewriterHeadline({ line1, line2 }: TypewriterHeadlineProps) {
  const reduced = useReducedMotion();
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const [done1, setDone1] = useState(false);
  const [done2, setDone2] = useState(false);

  useEffect(() => {
    if (reduced) {
      setT1(line1);
      setT2(line2);
      setDone1(true);
      setDone2(true);
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Type line 1
    for (let i = 0; i <= line1.length; i++) {
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setT1(line1.slice(0, i));
          if (i === line1.length) setDone1(true);
        }, i * CHAR_DELAY)
      );
    }

    // Type line 2 after line 1 finishes
    const line2Start = line1.length * CHAR_DELAY + LINE_DELAY;
    for (let i = 0; i <= line2.length; i++) {
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setT2(line2.slice(0, i));
          if (i === line2.length) setDone2(true);
        }, line2Start + i * CHAR_DELAY)
      );
    }

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [line1, line2, reduced]);

  return (
    <h1 className="font-display font-bold text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] tracking-tight">
      <span className="block text-text-primary">
        {t1}
        {!done1 && (
          <span className="inline-block w-[2px] h-[0.85em] bg-brand-cyan ml-1 animate-blink align-middle" />
        )}
      </span>
      <span className="block text-gradient">
        {t2}
        {done1 && !done2 && (
          <span className="inline-block w-[2px] h-[0.85em] bg-brand-cyan ml-1 animate-blink align-middle" />
        )}
      </span>
    </h1>
  );
}
