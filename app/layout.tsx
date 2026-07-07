import type { Metadata, Viewport } from "next";
import { questrial } from "@/lib/fonts";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#25252a",
};

export const metadata: Metadata = {
  title: {
    default: "Roger Noordover — Video Editor & Videographer",
    template: "%s | Roger Noordover",
  },
  description:
    "Freelance video editor, videographer and VFX artist creating high-quality content for brands and creators. Video editing, motion graphics, and production.",
  keywords: [
    "video editor",
    "videographer",
    "VFX",
    "motion graphics",
    "freelance",
    "Netherlands",
    "Roger Noordover",
  ],
  authors: [{ name: "Roger Noordover" }],
  openGraph: {
    title: "Roger Noordover — Video Editor & Videographer",
    description:
      "Video editing, VFX and production for brands and creators.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${questrial.variable} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-shark font-body text-silver antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
