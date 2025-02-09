
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: Date;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  voter: string;
  proposalId: string;
  vote: "for" | "against";
}
