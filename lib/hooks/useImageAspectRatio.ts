"use client";

import { useEffect, useState } from "react";

export function useImageAspectRatio(url: string | null | undefined) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!url) {
      setAspectRatio(null);
      return;
    }

    let cancelled = false;
    const img = new window.Image();

    img.onload = () => {
      if (
        !cancelled &&
        img.naturalWidth > 0 &&
        img.naturalHeight > 0
      ) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };

    img.onerror = () => {
      if (!cancelled) setAspectRatio(null);
    };

    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return aspectRatio;
}

export function imageContainerWidth(
  aspectRatio: number,
  maxHeightPx: number
): string {
  return `min(100%, calc(${maxHeightPx}px * ${aspectRatio}))`;
}
