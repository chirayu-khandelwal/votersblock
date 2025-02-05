import { ScrollArea } from "@/components/ui/scroll-area";
import type { BlockchainTransaction } from "@/lib/types";

interface BlockchainDisplayProps {
  transactions: BlockchainTransaction[];
}

const BlockchainDisplay = ({ transactions }: BlockchainDisplayProps) => {
  return (
    <div className="border rounded-lg p-4 bg-black/5">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="p-2 bg-white rounded border font-mono text-xs"
            >
              <div className="flex justify-between text-muted-foreground">
                <span>{tx.timestamp.toLocaleTimeString()}</span>
                <span>{tx.vote.toUpperCase()}</span>
              </div>
              <div className="truncate text-primary">
                {tx.hash}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlockchainDisplay;