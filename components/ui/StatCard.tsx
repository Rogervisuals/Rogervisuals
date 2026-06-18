"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-presets";

interface StatCardProps {
  value: string;
  label: string;
  index?: number;
}

export function StatCard({ value, label, index = 0 }: StatCardProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
      className="border border-white/5 bg-mine-shaft/50 px-6 py-10 text-center md:px-8 md:py-12"
    >
      <p className="type-stat">{value}</p>
      <p className="type-stat-label mt-3">{label}</p>
    </motion.div>
  );
}
