export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url.trim());
}

export function isFeaturedMediaFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  if (file.type.startsWith("video/")) return true;
  return /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif|tiff?|mp4|webm|mov)$/i.test(
    file.name
  );
}
