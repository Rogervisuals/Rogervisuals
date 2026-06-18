"use client";



import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";

import type { VfxComparison } from "@/lib/projects/types";



interface VfxComparisonsEditorProps {

  comparisons: VfxComparison[];

  onChange: (comparisons: VfxComparison[]) => void;

  slug: string;

}



const inputClass =

  "w-full rounded-md border border-white/10 bg-shark px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-white placeholder:text-silver/30 outline-none transition-colors focus:border-mariner/50";



function emptyComparison(): VfxComparison {

  return { beforeUrl: "", afterUrl: "", linkUrl: "", linkLabel: "" };

}



export function VfxComparisonsEditor({

  comparisons,

  onChange,

  slug,

}: VfxComparisonsEditorProps) {

  function updateComparison(

    index: number,

    field: keyof VfxComparison,

    value: string | null

  ) {

    const next = comparisons.map((item, i) =>

      i === index ? { ...item, [field]: value ?? "" } : item

    );

    onChange(next);

  }



  function removeComparison(index: number) {

    onChange(comparisons.filter((_, i) => i !== index));

  }



  return (

    <div className="space-y-6">

      {comparisons.map((comparison, index) => (

        <div

          key={index}

          className="rounded-lg border border-white/10 bg-shark/40 p-5"

        >

          <div className="mb-4 flex items-center justify-between">

            <p className="font-[family-name:var(--font-ui)] text-sm text-white">

              Comparison {index + 1}

            </p>

            <button

              type="button"

              onClick={() => removeComparison(index)}

              className="font-[family-name:var(--font-ui)] text-xs text-red-400/80 transition-colors hover:text-red-300"

            >

              Remove

            </button>

          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>

              <p className="mb-2 font-[family-name:var(--font-ui)] text-xs text-silver/50">

                Before

              </p>

              <ThumbnailUpload

                value={comparison.beforeUrl || null}

                onChange={(url) => updateComparison(index, "beforeUrl", url)}

                slug={`${slug}-vfx-${index}-before`}

                pathPrefix="vfx/"

                uploadLabel="Upload before"

                emptyLabel="No before image"

                matchImageAspect

              />

            </div>

            <div>

              <p className="mb-2 font-[family-name:var(--font-ui)] text-xs text-silver/50">

                After

              </p>

              <ThumbnailUpload

                value={comparison.afterUrl || null}

                onChange={(url) => updateComparison(index, "afterUrl", url)}

                slug={`${slug}-vfx-${index}-after`}

                pathPrefix="vfx/"

                uploadLabel="Upload after"

                emptyLabel="No after image"

                matchImageAspect

              />

            </div>

          </div>



          <div className="mt-4 grid gap-4 border-t border-white/5 pt-4 sm:grid-cols-2">

            <div>

              <p className="mb-2 font-[family-name:var(--font-ui)] text-xs text-silver/50">

                Link URL

              </p>

              <input

                className={inputClass}

                type="url"

                value={comparison.linkUrl ?? ""}

                onChange={(e) => updateComparison(index, "linkUrl", e.target.value)}

                placeholder="https://youtube.com/…"

              />

            </div>

            <div>

              <p className="mb-2 font-[family-name:var(--font-ui)] text-xs text-silver/50">

                Link label

              </p>

              <input

                className={inputClass}

                value={comparison.linkLabel ?? ""}

                onChange={(e) =>

                  updateComparison(index, "linkLabel", e.target.value)

                }

                placeholder="Watch full video"

              />

            </div>

          </div>

        </div>

      ))}



      <button

        type="button"

        onClick={() => onChange([...comparisons, emptyComparison()])}

        className="w-full rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white"

      >

        + Add before & after

      </button>

    </div>

  );

}


