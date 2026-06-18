-- Branding projects: titled photo sections (e.g. Logos, Business Cards, Mockups)
alter table public.projects
  add column if not exists branding_sections jsonb not null default '[]';
