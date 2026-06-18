import { clients as defaultClients } from "@/data/clients";
import { services as defaultServices } from "@/data/services";
import { stats as defaultStats } from "@/data/stats";
import { processSteps } from "@/data/vfx";
import {
  DEFAULT_HOMEPAGE_SECTION_ORDER,
  DEFAULT_HOMEPAGE_SECTION_VISIBILITY,
} from "@/lib/site-settings/homepage-sections";
import {
  createHeroCollagePanel,
  type HomepageContent,
} from "@/lib/site-settings/types";

const defaultCollageLabels = [
  "FPV Drone",
  "Automotive",
  "China / Travel",
  "Event",
  "Roger Filming",
];

export const homepageDefaults: HomepageContent = {
  clients: {
    title: "Clients",
    description: "Brands and creators I've had the pleasure to work with",
    clients: defaultClients.map((client) => ({
      id: client.id,
      name: client.name,
      logo: client.logo ?? null,
    })),
  },
  hero: {
    eyebrow: "Roger Noordover / Video Editor & Videographer",
    headlineLine1: "CONTENT THAT",
    headlineLine2: "GETS WATCHED.",
    description: "Video editing, VFX and production for brands and creators.",
    primaryCtaLabel: "View Work",
    primaryCtaHref: "/work",
    secondaryCtaLabel: "Contact",
    secondaryCtaHref: "/contact",
    collagePanels: defaultCollageLabels.map((label) =>
      createHeroCollagePanel(label)
    ),
  },
  stats: {
    stats: defaultStats.map((stat) => ({ ...stat })),
  },
  services: {
    label: "Services",
    title: "What I Do",
    description:
      "End-to-end video production services for brands, agencies, and creators who need content that performs.",
    services: defaultServices.map((service) => ({ ...service })),
  },
  process: {
    label: "Process",
    title: "How We Work",
    steps: processSteps.map((step) => ({ ...step })),
  },
  contact: {
    title: "Have a project in mind?",
    description:
      "Let's discuss your next video, campaign, or content series.",
    buttonLabel: "Let's Talk",
    buttonHref: "/contact",
  },
  sectionOrder: [...DEFAULT_HOMEPAGE_SECTION_ORDER],
  sectionVisibility: { ...DEFAULT_HOMEPAGE_SECTION_VISIBILITY },
};
