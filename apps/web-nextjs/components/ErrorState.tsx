import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message }: ErrorStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto" role="region" aria-live="assertive">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg">Something went wrong</h3>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {message || "Unable to find substitutions right now. Please try again."}
        </p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}