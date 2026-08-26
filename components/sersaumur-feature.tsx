import Link from "next/link";

export function SersaumurFeature() {
  return (
    <section aria-label="Sérsaumur" className="bg-white px-2 py-2">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden bg-[#ebe6dc] md:min-h-[560px]">
          <img
            src="/images/studio/suit-bag.jpg"
            alt="Sérsaumuð jakkaföt og fatapoki Tjé Tjé"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col justify-center bg-cream px-8 py-14 md:px-16 md:py-20">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            Sérsaumur
          </p>
          <h2 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
            Saumað eftir þér.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
            Jakkaföt, jakkar og skyrtur eftir þínum mælingum. Þú velur efni,
            snið og smáatriði — við tökum nákvæmar mælingar og saumum fötin
            sem sitja eins og þau eiga að sitja. Ferlið tekur 4–6 vikur.
          </p>
          <Link
            href="/sersaumur"
            className="mt-8 inline-flex h-12 w-fit items-center bg-forest px-8 text-sm text-white transition-colors hover:bg-forest-mid"
          >
            Skoða
          </Link>
        </div>
      </div>
    </section>
  );
}
