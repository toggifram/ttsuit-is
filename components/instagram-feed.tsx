import { Instagram } from "lucide-react";

import { brand } from "@/lib/site";

const posts = [
  { src: "/images/studio/allar-vorur.jpg", alt: "Tjé Tjé poki og prjón" },
  { src: "/images/studio/navy-shawl.jpg", alt: "Navy cardigan" },
  { src: "/images/studio/bindi.jpg", alt: "Bindi" },
  { src: "/images/studio/yfirhafnir.jpg", alt: "Yfirhöfn" },
  { src: "/images/studio/olive-zip.jpg", alt: "Olive peysa" },
  { src: "/images/studio/taupe-cardigan.jpg", alt: "Taupe cardigan" },
];

export function InstagramFeed() {
  return (
    <section className="bg-white" aria-label="Instagram">
      <div className="mx-auto max-w-[1440px] px-5 py-12 text-center md:px-10 md:py-14">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Instagram
        </p>
        <a
          href={brand.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-serif text-3xl text-forest transition-colors hover:text-forest-mid md:text-4xl"
        >
          <Instagram className="size-6" strokeWidth={1.25} />
          @ttsuitisland
        </a>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/55">
          Nýjar línur, mælingar og baksvið. Fylgdu okkur — straumurinn tengist
          beint við Instagram þegar aðgangur er tilbúinn.
        </p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6">
        {posts.map((post) => (
          <a
            key={post.src}
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-[#ebe6dc]"
          >
            <img
              src={post.src}
              alt={post.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest/0 text-white opacity-0 transition-all duration-300 group-hover:bg-forest/35 group-hover:opacity-100">
              <Instagram className="size-6" strokeWidth={1.25} />
              <span className="sr-only">Opna Instagram</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
