-- Editable homepage and site content (keyed JSON documents)
create table if not exists public.site_settings (
  key text primary key,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Public read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated insert site settings"
  on public.site_settings
  for insert
  to authenticated
  with check (true);

create policy "Authenticated update site settings"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated delete site settings"
  on public.site_settings
  for delete
  to authenticated
  using (true);
