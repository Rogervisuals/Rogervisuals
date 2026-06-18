import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectByIdAdmin } from "@/lib/projects/queries";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) notFound();

  return (
    <>
      <AdminHeader
        title="Edit Project"
        description={project.title}
      />
      <ProjectForm mode="edit" project={project} />
    </>
  );
}
