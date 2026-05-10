"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { Confetti } from "./Confetti";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEggListener() {
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    // Console banner — visible to anyone who opens DevTools
    const banner = `
%cHello, fellow engineer.

You opened DevTools — that's exactly what I'd do too.

If you're looking for someone who obsesses over reliability,
event-driven architectures, and shipping production systems
that don't wake people up at 3 AM — let's talk.

  ${profile.email}
  ${profile.social.linkedin}
  ${profile.social.github}

%cTip: try the Konami code (↑↑↓↓←→←→BA) on the page.
`;
    console.log(
      banner,
      "color:#00D4FF;font-family:monospace;font-size:12px;line-height:1.6;",
      "color:#7B61FF;font-family:monospace;font-size:11px;font-style:italic;"
    );

    // Konami listener
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      // Skip when typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      buffer.push(e.key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (
        buffer.length === KONAMI.length &&
        buffer.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())
      ) {
        document.documentElement.classList.toggle("konami-mode");
        setConfettiTrigger((n) => n + 1);
        console.log(
          "%c> ACCESS GRANTED. You found mission control.",
          "color:#00FF88;font-family:monospace;font-size:14px;font-weight:bold;"
        );
        buffer = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Confetti trigger={confettiTrigger} />;
}
