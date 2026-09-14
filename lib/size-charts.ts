export type SizeChartColumn = {
  key: string;
  label: string;
  hint?: string;
};

export type SizeChartRow = {
  size: string;
  values: Record<string, string>;
};

export type SizeChart = {
  handle: string;
  title: string;
  unit: string;
  columns: SizeChartColumn[];
  rows: SizeChartRow[];
};

const PEACOAT: SizeChart = {
  handle: "peacoat",
  title: "Stærðartafla",
  unit: "cm",
  columns: [
    { key: "chest", label: "Brjóst", hint: "Líkamsstærð" },
    { key: "waist", label: "Mitta", hint: "Líkamsstærð" },
    { key: "shoulder", label: "Axlir", hint: "Jakkinn" },
    { key: "sleeve", label: "Ermi", hint: "Jakkinn" },
    { key: "length", label: "Lengd", hint: "Jakkinn" },
  ],
  rows: [
    {
      size: "XS",
      values: {
        chest: "90–94",
        waist: "81–85",
        shoulder: "42,6",
        sleeve: "58,6",
        length: "78,5",
      },
    },
    {
      size: "S",
      values: {
        chest: "94–98",
        waist: "85–89",
        shoulder: "43,8",
        sleeve: "59,8",
        length: "80,5",
      },
    },
    {
      size: "M",
      values: {
        chest: "98–102",
        waist: "89–93",
        shoulder: "45",
        sleeve: "61",
        length: "82,5",
      },
    },
    {
      size: "L",
      values: {
        chest: "102–106",
        waist: "93–97",
        shoulder: "46,2",
        sleeve: "62,2",
        length: "84,5",
      },
    },
    {
      size: "XL",
      values: {
        chest: "106–110",
        waist: "97–101",
        shoulder: "47,4",
        sleeve: "63,4",
        length: "86,5",
      },
    },
    {
      size: "2XL",
      values: {
        chest: "112–116",
        waist: "103–107",
        shoulder: "49,2",
        sleeve: "64,6",
        length: "87,5",
      },
    },
    {
      size: "3XL",
      values: {
        chest: "118–122",
        waist: "109–113",
        shoulder: "51",
        sleeve: "65,4",
        length: "88,5",
      },
    },
  ],
};

const CASHMERE: SizeChart = {
  handle: "kasmir-peysa",
  title: "Stærðartafla",
  unit: "cm",
  columns: [
    { key: "chest", label: "Brjóst" },
    { key: "length", label: "Lengd" },
    { key: "sleeve", label: "Ermi" },
    { key: "shoulder", label: "Axlir" },
  ],
  rows: [
    {
      size: "XS",
      values: { chest: "94", length: "65", sleeve: "63", shoulder: "36,5" },
    },
    {
      size: "S",
      values: { chest: "100", length: "67", sleeve: "64", shoulder: "38" },
    },
    {
      size: "M",
      values: { chest: "106", length: "69", sleeve: "65", shoulder: "39,5" },
    },
    {
      size: "L",
      values: { chest: "112", length: "71", sleeve: "67", shoulder: "41" },
    },
    {
      size: "XL",
      values: { chest: "120", length: "73", sleeve: "68", shoulder: "43" },
    },
    {
      size: "2XL",
      values: { chest: "128", length: "75", sleeve: "69", shoulder: "45" },
    },
  ],
};

const CHARTS: Record<string, SizeChart> = {
  [PEACOAT.handle]: PEACOAT,
  [CASHMERE.handle]: CASHMERE,
};

export function sizeChartFor(
  product?:
    | string
    | {
        handle?: string | null;
        title?: string | null;
        subtitle?: string | null;
      }
    | null
) {
  if (!product) return undefined;
  const handle = typeof product === "string" ? product : product.handle;
  if (handle && CHARTS[handle]) return CHARTS[handle];
  const hay = (
    typeof product === "string"
      ? product
      : [product.handle, product.title, product.subtitle].filter(Boolean).join(" ")
  ).toLowerCase();
  if (/kasm[íi]r|cashmere/.test(hay)) return CASHMERE;
  return undefined;
}

export function normalizeSizeLabel(size?: string | null) {
  const raw = (size ?? "").replace(/\s+/g, "").toUpperCase();
  if (!raw) return "";
  if (raw === "XXXL" || raw === "3XL") return "3XL";
  if (raw === "XXL" || raw === "2XL") return "2XL";
  return raw;
}

export function sizesMatch(a?: string | null, b?: string | null) {
  const left = normalizeSizeLabel(a);
  const right = normalizeSizeLabel(b);
  return Boolean(left && left === right);
}

export function isTwoXlSize(size?: string | null) {
  return normalizeSizeLabel(size) === "2XL";
}
