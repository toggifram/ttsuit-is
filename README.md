# Tjé Tjé — ttsuit.is

Nútímaleg heimasíða fyrir **Tjé Tjé** (áður TT suit): sérsaumur og tilbúinn herrafatnaður. Forsíðan er byggð upp í kampanje-stíl eins og Suitsupply — fullbreiddar ljósmyndir, grænn haus og fótur úr merkinu.

## Keyra staðbundið

```bash
npm install
npm run dev
```

Síðan opnast á [http://127.0.0.1:4318](http://127.0.0.1:4318).

Við breytum **alltaf local fyrst**. Þegar þú ert sáttur biðurðu um að setja á vefinn.

## Prufusíða

[https://ttsuit-is.netlify.app](https://ttsuit-is.netlify.app) — **nýtt** Netlify-site á Skellur-aðganginum, **ekki** tengt fram.is (`www.nytt.fram.is` er óhreyft).

## Síður

| Slóð | Hvað |
| --- | --- |
| `/` | Forsíða |
| `/sersaumur` | Sérsaumur (einn síða). Drop-down fer á akkeri: `#ferlid` `#efnin` `#verdskra` `#boka-tima` `#spurningar` |
| `/verslun` | Allar vörur |
| `/verslun/peysur` · `/bindi` · `/yfirhafnir` · `/fylgihluti` · `/gjafabref` | Flokkar |
| `/verslun/vara/[handle]` | Vörusíða |
| `/kassi` | Sending og greiðsla |
| `/hafa-samband` | Hafa samband |
| `/um-okkur` | Um okkur |
| `/skilmalar` | Skilmálar |
| `/vafrakokur` | Vafrakökur |

## GitHub og Netlify

Sama GitHub- og Netlify-aðgangur og fram.is, en **sér repo og sér site**. Prufusíðan er [ttsuit-is.netlify.app](https://ttsuit-is.netlify.app). Auto-publish frá git er slökkt — við deploy-um þegar þú biður um það.

Shopify og Mailchimp eru stillt sem environment variables á Netlify-site-inu. Lyklar fara **aldrei** í git.

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

Vörur, sending og greiðsla koma **ekki** allar með sama API.

| Hvað | API | Þar sem þú stillir þetta |
| --- | --- | --- |
| Vörur, myndir, verð | Admin API (`read_products`) | Products í Shopify |
| Karfa → kassi | Storefront Cart API | Custom app, Storefront |
| Sending | Okkar kassi á `/kassi` | Local leiðir núna; Drop API síðar |
| Greiðsla | Shopify Checkout | **Settings → Payments** |

Síðan sýnir vörurnar, körfuna og **kassa** á `/kassi`. Þegar heimilisfang er sett inn birtast sendingarleiðir í kremaða kassanum ofan við pöntunina. Fyrsta leiðin er **Sækja eftir samkomulagi (TT hefur samband)**. Drop-sendingar bætast við þegar API þeirra er tengt. **Greiða** opnar Shopify-kassann fyrir kort — Shopify leyfir ekki að taka við kortanúmerum á utanaðkomandi síðu.

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

### 3. Lykilorð og kassi

Shopify-kassinn opnast ekki á meðan Online Store er lykilorðslæst. Taktu lykilorðið af, og settu redirect í `theme.liquid` svo `tje-tje.myshopify.com` sendi fólk á [ttsuit.is](https://ttsuit.is) — kassinn sjálfur (`/checkouts`) verður áfram á Shopify.

Án tókans notar síðan staðbundnar vörur og **Hafa samband** í stað kassa.

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
