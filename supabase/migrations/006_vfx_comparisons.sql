-- Multiple VFX before/after comparisons per project
alter table public.projects
  add column if not exists vfx_comparisons jsonb not null default '[]';

-- Migrate single before/after pairs into the new array format
update public.projects
set vfx_comparisons = jsonb_build_array(
  jsonb_build_object(
    'before_url', vfx_before_url,
    'after_url', vfx_after_url
  )
)
where vfx_before_url is not null
  and vfx_after_url is not null
  and (vfx_comparisons is null or vfx_comparisons = '[]'::jsonb);

alter table public.projects drop column if exists vfx_before_url;
alter table public.projects drop column if exists vfx_after_url;
