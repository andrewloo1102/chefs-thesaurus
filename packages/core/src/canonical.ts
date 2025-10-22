export type CanonicalIngredient =
  | "sour cream"
  | "greek yogurt (full-fat)"
  | "crème fraîche"
  | "butter"
  | "neutral oil"
  | "garlic clove"
  | "garlic powder"
  | "fresh basil"
  | "dried basil"
  | "buttermilk"
  | "plain yogurt (thinned)"
  | "heavy cream"
  | "evaporated milk"
  | "brown sugar"
  | "white sugar"
  | "rice vinegar"
  | "apple cider vinegar"
  | "shaoxing wine"
  | "dry sherry"
  | "mirin"
  | "sake"
  | "fresh ginger"
  | "ground ginger"
  | "cream cheese"
  | "strained greek yogurt"
  | "eggs"
  | "all-purpose flour"
  | "sugar"
  | "milk"
  | "fresh herbs"
  | "wine"
  | "tomato paste"
  | "cornstarch"
  | "baking powder"
  | "lemon juice";

const allowlist: CanonicalIngredient[] = [
  "sour cream",
  "greek yogurt (full-fat)",
  "crème fraîche",
  "butter",
  "neutral oil",
  "garlic clove",
  "garlic powder",
  "fresh basil",
  "dried basil",
  "buttermilk",
  "plain yogurt (thinned)",
  "heavy cream",
  "evaporated milk",
  "brown sugar",
  "white sugar",
  "rice vinegar",
  "apple cider vinegar",
  "shaoxing wine",
  "dry sherry",
  "mirin",
  "sake",
  "fresh ginger",
  "ground ginger",
  "cream cheese",
  "strained greek yogurt",
  "eggs",
  "all-purpose flour",
  "sugar",
  "milk",
  "fresh herbs",
  "wine",
  "tomato paste",
  "cornstarch",
  "baking powder",
  "lemon juice",
];

const synonyms: Record<string, CanonicalIngredient> = {
  // sour cream family
  "soured cream": "sour cream",
  "crema agria": "sour cream",
  // butter family
  "unsalted butter": "butter",
  "salted butter": "butter",
  // greek yogurt
  "greek yoghurt": "greek yogurt (full-fat)",
  // sugar
  "powdered sugar": "white sugar", // note: substitution details may note confectioners
  "confectioners sugar": "white sugar",
  "caster sugar": "white sugar",
  // vinegar
  "acv": "apple cider vinegar",
  // ginger
  "fresh ginger root": "fresh ginger",
};

export function resolveCanonical(input: string): CanonicalIngredient | null {
  const key = input.trim().toLowerCase();
  const direct = allowlist.find((i) => i === key) as CanonicalIngredient | undefined;
  if (direct) return direct;
  return synonyms[key] ?? null;
}

export function getAllowlist(): CanonicalIngredient[] {
  return [...allowlist];
}

export function examples(): string[] {
  return [
    "sour cream",
    "butter",
    "garlic clove",
    "fresh basil",
    "buttermilk",
  ];
}



