import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContactPageEditor } from "@/components/admin/pages/ContactPageEditor";
import { getContactPageAdmin } from "@/lib/site-settings/pages/queries";

export default async function AdminContactPage() {
  const content = await getContactPageAdmin();

  return (
    <>
      <AdminHeader
        title="Contact"
        description="Edit content shown on the Contact page"
      />
      <ContactPageEditor initial={content} />
    </>
  );
}
