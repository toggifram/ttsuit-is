export const brand = {
  name: "Tjé Tjé",
  legalName: "Vendipunktur ehf.",
  tagline: "Stíllinn er eilífur",
  email: "ttsuit@ttsuit.is",
  instagram: "https://www.instagram.com/ttsuitisland/",
  facebook: "https://www.facebook.com/ttsuitisland",
  domain: "ttsuit.is",
};

export const nav = [
  { href: "/sersaumur", label: "Sérsaumur" },
  { href: "/sersaumur", label: "Jakkaföt" },
  { href: "/sersaumur", label: "Jakkar" },
  { href: "/verslun", label: "Skyrtur" },
  { href: "/verslun", label: "Fylgihlutir" },
] as const;

export const footerNav = [
  { href: "/sersaumur", label: "Sérsaumur" },
  { href: "/verslun", label: "Vefverslun" },
  { href: "/um-okkur", label: "Um okkur" },
  { href: "/hafa-samband", label: "Hafa samband" },
  { href: "/hafa-samband#bokun", label: "Bóka mælingu" },
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
