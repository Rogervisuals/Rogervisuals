import type {
  HomepageSectionVisibility,
  ReorderableHomepageSectionId,
} from "@/lib/site-settings/homepage-sections";

export const SITE_SETTING_KEYS = {
  clients: "homepage_clients",
  hero: "homepage_hero",
  stats: "homepage_stats",
  services: "homepage_services",
  process: "homepage_process",
  contact: "homepage_contact",
  sectionOrder: "homepage_section_order",
  sectionVisibility: "homepage_section_visibility",
} as const;

export type SiteSettingKey =
  (typeof SITE_SETTING_KEYS)[keyof typeof SITE_SETTING_KEYS];

export interface HomepageClient {
  id: string;
  name: string;
  logo?: string | null;
  url?: string | null;
}

export interface ClientsSectionContent {
  title: string;
  description: string;
  clients: HomepageClient[];
}

export interface HeroCollagePanel {
  id: string;
  label: string;
  imageUrl: string | null;
}

export function createHeroCollagePanel(label = ""): HeroCollagePanel {
  return { id: crypto.randomUUID(), label, imageUrl: null };
}

export interface HeroSectionContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  collagePanels: HeroCollagePanel[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsSectionContent {
  stats: StatItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ServicesSectionContent {
  label: string;
  title: string;
  description: string;
  services: ServiceItem[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ProcessSectionContent {
  label: string;
  title: string;
  steps: ProcessStep[];
}

export interface ContactSectionContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface HomepageContent {
  clients: ClientsSectionContent;
  hero: HeroSectionContent;
  stats: StatsSectionContent;
  services: ServicesSectionContent;
  process: ProcessSectionContent;
  contact: ContactSectionContent;
  sectionOrder: ReorderableHomepageSectionId[];
  sectionVisibility: HomepageSectionVisibility;
}
