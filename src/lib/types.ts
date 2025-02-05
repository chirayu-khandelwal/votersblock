
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes_for: number;
  votes_against: number;
  deadline: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  voter: string;
  proposalId: string;
  vote: "for" | "against";
}
