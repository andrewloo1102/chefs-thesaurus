import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { canonUnit, fromMl, round, toMl, type SupportedUnit } from "./units.js";
import { resolveCanonical, examples } from "./canonical.js";

type Basis = "volume" | "unit";

type Ratio = {
  mode: "multiplier";
  value: number;
  basis: Basis;
};

type Alternative = {
  substitute: string;
  ratio: Ratio;
  notes?: string;
  tips?: string[];
  tags?: string[];
  allergens?: string[];
};

type Entry = {
  base: string;
  synonyms?: string[];
  alternatives: Alternative[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename);
const dataPath = path.join(__dirname2, "../data/substitutions.json");
const raw = fs.readFileSync(dataPath, "utf8");
const SUBS: Entry[] = JSON.parse(raw) as Entry[];

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

function findSubEntry(canonicalBase: string): Entry | undefined {
  const key = canonicalBase.trim().toLowerCase();
  return SUBS.find((e) => e.base.toLowerCase() === key);
}

function findSubEntryBySynonym(canonicalBase: string): Entry | undefined {
  const key = canonicalBase.trim().toLowerCase();
  return SUBS.find((e) => 
    e.synonyms?.some(syn => syn.toLowerCase() === key)
  );
}

export function searchSubstitutions(args: SearchArgs): SearchResult {
  const { ingredient, quantity, unit } = args;
  const canonical = resolveCanonical(ingredient);
  if (!canonical) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  let entry = findSubEntry(canonical);
  if (!entry) {
    entry = findSubEntryBySynonym(canonical);
  }
  
  if (!entry) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  // Use the first alternative as the primary substitute
  const primaryAlt = entry.alternatives[0];
  if (!primaryAlt) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  if (quantity === undefined || unit === undefined) {
    return {
      supported: true,
      base: entry.base,
      substitute: primaryAlt.substitute,
      basis: primaryAlt.ratio.basis,
      notes: primaryAlt.notes,
      alts: entry.alternatives.slice(1).map((a) => ({ 
        substitute: a.substitute, 
        ratioMultiplier: a.ratio.value 
      })),
    };
  }

  const canon = canonUnit(unit);
  if (!canon) {
    return { supported: false, message: "Not in v1", examples: examples() };
  }

  if (primaryAlt.ratio.basis === "volume") {
    if (canon === "g") {
      return { supported: false, message: "Not in v1", examples: examples() };
    }
    const baseMl = toMl(quantity, canon);
    const ratio = primaryAlt.ratio.value;
    const subMl = baseMl * ratio;
    const outQty = round(fromMl(subMl, canon));
    return {
      supported: true,
      base: entry.base,
      substitute: primaryAlt.substitute,
      quantity: outQty,
      unit: canon,
      basis: primaryAlt.ratio.basis,
      notes: primaryAlt.notes,
      alts: entry.alternatives.slice(1).map((a) => ({ 
        substitute: a.substitute, 
        ratioMultiplier: a.ratio.value 
      })),
    };
  } else {
    // Unit-based mapping
    if (canon !== "unit") {
      return { supported: false, message: "Not in v1", examples: examples() };
    }
    const outQty = round(quantity * primaryAlt.ratio.value, 3);
    const outUnit = "tsp" as SupportedUnit; // Default to tsp for unit mappings
    return {
      supported: true,
      base: entry.base,
      substitute: primaryAlt.substitute,
      quantity: outQty,
      unit: outUnit,
      basis: primaryAlt.ratio.basis,
      notes: primaryAlt.notes,
      alts: entry.alternatives.slice(1).map((a) => ({ 
        substitute: a.substitute, 
        ratioMultiplier: a.ratio.value 
      })),
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
  
  const alt = entry.alternatives.find(a => 
    a.substitute.toLowerCase().includes(sub.toLowerCase())
  );
  
  let note = alt?.notes ?? "Comparable outcome for most dishes.";
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