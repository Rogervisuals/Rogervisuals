import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { getAllProjectsAdmin } from "@/lib/projects/queries";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <>
      <AdminHeader
        title="Projects"
        description="Manage portfolio projects"
        actions={
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-mariner px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-white transition-colors hover:bg-mariner/90"
          >
            New Project
          </Link>
        }
      />
      <ProjectsTable projects={projects} />
    </>
  );
}
