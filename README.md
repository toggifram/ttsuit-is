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
- Verslun með vörusíðum (`/verslun/vara/[handle]`), sóttum úr Shopify Admin API
- Um okkur og hafa samband / bóka mælingu
- Póstlisti tengdur Mailchimp (listinn „TT suit“)

## Litir og merki

- Haus: `#043034` (grænt úr merkinu), merkið í miðju. Sérsaumur og Vefverslun þétt til vinstri, Hafa samband og Um okkur þétt til hægri. Leit og karfa lengst til hægri.
- Fótur: sami græni, hvítt merki
- Yfirborð: hvítt, kampanje-myndir frá brún til brúnar
- Logo: *Tjé Tjé* skriftarmerki (SVG)

## Shopify

Online Store má vera **lokuð almenningi** (lykilorð á `tje-tje.myshopify.com`). Síðan sækir vörur með **Admin API**, ekki opinni vefverslun Shopify.

Smellur á vöru opnar `/verslun/vara/[handle]` hér. Nýjar vörur sem þú setur inn í Shopify birtast sjálfkrafa (síðan sækir listann upp á nýtt við hverja heimsókn). Kaup fara í gegnum **Hafa samband** á meðan Shopify-verslunin er lokuð.

### Tengja Admin API

1. Í Shopify Admin: **Settings → Apps and sales channels → Develop apps**
2. Leyfðu custom apps ef Shopify biður um það
3. **Create an app** — t.d. „Tjé Tjé vefur“
4. **Configure Admin API scopes** → hakaðu við `read_products` → Save
5. **Install app**
6. Afritaðu **Admin API access token** (byrjar á `shpat_`). Hann sýnist bara einu sinni.
7. Settu í `.env.local`:

```
SHOPIFY_STORE_DOMAIN=tje-tje.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_…
```

Endurræstu `npm run dev`. Vörur, myndir, verð og lýsing koma þá beint úr Shopify.

Án tókans notar síðan staðbundnar vörur úr ljósmyndum.

Ef þú vilt síðar opna Shopify-verslunina og láta **Kaupa** fara þangað: settu `SHOPIFY_PUBLIC_CHECKOUT=true`.

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

`/verslun` er vöruyfirlit. Hver vara hefur síðu á `/verslun/vara/[handle]`. Með Admin-tóka koma vörur, myndir og verð beint úr Shopify — þótt Online Store sé lokuð.

## Tæknin

Next.js, TypeScript, Tailwind CSS og shadcn/ui.

Netfang: ttsuit@ttsuit.is
