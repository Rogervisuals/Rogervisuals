import { ContactCTA } from "@/components/sections/ContactCTA";
import { getSiteSetting } from "@/lib/site-settings/queries";

export async function ContactCTASection() {
  const content = await getSiteSetting("contact");
  return <ContactCTA content={content} />;
}
