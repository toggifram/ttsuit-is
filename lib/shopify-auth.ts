const TOKEN_SKEW_MS = 60_000;

let cachedAdmin:
  | { token: string; expiresAt: number }
  | null = null;
let cachedStorefront: string | null = null;

export function storeDomain() {
  return (process.env.SHOPIFY_STORE_DOMAIN || "tje-tje.myshopify.com")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function staticAdminToken() {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim() || "";
}

function clientId() {
  return process.env.SHOPIFY_CLIENT_ID?.trim() || "";
}

function clientSecret() {
  return process.env.SHOPIFY_CLIENT_SECRET?.trim() || "";
}

export function hasShopifyAdminCredentials() {
  return Boolean(staticAdminToken() || (clientId() && clientSecret()));
}

async function requestClientCredentialsToken() {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return null;

  const res = await fetch(
    `https://${storeDomain()}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: id,
        client_secret: secret,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    const hint = /app_not_installed/i.test(text)
      ? "app_not_installed"
      : /shop_not_permitted/i.test(text)
        ? "shop_not_permitted"
        : `http_${res.status}`;
    console.error(`Shopify client credentials: ${hint}`);
    return null;
  }

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) return null;
  return {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 86399) * 1000,
  };
}

export async function getAdminAccessToken() {
  if (staticAdminToken()) return staticAdminToken();
  if (cachedAdmin && Date.now() < cachedAdmin.expiresAt - TOKEN_SKEW_MS) {
    return cachedAdmin.token;
  }
  const next = await requestClientCredentialsToken();
  cachedAdmin = next;
  return next?.token ?? "";
}

async function createStorefrontToken(adminToken: string) {
  const res = await fetch(
    `https://${storeDomain()}/admin/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: `mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
          storefrontAccessTokenCreate(input: $input) {
            storefrontAccessToken { accessToken }
            userErrors { message }
          }
        }`,
        variables: { input: { title: "Tjé Tjé vefur" } },
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      storefrontAccessTokenCreate?: {
        storefrontAccessToken?: { accessToken?: string } | null;
        userErrors?: { message: string }[];
      };
    };
  };
  const errors = json.data?.storefrontAccessTokenCreate?.userErrors;
  if (errors?.length) {
    console.error(`Shopify storefront token: ${errors.map((e) => e.message).join("; ")}`);
    return null;
  }
  return json.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken ?? null;
}

type StorefrontTokenRow = {
  access_token?: string;
  title?: string;
};

async function listStorefrontTokens(adminToken: string) {
  const res = await fetch(
    `https://${storeDomain()}/admin/api/2025-01/storefront_access_tokens.json`,
    {
      headers: { "X-Shopify-Access-Token": adminToken },
      cache: "no-store",
    }
  );
  if (!res.ok) return [] as StorefrontTokenRow[];
  const json = (await res.json()) as {
    storefront_access_tokens?: StorefrontTokenRow[];
  };
  return json.storefront_access_tokens ?? [];
}

function pickStorefrontToken(rows: StorefrontTokenRow[]) {
  const named = rows.find((row) =>
    /tjé\s*tjé\s*vefur|tje\s*tje\s*vefur/i.test(row.title ?? "")
  );
  return named?.access_token || rows[0]?.access_token || null;
}

export async function getStorefrontAccessToken() {
  const fromEnv = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  if (cachedStorefront) return cachedStorefront;
  const admin = await getAdminAccessToken();
  if (!admin) return "";
  const existing = pickStorefrontToken(await listStorefrontTokens(admin));
  if (existing) {
    cachedStorefront = existing;
    return existing;
  }
  const created = await createStorefrontToken(admin);
  if (created) cachedStorefront = created;
  return created ?? "";
}
