"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateContactSection } from "@/lib/site-settings/actions";
import type { ContactSectionContent } from "@/lib/site-settings/types";
import { cn } from "@/lib/utils";

interface ContactSectionFormProps {
  initial: ContactSectionContent;
}

export function ContactSectionForm({ initial }: ContactSectionFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  return (
    <SectionCard
      title="Contact CTA"
      description="Call-to-action block at the bottom of the homepage."
    >
      <div>
        <FieldLabel>Title</FieldLabel>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          className={cn(inputClass, "min-h-24 resize-y")}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Button label</FieldLabel>
          <input
            className={inputClass}
            value={form.buttonLabel}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, buttonLabel: e.target.value }))
            }
          />
        </div>
        <div>
          <FieldLabel>Button link</FieldLabel>
          <input
            className={inputClass}
            value={form.buttonHref}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, buttonHref: e.target.value }))
            }
          />
        </div>
      </div>

      <SaveSectionButton onSave={() => updateContactSection(form)} />
    </SectionCard>
  );
}
