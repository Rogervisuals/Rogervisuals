import { AdminHeader } from "@/components/admin/AdminHeader";
import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";
import { getGeneralSettingsAdmin } from "@/lib/site-settings/general";

export default async function AdminGeneralPage() {
  const settings = await getGeneralSettingsAdmin();

  return (
    <>
      <AdminHeader
        title="General"
        description="Branding, colors, typography, footer, and SEO"
      />
      <GeneralSettingsForm initial={settings} />
    </>
  );
}
