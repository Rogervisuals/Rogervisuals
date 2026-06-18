"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  GENERAL_SETTINGS_KEY,
  type GeneralSettings,
} from "@/lib/site-settings/general";

function revalidateGeneralPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/general");
}

export async function updateGeneralSettings(data: GeneralSettings) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in. Please log in to the admin again." };
  }

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: GENERAL_SETTINGS_KEY,
      content: data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return { error: error.message };

  revalidateGeneralPaths();
  return { success: true as const };
}
