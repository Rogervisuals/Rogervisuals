import type { Metadata } from "next";
import { getGeneralSettings } from "@/lib/site-settings/general";

export async function generateMetadata(): Promise<Metadata> {
  const { branding } = await getGeneralSettings();

  return {
    title: {
      default: "Admin",
      template: "%s | Admin | Roger Visuals",
    },
    robots: { index: false, follow: false },
    ...(branding.faviconUrl
      ? { icons: { icon: branding.faviconUrl } }
      : {}),
  };
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
