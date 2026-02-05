import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const retrouiButtonVariants = cva(
  "inline-flex items-center justify-center font-bold text-base transition-transform duration-100 border-2 border-black rounded-none cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none retroui-shadow hover:translate-x-1 hover:translate-y-1 active:translate-x-0.5 active:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-black hover:bg-yellow-300",
        secondary: "bg-black text-white hover:bg-gray-800",
        outline: "bg-white text-black hover:bg-gray-100",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 sm:h-12 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base",
        sm: "h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
        lg: "h-12 sm:h-14 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg",
        xl: "h-14 sm:h-16 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl",
        icon: "h-10 w-10 sm:h-12 sm:w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface RetroUIButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof retrouiButtonVariants> {}

const RetroUIButton = React.forwardRef<HTMLButtonElement, RetroUIButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(retrouiButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
RetroUIButton.displayName = "RetroUIButton";

export { RetroUIButton, retrouiButtonVariants };