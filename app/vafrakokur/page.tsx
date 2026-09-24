import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Vafrakökur",
  description: "Hvernig Tjé Tjé notar vafrakökur.",
  path: "/vafrakokur",
});

export default function CookiesPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm text-ink/50">Vafrakökur</p>
      <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">
        Stefnu um vafrakökur
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
        Síðast uppfært 11. september 2026.
      </p>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/75">
        <p>
          {brand.name} notar vafrakökur til að síðan virki, til að muna val
          þitt og — aðeins með samþykki þínu — til tölfræði og
          markaðssetningar.
        </p>
        <p>
          <strong className="font-medium text-forest">Nauðsynlegar.</strong>{" "}
          Muna körfu, valmynd og hvort þú hefur samþykkt vafrakökur eða skráð
          þig á póstlista. Þessar er ekki hægt að slökkva á.
        </p>
        <p>
          <strong className="font-medium text-forest">Tölfræði.</strong>{" "}
          Google Analytics 4 (Google Ireland Limited). Hjálpar okkur að sjá
          hvaða síður eru mest notaðar, t.d. verslun, sérsaumur og kassi.
          Skráir ekki fyrr en þú samþykkir.
        </p>
        <p>
          <strong className="font-medium text-forest">Markaðssetning.</strong>{" "}
          Meta Pixel (Meta Platforms Ireland Limited) fyrir Facebook og
          Instagram. Notuð til að mæla auglýsingar og ná til fólks sem hefur
          heimsótt síðuna. Skráir ekki fyrr en þú samþykkir.
        </p>
        <p>
          Þú getur valið aðeins nauðsynlegar í stillingunum á borðanum, eða
          hreinsað vafrakökur í stillingum vafrans. Þá birtist
          samþykktarborðinn aftur við næstu heimsókn.
        </p>
      </div>
      <p className="mt-12 text-sm">
        <Link href="/" className="text-forest underline-offset-4 hover:underline">
          Til baka á forsíðu
        </Link>
      </p>
    </section>
  );
}
