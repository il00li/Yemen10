import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses = "glass-button inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "text-gray-800 hover:text-white",
      outline: "border-2 border-glass text-gray-700 hover:bg-primary hover:text-white",
      ghost: "bg-transparent hover:bg-glass text-gray-700"
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
