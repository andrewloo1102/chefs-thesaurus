import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { units, type Unit } from "@/lib/data/ingredients";

interface UnitSelectProps {
  value: Unit | null;
  onChange: (unit: Unit | null) => void;
  placeholder?: string;
}

export function UnitSelect({ value, onChange, placeholder = "Select unit..." }: UnitSelectProps) {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (unit: Unit) => {
    onChange(unit === value ? null : unit);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="unit">Unit (optional)</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="unit"
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
                {units.map((unit) => (
                  <CommandItem
                    key={unit}
                    value={unit}
                    onSelect={() => handleSelect(unit)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === unit ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {unit}
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