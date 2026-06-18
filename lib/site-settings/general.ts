import { createClient } from "@/lib/supabase/server";
import { getPublicClientOrNull } from "@/lib/supabase/public";
import { savedString } from "@/lib/utils";

export const GENERAL_SETTINGS_KEY = "site_general";

export type SocialPlatform = "instagram" | "linkedin" | "behance";

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  behance: string;
}

export interface GeneralSettings {
  branding: {
    siteName: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    logoInitial: string;
  };
  colors: {
    white: string;
    silver: string;
    mineShaft: string;
    shark: string;
    mariner: string;
  };
  typography: {
    fontScale: number;
  };
  footer: {
    tagline: string;
    email: string;
    location: string;
    copyrightName: string;
    socialLinks: SocialLinks;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const generalSettingsDefaults: GeneralSettings = {
  branding: {
    siteName: "Roger Noordover",
    logoUrl: null,
    faviconUrl: null,
    logoInitial: "R",
  },
  colors: {
    white: "#ffffff",
    silver: "#cccccc",
    mineShaft: "#333333",
    shark: "#25252a",
    mariner: "#2c72b8",
  },
  typography: {
    fontScale: 1,
  },
  footer: {
    tagline: "Let's work together",
    email: "hello@rogervisuals.com",
    location: "Netherlands · Available worldwide",
    copyrightName: "Roger Noordover",
    socialLinks: {
      instagram: "",
      linkedin: "",
      behance: "",
    },
  },
  seo: {
    title: "Roger Noordover — Video Editor & Videographer",
    description:
      "Freelance video editor, videographer and VFX artist creating high-quality content for brands and creators. Video editing, motion graphics, and production.",
  },
};

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function normalizeHexColor(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return HEX_COLOR.test(trimmed) ? trimmed : fallback;
}

function normalizeFontScale(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.min(1.25, Math.max(0.85, Math.round(num * 100) / 100));
}

function normalizeSocialUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeSocialLinks(value: unknown): SocialLinks {
  const raw = (value && typeof value === "object" ? value : {}) as Partial<
    SocialLinks
  >;

  return {
    instagram: normalizeSocialUrl(raw.instagram),
    linkedin: normalizeSocialUrl(raw.linkedin),
    behance: normalizeSocialUrl(raw.behance),
  };
}

export function normalizeGeneralSettings(value: unknown): GeneralSettings {
  const fallback = generalSettingsDefaults;
  if (!value || typeof value !== "object") return fallback;

  const raw = value as Partial<GeneralSettings>;
  const branding = (raw.branding ?? {}) as Partial<GeneralSettings["branding"]>;
  const colors = (raw.colors ?? {}) as Partial<GeneralSettings["colors"]>;
  const typography = (raw.typography ?? {}) as Partial<
    GeneralSettings["typography"]
  >;
  const footer = (raw.footer ?? {}) as Partial<
    GeneralSettings["footer"] & { bottomTagline?: string }
  >;
  const seo = (raw.seo ?? {}) as Partial<GeneralSettings["seo"]>;

  return {
    branding: {
      siteName: branding.siteName?.trim() || fallback.branding.siteName,
      logoUrl: branding.logoUrl?.trim() || null,
      faviconUrl: branding.faviconUrl?.trim() || null,
      logoInitial:
        branding.logoInitial?.trim().slice(0, 2) ||
        fallback.branding.logoInitial,
    },
    colors: {
      white: normalizeHexColor(colors.white, fallback.colors.white),
      silver: normalizeHexColor(colors.silver, fallback.colors.silver),
      mineShaft: normalizeHexColor(colors.mineShaft, fallback.colors.mineShaft),
      shark: normalizeHexColor(colors.shark, fallback.colors.shark),
      mariner: normalizeHexColor(colors.mariner, fallback.colors.mariner),
    },
    typography: {
      fontScale: normalizeFontScale(typography.fontScale),
    },
    footer: {
      tagline:
        typeof footer.tagline === "string"
          ? footer.tagline.trim()
          : fallback.footer.tagline,
      email: savedString(footer.email, fallback.footer.email),
      location: savedString(footer.location, fallback.footer.location),
      copyrightName: savedString(
        footer.copyrightName,
        fallback.footer.copyrightName
      ),
      socialLinks: normalizeSocialLinks(footer.socialLinks),
    },
    seo: {
      title: savedString(seo.title, fallback.seo.title),
      description: savedString(seo.description, fallback.seo.description),
    },
  };
}

async function fetchGeneralSettingsContent(): Promise<unknown | null> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("key", GENERAL_SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("fetchGeneralSettings:", error.message);
    return null;
  }

  return data?.content ?? null;
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const content = await fetchGeneralSettingsContent();
  return normalizeGeneralSettings(content);
}

export async function getGeneralSettingsAdmin(): Promise<GeneralSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("key", GENERAL_SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("getGeneralSettingsAdmin:", error.message);
    return generalSettingsDefaults;
  }

  return normalizeGeneralSettings(data?.content);
}
