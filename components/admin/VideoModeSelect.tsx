"use client";

import {
  autoVideoDisplay,
  resolveVideoDisplay,
  supportsOnSiteEmbed,
  type VideoModeSetting,
} from "@/lib/video/embed";
import { cn } from "@/lib/utils";

const options: {
  value: VideoModeSetting;
  label: string;
  description: string;
}[] = [
  {
    value: "auto",
    label: "Auto",
    description:
      "Horizontal videos play on site. Instagram, TikTok & Shorts link out.",
  },
  {
    value: "embed",
    label: "Watch on site",
    description: "Embed the video player on the case study page.",
  },
  {
    value: "external",
    label: "Link out",
    description: "Show thumbnail with a button to open the video externally.",
  },
];

interface VideoModeSelectProps {
  value: VideoModeSetting;
  onChange: (mode: VideoModeSetting) => void;
  videoUrl: string | null;
}

export function VideoModeSelect({
  value,
  onChange,
  videoUrl,
}: VideoModeSelectProps) {
  const preview =
    videoUrl?.trim()
      ? resolveVideoDisplay(videoUrl, value)
      : null;

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-4 py-3 text-left transition-colors",
              value === opt.value
                ? "border-mariner bg-mariner/10"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <span className="font-[family-name:var(--font-ui)] text-sm text-white">
              {opt.label}
            </span>
            <span className="mt-1 block font-[family-name:var(--font-body)] text-xs leading-relaxed text-silver/50">
              {opt.description}
            </span>
          </button>
        ))}
      </div>

      {videoUrl?.trim() && preview && (
        <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
          {preview === "embed" ? (
            <>
              Preview: video will play on the case study page
              {value === "auto" && supportsOnSiteEmbed(videoUrl) && " (auto-detected)"}.
            </>
          ) : (
            <>
              Preview: horizontal thumbnail with link to{" "}
              {autoVideoDisplay(videoUrl) === "external" && value === "auto"
                ? "external platform (auto-detected)"
                : "external platform"}
              . Upload a thumbnail for best results.
            </>
          )}
        </p>
      )}
    </div>
  );
}
