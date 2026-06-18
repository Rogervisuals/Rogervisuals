import { CasePreview } from "@/components/ui/CasePreview";

export function CaseStudyPreview() {
  return (
    <section className="border-y border-white/5 bg-mine-shaft/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <CasePreview
          title="Red Bull Event Recap"
          client="Red Bull"
          challenge="Deliver a fast-turnaround recap that felt cinematic while working with fragmented footage from multiple camera operators."
          solution="Built a rhythm-first edit structure, layered sound design for impact, and used color grading to unify disparate camera looks."
          result="2.4M organic views within 48 hours — the hero asset for Red Bull's social channels."
          slug="red-bull-event-recap"
        />
      </div>
    </section>
  );
}
