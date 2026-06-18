"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateProcessSection } from "@/lib/site-settings/actions";
import type { ProcessSectionContent } from "@/lib/site-settings/types";
import { cn } from "@/lib/utils";

interface ProcessSectionFormProps {
  initial: ProcessSectionContent;
}

export function ProcessSectionForm({ initial }: ProcessSectionFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateStep(
    index: number,
    field: "step" | "title" | "description",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  }

  return (
    <SectionCard
      title="Process"
      description="How you work — shown as steps on the homepage."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Section label</FieldLabel>
          <input
            className={inputClass}
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          />
        </div>
        <div>
          <FieldLabel>Section title</FieldLabel>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        {form.steps.map((step, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-white/10 bg-shark/40 p-4"
          >
            <p className="font-[family-name:var(--font-ui)] text-sm text-white">
              Step {index + 1}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <FieldLabel>Number</FieldLabel>
                <input
                  className={inputClass}
                  value={step.step}
                  onChange={(e) => updateStep(index, "step", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Title</FieldLabel>
                <input
                  className={inputClass}
                  value={step.title}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                value={step.description}
                onChange={(e) =>
                  updateStep(index, "description", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <SaveSectionButton onSave={() => updateProcessSection(form)} />
    </SectionCard>
  );
}
