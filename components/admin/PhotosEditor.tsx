"use client";

import { GalleryEditor } from "@/components/admin/GalleryEditor";

interface PhotosEditorProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  slug: string;
  coverUrl?: string | null;
  onSetCover?: (url: string | null) => void;
}

export function PhotosEditor({
  photos,
  onChange,
  slug,
  coverUrl,
  onSetCover,
}: PhotosEditorProps) {
  return (
    <GalleryEditor
      images={photos}
      onChange={onChange}
      slug={slug}
      pathPrefix="photos/"
      addLabel="+ Add photos"
      coverUrl={coverUrl}
      onSetCover={onSetCover}
    />
  );
}
