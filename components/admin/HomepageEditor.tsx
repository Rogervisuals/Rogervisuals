"use client";

import { useState } from "react";
import Link from "next/link";
import { ClientsSectionForm } from "@/components/admin/homepage/ClientsSectionForm";
import { ContactSectionForm } from "@/components/admin/homepage/ContactSectionForm";
import { HeroSectionForm } from "@/components/admin/homepage/HeroSectionForm";
import { HomepageSectionNav } from "@/components/admin/homepage/HomepageSectionNav";
import { ProcessSectionForm } from "@/components/admin/homepage/ProcessSectionForm";
import { ServicesSectionForm } from "@/components/admin/homepage/ServicesSectionForm";
import { StatsSectionForm } from "@/components/admin/homepage/StatsSectionForm";
import { SectionCard } from "@/components/admin/homepage/shared";
import type { HomepageEditorSectionId } from "@/lib/site-settings/homepage-sections";
import type { HomepageContent } from "@/lib/site-settings/types";

interface HomepageEditorProps {
  content: HomepageContent;
}

export function HomepageEditor({ content }: HomepageEditorProps) {
  const [active, setActive] = useState<HomepageEditorSectionId>("hero");

  return (
    <div className="flex flex-col gap-8 px-8 py-8 lg:flex-row lg:items-start">
      <HomepageSectionNav
        sectionOrder={content.sectionOrder}
        sectionVisibility={content.sectionVisibility}
        active={active}
        onSelect={setActive}
      />

      <div className="min-w-0 flex-1">
        {active === "hero" && <HeroSectionForm initial={content.hero} />}
        {active === "clients" && (
          <ClientsSectionForm initial={content.clients} />
        )}
        {active === "stats" && <StatsSectionForm initial={content.stats} />}
        {active === "featured" && (
          <SectionCard
            title="Featured work"
            description="This section shows projects marked as featured. Its position on the homepage can be changed by dragging it in the sidebar."
          >
            <p className="font-[family-name:var(--font-body)] text-sm text-silver/70">
              To choose which projects appear here, go to{" "}
              <Link
                href="/admin/projects"
                className="text-mariner transition-colors hover:text-white"
              >
                Projects
              </Link>{" "}
              and toggle the <span className="text-white">Featured</span> badge on each project.
            </p>
          </SectionCard>
        )}
        {active === "services" && (
          <ServicesSectionForm initial={content.services} />
        )}
        {active === "process" && (
          <ProcessSectionForm initial={content.process} />
        )}
        {active === "contact" && (
          <ContactSectionForm initial={content.contact} />
        )}
      </div>
    </div>
  );
}
