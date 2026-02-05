import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { RoastCard } from "@/components/roast/RoastCard";
import { RetroUIBadge } from "@/components/retroui/badge";
import { Navbar } from "@/components/layout/Navbar";

const mockRoasts = [
  {
    id: "1",
    startupName: "UberForDogs",
    date: "Jan 5, 2024",
    score: 8.5,
    preview: "Your competitive advantage is that you have no competition because no one wants to build this.",
  },
  {
    id: "2",
    startupName: "BlockchainBread",
    date: "Jan 3, 2024",
    score: 9.2,
    preview: "Putting bread on the blockchain is certainly... a choice you made.",
  },
  {
    id: "3",
    startupName: "AIForAI",
    date: "Dec 28, 2023",
    score: 7.8,
    preview: "An AI to help other AIs? Your investors will love explaining this to their investors.",
  },
  {
    id: "4",
    startupName: "MetaverseGym",
    date: "Dec 20, 2023",
    score: 9.5,
    preview: "Working out in VR so you can be fit in a virtual world while deteriorating in the real one.",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Roast History</h1>
              <RetroUIBadge>{mockRoasts.length} Roasts</RetroUIBadge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your collection of brutal truths and emotional damage.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-primary p-4 sm:p-6 border-2 border-foreground">
              <p className="text-xs sm:text-sm font-bold opacity-80">Total Roasts</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">{mockRoasts.length}</p>
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 sm:p-6 border-2 border-foreground">
              <p className="text-xs sm:text-sm font-bold opacity-80">Avg Score</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">8.7</p>
            </div>
            <div className="bg-muted p-4 sm:p-6 border-2 border-foreground">
              <p className="text-xs sm:text-sm font-bold opacity-80">Tears Shed</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">∞</p>
            </div>
          </div>

          {/* Roast Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
            {mockRoasts.map((roast) => (
              <RoastCard key={roast.id} {...roast} />
            ))}
          </div>

          {/* Empty State (hidden when there are roasts) */}
          {mockRoasts.length === 0 && (
            <div className="text-center py-16 sm:py-20 border-2 border-dashed border-muted-foreground">
              <p className="text-5xl sm:text-6xl mb-4">💀</p>
              <h3 className="text-lg sm:text-xl font-bold mb-2">No roasts yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your ego is still intact. Let's fix that.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
