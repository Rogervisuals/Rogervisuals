-- Behind the Scenes gallery per project
alter table public.projects
  add column if not exists gallery_enabled boolean not null default false;

alter table public.projects
  add column if not exists gallery_label text not null default 'Gallery';

alter table public.projects
  add column if not exists gallery_title text not null default 'Behind the Scenes';

alter table public.projects
  add column if not exists gallery_images text[] not null default '{}';
