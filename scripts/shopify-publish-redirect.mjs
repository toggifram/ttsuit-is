#!/usr/bin/env node
/**
 * Publishes shopify/redirect-theme when the Admin app has write_themes.
 * Password protection cannot be turned off via Admin API — do that in Shopify admin.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STORE = (
  process.env.SHOPIFY_STORE_DOMAIN || "tje-tje.myshopify.com"
).replace(/^https?:\/\//, "").replace(/\/$/, "");
const API = "2025-01";
const THEME_NAME = "TT suit redirect";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THEME_DIR = path.join(ROOT, "shopify", "redirect-theme");

async function getToken() {
  const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (staticToken) return staticToken;
  const id = process.env.SHOPIFY_CLIENT_ID?.trim();
  const secret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
  if (!id || !secret) {
    throw new Error("Vantar SHOPIFY_CLIENT_ID og SHOPIFY_CLIENT_SECRET (eða SHOPIFY_ADMIN_ACCESS_TOKEN).");
  }
  const res = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`Fékk ekki token: ${JSON.stringify(json)}`);
  }
  console.log("Scopes:", json.scope || "(unknown)");
  return json.access_token;
}

async function gql(token, query, variables) {
  const res = await fetch(`https://${STORE}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function listFiles(dir, prefix = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(abs, rel)));
    else if (entry.name !== "LICENSE.md") out.push({ rel, abs });
  }
  return out;
}

async function main() {
  const token = await getToken();
  const shop = await gql(
    token,
    `query {
      shop { name url }
      onlineStore { passwordProtection { enabled } }
    }`
  );
  const passwordOn = shop.data?.onlineStore?.passwordProtection?.enabled;
  console.log("Shop:", shop.data?.shop?.url);
  console.log("Password protection:", passwordOn ? "ON (slökktu á þessu í Preferences fyrst)" : "off");

  const themes = await gql(
    token,
    `query { themes(first: 20) { nodes { id name role } } }`
  );
  if (themes.errors) {
    console.error("\nGet ekki lesið þemu. Veittu appinu TjéTjéVefur:");
    console.error("  read_themes, write_themes");
    console.error("í Dev Dashboard / Develop apps, samþykktu scopes í Admin, og keyrðu aftur.");
    console.error(JSON.stringify(themes.errors, null, 2));
    process.exit(1);
  }

  const files = await listFiles(THEME_DIR);
  const existing = themes.data.themes.nodes.find((t) => t.name === THEME_NAME);
  let themeId = existing?.id;

  if (!themeId) {
    const created = await gql(
      token,
      `mutation ThemeCreate($name: String!, $source: URL!) {
        themeCreate(name: $name, source: $source) {
          theme { id name }
          userErrors { field message }
        }
      }`,
      {
        name: THEME_NAME,
        source:
          "https://github.com/Shopify/hydrogen-redirect-theme/archive/refs/heads/main.zip",
      }
    );
    const err =
      created.errors?.[0]?.message ||
      created.data?.themeCreate?.userErrors?.[0]?.message;
    if (err) {
      console.error("themeCreate:", err);
      console.error("Hladdu inn shopify/ttsuit-redirect-theme.zip í Online Store → Themes.");
      process.exit(1);
    }
    themeId = created.data.themeCreate.theme.id;
  }

  const upsertFiles = [];
  for (const file of files) {
    const body = await readFile(file.abs, "utf8");
    upsertFiles.push({
      filename: file.rel,
      body: { type: "TEXT", value: body },
    });
  }

  const upsert = await gql(
    token,
    `mutation Upsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        upsertedThemeFiles { filename }
        userErrors { field message }
      }
    }`,
    { themeId, files: upsertFiles }
  );
  const upsertErr =
    upsert.errors?.[0]?.message ||
    upsert.data?.themeFilesUpsert?.userErrors?.[0]?.message;
  if (upsertErr) {
    console.error("themeFilesUpsert:", upsertErr);
    process.exit(1);
  }

  const published = await gql(
    token,
    `mutation Publish($id: ID!) {
      themePublish(id: $id) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { id: themeId }
  );
  const pubErr =
    published.errors?.[0]?.message ||
    published.data?.themePublish?.userErrors?.[0]?.message;
  if (pubErr) {
    console.error("themePublish:", pubErr);
    process.exit(1);
  }

  console.log("Birt:", published.data.themePublish.theme);
  if (passwordOn) {
    console.log(
      "ATH: lykilorð er enn á. Slökktu á Restrict store access svo kassinn og redirect virki."
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
