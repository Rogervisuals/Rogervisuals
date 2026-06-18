"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  getProjectCoverImage,
  projectIsBranding,
  projectIsPhotography,
  type Project,
} from "@/lib/projects/types";
import { fadeInUp } from "@/lib/motion-presets";
import { hasContent } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const coverImage = getProjectCoverImage(project);
  const isPhotography = projectIsPhotography(project.categories);
  const isBranding = projectIsBranding(project.categories);
  const showPlayButton = !isPhotography && !isBranding;

  return (
    <motion.article
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-mine-shaft">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="placeholder-shimmer absolute inset-0" />
          )}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-shark/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="ml-1 h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-mariner/0 transition-colors duration-300 group-hover:bg-mariner/10" />
        </div>

        <div className="mt-6 border-b border-white/5 pb-6 transition-colors duration-300 group-hover:border-mariner/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              {hasContent(project.type) && (
                <p className="type-section-label text-[0.6875rem] md:text-xs">
                  {project.type}
                </p>
              )}
              <h3 className="type-card-title-lg mt-2 transition-colors group-hover:text-mariner">
                {project.title}
              </h3>
              {hasContent(project.client) && (
                <p className="type-card-body mt-2 text-silver/70">{project.client}</p>
              )}
            </div>
          </div>
          <span className="type-nav mt-5 inline-flex items-center gap-2 text-mariner transition-all group-hover:gap-3">
            View Case
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
