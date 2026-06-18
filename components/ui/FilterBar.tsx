"use client";

import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/data/projects";

interface FilterBarProps {
  filters: { label: string; value: ProjectCategory }[];
  active: ProjectCategory;
  onChange: (value: ProjectCategory) => void;
}

export function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            "type-meta px-4 py-2.5 transition-all duration-300",
            active === filter.value
              ? "bg-mariner text-white"
              : "border border-white/10 text-silver/75 hover:border-mariner/50 hover:text-white"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
