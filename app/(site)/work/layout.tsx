import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Portfolio of video editing, videography, VFX, and social content projects by Roger Noordover.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
