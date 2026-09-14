"use client";

import type { ComponentProps } from "react";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { scrollToPageTop } from "@/components/scroll-to-hash";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

export function LogoHomeLink({
  className,
  size = "md",
  onClick,
  ...props
}: {
  size?: LogoSize;
} & Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  const pendingTop = useRef(false);

  useLayoutEffect(() => {
    if (!pendingTop.current || pathname !== "/") return;
    pendingTop.current = false;
    scrollToPageTop();
  }, [pathname]);

  return (
    <Link
      href="/"
      scroll={false}
      aria-label={`${brand.name} — forsíða`}
      {...props}
      className={cn("inline-flex shrink-0 items-center", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        if (pathname === "/") {
          event.preventDefault();
          if (window.location.hash) {
            window.history.replaceState(null, "", "/");
          }
          scrollToPageTop();
          return;
        }

        pendingTop.current = true;
        scrollToPageTop();
      }}
    >
      <Logo
        size={size}
        variant="light"
        className={size === "md" ? "object-center" : undefined}
      />
    </Link>
  );
}
