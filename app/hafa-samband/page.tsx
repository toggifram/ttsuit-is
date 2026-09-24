import type { Metadata } from "next";
import Link from "next/link";

import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
import { contactJsonLd, pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Hafa samband",
  description: "Sendu okkur línu. Við svörum innan 48 klukkustunda.",
  path: "/hafa-samband",
});

export default function ContactPage() {
  return (
    <>
    <JsonLd data={contactJsonLd()} />
    <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
      <div className="md:col-span-5">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Halló
        </p>
        <h1 className="mt-3 font-serif text-4xl text-forest md:text-6xl">
          Hafa samband
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
          Ekki hika við að senda línu. Við reynum að svara eins fljótt og
          auðið er — aldrei lengur en 48 tímum. Þú nærð líka í okkur á
          samfélagsmiðlum.
        </p>
        <div className="mt-10 space-y-3 text-sm">
          <p>
            <a
              className="text-forest underline-offset-4 hover:underline"
              href={`mailto:${brand.email}`}
            >
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
        <p className="mt-10 text-sm text-ink/55">
          Viltu bóka mælingu?{" "}
          <Link
            href="/sersaumur#boka-tima"
            className="text-forest underline-offset-4 hover:underline"
          >
            Farðu á sérsaumssíðuna
          </Link>
          .
        </p>
      </div>
      <div className="bg-cream p-6 md:col-span-7 md:p-10">
        <InquiryForm kind="contact" />
      </div>
    </section>
    </>
  );
}
