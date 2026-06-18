import { pageTitle, sectionDesc, sectionLabel } from "@/lib/typography";

import { cn, hasContent } from "@/lib/utils";



interface PageHeaderProps {

  label: string;

  title: string;

  description?: string;

}



export function PageHeader({ label, title, description }: PageHeaderProps) {

  const showLabel = hasContent(label);

  const showTitle = hasContent(title);

  const showDescription = hasContent(description);



  return (

    <div className="mx-auto max-w-7xl px-6 pt-12 pb-12 md:px-8 md:pt-32 md:pb-16">

      {showLabel && <p className={sectionLabel}>{label}</p>}

      {showTitle && (

        <h1 className={cn(pageTitle, showLabel ? "mt-3 md:mt-4" : "")}>

          {title}

        </h1>

      )}

      {showDescription && (

        <p

          className={cn(

            sectionDesc,

            "max-w-2xl",

            (showLabel || showTitle) && "mt-5 md:mt-6"

          )}

        >

          {description}

        </p>

      )}

    </div>

  );

}


