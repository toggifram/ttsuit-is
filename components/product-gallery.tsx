"use client";

import { useRef, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const SWIPE_PX = 48;

export function ProductGallery({
  images,
  alt,
  isGift = false,
  badge,
  active,
  onChange,
}: {
  images: string[];
  alt: string;
  isGift?: boolean;
  badge?: string;
  active: number;
  onChange: (index: number) => void;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;
  const index = count ? ((active % count) + count) % count : 0;
  const src = images[index] ?? images[0];

  function go(delta: number) {
    if (count < 2) return;
    onChange((index + delta + count) % count);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!start.current || count < 2) {
      start.current = null;
      return;
    }
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  }

  const imgClass = isGift
    ? "pointer-events-none absolute inset-0 h-full w-full object-contain p-10"
    : "pointer-events-none absolute inset-0 h-full w-full object-cover object-top";

  return (
    <div>
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden select-none",
          isGift ? "bg-[#1a1a1a]" : "bg-[#ebe6dc]",
          count > 1 && "touch-pan-y cursor-grab active:cursor-grabbing"
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          }
        }}
        tabIndex={count > 1 ? 0 : undefined}
        role={count > 1 ? "region" : undefined}
        aria-roledescription={count > 1 ? "myndasýning" : undefined}
        aria-label={count > 1 ? `${alt}, mynd ${index + 1} af ${count}` : undefined}
      >
        <img src={src} alt={alt} draggable={false} className={imgClass} />
        {badge ? (
          <span className="absolute left-3 top-3 z-10 bg-black px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-white">
            {badge}
          </span>
        ) : null}
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Fyrri mynd"
              className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center bg-white/90 text-forest shadow-sm transition-colors hover:bg-white md:size-11"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Næsta mynd"
              className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center bg-white/90 text-forest shadow-sm transition-colors hover:bg-white md:size-11"
            >
              <ChevronRight className="size-5" />
            </button>
            <p className="sr-only" aria-live="polite">
              Mynd {index + 1} af {count}
            </p>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <>
          <div className="mt-3 flex justify-center gap-1.5 md:hidden">
            {images.map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() => onChange(imageIndex)}
                aria-label={`Mynd ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                className={cn(
                  "size-1.5 rounded-full",
                  imageIndex === index ? "bg-forest" : "bg-forest/25"
                )}
              />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {images.map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() => onChange(imageIndex)}
                aria-label={`Mynd ${imageIndex + 1}`}
                aria-current={imageIndex === index}
                className={cn(
                  "relative aspect-square overflow-hidden bg-[#ebe6dc]",
                  imageIndex === index
                    ? "ring-1 ring-forest"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={image}
                  alt=""
                  className={
                    isGift
                      ? "absolute inset-0 h-full w-full object-contain bg-[#1a1a1a] p-2"
                      : "absolute inset-0 h-full w-full object-cover object-top"
                  }
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
