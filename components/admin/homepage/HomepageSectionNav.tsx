"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateHomepageSectionOrder,
  updateHomepageSectionVisibility,
} from "@/lib/site-settings/actions";
import {
  HOMEPAGE_SECTION_LABELS,
  type HomepageEditorSectionId,
  type HomepageSectionVisibility,
  type ReorderableHomepageSectionId,
} from "@/lib/site-settings/homepage-sections";
import { cn, reorderArray } from "@/lib/utils";

interface HomepageSectionNavProps {
  sectionOrder: ReorderableHomepageSectionId[];
  sectionVisibility: HomepageSectionVisibility;
  active: HomepageEditorSectionId;
  onSelect: (id: HomepageEditorSectionId) => void;
}

function DragHandleIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-silver/40"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

function SectionToggle({
  enabled,
  label,
  onChange,
}: {
  enabled: boolean;
  label: string;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${enabled ? "Hide" : "Show"} ${label} on homepage`}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!enabled);
      }}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        enabled ? "bg-mariner" : "bg-white/15"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform",
          enabled && "translate-x-4"
        )}
      />
    </button>
  );
}

function NavButton({
  id,
  active,
  onSelect,
  pinned,
}: {
  id: HomepageEditorSectionId;
  active: HomepageEditorSectionId;
  onSelect: (id: HomepageEditorSectionId) => void;
  pinned?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "w-full rounded-md px-3 py-2.5 text-left font-[family-name:var(--font-ui)] text-sm transition-colors",
        active === id
          ? "bg-mariner/15 text-white"
          : "text-silver/70 hover:bg-white/5 hover:text-white",
        pinned && "cursor-default"
      )}
    >
      {HOMEPAGE_SECTION_LABELS[id]}
      {pinned && (
        <span className="mt-0.5 block text-[0.625rem] text-silver/35">
          Fixed position
        </span>
      )}
    </button>
  );
}

export function HomepageSectionNav({
  sectionOrder: initialOrder,
  sectionVisibility: initialVisibility,
  active,
  onSelect,
}: HomepageSectionNavProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sectionOrder, setSectionOrder] = useState(initialOrder);
  const [sectionVisibility, setSectionVisibility] = useState(initialVisibility);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);

  useEffect(() => {
    setSectionOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    setSectionVisibility(initialVisibility);
  }, [initialVisibility]);

  function persistOrder(next: ReorderableHomepageSectionId[]) {
    setSectionOrder(next);
    setOrderError(null);

    startTransition(async () => {
      const result = await updateHomepageSectionOrder(next);
      if (result?.error) {
        setOrderError(result.error);
        setSectionOrder(initialOrder);
        return;
      }
      router.refresh();
    });
  }

  function persistVisibility(next: HomepageSectionVisibility) {
    setSectionVisibility(next);
    setVisibilityError(null);

    startTransition(async () => {
      const result = await updateHomepageSectionVisibility(next);
      if (result?.error) {
        setVisibilityError(result.error);
        setSectionVisibility(initialVisibility);
        return;
      }
      router.refresh();
    });
  }

  function toggleVisibility(id: ReorderableHomepageSectionId) {
    persistVisibility({
      ...sectionVisibility,
      [id]: !sectionVisibility[id],
    });
  }

  function handleDrop(index: number) {
    if (dragIndex === null) return;
    persistOrder(reorderArray(sectionOrder, dragIndex, index));
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <nav className="flex shrink-0 flex-col gap-1 lg:w-60">
      <NavButton id="hero" active={active} onSelect={onSelect} pinned />

      <div className="my-2 border-t border-white/5" />

      {sectionOrder.length > 0 && (
        <p className="px-3 pb-1 font-[family-name:var(--font-body)] text-[0.625rem] text-silver/35">
          Drag to reorder · toggle visibility
        </p>
      )}

      {sectionOrder.map((id, index) => {
        const isDragging = dragIndex === index;
        const isDropTarget =
          dropIndex === index && dragIndex !== null && dragIndex !== index;
        const isVisible = sectionVisibility[id];

        return (
          <div
            key={id}
            onDragOver={(event) => {
              event.preventDefault();
              if (dragIndex === null || dragIndex === index) return;
              setDropIndex(index);
            }}
            onDrop={() => handleDrop(index)}
            className={cn(
              "flex items-center gap-1 rounded-md transition-[opacity,box-shadow,background-color]",
              isDragging && "opacity-50",
              isDropTarget && "bg-mariner/10 ring-1 ring-mariner/30",
              !isVisible && "opacity-60",
              isPending && "pointer-events-none opacity-70"
            )}
          >
            {sectionOrder.length > 1 && (
              <div
                draggable
                onDragStart={() => {
                  setDragIndex(index);
                  setDropIndex(index);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDropIndex(null);
                }}
                aria-label={`Drag ${HOMEPAGE_SECTION_LABELS[id]}`}
                className="flex shrink-0 cursor-grab items-center rounded p-2 active:cursor-grabbing"
              >
                <DragHandleIcon />
              </div>
            )}
            <button
              type="button"
              onClick={() => onSelect(id)}
              className={cn(
                "min-w-0 flex-1 rounded-md px-2 py-2.5 text-left font-[family-name:var(--font-ui)] text-sm transition-colors",
                active === id
                  ? "bg-mariner/15 text-white"
                  : "text-silver/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {HOMEPAGE_SECTION_LABELS[id]}
            </button>
            <SectionToggle
              enabled={isVisible}
              label={HOMEPAGE_SECTION_LABELS[id]}
              onChange={() => toggleVisibility(id)}
            />
            <span className="w-1 shrink-0" aria-hidden />
          </div>
        );
      })}

      {(orderError || visibilityError) && (
        <p className="px-3 font-[family-name:var(--font-ui)] text-xs text-red-400">
          {orderError ?? visibilityError}
        </p>
      )}

      <div className="my-2 border-t border-white/5" />

      <NavButton id="contact" active={active} onSelect={onSelect} pinned />
    </nav>
  );
}
