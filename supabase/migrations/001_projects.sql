-- Projects table for portfolio CMS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  client text not null,
  categories text[] not null default '{}' check (
    cardinality(categories) > 0
    and categories <@ array['3d', 'branding', 'montage', 'photography', 'vfx', 'videography']::text[]
  ),
  slug text not null unique,
  thumbnail_url text,
  video_url text,
  video_mode text not null default 'auto' check (
    video_mode in ('auto', 'embed', 'external')
  ),
  short_description text not null default '',
  challenge text not null default '',
  approach text not null default '',
  result text not null default '',
  featured boolean not null default false,
  views_text text not null default '',
  project_date date,
  display_order integer not null default 0,
  published boolean not null default false,
  gallery_enabled boolean not null default false,
  gallery_label text not null default 'Gallery',
  gallery_title text not null default 'Behind the Scenes',
  gallery_images text[] not null default '{}',
  photos text[] not null default '{}',
  vfx_comparisons jsonb not null default '[]',
  project_type text not null default '',
  branding_sections jsonb not null default '[]'
);

create index if not exists projects_published_order_idx
  on public.projects (published, display_order asc, created_at desc);

create index if not exists projects_slug_idx on public.projects (slug);

alter table public.projects enable row level security;

-- Public can read published projects only
create policy "Public read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

-- Authenticated admins can manage all projects
create policy "Admins manage projects"
  on public.projects
  for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for project thumbnails
insert into storage.buckets (id, name, public)
values ('project-thumbnails', 'project-thumbnails', true)
on conflict (id) do nothing;

-- Public read for thumbnails
create policy "Public read project thumbnails"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-thumbnails');

-- Authenticated upload/update/delete thumbnails
create policy "Admins upload project thumbnails"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-thumbnails');

create policy "Admins update project thumbnails"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-thumbnails');

create policy "Admins delete project thumbnails"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-thumbnails');
