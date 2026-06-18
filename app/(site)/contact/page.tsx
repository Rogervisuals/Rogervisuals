import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/ui/ContactForm";
import { getContactPage } from "@/lib/site-settings/pages/queries";
import { hasContent } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPage();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function ContactPage() {
  const content = await getContactPage();
  const showSidebarTitle = hasContent(content.sidebar.title);
  const showSidebarDescription = hasContent(content.sidebar.description);
  const showSidebarIntro = showSidebarTitle || showSidebarDescription;

  return (
    <>
      <PageHeader
        label={content.header.label}
        title={content.header.title}
        description={content.header.description}
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              {showSidebarTitle && (
                <h2 className="type-card-title-lg">{content.sidebar.title}</h2>
              )}
              {showSidebarDescription && (
                <p
                  className={`type-section-desc ${showSidebarTitle ? "mt-4" : ""}`}
                >
                  {content.sidebar.description}
                </p>
              )}

              <div
                className={`space-y-7 ${showSidebarIntro ? "mt-10" : ""}`}
              >
                {hasContent(content.sidebar.email) && (
                  <div>
                    <p className="type-meta">Email</p>
                    <a
                      href={`mailto:${content.sidebar.email}`}
                      className="type-nav mt-2 block text-mariner transition-colors hover:text-white"
                    >
                      {content.sidebar.email}
                    </a>
                  </div>
                )}
                {hasContent(content.sidebar.location) && (
                  <div>
                    <p className="type-meta">Location</p>
                    <p className="type-card-body mt-2">
                      {content.sidebar.location}
                    </p>
                  </div>
                )}
                {hasContent(content.sidebar.responseTime) && (
                  <div>
                    <p className="type-meta">Response time</p>
                    <p className="type-card-body mt-2">
                      {content.sidebar.responseTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm
                success={content.formSuccess}
                projectTypes={content.form.projectTypes}
                budgetRanges={content.form.budgetRanges}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
