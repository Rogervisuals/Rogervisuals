import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { sectionDesc, sectionTitle } from "@/lib/typography";
import { getAboutPage } from "@/lib/site-settings/pages/queries";
import { cn, hasContent } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPage();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function AboutPage() {
  const content = await getAboutPage();
  const paragraphs = content.bio.paragraphs.filter((paragraph) =>
    hasContent(paragraph)
  );
  const showBioHeading = hasContent(content.bio.heading);
  const showBioText = paragraphs.length > 0;
  const showCta =
    hasContent(content.cta.label) && hasContent(content.cta.href);
  const expertiseHeader =
    hasContent(content.expertise.label) ||
    hasContent(content.expertise.title);
  const visibleStats = content.stats.filter(
    (stat) => hasContent(stat.value) && hasContent(stat.label)
  );

  return (
    <>
      <PageHeader
        label={content.header.label}
        title={content.header.title}
        description={content.header.description}
      />

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-mine-shaft">
              {content.portraitUrl ? (
                <Image
                  src={content.portraitUrl}
                  alt={content.header.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              ) : (
                <>
                  <div className="placeholder-shimmer absolute inset-0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="type-meta text-silver/35">
                      Portrait Placeholder
                    </span>
                  </div>
                </>
              )}
            </div>

            <div>
              {showBioHeading && (
                <h2 className={sectionTitle}>{content.bio.heading}</h2>
              )}
              {showBioText && (
                <div
                  className={cn(
                    sectionDesc,
                    "space-y-5",
                    showBioHeading && "mt-6"
                  )}
                >
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}

              {showCta && (
                <div
                  className={
                    showBioHeading || showBioText ? "mt-10" : undefined
                  }
                >
                  <Button href={content.cta.href} variant="primary">
                    {content.cta.label}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {content.expertise.services.length > 0 && (
        <section className="border-t border-white/5 bg-mine-shaft/20 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            {expertiseHeader && (
              <SectionHeader
                label={content.expertise.label}
                title={content.expertise.title}
              />
            )}

            <div
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
                expertiseHeader && "mt-14 md:mt-16"
              )}
            >
              {content.expertise.services.map((service) => (
                <div
                  key={service.title}
                  className="border border-white/5 p-6 md:p-7"
                >
                  {hasContent(service.title) && (
                    <h3 className="type-card-title">{service.title}</h3>
                  )}
                  {hasContent(service.description) && (
                    <p
                      className={cn(
                        "type-card-body",
                        hasContent(service.title) && "mt-4"
                      )}
                    >
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {visibleStats.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div
              className={cn(
                "grid gap-8",
                visibleStats.length === 1 && "md:grid-cols-1",
                visibleStats.length === 2 && "md:grid-cols-2",
                visibleStats.length >= 3 && "md:grid-cols-3"
              )}
            >
              {visibleStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/5 bg-mine-shaft/50 p-8 text-center md:p-10"
                >
                  <p className="type-stat">{stat.value}</p>
                  <p className="type-stat-label mt-3">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
