"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  imageContainerWidth,
  useImageAspectRatio,
} from "@/lib/hooks/useImageAspectRatio";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  compact?: boolean;
  maxHeight?: number;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  compact = false,
  maxHeight = compact ? 640 : 900,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const aspectRatio = useImageAspectRatio(beforeUrl);
  const ratio = aspectRatio ?? 16 / 9;

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    setIsDragging(true);
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }

  function handlePointerUp(e: React.PointerEvent) {
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      className="mx-auto w-full"
      style={{
        width: imageContainerWidth(ratio, maxHeight),
        aspectRatio: ratio,
      }}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full cursor-ew-resize select-none overflow-hidden bg-mine-shaft touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Image
          src={beforeUrl}
          alt={`${title} — before`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
          unoptimized
          draggable={false}
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <Image
            src={afterUrl}
            alt={`${title} — after`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
            unoptimized
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-y-0 -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          <div className="relative flex h-full items-center justify-center">
            <div className="absolute inset-y-0 w-px bg-white/60 shadow-sm" />
            <div
              className={
                compact
                  ? "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-shark/90 shadow-lg backdrop-blur-sm"
                  : "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-shark/90 shadow-lg backdrop-blur-sm"
              }
            >
              <svg
                className={compact ? "h-3 w-3 rotate-90 text-white" : "h-4 w-4 rotate-90 text-white"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>

        <span
          className={
            compact
              ? "type-meta absolute top-2 left-2 rounded-sm bg-shark/80 px-1.5 py-0.5 text-[0.625rem] text-silver/80 backdrop-blur-sm"
              : "type-meta absolute top-3 left-3 rounded-sm bg-shark/80 px-2 py-1 text-silver/80 backdrop-blur-sm"
          }
        >
          Before
        </span>
        <span
          className={
            compact
              ? "type-meta absolute top-2 right-2 rounded-sm bg-shark/80 px-1.5 py-0.5 text-[0.625rem] text-mariner backdrop-blur-sm"
              : "type-meta absolute top-3 right-3 rounded-sm bg-shark/80 px-2 py-1 text-mariner backdrop-blur-sm"
          }
        >
          After
        </span>
      </div>
    </div>
  );
}
