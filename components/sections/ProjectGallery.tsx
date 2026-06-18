import { SectionLabel } from "@/components/ui/SectionLabel";

import { ImageLightboxGrid } from "@/components/ui/ImageLightboxGrid";

import { sectionTitle } from "@/lib/typography";

import { cn, hasContent } from "@/lib/utils";



interface ProjectGalleryProps {
  label: string;
  title: string;
  images: string[];
  centered?: boolean;
}

export function ProjectGallery({
  label,
  title,
  images,
  centered = false,
}: ProjectGalleryProps) {

  if (images.length === 0) return null;



  const showLabel = hasContent(label);

  const showTitle = hasContent(title);

  const showHeader = showLabel || showTitle;



  return (

    <section className="border-t border-white/5 bg-mine-shaft/20 py-16 md:py-20">
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 md:px-8",
          centered && "text-center"
        )}
      >
        {showLabel && (
          <SectionLabel className={cn(centered && "text-center")}>{label}</SectionLabel>
        )}

        {showTitle && (

          <h2

            className={cn(

              sectionTitle,

              showLabel ? "mt-3 md:mt-4" : undefined

            )}

          >

            {title}

          </h2>

        )}

        <div className={cn(showHeader ? "mt-10" : undefined)}>

          <ImageLightboxGrid

            images={images}

            altPrefix={title || label || "Gallery"}

          />

        </div>

      </div>

    </section>

  );

}


