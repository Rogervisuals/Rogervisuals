"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/general", label: "General", exact: false },
  { href: "/admin/projects", label: "Projects", exact: false },
];

const pageNavItems = [
  { href: "/admin/pages/home", label: "Home" },
  { href: "/admin/pages/about", label: "About" },
  { href: "/admin/pages/contact", label: "Contact" },
  { href: "/admin/pages/work", label: "Work" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const pagesActive = pathname.startsWith("/admin/pages");
  const [pagesOpen, setPagesOpen] = useState(pagesActive);

  useEffect(() => {
    if (pagesActive) setPagesOpen(true);
  }, [pagesActive]);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/5 bg-shark">
      <div className="border-b border-white/5 px-5 py-6">
        <Link href="/admin" className="block">
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
            Roger Visuals
          </span>
          <span className="mt-1 block font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.2em] text-mariner">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2.5 font-[family-name:var(--font-ui)] text-sm transition-colors",
                active
                  ? "bg-mariner/15 text-white"
                  : "text-silver/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          );
        })}

        <div>
          <button
            type="button"
            onClick={() => setPagesOpen((open) => !open)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2.5 font-[family-name:var(--font-ui)] text-sm transition-colors",
              pagesActive
                ? "bg-mariner/15 text-white"
                : "text-silver/70 hover:bg-white/5 hover:text-white"
            )}
            aria-expanded={pagesOpen}
          >
            <span>Pages</span>
            <span
              className={cn(
                "text-xs transition-transform duration-200",
                pagesOpen && "rotate-180"
              )}
            >
              ▾
            </span>
          </button>

          {pagesOpen && (
            <div className="mt-1 space-y-1 pl-3">
              {pageNavItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 font-[family-name:var(--font-ui)] text-sm transition-colors",
                      active
                        ? "bg-mariner/10 text-white"
                        : "text-silver/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-white/5 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="block rounded-md px-3 py-2.5 font-[family-name:var(--font-ui)] text-sm text-silver/50 transition-colors hover:bg-white/5 hover:text-silver"
        >
          View site →
        </Link>
      </div>
    </aside>
  );
}
