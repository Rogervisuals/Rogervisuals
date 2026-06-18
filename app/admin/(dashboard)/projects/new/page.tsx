import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader
        title="New Project"
        description="Create a new portfolio project"
      />
      <ProjectForm mode="create" />
    </>
  );
}
