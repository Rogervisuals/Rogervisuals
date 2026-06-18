import { StatCard } from "@/components/ui/StatCard";
import { getSiteSetting } from "@/lib/site-settings/queries";

export async function Stats() {
  const section = await getSiteSetting("stats");

  return (
    <section className="border-y border-white/5 bg-mine-shaft/30 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {section.stats.map((stat, i) => (
            <StatCard
              key={`${stat.label}-${i}`}
              value={stat.value}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
