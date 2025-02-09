
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProposalCard from "./ProposalCard";
import BlockchainDisplay from "./BlockchainDisplay";
import { supabase } from "@/integrations/supabase/client";
import type { Proposal, BlockchainTransaction } from "@/lib/types";

const VotingDashboard = () => {
  const queryClient = useQueryClient();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);

  // Fetch proposals from Supabase
  const { data: proposals, isLoading, error } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }

      return data as Proposal[];
    }
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load proposals");
    }
  }, [error]);

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    try {
      const updateColumn = vote === "for" ? "votes_for" : "votes_against";
      
      const { data, error } = await supabase
        .from('proposals')
        .update({ [updateColumn]: supabase.rpc('increment', { row_id: proposalId, column_name: updateColumn }) })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) throw error;

      // Add new transaction
      const newTransaction: BlockchainTransaction = {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        timestamp: new Date(),
        voter: `0x${Math.random().toString(16).slice(2)}`,
        proposalId,
        vote,
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Invalidate and refetch proposals
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success(`Vote ${vote} recorded successfully`);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record vote");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {proposals?.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onVote={handleVote}
          />
        ))}
      </div>
      <BlockchainDisplay transactions={transactions} />
    </div>
  );
};

export default VotingDashboard;
