import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSiteSetting } from "@/lib/site-settings/queries";

export async function Services() {
  const section = await getSiteSetting("services");

  return (
    <section className="border-y border-white/5 bg-mine-shaft/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader
          label={section.label}
          title={section.title}
          description={section.description}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {section.services.map((service, i) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
