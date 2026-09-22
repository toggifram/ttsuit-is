import { getAdminAccessToken, storeDomain } from "@/lib/shopify-auth";

const API_VERSION = "2025-01";

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const token = await getAdminAccessToken();
  if (!token) return null;
  const res = await fetch(
    `https://${storeDomain()}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: T;
    errors?: { message?: string }[];
  };
  if (json.errors?.length) {
    console.error(
      `Gift files GraphQL: ${json.errors.map((row) => row.message).join("; ")}`
    );
    return json.data ?? null;
  }
  return json.data ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadGiftPdf(bytes: Buffer, filename: string) {
  const staged = await adminGraphql<{
    stagedUploadsCreate?: {
      stagedTargets?: {
        url?: string;
        resourceUrl?: string;
        parameters?: { name: string; value: string }[];
      }[];
      userErrors?: { message: string }[];
    };
  }>(
    `mutation StageGiftPdf($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType: "application/pdf",
          httpMethod: "POST",
          resource: "FILE",
          fileSize: String(bytes.length),
        },
      ],
    }
  );
  const target = staged?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target?.url || !target.resourceUrl) {
    throw new Error(
      staged?.stagedUploadsCreate?.userErrors?.[0]?.message || "gift_upload_stage"
    );
  }

  const form = new FormData();
  for (const param of target.parameters ?? []) {
    form.append(param.name, param.value);
  }
  form.append(
    "file",
    new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename
  );
  const uploaded = await fetch(target.url, { method: "POST", body: form });
  if (!uploaded.ok) throw new Error(`gift_upload_http_${uploaded.status}`);

  const created = await adminGraphql<{
    fileCreate?: {
      files?: { id?: string }[];
      userErrors?: { message: string }[];
    };
  }>(
    `mutation CreateGiftPdf($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files { id }
        userErrors { message }
      }
    }`,
    {
      files: [
        {
          originalSource: target.resourceUrl,
          contentType: "FILE",
          filename,
          alt: "Gjafabréf Tjé Tjé",
        },
      ],
    }
  );
  const id = created?.fileCreate?.files?.[0]?.id;
  if (!id) {
    throw new Error(
      created?.fileCreate?.userErrors?.[0]?.message || "gift_file_create"
    );
  }

  for (let i = 0; i < 8; i += 1) {
    const node = await adminGraphql<{
      node?: { url?: string | null; fileStatus?: string | null } | null;
    }>(
      `query GiftFile($id: ID!) {
        node(id: $id) {
          ... on GenericFile { url fileStatus }
        }
      }`,
      { id }
    );
    const url = node?.node?.url;
    const status = node?.node?.fileStatus;
    if (url && status !== "PROCESSING") return url;
    await sleep(400);
  }
  throw new Error("gift_file_timeout");
}
