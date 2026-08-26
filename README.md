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
- Sérsaumur: ferli og verðskrá
- Verslun: Shopify-staðgengill (vörur og greiðsla koma síðar)
- Um okkur og hafa samband / bóka mælingu
- Póstlisti og form með staðfestingu (póstur er ekki sendur sjálfkrafa í þessari prufu)

## Litir og merki

- Haus: `#043034` (grænt úr merkinu), hvítt skriftarlogo og hvítir stafir
- Fótur: sami græni, hvítt merki
- Yfirborð: hvítt, kampanje-myndir frá brún til brúnar
- Logo: *Tjé Tjé* skriftarmerki (SVG)

## Shopify

Forsíðan sýnir fimm vörur í einu (með örvum) og síðan, beint fyrir ofan fótinn, **sex flokkamyndir** (2×3) með „Versla núna“ og flokksheitinu. Smellur opnar vörur þess flokks.

1. Í Shopify Admin: **Settings → Apps and sales channels → Develop apps**
2. Búðu til app, opnaðu **Storefront API**, og veittu `unauthenticated_read_product_listings` (og `read_products` ef það er í boði)
3. Afritaðu **Storefront API access token**
4. Settu í `.env.local`:

```
SHOPIFY_STORE_DOMAIN=tje-tje.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_…
```

Án tókans notar sleðinn staðbundnar vörur úr ljósmyndum svo útlitið sé tilbúið.

## Shopify síðar

`/verslun` er undirbúin sem vöruyfirlit. Þegar Shopify-verslunin er tilbúin er hægt að tengja vörulista og greiðslu beint inn á þá síðu.

## Tæknin

Next.js, TypeScript, Tailwind CSS og shadcn/ui.

Netfang: ttsuit@ttsuit.is
