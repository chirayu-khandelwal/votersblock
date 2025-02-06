
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
  const [transactions] = useState<BlockchainTransaction[]>(mockTransactions);
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
        toast.error('Error fetching proposals');
        throw error;
      }

      return data.map(proposal => ({
        ...proposal,
        id: proposal.id,
        deadline: new Date(proposal.deadline),
      })) as Proposal[];
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: "for" | "against" }) => {
      const updateColumn = vote === "for" ? "votes_for" : "votes_against";
      
      const { data, error } = await supabase
        .from('proposals')
        .update({ [updateColumn]: supabase.rpc('increment') })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) {
        toast.error('Error casting vote');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Vote cast successfully!');
    },
    onError: (error) => {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote. Please try again.');
    },
  });

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    voteMutation.mutate({ proposalId, vote });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
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
