import { cn, hasContent } from "@/lib/utils";

import { sectionDesc, sectionTitle } from "@/lib/typography";

import { SectionLabel } from "./SectionLabel";



interface SectionHeaderProps {

  label?: string;

  title?: string;

  description?: string;

  className?: string;

  titleClassName?: string;

  align?: "left" | "center";

}



export function SectionHeader({

  label,

  title,

  description,

  className,

  titleClassName,

  align = "left",

}: SectionHeaderProps) {

  const showLabel = hasContent(label);

  const showTitle = hasContent(title);

  const showDescription = hasContent(description);



  if (!showLabel && !showTitle && !showDescription) {

    return null;

  }



  return (

    <div

      className={cn(

        align === "center" && "text-center",

        className

      )}

    >

      {showLabel && <SectionLabel>{label}</SectionLabel>}

      {showTitle && (

        <h2

          className={cn(

            sectionTitle,

            showLabel ? "mt-3 md:mt-4" : undefined,

            titleClassName

          )}

        >

          {title}

        </h2>

      )}

      {showDescription && (

        <p

          className={cn(

            sectionDesc,

            "mt-5 max-w-2xl md:mt-6",

            (showLabel || showTitle) && "mt-5 md:mt-6",

            align === "center" && "mx-auto"

          )}

        >

          {description}

        </p>

      )}

    </div>

  );

}


