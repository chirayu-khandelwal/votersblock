
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VoteButton from "./VoteButton";
import type { Proposal } from "@/lib/types";

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: "for" | "against") => void;
}

const ProposalCard = ({ proposal, onVote }: ProposalCardProps) => {
  const totalVotes = proposal.votes_for + proposal.votes_against;
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{proposal.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{proposal.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>For: {proposal.votes_for}</span>
            <span>Against: {proposal.votes_against}</span>
          </div>
          <Progress value={forPercentage} className="h-2" />
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <VoteButton 
            type="for" 
            onClick={() => onVote(proposal.id, "for")} 
          />
          <VoteButton 
            type="against" 
            onClick={() => onVote(proposal.id, "against")} 
          />
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Deadline: {proposal.deadline.toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
