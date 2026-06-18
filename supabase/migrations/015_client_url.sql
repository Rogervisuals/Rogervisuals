alter table public.projects
  add column if not exists client_url text;
