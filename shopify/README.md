# Shopify redirect þema

Online Store á `tje-tje.myshopify.com` á að senda fólk á [www.ttsuit.is](https://www.ttsuit.is). Kassinn (`/checkouts`) verður áfram á Shopify.

Shopify leyfir ekki að breyta slóðinni á **Halda áfram að versla** beint. Þessi þema grípur heimsóknina á `myshopify.com` (líka eftir greiðslu) og sendir á ttsuit.is.

## Af hverju lykilorðið verður að fara

Á meðan Online Store er lykilorðslæst:

- `tje-tje.myshopify.com` sýnir **Opening soon**
- körfu-kassinn (`/cart/c/…`) fer á lykilorðssíðuna, ekki greiðslu

Slökktu á lykilorðinu **áður** en þú birtir þemað. Annars opnast kassinn ekki.

## Setja inn (2 skref í Shopify Admin)

1. **Slökkva á lykilorði**  
   [Online Store → Preferences](https://admin.shopify.com/store/tje-tje/online_store/preferences)  
   Taktu hakið af **Restrict store access with a password** → **Save**.

2. **Hlaða inn og birta þemað**  
   [Online Store → Themes](https://admin.shopify.com/store/tje-tje/themes) → **Add theme** → **Upload zip file**  
   Notaðu `shopify/ttsuit-redirect-theme.zip` úr þessu repo → **Publish**.

Eftir það:

- `https://tje-tje.myshopify.com/` → `https://www.ttsuit.is/`
- **Halda áfram að versla** á þakkar-síðunni fer á ttsuit.is
- Greiðsla á `/checkouts/…` er óhreyfð

Dawn-þemað má vera áfram í library; það þarf ekki að vera birt.
