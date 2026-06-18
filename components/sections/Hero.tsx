import { Button } from "@/components/ui/Button";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import type { HeroSectionContent } from "@/lib/site-settings/types";
import { cn, hasContent } from "@/lib/utils";

interface HeroProps {
  content: HeroSectionContent;
}

export function Hero({ content }: HeroProps) {
  const showEyebrow = hasContent(content.eyebrow);
  const showHeadline =
    hasContent(content.headlineLine1) || hasContent(content.headlineLine2);
  const showDescription = hasContent(content.description);
  const showPrimaryCta =
    hasContent(content.primaryCtaLabel) && hasContent(content.primaryCtaHref);
  const showSecondaryCta =
    hasContent(content.secondaryCtaLabel) &&
    hasContent(content.secondaryCtaHref);
  const showCtas = showPrimaryCta || showSecondaryCta;
  const showIntro = showEyebrow || showHeadline || showDescription || showCtas;

  const line1 = hasContent(content.headlineLine1) ? content.headlineLine1 : "";
  const line2 = hasContent(content.headlineLine2) ? content.headlineLine2 : "";

  return (
    <section className="hero-section relative overflow-hidden py-12 md:flex md:min-h-[70vh] md:items-center md:justify-center md:py-16">
      <div className="site-layer-bg absolute inset-0 bg-shark" />
      <div className="hero-section__gradient site-layer-bg absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 md:text-center">
        {showIntro && (
          <div className="relative md:mx-auto md:max-w-6xl">
            {showEyebrow && (
              <p className="type-hero-eyebrow md:mx-auto">{content.eyebrow}</p>
            )}
            {showHeadline && (
              <h1 className={cn("type-h1 hero-section__headline", showEyebrow && "mt-6")}>
                <span className="md:hidden">
                  {line1}
                  {line1 && line2 && <br />}
                  {line2}
                </span>
                <span className="hidden md:inline">
                  {line1}
                  {line1 && line2 && " "}
                  {line2}
                  {line2 && (
                    <span className="hero-section__accent" aria-hidden="true" />
                  )}
                </span>
              </h1>
            )}
            {showDescription && (
              <p
                className={cn(
                  "type-section-desc hero-section__description md:mx-auto",
                  (showEyebrow || showHeadline) && "mt-6"
                )}
              >
                {content.description}
              </p>
            )}
            {showCtas && (
              <div
                className={cn(
                  "flex flex-wrap gap-4 md:justify-center",
                  (showEyebrow || showHeadline || showDescription) && "mt-10"
                )}
              >
                {showPrimaryCta && (
                  <Button
                    href={content.primaryCtaHref}
                    variant="primary"
                    size="lg"
                  >
                    {content.primaryCtaLabel}
                  </Button>
                )}
                {showSecondaryCta && (
                  <Button
                    href={content.secondaryCtaHref}
                    variant="secondary"
                    size="lg"
                  >
                    {content.secondaryCtaLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="site-layer-elevated absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}
