import Image from "next/image";
import {
  getPlatformMeta,
  parseVideoUrl,
  resolveVideoDisplay,
  type VideoModeSetting,
} from "@/lib/video/embed";
import { cn } from "@/lib/utils";

interface ProjectVideoProps {
  url: string;
  title: string;
  thumbnailUrl?: string | null;
  videoMode?: VideoModeSetting;
}

function VideoEmbedPlayer({ url, title }: { url: string; title: string }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.provider === "direct") {
    return (
      <video
        src={parsed.embedUrl}
        title={title}
        controls
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (parsed.provider === "youtube" || parsed.provider === "vimeo") {
    return (
      <iframe
        src={parsed.embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return null;
}

function ExternalVideoCard({
  url,
  title,
  thumbnailUrl,
}: {
  url: string;
  title: string;
  thumbnailUrl?: string | null;
}) {
  const { badge, cta } = getPlatformMeta(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden bg-mine-shaft"
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          unoptimized
        />
      ) : (
        <div className="placeholder-shimmer absolute inset-0" />
      )}

      <div className="absolute inset-0 bg-shark/50 transition-colors group-hover:bg-shark/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-shark/70 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <svg
            className="ml-1 h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <p className="font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.2em] text-mariner">
            {badge}
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-lg font-bold text-white transition-colors group-hover:text-mariner md:text-xl">
            {cta} ↗
          </p>
        </div>
      </div>
    </a>
  );
}

export function ProjectVideo({
  url,
  title,
  thumbnailUrl,
  videoMode = "auto",
}: ProjectVideoProps) {
  const display = resolveVideoDisplay(url, videoMode);

  if (display === "external") {
    return (
      <ExternalVideoCard url={url} title={title} thumbnailUrl={thumbnailUrl} />
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-mine-shaft">
      <VideoEmbedPlayer url={url} title={title} />
    </div>
  );
}
