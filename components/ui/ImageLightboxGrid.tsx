"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageLightboxGridProps {
  images: string[];
  altPrefix: string;
  gridClassName?: string;
  itemAspectClass?: string;
}

export function ImageLightboxGrid({
  images,
  altPrefix,
  gridClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  itemAspectClass = "aspect-[4/3]",
}: ImageLightboxGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : i === 0 ? images.length - 1 : i - 1
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : i === images.length - 1 ? 0 : i + 1
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  const activeUrl = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className={gridClassName}>
        {images.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "group relative block w-full cursor-zoom-in overflow-hidden bg-mine-shaft text-left",
              itemAspectClass
            )}
            aria-label={`View ${altPrefix} — image ${index + 1}`}
          >
            <Image
              src={url}
              alt={`${altPrefix} — image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              unoptimized
            />
            <div className="absolute inset-0 bg-shark/0 transition-colors group-hover:bg-shark/20" />
          </button>
        ))}
      </div>

      {activeUrl !== null && activeIndex !== null && (
        <div
          className="site-modal flex items-center justify-center bg-shark/95 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-mine-shaft/80 font-[family-name:var(--font-ui)] text-white transition-colors hover:border-white/20 hover:bg-mine-shaft"
            aria-label="Close preview"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-mine-shaft/80 text-white transition-colors hover:border-white/20 hover:bg-mine-shaft"
                aria-label="Previous image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-mine-shaft/80 text-white transition-colors hover:border-white/20 hover:bg-mine-shaft"
                aria-label="Next image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 font-[family-name:var(--font-ui)] text-xs text-silver/60">
                {activeIndex + 1} / {images.length}
              </p>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeUrl}
              alt={`${altPrefix} — image ${activeIndex + 1}`}
              width={1920}
              height={1280}
              className="max-h-[90vh] w-auto max-w-[90vw] object-contain"
              unoptimized
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
