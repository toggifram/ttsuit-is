export type SizeChartColumn = {
  key: string;
  label: string;
  hint: string;
};

export type SizeChartRow = {
  size: string;
  values: Record<string, string>;
};

export type SizeChart = {
  handle: string;
  title: string;
  intro: string;
  unit: string;
  columns: SizeChartColumn[];
  rows: SizeChartRow[];
};

const PEACOAT: SizeChart = {
  handle: "peacoat",
  title: "Stærðartafla",
  intro:
    "Mál í sentímetrum. Brjóst og mitta eru líkamsstærð. Axlir, ermi og lengd eru mál jakkans. Ef þú ert á milli stærða, veldu þá stærri.",
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

const CHARTS: Record<string, SizeChart> = {
  [PEACOAT.handle]: PEACOAT,
};

export function sizeChartFor(handle?: string | null) {
  if (!handle) return undefined;
  return CHARTS[handle];
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
