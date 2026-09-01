# Tjé Tjé — ttsuit.is

Nútímaleg heimasíða fyrir **Tjé Tjé** (áður TT suit): sérsaumur og tilbúinn herrafatnaður. Forsíðan er byggð upp í kampanje-stíl eins og Suitsupply — fullbreiddar ljósmyndir, grænn haus og fótur úr merkinu.

## Keyra staðbundið

```bash
npm install
npm run dev
```

Síðan opnast á [http://127.0.0.1:4318](http://127.0.0.1:4318).

Við breytum **alltaf local fyrst**. Þegar þú ert sáttur biðurðu um að setja á vefinn — þá fer prufusíðan á Netlify. Ekki tengja þetta við fram.is.

## Síður

| Slóð | Hvað |
| --- | --- |
| `/` | Forsíða |
| `/sersaumur` | Sérsaumur — yfirlit |
| `/sersaumur/ferlid` | Ferlið |
| `/sersaumur/efnin` | Efnin |
| `/sersaumur/verdskra` | Verðskrá (undir sérsaum, ekki sjálfstæð síða) |
| `/sersaumur/boka-tima` | Bóka mælingu |
| `/sersaumur/spurningar` | Algengar spurningar |
| `/verslun` | Allar vörur |
| `/verslun/peysur` · `/bindi` · `/yfirhafnir` · `/fylgihluti` · `/gjafabref` | Flokkar |
| `/verslun/vara/[handle]` | Vörusíða |
| `/kassi` | Sending og greiðsla |
| `/hafa-samband` | Hafa samband |
| `/um-okkur` | Um okkur |
| `/skilmalar` | Skilmálar |
| `/vafrakokur` | Vafrakökur |

## GitHub — nýtt repo, ekki fram.is

Þetta verkefni á **ekki** að vera inni í fram.is. Stofnaðu **nýtt GitHub-repo** (t.d. `ttsuit-is` eða `tje-tje`) á persónulegum/Tjé Tjé-reikningi.

Í Cursor: smelltu á **Create repo** og veldu nýtt repo — ekki fram.is-skipulagið.

## Netlify — prufusíða

Héðan get ég ekki skráð þig inn á Netlify eða GitHub. Þú gerir þetta einu sinni:

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Veldu **nýja GitHub-repoið** (ekki fram.is)
3. Build: `npm run build` · Publish: `.next` (eða láttu Netlify greina Next.js)
4. **Stop auto publishing** undir Site configuration → Build & deploy — svo hver `git push` fari ekki beint á vefinn
5. Environment variables (Site configuration → Environment variables):

```
NEXT_PUBLIC_SITE_URL=https://<þitt-netlify-nafn>.netlify.app
SHOPIFY_STORE_DOMAIN=tje-tje.myshopify.com
SHOPIFY_CLIENT_ID=…
SHOPIFY_CLIENT_SECRET=…
MAILCHIMP_API_KEY=…
MAILCHIMP_AUDIENCE_ID=…
```

Lyklar fara **aldrei** í git.

Þegar þú vilt birta: **Deploys → Trigger deploy** í Netlify, eða skrifaðu hér „settu á vefinn“. Ef þú sendir mér [Netlify personal access token](https://app.netlify.com/user/applications) get ég keyrt `netlify deploy --prod --build` fyrir þig.

Prufusíðan er `noindex` þar til `NEXT_PUBLIC_SITE_URL` er `https://ttsuit.is`.

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
| Sending | Shopify Checkout | **Settings → Shipping** |
| Greiðsla | Shopify Checkout | **Settings → Payments** |

Síðan sýnir vörurnar, körfuna og **kassa** á `/kassi`: heimilisfang, sendingarleiðir og afsláttarkóði koma úr Shopify. **Greiða** opnar Shopify-kassann fyrir kort — Shopify leyfir ekki að taka við kortanúmerum á utanaðkomandi síðu.

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
