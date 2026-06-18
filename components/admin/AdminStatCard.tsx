interface AdminStatCardProps {
  label: string;
  value: number | string;
}

export function AdminStatCard({ label, value }: AdminStatCardProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-mine-shaft/40 p-6">
      <p className="font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.15em] text-silver/50">
        {label}
      </p>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
