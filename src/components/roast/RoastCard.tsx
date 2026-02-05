import { RetroUICard, RetroUICardContent } from "@/components/retroui/card";
import { Link } from "react-router-dom";
import { Eye, Skull, Calendar } from "lucide-react";

interface RoastCardProps {
  id: string;
  startupName: string;
  date: string;
  score: number;
  preview: string;
}

export function RoastCard({ id, startupName, date, score, preview }: RoastCardProps) {
  return (
    <RetroUICard className="hover:translate-x-1 hover:translate-y-1 transition-transform">
      <RetroUICardContent>
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate">{startupName}</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 sm:px-3 py-1 border-2 border-foreground flex-shrink-0">
            <Skull className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-bold text-xs sm:text-sm">{score}/10</span>
          </div>
        </div>

        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4 font-mono">
          "{preview}"
        </p>

        <Link
          to={`/result?id=${id}`}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-2 border-2 border-foreground font-bold text-xs sm:text-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          View Roast
        </Link>
      </RetroUICardContent>
    </RetroUICard>
  );
}
