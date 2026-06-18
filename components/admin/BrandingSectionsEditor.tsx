"use client";

import { useState } from "react";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { createBrandingSection, type BrandingSection } from "@/lib/projects/types";
import { cn, reorderArray } from "@/lib/utils";

interface BrandingSectionsEditorProps {
  sections: BrandingSection[];
  onChange: (sections: BrandingSection[]) => void;
  slug: string;
  coverUrl?: string | null;
  onSetCover?: (url: string | null) => void;
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";

function DragHandleIcon() {
  return (
    <svg
      className="h-4 w-4 text-silver/40"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

export function BrandingSectionsEditor({
  sections,
  onChange,
  slug,
  coverUrl,
  onSetCover,
}: BrandingSectionsEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  function updateSection(
    index: number,
    field: keyof BrandingSection,
    value: BrandingSection[keyof BrandingSection]
  ) {
    const next = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    onChange(next);
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  function reorderSections(fromIndex: number, toIndex: number) {
    onChange(reorderArray(sections, fromIndex, toIndex));
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
    setDropIndex(index);
  }

  function handleDragOver(event: React.DragEvent, index: number) {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDropIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null) return;
    reorderSections(dragIndex, index);
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div className="space-y-6">
      {sections.length > 1 && (
        <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
          Drag sections by the handle to change their order on the case study page.
        </p>
      )}

      {sections.map((section, index) => {
        const isDragging = dragIndex === index;
        const isDropTarget =
          dropIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={section.id ?? index}
            onDragOver={(event) => handleDragOver(event, index)}
            onDrop={() => handleDrop(index)}
            className={cn(
              "rounded-lg border bg-shark/40 p-5 transition-[opacity,box-shadow,border-color]",
              isDragging && "opacity-50",
              isDropTarget
                ? "border-mariner/50 shadow-[0_0_0_1px_rgba(44,114,184,0.35)]"
                : "border-white/10"
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {sections.length > 1 && (
                  <div
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                      handleDragStart(index);
                    }}
                    onDragEnd={handleDragEnd}
                    aria-label={`Drag section ${index + 1}`}
                    className="flex shrink-0 cursor-grab items-center rounded border border-white/10 bg-shark/60 p-2 active:cursor-grabbing"
                  >
                    <DragHandleIcon />
                  </div>
                )}
                <p className="font-[family-name:var(--font-ui)] text-sm text-white">
                  Section {index + 1}
                  {section.title.trim() ? (
                    <span className="text-silver/50"> — {section.title.trim()}</span>
                  ) : null}
                </p>
              </div>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="shrink-0 font-[family-name:var(--font-ui)] text-xs text-red-400/80 transition-colors hover:text-red-300"
                >
                  Remove section
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
                Section title
              </label>
              <input
                className={inputClass}
                value={section.title}
                onChange={(e) => updateSection(index, "title", e.target.value)}
                placeholder="e.g. Logos, Business Cards, Mockups"
              />
            </div>

            <GalleryEditor
              images={section.photos}
              onChange={(photos) => updateSection(index, "photos", photos)}
              slug={`${slug}-branding-${index}`}
              pathPrefix="branding/"
              addLabel="+ Add photos"
              coverUrl={coverUrl}
              onSetCover={onSetCover}
            />
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onChange([...sections, createBrandingSection()])}
        className="w-full rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white"
      >
        + Add section
      </button>
    </div>
  );
}
