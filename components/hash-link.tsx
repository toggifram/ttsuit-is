"use client";

import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";

import { scrollToHash } from "@/components/scroll-to-hash";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"a"> & {
  hash: string;
};

/** Native hash link so the Sérsaumur page scrolls instead of opening a new route. */
export function HashLink({ hash, href, className, onClick, ...props }: Props) {
  const pathname = usePathname();
  const target = href ?? `/sersaumur#${hash}`;

  return (
    <a
      {...props}
      href={target}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (pathname !== "/sersaumur") return;
        event.preventDefault();
        scrollToHash(hash, "smooth");
      }}
    />
  );
}
