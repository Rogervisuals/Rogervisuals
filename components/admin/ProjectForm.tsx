"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import {
  createProject,
  updateProject,
  deleteProject,
  type ProjectFormData,
} from "@/lib/projects/actions";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { BrandingSectionsEditor } from "@/components/admin/BrandingSectionsEditor";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { FeaturedMediaEditor } from "@/components/admin/FeaturedMediaEditor";
import { PhotosEditor } from "@/components/admin/PhotosEditor";
import { LongTermSectionsEditor } from "@/components/admin/LongTermSectionsEditor";
import { LongTermVfxAdminPanel } from "@/components/admin/LongTermVfxAdminPanel";
import { VfxComparisonsEditor } from "@/components/admin/VfxComparisonsEditor";
import { VideoModeSelect } from "@/components/admin/VideoModeSelect";
import {
  createBrandingSection,
  longTermFeaturedDefaults,
  longTermVfxDefaults,
  projectIsBranding,
  projectIsPhotography,
  projectIsVfx,
  type Project,
  type ProjectPageLayout,
} from "@/lib/projects/types";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  project?: Project;
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function toFormState(project?: Project): ProjectFormData {
  return {
    pageLayout: project?.pageLayout ?? "single",
    title: project?.title ?? "",
    client: project?.client ?? "",
    clientUrl: project?.clientUrl ?? null,
    type: project?.projectType ?? "",
    categories: project?.categories ?? [],
    slug: project?.slug ?? "",
    thumbnailUrl: project?.thumbnailUrl ?? null,
    videoUrl: project?.videoUrl ?? null,
    videoMode: project?.videoMode ?? "auto",
    photos: project?.photos ?? [],
    brandingSections:
      project?.brandingSections && project.brandingSections.length > 0
        ? project.brandingSections
        : [createBrandingSection()],
    vfxComparisons:
      project?.vfxComparisons && project.vfxComparisons.length > 0
        ? project.vfxComparisons
        : [{ beforeUrl: "", afterUrl: "" }],
    galleryEnabled: project?.galleryEnabled ?? false,
    galleryLabel: project?.galleryLabel ?? "Gallery",
    galleryTitle: project?.galleryTitle ?? "Behind the Scenes",
    galleryImages: project?.galleryImages ?? [],
    featuredMedia: project?.featuredMedia ?? [],
    statsEnabled: project?.statsEnabled ?? false,
    statsLabel: project?.statsLabel ?? "Impact",
    statsTitle: project?.statsTitle ?? "By the Numbers",
    statViews: project?.statViews ?? project?.stat ?? "",
    statVideosEdited: project?.statVideosEdited ?? "",
    statYearsCollaboration: project?.statYearsCollaboration ?? "",
    shortDescription: project?.description ?? "",
    challenge: project?.challenge ?? "",
    approach: project?.approach ?? "",
    result: project?.result ?? "",
    projectDate: project?.projectDate ?? null,
    featured: project?.featured ?? false,
    displayOrder: project?.displayOrder ?? 0,
    published: project?.published ?? false,
    longTermFeaturedContent:
      project?.longTermFeaturedContent ?? longTermFeaturedDefaults,
    longTermVfxSection: project?.longTermVfxSection ?? longTermVfxDefaults,
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";

const layoutOptions: { value: ProjectPageLayout; label: string; description: string }[] = [
  {
    value: "single",
    label: "Single",
    description: "Standard case study layout with left-aligned content.",
  },
  {
    value: "long_term",
    label: "Long term",
    description:
      "Case study layout with stats, featured content grid, and supporting VFX section.",
  },
];

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>(toFormState(project));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const isPhotography = projectIsPhotography(form.categories);
  const isBranding = projectIsBranding(form.categories);
  const isVfx = projectIsVfx(form.categories);
  const isLongTerm = form.pageLayout === "long_term";
  const hasVideography = form.categories.includes("videography");
  const showVideoFields = !isPhotography && (!isBranding || hasVideography);

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugTouched) {
      update("slug", slugify(title));
    }
  }

  function submit(published: boolean) {
    setError(null);
    if (form.categories.length === 0) {
      setError("Select at least one category.");
      return;
    }
    const payload = { ...form, published };

    startTransition(async () => {
      if (mode === "create") {
        const result = await createProject(payload);
        if (result?.error) setError(result.error);
      } else if (project?.id) {
        const result = await updateProject(project.id, payload);
        if (result?.error) setError(result.error);
        else router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!project?.id) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteProject(project.id!);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto max-w-3xl space-y-8 px-8 py-8"
    >
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <FieldLabel>Page layout</FieldLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {layoutOptions.map((option) => {
            const selected = form.pageLayout === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => update("pageLayout", option.value)}
                className={cn(
                  "rounded-md border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-mariner/50 bg-mariner/10"
                    : "border-white/10 bg-shark hover:border-white/20"
                )}
              >
                <span className="block font-[family-name:var(--font-ui)] text-sm text-white">
                  {option.label}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-body)] text-xs text-silver/50">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>
        <div>
          <FieldLabel>Client</FieldLabel>
          <input
            className={inputClass}
            value={form.client}
            onChange={(e) => update("client", e.target.value)}
            required
          />
          <input
            className={cn(inputClass, "mt-3")}
            type="url"
            placeholder="Client website URL (optional)"
            value={form.clientUrl ?? ""}
            onChange={(e) => update("clientUrl", e.target.value || null)}
          />
          <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
            When set, the client name links to this URL on the project page.
          </p>
        </div>
      </div>

      <div>
        <FieldLabel>Type</FieldLabel>
        <input
          className={inputClass}
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          placeholder="e.g. Event Film, Commercial, Music Video"
        />
        <p className="mt-2 font-[family-name:var(--font-body)] text-xs text-silver/40">
          Shown on the case study as Type. Leave blank to use category names instead.
        </p>
      </div>

      <div>
        <FieldLabel>Categories</FieldLabel>
        <p className="mb-3 font-[family-name:var(--font-body)] text-xs text-silver/40">
          Select all that apply — e.g. Videography + Montage if you filmed and edited.
        </p>
        <CategorySelect
          value={form.categories}
          onChange={(categories) => update("categories", categories)}
        />
      </div>

      <div>
        <FieldLabel>Slug</FieldLabel>
        <input
          className={inputClass}
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", slugify(e.target.value));
          }}
          required
        />
      </div>

      {isPhotography && (
        <>
          <div>
            <FieldLabel>Cover thumbnail</FieldLabel>
            <p className="mb-3 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Shown on project cards. Upload a custom image, or pick one from your photos below.
            </p>
            <ThumbnailUpload
              value={form.thumbnailUrl}
              onChange={(url) => update("thumbnailUrl", url)}
              slug={form.slug}
              pathPrefix="covers/"
            />
          </div>

          <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
            <FieldLabel>Photos</FieldLabel>
            <p className="mb-4 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Upload your project photos. Use &quot;Set as cover&quot; on any photo to use it as the card thumbnail.
            </p>
            <PhotosEditor
              photos={form.photos}
              onChange={(photos) => update("photos", photos)}
              slug={form.slug}
              coverUrl={form.thumbnailUrl}
              onSetCover={(url) => update("thumbnailUrl", url)}
            />
          </div>
        </>
      )}

      {isBranding && (
        <>
          <div>
            <FieldLabel>Cover thumbnail</FieldLabel>
            <p className="mb-3 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Shown on project cards. Upload a custom image, or pick one from your sections below.
            </p>
            <ThumbnailUpload
              value={form.thumbnailUrl}
              onChange={(url) => update("thumbnailUrl", url)}
              slug={form.slug}
              pathPrefix="covers/"
            />
          </div>

          <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
            <FieldLabel>Branding sections</FieldLabel>
            <p className="mb-4 font-[family-name:var(--font-body)] text-xs text-silver/40">
              Add titled sections for logos, business cards, mockups, and more. Each section gets its own heading on the case study page.
            </p>
            <BrandingSectionsEditor
              sections={form.brandingSections}
              onChange={(brandingSections) => update("brandingSections", brandingSections)}
              slug={form.slug}
              coverUrl={form.thumbnailUrl}
              onSetCover={(url) => update("thumbnailUrl", url)}
            />
          </div>
        </>
      )}

      {isVfx && isLongTerm && (
        <LongTermVfxAdminPanel
          vfxSection={form.longTermVfxSection}
          comparisons={form.vfxComparisons}
          slug={form.slug}
          onVfxSectionChange={(longTermVfxSection) =>
            update("longTermVfxSection", longTermVfxSection)
          }
          onComparisonsChange={(vfxComparisons) =>
            update("vfxComparisons", vfxComparisons)
          }
        />
      )}

      {isVfx && !isLongTerm && (
        <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
          <FieldLabel>Before & after comparisons</FieldLabel>
          <p className="mb-4 font-[family-name:var(--font-body)] text-xs text-silver/40">
            Add one or more comparisons. They appear in a 3-column grid on the case study page.
          </p>
          <VfxComparisonsEditor
            comparisons={form.vfxComparisons}
            onChange={(vfxComparisons) => update("vfxComparisons", vfxComparisons)}
            slug={form.slug}
          />
        </div>
      )}

      {showVideoFields && (
        <>
          {!isBranding && (
            <div>
              <FieldLabel>Thumbnail</FieldLabel>
              <p className="mb-3 font-[family-name:var(--font-body)] text-xs text-silver/40">
                Used on project cards and as the horizontal preview for Instagram, TikTok, and other external videos.
              </p>
              <ThumbnailUpload
                value={form.thumbnailUrl}
                onChange={(url) => update("thumbnailUrl", url)}
                slug={form.slug}
              />
            </div>
          )}

          <div>
            <FieldLabel>Video URL</FieldLabel>
            <input
              className={inputClass}
              type="url"
              placeholder="Instagram reel, YouTube, TikTok, Vimeo, or direct .mp4 link"
              value={form.videoUrl ?? ""}
              onChange={(e) => update("videoUrl", e.target.value || null)}
            />
          </div>

          {form.videoUrl && (
            <div>
              <FieldLabel>Video display</FieldLabel>
              <VideoModeSelect
                value={form.videoMode}
                onChange={(videoMode) => update("videoMode", videoMode)}
                videoUrl={form.videoUrl}
              />
            </div>
          )}
        </>
      )}

      <div>
        <FieldLabel>Short Description</FieldLabel>
        <textarea
          className={cn(inputClass, "min-h-24 resize-y")}
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <FieldLabel>Challenge</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-32 resize-y")}
            value={form.challenge}
            onChange={(e) => update("challenge", e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <FieldLabel>Approach</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-32 resize-y")}
            value={form.approach}
            onChange={(e) => update("approach", e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <FieldLabel>Result</FieldLabel>
          <textarea
            className={cn(inputClass, "min-h-32 resize-y")}
            value={form.result}
            onChange={(e) => update("result", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
        <FieldLabel>Full-width media</FieldLabel>
        <p className="mb-4 font-[family-name:var(--font-body)] text-xs text-silver/40">
          Upload images, GIFs, or MP4 videos shown full width above the Behind the
          Scenes gallery. Use this when you don&apos;t have a link for the main
          video field.
        </p>
        <FeaturedMediaEditor
          media={form.featuredMedia}
          onChange={(featuredMedia) => update("featuredMedia", featuredMedia)}
          slug={form.slug}
        />
      </div>

      <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <FieldLabel>Behind the Scenes gallery</FieldLabel>
            <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
              Show a gallery section on the case study page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update("galleryEnabled", !form.galleryEnabled)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              form.galleryEnabled ? "bg-mariner" : "bg-mine-shaft"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                form.galleryEnabled && "translate-x-5"
              )}
            />
          </button>
        </div>

        {form.galleryEnabled && (
          <div className="mt-6 space-y-6 border-t border-white/5 pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel>Section label</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="Gallery"
                  value={form.galleryLabel}
                  onChange={(e) => update("galleryLabel", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Section title</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="Behind the Scenes"
                  value={form.galleryTitle}
                  onChange={(e) => update("galleryTitle", e.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Gallery images</FieldLabel>
              <GalleryEditor
                images={form.galleryImages}
                onChange={(galleryImages) => update("galleryImages", galleryImages)}
                slug={form.slug}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <FieldLabel>Project stats</FieldLabel>
            <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
              Show impact numbers on the case study page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update("statsEnabled", !form.statsEnabled)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              form.statsEnabled ? "bg-mariner" : "bg-mine-shaft"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                form.statsEnabled && "translate-x-5"
              )}
            />
          </button>
        </div>

        {form.statsEnabled && (
          <div className="mt-6 space-y-6 border-t border-white/5 pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel>Section label</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="Impact"
                  value={form.statsLabel}
                  onChange={(e) => update("statsLabel", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Section title</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="By the Numbers"
                  value={form.statsTitle}
                  onChange={(e) => update("statsTitle", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <FieldLabel>Views generated</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="e.g. 500M+"
                  value={form.statViews}
                  onChange={(e) => update("statViews", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Videos edited</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="e.g. 200+"
                  value={form.statVideosEdited}
                  onChange={(e) => update("statVideosEdited", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Years collaboration</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="e.g. 3+"
                  value={form.statYearsCollaboration}
                  onChange={(e) =>
                    update("statYearsCollaboration", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLongTerm && (
        <LongTermSectionsEditor
          featuredContent={form.longTermFeaturedContent}
          slug={form.slug}
          onFeaturedContentChange={(longTermFeaturedContent) =>
            update("longTermFeaturedContent", longTermFeaturedContent)
          }
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Project Date</FieldLabel>
          <input
            className={inputClass}
            type="date"
            value={form.projectDate ?? ""}
            onChange={(e) => update("projectDate", e.target.value || null)}
          />
        </div>
        <div>
          <FieldLabel>Display Order</FieldLabel>
          <input
            className={inputClass}
            type="number"
            min={0}
            value={form.displayOrder}
            onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update("featured", !form.featured)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            form.featured ? "bg-mariner" : "bg-mine-shaft"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
              form.featured && "translate-x-5"
            )}
          />
        </button>
        <span className="font-[family-name:var(--font-ui)] text-sm text-silver/70">
          Featured project
        </span>
        {project && (
          <span
            className={cn(
              "ml-2 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-wider",
              project.published
                ? "bg-green-500/15 text-green-400"
                : "bg-white/5 text-silver/50"
            )}
          >
            {project.published ? "Published" : "Draft"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-8">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(false)}
          className="rounded-md border border-white/10 px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm text-silver transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(true)}
          className="rounded-md bg-mariner px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm text-white transition-colors hover:bg-mariner/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Publish"}
        </button>

        {mode === "edit" && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="ml-auto rounded-md border border-red-500/30 px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            Delete project
          </button>
        )}
      </div>
    </form>
  );
}
