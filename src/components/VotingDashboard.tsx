
import { useState } from "react";
import ProposalCard from "./ProposalCard";
import BlockchainDisplay from "./BlockchainDisplay";
import type { Proposal, BlockchainTransaction } from "@/lib/types";

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Community Fund Allocation",
    description: "Proposal to allocate 10% of treasury to community initiatives.",
    votesFor: 150,
    votesAgainst: 50,
    deadline: new Date("2024-12-31"),
  },
  {
    id: "2",
    title: "Protocol Upgrade",
    description: "Implement new security features in the voting mechanism.",
    votesFor: 200,
    votesAgainst: 25,
    deadline: new Date("2024-12-25"),
  },
];

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
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(mockTransactions);

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    setProposals(proposals.map(proposal => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          votesFor: vote === "for" ? proposal.votesFor + 1 : proposal.votesFor,
          votesAgainst: vote === "against" ? proposal.votesAgainst + 1 : proposal.votesAgainst,
        };
      }
      return proposal;
    }));

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
