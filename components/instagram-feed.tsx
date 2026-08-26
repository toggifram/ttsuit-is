import { brand } from "@/lib/site";
import { getInstagramFeed, type InstagramPost } from "@/lib/behold";

const fallbackPosts: InstagramPost[] = [
  {
    id: "allar-vorur",
    src: "/images/studio/allar-vorur.jpg",
    href: brand.instagram,
    alt: "Tjé Tjé poki og prjón",
  },
  {
    id: "navy-shawl",
    src: "/images/studio/navy-shawl.jpg",
    href: brand.instagram,
    alt: "Navy cardigan",
  },
  {
    id: "bindi",
    src: "/images/studio/bindi.jpg",
    href: brand.instagram,
    alt: "Bindi",
  },
  {
    id: "yfirhafnir",
    src: "/images/studio/yfirhafnir.jpg",
    href: brand.instagram,
    alt: "Yfirhöfn",
  },
  {
    id: "olive-zip",
    src: "/images/studio/olive-zip.jpg",
    href: brand.instagram,
    alt: "Olive peysa",
  },
  {
    id: "taupe-cardigan",
    src: "/images/studio/taupe-cardigan.jpg",
    href: brand.instagram,
    alt: "Taupe cardigan",
  },
];

export async function InstagramFeed() {
  const feed = await getInstagramFeed(6);
  const posts = feed.posts.length ? feed.posts : fallbackPosts;
  const handle = `@${feed.username}`;
  const profile = `https://www.instagram.com/${feed.username}/`;

  return (
    <section className="bg-white pb-4" aria-label="Instagram">
      <div className="mx-auto max-w-[1440px] px-5 py-12 text-center md:px-10 md:py-14">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Instagram
        </p>
        <a
          href={profile}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2.5 font-serif text-3xl text-forest transition-colors hover:text-forest-mid md:text-4xl"
        >
          <InstagramMark className="size-6" />
          {handle}
        </a>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/55">
          Nýjar línur, mælingar og baksvið — beint af Instagram.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-white md:grid-cols-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.href}
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
              <InstagramMark className="size-6" />
              <span className="sr-only">Opna Instagram</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
