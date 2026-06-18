import { ImageLightboxGrid } from "@/components/ui/ImageLightboxGrid";
import { cn } from "@/lib/utils";

interface ProjectPhotosProps {
  photos: string[];
  title: string;
  centered?: boolean;
}

export function ProjectPhotos({ photos, title, centered = false }: ProjectPhotosProps) {
  if (photos.length === 0) return null;

  return (
    <section className="mt-12">
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 md:px-8",
          centered && "text-center"
        )}
      >
        <ImageLightboxGrid
          images={photos}
          altPrefix={title}
          gridClassName={
            photos.length === 1
              ? "grid grid-cols-1"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
          itemAspectClass={
            photos.length === 1 ? "aspect-[16/10]" : "aspect-[4/3]"
          }
        />
      </div>
    </section>
  );
}
