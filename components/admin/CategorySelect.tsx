"use client";

import {
  categoryOptions,
  type ProjectCategoryValue,
} from "@/lib/projects/types";
import { cn } from "@/lib/utils";

interface CategorySelectProps {
  value: ProjectCategoryValue[];
  onChange: (categories: ProjectCategoryValue[]) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  function toggle(category: ProjectCategoryValue) {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categoryOptions.map((opt) => {
        const selected = value.includes(opt.value as ProjectCategoryValue);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value as ProjectCategoryValue)}
            className={cn(
              "rounded-md border px-3 py-2 font-[family-name:var(--font-ui)] text-sm transition-colors",
              selected
                ? "border-mariner bg-mariner/15 text-white"
                : "border-white/10 text-silver/60 hover:border-white/20 hover:text-white"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
