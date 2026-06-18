"use client";

import { useEffect, useState } from "react";
import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateGeneralSettings } from "@/lib/site-settings/general-actions";
import type { GeneralSettings, SocialPlatform } from "@/lib/site-settings/general";
import { cn } from "@/lib/utils";

const socialPlatforms: { key: SocialPlatform; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "behance", label: "Behance" },
];

interface GeneralSettingsFormProps {
  initial: GeneralSettings;
}

const colorFields: {
  key: keyof GeneralSettings["colors"];
  label: string;
}[] = [
  { key: "shark", label: "Background (Shark)" },
  { key: "mineShaft", label: "Surface (Mine Shaft)" },
  { key: "mariner", label: "Accent (Mariner)" },
  { key: "silver", label: "Body text (Silver)" },
  { key: "white", label: "Headings (White)" },
];

export function GeneralSettingsForm({ initial }: GeneralSettingsFormProps) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateNested<
    S extends keyof GeneralSettings,
    F extends keyof GeneralSettings[S],
  >(section: S, field: F, value: GeneralSettings[S][F]) {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  function updateSocial(platform: SocialPlatform, url: string) {
    setForm((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: { ...prev.footer.socialLinks, [platform]: url },
      },
    }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-8">
      <SectionCard
        title="Branding"
        description="Site name, logo, and favicon shown across the site."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <FieldLabel>Site name</FieldLabel>
            <input
              className={inputClass}
              value={form.branding.siteName}
              onChange={(e) =>
                updateNested("branding", "siteName", e.target.value)
              }
            />
          </div>
          <div>
            <FieldLabel>Logo initial (fallback)</FieldLabel>
            <input
              className={inputClass}
              value={form.branding.logoInitial}
              onChange={(e) =>
                updateNested(
                  "branding",
                  "logoInitial",
                  e.target.value.slice(0, 2)
                )
              }
              maxLength={2}
              placeholder="R"
            />
            <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Shown in the logo box when no image is uploaded.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Site logo</FieldLabel>
            <ThumbnailUpload
              value={form.branding.logoUrl}
              onChange={(url) => updateNested("branding", "logoUrl", url)}
              slug="site-logo"
              pathPrefix="site/"
              aspectClass="aspect-square max-w-[8rem]"
              emptyLabel="No logo uploaded"
              uploadLabel="Upload logo"
              imageFit="contain"
            />
          </div>
          <div>
            <FieldLabel>Favicon</FieldLabel>
            <ThumbnailUpload
              value={form.branding.faviconUrl}
              onChange={(url) => updateNested("branding", "faviconUrl", url)}
              slug="site-favicon"
              pathPrefix="site/"
              aspectClass="aspect-square max-w-[5rem]"
              emptyLabel="No favicon uploaded"
              uploadLabel="Upload favicon"
              compact
              imageFit="contain"
            />
            <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Shown in the browser tab. Square PNG or ICO works best.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Colors"
        description="Brand colors used across the site. Use hex values like #2c72b8."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {colorFields.map(({ key, label }) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.colors[key]}
                  onChange={(e) =>
                    updateNested("colors", key, e.target.value)
                  }
                  className="h-10 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                />
                <input
                  className={cn(inputClass, "font-mono text-xs")}
                  value={form.colors[key]}
                  onChange={(e) =>
                    updateNested("colors", key, e.target.value)
                  }
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Typography"
        description="Adjust the overall text size across the site."
      >
        <div>
          <FieldLabel>
            Font size scale — {Math.round(form.typography.fontScale * 100)}%
          </FieldLabel>
          <input
            type="range"
            min={0.85}
            max={1.25}
            step={0.05}
            value={form.typography.fontScale}
            onChange={(e) =>
              updateNested(
                "typography",
                "fontScale",
                Number(e.target.value)
              )
            }
            className="mt-2 w-full accent-mariner"
          />
          <div className="mt-2 flex justify-between font-[family-name:var(--font-body)] text-xs text-silver/40">
            <span>Smaller (85%)</span>
            <span>Default (100%)</span>
            <span>Larger (125%)</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer"
        description="Content shown in the site footer."
      >
        <div>
          <FieldLabel>Tagline</FieldLabel>
          <input
            className={inputClass}
            value={form.footer.tagline}
            onChange={(e) => updateNested("footer", "tagline", e.target.value)}
            placeholder="Let's work together"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>Email</FieldLabel>
            <input
              className={inputClass}
              type="email"
              value={form.footer.email}
              onChange={(e) => updateNested("footer", "email", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <input
              className={inputClass}
              value={form.footer.location}
              onChange={(e) =>
                updateNested("footer", "location", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <FieldLabel>Copyright name</FieldLabel>
          <input
            className={inputClass}
            value={form.footer.copyrightName}
            onChange={(e) =>
              updateNested("footer", "copyrightName", e.target.value)
            }
          />
        </div>

        <div className="space-y-4 border-t border-white/10 pt-6">
          <div>
            <h4 className="font-[family-name:var(--font-ui)] text-sm text-white">
              Social links
            </h4>
            <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Shown as icons in the footer bottom bar. Leave blank or remove to
              hide an icon.
            </p>
          </div>

          {socialPlatforms.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg border border-white/10 bg-shark/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-[family-name:var(--font-ui)] text-sm text-white">
                  {label}
                </p>
                {form.footer.socialLinks[key] && (
                  <button
                    type="button"
                    onClick={() => updateSocial(key, "")}
                    className="font-[family-name:var(--font-ui)] text-xs text-red-400/80 transition-colors hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className={inputClass}
                type="url"
                value={form.footer.socialLinks[key]}
                onChange={(e) => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/your-profile`}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="SEO"
        description="Default title and description for search engines and social sharing."
      >
        <div>
          <FieldLabel>Site title</FieldLabel>
          <input
            className={inputClass}
            value={form.seo.title}
            onChange={(e) => updateNested("seo", "title", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Site description</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.seo.description}
            onChange={(e) =>
              updateNested("seo", "description", e.target.value)
            }
            rows={3}
          />
        </div>
      </SectionCard>

      <SaveSectionButton
        label="Save settings"
        onSave={() => updateGeneralSettings(form)}
      />
    </div>
  );
}
