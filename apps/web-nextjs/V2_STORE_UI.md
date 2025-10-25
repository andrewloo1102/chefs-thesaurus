# V2 Store UI Reference

This document preserves the store locator UI code for V2 implementation.

## Overview
The store locator feature allows users to find nearby stores where they can purchase substitutes. The UI displays:
- Store names
- Distance from user
- "Open in Maps" functionality
- Visual layout with icons

## Files Affected

### 1. `components/StoreRow.tsx`
Complete component for displaying individual store information.

```tsx
import { MapPin } from "lucide-react";
import { type Store } from "@/lib/data/ingredients";

interface StoreRowProps {
  store: Store;
}

export function StoreRow({ store }: StoreRowProps) {
  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${store.name} ${store.address}`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{store.name}</p>
          <p className="text-xs text-muted-foreground">{store.distance} away</p>
        </div>
      </div>
      <button
        onClick={handleOpenMaps}
        className="text-sm text-primary hover:underline focus:underline focus:outline-none"
      >
        Open in Maps
      </button>
    </div>
  );
}
```

### 2. `components/ResultCard.tsx` - Store Section
The stores section that renders in the result card.

```tsx
{/* Stores */}
<div className="space-y-3">
  <h4>Nearby stores:</h4>
  <div className="space-y-2">
    {result.stores.map((store, index) => (
      <StoreRow key={index} store={store} />
    ))}
  </div>
</div>
```

### 3. `lib/data/ingredients.ts` - Store Types and Sample Data
```typescript
export interface Store {
  name: string;
  distance: string;
  address: string;
}

export const sampleStores: Store[] = [
  {
    name: "Whole Foods Market",
    distance: "0.3 mi",
    address: "123 Main St"
  },
  {
    name: "Trader Joe's", 
    distance: "0.7 mi",
    address: "456 Oak Ave"
  }
];
```

### 4. `app/page.tsx` - Store API Integration
The code that fetches and processes store data.

```typescript
// In ResultData interface
stores: typeof sampleStores;

// In findSubstitute function
// Convert stores to UI format
const uiStores = (response.stores || []).map(store => ({
  name: store.name,
  distance: `${(store.distance_m / 1609.34).toFixed(1)} mi`,
  address: "View on map"
}));

// In resultData
stores: uiStores.length > 0 ? uiStores : sampleStores
```

## V2 Implementation Notes

### API Options Discussed:

1. **Google Places API** (Recommended for V2)
   - Pros: Best data quality, easy integration, free tier (900 req/day)
   - Cons: Cannot check actual product inventory (stores only)
   - Cost: Free up to 28,000 requests/month
   - Implementation: 15 lines of code in `packages/core/src/substitutions.ts`

2. **Headless Browser Scraping** (Instacart/DoorDash)
   - Pros: Real inventory data
   - Cons: Very slow (15-30 seconds), legally risky (ToS violations), brittle
   - Performance: CPU-intensive, not suitable for serverless
   - Legal: Violates Terms of Service, risk of IP bans

3. **Kroger API** (US only)
   - Pros: Free, real inventory
   - Cons: Limited to Kroger stores only
   - Implementation: Similar to Google Places API

### Recommended V2 Approach:

Use **Google Places API** with a disclaimer:
- Show nearby grocery stores
- Add disclaimer: "These stores may carry this ingredient. Call ahead to confirm availability."
- This provides value while being honest about limitations

### Implementation Code (V2):

```typescript
export async function lookupStores(args: StoreLookupArgs): Promise<Store[]> {
  const { query, lat, lon, radius_m = 5000 } = args;
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lon}&radius=${radius_m}&type=supermarket&` +
    `key=${process.env.GOOGLE_PLACES_API_KEY}`
  );
  
  const data = await response.json();
  return data.results.slice(0, 5).map((place: any) => ({
    name: place.name,
    lat: place.geometry.location.lat,
    lon: place.geometry.location.lng,
    distance_m: calculateDistance(lat, lon, place.geometry.location.lat, place.geometry.location.lng),
    rating: place.rating,
    open_now: place.opening_hours?.open_now,
  }));
}
```

## Restoration Steps for V2

1. Uncomment store section in `components/ResultCard.tsx`
2. Add back `StoreRow` import to `ResultCard.tsx`
3. Restore store API call in `app/page.tsx` (uncomment and re-enable)
4. Implement real `lookupStores` function in `packages/core/src/substitutions.ts`
5. Add `GOOGLE_PLACES_API_KEY` environment variable
6. Re-enable `lookup_stores` tool in MCP servers
