-- Optional seed data — run after migration if you want starter projects
insert into public.projects (
  title, client, categories, slug, short_description, challenge, approach, result,
  featured, views_text, display_order, published
) values
  (
    'Red Bull Event Recap', 'Red Bull', array['montage']::text[], 'red-bull-event-recap',
    'High-energy event recap capturing the atmosphere, crowd energy, and brand moments across a multi-day activation.',
    'Deliver a fast-turnaround recap that felt cinematic while working with fragmented footage from multiple camera operators.',
    'Built a rhythm-first edit structure, layered sound design for impact, and used color grading to unify disparate camera looks.',
    'The final film drove 2.4M organic views within 48 hours and became the hero asset for Red Bull''s social channels.',
    true, '2.4M views in 48 hours', 1, true
  ),
  (
    'Van Mossel Peugeot 408', 'Van Mossel', array['videography', 'vfx']::text[], 'van-mossel-peugeot-408',
    'Premium automotive commercial showcasing the Peugeot 408 with cinematic driving sequences and detail-focused product shots.',
    'Create a luxury feel on a tight production schedule while highlighting both design details and driving performance.',
    'Shot with deliberate camera movement, used motion graphics for spec callouts, and graded for a refined European aesthetic.',
    'The campaign contributed to a 40% lift in showroom inquiries during the launch month.',
    true, '40% increase in showroom inquiries', 2, true
  ),
  (
    'DJI Factory One-Take', 'DJI', array['branding', 'videography']::text[], 'dji-factory-one-take',
    'A seamless one-take factory tour revealing the precision and scale of DJI''s manufacturing process.',
    'Plan and execute a complex one-take sequence through an active factory floor without disrupting operations.',
    'Storyboarded every beat, coordinated with floor managers, and refined pacing in post for maximum clarity and flow.',
    'The film reached 8.1M views on YouTube and was featured in industry press as a benchmark for factory storytelling.',
    true, '8.1M YouTube views', 3, true
  ),
  (
    'Sandro Silva Social Reels', 'Sandro Silva', array['montage']::text[], 'sandro-silva-social-reels',
    'Scroll-stopping social reels engineered for retention, built around Sandro Silva''s personal brand and training content.',
    'Maintain a consistent visual identity across high-volume output while optimizing every reel for platform algorithms.',
    'Developed a modular editing system with branded intros, kinetic typography, and hook-first pacing for the first 3 seconds.',
    'Contributed to 12M+ monthly reach across platforms with consistently high retention rates.',
    true, '12M+ monthly reach', 4, true
  ),
  (
    'Kai Vertigoh YouTube Series', 'Kai Vertigoh', array['montage', 'vfx']::text[], 'kai-vertigoh-youtube-series',
    'Long-form YouTube content edited for storytelling, pacing, and audience retention across a multi-year creator partnership.',
    'Balance entertainment value with narrative depth across episodes ranging from 10 to 25 minutes.',
    'Structured each episode with clear act breaks, dynamic B-roll layering, and VFX accents for key story moments.',
    'Helped grow the channel to 50M+ total views with above-average audience retention.',
    false, '50M+ total views', 5, true
  ),
  (
    'Product Launch VFX', 'Tech Brand', array['3d', 'vfx']::text[], 'product-launch-vfx',
    'VFX-heavy product launch film combining live action with CGI elements and motion-tracked compositing.',
    'Integrate photorealistic VFX into handheld footage without breaking the organic, documentary feel.',
    'Tracked and composited 3D elements in After Effects, matched lighting and grain, and refined in a dedicated VFX pass.',
    'The spot was nominated for a regional advertising award and praised for seamless VFX integration.',
    false, 'Award-nominated spot', 6, true
  )
on conflict (slug) do nothing;
