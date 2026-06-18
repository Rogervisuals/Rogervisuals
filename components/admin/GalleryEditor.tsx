"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { cn, reorderArray } from "@/lib/utils";

interface GalleryEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
  slug: string;
  pathPrefix?: string;
  addLabel?: string;
  coverUrl?: string | null;
  onSetCover?: (url: string | null) => void;
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif|tiff?)$/i.test(file.name);
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

export function GalleryEditor({
  images,
  onChange,
  slug,
  pathPrefix = "gallery/",
  addLabel = "+ Add photos",
  coverUrl,
  onSetCover,
}: GalleryEditorProps) {
  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  async function uploadFile(file: File, index: number): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${pathPrefix}${slug.trim()}-${Date.now()}-${index}.${ext}`;

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
      .filter(isImageFile)
      .sort((a, b) =>
        (a.webkitRelativePath || a.name).localeCompare(
          b.webkitRelativePath || b.name
        )
      );

    if (files.length === 0) {
      setError("No image files found. Supported: JPG, PNG, WebP, GIF, and similar.");
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

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(
        uploadedUrls.length > 0
          ? `${message} (${uploadedUrls.length} of ${files.length} uploaded — save to keep them.)`
          : message
      );
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function removeImage(index: number) {
    const removed = images[index];
    onChange(images.filter((_, i) => i !== index));
    if (onSetCover && coverUrl === removed) {
      onSetCover(null);
    }
  }

  function reorderImages(fromIndex: number, toIndex: number) {
    onChange(reorderArray(images, fromIndex, toIndex));
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
    reorderImages(dragIndex, index);
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div className="space-y-4">
      {images.length > 1 && (
        <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
          Drag photos by the handle to change their order.
        </p>
      )}

      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((url, index) => {
            const isDragging = dragIndex === index;
            const isDropTarget =
              dropIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <div
                key={url}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={() => handleDrop(index)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border bg-mine-shaft transition-[opacity,box-shadow,border-color]",
                  coverUrl === url ? "border-mariner" : "border-white/10",
                  isDragging && "opacity-50",
                  isDropTarget &&
                    "border-mariner/50 shadow-[0_0_0_1px_rgba(44,114,184,0.35)]"
                )}
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {images.length > 1 && (
                  <div
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(index));
                      handleDragStart(index);
                    }}
                    onDragEnd={handleDragEnd}
                    aria-label={`Drag photo ${index + 1}`}
                    className="absolute top-2 right-2 z-10 flex cursor-grab items-center rounded border border-white/20 bg-shark/90 p-1.5 active:cursor-grabbing"
                  >
                    <DragHandleIcon />
                  </div>
                )}

                {coverUrl === url && (
                  <span className="absolute top-2 left-2 rounded bg-mariner px-2 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-white">
                    Cover
                  </span>
                )}

                <div className="absolute right-2 bottom-2 left-2 flex flex-wrap gap-1.5">
                  {onSetCover && coverUrl !== url && (
                    <button
                      type="button"
                      onClick={() => onSetCover(url)}
                      className="rounded bg-shark/90 px-2 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-mariner transition-colors hover:text-white"
                    >
                      Set as cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="ml-auto rounded bg-shark/90 px-2 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-red-300 transition-colors hover:text-red-200"
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
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleUploadFiles(files);
          e.target.value = "";
        }}
      />

      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) handleUploadFiles(files);
          e.target.value = "";
        }}
        {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => filesInputRef.current?.click()}
          className="rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white disabled:opacity-50"
        >
          {uploading ? uploadProgress ?? "Uploading…" : addLabel}
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => folderInputRef.current?.click()}
          className="rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white disabled:opacity-50"
        >
          Add folder
        </button>
      </div>

      <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
        Select multiple images at once, or upload an entire folder.
      </p>

      {error && (
        <p className="font-[family-name:var(--font-ui)] text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
