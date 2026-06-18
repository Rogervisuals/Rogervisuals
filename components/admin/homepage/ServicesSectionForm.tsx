"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateServicesSection } from "@/lib/site-settings/actions";
import type { ServicesSectionContent } from "@/lib/site-settings/types";
import { cn } from "@/lib/utils";

interface ServicesSectionFormProps {
  initial: ServicesSectionContent;
}

export function ServicesSectionForm({ initial }: ServicesSectionFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateService(
    index: number,
    field: "title" | "description",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  }

  return (
    <SectionCard
      title="Services"
      description="Services grid on the homepage."
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

      <div>
        <FieldLabel>Section description</FieldLabel>
        <textarea
          className={cn(inputClass, "min-h-24 resize-y")}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="space-y-4">
        {form.services.map((service, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-white/10 bg-shark/40 p-4"
          >
            <p className="font-[family-name:var(--font-ui)] text-sm text-white">
              Service {index + 1}
            </p>
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                className={inputClass}
                value={service.title}
                onChange={(e) => updateService(index, "title", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                className={cn(inputClass, "min-h-20 resize-y")}
                value={service.description}
                onChange={(e) =>
                  updateService(index, "description", e.target.value)
                }
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <SaveSectionButton onSave={() => updateServicesSection(form)} />
    </SectionCard>
  );
}
