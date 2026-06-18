"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProjectFeatured } from "@/lib/projects/actions";
import { cn } from "@/lib/utils";

interface FeaturedToggleButtonProps {
  id: string;
  featured: boolean;
}

export function FeaturedToggleButton({
  id,
  featured: initialFeatured,
}: FeaturedToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [featured, setFeatured] = useState(initialFeatured);

  useEffect(() => {
    setFeatured(initialFeatured);
  }, [initialFeatured]);

  function handleToggle() {
    const next = !featured;
    setFeatured(next);

    startTransition(async () => {
      const result = await toggleProjectFeatured(id, next);
      if (result?.error) {
        setFeatured(!next);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      title={featured ? "Remove from featured" : "Mark as featured"}
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-wider transition-colors disabled:opacity-50",
        featured
          ? "bg-mariner/15 text-mariner hover:bg-mariner/25"
          : "border border-white/10 text-silver/30 hover:border-white/20 hover:text-silver/50"
      )}
    >
      {isPending ? "…" : featured ? "Featured" : "—"}
    </button>
  );
}
