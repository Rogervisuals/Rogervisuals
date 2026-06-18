-- Multi-category support + split VFX and Videography
-- Run this if you already applied 001_projects.sql

alter table public.projects add column if not exists categories text[];

update public.projects
set categories = case
  when category = 'vfx-videography' then array['vfx', 'videography']::text[]
  when category is not null then array[category]::text[]
  else array['montage']::text[]
end
where categories is null;

alter table public.projects alter column categories set default '{}';
alter table public.projects alter column categories set not null;

alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects drop column if exists category;

alter table public.projects drop constraint if exists projects_categories_check;
alter table public.projects add constraint projects_categories_check
  check (
    cardinality(categories) > 0
    and categories <@ array['3d', 'branding', 'montage', 'photography', 'vfx', 'videography']::text[]
  );
