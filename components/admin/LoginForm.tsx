"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-shark px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.2em] text-mariner">
            Roger Visuals
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            Admin Login
          </h1>
          <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-silver/60">
            Sign in to manage your portfolio
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/5 bg-mine-shaft/30 p-8"
        >
          {error && (
            <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white outline-none transition-colors focus:border-mariner/50"
              />
            </div>
            <div>
              <label className="mb-2 block font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.12em] text-silver/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white outline-none transition-colors focus:border-mariner/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-md bg-mariner py-3 font-[family-name:var(--font-ui)] text-sm text-white transition-colors hover:bg-mariner/90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
