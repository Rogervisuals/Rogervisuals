-- Video display mode: auto | embed | external
alter table public.projects
  add column if not exists video_mode text not null default 'auto'
  check (video_mode in ('auto', 'embed', 'external'));
