import { Hero } from "@/components/sections/Hero";
import { getSiteSetting } from "@/lib/site-settings/queries";

export async function HeroSection() {
  const content = await getSiteSetting("hero");
  return <Hero content={content} />;
}
