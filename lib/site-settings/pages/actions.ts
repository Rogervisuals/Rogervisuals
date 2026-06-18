"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  PAGE_SETTING_KEYS,
  type AboutPageContent,
  type ContactPageContent,
  type PageSettingKey,
  type WorkPageContent,
} from "@/lib/site-settings/pages/types";
import { normalizeContactPage } from "@/lib/site-settings/pages/queries";

async function upsertPageSetting(key: PageSettingKey, content: unknown) {
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

  return { success: true as const };
}

export async function updateAboutPage(data: AboutPageContent) {
  const result = await upsertPageSetting(PAGE_SETTING_KEYS.about, data);
  if ("error" in result && result.error) return result;

  revalidatePath("/about");
  revalidatePath("/admin/pages/about");
  return result;
}

export async function updateContactPage(data: ContactPageContent) {
  const normalized = normalizeContactPage(data);
  const result = await upsertPageSetting(PAGE_SETTING_KEYS.contact, normalized);
  if ("error" in result && result.error) return result;

  revalidatePath("/contact");
  revalidatePath("/admin/pages/contact");
  return result;
}

export async function updateWorkPage(data: WorkPageContent) {
  const result = await upsertPageSetting(PAGE_SETTING_KEYS.work, data);
  if ("error" in result && result.error) return result;

  revalidatePath("/work");
  revalidatePath("/admin/pages/work");
  return result;
}
