import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  type: "for" | "against";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const VoteButton = ({ type, onClick, disabled, className }: VoteButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-w-[120px]",
        type === "for" 
          ? "bg-emerald-500 hover:bg-emerald-600" 
          : "bg-red-500 hover:bg-red-600",
        className
      )}
    >
      Vote {type === "for" ? "For" : "Against"}
    </Button>
  );
};

export default VoteButton;