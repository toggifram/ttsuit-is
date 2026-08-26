"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    function go() {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  return null;
}
