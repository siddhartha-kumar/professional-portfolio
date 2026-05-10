"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import {
  projects,
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/content/projects";
import { ProjectRow } from "./ProjectRow";
import { ProjectModal } from "./ProjectModal";

const categoryOrder: ProjectCategory[] = ["production", "platform", "foundation"];

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <Section id="projects">
        <SectionHeader
          eyebrow="03 / Featured Systems"
          title={
            <>
              Production-grade infrastructure,
              <br />
              <span className="text-gradient">built for the long run.</span>
            </>
          }
          description="A selection of systems I've architected, migrated, or rebuilt from scratch. Click any card for the full architecture breakdown."
        />

        {categoryOrder.map((category) => {
          const items = projects.filter((p) => p.category === category);
          if (items.length === 0) return null;
          const meta = projectCategories[category];
          return (
            <ProjectRow
              key={category}
              title={meta.title}
              description={meta.description}
              projects={items}
              onSelect={setSelected}
            />
          );
        })}
      </Section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
