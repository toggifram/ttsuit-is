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

export async function FooterInstagram() {
  const feed = await getInstagramFeed(6);
  const posts = feed.posts.length ? feed.posts : fallbackPosts;
  const handle = `@${feed.username}`;
  const profile = `https://www.instagram.com/${feed.username}/`;

  return (
    <div className="w-full max-w-[14.5rem] md:ml-auto">
      <p className="text-[11px] tracking-[0.22em] text-white/45 uppercase">
        Instagram
      </p>
      <a
        href={profile}
        target="_blank"
        rel="noreferrer"
        className="mt-1.5 inline-flex items-center gap-2 font-serif text-xl text-white transition-colors hover:text-white/80"
      >
        <InstagramMark className="size-4" />
        {handle}
      </a>
      <p className="mt-1.5 text-[12px] leading-snug text-white/55">
        Nýjar línur, mælingar og baksvið — beint af Instagram.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.href}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square overflow-hidden bg-white/10"
          >
            <img
              src={post.src}
              alt={post.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
            />
            <span className="sr-only">Opna Instagram</span>
          </a>
        ))}
      </div>
    </div>
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
