import { createClient } from "@/lib/supabase/server";
import { getPublicClientOrNull } from "@/lib/supabase/public";
import { homepageDefaults } from "@/lib/site-settings/defaults";
import {
  normalizeHomepageSectionOrder,
  normalizeHomepageSectionVisibility,
} from "@/lib/site-settings/homepage-sections";
import {
  SITE_SETTING_KEYS,
  type ClientsSectionContent,
  type ContactSectionContent,
  type HeroCollagePanel,
  type HeroSectionContent,
  type HomepageClient,
  type HomepageContent,
  type ProcessSectionContent,
  type ServicesSectionContent,
  type SiteSettingKey,
  type StatsSectionContent,
} from "@/lib/site-settings/types";
import { savedString } from "@/lib/utils";

function normalizeClientsSection(value: unknown): ClientsSectionContent {
  const fallback = homepageDefaults.clients;
  if (!value || typeof value !== "object") return fallback;

  const raw = value as Partial<ClientsSectionContent>;
  const clients = Array.isArray(raw.clients)
    ? raw.clients
        .map((client): HomepageClient | null => {
          if (!client || typeof client !== "object") return null;
          const item = client as Partial<HomepageClient>;
          const name = item.name?.trim() ?? "";
          if (!name) return null;
          return {
            id: item.id ?? crypto.randomUUID(),
            name,
            logo: item.logo?.trim() || null,
            url: item.url?.trim() || null,
          };
        })
        .filter((client): client is HomepageClient => client !== null)
    : fallback.clients;

  return {
    title: savedString(raw.title, fallback.title),
    description: savedString(raw.description, fallback.description),
    clients,
  };
}

function normalizeCollagePanels(value: unknown): HeroCollagePanel[] {
  const fallback = homepageDefaults.hero.collagePanels;

  if (!Array.isArray(value)) return fallback;

  const panels = value
    .map((panel, index): HeroCollagePanel | null => {
      if (!panel || typeof panel !== "object") return null;
      const item = panel as Partial<HeroCollagePanel>;
      return {
        id: item.id ?? crypto.randomUUID(),
        label: item.label?.trim() || fallback[index]?.label || `Panel ${index + 1}`,
        imageUrl: item.imageUrl?.trim() || null,
      };
    })
    .filter((panel): panel is HeroCollagePanel => panel !== null);

  while (panels.length < fallback.length) {
    const index = panels.length;
    panels.push({ ...fallback[index] });
  }

  return panels.slice(0, fallback.length);
}

function normalizeHeroSection(value: unknown): HeroSectionContent {
  const fallback = homepageDefaults.hero;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<HeroSectionContent>;

  return {
    eyebrow: savedString(raw.eyebrow, fallback.eyebrow),
    headlineLine1: savedString(raw.headlineLine1, fallback.headlineLine1),
    headlineLine2: savedString(raw.headlineLine2, fallback.headlineLine2),
    description: savedString(raw.description, fallback.description),
    primaryCtaLabel: savedString(raw.primaryCtaLabel, fallback.primaryCtaLabel),
    primaryCtaHref: savedString(raw.primaryCtaHref, fallback.primaryCtaHref),
    secondaryCtaLabel: savedString(
      raw.secondaryCtaLabel,
      fallback.secondaryCtaLabel
    ),
    secondaryCtaHref: savedString(
      raw.secondaryCtaHref,
      fallback.secondaryCtaHref
    ),
    collagePanels: normalizeCollagePanels(raw.collagePanels),
  };
}

function normalizeStatsSection(value: unknown): StatsSectionContent {
  const fallback = homepageDefaults.stats;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<StatsSectionContent>;

  const stats = Array.isArray(raw.stats)
    ? raw.stats
        .map((stat) => {
          if (!stat || typeof stat !== "object") return null;
          const valueText = stat.value?.trim() ?? "";
          const label = stat.label?.trim() ?? "";
          if (!valueText || !label) return null;
          return { value: valueText, label };
        })
        .filter((stat): stat is { value: string; label: string } =>
          Boolean(stat)
        )
    : fallback.stats;

  return { stats: Array.isArray(raw.stats) ? stats : fallback.stats };
}

function normalizeServicesSection(value: unknown): ServicesSectionContent {
  const fallback = homepageDefaults.services;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<ServicesSectionContent>;

  const services = Array.isArray(raw.services)
    ? raw.services
        .map((service) => {
          if (!service || typeof service !== "object") return null;
          const title = service.title?.trim() ?? "";
          const description = service.description?.trim() ?? "";
          if (!title) return null;
          return { title, description };
        })
        .filter((service): service is { title: string; description: string } =>
          Boolean(service)
        )
    : fallback.services;

  return {
    label: savedString(raw.label, fallback.label),
    title: savedString(raw.title, fallback.title),
    description: savedString(raw.description, fallback.description),
    services: Array.isArray(raw.services) ? services : fallback.services,
  };
}

function normalizeProcessSection(value: unknown): ProcessSectionContent {
  const fallback = homepageDefaults.process;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<ProcessSectionContent>;

  const steps = Array.isArray(raw.steps)
    ? raw.steps
        .map((step) => {
          if (!step || typeof step !== "object") return null;
          const title = step.title?.trim() ?? "";
          if (!title) return null;
          return {
            step: savedString(step.step, "00"),
            title,
            description: savedString(step.description, ""),
          };
        })
        .filter(
          (
            step
          ): step is { step: string; title: string; description: string } =>
            Boolean(step)
        )
    : fallback.steps;

  return {
    label: savedString(raw.label, fallback.label),
    title: savedString(raw.title, fallback.title),
    steps: Array.isArray(raw.steps) ? steps : fallback.steps,
  };
}

function normalizeContactSection(value: unknown): ContactSectionContent {
  const fallback = homepageDefaults.contact;
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Partial<ContactSectionContent>;

  return {
    title: savedString(raw.title, fallback.title),
    description: savedString(raw.description, fallback.description),
    buttonLabel: savedString(raw.buttonLabel, fallback.buttonLabel),
    buttonHref: savedString(raw.buttonHref, fallback.buttonHref),
  };
}

type ContentSettingKey = Exclude<
  SiteSettingKey,
  "homepage_section_order" | "homepage_section_visibility"
>;

const normalizers: Record<
  ContentSettingKey,
  (
    value: unknown
  ) => HomepageContent[Exclude<
    keyof HomepageContent,
    "sectionOrder" | "sectionVisibility"
  >]
> = {
  [SITE_SETTING_KEYS.clients]: normalizeClientsSection,
  [SITE_SETTING_KEYS.hero]: normalizeHeroSection,
  [SITE_SETTING_KEYS.stats]: normalizeStatsSection,
  [SITE_SETTING_KEYS.services]: normalizeServicesSection,
  [SITE_SETTING_KEYS.process]: normalizeProcessSection,
  [SITE_SETTING_KEYS.contact]: normalizeContactSection,
};

async function fetchSettingContent(key: SiteSettingKey): Promise<unknown | null> {
  const supabase = getPublicClientOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`fetchSettingContent(${key}):`, error.message);
    return null;
  }

  return data?.content ?? null;
}

export async function getSiteSetting<K extends keyof HomepageContent>(
  section: K
): Promise<HomepageContent[K]> {
  if (section === "sectionOrder") {
    const content = await fetchSettingContent(SITE_SETTING_KEYS.sectionOrder);
    return normalizeHomepageSectionOrder(content) as HomepageContent[K];
  }

  if (section === "sectionVisibility") {
    const content = await fetchSettingContent(
      SITE_SETTING_KEYS.sectionVisibility
    );
    return normalizeHomepageSectionVisibility(content) as HomepageContent[K];
  }

  const keyMap: Record<
    Exclude<keyof HomepageContent, "sectionOrder" | "sectionVisibility">,
    SiteSettingKey
  > = {
    clients: SITE_SETTING_KEYS.clients,
    hero: SITE_SETTING_KEYS.hero,
    stats: SITE_SETTING_KEYS.stats,
    services: SITE_SETTING_KEYS.services,
    process: SITE_SETTING_KEYS.process,
    contact: SITE_SETTING_KEYS.contact,
  };

  const key = keyMap[section as Exclude<
    keyof HomepageContent,
    "sectionOrder" | "sectionVisibility"
  >];
  const content = await fetchSettingContent(key);
  const normalizer =
    normalizers[key as ContentSettingKey] as (
      value: unknown
    ) => HomepageContent[K];

  if (!content) {
    return homepageDefaults[section];
  }

  return normalizer(content);
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const [
    clients,
    hero,
    stats,
    services,
    process,
    contact,
    sectionOrder,
    sectionVisibility,
  ] = await Promise.all([
    getSiteSetting("clients"),
    getSiteSetting("hero"),
    getSiteSetting("stats"),
    getSiteSetting("services"),
    getSiteSetting("process"),
    getSiteSetting("contact"),
    getSiteSetting("sectionOrder"),
    getSiteSetting("sectionVisibility"),
  ]);

  return {
    clients,
    hero,
    stats,
    services,
    process,
    contact,
    sectionOrder,
    sectionVisibility,
  };
}

export async function getHomepageContentAdmin(): Promise<HomepageContent> {
  const supabase = await createClient();
  const keys = Object.values(SITE_SETTING_KEYS);

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, content")
    .in("key", keys);

  if (error) {
    console.error("getHomepageContentAdmin:", error.message);
    return homepageDefaults;
  }

  const byKey = new Map(
    (data ?? []).map((row) => [row.key, row.content] as const)
  );

  return {
    clients: normalizers[SITE_SETTING_KEYS.clients](
      byKey.get(SITE_SETTING_KEYS.clients)
    ) as ClientsSectionContent,
    hero: normalizers[SITE_SETTING_KEYS.hero](
      byKey.get(SITE_SETTING_KEYS.hero)
    ) as HeroSectionContent,
    stats: normalizers[SITE_SETTING_KEYS.stats](
      byKey.get(SITE_SETTING_KEYS.stats)
    ) as StatsSectionContent,
    services: normalizers[SITE_SETTING_KEYS.services](
      byKey.get(SITE_SETTING_KEYS.services)
    ) as ServicesSectionContent,
    process: normalizers[SITE_SETTING_KEYS.process](
      byKey.get(SITE_SETTING_KEYS.process)
    ) as ProcessSectionContent,
    contact: normalizers[SITE_SETTING_KEYS.contact](
      byKey.get(SITE_SETTING_KEYS.contact)
    ) as ContactSectionContent,
    sectionOrder: normalizeHomepageSectionOrder(
      byKey.get(SITE_SETTING_KEYS.sectionOrder)
    ),
    sectionVisibility: normalizeHomepageSectionVisibility(
      byKey.get(SITE_SETTING_KEYS.sectionVisibility)
    ),
  };
}
