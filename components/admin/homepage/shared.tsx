"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
      {children}
    </label>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-mine-shaft/20 p-6">
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-silver/50">
          {description}
        </p>
      )}
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

export function SaveSectionButton({
  onSave,
  label = "Save section",
}: {
  onSave: () => Promise<{ error?: string } | { success: true } | void>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await onSave();
      if (result && "error" in result && result.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({ type: "success", text: "Saved" });
    });
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        disabled={isPending}
        onClick={handleSave}
        className="rounded-md bg-mariner px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm text-white transition-colors hover:bg-mariner/90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : label}
      </button>
      {message && (
        <p
          className={cn(
            "font-[family-name:var(--font-ui)] text-sm",
            message.type === "error" ? "text-red-400" : "text-green-400"
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
