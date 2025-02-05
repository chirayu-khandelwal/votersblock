import VotingDashboard from "@/components/VotingDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="gradient-bg text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">VoteLedger</h1>
          <p className="text-lg opacity-90">
            A secure and transparent blockchain-based voting system
          </p>
        </div>
      </header>

      <main className="py-8">
        <VotingDashboard />
      </main>

      <footer className="border-t mt-16 py-8 text-center text-sm text-muted-foreground">
        <p>VoteLedger - Blockchain Voting System</p>
      </footer>
    </div>
  );
};

export default Index;