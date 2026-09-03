import { accessoryPrices, garmentPrices } from "@/lib/site";

export type GarmentKey = "jakki" | "buxur" | "vesti";
export type ExtraKey =
  | "skyrta"
  | "sex-skyrtur"
  | "axlabond"
  | "bindi"
  | "slaufa"
  | "klutur"
  | "halsklutur"
  | "armbond";
export type Canvas = "none" | "half" | "full";

export type CalcInput = {
  garments: readonly GarmentKey[];
  extras: readonly ExtraKey[];
  tier: number;
  canvas: Canvas;
  rush: boolean;
};

export type CalcLine = { label: string; amount: number };

export type CalcResult = {
  lines: CalcLine[];
  total: number;
};

export const HALF_CANVAS = 10990;
export const FULL_CANVAS = 16990;
export const RUSH_RATE = 0.2;
export const ACCESSORY_BUNDLE_COUNT = 3;
export const ACCESSORY_BUNDLE_RATE = 0.2;

export const garmentOptions: { key: GarmentKey; label: string }[] = [
  { key: "jakki", label: "Jakki" },
  { key: "buxur", label: "Buxur" },
  { key: "vesti", label: "Vesti" },
];

export const extraOptions: { key: ExtraKey; label: string }[] = [
  { key: "skyrta", label: "Skyrta" },
  { key: "sex-skyrtur", label: "Sex skyrtur" },
  { key: "bindi", label: "Bindi" },
  { key: "slaufa", label: "Slaufa" },
  { key: "klutur", label: "Klútur" },
  { key: "halsklutur", label: "Hálsklútur" },
  { key: "axlabond", label: "Axlabönd" },
  { key: "armbond", label: "Armbönd" },
];

function rowAmount(
  rows: readonly { name: string; amounts: readonly number[] }[],
  name: string,
  tier: number
) {
  const row = rows.find((item) => item.name === name);
  if (!row) return 0;
  return row.amounts[tier] ?? row.amounts[row.amounts.length - 1] ?? 0;
}

function has(list: readonly string[], key: string) {
  return list.includes(key);
}

export function formatIsk(amount: number) {
  return `${new Intl.NumberFormat("is-IS").format(amount)} kr.`;
}

export function estimatePackage(input: CalcInput): CalcResult {
  const tier = Math.min(Math.max(input.tier, 0), 5);
  const lines: CalcLine[] = [];
  const g = input.garments;
  const jacket = has(g, "jakki");
  const trousers = has(g, "buxur");
  const vest = has(g, "vesti");

  if (jacket && trousers && vest) {
    lines.push({
      label: `3 setta föt · Flokkur ${tier + 1}`,
      amount: rowAmount(garmentPrices, "3 setta föt", tier),
    });
  } else if (jacket && trousers) {
    lines.push({
      label: `Jakkaföt · Flokkur ${tier + 1}`,
      amount: rowAmount(garmentPrices, "Jakkaföt", tier),
    });
  } else {
    if (jacket) {
      lines.push({
        label: `Jakki · Flokkur ${tier + 1}`,
        amount: rowAmount(garmentPrices, "Jakki", tier),
      });
    }
    if (trousers) {
      lines.push({
        label: `Buxur · Flokkur ${tier + 1}`,
        amount: rowAmount(garmentPrices, "Buxur", tier),
      });
    }
    if (vest) {
      lines.push({
        label: `Vesti · Flokkur ${tier + 1}`,
        amount: rowAmount(garmentPrices, "Vesti", tier),
      });
    }
  }

  const extras = input.extras.filter((key) => {
    if (key === "skyrta" && has(input.extras, "sex-skyrtur")) return false;
    return true;
  });

  const accessoryLines: CalcLine[] = [];
  for (const key of extras) {
    if (key === "sex-skyrtur") {
      accessoryLines.push({
        label: "Sex skyrtur á verði fimm",
        amount: rowAmount(accessoryPrices, "Skyrta", tier) * 5,
      });
      continue;
    }
    const name = extraOptions.find((item) => item.key === key)?.label ?? key;
    const tableName = key === "skyrta" ? "Skyrta" : name;
    accessoryLines.push({
      label: name,
      amount: rowAmount(accessoryPrices, tableName, tier),
    });
  }
  lines.push(...accessoryLines);

  const bundleCandidates = accessoryLines.filter(
    (line) => line.label !== "Skyrta" && line.label !== "Sex skyrtur á verði fimm"
  );
  const accessoryOnly = g.length === 0;
  if (accessoryOnly && bundleCandidates.length >= ACCESSORY_BUNDLE_COUNT) {
    const discount = Math.round(
      [...bundleCandidates]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, ACCESSORY_BUNDLE_COUNT)
        .reduce((sum, line) => sum + line.amount, 0) * ACCESSORY_BUNDLE_RATE
    );
    lines.push({
      label: "20% afsláttur af þremur fylgihlutum",
      amount: -discount,
    });
  }

  if (jacket && input.canvas === "half" && tier < 4) {
    lines.push({ label: "Hálfur strigi", amount: HALF_CANVAS });
  }
  if (jacket && input.canvas === "full") {
    lines.push({ label: "Fullur strigi", amount: FULL_CANVAS });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  if (input.rush && subtotal > 0) {
    lines.push({
      label: "Flýtismeðferð +20%",
      amount: Math.round(subtotal * RUSH_RATE),
    });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { lines, total };
}
