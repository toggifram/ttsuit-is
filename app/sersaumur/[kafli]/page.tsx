"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { sersaumurMenu } from "@/lib/site";

const hashes = new Set<string>(sersaumurMenu.map((item) => item.hash));

export default function LegacySersaumurRedirect() {
  const { kafli } = useParams<{ kafli: string }>();

  useEffect(() => {
    const hash = hashes.has(kafli) ? kafli : "";
    window.location.replace(hash ? `/sersaumur#${hash}` : "/sersaumur");
  }, [kafli]);

  return null;
}
