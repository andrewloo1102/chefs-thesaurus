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