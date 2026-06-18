"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  imageContainerWidth,
  useImageAspectRatio,
} from "@/lib/hooks/useImageAspectRatio";
import { cn } from "@/lib/utils";

interface ThumbnailUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  slug: string;
  pathPrefix?: string;
  aspectClass?: string;
  emptyLabel?: string;
  uploadLabel?: string;
  matchImageAspect?: boolean;
  maxPreviewHeight?: number;
  compact?: boolean;
  imageFit?: "cover" | "contain";
}

export function ThumbnailUpload({
  value,
  onChange,
  slug,
  pathPrefix = "",
  aspectClass = "aspect-[16/10]",
  emptyLabel = "No image uploaded",
  uploadLabel,
  matchImageAspect = false,
  maxPreviewHeight = 480,
  compact = false,
  imageFit = "cover",
}: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aspectRatio = useImageAspectRatio(matchImageAspect ? value : null);
  const ratio = aspectRatio ?? 3 / 4;

  async function handleUpload(file: File) {
    if (!slug.trim()) {
      setError("Enter a slug before uploading.");
      return;
    }

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${pathPrefix}${slug.trim()}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-thumbnails")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-thumbnails").getPublicUrl(path);

    onChange(publicUrl);
    setUploading(false);
  }

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-white/10 bg-mine-shaft",
          (!matchImageAspect || !value) && aspectClass,
          !value && "flex items-center justify-center",
          value && matchImageAspect && "mx-auto",
          compact && "max-h-24"
        )}
        style={
          value && matchImageAspect
            ? {
                width: imageContainerWidth(
                  ratio,
                  compact ? Math.min(maxPreviewHeight, 96) : maxPreviewHeight
                ),
                aspectRatio: ratio,
              }
            : undefined
        }
      >
        {value ? (
          <Image
            src={value}
            alt="Thumbnail preview"
            fill
            className={imageFit === "contain" ? "object-contain p-2" : "object-cover"}
            unoptimized
          />
        ) : (
          <p
            className={cn(
              "font-[family-name:var(--font-ui)] text-silver/40",
              compact ? "px-2 text-center text-[0.625rem]" : "text-xs"
            )}
          >
            {emptyLabel}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-md bg-mariner font-[family-name:var(--font-ui)] text-white transition-colors hover:bg-mariner/90 disabled:opacity-50",
            compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"
          )}
        >
          {uploading
            ? "Uploading…"
            : uploadLabel ?? (value ? "Replace" : "Upload")}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={cn(
              "rounded-md border border-white/10 font-[family-name:var(--font-ui)] text-silver/70 transition-colors hover:border-white/20 hover:text-white",
              compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"
            )}
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="font-[family-name:var(--font-ui)] text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
