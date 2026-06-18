import { HeroSection } from "@/components/sections/HeroSection";
import { HomepageMiddleSections } from "@/components/sections/HomepageMiddleSections";
import { ContactCTASection } from "@/components/sections/ContactCTASection";
import { getSiteSetting } from "@/lib/site-settings/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [sectionOrder, sectionVisibility] = await Promise.all([
    getSiteSetting("sectionOrder"),
    getSiteSetting("sectionVisibility"),
  ]);

  return (
    <>
      <HeroSection />
      <HomepageMiddleSections
        order={sectionOrder}
        visibility={sectionVisibility}
      />
      <ContactCTASection />
    </>
  );
}
