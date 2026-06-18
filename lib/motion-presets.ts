import { inViewViewport } from "@/lib/motion-viewport";

/** Viewport trigger only — no transform, avoids iOS Safari compositor layers painting over the header. */
export const fadeInUp = {
  viewport: inViewViewport,
  transition: { duration: 0.45, ease: "easeOut" as const },
} as const;

export const fadeInUpSmall = {
  viewport: inViewViewport,
  transition: { duration: 0.4, ease: "easeOut" as const },
} as const;
