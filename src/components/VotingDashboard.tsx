
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProposalCard from "./ProposalCard";
import BlockchainDisplay from "./BlockchainDisplay";
import { getVotingContract } from "@/lib/contracts/VotingContract";
import type { Proposal, BlockchainTransaction, Web3State } from "@/lib/types";

const VotingDashboard = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    address: null,
    chainId: null,
  });

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast.error("Please install MetaMask to use this application");
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      const chainId = await window.ethereum.request({ 
        method: "eth_chainId" 
      });

      setWeb3State({
        isConnected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
      });

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWeb3State(prev => ({
          ...prev,
          address: accounts[0],
        }));
      });

      loadProposals();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const loadProposals = async () => {
    try {
      const contract = await getVotingContract();
      // This is a simplified example - you'd need to implement the actual contract calls
      // to fetch proposals from the blockchain
      toast.info("Loading proposals from blockchain...");
    } catch (error) {
      console.error("Failed to load proposals:", error);
      toast.error("Failed to load proposals from blockchain");
    }
  };

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    try {
      if (!web3State.isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      const contract = await getVotingContract();
      const tx = await contract.vote(proposalId, vote === "for");
      
      toast.info("Submitting vote to blockchain...");
      
      const receipt = await tx.wait();
      
      // Add new transaction
      const newTransaction: BlockchainTransaction = {
        hash: receipt.hash,
        timestamp: new Date(),
        voter: web3State.address!,
        proposalId,
        vote,
        confirmed: true,
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Update proposal votes
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

      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Failed to submit vote:", error);
      toast.error("Failed to submit vote to blockchain");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {!web3State.isConnected && (
        <div className="text-center">
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        </div>
      )}
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
