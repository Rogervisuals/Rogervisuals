"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-presets";
import { Button } from "./Button";
import { SectionLabel } from "./SectionLabel";
import { sectionTitle } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface CasePreviewProps {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  result: string;
  slug: string;
}

export function CasePreview({
  title,
  client,
  challenge,
  solution,
  result,
  slug,
}: CasePreviewProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.6 }}
      className="grid gap-8 lg:grid-cols-2 lg:gap-12"
    >
      <div className="relative aspect-video overflow-hidden bg-mine-shaft lg:aspect-auto lg:min-h-[480px]">
        <div className="placeholder-shimmer absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-shark/60 backdrop-blur-sm">
            <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="type-meta absolute bottom-4 left-4 rounded-sm bg-shark/80 px-3 py-1.5 backdrop-blur-sm">
          Case Study Preview
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <SectionLabel>Featured Case Study</SectionLabel>
        <h2 className={cn(sectionTitle, "mt-3 md:mt-4")}>
          {title}
        </h2>
        <p className="type-nav mt-3 text-mariner">{client}</p>

        <div className="mt-10 space-y-8">
          <div>
            <h3 className="type-meta">Challenge</h3>
            <p className="type-card-body mt-4">{challenge}</p>
          </div>
          <div>
            <h3 className="type-meta">Solution</h3>
            <p className="type-card-body mt-4">{solution}</p>
          </div>
          <div>
            <h3 className="type-meta">Result</h3>
            <p className="type-card-body mt-4 text-white">{result}</p>
          </div>
        </div>

        <div className="mt-10">
          <Button href={`/work/${slug}`} variant="primary">
            Read Full Case
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
