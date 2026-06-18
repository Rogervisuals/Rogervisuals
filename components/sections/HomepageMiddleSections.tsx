import { Clients } from "@/components/sections/Clients";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import type {
  HomepageSectionVisibility,
  ReorderableHomepageSectionId,
} from "@/lib/site-settings/homepage-sections";

interface HomepageMiddleSectionsProps {
  order: ReorderableHomepageSectionId[];
  visibility: HomepageSectionVisibility;
}

export function HomepageMiddleSections({
  order,
  visibility,
}: HomepageMiddleSectionsProps) {
  const visibleOrder = order.filter((id) => visibility[id]);

  return (
    <>
      {visibleOrder.map((id) => {
        switch (id) {
          case "stats":
            return <Stats key={id} />;
          case "clients":
            return <Clients key={id} />;
          case "featured":
            return <FeaturedWork key={id} />;
          case "services":
            return <Services key={id} />;
          case "process":
            return <ProcessSection key={id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
