"use client";

import { useState } from "react";

export const dynamic = 'force-dynamic';

import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IngredientComboBox } from "@/components/IngredientComboBox";
import { QuantityInput } from "@/components/QuantityInput";
import { UnitSelect } from "@/components/UnitSelect";
import { DishSelect } from "@/components/DishSelect";
import { SuggestChips } from "@/components/SuggestChips";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { 
  type Ingredient, 
  type Dish, 
  type Unit
  // sampleStores // V2: Re-enable when implementing store lookup
} from "@/lib/data/ingredients";
import { api } from "@/lib/api";

type AppState = "idle" | "loading" | "success" | "empty" | "error";

interface FormData {
  ingredient: Ingredient | null;
  quantity: number | "";
  unit: Unit | null;
  dish: Dish | null;
}

interface ResultData {
  originalIngredient: Ingredient;
  substitute: string;
  ratio: string;
  computedAmount?: string;
  effects: [string, string];
  tip: string;
  // stores: typeof sampleStores; // V2: Re-enable when implementing store lookup
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    ingredient: null,
    quantity: "",
    unit: null,
    dish: null
  });
  
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<ResultData | null>(null);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleChipClick = (combo: FormData) => {
    setFormData(combo);
  };

  // const calculateAmount = (
  //   originalQuantity: number,
  //   originalUnit: string,
  //   ratio: string
  // ): string => {
  //   // Simple ratio calculation - in a real app this would be more sophisticated
  //   const [substitutePart, originalPart] = ratio.split(" : ").map(part => {
  //     // Handle fractions like "3/4"
  //     if (part.includes("/")) {
  //       const [num, den] = part.split("/").map(Number);
  //       return num / den;
  //     }
  //     return parseFloat(part);
  //   });
  //   
  //   const multiplier = substitutePart / originalPart;
  //   const newAmount = originalQuantity * multiplier;
  //   
  //   // Format nicely
  //   if (newAmount === Math.floor(newAmount)) {
  //     return `${newAmount} ${originalUnit}`;
  //   } else if (newAmount < 1) {
  //     // Convert to fraction for small amounts
  //     const fraction = newAmount.toFixed(2);
  //     return `${fraction} ${originalUnit}`;
  //   } else {
  //     return `${newAmount.toFixed(1)} ${originalUnit}`;
  //   }
  // };

  const findSubstitute = async () => {
    if (!formData.ingredient) return;

    setState("loading");
    setResult(null);

    try {
      // Call the consolidated API endpoint
      const response = await api.searchSubstitute({
        ingredient: formData.ingredient.name,
        quantity: formData.quantity || undefined,
        unit: formData.unit || undefined,
        dish: formData.dish || undefined,
        // lat: 40.7128, // V2: Re-enable when implementing store lookup
        // lon: -74.0060, // V2: Re-enable when implementing store lookup
      });

      if (!response.supported || !response.substitute) {
        setState("empty");
        return;
      }

      // Format the ratio for display
      const ratio = response.quantity && response.unit 
        ? `${response.quantity} ${response.unit}` 
        : "1 : 1";

      // V2: Re-enable when implementing store lookup
      // Convert stores to UI format
      // const uiStores = (response.stores || []).map(store => ({
      //   name: store.name,
      //   distance: `${(store.distance_m / 1609.34).toFixed(1)} mi`,
      //   address: "View on map"
      // }));

      const resultData: ResultData = {
        originalIngredient: formData.ingredient,
        substitute: response.substitute,
        ratio: ratio,
        computedAmount: response.quantity && response.unit 
          ? `${response.quantity} ${response.unit}` 
          : undefined,
        effects: [
          "Maintains similar properties", 
          response.effects?.summary || "Comparable outcome for most dishes."
        ] as [string, string],
        tip: response.notes || "Follow standard substitution practices.",
        // stores: uiStores.length > 0 ? uiStores : sampleStores // V2: Re-enable when implementing store lookup
      };

      setResult(resultData);
      setState("success");
      
    } catch (error) {
      console.error("Error finding substitute:", error);
      setState("error");
    }
  };

  const handleRetry = () => {
    findSubstitute();
  };

  const handleClear = () => {
    setFormData({
      ingredient: null,
      quantity: "",
      unit: null,
      dish: null
    });
    setResult(null);
    setState("idle");
  };

  const canSubmit = formData.ingredient !== null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-md lg:max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-7 w-7 text-primary bg-primary/10 rounded-full flex items-center justify-center">
              <ChefHat className="h-4 w-4" />
            </div>
            <h1 className="text-xl">Chef's Thesaurus</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Find the perfect cooking substitutions with precise measurements and helpful tips.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Form Section */}
          <div className="space-y-6 mb-8 lg:mb-0">
            {/* Input Form */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              <div className="lg:col-span-2">
                <IngredientComboBox
                  value={formData.ingredient}
                  onChange={(ingredient) => updateFormData({ ingredient })}
                />
              </div>
              
              <QuantityInput
                value={formData.quantity}
                onChange={(quantity) => updateFormData({ quantity })}
              />
              
              <UnitSelect
                value={formData.unit}
                onChange={(unit) => updateFormData({ unit })}
              />
              
              <div className="lg:col-span-2">
                <DishSelect
                  value={formData.dish}
                  onChange={(dish) => updateFormData({ dish })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <PrimaryButton
              onClick={findSubstitute}
              disabled={!canSubmit}
              loading={state === "loading"}
            />

            {/* Clear Button */}
            <Button
              onClick={handleClear}
              variant="outline"
              className="w-full"
              disabled={state === "idle" && !formData.ingredient}
            >
              Clear
            </Button>

            {/* Example Chips */}
            <SuggestChips onChipClick={handleChipClick} />
          </div>

          {/* Results Section */}
          <div className="flex justify-center lg:justify-start">
            {state === "loading" && <SkeletonCard />}
            {state === "success" && result && <ResultCard result={result} />}
            {state === "empty" && formData.ingredient && (
              <EmptyState ingredient={formData.ingredient.name} />
            )}
            {state === "error" && <ErrorState onRetry={handleRetry} />}
            {state === "idle" && (
              <div className="text-center text-muted-foreground max-w-sm mx-auto lg:mt-8">
                <p className="text-sm leading-relaxed">
                  Select an ingredient and click &quot;Find substitute&quot; to get started, or try one of the example combinations below.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
