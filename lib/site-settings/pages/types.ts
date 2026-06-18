import type { ServiceItem, StatItem } from "@/lib/site-settings/types";

export const PAGE_SETTING_KEYS = {
  about: "page_about",
  contact: "page_contact",
  work: "page_work",
} as const;

export type PageSettingKey =
  (typeof PAGE_SETTING_KEYS)[keyof typeof PAGE_SETTING_KEYS];

export interface PageHeaderContent {
  label: string;
  title: string;
  description: string;
}

export interface PageSeoContent {
  title: string;
  description: string;
}

export interface AboutPageContent {
  header: PageHeaderContent;
  portraitUrl: string | null;
  bio: {
    heading: string;
    paragraphs: string[];
  };
  cta: {
    label: string;
    href: string;
  };
  expertise: {
    label: string;
    title: string;
    services: ServiceItem[];
  };
  stats: StatItem[];
  seo: PageSeoContent;
}

export interface ContactPageContent {
  header: PageHeaderContent;
  sidebar: {
    title: string;
    description: string;
    email: string;
    location: string;
    responseTime: string;
  };
  form: {
    projectTypes: string[];
    budgetRanges: string[];
  };
  formSuccess: {
    title: string;
    message: string;
    resetLabel: string;
  };
  seo: PageSeoContent;
}

export interface WorkPageContent {
  header: PageHeaderContent;
  seo: PageSeoContent;
}
