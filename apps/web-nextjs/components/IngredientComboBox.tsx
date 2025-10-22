import { useState } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ingredients, type Ingredient } from "@/lib/data/ingredients";

interface IngredientComboBoxProps {
  value: Ingredient | null;
  onChange: (ingredient: Ingredient | null) => void;
  placeholder?: string;
}

export function IngredientComboBox({ value, onChange, placeholder = "Select ingredient..." }: IngredientComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSelect = (ingredient: Ingredient) => {
    onChange(ingredient);
    setSearchValue("");
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchValue("");
  };

  const filteredIngredients = searchValue 
    ? ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        ingredient.synonyms.some(synonym => 
          synonym.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : ingredients;

  return (
    <div className="space-y-2">
      <Label htmlFor="ingredient">Ingredient</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="ingredient"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-11 justify-between text-left font-normal"
          >
            {value ? (
              <span className="flex-1 truncate">{value.name}</span>
            ) : (
              <span className="text-muted-foreground flex-1">{placeholder}</span>
            )}
            <div className="flex items-center gap-1">
              {value && (
                <X 
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer" 
                  onClick={handleClear}
                />
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="flex flex-col">
            {/* Search Input */}
            <div className="flex items-center border-b px-3 h-10">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                id="ingredient-search"
                name="ingredient-search"
                placeholder="Search ingredients..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 px-0"
                autoComplete="off"
              />
            </div>

            {/* Results List */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredIngredients.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No ingredients found.
                </div>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    onClick={() => handleSelect(ingredient)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value?.id === ingredient.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex-1">
                      <div>{ingredient.name}</div>
                      {ingredient.synonyms.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Also: {ingredient.synonyms.slice(0, 2).join(", ")}
                          {ingredient.synonyms.length > 2 && "..."}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
