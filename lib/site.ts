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

export const navLeft = [
  { href: "/sersaumur", label: "Sérsaumur" },
  { href: "/verslun", label: "Vefverslun" },
] as const;

export const sersaumurMenu = [
  { href: "/sersaumur#ferlid", label: "Ferlið" },
  { href: "/sersaumur#efnin", label: "Efnin" },
  { href: "/sersaumur#verdskra", label: "Verðskrá" },
  { href: "/sersaumur#boka-tima", label: "Bóka tíma" },
  { href: "/sersaumur#spurningar", label: "Algengar spurningar" },
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

export const footerNav = [
  { href: "/sersaumur", label: "Sérsaumur" },
  { href: "/verslun", label: "Vefverslun" },
  { href: "/um-okkur", label: "Um okkur" },
  { href: "/hafa-samband", label: "Hafa samband" },
  { href: "/sersaumur#boka-tima", label: "Bóka mælingu" },
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
    text: "Við tökum nákvæmar mælingar og ræðum hvernig þú vilt að fötin sitji: þétt að, klassískt eða með meira rými.",
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
    text: "Þú klæðist fötum sem voru gerð fyrir þig. Frá mælingu eru það venjulega 4–6 vikur.",
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

export const prices = [
  { name: "Jakki", from: "59.990 kr.", note: "Útlit, hönnun og snið eftir þinni ósk." },
  { name: "Buxur", from: "38.990 kr.", note: "Með eða án beltagata — þú ræður." },
  { name: "Vesti", from: "26.990 kr.", note: "Gott vesti er gulls ígildi þegar tilefnið kallar." },
  { name: "Skyrta", from: "22.990 kr.", note: "Hundruð efna. Við finnum það sem hentar þér." },
  { name: "Fylgihlutir", from: "6.490 kr.", note: "Bindi, slaufur, klútar, axlabönd og armbönd." },
];

export const packages = [
  {
    name: "Eitt sett",
    from: "89.990 kr.",
    items: "Jakki og buxur — klassíkin fyrir öll betri tilefni.",
  },
  {
    name: "Heilög þrenna",
    from: "116.980 kr.",
    items: "Jakki, buxur og vesti.",
  },
  {
    name: "Klár í slaginn",
    from: "139.970 kr.",
    items: "Jakki, buxur, vesti og skyrta.",
  },
  {
    name: "Allur pakkinn",
    from: "159.990 kr.",
    items: "Jakki, buxur, vesti, skyrta, bindi, klútur og armband.",
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
    a: "Jakki frá 59.990 kr., buxur frá 38.990 kr. og heilt sett frá 89.990 kr. Verð flokkast eftir efnisvali. Við förum yfir þetta í mælingu, án pressu.",
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
