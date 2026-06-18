"use client";

import { useEffect, useState } from "react";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateContactPage } from "@/lib/site-settings/pages/actions";
import type { ContactPageContent } from "@/lib/site-settings/pages/types";
import { cn } from "@/lib/utils";

interface ContactPageEditorProps {
  initial: ContactPageContent;
}

export function ContactPageEditor({ initial }: ContactPageEditorProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateHeader(field: keyof ContactPageContent["header"], value: string) {
    setForm((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }

  function updateSidebar(
    field: keyof ContactPageContent["sidebar"],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, [field]: value },
    }));
  }

  function updateFormSuccess(
    field: keyof ContactPageContent["formSuccess"],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      formSuccess: { ...prev.formSuccess, [field]: value },
    }));
  }

  function updateFormOption(
    field: keyof ContactPageContent["form"],
    index: number,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: prev.form[field].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  }

  function addFormOption(field: keyof ContactPageContent["form"]) {
    setForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: [...prev.form[field], ""],
      },
    }));
  }

  function removeFormOption(
    field: keyof ContactPageContent["form"],
    index: number
  ) {
    setForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: prev.form[field].filter((_, i) => i !== index),
      },
    }));
  }

  function renderOptionList(
    field: keyof ContactPageContent["form"],
    label: string
  ) {
    return (
      <div className="space-y-3">
        <FieldLabel>{label}</FieldLabel>
        {form.form[field].map((option, index) => (
          <div key={`${field}-${index}`} className="flex gap-3">
            <input
              className={inputClass}
              value={option}
              onChange={(e) => updateFormOption(field, index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            {form.form[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeFormOption(field, index)}
                className="shrink-0 font-[family-name:var(--font-ui)] text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addFormOption(field)}
          className="font-[family-name:var(--font-ui)] text-sm text-mariner hover:text-white"
        >
          + Add option
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-8">
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

      <SectionCard
        title="Sidebar"
        description="Contact details shown beside the form."
      >
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            className={inputClass}
            value={form.sidebar.title}
            onChange={(e) => updateSidebar("title", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.sidebar.description}
            onChange={(e) => updateSidebar("description", e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <input
            className={inputClass}
            type="email"
            value={form.sidebar.email}
            onChange={(e) => updateSidebar("email", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Location</FieldLabel>
          <input
            className={inputClass}
            value={form.sidebar.location}
            onChange={(e) => updateSidebar("location", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Response time</FieldLabel>
          <input
            className={inputClass}
            value={form.sidebar.responseTime}
            onChange={(e) => updateSidebar("responseTime", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Form dropdowns"
        description="Options shown in the Project type and Budget range menus on the contact form."
      >
        <div className="space-y-8">
          {renderOptionList("projectTypes", "Project type options")}
          {renderOptionList("budgetRanges", "Budget range options")}
        </div>
      </SectionCard>

      <SectionCard
        title="Form success message"
        description="Shown after someone submits the contact form."
      >
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            className={inputClass}
            value={form.formSuccess.title}
            onChange={(e) => updateFormSuccess("title", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Message</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.formSuccess.message}
            onChange={(e) => updateFormSuccess("message", e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <FieldLabel>Reset link label</FieldLabel>
          <input
            className={inputClass}
            value={form.formSuccess.resetLabel}
            onChange={(e) => updateFormSuccess("resetLabel", e.target.value)}
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

      <SaveSectionButton label="Save page" onSave={() => updateContactPage(form)} />
    </div>
  );
}
