-- Optional stats section per project case study
alter table public.projects
  add column if not exists stats_enabled boolean not null default false;

alter table public.projects
  add column if not exists stats_label text not null default 'Impact';

alter table public.projects
  add column if not exists stats_title text not null default 'By the Numbers';

alter table public.projects
  add column if not exists stat_views text not null default '';

alter table public.projects
  add column if not exists stat_videos_edited text not null default '';

alter table public.projects
  add column if not exists stat_years_collaboration text not null default '';
