import { ImageLightboxGrid } from "@/components/ui/ImageLightboxGrid";
import { cardTitleLg } from "@/lib/typography";
import type { BrandingSection } from "@/lib/projects/types";
import { cn, hasContent } from "@/lib/utils";

interface ProjectBrandingSectionsProps {
  sections: BrandingSection[];
  projectTitle: string;
  centered?: boolean;
}

export function ProjectBrandingSections({
  sections,
  projectTitle,
  centered = false,
}: ProjectBrandingSectionsProps) {
  const visible = sections.filter((section) => section.photos.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="mt-12">
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 md:px-8",
          centered && "text-center"
        )}
      >
        <div className="flex flex-col gap-16 md:gap-20">
          {visible.map((section, index) => (
            <div key={section.id ?? `${section.title}-${index}`}>
              {hasContent(section.title) && (
                <h2 className={cn(cardTitleLg, "mb-8")}>{section.title}</h2>
              )}
              <ImageLightboxGrid
                images={section.photos}
                altPrefix={section.title || projectTitle}
                gridClassName={
                  section.photos.length === 1
                    ? "grid grid-cols-1"
                    : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                }
                itemAspectClass={
                  section.photos.length === 1 ? "aspect-[16/10]" : "aspect-[4/3]"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
