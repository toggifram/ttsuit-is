import { productHref, type Product } from "@/lib/product";

const knitSizes = ["S", "M", "L", "XL"];

/** Studio fallback until a Storefront token is set. Mix of categories. */
export const fallbackProducts: Product[] = [
  {
    id: "navy-shawl",
    handle: "navy-shawl-cardigan",
    title: "Navy cardigan með sjal-kraga",
    subtitle: "Þungt prjón · Regular fit",
    category: "peysur",
    href: productHref("navy-shawl-cardigan"),
    image: "/images/studio/navy-shawl.jpg",
    imageAlt: "Navy cardigan",
    images: ["/images/studio/navy-back.jpg", "/images/studio/navy-detail.jpg"],
    price: "24.990 kr.",
    badge: "NÝTT",
    sizes: knitSizes,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Charcoal", hex: "#3d3d3d" },
    ],
    description:
      "Þungur navy cardigan með sjal-kraga og hreinu sniði. Prjónað til að sitja vel yfir skyrtu eða polo — næsta lag yfir allt árið, ekki bara á milli árstíða.",
  },
  {
    id: "olive-zip",
    handle: "olive-quarter-zip",
    title: "Olive quarter-zip peysa",
    subtitle: "Prjónapeysa með rennilás",
    category: "peysur",
    href: productHref("olive-quarter-zip"),
    image: "/images/studio/olive-zip.jpg",
    imageAlt: "Olive zip peysa",
    images: ["/images/studio/brown-zip.jpg"],
    price: "19.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Olive", hex: "#5c5a3a" },
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Brown", hex: "#5c3d2e" },
    ],
    description:
      "Quarter-zip í ólífu, með rennilás sem situr lágt og hreinum kraga. Auðveld peysa að kasta yfir sig — ein og sér eða undir jakka.",
  },
  {
    id: "taupe-cardigan",
    handle: "taupe-zip-cardigan",
    title: "Taupe zip cardigan",
    subtitle: "Cable-knit · Klassískt snið",
    category: "peysur",
    href: productHref("taupe-zip-cardigan"),
    image: "/images/studio/taupe-cardigan.jpg",
    imageAlt: "Taupe cardigan",
    price: "22.990 kr.",
    badge: "NÝTT",
    sizes: knitSizes,
    colors: [
      { name: "Taupe", hex: "#8a7a6b" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Zip cardigan í taupe með cable-knit. Léttari en sjal-kraginn, en jafn klár í vinnuna og helgina.",
  },
  {
    id: "black-polo",
    handle: "black-knit-polo",
    title: "Svart prjóna-polo",
    subtitle: "Rifjað prjón · Hreint snið",
    category: "peysur",
    href: productHref("black-knit-polo"),
    image: "/images/studio/black-polo.jpg",
    imageAlt: "Svart polo",
    images: ["/images/studio/dark-polo.jpg", "/images/studio/charcoal-polo.jpg"],
    price: "14.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Grey", hex: "#6b6b6b" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Svart prjóna-polo með rifjuðum kraga. Grunnvara sem klæðir bæði gallabuxur og snyrtilegri buxur — og þarf ekki skyrtu undir.",
  },
  {
    id: "charcoal-polo",
    handle: "charcoal-polo",
    title: "Charcoal polo",
    subtitle: "Prjón · Regular fit",
    category: "peysur",
    href: productHref("charcoal-polo"),
    image: "/images/studio/charcoal-polo.jpg",
    imageAlt: "Charcoal polo",
    images: ["/images/studio/grey-polo.jpg"],
    price: "14.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Charcoal", hex: "#3d3d3d" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    description:
      "Charcoal polo í sama sniði og það svarta. Daufari litur, sama notagildi — inn á skrifstofu eða út um kvöldið.",
  },
  {
    id: "brown-zip",
    handle: "brown-quarter-zip",
    title: "Brún prjónapeysa",
    subtitle: "Quarter-zip · Cable-knit",
    category: "peysur",
    href: productHref("brown-quarter-zip"),
    image: "/images/studio/brown-zip.jpg",
    imageAlt: "Brún peysa",
    images: ["/images/studio/olive-zip.jpg"],
    price: "19.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Brown", hex: "#5c3d2e" },
      { name: "Olive", hex: "#5c5a3a" },
    ],
    description:
      "Brún quarter-zip með cable-knit. Hlý en ekki þung, og liturinn situr vel með navy og khaki.",
  },
  {
    id: "navy-crew",
    handle: "navy-crewneck",
    title: "Navy crewneck",
    subtitle: "Klassísk peysa án kraga",
    category: "peysur",
    href: productHref("navy-crewneck"),
    image: "/images/studio/navy-crew.jpg",
    imageAlt: "Navy crewneck",
    images: ["/images/studio/navy-back.jpg"],
    price: "16.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Grey", hex: "#6b6b6b" },
    ],
    description:
      "Klassísk navy peysa án kraga. Situr hreint yfir skyrtu og er sú peysa sem flestir eiga of fáar af.",
  },
  {
    id: "grey-polo",
    handle: "grey-knit-polo",
    title: "Grátt prjóna-polo",
    subtitle: "Rifjað prjón",
    category: "peysur",
    href: productHref("grey-knit-polo"),
    image: "/images/studio/grey-polo.jpg",
    imageAlt: "Grátt polo",
    images: ["/images/studio/charcoal-polo.jpg"],
    price: "14.990 kr.",
    badge: "NÝTT",
    sizes: knitSizes,
    colors: [
      { name: "Grey", hex: "#8a8a8a" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Ljósara polo í gráu. Léttara í útliti en charcoal, sama rifjaða prjón og hreina snið.",
  },
  {
    id: "dark-polo",
    handle: "dark-knit-polo",
    title: "Dökkt polo",
    subtitle: "Prjón · Tímalaus grunnvara",
    category: "peysur",
    href: productHref("dark-knit-polo"),
    image: "/images/studio/dark-polo.jpg",
    imageAlt: "Dökkt polo",
    images: ["/images/studio/black-polo.jpg"],
    price: "14.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Forest", hex: "#043034" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Dökkt polo í skógargrænu. Næstum svart í kvöldljósi, en grænt þegar sólin nær því — eins og merkið.",
  },
  {
    id: "navy-logo",
    handle: "navy-tj-peysa",
    title: "Navy peysa með TJ merki",
    subtitle: "Merkið saumað á brjóstið",
    category: "peysur",
    href: productHref("navy-tj-peysa"),
    image: "/images/studio/navy-logo.jpg",
    imageAlt: "Navy peysa með merki",
    images: ["/images/studio/navy-detail.jpg"],
    price: "18.990 kr.",
    sizes: knitSizes,
    colors: [{ name: "Navy", hex: "#1e3a5f" }],
    description:
      "Navy peysa með TJ merkinu saumuðu á brjóstið. Ekki stórt lógó — bara merkið, sem þeir sem þekkja það sjá.",
  },
  {
    id: "navy-back",
    handle: "navy-passform",
    title: "Navy prjónapeysa",
    subtitle: "Sniðið sést best að aftan",
    category: "peysur",
    href: productHref("navy-passform"),
    image: "/images/studio/navy-back.jpg",
    imageAlt: "Bakning af navy peysu",
    images: ["/images/studio/navy-crew.jpg", "/images/studio/navy-shawl.jpg"],
    price: "18.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Charcoal", hex: "#3d3d3d" },
    ],
    description:
      "Navy prjónapeysa með sniði sem situr þétt um axlirnar og fellur hreint niður bakið. Regular fit, ekki oversized.",
  },
  {
    id: "brown-back",
    handle: "brown-crewneck",
    title: "Brún crewneck peysa",
    subtitle: "Þungt prjón · Regular fit",
    category: "peysur",
    href: productHref("brown-crewneck"),
    image: "/images/studio/brown-back.jpg",
    imageAlt: "Brún peysa að aftan",
    images: ["/images/studio/brown-zip.jpg"],
    price: "16.990 kr.",
    sizes: knitSizes,
    colors: [
      { name: "Brown", hex: "#5c3d2e" },
      { name: "Taupe", hex: "#8a7a6b" },
    ],
    description:
      "Brún crewneck í þungu prjóni. Situr vel yfir skyrtu og er sú peysa sem þú tekur með þér þegar þú veist ekki hvað kvöldið verður.",
  },

  {
    id: "navy-dot-tie",
    handle: "navy-dot-bindi",
    title: "Navy bindi með doppum",
    subtitle: "Silki · Klassískt snið",
    category: "bindi",
    href: productHref("navy-dot-bindi"),
    image: "/images/studio/bindi.jpg",
    imageAlt: "Navy bindi með kopar doppum",
    price: "8.990 kr.",
    colors: [
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    description:
      "Navy bindi með kopar doppum. Klassískt snið sem virkar jafnt með navy jakkafötum og brúnum tweed.",
  },
  {
    id: "brown-overshirt",
    handle: "brunn-ullarjakki",
    title: "Brúnn ullarjakki",
    subtitle: "Yfirhöfn · Regular fit",
    category: "yfirhafnir",
    href: productHref("brunn-ullarjakki"),
    image: "/images/studio/yfirhafnir.jpg",
    imageAlt: "Brúnn jakki",
    price: "34.990 kr.",
    badge: "NÝTT",
    sizes: ["46", "48", "50", "52", "54"],
    colors: [
      { name: "Brown", hex: "#5c3d2e" },
      { name: "Navy", hex: "#1e3a5f" },
    ],
    description:
      "Brúnn ullarjakki sem situr milli yfirhafnar og blazers. Regular fit, nægilega hlýr fyrir íslenskt haust og nógu snyrtilegur fyrir vinnuna.",
  },

  {
    id: "gift-card",
    handle: "tt-gjafabref",
    title: "TT gjafabréf",
    subtitle: "Rafrænt · Vefverslun og sérsaumur",
    category: "gjafabref",
    href: productHref("tt-gjafabref"),
    image: "/images/studio/gift-card.jpg",
    imageAlt: "Gjafabréf Tjé Tjé",
    price: "2.500 kr.",
    colors: [],
    sizes: ["2.500 kr.", "5.000 kr.", "7.500 kr.", "10.000 kr."],
    description:
      "Gjafabréf eru rafræn og verða send á kaupandann. Þau má nota í vefversluninni og í sérsaum. Hægt er að púsla saman fleiri en einu gjafabréfi.",
  },
  {
    id: "gift-shirt",
    handle: "sersaumud-skyrta-gjafabref",
    title: "Sérsaumuð skyrta",
    subtitle: "Gjafabréf · Sérsaumur",
    category: "gjafabref",
    href: productHref("sersaumud-skyrta-gjafabref"),
    image: "/images/studio/gift-shirt.jpg",
    imageAlt: "Sérsaumuð skyrta gjafabréf",
    price: "22.990 kr.",
    colors: [],
    sizes: ["22.990 kr."],
    description:
      "Gjafabréf fyrir sérsaumaða skyrtu. Bréfið er rafrænt og verður sent á kaupandann. Viðtakandi bókar mælingu og við saumum skyrtuna.",
  },
];

/** Live Shopify catalog via Admin API (or Storefront), otherwise studio fallback. */
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const { fetchShopifyProducts } = await import("./shopify");
    const live = await fetchShopifyProducts();
    if (live?.length) return live;
  } catch {
    // Password-protected stores and missing tokens fall back below.
  }
  return fallbackProducts;
}

export async function getCatalogProduct(handle: string): Promise<Product | null> {
  try {
    const { fetchShopifyProduct } = await import("./shopify");
    const live = await fetchShopifyProduct(handle);
    if (live) return live;
  } catch {
    // Fall through to the catalog / studio list.
  }
  const all = await getCatalogProducts();
  return all.find((product) => product.handle === handle) ?? null;
}
