import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vafrakökur",
  description: "Hvernig Tjé Tjé notar vafrakökur.",
};

export default function CookiesPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm text-ink/50">Vafrakökur</p>
      <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">
        Stefnu um vafrakökur
      </h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/75">
        <p>
          {brand.name} notar vafrakökur til að síðan virki og til að muna val
          þitt. Við notum ekki auglýsingakökur frá þriðja aðila.
        </p>
        <p>
          <strong className="font-medium text-forest">Nauðsynlegar.</strong>{" "}
          Muna körfu, valmynd og hvort þú hefur samþykkt vafrakökur eða skráð
          þig á póstlista. Þessar er ekki hægt að slökkva á.
        </p>
        <p>
          <strong className="font-medium text-forest">Tölfræði.</strong> Ef þú
          samþykkir þær hjálpa þær okkur að sjá hvaða síður eru mest notaðar.
          Þú getur valið aðeins nauðsynlegar í stillingunum.
        </p>
        <p>
          Þú getur hreinsað vafrakökur í stillingum vafrans. Þá birtist
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
