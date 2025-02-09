
export interface Proposal {
  id: string;
  title: string;
  description: string;
  votes_for: number;
  votes_against: number;
  deadline: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  voter: string;
  proposalId: string;
  vote: "for" | "against";
}
