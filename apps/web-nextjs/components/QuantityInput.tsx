import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuantityInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder?: string;
}

export function QuantityInput({ value, onChange, placeholder = "Amount" }: QuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === "") {
      onChange("");
      return;
    }
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity (optional)</Label>
      <Input
        id="quantity"
        type="number"
        step="0.25"
        min="0"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-11"
      />
    </div>
  );
}