"use client";

import { useRef, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductImageBadges } from "@/components/product-image-badges";
import { cn } from "@/lib/utils";

const SWIPE_PX = 48;

export function ProductGallery({
  images,
  alt,
  isGift = false,
  badge,
  sellingFast = false,
  soldOut = false,
  active,
  onChange,
}: {
  images: string[];
  alt: string;
  isGift?: boolean;
  badge?: string;
  sellingFast?: boolean;
  soldOut?: boolean;
  active: number;
  onChange: (index: number) => void;
}) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const count = images.length;
  const index = count ? ((active % count) + count) % count : 0;
  const src = images[index] ?? images[0];

  function go(delta: number) {
    if (count < 2) return;
    onChange((index + delta + count) % count);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (count < 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const origin = start.current;
    if (!origin || origin.id !== event.pointerId) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    start.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    go(dx < 0 ? 1 : -1);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const origin = start.current;
    start.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!origin || origin.id !== event.pointerId) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  }

  const imgClass = isGift
    ? "pointer-events-none absolute inset-0 h-full w-full object-contain p-10"
    : "pointer-events-none absolute inset-0 h-full w-full object-cover object-top";

  return (
    <div>
      <div className="relative">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden select-none",
            isGift ? "bg-white" : "bg-[#ebe6dc]",
            count > 1 && "touch-pan-y cursor-grab active:cursor-grabbing"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            start.current = null;
          }}
        >
          <img src={src} alt={alt} draggable={false} className={imgClass} />
          <ProductImageBadges
            badge={badge}
            sellingFast={sellingFast}
            soldOut={soldOut}
          />
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Fyrri mynd"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 z-30 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white text-forest shadow-md hover:bg-cream"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Næsta mynd"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 z-30 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white text-forest shadow-md hover:bg-cream"
            >
              <ChevronRight className="size-5" aria-hidden />
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
                      ? "absolute inset-0 h-full w-full object-contain bg-white p-2"
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
