import { LogoutButton } from "@/components/admin/LogoutButton";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/5 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 font-[family-name:var(--font-body)] text-sm text-silver/60">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <LogoutButton />
      </div>
    </header>
  );
}
