# Supabase Setup

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

## 2. Run the migration

In the Supabase SQL Editor, run the contents of:

- `supabase/migrations/001_projects.sql`
- If you already ran an older version of 001 with a single `category` column, also run:
  - `supabase/migrations/002_project_categories.sql`
- For video display mode (auto / embed / link out), run:
  - `supabase/migrations/003_video_mode.sql`
- For Behind the Scenes gallery per project, run:
  - `supabase/migrations/004_project_gallery.sql`
- For photography photos and VFX before/after, run:
  - `supabase/migrations/005_category_media.sql`
- For multiple VFX comparisons, run:
  - `supabase/migrations/006_vfx_comparisons.sql`
- For a custom Type label on case studies, run:
  - `supabase/migrations/007_project_type.sql`
- For branding photo sections with titles, run:
  - `supabase/migrations/008_branding_sections.sql`
- For editable homepage content, run:
  - `supabase/migrations/009_site_settings.sql`
- If homepage saves fail with an RLS error, also run:
  - `supabase/migrations/010_site_settings_policies_fix.sql`

General site settings (logo, colors, footer) use the same `site_settings` table — no extra migration needed.

Optionally seed starter projects:

- `supabase/seed.sql`

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and add your project URL and anon key from **Project Settings → API**.

## 4. Create admin user

In Supabase Dashboard → **Authentication → Users → Add user**:

- Email: your admin email
- Password: a strong password
- Check **Auto confirm user**

Only create one admin account for now. All authenticated users can manage projects (single-admin setup).

## 5. Storage bucket

The migration creates the `project-thumbnails` bucket automatically. If you set it up manually instead:

- Bucket name: `project-thumbnails`
- Public bucket: **enabled**
