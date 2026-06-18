-- Custom project type label (e.g. Event Film, Commercial)
alter table public.projects
  add column if not exists project_type text not null default '';
