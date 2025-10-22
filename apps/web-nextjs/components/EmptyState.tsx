import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface EmptyStateProps {
  ingredient: string;
  message?: string;
}

export function EmptyState({ ingredient, message }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto" role="region" aria-live="polite">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg">No substitute available</h3>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {message || `We don't have substitution data for "${ingredient}" yet.`}
        </p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Try searching for common ingredients like:</p>
          <p>Butter, Eggs, Milk, Flour, or Sugar</p>
        </div>
      </CardContent>
    </Card>
  );
}