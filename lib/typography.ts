import { cn } from "@/lib/utils";

/**
 * Typography utilities — Tailwind classes in the utilities layer so they
 * reliably override heading preflight (font-size: inherit).
 */
export const sectionTitle = cn(
  "font-[family-name:var(--font-heading)] font-bold leading-[1.08] tracking-tight text-white",
  "text-4xl md:text-[2.625rem] lg:text-[3.5rem]"
);

export const pageTitle = cn(
  "font-[family-name:var(--font-heading)] font-bold leading-[1.06] tracking-tight text-white",
  "text-[2.5rem] md:text-5xl lg:text-[3.5rem]"
);

export const sectionDesc = cn(
  "font-[family-name:var(--font-body)] font-light leading-[1.75] text-silver",
  "text-lg md:text-xl md:leading-[1.8]"
);

export const sectionLabel = cn(
  "font-[family-name:var(--font-ui)] font-normal uppercase text-mariner",
  "text-xs tracking-[0.2em] md:text-sm"
);

export const cardTitle = cn(
  "font-[family-name:var(--font-heading)] font-bold leading-tight tracking-tight text-white",
  "text-[1.375rem] md:text-[1.75rem]"
);

export const cardTitleLg = cn(
  "font-[family-name:var(--font-heading)] font-bold leading-tight tracking-tight text-white",
  "text-2xl md:text-[1.75rem]"
);

export const cardBody = cn(
  "font-[family-name:var(--font-body)] font-light text-silver",
  "text-base leading-relaxed md:text-lg md:leading-[1.7]"
);

export const type = {
  h1: "type-h1",
  heroEyebrow: "type-hero-eyebrow",
  sectionLabel,
  sectionTitle,
  sectionDesc,
  pageTitle,
  cardTitle,
  cardTitleLg,
  cardBody,
  bodyLg: "type-body-lg",
  body: "type-body",
  bodySm: "type-body-sm",
  meta: "type-meta",
  nav: "type-nav",
  button: "type-button",
  stat: "type-stat",
  statLabel: "type-stat-label",
} as const;
