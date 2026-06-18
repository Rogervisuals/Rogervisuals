"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/lib/projects/types";
import { projectFilters, projectHasCategory } from "@/lib/projects/types";
import { FilterBar } from "@/components/ui/FilterBar";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface WorkGridProps {
  projects: Project[];
}

export function WorkGrid({ projects }: WorkGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => projectHasCategory(p, activeFilter));

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <FilterBar
          filters={projectFilters}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-silver/60">
            No projects found for this category.
          </p>
        )}
      </div>
    </section>
  );
}
