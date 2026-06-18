import { AdminHeader } from "@/components/admin/AdminHeader";
import { WorkPageEditor } from "@/components/admin/pages/WorkPageEditor";
import { getWorkPageAdmin } from "@/lib/site-settings/pages/queries";

export default async function AdminWorkPage() {
  const content = await getWorkPageAdmin();

  return (
    <>
      <AdminHeader
        title="Work"
        description="Edit the Work page header and SEO"
      />
      <WorkPageEditor initial={content} />
    </>
  );
}
