import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const retrouiBadgeVariants = cva(
  "inline-flex items-center border-2 border-black px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold retroui-shadow",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-black",
        secondary: "bg-black text-white",
        outline: "bg-white text-black",
        destructive: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface RetroUIBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof retrouiBadgeVariants> {}

function RetroUIBadge({ className, variant, ...props }: RetroUIBadgeProps) {
  return (
    <div className={cn(retrouiBadgeVariants({ variant }), className)} {...props} />
  );
}

export { RetroUIBadge, retrouiBadgeVariants };