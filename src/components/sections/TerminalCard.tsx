"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { profile } from "@/content/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Line = {
  prompt: string;
  output: string;
  outputColor?: string;
};

const lines: Line[] = [
  { prompt: "whoami", output: "siddhartha.kumar", outputColor: "text-brand-cyan" },
  { prompt: "role", output: "data engineer & architect" },
  { prompt: "company", output: profile.currentCompany.toLowerCase() },
  { prompt: "location", output: "bengaluru, india" },
  { prompt: "years_in_field", output: "6" },
  { prompt: "status", output: "architecting and building at scale", outputColor: "text-brand-green" },
  { prompt: "contact", output: profile.email },
];

const TYPE_SPEED = 18; // ms per char
const COMMAND_DELAY = 280; // ms between commands

export function TerminalCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduced = useReducedMotion();

  const [visibleLines, setVisibleLines] = useState<
    { prompt: string; output: string; outputColor?: string; promptDone: boolean; outputDone: boolean }[]
  >([]);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setVisibleLines(
        lines.map((l) => ({ ...l, promptDone: true, outputDone: true }))
      );
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cursor = 0;

    lines.forEach((line, lineIdx) => {
      const startTime = cursor;

      // Prompt typing
      for (let i = 0; i <= line.prompt.length; i++) {
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            setVisibleLines((prev) => {
              const next = [...prev];
              if (!next[lineIdx]) {
                next[lineIdx] = {
                  prompt: line.prompt.slice(0, i),
                  output: "",
                  outputColor: line.outputColor,
                  promptDone: i === line.prompt.length,
                  outputDone: false,
                };
              } else {
                next[lineIdx] = {
                  ...next[lineIdx],
                  prompt: line.prompt.slice(0, i),
                  promptDone: i === line.prompt.length,
                };
              }
              return next;
            });
          }, startTime + i * TYPE_SPEED)
        );
      }
      cursor += line.prompt.length * TYPE_SPEED + 120;

      // Output typing
      for (let i = 0; i <= line.output.length; i++) {
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            setVisibleLines((prev) => {
              const next = [...prev];
              if (next[lineIdx]) {
                next[lineIdx] = {
                  ...next[lineIdx],
                  output: line.output.slice(0, i),
                  outputDone: i === line.output.length,
                };
              }
              return next;
            });
          }, cursor + i * TYPE_SPEED)
        );
      }
      cursor += line.output.length * TYPE_SPEED + COMMAND_DELAY;
    });

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [inView, reduced]);

  return (
    <div
      ref={ref}
      className="relative rounded-lg overflow-hidden bg-bg-surface border border-border-default shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-elevated/60">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <p className="font-mono text-[11px] text-text-tertiary mx-auto">
          ~ / siddhartha.kumar — zsh
        </p>
        <span className="w-12" />
      </div>

      {/* Terminal body */}
      <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm space-y-2 min-h-[320px]">
        {visibleLines.map((line, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-brand-green select-none">$</span>
              <span className="text-text-secondary">
                {line.prompt}
                {!line.promptDone && (
                  <span className="inline-block w-[7px] h-[14px] bg-brand-cyan ml-1 animate-blink align-middle" />
                )}
              </span>
            </div>
            {line.promptDone && (
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-text-muted select-none">&gt;</span>
                <span className={line.outputColor ?? "text-text-primary"}>
                  {line.output}
                  {line.promptDone && !line.outputDone && (
                    <span className="inline-block w-[7px] h-[14px] bg-brand-cyan ml-1 animate-blink align-middle" />
                  )}
                </span>
              </div>
            )}
          </div>
        ))}

        {visibleLines.length === lines.length &&
          visibleLines.every((l) => l.outputDone) && (
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-brand-green select-none">$</span>
              <span className="inline-block w-[7px] h-[14px] bg-brand-cyan animate-blink" />
            </div>
          )}
      </div>
    </div>
  );
}
