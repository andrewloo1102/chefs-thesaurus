import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { canonUnit, fromMl, round, toMl, type SupportedUnit } from "./units";
import { resolveCanonical, examples } from "./canonical";

type Basis = "volume" | "unit";

type SubEntry = {
  base: string;
  substitute: string;
  basis: Basis;
  ratioMultiplier?: number;
  unitMapping?: {
    baseUnit?: SupportedUnit;
    perBaseUnitQuantity: number;
    perBaseUnitUnit: SupportedUnit;
  };
  notes?: string;
  alts?: Array<{
    substitute: string;
    basis: Basis;
    ratioMultiplier?: number;
  }>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename);
const dataPath = path.join(__dirname2, "../data/substitutions.json");
const raw = fs.readFileSync(dataPath, "utf8");
const SUBS: SubEntry[] = JSON.parse(raw) as SubEntry[];

export type SearchArgs = {
  ingredient: string;
  quantity?: number;
  unit?: string;
  dish?: string;
};

export type SearchResult =
  | {
      supported: true;
      base: string;
      substitute: string;
      quantity?: number;
      unit?: SupportedUnit;
      basis: Basis;
      notes?: string;
      alts?: Array<{ substitute: string; ratioMultiplier?: number }>;
    }
  | {
      supported: false;
      message: string;
      examples: string[];
    };

function findSubEntry(canonicalBase: string): SubEntry | undefined {
  const key = canonicalBase.trim().toLowerCase();
  return SUBS.find((e) => e.base.toLowerCase() === key);
}

export function searchSubstitutions(args: SearchArgs): SearchResult {
  const { ingredient, quantity, unit } = args;
  const canonical = resolveCanonical(ingredient);
  if (!canonical) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  const entry = findSubEntry(canonical);
  if (!entry) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  if (quantity === undefined || unit === undefined) {
    return {
      supported: true,
      base: entry.base,
      substitute: entry.substitute,
      basis: entry.basis,
      notes: entry.notes,
      alts: entry.alts?.map((a) => ({ substitute: a.substitute, ratioMultiplier: a.ratioMultiplier })),
    };
  }

  const canon = canonUnit(unit);
  if (!canon) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  if (entry.basis === "volume") {
    if (canon === "g") {
      return { supported: false, message: "Not in v1", examples: examples() };
    }
    const baseMl = toMl(quantity, canon);
    const ratio = entry.ratioMultiplier ?? 1;
    const subMl = baseMl * ratio;
    const outQty = round(fromMl(subMl, canon));
    return {
      supported: true,
      base: entry.base,
      substitute: entry.substitute,
      quantity: outQty,
      unit: canon,
      basis: entry.basis,
      notes: entry.notes,
      alts: entry.alts?.map((a) => ({ substitute: a.substitute, ratioMultiplier: a.ratioMultiplier })),
    };
  } else {
    const mapping = entry.unitMapping;
    if (!mapping) {
      return { supported: false, message: "Not in v1", examples: examples() };
    }
    if (mapping.baseUnit && canon !== mapping.baseUnit) {
      return { supported: false, message: "Not in v1", examples: examples() };
    }
    const outQty = round(quantity * mapping.perBaseUnitQuantity, 3);
    const outUnit = mapping.perBaseUnitUnit;
    return {
      supported: true,
      base: entry.base,
      substitute: entry.substitute,
      quantity: outQty,
      unit: outUnit,
      basis: entry.basis,
      notes: entry.notes,
      alts: entry.alts?.map((a) => ({ substitute: a.substitute, ratioMultiplier: a.ratioMultiplier })),
    };
  }
}

export type EffectsArgs = { base: string; substitute: string; dish?: string };
export type EffectsResult = { summary: string; supported: boolean };

export function describeEffects(args: EffectsArgs): EffectsResult {
  const base = resolveCanonical(args.base);
  const sub = resolveCanonical(args.substitute);
  if (!base || !sub) return { supported: false, summary: "Not in v1" };
  const entry = findSubEntry(base);
  if (!entry) return { supported: false, summary: "Not in v1" };
  let note = entry.notes ?? "Comparable outcome for most dishes.";
  if (base === "heavy cream" && sub === "evaporated milk") {
    note = "+1 tbsp butter per cup for richness.";
  }
  if (base === "mirin" && (sub as string).includes("sake")) {
    note = "Add sugar to approximate sweetness.";
  }
  return { supported: true, summary: note };
}

export type StoreLookupArgs = { query: string; lat: number; lon: number; radius_m?: number };
export type Store = { name: string; lat: number; lon: number; distance_m: number };

export function lookupStores(args: StoreLookupArgs): Store[] {
  const { query, lat, lon, radius_m = 5000 } = args;
  const norm = query.trim().toLowerCase();
  const seed = Math.abs(hashString(norm)) % 1000;
  const count = 3;
  const out: Store[] = [];
  for (let i = 0; i < count; i++) {
    const offset = (seed + i * 37) % 997;
    const d = (offset % radius_m) + 100;
    out.push({ name: `${capitalize(norm)} Market #${i + 1}`, lat: lat + i * 0.001, lon: lon - i * 0.001, distance_m: d });
  }
  return out;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}


