export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function hasContent(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/** Preserve explicitly saved empty strings; use fallback only when the value was never set. */
export function savedString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export function reorderArray<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
