import { createClient } from "@/lib/supabase/server";
import { getPublicClientOrNull } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  mapDbProjectToProject,
  type DbProject,
  type Project,
} from "@/lib/projects/types";

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedProjects:", error.message);
    return [];
  }

  return (data as DbProject[]).map(mapDbProjectToProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFeaturedProjects:", error.message);
    return [];
  }

  return (data as DbProject[]).map(mapDbProjectToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return mapDbProjectToProject(data as DbProject);
}

export async function getAdjacentProjects(slug: string): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProjectsAdmin:", error.message);
    return [];
  }

  return (data as DbProject[]).map(mapDbProjectToProject);
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapDbProjectToProject(data as DbProject);
}

export async function getProjectStats(): Promise<{
  total: number;
  featured: number;
}> {
  if (!isSupabaseConfigured()) return { total: 0, featured: 0 };

  const supabase = await createClient();
  const { count: total } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: featured } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);

  return { total: total ?? 0, featured: featured ?? 0 };
}
