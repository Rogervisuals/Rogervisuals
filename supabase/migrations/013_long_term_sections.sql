alter table public.projects
  add column if not exists long_term_case_study jsonb not null default '{}'::jsonb;

alter table public.projects
  add column if not exists long_term_featured_content jsonb not null default '{}'::jsonb;

alter table public.projects
  add column if not exists long_term_vfx_section jsonb not null default '{}'::jsonb;
