import Image from "next/image";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  siteName: string;
  logoUrl: string | null;
  logoInitial: string;
  className?: string;
  imageClassName?: string;
  initialClassName?: string;
}

export function SiteLogo({
  siteName,
  logoUrl,
  logoInitial,
  className,
  imageClassName,
  initialClassName,
}: SiteLogoProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-white/20 bg-mine-shaft",
        className
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${siteName} logo`}
          width={36}
          height={36}
          className={cn("h-full w-full object-contain p-1", imageClassName)}
          unoptimized
        />
      ) : (
        <span
          className={cn(
            "type-card-title text-base text-white md:text-lg",
            initialClassName
          )}
        >
          {logoInitial}
        </span>
      )}
    </div>
  );
}
