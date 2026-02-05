import * as React from "react";
import { cn } from "@/lib/utils";

export interface RetroUITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const RetroUITextarea = React.forwardRef<HTMLTextAreaElement, RetroUITextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] sm:min-h-[120px] w-full border-2 border-black bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none retroui-shadow",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
RetroUITextarea.displayName = "RetroUITextarea";

export { RetroUITextarea };