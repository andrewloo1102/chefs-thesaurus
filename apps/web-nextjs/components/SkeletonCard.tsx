import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-md mx-auto" role="region" aria-live="polite" aria-label="Loading substitute information">
      <CardHeader className="text-center pb-4">
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ratio skeleton */}
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-20 mx-auto" />
          <Skeleton className="h-3 w-28 mx-auto" />
        </div>
        
        {/* Effects skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Skeleton className="w-1 h-1 rounded-full mt-2 shrink-0" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="w-1 h-1 rounded-full mt-2 shrink-0" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </div>
        
        {/* Tip skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        
        {/* Stores skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}