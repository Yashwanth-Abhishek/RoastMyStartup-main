import * as React from "react";
import { cn } from "@/lib/utils";

export interface RetroUIProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
}

const RetroUIProgress = React.forwardRef<HTMLDivElement, RetroUIProgressProps>(
  ({ className, value, max = 100, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold">{label}</span>
            <span className="text-xs sm:text-sm font-mono">{value}/{max}</span>
          </div>
        )}
        <div className="h-5 sm:h-6 w-full border-2 border-black bg-white retroui-shadow">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
RetroUIProgress.displayName = "RetroUIProgress";

export { RetroUIProgress };