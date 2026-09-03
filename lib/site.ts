export const brand = {
  name: "Tjé Tjé",
  legalName: "Vendipunktur ehf.",
  tagline: "Stíllinn er eilífur",
  email: "ttsuit@ttsuit.is",
  instagram: "https://www.instagram.com/ttsuitisland/",
  facebook: "https://www.facebook.com/ttsuitisland",
  tiktok: "https://www.tiktok.com/@ttsuitisland",
  domain: "ttsuit.is",
};

export function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    `https://${brand.domain}`;
  return raw.replace(/\/$/, "");
}

export function isProductionSite() {
  return siteUrl() === `https://${brand.domain}`;
}

export const navLeft = [
  { href: "/sersaumur", label: "Sérsaumur" },
  { href: "/verslun", label: "Vefverslun" },
] as const;

export const sersaumurMenu = [
  { href: "/sersaumur#ferlid", hash: "ferlid", label: "Ferlið" },
  { href: "/sersaumur#efnin", hash: "efnin", label: "Efnin" },
  { href: "/sersaumur#verdskra", hash: "verdskra", label: "Verðskrá" },
  { href: "/sersaumur#reiknivel", hash: "reiknivel", label: "Reiknivél" },
  { href: "/sersaumur#boka-tima", hash: "boka-tima", label: "Bóka tíma" },
  {
    href: "/sersaumur#spurningar",
    hash: "spurningar",
    label: "Algengar spurningar",
  },
] as const;

export const navRight = [
  { href: "/hafa-samband", label: "Hafa samband" },
  { href: "/um-okkur", label: "Um okkur" },
] as const;

export const socialLinks = [
  { href: "https://www.facebook.com/ttsuitisland", label: "Facebook" },
  { href: "https://www.instagram.com/ttsuitisland/", label: "Instagram" },
  { href: "https://www.tiktok.com/@ttsuitisland", label: "TikTok" },
] as const;

export const nav = [...navLeft, ...navRight];

export const footerWe = [
  { href: "/um-okkur", label: "Um TT" },
  { href: "/hafa-samband", label: "Hafa samband" },
  { href: "/skilmalar", label: "Skilmálar" },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Bókaðu tíma",
    text: "Þú sendir línu og við finnum tíma sem hentar — virka daga, um helgi eða þegar þú ert laus.",
  },
  {
    n: "02",
    title: "Mæling",
    text: "Við tökum nákvæmar mælingar og ræðum hvernig þú vilt hafa fittið. Þétt að, klassískt eða með meira rými.",
  },
  {
    n: "03",
    title: "Efni og útlit",
    text: "Þú velur efni, snið, hnappa, fóður og smáatriði. Ef þú spyrð hvað mér finnst, svara ég hreint út.",
  },
  {
    n: "04",
    title: "Mátun",
    text: "Fötin koma heim. Þú mátar. Ef eitthvað þarf að hnika til er besta saumastofa bæjarins með okkur í liði.",
  },
  {
    n: "05",
    title: "Bingó",
    text: "Þú klæðist fötum sem voru gerð fyrir þig. Ef þú ert ánægður, segðu öllum. Ef þú ert óánægður, segðu mér!",
  },
];

export const categories = [
  {
    href: "/verslun",
    title: "Peysur",
    image: "/images/studio/brown-zip.jpg",
    alt: "Prjónapeysa",
  },
  {
    href: "/verslun",
    title: "Cardigan",
    image: "/images/studio/navy-shawl.jpg",
    alt: "Cardigan",
  },
  {
    href: "/verslun",
    title: "Polo",
    image: "/images/studio/black-polo.jpg",
    alt: "Prjóna-polo",
  },
  {
    href: "/verslun",
    title: "Prjón",
    image: "/images/studio/taupe-cardigan.jpg",
    alt: "Zip cardigan",
  },
];

export const priceTiers = [
  "Flokkur 1",
  "Flokkur 2",
  "Flokkur 3",
  "Flokkur 4",
  "Flokkur 5*",
  "Flokkur 6*",
] as const;

export const garmentPrices = [
  { name: "Jakkaföt", amounts: [89990, 99990, 114990, 135990, 145990, 155990] },
  { name: "Jakki", amounts: [59990, 68990, 84990, 94990, 103990, 107990] },
  { name: "Buxur", amounts: [38990, 42990, 44990, 49990, 54990, 57990] },
  { name: "Vesti", amounts: [26990, 28990, 30990, 34990, 36990, 38990] },
  { name: "3 setta föt", amounts: [116980, 128980, 145980, 170980, 182980, 194980] },
] as const;

export const accessoryPrices = [
  { name: "Skyrta", amounts: [22990, 28990] },
  { name: "Axlabönd", amounts: [9990] },
  { name: "Bindi", amounts: [9990, 12990] },
  { name: "Slaufa", amounts: [6490] },
  { name: "Klútur", amounts: [6490] },
  { name: "Hálsklútur", amounts: [7990] },
  { name: "Armbönd", amounts: [3990, 5990] },
] as const;

export const priceNotes = [
  "Hálf striguð jakkaföt (e. Half canvas) +10.990 kr.",
  "Full striguð jakkaföt (e. Full canvas) +16.990 kr.",
  "*Hálfur strigi innifalinn (Flokkur 5 og 6)",
  "Flýtismeðferð +20%",
] as const;

export const prices = [
  {
    name: "Jakki",
    from: "59.990 kr.",
    note: "Jakkar eru undirstaðan. Þú ræður ferðinni hvað varðar útlit, hönnun og snið.",
  },
  {
    name: "Buxur",
    from: "38.990 kr.",
    note: "Buxur eru ekki bara buxur. Hér getur þú meðal annars ákveðið hvort beltagöt séu óþarfi.",
  },
  {
    name: "Vesti",
    from: "26.990 kr.",
    note: "Ekki allir sem fíla sig í vesti. Hins vegar er gott vesti gulls ígildi.",
  },
  {
    name: "Skyrta",
    from: "22.990 kr.",
    note: "Yfir þúsund skyrtuefni — allir ættu að geta fundið sér skyrtu við hæfi.",
  },
  {
    name: "Fylgihlutir",
    from: "6.490 kr.",
    note: "Bindi, slaufur, axlabönd, hefðarklútar, armbönd og brjóstklútar.",
  },
];

export const packages = [
  {
    name: "Eitt sett",
    from: "89.990 kr.",
    items: "Þetta klassíska: jakki og buxur sem virka fyrir öll betri tilefni.",
  },
  {
    name: "Heilög þrenna",
    from: "116.980 kr.",
    items: "Jakki, buxur og vesti. Gott að eiga vestið þó það sé ekki alltaf nauðsyn.",
  },
  {
    name: "Klár í slaginn",
    from: "139.970 kr.",
    items: "Jakki, buxur, vesti og skyrta. Þú ert klár í slaginn.",
  },
  {
    name: "Allur pakkinn",
    from: "159.990 kr.",
    items: "Fyrir þá sem nenna ekki að flækja hlutina: jakki, buxur, vesti, skyrta, bindi, klútur og armband.",
  },
  {
    name: "Smáatriði",
    from: "10.000 kr.",
    items: "Velur þrjá fylgihluti og færð þá á 20% afslætti.",
  },
  {
    name: "Sex(ý) skyrtum",
    from: "99.950 kr.",
    items: "Fáðu sex skyrtur á verði fimm.",
  },
];

export const giftCards = [
  { name: "Gjafabréf", price: "4.032 kr." },
  { name: "Gjafabréf", price: "8.065 kr." },
  { name: "Gjafabréf", price: "40.323 kr." },
  { name: "Gjafabréf", price: "80.645 kr." },
];

export const fabrics = [
  {
    name: "Ull",
    note: "Ítalía, England og Skotland",
    text: "Klassíkin. Heldur formi, andar og eldist fallega — frá léttum Super 120s til þykkari vetrarullar.",
    image: "/images/studio/navy-detail.jpg",
  },
  {
    name: "Hör",
    note: "Sumar og hlýtt veður",
    text: "Létt, hrukkuð á réttan hátt og köld á húðinni. Fyrir þá sem vilja jakkaföt sem anda í júní.",
    image: "/images/studio/charcoal-back.jpg",
  },
  {
    name: "Flannel og tweed",
    note: "Haust og vetur",
    text: "Mýkri áferð, meiri karakter. Gott þegar þú vilt að fötin séu áberandi án þess að vera hátíðleg.",
    image: "/images/studio/brown-back.jpg",
  },
  {
    name: "Skyrtuefni",
    note: "Bómull, lín og blöndur",
    text: "Hundruð lita og mynstra. Þú velur kraga, manséttur og hvort nafnið þitt fari undir kragann.",
    image: "/images/studio/navy-logo.jpg",
  },
] as const;

export const faqs = [
  {
    q: "Hversu langan tíma tekur sérsaumur?",
    a: "Frá mælingu eru það venjulega 4–6 vikur þar til fötin koma heim. Brúðkaup og aðrir fastir dagar: sendu línu snemma og við finnum leið.",
  },
  {
    q: "Þarf ég að koma í mælingu?",
    a: "Já. Kjarninn er nákvæm mæling — brjóst, mitti, axlir og hvernig þú stendur. Við ræðum líka hvernig þú vilt að fötin sitji: þétt að, klassískt eða með meira rými.",
  },
  {
    q: "Get ég valið allt sjálfur?",
    a: "Já. Efni, snið, vasagerð, hnappa, fóður og saumfar. Ef þú spyrð hvað mér finnst, svara ég hreint út — en lokaorðið er þitt.",
  },
  {
    q: "Hvað kostar þetta?",
    a: "Jakki frá 59.990 kr., buxur frá 38.990 kr. og heilt sett frá 89.990 kr. Verð flokkast eftir efnisvali (flokkur 1–6). Við förum yfir þetta í mælingu, án pressu.",
  },
  {
    q: "Gildir 15% afslátturinn á sérsaum?",
    a: "Nei. Afsláttur póstlistans gildir á gjafabréf og tilbúinn fatnað, ekki á sérsaum.",
  },
  {
    q: "Hvað ef fötin passa ekki alveg?",
    a: "Þú mátar þegar þau koma. Ef eitthvað þarf að hnika til er besta saumastofa bæjarins með okkur í liði. Markmiðið er að þú farir sáttur út.",
  },
  {
    q: "Hvar og hvenær er mæling?",
    a: "Við finnum tíma sem hentar — virka daga, um helgi eða þegar þú ert laus. Þú sendir línu og við höfum samband innan 48 klukkustunda.",
  },
];

export const testimonials = [
  {
    quote:
      "Ég pantaði tíma í mælingu, fötin komu, pössuðu og ég mjög sáttur.",
    name: "Aron Jóhannsson",
  },
  {
    quote:
      "Fagleg og góð þjónusta hjá mínum manni. Mörg efni og það á góðu verði.",
    name: "Bergsveinn Ólafsson",
  },
  {
    quote:
      "Mig vantaði ný jakkaföt. Virkilega sáttur með útkomuna. Mæli 100% með.",
    name: "Jón Dagur Þorsteinsson",
  },
];
