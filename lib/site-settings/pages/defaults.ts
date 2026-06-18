import { services } from "@/data/services";
import type {
  AboutPageContent,
  ContactPageContent,
  WorkPageContent,
} from "@/lib/site-settings/pages/types";

export const defaultContactProjectTypes = [
  "Video Editing",
  "Videography",
  "Motion Graphics",
  "VFX",
  "Social Media Content",
  "Full Production",
  "Other",
];

export const defaultContactBudgetRanges = [
  "Under €1,000",
  "€1,000 – €5,000",
  "€5,000 – €15,000",
  "€15,000+",
  "Not sure yet",
];

export const aboutPageDefaults: AboutPageContent = {
  header: {
    label: "About",
    title: "Roger Noordover",
    description:
      "Freelance videographer and video editor creating content that gets watched.",
  },
  portraitUrl: null,
  bio: {
    heading: "Hi, I'm Roger.",
    paragraphs: [
      "I'm a freelance videographer and video editor based in the Netherlands, working with creators, brands, and agencies to produce content built for attention, storytelling, and platform performance.",
      "My work spans video editing, videography, motion graphics, and VFX — from high-energy social reels and long-form YouTube series to cinematic commercials and event films. I've edited for creators like Kai Vertigoh, produced content for brands like Red Bull and Van Mossel, and filmed across 10+ countries.",
      "Every project starts with understanding the goal: what should the viewer feel, and what action should they take? From there, I craft edits and visuals that serve the story — not the other way around.",
    ],
  },
  cta: {
    label: "Get in Touch",
    href: "/contact",
  },
  expertise: {
    label: "Expertise",
    title: "What I Bring",
    services: services.map(({ title, description }) => ({ title, description })),
  },
  stats: [
    { value: "3+", label: "Years with Kai Vertigoh" },
    { value: "100M+", label: "Views generated" },
    { value: "10+", label: "Countries filmed in" },
  ],
  seo: {
    title: "About",
    description:
      "Roger Noordover is a freelance videographer and video editor from the Netherlands, specializing in content for creators, brands, and social platforms.",
  },
};

export const contactPageDefaults: ContactPageContent = {
  header: {
    label: "Contact",
    title: "Let's Talk",
    description:
      "Have a project in mind? Fill out the form below and I'll get back to you within 24–48 hours.",
  },
  sidebar: {
    title: "Start a conversation",
    description:
      "Whether you need a single edit, an ongoing content partnership, or a full production — I'd love to hear about your project.",
    email: "hello@rogervisuals.com",
    location: "Netherlands · Available worldwide",
    responseTime: "Within 24–48 hours",
  },
  form: {
    projectTypes: defaultContactProjectTypes,
    budgetRanges: defaultContactBudgetRanges,
  },
  formSuccess: {
    title: "Message sent!",
    message:
      "Thanks for reaching out. Roger will get back to you within 24–48 hours.",
    resetLabel: "Send another message",
  },
  seo: {
    title: "Contact",
    description:
      "Get in touch with Roger Noordover for video editing, videography, VFX, and motion graphics projects.",
  },
};

export const workPageDefaults: WorkPageContent = {
  header: {
    label: "Portfolio",
    title: "Work",
    description:
      "A selection of 3D, branding, montage, photography, VFX, and videography projects for brands and creators.",
  },
  seo: {
    title: "Work",
    description:
      "Portfolio of video editing, videography, VFX, and motion graphics projects for brands and creators.",
  },
};
