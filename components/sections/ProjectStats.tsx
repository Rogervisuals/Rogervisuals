import { StatCard } from "@/components/ui/StatCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { sectionTitle } from "@/lib/typography";
import { cn, hasContent } from "@/lib/utils";

export interface ProjectStatItem {
  value: string;
  label: string;
}

interface ProjectStatsProps {
  label: string;
  title: string;
  stats: ProjectStatItem[];
  centered?: boolean;
  compact?: boolean;
  embedded?: boolean;
  className?: string;
}

export function ProjectStats({
  label,
  title,
  stats,
  centered = false,
  compact = false,
  embedded = false,
  className,
}: ProjectStatsProps) {
  const visibleStats = stats.filter((stat) => hasContent(stat.value));

  if (visibleStats.length === 0) return null;

  const content = (
    <>
      {hasContent(label) && (
        <SectionLabel className={cn(centered && "text-center")}>{label}</SectionLabel>
      )}
      {hasContent(title) && (
        <h2 className={cn(sectionTitle, hasContent(label) && "mt-3 md:mt-4")}>
          {title}
        </h2>
      )}

      <div
        className={cn(
          "grid gap-4 md:gap-6",
          hasContent(label) || hasContent(title) ? "mt-10" : "",
          visibleStats.length === 1 && "md:grid-cols-1",
          visibleStats.length === 2 && "md:grid-cols-2",
          visibleStats.length >= 3 && "md:grid-cols-3"
        )}
      >
        {visibleStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            index={index}
          />
        ))}
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className={cn(centered && "text-center", className)}>
        {content}
      </div>
    );
  }

  return (
    <section
      className={cn(
        !compact && "border-t border-white/5 bg-mine-shaft/30 py-16 md:py-20",
        compact && "py-10 md:py-12",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 md:px-8",
          centered && "text-center"
        )}
      >
        {content}
      </div>
    </section>
  );
}
