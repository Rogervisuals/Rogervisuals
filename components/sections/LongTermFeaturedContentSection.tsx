"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { LongTermFeaturedContent, LongTermFeaturedItem } from "@/lib/projects/types";
import { cardTitle, sectionTitle } from "@/lib/typography";
import { parseVideoUrl } from "@/lib/video/embed";
import { cn, hasContent } from "@/lib/utils";

interface LongTermFeaturedContentSectionProps {
  content: LongTermFeaturedContent;
}

function FeaturedContentModal({
  item,
  onClose,
}: {
  item: LongTermFeaturedItem;
  onClose: () => void;
}) {
  const parsed = parseVideoUrl(item.mediaUrl);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="site-modal flex items-center justify-center bg-shark/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-mine-shaft/80 font-[family-name:var(--font-ui)] text-white transition-colors hover:border-white/20 hover:bg-mine-shaft"
        aria-label="Close preview"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 text-center">
          {hasContent(item.category) && (
            <p className="type-meta text-mariner">{item.category}</p>
          )}
          <h3 className="type-card-title-lg mt-2 text-white">{item.title}</h3>
        </div>

        <div className="relative mx-auto aspect-video w-full overflow-hidden bg-mine-shaft">
          {parsed?.provider === "direct" ? (
            <video
              src={parsed.embedUrl}
              title={item.title}
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : parsed &&
            (parsed.provider === "youtube" ||
              parsed.provider === "vimeo" ||
              parsed.provider === "instagram") ? (
            <iframe
              src={parsed.embedUrl}
              title={item.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="type-card-body text-silver/70">
                Open this content in a new tab to view the full reel.
              </p>
              <a
                href={item.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-nav text-mariner transition-colors hover:text-white"
              >
                View content ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedContentCard({
  item,
  index,
  onOpen,
}: {
  item: LongTermFeaturedItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left"
      aria-label={`View ${item.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mine-shaft">
        {hasContent(item.thumbnailUrl) ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="placeholder-shimmer absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-shark/20 transition-colors duration-300 group-hover:bg-mariner/10" />
        <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-mariner transition-transform duration-300 group-hover:scale-x-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-shark/70 backdrop-blur-sm">
            <svg
              className="ml-1 h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 border-b border-white/5 pb-5 transition-colors duration-300 group-hover:border-mariner/30">
        {hasContent(item.category) && (
          <p className="type-meta text-mariner">{item.category}</p>
        )}
        <h3
          className={cn(
            cardTitle,
            "mt-2 transition-colors duration-300 group-hover:text-mariner"
          )}
        >
          {item.title}
        </h3>
      </div>
    </button>
  );
}

export function LongTermFeaturedContentSection({
  content,
}: LongTermFeaturedContentSectionProps) {
  const [activeItem, setActiveItem] = useState<LongTermFeaturedItem | null>(null);

  const close = useCallback(() => setActiveItem(null), []);

  const items = content.items.filter(
    (item) =>
      hasContent(item.title) &&
      hasContent(item.thumbnailUrl) &&
      hasContent(item.mediaUrl)
  );

  if (items.length === 0) return null;

  const showHeader = hasContent(content.label) || hasContent(content.title);

  return (
    <>
      <section className="border-t border-white/5 bg-mine-shaft/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
          {hasContent(content.label) && (
            <SectionLabel className="text-center">{content.label}</SectionLabel>
          )}
          {hasContent(content.title) && (
            <h2
              className={cn(
                sectionTitle,
                hasContent(content.label) ? "mt-3 md:mt-4" : undefined
              )}
            >
              {content.title}
            </h2>
          )}

          <div
            className={cn(
              "grid gap-8 sm:grid-cols-2",
              showHeader ? "mt-12 md:mt-16" : undefined
            )}
          >
            {items.map((item, index) => (
              <FeaturedContentCard
                key={item.id ?? `${item.title}-${index}`}
                item={item}
                index={index}
                onOpen={() => setActiveItem(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeItem && (
        <FeaturedContentModal item={activeItem} onClose={close} />
      )}
    </>
  );
}
