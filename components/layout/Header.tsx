"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/ui/SiteLogo";
import type { GeneralSettings } from "@/lib/site-settings/general";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

interface HeaderProps {
  branding: GeneralSettings["branding"];
}

type Branding = GeneralSettings["branding"];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("mobile-menu-toggle", open && "mobile-menu-toggle--open")}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="mobile-menu-toggle__line mobile-menu-toggle__line--top"
        d="M4 7h16"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="mobile-menu-toggle__line mobile-menu-toggle__line--mid"
        d="M4 12h16"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="mobile-menu-toggle__line mobile-menu-toggle__line--bot"
        d="M4 17h16"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MobileHeader({
  branding,
  isMenuOpen,
  pathname,
  onOpen,
  onClose,
}: {
  branding: Branding;
  isMenuOpen: boolean;
  pathname: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <header className="mobile-site-header">
        <div className="mobile-site-header__row">
          <Link
            href="/"
            className="mobile-site-header__logo"
            onClick={onClose}
          >
            {branding.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.siteName}
                width={140}
                height={36}
                className="h-8 w-auto max-w-[8rem] object-contain object-left"
                unoptimized
                priority
              />
            ) : (
              <SiteLogo
                siteName={branding.siteName}
                logoUrl={null}
                logoInitial={branding.logoInitial}
                className="h-8 w-8 shrink-0"
              />
            )}
          </Link>

          <button
            type="button"
            className="mobile-site-header__toggle"
            onClick={isMenuOpen ? onClose : onOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="mobile-menu-overlay__nav">
            {navLinks.map((link, index) => (
              <div
                key={link.href}
                className="mobile-menu-overlay__item"
                style={{ animationDelay: `${80 + index * 60}ms` }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "mobile-menu-overlay__link",
                    pathname === link.href && "mobile-menu-overlay__link--active"
                  )}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function DesktopHeader({
  branding,
  scrolled,
  pathname,
  onCloseMenu,
}: {
  branding: Branding;
  scrolled: boolean;
  pathname: string;
  onCloseMenu: () => void;
}) {
  return (
    <header
      className={cn(
        "site-header hidden lg:block",
        "lg:border-b lg:border-white/[0.08] lg:bg-shark lg:pt-[env(safe-area-inset-top,0px)]",
        "lg:transition-[background-color,border-color,backdrop-filter] lg:duration-300",
        scrolled &&
          "lg:border-white/5 lg:bg-shark/90 lg:backdrop-blur-md",
        !scrolled &&
          "lg:border-transparent lg:bg-transparent lg:backdrop-blur-none"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-3"
          onClick={onCloseMenu}
        >
          {branding.logoUrl ? (
            <Image
              src={branding.logoUrl}
              alt={branding.siteName}
              width={160}
              height={40}
              className="h-9 w-auto max-w-[10rem] object-contain object-left"
              unoptimized
              priority
            />
          ) : (
            <>
              <SiteLogo
                siteName={branding.siteName}
                logoUrl={null}
                logoInitial={branding.logoInitial}
                className="transition-colors duration-300 group-hover:border-mariner"
              />
              <span className="type-nav text-white">{branding.siteName}</span>
            </>
          )}
        </Link>

        <nav className="flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "type-nav relative transition-colors duration-300",
                pathname === link.href
                  ? "text-white"
                  : "text-silver/80 hover:text-mariner"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-mariner" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Header({ branding }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const scrollLockY = useRef(0);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function onScroll() {
      if (!desktopQuery.matches) return;
      setScrolled(window.scrollY > 8);
    }

    function onViewportChange() {
      if (!desktopQuery.matches) {
        setScrolled(false);
      } else {
        onScroll();
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktopQuery.addEventListener("change", onViewportChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      desktopQuery.removeEventListener("change", onViewportChange);
    };
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsMenuOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      if (scrollLockY.current) {
        window.scrollTo(0, scrollLockY.current);
        scrollLockY.current = 0;
      }
      return;
    }

    scrollLockY.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <MobileHeader
        branding={branding}
        isMenuOpen={isMenuOpen}
        pathname={pathname}
        onOpen={() => setIsMenuOpen(true)}
        onClose={() => setIsMenuOpen(false)}
      />

      <DesktopHeader
        branding={branding}
        scrolled={scrolled}
        pathname={pathname}
        onCloseMenu={() => setIsMenuOpen(false)}
      />
    </>
  );
}
