"use client";

import { useTransition } from "react";
import { deleteProject } from "@/lib/projects/actions";

interface DeleteProjectButtonProps {
  id: string;
  title: string;
}

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    startTransition(async () => {
      await deleteProject(id);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="rounded px-2.5 py-1 font-[family-name:var(--font-ui)] text-xs text-red-400/80 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
