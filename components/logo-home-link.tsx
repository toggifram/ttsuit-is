"use client";

import { forwardRef, useLayoutEffect, useRef, type ComponentProps } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Logo } from "@/components/logo";
import { scrollToPageTop } from "@/components/scroll-to-hash";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

type Props = {
  size?: LogoSize;
} & Omit<ComponentProps<"a">, "href">;

export const LogoHomeLink = forwardRef<HTMLAnchorElement, Props>(
  function LogoHomeLink({ className, size = "md", onClick, ...props }, ref) {
    const pathname = usePathname();
    const router = useRouter();
    const pendingTop = useRef(false);

    useLayoutEffect(() => {
      if (!pendingTop.current || pathname !== "/") return;
      pendingTop.current = false;
      scrollToPageTop();
    }, [pathname]);

    return (
      <a
        ref={ref}
        href="/"
        aria-label={`${brand.name} — forsíða`}
        {...props}
        className={cn(
          "relative z-20 inline-flex shrink-0 items-center",
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }

          event.preventDefault();
          if (window.location.hash) {
            window.history.replaceState(null, "", "/");
          }
          if (pathname !== "/") {
            pendingTop.current = true;
            router.push("/");
          }
          scrollToPageTop();
        }}
      >
        <Logo
          size={size}
          variant="light"
          className={size === "md" ? "object-center" : undefined}
        />
      </a>
    );
  }
);

      <a
        ref={ref}
        href="/"
        aria-label={`${brand.name} — forsíða`}
        {...props}
        className={cn(
          "relative z-20 inline-flex shrink-0 items-center",
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }

          event.preventDefault();
          if (window.location.hash) {
            window.history.replaceState(null, "", "/");
          }
          if (pathname !== "/") {
            router.push("/");
          }
          scrollToPageTop();
        }}
      >
        <Logo
          size={size}
          variant="light"
          className={size === "md" ? "object-center" : undefined}
        />
      </a>
    );
  }
);
