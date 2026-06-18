import Image from "next/image";
import { isDirectVideoUrl } from "@/lib/projects/media";

interface ProjectFeaturedMediaProps {
  media: string[];
  title: string;
}

function FeaturedMediaItem({ url, alt }: { url: string; alt: string }) {
  if (isDirectVideoUrl(url)) {
    return (
      <div className="overflow-hidden bg-mine-shaft">
        <video
          src={url}
          title={alt}
          controls
          playsInline
          className="block w-full"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-mine-shaft">
      <Image
        src={url}
        alt={alt}
        width={1920}
        height={1080}
        className="h-auto w-full"
        unoptimized
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
    </div>
  );
}

export function ProjectFeaturedMedia({ media, title }: ProjectFeaturedMediaProps) {
  if (media.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col gap-6 md:gap-8">
          {media.map((url, index) => (
            <FeaturedMediaItem
              key={`${url}-${index}`}
              url={url}
              alt={`${title} — featured media ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
