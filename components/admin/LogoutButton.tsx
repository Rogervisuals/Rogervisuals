"use client";

import { signOut } from "@/lib/projects/actions";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="rounded-md border border-white/10 px-3 py-1.5 font-[family-name:var(--font-ui)] text-xs text-silver/70 transition-colors hover:border-white/20 hover:text-white"
    >
      Log out
    </button>
  );
}
