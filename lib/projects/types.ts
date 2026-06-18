import { savedString } from "@/lib/utils";

export type ProjectCategory =
  | "all"
  | "3d"
  | "branding"
  | "montage"
  | "photography"
  | "vfx"
  | "videography";

export type ProjectCategoryValue = Exclude<ProjectCategory, "all">;

export type VideoModeSetting = "auto" | "embed" | "external";

export type ProjectPageLayout = "single" | "long_term";

export interface VfxComparison {
  beforeUrl: string;
  afterUrl: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface DbVfxComparison {
  before_url: string;
  after_url: string;
  link_url?: string;
  link_label?: string;
}

export interface BrandingSection {
  id?: string;
  title: string;
  photos: string[];
}

export interface DbBrandingSection {
  id?: string;
  title?: string;
  photos?: string[];
}

export function createBrandingSection(): BrandingSection {
  return { id: crypto.randomUUID(), title: "", photos: [] };
}

export interface LongTermFeaturedItem {
  id?: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  mediaUrl: string;
}

export interface LongTermFeaturedContent {
  label: string;
  title: string;
  items: LongTermFeaturedItem[];
}

export interface LongTermVfxSection {
  label: string;
  intro: string;
}

export interface DbLongTermFeaturedItem {
  id?: string;
  title?: string;
  category?: string;
  thumbnail_url?: string;
  media_url?: string;
}

export interface DbLongTermFeaturedContent {
  label?: string;
  title?: string;
  items?: DbLongTermFeaturedItem[];
}

export interface DbLongTermVfxSection {
  label?: string;
  intro?: string;
}

export function createLongTermFeaturedItem(): LongTermFeaturedItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    category: "",
    thumbnailUrl: "",
    mediaUrl: "",
  };
}

export const longTermFeaturedDefaults: LongTermFeaturedContent = {
  label: "Featured Content",
  title: "Selected Work",
  items: [
    {
      id: "music-release-campaigns",
      title: "Music Release Campaigns",
      category: "Campaign Content",
      thumbnailUrl: "",
      mediaUrl: "",
    },
    {
      id: "festival-content",
      title: "Festival Content",
      category: "Live Events",
      thumbnailUrl: "",
      mediaUrl: "",
    },
    {
      id: "tour-content",
      title: "Tour Content",
      category: "Tour Coverage",
      thumbnailUrl: "",
      mediaUrl: "",
    },
    {
      id: "social-reels",
      title: "Social Reels",
      category: "Social Media",
      thumbnailUrl: "",
      mediaUrl: "",
    },
  ],
};

export const longTermVfxDefaults: LongTermVfxSection = {
  label: "Motion Graphics & VFX",
  intro:
    "Beyond social content, this collaboration also included motion graphics, compositing, and visual effects used across promotional campaigns and branded content.",
};

export function normalizeLongTermFeaturedContent(
  value: DbLongTermFeaturedContent | null | undefined
): LongTermFeaturedContent {
  const items = Array.isArray(value?.items)
    ? value.items.map((item) => ({
        id: item.id ?? crypto.randomUUID(),
        title: item.title?.trim() ?? "",
        category: item.category?.trim() ?? "",
        thumbnailUrl: item.thumbnail_url?.trim() ?? "",
        mediaUrl: item.media_url?.trim() ?? "",
      }))
    : [];

  return {
    label: savedString(value?.label, longTermFeaturedDefaults.label),
    title: savedString(value?.title, longTermFeaturedDefaults.title),
    items: items.length > 0 ? items : longTermFeaturedDefaults.items,
  };
}

export function normalizeLongTermVfxSection(
  value: DbLongTermVfxSection | null | undefined
): LongTermVfxSection {
  return {
    label: savedString(value?.label, longTermVfxDefaults.label),
    intro: savedString(value?.intro, longTermVfxDefaults.intro),
  };
}

export interface Project {
  id?: string;
  slug: string;
  title: string;
  client: string;
  clientUrl?: string | null;
  /** Display label on the site (custom type or category fallback). */
  type: string;
  /** Raw value stored in the database; empty means fall back to categories. */
  projectType?: string;
  categories: ProjectCategoryValue[];
  stat: string;
  featured: boolean;
  description: string;
  challenge: string;
  approach: string;
  result: string;
  tags: string[];
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  videoMode?: VideoModeSetting;
  galleryEnabled?: boolean;
  galleryLabel?: string;
  galleryTitle?: string;
  galleryImages?: string[];
  featuredMedia?: string[];
  statsEnabled?: boolean;
  statsLabel?: string;
  statsTitle?: string;
  statViews?: string;
  statVideosEdited?: string;
  statYearsCollaboration?: string;
  photos?: string[];
  brandingSections?: BrandingSection[];
  vfxComparisons?: VfxComparison[];
  pageLayout?: ProjectPageLayout;
  longTermFeaturedContent?: LongTermFeaturedContent;
  longTermVfxSection?: LongTermVfxSection;
  projectDate?: string | null;
  displayOrder?: number;
  published?: boolean;
}

export interface DbProject {
  id: string;
  created_at: string;
  title: string;
  client: string;
  client_url?: string | null;
  project_type?: string;
  categories: ProjectCategoryValue[];
  slug: string;
  thumbnail_url: string | null;
  video_url: string | null;
  video_mode: VideoModeSetting;
  gallery_enabled: boolean;
  gallery_label: string;
  gallery_title: string;
  gallery_images: string[];
  featured_media?: string[];
  stats_enabled: boolean;
  stats_label: string;
  stats_title: string;
  stat_views: string;
  stat_videos_edited: string;
  stat_years_collaboration: string;
  photos?: string[];
  branding_sections?: DbBrandingSection[] | null;
  vfx_comparisons?: DbVfxComparison[] | null;
  vfx_before_url?: string | null;
  vfx_after_url?: string | null;
  page_layout?: ProjectPageLayout;
  long_term_featured_content?: DbLongTermFeaturedContent | null;
  long_term_vfx_section?: DbLongTermVfxSection | null;
  short_description: string;
  challenge: string;
  approach: string;
  result: string;
  featured: boolean;
  views_text: string;
  project_date: string | null;
  display_order: number;
  published: boolean;
}

export const categoryLabels: Record<ProjectCategoryValue, string> = {
  "3d": "3D",
  branding: "Branding",
  montage: "Montage",
  photography: "Photography",
  vfx: "VFX",
  videography: "Videography",
};

const legacyCategoryMap: Record<string, ProjectCategoryValue[]> = {
  "vfx-videography": ["vfx", "videography"],
};

export function normalizeCategories(
  value: unknown
): ProjectCategoryValue[] {
  if (Array.isArray(value)) {
    return value.filter(
      (c): c is ProjectCategoryValue =>
        typeof c === "string" && c in categoryLabels
    );
  }
  if (typeof value === "string") {
    if (value in legacyCategoryMap) return legacyCategoryMap[value];
    if (value in categoryLabels) return [value as ProjectCategoryValue];
  }
  return [];
}

export function getCategoryLabel(category: ProjectCategoryValue): string {
  return categoryLabels[category];
}

export function getCategoriesLabel(
  categories: ProjectCategoryValue[]
): string {
  return categories.map(getCategoryLabel).join(", ");
}

export function projectHasCategory(
  project: Pick<Project, "categories">,
  filter: ProjectCategoryValue
): boolean {
  return project.categories.includes(filter);
}

export function projectIsPhotography(
  categories: ProjectCategoryValue[]
): boolean {
  return categories.includes("photography");
}

export function projectIsBranding(
  categories: ProjectCategoryValue[]
): boolean {
  return categories.includes("branding");
}

export function projectIsVfx(categories: ProjectCategoryValue[]): boolean {
  return categories.includes("vfx");
}

export function normalizeVfxComparisons(row: DbProject): VfxComparison[] {
  if (Array.isArray(row.vfx_comparisons) && row.vfx_comparisons.length > 0) {
    return row.vfx_comparisons
      .map((item) => ({
        beforeUrl: item.before_url ?? "",
        afterUrl: item.after_url ?? "",
        linkUrl: item.link_url?.trim() ?? "",
        linkLabel: item.link_label?.trim() ?? "",
      }))
      .filter((item) => item.beforeUrl && item.afterUrl);
  }

  if (row.vfx_before_url && row.vfx_after_url) {
    return [
      { beforeUrl: row.vfx_before_url, afterUrl: row.vfx_after_url },
    ];
  }

  return [];
}

export function normalizeBrandingSections(row: DbProject): BrandingSection[] {
  if (!Array.isArray(row.branding_sections)) return [];

  return row.branding_sections
    .map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      title: item.title?.trim() ?? "",
      photos: Array.isArray(item.photos)
        ? item.photos.filter((url): url is string => Boolean(url))
        : [],
    }))
    .filter((item) => item.title || item.photos.length > 0);
}

export function getProjectCoverImage(
  project: Pick<
    Project,
    "thumbnailUrl" | "photos" | "brandingSections" | "vfxComparisons"
  >
): string | null {
  const firstVfxAfter = project.vfxComparisons?.[0]?.afterUrl;
  const firstBrandingPhoto = project.brandingSections?.flatMap(
    (section) => section.photos
  )[0];

  return (
    project.thumbnailUrl ??
    project.photos?.[0] ??
    firstBrandingPhoto ??
    firstVfxAfter ??
    null
  );
}

export const projectFilters: { label: string; value: ProjectCategory }[] = [
  { label: "All", value: "all" },
  { label: "3D", value: "3d" },
  { label: "Branding", value: "branding" },
  { label: "Montage", value: "montage" },
  { label: "Photography", value: "photography" },
  { label: "VFX", value: "vfx" },
  { label: "Videography", value: "videography" },
];

export const categoryOptions = projectFilters.filter((f) => f.value !== "all");

export function mapDbProjectToProject(row: DbProject): Project {
  const categories = normalizeCategories(row.categories);
  const projectType = row.project_type?.trim() ?? "";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    clientUrl: row.client_url?.trim() || null,
    type: projectType || getCategoriesLabel(categories),
    projectType,
    categories,
    stat: row.views_text,
    featured: row.featured,
    description: row.short_description,
    challenge: row.challenge,
    approach: row.approach,
    result: row.result,
    tags: [],
    thumbnailUrl: row.thumbnail_url,
    videoUrl: row.video_url,
    videoMode: row.video_mode ?? "auto",
    galleryEnabled: row.gallery_enabled ?? false,
    galleryLabel: savedString(row.gallery_label, "Gallery"),
    galleryTitle: savedString(row.gallery_title, "Behind the Scenes"),
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    featuredMedia: Array.isArray(row.featured_media) ? row.featured_media : [],
    statsEnabled: row.stats_enabled ?? false,
    statsLabel: savedString(row.stats_label, "Impact"),
    statsTitle: savedString(row.stats_title, "By the Numbers"),
    statViews: row.stat_views?.trim() || row.views_text?.trim() || "",
    statVideosEdited: row.stat_videos_edited ?? "",
    statYearsCollaboration: row.stat_years_collaboration ?? "",
    photos: Array.isArray(row.photos) ? row.photos : [],
    brandingSections: normalizeBrandingSections(row),
    vfxComparisons: normalizeVfxComparisons(row),
    pageLayout: row.page_layout === "long_term" ? "long_term" : "single",
    longTermFeaturedContent: normalizeLongTermFeaturedContent(
      row.long_term_featured_content
    ),
    longTermVfxSection: normalizeLongTermVfxSection(row.long_term_vfx_section),
    projectDate: row.project_date,
    displayOrder: row.display_order,
    published: row.published,
  };
}
