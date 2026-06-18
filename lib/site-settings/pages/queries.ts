import { createClient } from "@/lib/supabase/server";
import { getPublicClientOrNull } from "@/lib/supabase/public";
import {
  aboutPageDefaults,
  contactPageDefaults,
  workPageDefaults,
} from "@/lib/site-settings/pages/defaults";
import {
  PAGE_SETTING_KEYS,
  type AboutPageContent,
  type ContactPageContent,
  type PageHeaderContent,
  type PageSeoContent,
  type PageSettingKey,
  type WorkPageContent,
} from "@/lib/site-settings/pages/types";
import { savedString } from "@/lib/utils";
import type { ServiceItem, StatItem } from "@/lib/site-settings/types";

function normalizePageHeader(
  value: unknown,
  fallback: PageHeaderContent
): PageHeaderContent {
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<PageHeaderContent>;
  return {
    label: savedString(raw.label, fallback.label),
    title: savedString(raw.title, fallback.title),
    description: savedString(raw.description, fallback.description),
  };
}

function normalizePageSeo(
  value: unknown,
  fallback: PageSeoContent
): PageSeoContent {
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<PageSeoContent>;
  return {
    title: savedString(raw.title, fallback.title),
    description: savedString(raw.description, fallback.description),
  };
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function normalizeStats(value: unknown, fallback: StatItem[]): StatItem[] {
  if (!Array.isArray(value)) return fallback;

  const stats = value
    .map((stat) => {
      if (!stat || typeof stat !== "object") return null;
      const valueText = stat.value?.trim() ?? "";
      const label = stat.label?.trim() ?? "";
      if (!valueText || !label) return null;
      return { value: valueText, label };
    })
    .filter((stat): stat is StatItem => Boolean(stat));

  return stats.length > 0 ? stats : fallback;
}

function normalizeServices(
  value: unknown,
  fallback: ServiceItem[]
): ServiceItem[] {
  if (!Array.isArray(value)) return fallback;

  const services = value
    .map((service) => {
      if (!service || typeof service !== "object") return null;
      const title = service.title?.trim() ?? "";
      const description = service.description?.trim() ?? "";
      if (!title) return null;
      return { title, description };
    })
    .filter((service): service is ServiceItem => Boolean(service));

  return services.length > 0 ? services : fallback;
}

export function normalizeAboutPage(value: unknown): AboutPageContent {
  const fallback = aboutPageDefaults;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<AboutPageContent>;

  const paragraphs = Array.isArray(raw.bio?.paragraphs)
    ? raw.bio.paragraphs
        .map((p) => p?.trim() ?? "")
        .filter((p) => p.length > 0)
    : fallback.bio.paragraphs;

  return {
    header: normalizePageHeader(raw.header, fallback.header),
    portraitUrl: raw.portraitUrl?.trim() || null,
    bio: {
      heading: savedString(raw.bio?.heading, fallback.bio.heading),
      paragraphs: paragraphs.length > 0 ? paragraphs : fallback.bio.paragraphs,
    },
    cta: {
      label: savedString(raw.cta?.label, fallback.cta.label),
      href: savedString(raw.cta?.href, fallback.cta.href),
    },
    expertise: {
      label: savedString(raw.expertise?.label, fallback.expertise.label),
      title: savedString(raw.expertise?.title, fallback.expertise.title),
      services: normalizeServices(
        raw.expertise?.services,
        fallback.expertise.services
      ),
    },
    stats: normalizeStats(raw.stats, fallback.stats),
    seo: normalizePageSeo(raw.seo, fallback.seo),
  };
}

export function normalizeContactPage(value: unknown): ContactPageContent {
  const fallback = contactPageDefaults;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<ContactPageContent>;

  return {
    header: normalizePageHeader(raw.header, fallback.header),
    sidebar: {
      title: savedString(raw.sidebar?.title, fallback.sidebar.title),
      description: savedString(
        raw.sidebar?.description,
        fallback.sidebar.description
      ),
      email: savedString(raw.sidebar?.email, fallback.sidebar.email),
      location: savedString(raw.sidebar?.location, fallback.sidebar.location),
      responseTime: savedString(
        raw.sidebar?.responseTime,
        fallback.sidebar.responseTime
      ),
    },
    form: {
      projectTypes: normalizeStringList(
        raw.form?.projectTypes,
        fallback.form.projectTypes
      ),
      budgetRanges: normalizeStringList(
        raw.form?.budgetRanges,
        fallback.form.budgetRanges
      ),
    },
    formSuccess: {
      title: savedString(raw.formSuccess?.title, fallback.formSuccess.title),
      message: savedString(
        raw.formSuccess?.message,
        fallback.formSuccess.message
      ),
      resetLabel: savedString(
        raw.formSuccess?.resetLabel,
        fallback.formSuccess.resetLabel
      ),
    },
    seo: normalizePageSeo(raw.seo, fallback.seo),
  };
}

export function normalizeWorkPage(value: unknown): WorkPageContent {
  const fallback = workPageDefaults;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<WorkPageContent>;

  return {
    header: normalizePageHeader(raw.header, fallback.header),
    seo: normalizePageSeo(raw.seo, fallback.seo),
  };
}

async function fetchPageSetting(key: PageSettingKey): Promise<unknown | null> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`fetchPageSetting(${key}):`, error.message);
    return null;
  }

  return data?.content ?? null;
}

async function fetchPageSettingAdmin(
  key: PageSettingKey
): Promise<unknown | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`fetchPageSettingAdmin(${key}):`, error.message);
    return null;
  }

  return data?.content ?? null;
}

export async function getAboutPage(): Promise<AboutPageContent> {
  const content = await fetchPageSetting(PAGE_SETTING_KEYS.about);
  return content ? normalizeAboutPage(content) : aboutPageDefaults;
}

export async function getAboutPageAdmin(): Promise<AboutPageContent> {
  const content = await fetchPageSettingAdmin(PAGE_SETTING_KEYS.about);
  return normalizeAboutPage(content);
}

export async function getContactPage(): Promise<ContactPageContent> {
  const content = await fetchPageSetting(PAGE_SETTING_KEYS.contact);
  return content ? normalizeContactPage(content) : contactPageDefaults;
}

export async function getContactPageAdmin(): Promise<ContactPageContent> {
  const content = await fetchPageSettingAdmin(PAGE_SETTING_KEYS.contact);
  return normalizeContactPage(content);
}

export async function getWorkPage(): Promise<WorkPageContent> {
  const content = await fetchPageSetting(PAGE_SETTING_KEYS.work);
  return content ? normalizeWorkPage(content) : workPageDefaults;
}

export async function getWorkPageAdmin(): Promise<WorkPageContent> {
  const content = await fetchPageSettingAdmin(PAGE_SETTING_KEYS.work);
  return normalizeWorkPage(content);
}
