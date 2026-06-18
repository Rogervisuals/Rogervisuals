"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  projectIsBranding,
  projectIsPhotography,
  projectIsVfx,
  type BrandingSection,
  type LongTermFeaturedContent,
  type LongTermVfxSection,
  type ProjectCategoryValue,
  type ProjectPageLayout,
  type VideoModeSetting,
  type VfxComparison,
} from "@/lib/projects/types";

export interface ProjectFormData {
  pageLayout: ProjectPageLayout;
  title: string;
  client: string;
  clientUrl: string | null;
  type: string;
  categories: ProjectCategoryValue[];
  slug: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  videoMode: VideoModeSetting;
  photos: string[];
  brandingSections: BrandingSection[];
  vfxComparisons: VfxComparison[];
  galleryEnabled: boolean;
  galleryLabel: string;
  galleryTitle: string;
  galleryImages: string[];
  featuredMedia: string[];
  statsEnabled: boolean;
  statsLabel: string;
  statsTitle: string;
  statViews: string;
  statVideosEdited: string;
  statYearsCollaboration: string;
  shortDescription: string;
  challenge: string;
  approach: string;
  result: string;
  projectDate: string | null;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  longTermFeaturedContent: LongTermFeaturedContent;
  longTermVfxSection: LongTermVfxSection;
}

function normalizeFormData(data: ProjectFormData): ProjectFormData {
  const isPhotography = projectIsPhotography(data.categories);
  const isBranding = projectIsBranding(data.categories);
  const isVfx = projectIsVfx(data.categories);

  let thumbnailUrl = data.thumbnailUrl || null;

  if (!thumbnailUrl && isVfx) {
    const firstAfter = data.vfxComparisons.find((c) => c.afterUrl)?.afterUrl;
    if (firstAfter) thumbnailUrl = firstAfter;
  }

  const vfxComparisons = isVfx
    ? data.vfxComparisons.filter((c) => c.beforeUrl && c.afterUrl)
    : [];

  const brandingSections = isBranding
    ? data.brandingSections
        .map((section) => ({
          title: section.title.trim(),
          photos: section.photos,
        }))
        .filter((section) => section.title || section.photos.length > 0)
    : [];

  return {
    ...data,
    thumbnailUrl,
    videoUrl: isPhotography ? null : data.videoUrl?.trim() || null,
    videoMode: isPhotography ? "auto" : data.videoMode,
    photos: isPhotography ? data.photos : [],
    brandingSections,
    vfxComparisons,
  };
}

function toDbRow(data: ProjectFormData) {
  const normalized = normalizeFormData(data);

  return {
    page_layout: normalized.pageLayout,
    title: normalized.title.trim(),
    client: normalized.client.trim(),
    client_url: normalized.clientUrl?.trim() || null,
    project_type: normalized.type.trim(),
    categories: normalized.categories,
    slug: normalized.slug.trim(),
    thumbnail_url: normalized.thumbnailUrl,
    video_url: normalized.videoUrl,
    video_mode: normalized.videoMode,
    photos: normalized.photos,
    branding_sections: normalized.brandingSections.map((section) => ({
      id: section.id ?? crypto.randomUUID(),
      title: section.title,
      photos: section.photos,
    })),
    vfx_comparisons: normalized.vfxComparisons.map((c) => ({
      before_url: c.beforeUrl,
      after_url: c.afterUrl,
      link_url: c.linkUrl?.trim() || null,
      link_label: c.linkLabel?.trim() || null,
    })),
    gallery_enabled: normalized.galleryEnabled,
    gallery_label: normalized.galleryLabel.trim(),
    gallery_title: normalized.galleryTitle.trim(),
    gallery_images: normalized.galleryImages,
    featured_media: normalized.featuredMedia,
    stats_enabled: normalized.statsEnabled,
    stats_label: normalized.statsLabel.trim(),
    stats_title: normalized.statsTitle.trim(),
    stat_views: normalized.statViews.trim(),
    stat_videos_edited: normalized.statVideosEdited.trim(),
    stat_years_collaboration: normalized.statYearsCollaboration.trim(),
    short_description: normalized.shortDescription.trim(),
    challenge: normalized.challenge.trim(),
    approach: normalized.approach.trim(),
    result: normalized.result.trim(),
    views_text: normalized.statViews.trim(),
    project_date: normalized.projectDate || null,
    featured: normalized.featured,
    display_order: normalized.displayOrder,
    published: normalized.published,
    long_term_featured_content: {
      label: normalized.longTermFeaturedContent.label.trim(),
      title: normalized.longTermFeaturedContent.title.trim(),
      items: normalized.longTermFeaturedContent.items
        .filter((item) => item.title.trim() || item.thumbnailUrl || item.mediaUrl)
        .map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          title: item.title.trim(),
          category: item.category.trim(),
          thumbnail_url: item.thumbnailUrl.trim(),
          media_url: item.mediaUrl.trim(),
        })),
    },
    long_term_vfx_section: {
      label: normalized.longTermVfxSection.label.trim(),
      intro: normalized.longTermVfxSection.intro.trim(),
    },
  };
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function createProject(data: ProjectFormData) {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .insert(toDbRow(data))
    .select("id, slug")
    .single();

  if (error) return { error: error.message };

  revalidateProjectPaths(project.slug);
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(id: string, data: ProjectFormData) {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .update(toDbRow(data))
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidateProjectPaths(project.slug);
  return { success: true };
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidateProjectPaths(project.slug);
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateProjectPaths(project?.slug);
  redirect("/admin/projects");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
