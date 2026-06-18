"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_COLLAGE_LAYOUT } from "@/lib/site-settings/hero-collage-layout";
import type { HeroCollagePanel } from "@/lib/site-settings/types";

interface HeroCollageProps {
  panels: HeroCollagePanel[];
}

export function HeroCollage({ panels }: HeroCollageProps) {
  return (
    <div
      className="site-layer-bg pointer-events-none relative hidden shrink-0 lg:block lg:w-[280px] lg:justify-self-end xl:w-[300px]"
      aria-hidden="true"
    >
      <div className="absolute top-1/2 left-1/3 h-[90%] w-full -translate-y-1/2 rounded-full bg-mariner/[0.07] blur-[90px]" />

      <div className="relative h-[460px] w-full xl:h-[500px]">
        {HERO_COLLAGE_LAYOUT.map((layout, i) => {
          const panel = panels[i];
          if (!panel) return null;

          return (
            <motion.div
              key={panel.id}
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.75,
                delay: layout.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-1/2"
              style={{
                left: `${layout.left}%`,
                zIndex: layout.zIndex,
                transform: `translateY(calc(-50% + ${layout.offsetY}px)) rotate(${layout.rotate}deg)`,
              }}
            >
              <div
                className="relative h-[420px] w-[54px] overflow-hidden xl:h-[460px] xl:w-[60px]"
                style={{
                  boxShadow:
                    "0 22px 44px -10px rgba(0,0,0,0.55), 0 0 28px -6px rgba(44,114,184,0.1)",
                }}
              >
                {panel.imageUrl ? (
                  <Image
                    src={panel.imageUrl}
                    alt={panel.label}
                    fill
                    className="object-cover"
                    sizes="60px"
                    unoptimized
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{ background: layout.gradient }}
                    />
                    <div className="placeholder-shimmer absolute inset-0 opacity-[0.22]" />
                  </>
                )}

                <div
                  className="absolute inset-0 bg-shark"
                  style={{ opacity: layout.overlay }}
                />

                <div className="absolute inset-y-0 left-0 w-px bg-mariner/25" />
                <div className="absolute inset-y-0 right-0 w-px bg-white/[0.05]" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-mariner/[0.07] to-transparent" />

                {i === 0 && (
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-shark/50 to-transparent" />
                )}

                {layout.showLabel && panel.label.trim() && (
                  <span
                    className="type-label absolute bottom-8 left-1/2 text-[9px] text-white/20"
                    style={{ transform: "translateX(-50%) rotate(-90deg)" }}
                  >
                    {panel.label}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
