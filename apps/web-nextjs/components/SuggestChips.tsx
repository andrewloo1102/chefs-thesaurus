import { Badge } from "@/components/ui/badge";
import { ingredients, type Ingredient, type Dish, type Unit } from "@/lib/data/ingredients";

interface ExampleCombo {
  ingredient: string;
  dish?: Dish;
  quantity?: number;
  unit?: Unit;
  label: string;
}

const exampleCombos: ExampleCombo[] = [
  {
    ingredient: "butter",
    dish: "Cookies",
    quantity: 1,
    unit: "cup",
    label: "1 cup Butter → Cookies"
  },
  {
    ingredient: "sour-cream", 
    dish: "Cold topping",
    quantity: 0.5,
    unit: "cup",
    label: "1/2 cup Sour cream → Cold topping"
  },
  {
    ingredient: "garlic-clove",
    dish: "Sauce/Gravy", 
    quantity: 2,
    unit: "unit",
    label: "2 Garlic cloves → Sauce/Gravy"
  },
  {
    ingredient: "eggs",
    dish: "Cakes",
    quantity: 2,
    label: "2 Eggs → Cakes"
  },
  {
    ingredient: "milk",
    dish: "Quick bread & pancakes",
    quantity: 1,
    unit: "cup",
    label: "1 cup Milk → Quick bread"
  }
];

interface SuggestChipsProps {
  onChipClick: (combo: {
    ingredient: Ingredient | null;
    quantity: number | "";
    unit: Unit | null;
    dish: Dish | null;
  }) => void;
}

export function SuggestChips({ onChipClick }: SuggestChipsProps) {
  const handleChipClick = (combo: ExampleCombo) => {
    const ingredient = ingredients.find(ing => ing.id === combo.ingredient) || null;
    
    onChipClick({
      ingredient,
      quantity: combo.quantity || "",
      unit: combo.unit || null,
      dish: combo.dish || null
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Try these examples:</p>
      <div className="flex flex-wrap gap-2">
        {exampleCombos.map((combo, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5 text-xs"
            onClick={() => handleChipClick(combo)}
          >
            {combo.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}