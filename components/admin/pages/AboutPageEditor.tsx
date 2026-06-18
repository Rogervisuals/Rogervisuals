"use client";

import { useEffect, useState } from "react";
import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateAboutPage } from "@/lib/site-settings/pages/actions";
import type { AboutPageContent } from "@/lib/site-settings/pages/types";
import { cn } from "@/lib/utils";

interface AboutPageEditorProps {
  initial: AboutPageContent;
}

export function AboutPageEditor({ initial }: AboutPageEditorProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateHeader(field: keyof AboutPageContent["header"], value: string) {
    setForm((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }

  function updateBio(field: "heading", value: string) {
    setForm((prev) => ({
      ...prev,
      bio: { ...prev.bio, [field]: value },
    }));
  }

  function updateParagraph(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        paragraphs: prev.bio.paragraphs.map((p, i) =>
          i === index ? value : p
        ),
      },
    }));
  }

  function addParagraph() {
    setForm((prev) => ({
      ...prev,
      bio: { ...prev.bio, paragraphs: [...prev.bio.paragraphs, ""] },
    }));
  }

  function removeParagraph(index: number) {
    setForm((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        paragraphs: prev.bio.paragraphs.filter((_, i) => i !== index),
      },
    }));
  }

  function updateService(
    index: number,
    field: "title" | "description",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        services: prev.expertise.services.map((service, i) =>
          i === index ? { ...service, [field]: value } : service
        ),
      },
    }));
  }

  function updateStat(
    index: number,
    field: "value" | "label",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }));
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

      <SectionCard title="Portrait" description="Profile image shown beside the bio.">
        <ThumbnailUpload
          value={form.portraitUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, portraitUrl: url }))}
          slug="about-portrait"
          pathPrefix="pages/about"
          aspectClass="aspect-[4/5]"
          emptyLabel="No portrait uploaded"
          uploadLabel="Upload portrait"
          matchImageAspect
          maxPreviewHeight={360}
        />
      </SectionCard>

      <SectionCard title="Bio" description="Introduction text and call-to-action.">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            className={inputClass}
            value={form.bio.heading}
            onChange={(e) => updateBio("heading", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {form.bio.paragraphs.map((paragraph, index) => (
            <div key={index}>
              <div className="mb-2 flex items-center justify-between">
                <FieldLabel>Paragraph {index + 1}</FieldLabel>
                {form.bio.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="font-[family-name:var(--font-ui)] text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={4}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="font-[family-name:var(--font-ui)] text-sm text-mariner hover:text-white"
          >
            + Add paragraph
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Button label</FieldLabel>
            <input
              className={inputClass}
              value={form.cta.label}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, label: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <FieldLabel>Button link</FieldLabel>
            <input
              className={inputClass}
              value={form.cta.href}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, href: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Expertise" description="Services grid on the About page.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Section label</FieldLabel>
            <input
              className={inputClass}
              value={form.expertise.label}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  expertise: { ...prev.expertise, label: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <FieldLabel>Section title</FieldLabel>
            <input
              className={inputClass}
              value={form.expertise.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  expertise: { ...prev.expertise, title: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          {form.expertise.services.map((service, index) => (
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
      </SectionCard>

      <SectionCard title="Stats" description="Highlight numbers at the bottom of the page.">
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

      <SaveSectionButton label="Save page" onSave={() => updateAboutPage(form)} />
    </div>
  );
}
