import { SectionHeader } from "@/components/ui/SectionHeader";

import { ClientLogo } from "@/components/ui/ClientLogo";

import { getSiteSetting } from "@/lib/site-settings/queries";

import { cn, hasContent } from "@/lib/utils";



export async function Clients() {

  const section = await getSiteSetting("clients");



  if (section.clients.length === 0) return null;



  const showHeader =

    hasContent(section.title) || hasContent(section.description);



  return (

    <section className="border-y border-white/5 py-16 md:py-20">

      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {showHeader && (

          <SectionHeader

            title={section.title}

            description={section.description}

            align="center"

          />

        )}



        <div
          className={cn(
            "grid grid-cols-2 place-items-center gap-x-4 gap-y-6 md:flex md:flex-wrap md:items-center md:justify-center md:gap-10",
            showHeader && "mt-12 md:mt-14"
          )}
        >

          {section.clients.map((client, i) => (

            <ClientLogo key={client.id} client={client} index={i} />

          ))}

        </div>

      </div>

    </section>

  );

}


