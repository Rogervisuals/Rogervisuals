import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoriesLabel,
  projectIsBranding,
  projectIsPhotography,
  projectIsVfx,
} from "@/lib/projects/types";
import {
  getPublishedProjects,
  getProjectBySlug,
  getAdjacentProjects,
} from "@/lib/projects/queries";
import { ProjectBrandingSections } from "@/components/sections/ProjectBrandingSections";
import { LongTermFeaturedContentSection } from "@/components/sections/LongTermFeaturedContentSection";
import { ProjectPhotos } from "@/components/sections/ProjectPhotos";
import { ProjectVfxComparisons } from "@/components/sections/ProjectVfxComparisons";
import { ProjectVideo } from "@/components/ui/ProjectVideo";
import { Button } from "@/components/ui/Button";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { ProjectFeaturedMedia } from "@/components/sections/ProjectFeaturedMedia";
import { ProjectStats } from "@/components/sections/ProjectStats";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageTitle, sectionDesc } from "@/lib/typography";
import { cn, hasContent } from "@/lib/utils";

export const revalidate = 60;

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

function renderMetaValue(
  value: string,
  options?: { href?: string | null; highlight?: boolean }
) {
  const className = cn(
    "type-card-body mt-2",
    options?.highlight ? "text-mariner" : "text-white",
    options?.href && "transition-colors hover:text-mariner"
  );

  if (options?.href) {
    return (
      <a
        href={options.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {value}
      </a>
    );
  }

  return <p className={className}>{value}</p>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(slug);
  const isLongTerm = project.pageLayout === "long_term";

  const isPhotography = projectIsPhotography(project.categories);
  const isBranding = projectIsBranding(project.categories);
  const isVfx = projectIsVfx(project.categories);
  const photos = project.photos ?? [];
  const brandingSections = project.brandingSections ?? [];
  const vfxComparisons = project.vfxComparisons ?? [];
  const hasPhotos = isPhotography && photos.length > 0;
  const hasBrandingSections =
    isBranding && brandingSections.some((section) => section.photos.length > 0);
  const hasVfxComparisons =
    isVfx &&
    vfxComparisons.some((c) => hasContent(c.beforeUrl) && hasContent(c.afterUrl));

  const showType = hasContent(project.type);
  const showDescription = hasContent(project.description);
  const hasVideography = project.categories.includes("videography");
  const showVideo =
    !isPhotography &&
    hasContent(project.videoUrl) &&
    (!isBranding || hasVideography);
  const showChallenge = hasContent(project.challenge);
  const showApproach = hasContent(project.approach);
  const showResult = hasContent(project.result);
  const showStory = showChallenge || showApproach || showResult;

  const metaItems = [
    {
      label: "Client",
      value: project.client,
      href: project.clientUrl,
    },
    { label: "Type", value: project.type },
    {
      label: "Category",
      value: getCategoriesLabel(project.categories),
    },
    ...(project.statsEnabled
      ? []
      : [{ label: "Result", value: project.stat, highlight: true }]),
  ].filter((item) => hasContent(item.value));

  const storyBlocks = [
    { label: "Challenge", value: project.challenge, show: showChallenge },
    { label: "Approach", value: project.approach, show: showApproach },
    {
      label: "Result",
      value: project.result,
      show: showResult,
      emphasized: true,
    },
  ].filter((block) => block.show);

  const showDetails = isLongTerm ? metaItems.length > 0 : showStory;

  const statsProps = project.statsEnabled
    ? {
        label: project.statsLabel ?? "",
        title: project.statsTitle ?? "",
        stats: [
          { value: project.statViews ?? "", label: "Views generated" },
          { value: project.statVideosEdited ?? "", label: "Videos edited" },
          {
            value: project.statYearsCollaboration ?? "",
            label: "Years collaboration",
          },
        ],
      }
    : null;

  const longTermFeaturedContent = project.longTermFeaturedContent;
  const longTermVfxSection = project.longTermVfxSection;

  const longTermStatsSection = isLongTerm && statsProps;

  return (
    <>
      <section className="pt-24 md:pt-32">
        <div
          className={cn(
            "mx-auto max-w-7xl px-6 md:px-8",
            isLongTerm && "text-center"
          )}
        >
          <Link
            href="/work"
            className={cn(
              "type-nav inline-flex items-center gap-2 text-mariner transition-colors hover:text-white",
              isLongTerm && "justify-center"
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Work
          </Link>

          <div className={cn("mt-8", !isLongTerm && "max-w-3xl")}>
            {showType && (
              <SectionLabel className={cn(isLongTerm && "text-center")}>
                {project.type}
              </SectionLabel>
            )}
            <h1 className={cn(pageTitle, showType ? "mt-3 md:mt-4" : "")}>
              {project.title}
            </h1>
            {hasContent(project.client) &&
              (hasContent(project.clientUrl) ? (
                <a
                  href={project.clientUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-nav mt-4 text-mariner transition-colors hover:text-white"
                >
                  {project.client}
                </a>
              ) : (
                <p className="type-nav mt-4 text-mariner">{project.client}</p>
              ))}
            {showDescription && (
              <p className={cn(sectionDesc, "mt-6")}>{project.description}</p>
            )}
          </div>

          {!isLongTerm && metaItems.length > 0 && (
            <div
              className={cn(
                "mt-10 grid gap-8 border-y border-white/5 py-10",
                metaItems.length === 1 && "md:grid-cols-1",
                metaItems.length === 2 && "md:grid-cols-2",
                metaItems.length === 3 && "md:grid-cols-3",
                metaItems.length >= 4 && "md:grid-cols-4"
              )}
            >
              {metaItems.map((item) => (
                <div key={item.label}>
                  <p className="type-meta">{item.label}</p>
                  {renderMetaValue(item.value, {
                    href: item.href,
                    highlight: item.highlight,
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {hasPhotos && !isLongTerm && (
        <ProjectPhotos photos={photos} title={project.title} />
      )}

      {hasBrandingSections && !isLongTerm && (
        <ProjectBrandingSections
          sections={brandingSections}
          projectTitle={project.title}
        />
      )}

      {showVideo && project.videoUrl && !isLongTerm && (
        <section className="mt-12">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <ProjectVideo
              url={project.videoUrl}
              title={project.title}
              thumbnailUrl={project.thumbnailUrl}
              videoMode={project.videoMode}
            />
          </div>
        </section>
      )}

      {showDetails && (
        <section className="py-16 md:py-20">
          <div
            className={cn(
              "mx-auto max-w-7xl px-6 md:px-8",
              isLongTerm && "text-center"
            )}
          >
            {isLongTerm && metaItems.length > 0 && (
              <div
                className={cn(
                  "grid gap-8 border-b border-white/5 py-10",
                  metaItems.length === 1 && "md:grid-cols-1",
                  metaItems.length === 2 && "md:grid-cols-2",
                  metaItems.length === 3 && "md:grid-cols-3",
                  metaItems.length >= 4 && "md:grid-cols-4"
                )}
              >
                {metaItems.map((item) => (
                  <div key={item.label}>
                    <p className="type-meta">{item.label}</p>
                    {renderMetaValue(item.value, {
                      href: item.href,
                      highlight: item.highlight,
                    })}
                  </div>
                ))}
              </div>
            )}

            {showStory && !isLongTerm && (
              <div
                className={cn(
                  "grid gap-12 lg:gap-16",
                  storyBlocks.length === 1 && "lg:grid-cols-1",
                  storyBlocks.length === 2 && "lg:grid-cols-2",
                  storyBlocks.length === 3 && "lg:grid-cols-3"
                )}
              >
                {storyBlocks.map((block) => (
                  <div key={block.label}>
                    <h2 className="type-meta">{block.label}</h2>
                    <p
                      className={cn(
                        "type-card-body mt-5",
                        block.emphasized && "text-white"
                      )}
                    >
                      {block.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {longTermStatsSection && (
        <section className="border-t border-white/5 bg-mine-shaft/20 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <ProjectStats {...statsProps} centered embedded />
          </div>
        </section>
      )}

      {isLongTerm && longTermFeaturedContent && (
        <LongTermFeaturedContentSection content={longTermFeaturedContent} />
      )}

      {isLongTerm && hasVfxComparisons && longTermVfxSection && (
        <ProjectVfxComparisons
          comparisons={vfxComparisons}
          projectTitle={project.title}
          label={longTermVfxSection.label}
          intro={longTermVfxSection.intro}
          centered
          subdued
        />
      )}

      {!isLongTerm && hasVfxComparisons && (
        <ProjectVfxComparisons
          comparisons={vfxComparisons}
          projectTitle={project.title}
        />
      )}

      {!isLongTerm && statsProps && <ProjectStats {...statsProps} />}

      {(project.featuredMedia?.length ?? 0) > 0 && (
        <ProjectFeaturedMedia
          media={project.featuredMedia ?? []}
          title={project.title}
        />
      )}

      {project.galleryEnabled && (
        <ProjectGallery
          label={project.galleryLabel ?? ""}
          title={project.galleryTitle ?? ""}
          images={project.galleryImages ?? []}
          centered={isLongTerm}
        />
      )}

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div
            className={cn(
              "flex flex-col gap-8 border border-white/5 bg-mine-shaft p-8 md:p-12",
              isLongTerm
                ? "items-center text-center"
                : "items-center justify-between md:flex-row"
            )}
          >
            {next ? (
              <>
                <div>
                  <p className="type-meta">Next Project</p>
                  <h3 className="type-card-title-lg mt-3">{next.title}</h3>
                  <p className="type-nav mt-2 text-mariner">{next.client}</p>
                </div>
                <Button href={`/work/${next.slug}`} variant="primary">
                  View Case
                </Button>
              </>
            ) : (
              <>
                <div>
                  <p className="type-meta">Explore More</p>
                  <h3 className="type-card-title-lg mt-3">
                    See all projects
                  </h3>
                </div>
                <Button href="/work" variant="primary">
                  View All Work
                </Button>
              </>
            )}
          </div>

          {prev && (
            <div className="mt-4 text-center">
              <Link
                href={`/work/${prev.slug}`}
                className="type-nav text-mariner transition-colors hover:text-white"
              >
                ← Previous: {prev.title}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
