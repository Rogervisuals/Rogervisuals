export interface VfxBreakdown {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const vfxBreakdowns: VfxBreakdown[] = [
  {
    id: "shadow-snap",
    title: "Shadow Snap Effect",
    description:
      "Dynamic shadow tracking composited onto moving subjects for a surreal, attention-grabbing visual hook.",
    category: "Compositing",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics Breakdown",
    description:
      "Layered kinetic typography and branded motion elements synced to beat and narrative pacing.",
    category: "Motion Graphics",
  },
  {
    id: "color-grade",
    title: "Color Grade Comparison",
    description:
      "Before and after color grading showing the transformation from flat LOG to cinematic final look.",
    category: "Color Grade",
  },
  {
    id: "object-removal",
    title: "Object Removal",
    description:
      "Clean plate reconstruction and roto work to remove unwanted elements from complex scenes.",
    category: "VFX Cleanup",
  },
];

export const processSteps = [
  { step: "01", title: "Discovery", description: "Understanding your goals, audience, and platform." },
  { step: "02", title: "Concept", description: "Shaping the creative direction and visual approach." },
  { step: "03", title: "Production", description: "Shooting, gathering assets, and building the foundation." },
  { step: "04", title: "Editing", description: "Crafting the story, pacing, VFX, and polish." },
  { step: "05", title: "Delivery", description: "Final exports optimized for every platform and format." },
];
