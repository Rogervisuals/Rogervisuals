"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProcessSectionContent } from "@/lib/site-settings/types";
import { fadeInUp } from "@/lib/motion-presets";
import { hasContent } from "@/lib/utils";

interface ProcessProps {
  content: ProcessSectionContent;
}

export function Process({ content }: ProcessProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader label={content.label} title={content.title} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 md:mt-16">
          {content.steps.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
              className="relative border border-white/5 bg-mine-shaft/50 p-6 md:p-7"
            >
              <span className="type-stat text-2xl text-mariner/35 md:text-3xl">
                {step.step}
              </span>
              <h3 className="type-card-title mt-4">{step.title}</h3>
              {hasContent(step.description) && (
                <p className="type-card-body mt-3">{step.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
