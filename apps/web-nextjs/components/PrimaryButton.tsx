import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({ onClick, disabled = false, loading = false }: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-11"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Finding substitute...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Find substitute
        </div>
      )}
    </Button>
  );
}