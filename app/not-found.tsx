import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-28 text-center">
      <p className="text-[11px] tracking-[0.28em] text-forest/60 uppercase">404</p>
      <h1 className="mt-3 font-serif text-5xl">Síðan fannst ekki</h1>
      <p className="mt-4 text-ink/65">Kannski villtumst við í efnisvalinu.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center bg-forest px-6 text-[11px] tracking-[0.18em] text-white uppercase"
      >
        Aftur á forsíðu
      </Link>
    </section>
  );
}
