import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { VfxComparison } from "@/lib/projects/types";
import { sectionTitle } from "@/lib/typography";
import { cn, hasContent } from "@/lib/utils";

interface ProjectVfxComparisonsProps {
  comparisons: VfxComparison[];
  projectTitle: string;
  label?: string;
  title?: string;
  intro?: string;
  centered?: boolean;
  embedded?: boolean;
  subdued?: boolean;
  className?: string;
}

export function ProjectVfxComparisons({
  comparisons,
  projectTitle,
  label = "VFX",
  title = "Before & After",
  intro,
  centered = false,
  embedded = false,
  subdued = false,
  className,
}: ProjectVfxComparisonsProps) {
  const complete = comparisons.filter(
    (c) => hasContent(c.beforeUrl) && hasContent(c.afterUrl)
  );
  if (complete.length === 0) return null;

  const showLabel = hasContent(label);
  const showTitle = hasContent(title);
  const showIntro = hasContent(intro);
  const showHeader = showLabel || showTitle;

  const content = (
    <>
      {showLabel && (
        <SectionLabel className={cn(centered && "text-center")}>{label}</SectionLabel>
      )}
      {showTitle && (
        <h2
          className={cn(
            subdued
              ? "font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white md:text-3xl"
              : sectionTitle,
            showLabel ? "mt-3 md:mt-4" : undefined
          )}
        >
          {title}
        </h2>
      )}
      {showIntro && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-3xl font-[family-name:var(--font-body)] text-base leading-relaxed font-light text-silver md:text-lg",
            centered && "text-center"
          )}
        >
          {intro}
        </p>
      )}
      <div
        className={cn(
          "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6",
          showHeader || showIntro ? "mt-10" : undefined,
          subdued && "lg:grid-cols-2"
        )}
      >
        {complete.map((comparison, index) => {
          const showLink =
            hasContent(comparison.linkUrl) && hasContent(comparison.linkLabel);

          return (
            <div key={`${comparison.beforeUrl}-${comparison.afterUrl}-${index}`}>
              <BeforeAfterSlider
                beforeUrl={comparison.beforeUrl}
                afterUrl={comparison.afterUrl}
                title={`${projectTitle} — comparison ${index + 1}`}
              />
              {showLink && comparison.linkUrl && (
                <a
                  href={comparison.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-nav mt-4 inline-block text-sm text-silver/50 transition-colors hover:text-mariner"
                >
                  {comparison.linkLabel}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className={cn(centered && "text-center", className)}>
        {content}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "border-t border-white/5 bg-mine-shaft/20",
        subdued ? "py-12 md:py-16" : "py-16 md:py-20"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 md:px-8",
          centered && "text-center"
        )}
      >
        {content}
      </div>
    </section>
  );
}
