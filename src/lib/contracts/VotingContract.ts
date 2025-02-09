
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ABI for the smart contract
export const VOTING_CONTRACT_ABI = [
  "function createProposal(string title, string description, uint256 deadline)",
  "function vote(uint256 proposalId, bool isForVote)",
  "function getProposal(uint256 proposalId) view returns (string, string, uint256, uint256, uint256)",
  "event ProposalCreated(uint256 indexed proposalId, string title)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool isForVote)",
];

// Sepolia testnet contract address
export const VOTING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with your deployed contract address

export const getVotingContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Please install MetaMask to use this application");
  }

  // Request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Check if we're on Sepolia testnet
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0xaa36a7") { // Sepolia chainId
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
      });
    } catch (error: any) {
      throw new Error("Please switch to Sepolia testnet in MetaMask");
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
};
