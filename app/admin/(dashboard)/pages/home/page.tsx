import { AdminHeader } from "@/components/admin/AdminHeader";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { getHomepageContentAdmin } from "@/lib/site-settings/queries";

export default async function AdminHomePage() {
  const content = await getHomepageContentAdmin();

  return (
    <>
      <AdminHeader
        title="Home"
        description="Edit content shown on the home page"
      />
      <HomepageEditor content={content} />
    </>
  );
}
