-- Full-width images, GIFs, and MP4s above the Behind the Scenes gallery
alter table public.projects
  add column if not exists featured_media text[] not null default '{}';
