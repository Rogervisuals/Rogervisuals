alter table public.projects
  add column if not exists page_layout text not null default 'single'
  check (page_layout in ('single', 'long_term'));
