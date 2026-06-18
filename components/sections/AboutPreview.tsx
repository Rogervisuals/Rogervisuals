import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function AboutPreview() {
  return (
    <section className="border-y border-white/5 bg-mine-shaft/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] max-w-md overflow-hidden bg-mine-shaft">
            <div className="placeholder-shimmer absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="type-meta text-silver/35">
                Portrait Placeholder
              </span>
            </div>
          </div>

          <div>
            <SectionHeader
              label="About"
              title="Hi, I'm Roger."
            />
            <p className="type-section-desc mt-6">
              I help creators and brands turn ideas into content built for attention, storytelling,
              and platform performance. From high-energy event recaps to long-form YouTube series and
              VFX-heavy commercial spots — every project is crafted to get watched.
            </p>
            <p className="type-card-body mt-4 text-silver/70">
              Based in the Netherlands, available for projects worldwide.
            </p>
            <div className="mt-10">
              <Button href="/about" variant="secondary">
                More About Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
