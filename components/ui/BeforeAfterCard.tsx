"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-presets";

interface BeforeAfterCardProps {
  title: string;
  description: string;
  category: string;
  index?: number;
  showSlider?: boolean;
}

export function BeforeAfterCard({
  title,
  description,
  category,
  index = 0,
  showSlider = true,
}: BeforeAfterCardProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
      className="group overflow-hidden border border-white/5 bg-mine-shaft"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mine-shaft to-shark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="type-meta text-silver/40">Before</span>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-br from-shark via-mine-shaft to-mariner/20"
          style={{ clipPath: "inset(0 0 0 50%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="type-meta text-white/60">After</span>
          </div>
        </div>

        {showSlider && (
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2">
            <div className="relative flex h-full items-center justify-center">
              <div className="absolute inset-y-0 w-px bg-white/40" />
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-shark/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <svg className="h-4 w-4 rotate-90 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="type-meta absolute left-3 top-3 rounded-sm bg-shark/80 px-2 py-1 text-mariner backdrop-blur-sm">
          {category}
        </div>
      </div>

      <div className="p-6 md:p-7">
        <h3 className="type-card-title">{title}</h3>
        <p className="type-card-body mt-4">{description}</p>
      </div>
    </motion.div>
  );
}
