"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateWorkPage } from "@/lib/site-settings/pages/actions";
import type { WorkPageContent } from "@/lib/site-settings/pages/types";
import { cn } from "@/lib/utils";

interface WorkPageEditorProps {
  initial: WorkPageContent;
}

export function WorkPageEditor({ initial }: WorkPageEditorProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateHeader(field: keyof WorkPageContent["header"], value: string) {
    setForm((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-8">
      <div className="rounded-lg border border-mariner/20 bg-mariner/5 px-5 py-4">
        <p className="font-[family-name:var(--font-body)] text-sm text-silver/70">
          Project cards on this page come from{" "}
          <Link href="/admin/projects" className="text-mariner hover:text-white">
            Projects
          </Link>
          . Use this editor for the page header and SEO only.
        </p>
      </div>

      <SectionCard title="Page header" description="Title area at the top of the page.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Label</FieldLabel>
            <input
              className={inputClass}
              value={form.header.label}
              onChange={(e) => updateHeader("label", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Title</FieldLabel>
            <input
              className={inputClass}
              value={form.header.title}
              onChange={(e) => updateHeader("title", e.target.value)}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.header.description}
            onChange={(e) => updateHeader("description", e.target.value)}
            rows={3}
          />
        </div>
      </SectionCard>

      <SectionCard title="SEO" description="Search engine title and description.">
        <div>
          <FieldLabel>Page title</FieldLabel>
          <input
            className={inputClass}
            value={form.seo.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                seo: { ...prev.seo, title: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <FieldLabel>Meta description</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.seo.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                seo: { ...prev.seo, description: e.target.value },
              }))
            }
            rows={3}
          />
        </div>
      </SectionCard>

      <SaveSectionButton label="Save page" onSave={() => updateWorkPage(form)} />
    </div>
  );
}
