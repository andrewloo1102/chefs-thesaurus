import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { dishes, type Dish } from "@/lib/data/ingredients";

interface DishSelectProps {
  value: Dish | null;
  onChange: (dish: Dish | null) => void;
  placeholder?: string;
}

export function DishSelect({ value, onChange, placeholder = "Select dish type..." }: DishSelectProps) {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (dish: Dish) => {
    onChange(dish === value ? null : dish);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="dish">Dish/Technique (optional)</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="dish"
            variant="outline"
            role="combobox"
            aria-haspopup="listbox"
            className="w-full h-11 justify-between text-left font-normal"
          >
            {value ? (
              <span>{value}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {dishes.map((dish) => (
                  <CommandItem
                    key={dish}
                    value={dish}
                    onSelect={() => handleSelect(dish)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === dish ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {dish}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}