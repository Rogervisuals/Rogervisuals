export type VideoEmbedProvider =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "tiktok"
  | "direct"
  | "unknown";

export type VideoAspect = "landscape" | "vertical";

export type VideoModeSetting = "auto" | "embed" | "external";

export interface VideoEmbed {
  provider: VideoEmbedProvider;
  embedUrl: string;
  aspect: VideoAspect;
  originalUrl: string;
}

export interface PlatformMeta {
  badge: string;
  cta: string;
}

export function parseVideoUrl(url: string): VideoEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]+)/
  );
  if (youtubeMatch) {
    const isShort = trimmed.includes("/shorts/");
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      aspect: isShort ? "vertical" : "landscape",
      originalUrl: trimmed,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      aspect: "landscape",
      originalUrl: trimmed,
    };
  }

  const tiktokMatch = trimmed.match(
    /tiktok\.com\/@[\w.]+\/video\/(\d+)|vm\.tiktok\.com\/([\w-]+)|tiktok\.com\/t\/([\w-]+)/
  );
  if (tiktokMatch) {
    return {
      provider: "tiktok",
      embedUrl: trimmed,
      aspect: "vertical",
      originalUrl: trimmed,
    };
  }

  const reelMatch = trimmed.match(/instagram\.com\/(?:reel|reels)\/([\w-]+)/);
  if (reelMatch) {
    return {
      provider: "instagram",
      embedUrl: `https://www.instagram.com/reel/${reelMatch[1]}/embed`,
      aspect: "vertical",
      originalUrl: trimmed,
    };
  }

  const postMatch = trimmed.match(/instagram\.com\/p\/([\w-]+)/);
  if (postMatch) {
    return {
      provider: "instagram",
      embedUrl: `https://www.instagram.com/p/${postMatch[1]}/embed`,
      aspect: "vertical",
      originalUrl: trimmed,
    };
  }

  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(trimmed)) {
    return {
      provider: "direct",
      embedUrl: trimmed,
      aspect: "landscape",
      originalUrl: trimmed,
    };
  }

  if (trimmed.includes("instagram.com")) {
    return {
      provider: "instagram",
      embedUrl: trimmed,
      aspect: "vertical",
      originalUrl: trimmed,
    };
  }

  if (trimmed.startsWith("http")) {
    return {
      provider: "unknown",
      embedUrl: trimmed,
      aspect: "landscape",
      originalUrl: trimmed,
    };
  }

  return null;
}

export function supportsOnSiteEmbed(url: string): boolean {
  const parsed = parseVideoUrl(url);
  if (!parsed) return false;

  switch (parsed.provider) {
    case "youtube":
      return parsed.aspect === "landscape";
    case "vimeo":
    case "direct":
      return true;
    default:
      return false;
  }
}

export function autoVideoDisplay(url: string): "embed" | "external" {
  return supportsOnSiteEmbed(url) ? "embed" : "external";
}

export function resolveVideoDisplay(
  url: string,
  mode: VideoModeSetting = "auto"
): "embed" | "external" {
  if (mode === "external") return "external";
  if (mode === "embed") {
    return supportsOnSiteEmbed(url) ? "embed" : "external";
  }
  return autoVideoDisplay(url);
}

export function getPlatformMeta(url: string): PlatformMeta {
  const parsed = parseVideoUrl(url);

  if (!parsed) {
    return { badge: "Video", cta: "Watch video" };
  }

  switch (parsed.provider) {
    case "instagram":
      return {
        badge: /\/reel|\/reels/.test(url) ? "Instagram Reel" : "Instagram",
        cta: "Watch on Instagram",
      };
    case "tiktok":
      return { badge: "TikTok", cta: "Watch on TikTok" };
    case "youtube":
      return {
        badge: parsed.aspect === "vertical" ? "YouTube Short" : "YouTube",
        cta: "Watch on YouTube",
      };
    case "vimeo":
      return { badge: "Vimeo", cta: "Watch on Vimeo" };
    default:
      return { badge: "Video", cta: "Watch video" };
  }
}
