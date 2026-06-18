"use client";

import { useState } from "react";
import { VfxComparisonsEditor } from "@/components/admin/VfxComparisonsEditor";
import {
  longTermVfxDefaults,
  type LongTermVfxSection,
  type VfxComparison,
} from "@/lib/projects/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
      {children}
    </label>
  );
}

interface LongTermVfxAdminPanelProps {
  vfxSection: LongTermVfxSection;
  comparisons: VfxComparison[];
  slug: string;
  onVfxSectionChange: (value: LongTermVfxSection) => void;
  onComparisonsChange: (comparisons: VfxComparison[]) => void;
}

export function LongTermVfxAdminPanel({
  vfxSection,
  comparisons,
  slug,
  onVfxSectionChange,
  onComparisonsChange,
}: LongTermVfxAdminPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-white/5 bg-mine-shaft/20">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div>
          <FieldLabel>Before &amp; after comparisons</FieldLabel>
          <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
            Motion graphics copy and comparison sliders for long-term project pages.
          </p>
        </div>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-mariner transition-transform duration-300",
            open && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="space-y-6 border-t border-white/5 px-6 pt-6 pb-6">
          <div>
            <FieldLabel>Section label</FieldLabel>
            <input
              className={inputClass}
              placeholder={longTermVfxDefaults.label}
              value={vfxSection.label}
              onChange={(e) =>
                onVfxSectionChange({ ...vfxSection, label: e.target.value })
              }
            />
          </div>
          <div>
            <FieldLabel>Intro</FieldLabel>
            <textarea
              className={cn(inputClass, "min-h-24 resize-y")}
              placeholder={longTermVfxDefaults.intro}
              value={vfxSection.intro}
              onChange={(e) =>
                onVfxSectionChange({ ...vfxSection, intro: e.target.value })
              }
              rows={3}
            />
          </div>
          <div>
            <FieldLabel>Comparisons</FieldLabel>
            <p className="mb-4 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Add one or more comparisons. They appear in a grid on the long-term project page.
            </p>
            <VfxComparisonsEditor
              comparisons={comparisons}
              onChange={onComparisonsChange}
              slug={slug}
            />
          </div>
        </div>
      )}
    </div>
  );
}
