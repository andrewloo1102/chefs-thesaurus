import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { StoreRow } from "@/components/StoreRow"; // V2: Re-enable when implementing store lookup
import { type Ingredient, type Dish, type Unit } from "@/lib/data/ingredients";

interface ResultData {
  originalIngredient: Ingredient;
  substitute: string;
  ratio: string;
  computedAmount?: string;
  effects: [string, string];
  tip: string;
  // stores: Store[]; // V2: Re-enable when implementing store lookup
}

interface ResultCardProps {
  result: ResultData;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto" role="region" aria-live="polite">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">
          {result.substitute}
        </CardTitle>
        <p className="text-muted-foreground">
          instead of {result.originalIngredient.name}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ratio/Amount */}
        <div className="text-center">
          <div className="text-4xl mb-1">
            {result.computedAmount || result.ratio}
          </div>
          <p className="text-sm text-muted-foreground">
            {result.computedAmount ? "amount needed" : "substitution ratio"}
          </p>
        </div>
        
        {/* Effects */}
        <div className="space-y-2">
          <h4>Effects:</h4>
          <ul className="space-y-1">
            {result.effects.map((effect, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                {effect}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tip */}
        <div className="space-y-2">
          <h4>Tip:</h4>
          <p className="text-sm text-muted-foreground">{result.tip}</p>
        </div>
        
        {/* Stores - V2: Re-enable when implementing store lookup with Google Places API */}
        {/* 
        <div className="space-y-3">
          <h4>Nearby stores:</h4>
          <div className="space-y-2">
            {result.stores.map((store, index) => (
              <StoreRow key={index} store={store} />
            ))}
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
}