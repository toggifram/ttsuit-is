import { HashLink } from "@/components/hash-link";
import { InquiryForm } from "@/components/inquiry-form";
import { PriceList } from "@/components/price-list";
import { brand, fabrics, faqs, processSteps, sersaumurMenu } from "@/lib/site";

const sectionClass = "scroll-mt-36";

export function SersaumurHero() {
  return (
    <section className="grid items-end bg-white md:grid-cols-2">
      <div className="flex flex-col justify-end px-6 pb-8 pt-12 md:px-14 md:pb-10 md:pt-16 lg:px-20">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-forest/55">
          CUSTOM MADE fyrir kjéllinn
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-forest italic md:text-6xl lg:text-7xl">
          Saumað eftir þér.
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
          Jakkaföt, jakkar og skyrtur eftir líkamanum þínum — Ekki af rekka!
          Þú velur efni, snið og smáatriði. Við tökum mælinguna og saumum.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {sersaumurMenu
            .filter((item) => item.hash !== "reiknivel")
            .map((item) => (
              <HashLink
                key={item.hash}
                hash={item.hash}
                href={item.href}
                className="inline-flex h-12 items-center border border-forest/20 px-7 text-sm text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
              >
                {item.label}
              </HashLink>
            ))}
        </div>
      </div>
      <div className="flex items-end justify-center bg-white px-5 pt-4 md:px-8 md:pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/studio/suit-bag.png"
          alt="Sérsaumuð jakkaföt og fatapoki Tjé Tjé"
          className="block h-auto w-full max-h-[min(62vh,560px)] object-contain object-bottom"
        />
      </div>
    </section>
  );
}

export function SersaumurFerlid() {
  return (
    <section
      id="ferlid"
      aria-labelledby="ferlid-heading"
      className={`${sectionClass} bg-cream`}
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-8 pb-16 md:grid-cols-12 md:px-8 md:pt-10 md:pb-24">
        <div className="md:col-span-4">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            Ferlið
          </p>
          <h2
            id="ferlid-heading"
            className="mt-3 font-serif text-4xl text-forest md:text-5xl"
          >
            Fimm skref. Ekkert flókið.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/70">
            Frá fyrstu línu til fata sem sitja eins og þau eiga að sitja. Við
            förum hægt yfir valin — og hreint út ef eitthvað hentar þér illa.
          </p>
        </div>
        <ol className="md:col-span-8">
          {processSteps.map((step) => (
            <li
              key={step.n}
              className="grid gap-4 border-t border-forest/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-[4.5rem_1fr] md:gap-8"
            >
              <p className="font-serif text-3xl text-forest/35">{step.n}</p>
              <div>
                <h3 className="font-serif text-2xl text-forest">{step.title}</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SersaumurEfnin() {
  return (
    <section
      id="efnin"
      aria-labelledby="efnin-heading"
      className={`${sectionClass} bg-white`}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Efnin
        </p>
        <h2
          id="efnin-heading"
          className="mt-3 max-w-2xl font-serif text-4xl text-forest md:text-5xl"
        >
          Þú snertir dúkinn áður en við klippum.
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          Við verslum meðal annars frá Ítalíu, Bretlandi, Þýskalandi og
          Tyrklandi. Hundruð efnis — ull, hör, flannel, tweed og skyrtuefni. Þú
          velur. Ef þú spyrð hvað mér finnst, svara ég eins og mér finnst.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fabrics.map((fabric) => (
            <article key={fabric.name} className="bg-cream">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe6dc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fabric.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="px-5 py-6">
                <p className="text-[11px] tracking-[0.16em] text-forest/50 uppercase">
                  {fabric.note}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-forest">
                  {fabric.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {fabric.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SersaumurVerdskra() {
  return (
    <section
      id="verdskra"
      aria-labelledby="verdskra-heading"
      className={`${sectionClass} bg-cream`}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Verðskrá
        </p>
        <h2
          id="verdskra-heading"
          className="mt-3 max-w-3xl font-serif text-4xl text-forest md:text-5xl"
        >
          Fötin eru kannski ekki ókeypis. Verðin gætu samt komið þér á óvart.
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          Allar flíkur eru sérsaumaðar eftir líkamsbyggingu kaupanda. Hér
          finnur þú föt á ásættanlegu verði. Verðflokkarnir fara eftir efnisvali
          og frá hvaða framleiðanda efnin koma. Við förum betur yfir þetta í
          sameiningu þegar þú mætir í mælingu.
        </p>
        <PriceList />
      </div>
    </section>
  );
}

export function SersaumurBoka() {
  return (
    <section
      id="boka-tima"
      aria-labelledby="boka-heading"
      className={`${sectionClass} bg-white`}
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <div className="md:col-span-5">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            Bóka tíma
          </p>
          <h2
            id="boka-heading"
            className="mt-3 font-serif text-4xl text-forest md:text-5xl"
          >
            Við finnum tíma sem hentar.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
            Virkir dagar, helgi eða eftir vinnu. Þú sendir línu og við höfum
            samband innan 48 klukkustunda. Frá mælingu eru það venjulega 4–6
            vikur.
          </p>
          <p className="mt-6 text-sm text-ink/55">
            Eða skrifaðu beint á{" "}
            <a
              href={`mailto:${brand.email}`}
              className="text-forest underline-offset-4 hover:underline"
            >
              {brand.email}
            </a>
            .
          </p>
        </div>
        <div className="bg-cream p-6 md:col-span-7 md:p-10">
          <InquiryForm kind="booking" />
        </div>
      </div>
    </section>
  );
}

export function SersaumurSpurningar() {
  return (
    <section
      id="spurningar"
      aria-labelledby="spurningar-heading"
      className={`${sectionClass} bg-cream`}
    >
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Algengar spurningar
        </p>
        <h2
          id="spurningar-heading"
          className="mt-3 font-serif text-4xl text-forest md:text-5xl"
        >
          Það sem flestir spyrja.
        </h2>
        <div className="mt-10">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group border-t border-forest/10 py-5 last:border-b"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-xl text-forest md:text-2xl">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-lg leading-none text-forest/40 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl pr-10 text-[15px] leading-relaxed text-ink/70">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

