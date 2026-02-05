import * as React from "react";
import { cn } from "@/lib/utils";

export interface RetroUICardProps extends React.HTMLAttributes<HTMLDivElement> {
  rotate?: "none" | "1" | "-1" | "2" | "-2";
}

const RetroUICard = React.forwardRef<HTMLDivElement, RetroUICardProps>(
  ({ className, rotate = "none", ...props }, ref) => {
    const rotateClass = {
      none: "",
      "1": "brutal-rotate-1",
      "-1": "brutal-rotate-neg-1",
      "2": "brutal-rotate-2",
      "-2": "brutal-rotate-neg-2",
    }[rotate];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white text-black border-2 border-black p-4 sm:p-6 retroui-shadow",
          rotateClass,
          className
        )}
        {...props}
      />
    );
  }
);
RetroUICard.displayName = "RetroUICard";

const RetroUICardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-3 sm:mb-4", className)} {...props} />
));
RetroUICardHeader.displayName = "RetroUICardHeader";

const RetroUICardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl sm:text-2xl font-heading font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
RetroUICardTitle.displayName = "RetroUICardTitle";

const RetroUICardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm sm:text-base text-gray-600 mt-2", className)}
    {...props}
  />
));
RetroUICardDescription.displayName = "RetroUICardDescription";

const RetroUICardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
RetroUICardContent.displayName = "RetroUICardContent";

const RetroUICardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-3 sm:mt-4 flex items-center", className)} {...props} />
));
RetroUICardFooter.displayName = "RetroUICardFooter";

export {
  RetroUICard,
  RetroUICardHeader,
  RetroUICardTitle,
  RetroUICardDescription,
  RetroUICardContent,
  RetroUICardFooter,
};