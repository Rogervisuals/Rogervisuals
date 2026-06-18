import { AdminHeader } from "@/components/admin/AdminHeader";
import { AboutPageEditor } from "@/components/admin/pages/AboutPageEditor";
import { getAboutPageAdmin } from "@/lib/site-settings/pages/queries";

export default async function AdminAboutPage() {
  const content = await getAboutPageAdmin();

  return (
    <>
      <AdminHeader
        title="About"
        description="Edit content shown on the About page"
      />
      <AboutPageEditor initial={content} />
    </>
  );
}
