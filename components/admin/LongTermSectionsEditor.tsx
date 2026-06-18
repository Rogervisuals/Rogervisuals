"use client";

import { useState } from "react";
import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import {
  createLongTermFeaturedItem,
  longTermFeaturedDefaults,
  type LongTermFeaturedContent,
  type LongTermFeaturedItem,
} from "@/lib/projects/types";
import { cn } from "@/lib/utils";

interface LongTermSectionsEditorProps {
  featuredContent: LongTermFeaturedContent;
  slug: string;
  onFeaturedContentChange: (value: LongTermFeaturedContent) => void;
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
      {children}
    </label>
  );
}

function updateFeaturedItem(
  items: LongTermFeaturedItem[],
  index: number,
  patch: Partial<LongTermFeaturedItem>
) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  );
}

export function LongTermSectionsEditor({
  featuredContent,
  slug,
  onFeaturedContentChange,
}: LongTermSectionsEditorProps) {
  const [open, setOpen] = useState(false);

  function addFeaturedItem() {
    onFeaturedContentChange({
      ...featuredContent,
      items: [...featuredContent.items, createLongTermFeaturedItem()],
    });
  }

  function removeFeaturedItem(index: number) {
    onFeaturedContentChange({
      ...featuredContent,
      items: featuredContent.items.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  return (
    <div className="rounded-lg border border-white/5 bg-mine-shaft/20">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div>
          <FieldLabel>Featured content</FieldLabel>
          <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
            Premium 2×2 showcase grid. Cards open a modal with the linked reel or video.
          </p>
        </div>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 text-mariner transition-transform duration-300",
            open && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="space-y-6 border-t border-white/5 px-6 pt-6 pb-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel>Section label</FieldLabel>
              <input
                className={inputClass}
                placeholder={longTermFeaturedDefaults.label}
                value={featuredContent.label}
                onChange={(e) =>
                  onFeaturedContentChange({
                    ...featuredContent,
                    label: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>Section title</FieldLabel>
              <input
                className={inputClass}
                placeholder={longTermFeaturedDefaults.title}
                value={featuredContent.title}
                onChange={(e) =>
                  onFeaturedContentChange({
                    ...featuredContent,
                    title: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-6">
            {featuredContent.items.map((item, index) => (
              <div
                key={item.id ?? `featured-${index}`}
                className="rounded-md border border-white/5 bg-shark/40 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
                    Card {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFeaturedItem(index)}
                    className="font-[family-name:var(--font-ui)] text-xs text-silver/50 transition-colors hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Project title</FieldLabel>
                      <input
                        className={inputClass}
                        value={item.title}
                        onChange={(e) =>
                          onFeaturedContentChange({
                            ...featuredContent,
                            items: updateFeaturedItem(featuredContent.items, index, {
                              title: e.target.value,
                            }),
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Category label</FieldLabel>
                      <input
                        className={inputClass}
                        value={item.category}
                        onChange={(e) =>
                          onFeaturedContentChange({
                            ...featuredContent,
                            items: updateFeaturedItem(featuredContent.items, index, {
                              category: e.target.value,
                            }),
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Media URL</FieldLabel>
                      <input
                        className={inputClass}
                        placeholder="Instagram reel, YouTube, or direct video URL"
                        value={item.mediaUrl}
                        onChange={(e) =>
                          onFeaturedContentChange({
                            ...featuredContent,
                            items: updateFeaturedItem(featuredContent.items, index, {
                              mediaUrl: e.target.value,
                            }),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Thumbnail</FieldLabel>
                    <ThumbnailUpload
                      value={item.thumbnailUrl || null}
                      onChange={(thumbnailUrl) =>
                        onFeaturedContentChange({
                          ...featuredContent,
                          items: updateFeaturedItem(featuredContent.items, index, {
                            thumbnailUrl: thumbnailUrl ?? "",
                          }),
                        })
                      }
                      slug={slug}
                      pathPrefix="featured-"
                      aspectClass="aspect-[16/10]"
                      emptyLabel="Upload landscape thumbnail"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFeaturedItem}
            className="rounded-md border border-white/10 px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-silver transition-colors hover:border-white/20 hover:text-white"
          >
            Add featured card
          </button>
        </div>
      )}
    </div>
  );
}
