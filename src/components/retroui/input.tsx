import * as React from "react";
import { cn } from "@/lib/utils";

export interface RetroUIInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const RetroUIInput = React.forwardRef<HTMLInputElement, RetroUIInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 sm:h-12 w-full border-2 border-black bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 retroui-shadow",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
RetroUIInput.displayName = "RetroUIInput";

export { RetroUIInput };