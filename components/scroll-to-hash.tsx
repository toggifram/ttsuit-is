"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToHash() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";

    function go() {
      const id = window.location.hash.replace(/^#/, "");
      if (id) {
        document.getElementById(id)?.scrollIntoView({
          block: "start",
        });
        return;
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    go();
    const raf = window.requestAnimationFrame(go);
    const t1 = window.setTimeout(go, 0);
    const t2 = window.setTimeout(go, 80);
    const t3 = window.setTimeout(go, 200);
    window.addEventListener("hashchange", go);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("hashchange", go);
    };
  }, [pathname]);

  return null;
}
