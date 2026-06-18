"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { FeaturedToggleButton } from "@/components/admin/FeaturedToggleButton";
import type { Project } from "@/lib/projects/types";
import { getCategoriesLabel } from "@/lib/projects/types";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        getCategoriesLabel(p.categories).toLowerCase().includes(q)
    );
  }, [projects, search]);

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-mine-shaft/30">
              {["Thumbnail", "Title", "Client", "Category", "Featured", "Date", "Actions"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 font-[family-name:var(--font-ui)] text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-silver/40"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <div className="relative h-10 w-16 overflow-hidden rounded bg-mine-shaft">
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-[family-name:var(--font-ui)] text-[0.625rem] text-silver/30">
                          —
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-body)] text-sm text-white">
                      {project.title}
                    </span>
                    {!project.published && (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-wider text-silver/40">
                        Draft
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-body)] text-sm text-silver/70">
                  {project.client}
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-ui)] text-xs text-silver/60">
                  {getCategoriesLabel(project.categories)}
                </td>
                <td className="px-4 py-3">
                  {project.id ? (
                    <FeaturedToggleButton
                      id={project.id}
                      featured={project.featured}
                    />
                  ) : (
                    <span className="font-[family-name:var(--font-ui)] text-xs text-silver/30">
                      —
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-ui)] text-xs text-silver/50">
                  {project.projectDate
                    ? new Date(project.projectDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded px-2.5 py-1 font-[family-name:var(--font-ui)] text-xs text-mariner transition-colors hover:bg-mariner/10"
                    >
                      Edit
                    </Link>
                    {project.id && (
                      <DeleteProjectButton id={project.id} title={project.title} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center font-[family-name:var(--font-body)] text-sm text-silver/40">
            {search ? "No projects match your search." : "No projects yet."}
          </p>
        )}
      </div>
    </div>
  );
}
