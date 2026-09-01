# Tjé Tjé — ttsuit.is

Nútímaleg heimasíða fyrir **Tjé Tjé** (áður TT suit): sérsaumur og tilbúinn herrafatnaður. Forsíðan er byggð upp í kampanje-stíl eins og Suitsupply — fullbreiddar ljósmyndir, grænn haus og fótur úr merkinu.

## Keyra staðbundið

```bash
npm install
npm run dev
```

Síðan opnast á [http://127.0.0.1:4318](http://127.0.0.1:4318).

## Hvað er innifalið

- Forsíða með sérsaum og tilbúnum fötum
- Sérsaumur: ferli, efni, verðskrá og bókun
- Verslun með vörusíðum (`/verslun/vara/[handle]`), tengdum Shopify þegar tóki er settur
- Um okkur og hafa samband / bóka mælingu
- Póstlisti tengdur Mailchimp (listinn „TT suit“)

## Litir og merki

- Haus: `#043034` (grænt úr merkinu), merkið í miðju. Sérsaumur og Vefverslun þétt til vinstri, Hafa samband og Um okkur þétt til hægri. Leit og karfa lengst til hægri.
- Fótur: sami græni, hvítt merki
- Yfirborð: hvítt, kampanje-myndir frá brún til brúnar
- Logo: *Tjé Tjé* skriftarmerki (SVG)

## Shopify

Forsíðan sýnir fimm vörur í einu (með örvum) og síðan **sex flokkamyndir** (2×3) með „Versla núna“. Smellur á vöru opnar vörusíðu hér á síðunni: `/verslun/vara/[handle]`.

Vörusíðan sýnir myndir, verð, lýsingu og stærðir. Ef Shopify er tengt fer **Kaupa** á Shopify-vörusíðuna (greiðsla er enn í Shopify). Án tókans eru notaðar staðbundnar vörur úr ljósmyndum og kaup fara í gegnum **Hafa samband**.

`tje-tje.myshopify.com` er núna **lykilorðslæst** (Online Store channel locked). Þá svarar Storefront API ekki, jafnvel með tóka, fyrr en verslunin er opnuð.

1. Í Shopify Admin: **Settings → Apps and sales channels → Develop apps**
2. Búðu til app, opnaðu **Storefront API**, og veittu `unauthenticated_read_product_listings`
3. Afritaðu **Storefront API access token** (ekki Admin-tókann sem byrjar á `shpat_`)
4. Taktu lykilorðið af Online Store svo rásin sé ekki læst
5. Settu í `.env.local`:

```
SHOPIFY_STORE_DOMAIN=tje-tje.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=…
```

Án tókans (eða með læstri verslun) notar síðan staðbundnar vörur svo útlitið sé tilbúið.

## Mailchimp

Póstlistinn í fætinum og sprettiglugganum skráir netföng á **TT suit** listann.

Settu í `.env.local`:

```
MAILCHIMP_API_KEY=…-us9
MAILCHIMP_AUDIENCE_ID=…
```

Audience ID finnur þú í Mailchimp undir Audience → Settings, eða með API (`GET /3.0/lists`). Án lykilsins virðist formið en skráningin fer ekki inn.

## Hafa samband og bókun

Formin á `/hafa-samband` og `/sersaumur` (bókun mælingar) senda póst á **ttsuit@ttsuit.is**. Gesturinn fer ekki á Mailchimp-póstlistann.

## Verslun

`/verslun` er vöruyfirlit. Hver vara hefur síðu á `/verslun/vara/[handle]`. Þegar Storefront-tókinn er settur og Online Store opnuð koma vörur, myndir og verð beint úr Shopify.

## Tæknin

Next.js, TypeScript, Tailwind CSS og shadcn/ui.

Netfang: ttsuit@ttsuit.is
