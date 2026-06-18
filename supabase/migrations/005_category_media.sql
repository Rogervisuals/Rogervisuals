-- Photography photos + VFX before/after per project
alter table public.projects
  add column if not exists photos text[] not null default '{}';

alter table public.projects
  add column if not exists vfx_before_url text;

alter table public.projects
  add column if not exists vfx_after_url text;
