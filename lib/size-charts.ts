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

const POLO: SizeChart = {
  handle: "polo-langerma-merino",
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
      values: { chest: "98", length: "65", sleeve: "63", shoulder: "38" },
    },
    {
      size: "S",
      values: { chest: "104", length: "67", sleeve: "64", shoulder: "39,5" },
    },
    {
      size: "M",
      values: { chest: "110", length: "69", sleeve: "65", shoulder: "41" },
    },
    {
      size: "L",
      values: { chest: "116", length: "71", sleeve: "66", shoulder: "42,5" },
    },
    {
      size: "XL",
      values: { chest: "124", length: "73", sleeve: "67", shoulder: "44,5" },
    },
    {
      size: "2XL",
      values: { chest: "132", length: "75", sleeve: "68", shoulder: "46,5" },
    },
  ],
};

const HALF_ZIP_WOOL: SizeChart = {
  handle: "halfrennd-ullarpeysa",
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
      values: { chest: "98", length: "65", sleeve: "63", shoulder: "38" },
    },
    {
      size: "S",
      values: { chest: "104", length: "67", sleeve: "64", shoulder: "39,5" },
    },
    {
      size: "M",
      values: { chest: "110", length: "69", sleeve: "65", shoulder: "41" },
    },
    {
      size: "L",
      values: { chest: "116", length: "71", sleeve: "66", shoulder: "42,5" },
    },
    {
      size: "XL",
      values: { chest: "124", length: "73", sleeve: "67", shoulder: "44,5" },
    },
    {
      size: "2XL",
      values: { chest: "132", length: "75", sleeve: "68", shoulder: "46,5" },
    },
  ],
};

const CABLE: SizeChart = {
  handle: "halfrennd-kadlapeysa",
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
      values: { chest: "86", length: "66", sleeve: "63", shoulder: "38" },
    },
    {
      size: "S",
      values: { chest: "92", length: "68", sleeve: "64", shoulder: "39,5" },
    },
    {
      size: "M",
      values: { chest: "98", length: "70", sleeve: "65", shoulder: "41" },
    },
    {
      size: "L",
      values: { chest: "104", length: "72", sleeve: "66", shoulder: "42,5" },
    },
    {
      size: "XL",
      values: { chest: "112", length: "74", sleeve: "67", shoulder: "44,5" },
    },
    {
      size: "2XL",
      values: { chest: "120", length: "76", sleeve: "68", shoulder: "46,5" },
    },
  ],
};

const BUTTONED: SizeChart = {
  handle: "hneppt-peysa",
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
      values: { chest: "94", length: "63,5", sleeve: "61", shoulder: "43" },
    },
    {
      size: "S",
      values: { chest: "100", length: "66", sleeve: "62", shoulder: "44" },
    },
    {
      size: "M",
      values: { chest: "106", length: "68", sleeve: "63", shoulder: "46" },
    },
    {
      size: "L",
      values: { chest: "112", length: "70", sleeve: "64", shoulder: "48" },
    },
    {
      size: "XL",
      values: { chest: "120", length: "72", sleeve: "65", shoulder: "51" },
    },
    {
      size: "2XL",
      values: { chest: "128", length: "74", sleeve: "66", shoulder: "54" },
    },
  ],
};

const WINTER_JACKET: SizeChart = {
  handle: "vetrarjakki",
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
        chest: "96–100",
        waist: "86–90",
        shoulder: "44",
        sleeve: "64",
        length: "75",
      },
    },
    {
      size: "S",
      values: {
        chest: "100–104",
        waist: "90–94",
        shoulder: "46",
        sleeve: "65",
        length: "77",
      },
    },
    {
      size: "M",
      values: {
        chest: "104–108",
        waist: "96–100",
        shoulder: "47,5",
        sleeve: "66",
        length: "78",
      },
    },
    {
      size: "L",
      values: {
        chest: "110–114",
        waist: "102–106",
        shoulder: "49",
        sleeve: "67",
        length: "79",
      },
    },
    {
      size: "XL",
      values: {
        chest: "114–118",
        waist: "106–110",
        shoulder: "50,5",
        sleeve: "68",
        length: "80",
      },
    },
    {
      size: "2XL",
      values: {
        chest: "120–124",
        waist: "112–116",
        shoulder: "52",
        sleeve: "69",
        length: "81",
      },
    },
  ],
};

const JAZER: SizeChart = {
  handle: "jazer-ullarjakki",
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
      size: "S",
      values: {
        chest: "97–101",
        waist: "91–95",
        shoulder: "45,2",
        sleeve: "63,5",
        length: "66,25",
      },
    },
    {
      size: "M",
      values: {
        chest: "102–106",
        waist: "96–100",
        shoulder: "47,2",
        sleeve: "64,5",
        length: "67,75",
      },
    },
    {
      size: "L",
      values: {
        chest: "107–111",
        waist: "101–105",
        shoulder: "49,2",
        sleeve: "65,5",
        length: "69,25",
      },
    },
    {
      size: "XL",
      values: {
        chest: "112–116",
        waist: "106–110",
        shoulder: "51,2",
        sleeve: "66,5",
        length: "70,75",
      },
    },
    {
      size: "2XL",
      values: {
        chest: "117–121",
        waist: "111–115",
        shoulder: "53,2",
        sleeve: "67,5",
        length: "72,25",
      },
    },
    {
      size: "3XL",
      values: {
        chest: "122–126",
        waist: "116–120",
        shoulder: "55,2",
        sleeve: "68,5",
        length: "73,75",
      },
    },
    {
      size: "4XL",
      values: {
        chest: "127–131",
        waist: "121–125",
        shoulder: "57,2",
        sleeve: "69,5",
        length: "75,25",
      },
    },
    {
      size: "5XL",
      values: {
        chest: "132–136",
        waist: "126–130",
        shoulder: "59,2",
        sleeve: "70,5",
        length: "76,75",
      },
    },
  ],
};

const CHARTS: Record<string, SizeChart> = {
  [PEACOAT.handle]: PEACOAT,
  [CASHMERE.handle]: CASHMERE,
  [POLO.handle]: POLO,
  "v-halsmal-merinopeysa": POLO,
  [HALF_ZIP_WOOL.handle]: HALF_ZIP_WOOL,
  [CABLE.handle]: CABLE,
  "heilrennd-kadlapeysa": CABLE,
  [BUTTONED.handle]: BUTTONED,
  "hneppt-merinopeysa": BUTTONED,
  [WINTER_JACKET.handle]: WINTER_JACKET,
  [JAZER.handle]: JAZER,
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
  if (/p[oó]l[oó]/.test(hay)) return POLO;
  if (/v-háls|v-hals/.test(hay)) return POLO;
  if (/halfrennd-ullarpeysa|hálfrennd ullarpeysa|hálfrennd merinopeysa/.test(hay)) return HALF_ZIP_WOOL;
  if (/kaðla|kadla/.test(hay)) return CABLE;
  if (/hneppt/.test(hay)) return BUTTONED;
  if (/vetrarjakki/.test(hay)) return WINTER_JACKET;
  if (/jazer/.test(hay)) return JAZER;
  return undefined;
}

export function normalizeSizeLabel(size?: string | null) {
  const raw = (size ?? "").replace(/\s+/g, "").toUpperCase();
  if (!raw) return "";
  if (raw === "XXXXXL" || raw === "5XL") return "5XL";
  if (raw === "XXXXL" || raw === "4XL") return "4XL";
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
