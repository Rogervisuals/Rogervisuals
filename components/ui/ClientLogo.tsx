"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HomepageClient } from "@/lib/site-settings/types";
import { fadeInUpSmall } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface ClientLogoProps {
  client: HomepageClient;
  index?: number;
}

function getInitials(name: string): string {

  return name

    .split(" ")

    .map((word) => word[0])

    .join("")

    .slice(0, 2)

    .toUpperCase();

}



export function ClientLogo({ client, index = 0 }: ClientLogoProps) {

  const hasLink = Boolean(client.url?.trim());



  const content = (

    <>

      {client.logo ? (

        <Image

          src={client.logo}

          alt={`${client.name} logo`}

          fill

          sizes="(max-width: 768px) 152px, 208px"

          className="object-contain object-center opacity-60 transition-opacity duration-300 group-hover:opacity-90"

          unoptimized

        />

      ) : (

        <div className="flex h-full w-full items-center justify-center rounded-sm border border-white/[0.06] bg-mine-shaft/40 px-4 transition-all duration-300 group-hover:border-white/10 group-hover:bg-mine-shaft/60">

          <span className="type-meta text-base text-white/25 transition-colors duration-300 group-hover:text-white/45 md:text-lg">

            {getInitials(client.name)}

          </span>

        </div>

      )}

    </>

  );



  const motionProps = {
    ...fadeInUpSmall,
    transition: { ...fadeInUpSmall.transition, delay: index * 0.06 },
    className: cn(
      "group relative block h-20 w-full max-w-[9.5rem] md:h-24 md:w-52 md:max-w-none",
      hasLink && "cursor-pointer"
    ),

    title: hasLink ? `${client.name} — visit website` : client.name,

  };



  if (hasLink && client.url) {

    return (

      <motion.a

        {...motionProps}

        href={client.url}

        target="_blank"

        rel="noopener noreferrer"

        aria-label={`Visit ${client.name} website`}

      >

        {content}

      </motion.a>

    );

  }



  return <motion.div {...motionProps}>{content}</motion.div>;

}


