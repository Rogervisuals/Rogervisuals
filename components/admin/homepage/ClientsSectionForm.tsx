"use client";

import { useEffect, useState } from "react";
import { ThumbnailUpload } from "@/components/admin/ThumbnailUpload";
import {
  FieldLabel,
  SaveSectionButton,
  SectionCard,
  inputClass,
} from "@/components/admin/homepage/shared";
import { updateClientsSection } from "@/lib/site-settings/actions";
import type {
  ClientsSectionContent,
  HomepageClient,
} from "@/lib/site-settings/types";
import { cn, reorderArray } from "@/lib/utils";

function createClient(): HomepageClient {
  return { id: crypto.randomUUID(), name: "", logo: null, url: null };
}

function DragHandleIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-silver/40"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

interface ClientsSectionFormProps {
  initial: ClientsSectionContent;
}

export function ClientsSectionForm({ initial }: ClientsSectionFormProps) {
  const [form, setForm] = useState(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function updateClient(
    index: number,
    field: keyof HomepageClient,
    value: string | null
  ) {
    setForm((prev) => ({
      ...prev,
      clients: prev.clients.map((client, i) =>
        i === index ? { ...client, [field]: value ?? "" } : client
      ),
    }));
  }

  function removeClient(index: number) {
    setForm((prev) => ({
      ...prev,
      clients: prev.clients.filter((_, i) => i !== index),
    }));
  }

  function reorderClients(fromIndex: number, toIndex: number) {
    setForm((prev) => ({
      ...prev,
      clients: reorderArray(prev.clients, fromIndex, toIndex),
    }));
  }

  async function handleSave() {
    const clients = form.clients
      .map((client) => ({
        ...client,
        name: client.name.trim(),
        logo: client.logo?.trim() || null,
        url: client.url?.trim() || null,
      }))
      .filter((client) => client.name);

    return updateClientsSection({
      title: form.title.trim(),
      description: form.description.trim(),
      clients,
    });
  }

  return (
    <SectionCard
      title="Client logos"
      description="Manage the client logo strip on the homepage. Upload logos, add optional website links, or show initials when no logo is set."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Section title</FieldLabel>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <FieldLabel>Section description</FieldLabel>
          <input
            className={inputClass}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
      </div>

      {form.clients.length > 1 && (
        <p className="font-[family-name:var(--font-body)] text-xs text-silver/40">
          Drag clients by the handle to change their order.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {form.clients.map((client, index) => {
          const isDragging = dragIndex === index;
          const isDropTarget =
            dropIndex === index && dragIndex !== null && dragIndex !== index;

          return (
            <div
              key={client.id}
              onDragOver={(event) => {
                event.preventDefault();
                if (dragIndex === null || dragIndex === index) return;
                setDropIndex(index);
              }}
              onDrop={() => {
                if (dragIndex === null) return;
                reorderClients(dragIndex, index);
                setDragIndex(null);
                setDropIndex(null);
              }}
              className={cn(
                "flex flex-col rounded-lg border bg-shark/40 p-3 transition-[opacity,box-shadow,border-color]",
                isDragging && "opacity-50",
                isDropTarget
                  ? "border-mariner/50 shadow-[0_0_0_1px_rgba(44,114,184,0.35)]"
                  : "border-white/10"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  {form.clients.length > 1 && (
                    <div
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        setDragIndex(index);
                        setDropIndex(index);
                      }}
                      onDragEnd={() => {
                        setDragIndex(null);
                        setDropIndex(null);
                      }}
                      aria-label={`Drag client ${index + 1}`}
                      className="flex shrink-0 cursor-grab items-center rounded border border-white/10 bg-shark/60 p-1.5 active:cursor-grabbing"
                    >
                      <DragHandleIcon />
                    </div>
                  )}
                  <p className="truncate font-[family-name:var(--font-ui)] text-xs text-white">
                    {client.name.trim() || `Client ${index + 1}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeClient(index)}
                  className="shrink-0 font-[family-name:var(--font-ui)] text-[0.625rem] text-red-400/80 transition-colors hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                <ThumbnailUpload
                  value={client.logo ?? null}
                  onChange={(url) => updateClient(index, "logo", url)}
                  slug={`client-${client.id}`}
                  pathPrefix="logos/"
                  aspectClass="aspect-[2/1]"
                  emptyLabel="No logo"
                  uploadLabel="Upload"
                  compact
                  imageFit="contain"
                />
                <div>
                  <FieldLabel>Name</FieldLabel>
                  <input
                    className={cn(inputClass, "py-2 text-sm")}
                    value={client.name}
                    onChange={(e) => updateClient(index, "name", e.target.value)}
                    placeholder="Red Bull"
                  />
                </div>
                <div>
                  <FieldLabel>Link</FieldLabel>
                  <input
                    className={cn(inputClass, "py-2 text-sm")}
                    type="url"
                    value={client.url ?? ""}
                    onChange={(e) => updateClient(index, "url", e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            clients: [...prev.clients, createClient()],
          }))
        }
        className="w-full rounded-md border border-dashed border-white/15 px-4 py-3 font-[family-name:var(--font-ui)] text-sm text-silver/70 transition-colors hover:border-mariner/40 hover:text-white"
      >
        + Add client
      </button>

      <SaveSectionButton onSave={handleSave} />
    </SectionCard>
  );
}
