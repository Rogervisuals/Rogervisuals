export const REORDERABLE_HOMEPAGE_SECTIONS = [
  "stats",
  "clients",
  "featured",
  "services",
  "process",
] as const;

export type ReorderableHomepageSectionId =
  (typeof REORDERABLE_HOMEPAGE_SECTIONS)[number];

export type HomepageEditorSectionId =
  | "hero"
  | ReorderableHomepageSectionId
  | "contact";

export const DEFAULT_HOMEPAGE_SECTION_ORDER: ReorderableHomepageSectionId[] = [
  "stats",
  "clients",
  "featured",
  "services",
  "process",
];

export type HomepageSectionVisibility = Record<
  ReorderableHomepageSectionId,
  boolean
>;

export const DEFAULT_HOMEPAGE_SECTION_VISIBILITY: HomepageSectionVisibility = {
  stats: true,
  clients: true,
  featured: true,
  services: true,
  process: true,
};

export const HOMEPAGE_SECTION_LABELS: Record<HomepageEditorSectionId, string> =
  {
    hero: "Hero",
    stats: "Stats",
    clients: "Client logos",
    featured: "Featured work",
    services: "Services",
    process: "Process",
    contact: "Contact CTA",
  };

export function normalizeHomepageSectionOrder(
  value: unknown
): ReorderableHomepageSectionId[] {
  if (!Array.isArray(value)) return [...DEFAULT_HOMEPAGE_SECTION_ORDER];

  const seen = new Set<ReorderableHomepageSectionId>();
  const order: ReorderableHomepageSectionId[] = [];

  for (const item of value) {
    if (
      typeof item === "string" &&
      REORDERABLE_HOMEPAGE_SECTIONS.includes(
        item as ReorderableHomepageSectionId
      ) &&
      !seen.has(item as ReorderableHomepageSectionId)
    ) {
      const id = item as ReorderableHomepageSectionId;
      seen.add(id);
      order.push(id);
    }
  }

  for (const id of REORDERABLE_HOMEPAGE_SECTIONS) {
    if (!seen.has(id)) order.push(id);
  }

  return order;
}

export function normalizeHomepageSectionVisibility(
  value: unknown
): HomepageSectionVisibility {
  const fallback = { ...DEFAULT_HOMEPAGE_SECTION_VISIBILITY };
  if (!value || typeof value !== "object") return fallback;

  const raw = value as Partial<HomepageSectionVisibility>;

  return {
    stats: raw.stats ?? fallback.stats,
    clients: raw.clients ?? fallback.clients,
    featured: raw.featured ?? fallback.featured,
    services: raw.services ?? fallback.services,
    process: raw.process ?? fallback.process,
  };
}
