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
  const profile = `https://www.instagram.com/${feed.username}/`;

  return (
    <div className="w-full max-w-[13.75rem] md:ml-auto">
      <a
        href={profile}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-white/45 hover:text-white"
      >
        Instagram
      </a>
      <div className="mt-2.5 grid grid-cols-3 gap-1">
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
