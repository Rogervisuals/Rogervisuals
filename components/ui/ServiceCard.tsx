"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-presets";
import { hasContent } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  index?: number;
}

export function ServiceCard({ title, description, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay: index * 0.08 }}
      className="group border border-white/5 bg-mine-shaft p-6 transition-colors duration-300 hover:border-mariner/30 md:p-8"
    >
      <div className="mb-5 h-px w-8 bg-mariner transition-all duration-300 group-hover:w-12" />
      {hasContent(title) && <h3 className="type-card-title">{title}</h3>}
      {hasContent(description) && (
        <p className={`type-card-body ${hasContent(title) ? "mt-4" : ""}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
