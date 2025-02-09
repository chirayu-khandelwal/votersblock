
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: Date;
  contractId?: string; // ID on the blockchain
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  voter: string;
  proposalId: string;
  vote: "for" | "against";
  confirmed?: boolean;
}

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
}
