"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  HomepageSectionVisibility,
  ReorderableHomepageSectionId,
} from "@/lib/site-settings/homepage-sections";
import {
  SITE_SETTING_KEYS,
  type ClientsSectionContent,
  type ContactSectionContent,
  type HeroSectionContent,
  type ProcessSectionContent,
  type ServicesSectionContent,
  type SiteSettingKey,
  type StatsSectionContent,
} from "@/lib/site-settings/types";

async function upsertSetting(key: SiteSettingKey, content: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in. Please log in to the admin again." };
  }

  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/pages/home");
  return { success: true as const };
}

export async function updateClientsSection(data: ClientsSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.clients, data);
}

export async function updateHeroSection(data: HeroSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.hero, data);
}

export async function updateStatsSection(data: StatsSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.stats, data);
}

export async function updateServicesSection(data: ServicesSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.services, data);
}

export async function updateProcessSection(data: ProcessSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.process, data);
}

export async function updateContactSection(data: ContactSectionContent) {
  return upsertSetting(SITE_SETTING_KEYS.contact, data);
}

export async function updateHomepageSectionOrder(
  order: ReorderableHomepageSectionId[]
) {
  return upsertSetting(SITE_SETTING_KEYS.sectionOrder, order);
}

export async function updateHomepageSectionVisibility(
  visibility: HomepageSectionVisibility
) {
  return upsertSetting(SITE_SETTING_KEYS.sectionVisibility, visibility);
}
