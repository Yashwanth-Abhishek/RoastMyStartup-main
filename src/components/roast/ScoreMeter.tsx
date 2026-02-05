import { Skull } from "lucide-react";

interface ScoreMeterProps {
  score: number;
  maxScore?: number;
}

export function ScoreMeter({ score, maxScore = 10 }: ScoreMeterProps) {
  const percentage = (score / maxScore) * 100;

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 8) return "bg-accent"; // Red for brutal
    if (score >= 5) return "bg-primary"; // Yellow for medium
    return "bg-muted"; // Muted for low
  };

  return (
    <div className="text-center px-4">
      <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-secondary text-secondary-foreground px-4 sm:px-8 py-3 sm:py-4 border-2 border-foreground mb-4">
        <Skull className="h-8 w-8 sm:h-10 sm:w-10" />
        <div className="text-center sm:text-left">
          <p className="text-xs sm:text-sm font-bold opacity-80">ROAST SCORE</p>
          <p className="text-4xl sm:text-5xl font-bold">
            {score.toFixed(1)} / {maxScore}
          </p>
        </div>
      </div>

      {/* Visual meter */}
      <div className="w-full max-w-md mx-auto">
        <div className="h-6 sm:h-8 w-full border-2 border-foreground bg-background flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 border-r border-foreground last:border-r-0 transition-colors ${
                i < score ? getScoreColor() : "bg-background"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs sm:text-sm font-bold">
          <span>Mild 🌶️</span>
          <span>Nuclear ☢️</span>
        </div>
      </div>
    </div>
  );
}
