import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { ScrollToHash } from "@/components/scroll-to-hash";
import {
  SersaumurBoka,
  SersaumurEfnin,
  SersaumurFerlid,
  SersaumurHero,
  SersaumurSpurningar,
  SersaumurVerdskra,
} from "@/components/sersaumur-sections";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sérsaumur",
  description:
    "Sérsaumuð jakkaföt, jakkar og skyrtur eftir þínum mælingum. Ferlið, efnin, verðskrá og bókun — 4–6 vikur.",
  path: "/sersaumur",
  images: [
    { url: "/images/studio/sersaumur-hero.png", alt: "Sérsaumur hjá Tjé Tjé" },
  ],
});

export default function SersaumurPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsíða", path: "/" },
          { name: "Sérsaumur", path: "/sersaumur" },
        ])}
      />
      <ScrollToHash />
      <SersaumurHero />
      <SersaumurFerlid />
      <SersaumurEfnin />
      <SersaumurVerdskra />
      <SersaumurBoka />
      <SersaumurSpurningar />
    </>
  );
}
