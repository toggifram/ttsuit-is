export const BEHOLD_FEED_URL =
  process.env.BEHOLD_FEED_URL ||
  "https://feeds.behold.so/pIsvlqGRNHKANDGACqZK";

export type InstagramPost = {
  id: string;
  src: string;
  href: string;
  alt: string;
};

type BeholdSize = { mediaUrl?: string };
type BeholdPost = {
  id?: string;
  permalink?: string;
  caption?: string;
  prunedCaption?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
  };
};

type BeholdFeed = {
  username?: string;
  posts?: BeholdPost[];
};

function imageUrl(post: BeholdPost) {
  return (
    post.sizes?.medium?.mediaUrl ||
    post.sizes?.large?.mediaUrl ||
    post.sizes?.small?.mediaUrl ||
    post.thumbnailUrl ||
    post.mediaUrl ||
    ""
  );
}

function altText(post: BeholdPost) {
  const caption = (post.prunedCaption || post.caption || "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  return caption || "Instagram";
}

export async function getInstagramFeed(limit = 6): Promise<{
  username: string;
  posts: InstagramPost[];
}> {
  try {
    const res = await fetch(BEHOLD_FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as BeholdFeed;
    const posts = (data.posts ?? [])
      .map((post) => ({
        id: post.id || post.permalink || imageUrl(post),
        src: imageUrl(post),
        href: post.permalink || "https://www.instagram.com/ttsuitisland/",
        alt: altText(post),
      }))
      .filter((post) => post.src)
      .slice(0, limit);
    return {
      username: data.username || "ttsuitisland",
      posts,
    };
  } catch {
    return { username: "ttsuitisland", posts: [] };
  }
}
