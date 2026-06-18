import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SiteLogo } from "@/components/ui/SiteLogo";
import type { GeneralSettings } from "@/lib/site-settings/general";
import { cn, hasContent } from "@/lib/utils";

const footerLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface FooterProps {
  branding: GeneralSettings["branding"];
  footer: GeneralSettings["footer"];
}

function FooterLogo({ branding }: { branding: GeneralSettings["branding"] }) {
  if (branding.logoUrl) {
    return (
      <Image
        src={branding.logoUrl}
        alt={branding.siteName}
        width={160}
        height={40}
        className="h-9 w-auto max-w-[10rem] object-contain object-center md:object-left"
        unoptimized
      />
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 md:justify-start">
      <SiteLogo
        siteName={branding.siteName}
        logoUrl={null}
        logoInitial={branding.logoInitial}
      />
      <span className="type-nav hidden text-white md:inline">
        {branding.siteName}
      </span>
    </div>
  );
}

function FooterTagline({
  tagline,
  className,
}: {
  tagline: string;
  className?: string;
}) {
  if (!hasContent(tagline)) return null;

  return (
    <p
      className={cn(
        "type-meta tracking-[0.18em] text-mariner uppercase",
        className
      )}
    >
      {tagline}
    </p>
  );
}

export function Footer({ branding, footer }: FooterProps) {
  const year = new Date().getFullYear();
  const copyrightName = hasContent(footer.copyrightName)
    ? footer.copyrightName
    : branding.siteName;

  return (
    <footer className="relative z-0 border-t border-white/5 bg-shark">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
        {/* Mobile — centered stack */}
        <div className="flex flex-col items-center text-center md:hidden">
          <FooterLogo branding={branding} />

          <FooterTagline tagline={footer.tagline} className="mt-8 mb-6" />

          {hasContent(footer.email) && (
            <a
              href={`mailto:${footer.email}`}
              className="type-nav text-lg text-white transition-colors hover:text-mariner"
            >
              {footer.email}
            </a>
          )}

          {hasContent(footer.location) && (
            <p className="type-body-sm mt-3 text-silver/55">{footer.location}</p>
          )}

          <div className="mt-8 h-px w-8 bg-mariner/70" aria-hidden="true" />

          <SocialLinks
            links={footer.socialLinks}
            className="mt-8 justify-center gap-4"
          />

          <div
            className="mt-14 w-full border-t border-white/10"
            aria-hidden="true"
          />

          <p className="type-body-sm mt-8 text-silver/45">
            © {year} {copyrightName}
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <FooterLogo branding={branding} />
              <FooterTagline tagline={footer.tagline} className="mt-4 mb-2" />
            </div>

            <div>
              <p className="type-meta">Navigation</p>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="type-nav text-silver/75 transition-colors hover:text-mariner"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="type-meta">Connect</p>
              <ul className="mt-4 space-y-2.5">
                {hasContent(footer.email) && (
                  <li>
                    <a
                      href={`mailto:${footer.email}`}
                      className="type-nav text-silver/75 transition-colors hover:text-mariner"
                    >
                      {footer.email}
                    </a>
                  </li>
                )}
                {hasContent(footer.location) && (
                  <li>
                    <span className="type-body-sm text-silver/55">
                      {footer.location}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
            <p className="type-body-sm text-silver/45">
              © {year} {copyrightName}. All rights reserved.
            </p>
            <SocialLinks links={footer.socialLinks} />
          </div>
        </div>
      </div>
    </footer>
  );
}
