export function SersaumurFeature() {
  return (
    <section aria-label="Sérsaumur" className="bg-white">
      <img
        src="/images/studio/garment-bag-hold.jpg"
        alt="Fatapoki Tjé Tjé"
        className="block w-full"
      />
      <div className="flex flex-col items-center px-8 py-14 text-center md:px-16 md:py-16">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Sérsaumur
        </p>
        <h2 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
          Saumað eftir þér.
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
          Jakkaföt, jakkar og skyrtur eftir þínum mælingum. Þú velur efni,
          snið og smáatriði, við tökum nákvæmar mælingar og saumum fötin sem
          sitja eins og þau eiga að sitja. Ferlið tekur 4–6 vikur.
        </p>
        <a
          href="/sersaumur"
          className="mt-8 inline-flex h-12 w-fit items-center bg-forest px-8 text-sm text-white transition-colors hover:bg-forest-mid"
        >
          Skoða
        </a>
      </div>
    </section>
  );
}
