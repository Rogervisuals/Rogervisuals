"use client";

import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import { FieldLabel, inputClass } from "@/components/admin/homepage/shared";
import { HERO_COLLAGE_LAYOUT } from "@/lib/site-settings/hero-collage-layout";
import type { HeroCollagePanel } from "@/lib/site-settings/types";

interface HeroCollagePanelsEditorProps {
  panels: HeroCollagePanel[];
  onChange: (panels: HeroCollagePanel[]) => void;
}

export function HeroCollagePanelsEditor({
  panels,
  onChange,
}: HeroCollagePanelsEditorProps) {
  function updatePanel(
    index: number,
    field: keyof HeroCollagePanel,
    value: string | null
  ) {
    onChange(
      panels.map((panel, i) =>
        i === index
          ? {
              ...panel,
              [field]:
                field === "imageUrl" ? value : (value ?? ""),
            }
          : panel
      )
    );
  }

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <div>
        <h4 className="font-[family-name:var(--font-ui)] text-sm text-white">
          Hero collage panels
        </h4>
        <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
          The five vertical panels on the right side of the hero. Upload an image
          for each — without an image, the colored placeholder shows instead.
          Labels appear on the first and last panel only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className="rounded-lg border border-white/10 bg-shark/40 p-4"
          >
            <p className="mb-3 font-[family-name:var(--font-ui)] text-xs text-silver/50">
              Panel {index + 1}
              {HERO_COLLAGE_LAYOUT[index]?.showLabel
                ? " · label shown"
                : " · image only"}
            </p>

            <div className="mb-4">
              <FieldLabel>Label</FieldLabel>
              <input
                className={inputClass}
                value={panel.label}
                onChange={(e) => updatePanel(index, "label", e.target.value)}
                placeholder={`Panel ${index + 1}`}
              />
            </div>

            <ThumbnailUpload
              value={panel.imageUrl}
              onChange={(url) => updatePanel(index, "imageUrl", url)}
              slug={`hero-collage-${panel.id}`}
              pathPrefix="hero-collage/"
              aspectClass="aspect-[3/14] max-w-[5rem]"
              emptyLabel="No image"
              uploadLabel="Upload image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
