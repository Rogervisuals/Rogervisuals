-- Fix site_settings RLS if policies were missing after initial migration
alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
drop policy if exists "Admins manage site settings" on public.site_settings;
drop policy if exists "Authenticated insert site settings" on public.site_settings;
drop policy if exists "Authenticated update site settings" on public.site_settings;
drop policy if exists "Authenticated delete site settings" on public.site_settings;

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
