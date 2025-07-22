import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", value, ...props }, ref) => {
  // Ensure value is always a string or number for proper display
  const safeValue = React.useMemo(() => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      // Handle objects by converting to empty string to prevent [object Object]
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return '';
    }
    return String(value);
  }, [value]);

  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      value={safeValue}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;