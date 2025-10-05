export type SupportedUnit = "tsp" | "tbsp" | "cup" | "ml" | "g";

const unitAliases: Record<string, SupportedUnit> = {
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",

  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",

  cup: "cup",
  cups: "cup",

  ml: "ml",
  milliliter: "ml",
  milliliters: "ml",

  g: "g",
  gram: "g",
  grams: "g",
};

export function canonUnit(input: string): SupportedUnit | null {
  const key = input.trim().toLowerCase();
  return unitAliases[key] ?? null;
}

const ML_PER_TSP = 4.92892;
const ML_PER_TBSP = 14.7868;
const ML_PER_CUP = 236.588;

function isVolumeUnit(unit: SupportedUnit): boolean {
  return unit === "tsp" || unit === "tbsp" || unit === "cup" || unit === "ml";
}

function isMassUnit(unit: SupportedUnit): boolean {
  return unit === "g";
}

export function toMl(quantity: number, unit: SupportedUnit): number {
  if (!isVolumeUnit(unit)) {
    throw new Error(`toMl only supports volume units; got ${unit}`);
  }
  switch (unit) {
    case "ml":
      return quantity;
    case "tsp":
      return quantity * ML_PER_TSP;
    case "tbsp":
      return quantity * ML_PER_TBSP;
    case "cup":
      return quantity * ML_PER_CUP;
  }
}

export function fromMl(ml: number, targetUnit: SupportedUnit): number {
  if (!isVolumeUnit(targetUnit)) {
    throw new Error(`fromMl only supports volume units; got ${targetUnit}`);
  }
  switch (targetUnit) {
    case "ml":
      return ml;
    case "tsp":
      return ml / ML_PER_TSP;
    case "tbsp":
      return ml / ML_PER_TBSP;
    case "cup":
      return ml / ML_PER_CUP;
  }
}

export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export const Units = {
  canonUnit,
  toMl,
  fromMl,
  round,
  isVolumeUnit,
  isMassUnit,
};

export type Quantity = {
  quantity: number;
  unit: SupportedUnit;
};



