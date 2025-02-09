
import { ethers } from "ethers";

// ABI for the smart contract
export const VOTING_CONTRACT_ABI = [
  "function createProposal(string title, string description, uint256 deadline)",
  "function vote(uint256 proposalId, bool isForVote)",
  "function getProposal(uint256 proposalId) view returns (string, string, uint256, uint256, uint256)",
  "event ProposalCreated(uint256 indexed proposalId, string title)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool isForVote)",
];

// This would be your deployed contract address
export const VOTING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual deployed contract address

export const getVotingContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask to use this application");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
};
