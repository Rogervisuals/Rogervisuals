"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateStatsSection } from "@/lib/site-settings/actions";
import type { StatsSectionContent } from "@/lib/site-settings/types";

interface StatsSectionFormProps {
  initial: StatsSectionContent;
}

export function StatsSectionForm({ initial }: StatsSectionFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateStat(
    index: number,
    field: "value" | "label",
    value: string
  ) {
    setForm((prev) => ({
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }));
  }

  return (
    <SectionCard
      title="Stats"
      description="Number highlights shown below the hero section."
    >
      <div className="space-y-4">
        {form.stats.map((stat, index) => (
          <div
            key={index}
            className="grid gap-4 rounded-lg border border-white/10 bg-shark/40 p-4 sm:grid-cols-2"
          >
            <div>
              <FieldLabel>Value</FieldLabel>
              <input
                className={inputClass}
                value={stat.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Label</FieldLabel>
              <input
                className={inputClass}
                value={stat.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <SaveSectionButton onSave={() => updateStatsSection(form)} />
    </SectionCard>
  );
}
