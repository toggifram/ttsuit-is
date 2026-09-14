"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/** Jump to the absolute top of the document, beating Next.js scroll restoration. */
export function scrollToPageTop() {
  const go = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById("top")?.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  };
  go();
  window.requestAnimationFrame(go);
  window.setTimeout(go, 80);
  window.setTimeout(go, 240);
}

export function scrollToHash(
  hash: string,
  behavior: ScrollBehavior = "smooth"
) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start", behavior });
  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, "", `#${id}`);
  }
}

export function ScrollToHash() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";

    function go() {
      const id = window.location.hash.replace(/^#/, "");
      if (id) {
        document.getElementById(id)?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
        return;
      }
      window.scrollTo(0, 0);
    }

    const raf = window.requestAnimationFrame(go);
    const t1 = window.setTimeout(go, 80);
    const t2 = window.setTimeout(go, 240);
    window.addEventListener("hashchange", go);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("hashchange", go);
    };
  }, [pathname]);

  return null;
}
