"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateHeroSection } from "@/lib/site-settings/actions";
import type { HeroSectionContent } from "@/lib/site-settings/types";
import { cn } from "@/lib/utils";

interface HeroSectionFormProps {
  initial: HeroSectionContent;
}

export function HeroSectionForm({ initial }: HeroSectionFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function update<K extends keyof HeroSectionContent>(
    key: K,
    value: HeroSectionContent[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SectionCard
      title="Hero"
      description="Main headline and call-to-action at the top of the homepage."
    >
      <div>
        <FieldLabel>Eyebrow</FieldLabel>
        <input
          className={inputClass}
          value={form.eyebrow}
          onChange={(e) => update("eyebrow", e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Headline line 1</FieldLabel>
          <input
            className={inputClass}
            value={form.headlineLine1}
            onChange={(e) => update("headlineLine1", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Headline line 2</FieldLabel>
          <input
            className={inputClass}
            value={form.headlineLine2}
            onChange={(e) => update("headlineLine2", e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          className={cn(inputClass, "min-h-24 resize-y")}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Primary button label</FieldLabel>
          <input
            className={inputClass}
            value={form.primaryCtaLabel}
            onChange={(e) => update("primaryCtaLabel", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Primary button link</FieldLabel>
          <input
            className={inputClass}
            value={form.primaryCtaHref}
            onChange={(e) => update("primaryCtaHref", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Secondary button label</FieldLabel>
          <input
            className={inputClass}
            value={form.secondaryCtaLabel}
            onChange={(e) => update("secondaryCtaLabel", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Secondary button link</FieldLabel>
          <input
            className={inputClass}
            value={form.secondaryCtaHref}
            onChange={(e) => update("secondaryCtaHref", e.target.value)}
          />
        </div>
      </div>

      <SaveSectionButton onSave={() => updateHeroSection(form)} />
    </SectionCard>
  );
}
