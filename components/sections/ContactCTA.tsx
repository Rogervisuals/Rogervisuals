"use client";



import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";

import { sectionDesc, sectionTitle } from "@/lib/typography";

import type { ContactSectionContent } from "@/lib/site-settings/types";

import { fadeInUp } from "@/lib/motion-presets";
import { hasContent } from "@/lib/utils";



interface ContactCTAProps {

  content: ContactSectionContent;

}



export function ContactCTA({ content }: ContactCTAProps) {

  const showTitle = hasContent(content.title);

  const showDescription = hasContent(content.description);

  const showButton =

    hasContent(content.buttonLabel) && hasContent(content.buttonHref);



  return (

    <section className="border-y border-white/5 bg-mine-shaft/20 py-24 md:py-32">

      <div className="mx-auto max-w-7xl px-6 md:px-8">

        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center"
        >

          {showTitle && <h2 className={sectionTitle}>{content.title}</h2>}

          {showDescription && (

            <p

              className={`${sectionDesc} mx-auto max-w-md ${showTitle ? "mt-5 md:mt-6" : ""}`}

            >

              {content.description}

            </p>

          )}

          {showButton && (

            <div className={showTitle || showDescription ? "mt-10" : undefined}>

              <Button href={content.buttonHref} variant="primary" size="lg">

                {content.buttonLabel}

              </Button>

            </div>

          )}

        </motion.div>

      </div>

    </section>

  );

}


