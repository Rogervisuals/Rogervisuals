import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  getAllProjectsAdmin,
  getProjectStats,
} from "@/lib/projects/queries";
import { getCategoriesLabel } from "@/lib/projects/types";

export default async function AdminDashboardPage() {
  const [stats, projects] = await Promise.all([
    getProjectStats(),
    getAllProjectsAdmin(),
  ]);

  const recent = projects.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your portfolio projects"
        actions={
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-mariner px-4 py-2 font-[family-name:var(--font-ui)] text-sm text-white transition-colors hover:bg-mariner/90"
          >
            New Project
          </Link>
        }
      />

      <div className="px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard label="Total Projects" value={stats.total} />
          <AdminStatCard label="Featured Projects" value={stats.featured} />
          <Link
            href="/admin/general"
            className="flex flex-col justify-center rounded-lg border border-white/5 bg-mine-shaft/30 px-6 py-5 transition-colors hover:border-mariner/30 hover:bg-mine-shaft/50"
          >
            <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.12em] text-silver/40">
              General
            </p>
            <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-white">
              Logo, colors &amp; footer →
            </p>
          </Link>
          <Link
            href="/admin/pages/home"
            className="flex flex-col justify-center rounded-lg border border-white/5 bg-mine-shaft/30 px-6 py-5 transition-colors hover:border-mariner/30 hover:bg-mine-shaft/50"
          >
            <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.12em] text-silver/40">
              Home
            </p>
            <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-white">
              Edit client logos &amp; content →
            </p>
          </Link>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="font-[family-name:var(--font-ui)] text-xs text-mariner transition-colors hover:text-white"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/5">
            {recent.length === 0 ? (
              <p className="px-6 py-12 text-center font-[family-name:var(--font-body)] text-sm text-silver/40">
                No projects yet.{" "}
                <Link href="/admin/projects/new" className="text-mariner hover:text-white">
                  Create your first project
                </Link>
              </p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-mine-shaft/30">
                    {["Title", "Client", "Category", "Status"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 font-[family-name:var(--font-ui)] text-[0.6875rem] font-normal uppercase tracking-[0.12em] text-silver/40"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-[family-name:var(--font-body)] text-sm text-white transition-colors hover:text-mariner"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-[family-name:var(--font-body)] text-sm text-silver/70">
                        {project.client}
                      </td>
                      <td className="px-4 py-3 font-[family-name:var(--font-ui)] text-xs text-silver/60">
                        {getCategoriesLabel(project.categories)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            project.published
                              ? "font-[family-name:var(--font-ui)] text-xs text-green-400"
                              : "font-[family-name:var(--font-ui)] text-xs text-silver/40"
                          }
                        >
                          {project.published ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
