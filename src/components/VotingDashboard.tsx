
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProposalCard from "./ProposalCard";
import BlockchainDisplay from "./BlockchainDisplay";
import type { Proposal, BlockchainTransaction } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

const mockTransactions: BlockchainTransaction[] = [
  {
    hash: "0x1234...5678",
    timestamp: new Date(),
    voter: "0xabcd...efgh",
    proposalId: "1",
    vote: "for",
  },
  {
    hash: "0x8765...4321",
    timestamp: new Date(),
    voter: "0xijkl...mnop",
    proposalId: "2",
    vote: "against",
  },
];

const VotingDashboard = () => {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(mockTransactions);
  const queryClient = useQueryClient();

  // Fetch proposals
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        toast.error('Failed to load proposals');
        throw error;
      }

      return data.map(proposal => ({
        ...proposal,
        deadline: new Date(proposal.deadline),
        created_at: proposal.created_at ? new Date(proposal.created_at) : undefined,
        updated_at: proposal.updated_at ? new Date(proposal.updated_at) : undefined,
      }));
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string, vote: "for" | "against" }) => {
      const column = vote === "for" ? "votes_for" : "votes_against";
      const { data, error } = await supabase
        .from('proposals')
        .update({ [column]: supabase.rpc('increment') })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) {
        console.error('Error voting:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Vote recorded successfully');
    },
    onError: (error) => {
      console.error('Voting failed:', error);
      toast.error('Failed to record vote');
    },
  });

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    await voteMutation.mutateAsync({ proposalId, vote });

    // Add new transaction
    const newTransaction: BlockchainTransaction = {
      hash: `0x${Math.random().toString(16).slice(2)}`,
      timestamp: new Date(),
      voter: `0x${Math.random().toString(16).slice(2)}`,
      proposalId,
      vote,
    };

    setTransactions([newTransaction, ...transactions]);
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
        {proposals.map((proposal) => (
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
