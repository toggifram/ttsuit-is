# Tjé Tjé — ttsuit.is

Nútímaleg heimasíða fyrir **Tjé Tjé** (áður TT suit): sérsaumur og tilbúinn herrafatnaður. Forsíðan er byggð upp í kampanje-stíl eins og Suitsupply — fullbreiddar ljósmyndir, grænn haus og fótur úr merkinu.

## Keyra staðbundið

```bash
npm install
npm run dev
```

Síðan opnast á [http://127.0.0.1:4318](http://127.0.0.1:4318).

### Viðhald

Á Netlify: `MAINTENANCE_MODE=true` læsir síðunni með textanum „Við erum að uppfæra síðuna hjá okkur.“ `MAINTENANCE_BYPASS` opnar forskoðun á `/opna?kodi=…`. Taktu `MAINTENANCE_MODE` af og deploy-aðu þegar síðan á að opna. Local (`npm run dev`) er **aldrei** læst, jafnvel þó `MAINTENANCE_MODE` sé sett.

Við breytum **alltaf local fyrst**. Þegar þú ert sáttur biðurðu um að setja á vefinn.

## Prufusíða

[https://ttsuit-is.netlify.app](https://ttsuit-is.netlify.app) — **nýtt** Netlify-site á Skellur-aðganginum, **ekki** tengt fram.is (`www.nytt.fram.is` er óhreyft).

## Síður

| Slóð | Hvað |
| --- | --- |
| `/` | Forsíða |
| `/sersaumur` | Sérsaumur (einn síða). Drop-down fer á akkeri: `#ferlid` `#efnin` `#verdskra` `#reiknivel` `#boka-tima` `#spurningar` |
| `/verslun` | Allar vörur |
| `/verslun/peysur` · `/bindi` · `/yfirhafnir` · `/fylgihluti` · `/gjafabref` | Flokkar |
| `/verslun/vara/[handle]` | Vörusíða |
| `/kassi` | Sending og greiðsla |
| `/hafa-samband` | Hafa samband |
| `/um-okkur` | Um TT |
| `/skilmalar` | Skilmálar |
| `/vafrakokur` | Vafrakökur |

## GitHub og Netlify

Sama GitHub- og Netlify-aðgangur og fram.is, en **sér repo og sér site**. Prufusíðan er [ttsuit-is.netlify.app](https://ttsuit-is.netlify.app). Auto-publish frá git er slökkt — við deploy-um þegar þú biður um það.

Shopify, Mailchimp, Google Analytics og Meta Pixel eru stillt sem environment variables á Netlify-site-inu. Leyndarmál og mælingaraðkenni fara **aldrei** í git. Google Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) og Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`) hlaðast **aðeins** eftir að gestur samþykkir vafrakökur.

## Hvað er innifalið

- Forsíða með sérsaum og tilbúnum fötum
- Sérsaumur: ferli, efni, verðskrá og bókun
- Verslun með vörusíðum (`/verslun/vara/[handle]`), sóttum úr Shopify Admin API
- Footer: Vefverslun (flokkar), Sérsaumur (undirsíður), Við (Um TT, hafa samband, skilmálar, netfang)
- Póstlisti tengdur Mailchimp (listinn „TT suit“)

## Litir og merki

- Haus: `#043034` (grænt úr merkinu), merkið í miðju. Sérsaumur og Vefverslun þétt til vinstri, Hafa samband og Um okkur þétt til hægri. Leit og karfa lengst til hægri.
- Fótur: sami græni, hvítt merki
- Yfirborð: hvítt, kampanje-myndir frá brún til brúnar
- Logo: *Tjé Tjé* skriftarmerki (SVG)

## Shopify

Vörur, sending og greiðsla koma **ekki** allar með sama API.

| Hvað | API | Þar sem þú stillir þetta |
| --- | --- | --- |
| Vörur, myndir, verð | Admin API (`read_products`) | Products í Shopify |
| Karfa → kassi | Storefront Cart API | Custom app, Storefront |
| Sending | Shopify Checkout | **Settings → Shipping and delivery** (zone) |
| Greiðsla | Shopify Checkout → **Teya** | **Settings → Payments** (Teya Payments) |
| Birgðir | Admin API | **Products → Inventory** á hverju afbrigði |

Síðan sýnir vörurnar, körfuna og **kassa** á `/kassi`. Þegar heimilisfang er sett inn birtast sendingarleiðir í kremaða kassanum ofan við pöntunina — þær koma úr Shopify eftir zone (t.d. Domestic á Íslandi). **Greiða með Teya** opnar Shopify-kassann, þar sem Teya tekur við Visa, Mastercard, Apple Pay og Google Pay. Shopify leyfir ekki að taka við kortanúmerum á utanaðkomandi síðu. Ef Online Store er lykilorðslæst opnar kassinn Teya í gegnum Shopify-reikning (draft invoice) svo greiðslan nái samt í gegn.

Birgðir eru lesnar úr Shopify. Þegar afbrigði (t.d. Dökkblár / L) er komið niður í 0 er stærðin uppseld og ekki hægt að setja hana í körfu. Shopify dregur svo úr lagerinu við pöntun.

### 1. Vörur — Admin API

Online Store má vera lokuð á meðan við sækjum vörur.

1. **Settings → Apps and sales channels → Develop apps**
2. **Create an app** — t.d. „Tjé Tjé vefur“
3. Admin API scopes: `read_products` (og `write_draft_orders` sem varaleið fyrir kassa)
4. Install app og afritaðu **Admin API access token** (`shpat_…`)

```
SHOPIFY_STORE_DOMAIN=tje-tje.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_…
```

### 2. Sending og greiðsla — Storefront kassi

1. Á sama app: opnaðu **Storefront API** og veittu `unauthenticated_read_product_listings`, `unauthenticated_read_checkouts` og `unauthenticated_write_checkouts` (eða `carts` ef Shopify sýnir það)
2. Afritaðu **Storefront API access token**
3. Stilltu sendingu og greiðslu í Shopify Admin eins og venjulega
4. Settu í `.env.local`:

```
SHOPIFY_STOREFRONT_ACCESS_TOKEN=…
```

### 3. Lykilorð, kassi og redirect

Shopify-kassinn (`/cart/c/…`) opnast **ekki** á meðan Online Store er lykilorðslæst — slóðin fer á **Opening soon**. Shopify leyfir heldur ekki að breyta **Halda áfram að versla** á þakkar-síðunni beint; slóðin er verslunin á `tje-tje.myshopify.com`.

Lausnin er tvö skref í Shopify Admin (API-ið getur hvorki slökkt á lykilorði né skrifað þema án `write_themes`):

1. [Online Store → Preferences](https://admin.shopify.com/store/tje-tje/online_store/preferences) — taktu hakið af **Restrict store access with a password** → Save.
2. [Online Store → Themes](https://admin.shopify.com/store/tje-tje/themes) — **Add theme** → **Upload zip file** → `shopify/ttsuit-redirect-theme.zip` → **Publish**.

Þá fer `tje-tje.myshopify.com` og **Halda áfram að versla** á [www.ttsuit.is](https://www.ttsuit.is). Greiðslan á `/checkouts/…` verður áfram á Shopify. Nánar í `shopify/README.md`.

Án tókans notar síðan staðbundnar vörur og **Hafa samband** í stað kassa.

### Gjafabréf sem PDF

Kaupandi fær **nýtt PDF** af sniðmátinu sem passar við upphæðina (2.500, 5.000, 7.500, 10.000 eða sérsaumaða skyrtu). Kóðinn er stimplaður í hvíta reitinn undir „Kóði“. Skjölin eru í `gift-cards/templates/`.

Við greiðslu (Shopify-reikningur) býr vefurinn til kóðann, setur hann á nýtt skjal, hýsir PDF-ið og sendir slóðina á netfang kaupanda (og afrit á ttsuit@ttsuit.is). Kóðinn er innleystur í kassanum á ttsuit.is. Shopify Plus-gjafabréfa-API er ekki í boði á þessum reikningi, svo kóðinn er okkar eigið gjafabréf — ekki sjálfvirki kóðinn sem Shopify myndi búa til.

Local má opna prufu: [http://127.0.0.1:4318/api/gift-cards/preview?template=2500](http://127.0.0.1:4318/api/gift-cards/preview?template=2500) (`5000`, `7500`, `10000`, `skyrta`).

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

`/verslun` er vöruyfirlit. Hver vara hefur síðu á `/verslun/vara/[handle]`. Með Admin-tóka koma vörur úr Shopify. Með Storefront-tóka fer **Ganga frá kaupum** á Shopify-kassann (sending + greiðsla).

## Tæknin

Next.js, TypeScript, Tailwind CSS og shadcn/ui.

Netfang: ttsuit@ttsuit.is
