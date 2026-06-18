import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects/queries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const revalidate = 60;

export async function FeaturedWork() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            label="Selected Work"
            title="Featured Projects"
          />
          <Link
            href="/work"
            className="type-nav shrink-0 text-mariner transition-colors hover:text-white"
          >
            View all work →
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-16">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center font-[family-name:var(--font-body)] text-sm text-silver/50">
            Featured projects coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
