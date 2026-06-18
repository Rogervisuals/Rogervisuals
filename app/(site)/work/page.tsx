import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { getPublishedProjects } from "@/lib/projects/queries";
import { getWorkPage } from "@/lib/site-settings/pages/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWorkPage();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function WorkPage() {
  const [projects, content] = await Promise.all([
    getPublishedProjects(),
    getWorkPage(),
  ]);

  return (
    <>
      <PageHeader
        label={content.header.label}
        title={content.header.title}
        description={content.header.description}
      />
      <WorkGrid projects={projects} />
    </>
  );
}
