"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isDirectVideoUrl, isFeaturedMediaFile } from "@/lib/projects/media";
import { cn, reorderArray } from "@/lib/utils";

interface FeaturedMediaEditorProps {
  media: string[];
  onChange: (media: string[]) => void;
  slug: string;
}

function DragHandleIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-white/80"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

export function FeaturedMediaEditor({
  media,
  onChange,
  slug,
}: FeaturedMediaEditorProps) {
  const filesInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  async function uploadFile(file: File, index: number): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `featured/${slug.trim()}-${Date.now()}-${index}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-thumbnails")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-thumbnails").getPublicUrl(path);

    return publicUrl;
  }

  async function handleUploadFiles(fileList: FileList | File[]) {
    if (!slug.trim()) {
      setError("Enter a slug before uploading.");
      return;
    }

    const files = Array.from(fileList)
      .filter(isFeaturedMediaFile)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (files.length === 0) {
      setError("No supported files found. Use images (JPG, PNG, GIF, WebP) or MP4/WebM video.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(`Uploading 0 of ${files.length}…`);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}…`);
        const url = await uploadFile(files[i], i);
        if (url) uploadedUrls.push(url);
      }

      onChange([...media, ...uploadedUrls]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(
        uploadedUrls.length > 0
          ? `${message} (${uploadedUrls.length} of ${files.length} uploaded — save to keep them.)`
          : message
      );
      if (uploadedUrls.length > 0) {
        onChange([...media, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function removeMedia(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  function reorderMedia(fromIndex: number, toIndex: number) {
    onChange(reorderArray(media, fromIndex, toIndex));
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
    setDropIndex(index);
  }

  function handleDragOver(event: React.DragEvent, index: number) {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDropIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null) return;
    reorderMedia(dragIndex, index);
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div className="space-y-4">
      {media.length > 1 && (
        <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
          Drag items by the handle to change their order on the case study page.
        </p>
      )}

      {media.length > 0 && (
        <div className="space-y-4">
          {media.map((url, index) => {
            const isVideo = isDirectVideoUrl(url);
            const isDragging = dragIndex === index;
            const isDropTarget =
              dropIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <div
                key={`${url}-${index}`}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={() => handleDrop(index)}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-mine-shaft transition-[opacity,box-shadow,border-color]",
                  isDragging && "opacity-50",
                  isDropTarget
                    ? "border-mariner/50 shadow-[0_0_0_1px_rgba(44,114,184,0.35)]"
                    : "border-white/10"
                )}
              >
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    playsInline
                    className="aspect-video w-full bg-shark object-contain"
                  />
                ) : (
                  <div className="relative w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Featured media ${index + 1}`}
                      className="block h-auto w-full"
                    />
                  </div>
                )}

                {media.length > 1 && (
                  <div
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                      handleDragStart(index);
                    }}
                    onDragEnd={handleDragEnd}
                    aria-label={`Drag media ${index + 1}`}
                    className="absolute top-2 right-2 z-10 flex cursor-grab items-center rounded border border-white/20 bg-shark/90 p-1.5 active:cursor-grabbing"
                  >
                    <DragHandleIcon />
                  </div>
                )}

                <div className="absolute right-2 bottom-2">
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="rounded bg-shark/90 px-2 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-red-300 transition-colors hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <input
        ref={filesInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,.gif,.mp4,.webm,.mov"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleUploadFiles(files);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => filesInputRef.current?.click()}
        className="w-full rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white disabled:opacity-50"
      >
        {uploading ? uploadProgress ?? "Uploading…" : "+ Add full-width media"}
      </button>

      <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
        Upload images, GIFs, or MP4 files. They appear full width above the Behind
        the Scenes gallery — same width as the three-column gallery grid.
      </p>

      {error && (
        <p className="font-[family-name:var(--font-ui)] text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
