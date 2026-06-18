import { cn } from "@/lib/utils";

interface VideoPlaceholderProps {
  className?: string;
  label?: string;
  aspect?: string;
}

export function VideoPlaceholder({
  className,
  label = "Video Placeholder",
  aspect = "aspect-video",
}: VideoPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-mine-shaft",
        aspect,
        className
      )}
    >
      <div className="placeholder-shimmer absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-shark/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-shark/60 backdrop-blur-sm">
          <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {label && (
        <div className="absolute bottom-4 left-4 rounded-sm bg-shark/80 px-3 py-1.5 text-xs text-silver backdrop-blur-sm">
          {label}
        </div>
      )}
    </div>
  );
}
