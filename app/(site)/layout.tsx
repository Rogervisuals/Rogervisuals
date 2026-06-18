import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteTheme } from "@/components/theme/SiteTheme";
import { getGeneralSettings } from "@/lib/site-settings/general";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, branding } = await getGeneralSettings();

  return {
    title: {
      default: seo.title,
      template: `%s | ${branding.siteName}`,
    },
    description: seo.description,
    ...(branding.faviconUrl
      ? { icons: { icon: branding.faviconUrl } }
      : {}),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGeneralSettings();

  return (
    <>
      <SiteTheme settings={settings} />
      <Header branding={settings.branding} />
      <div className="mobile-header-spacer" aria-hidden="true" />
      <div className="site-content flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <Footer branding={settings.branding} footer={settings.footer} />
      </div>
    </>
  );
}
