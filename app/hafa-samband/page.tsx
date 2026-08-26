import type { Metadata } from "next";

import { InquiryForm } from "@/components/inquiry-form";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hafa samband",
  description: "Bókaðu mælingu eða sendu okkur línu. Við svörum innan 48 klukkustunda.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-16 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
      <div>
        <p className="text-sm text-ink/50">Hafa samband</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-6xl">Halló</h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
          Ekki hika við að hafa samband. Við reynum að svara eins fljótt og
          auðið er — aldrei lengur en 48 tímum. Þú getur einnig náð í okkur á
          samfélagsmiðlum.
        </p>
        <div className="mt-10 space-y-3 text-sm">
          <p>
            <a className="text-forest underline-offset-4 hover:underline" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </p>
          <p>
            <a
              className="text-forest underline-offset-4 hover:underline"
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram @ttsuitisland
            </a>
          </p>
          <p>
            <a
              className="text-forest underline-offset-4 hover:underline"
              href={brand.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </p>
        </div>
        <div className="mt-12">
          <h2 className="font-serif text-3xl">Spurning?</h2>
          <div className="mt-6">
            <InquiryForm kind="contact" />
          </div>
        </div>
      </div>

      <div id="bokun" className="scroll-mt-28 bg-cream p-6 md:p-10">
        <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">
          Mæling
        </p>
        <h2 className="mt-2 font-serif text-4xl">Bókaðu tíma</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          Þú bókar og við finnum réttan tíma í sameiningu. Frá mælingu eru
          það venjulega 4–6 vikur þar til þú klæðist sérsauminum.
        </p>
        <div className="mt-8">
          <InquiryForm kind="booking" />
        </div>
      </div>
    </section>
  );
}
