export interface Ingredient {
  id: string;
  name: string;
  synonyms: string[];
}

export interface Store {
  name: string;
  distance: string;
  address: string;
}

// Ingredients matching our backend canonical list
export const ingredients: Ingredient[] = [
  { id: "sour-cream", name: "Sour cream", synonyms: ["soured cream", "crema agria"] },
  { id: "butter", name: "Butter", synonyms: ["unsalted butter", "salted butter"] },
  { id: "eggs", name: "Eggs", synonyms: ["egg", "whole eggs"] },
  { id: "milk", name: "Milk", synonyms: ["whole milk", "dairy milk"] },
  { id: "all-purpose-flour", name: "All-purpose flour", synonyms: ["ap flour", "flour"] },
  { id: "sugar", name: "Sugar", synonyms: ["granulated sugar", "white sugar"] },
  { id: "heavy-cream", name: "Heavy cream", synonyms: ["heavy whipping cream", "whipping cream"] },
  { id: "buttermilk", name: "Buttermilk", synonyms: ["cultured buttermilk"] },
  { id: "garlic-clove", name: "Garlic clove", synonyms: ["fresh garlic", "garlic"] },
  { id: "fresh-basil", name: "Fresh basil", synonyms: ["basil", "sweet basil"] },
  { id: "fresh-ginger", name: "Fresh ginger", synonyms: ["ginger root", "ginger"] },
  { id: "fresh-herbs", name: "Fresh herbs", synonyms: ["herbs"] },
  { id: "rice-vinegar", name: "Rice vinegar", synonyms: ["rice wine vinegar"] },
  { id: "shaoxing-wine", name: "Shaoxing wine", synonyms: ["chinese cooking wine"] },
  { id: "mirin", name: "Mirin", synonyms: ["sweet rice wine"] },
  { id: "wine", name: "Wine", synonyms: ["cooking wine"] },
  { id: "tomato-paste", name: "Tomato paste", synonyms: ["concentrated tomato"] },
  { id: "cornstarch", name: "Cornstarch", synonyms: ["corn starch", "corn flour"] },
  { id: "baking-powder", name: "Baking powder", synonyms: ["double acting baking powder"] },
  { id: "lemon-juice", name: "Lemon juice", synonyms: ["fresh lemon juice"] },
];

// Dishes/techniques
export const dishes = [
  "Cookies",
  "Cakes", 
  "Quick bread & pancakes",
  "Sauce/Gravy",
  "Cold topping",
  "Stir-fry/Marinade"
] as const;

export type Dish = typeof dishes[number];

// Units matching backend
export const units = ["tsp", "tbsp", "cup", "g", "ml", "unit"] as const;
export type Unit = typeof units[number];

// Helper function to find ingredient by name or synonym
export function findIngredient(searchTerm: string): Ingredient | null {
  const term = searchTerm.toLowerCase().trim();
  return ingredients.find(ingredient => 
    ingredient.name.toLowerCase() === term || 
    ingredient.synonyms.some(synonym => synonym.toLowerCase() === term)
  ) || null;
}

// Helper function to get suggestions
export function getSuggestions(searchTerm: string, count: number = 5): Ingredient[] {
  const term = searchTerm.toLowerCase().trim();
  const matches = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(term) ||
    ingredient.synonyms.some(synonym => synonym.toLowerCase().includes(term))
  );
  return matches.slice(0, count);
}

// Sample stores for display
export const sampleStores: Store[] = [
  {
    name: "Whole Foods Market",
    distance: "0.3 mi",
    address: "123 Main St"
  },
  {
    name: "Trader Joe's", 
    distance: "0.7 mi",
    address: "456 Oak Ave"
  }
];
