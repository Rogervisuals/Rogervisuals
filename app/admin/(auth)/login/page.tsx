import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-shark">
          <p className="font-[family-name:var(--font-ui)] text-sm text-silver/50">
            Loading…
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
