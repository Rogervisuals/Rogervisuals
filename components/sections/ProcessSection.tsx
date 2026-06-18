import { Process } from "@/components/sections/Process";
import { getSiteSetting } from "@/lib/site-settings/queries";

export async function ProcessSection() {
  const content = await getSiteSetting("process");
  return <Process content={content} />;
}
