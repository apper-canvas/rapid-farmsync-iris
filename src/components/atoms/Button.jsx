import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary/50 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 focus:ring-primary/50 shadow-sm hover:shadow-md",
    accent: "bg-gradient-to-r from-accent to-orange-600 text-white hover:from-accent/90 hover:to-orange-600/90 focus:ring-accent/50 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-success/90 hover:to-green-600/90 focus:ring-success/50 shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 focus:ring-error/50 shadow-lg hover:shadow-xl",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-sm min-h-[44px]",
    lg: "px-6 py-3 text-base min-h-[48px]",
    xl: "px-8 py-4 text-lg min-h-[52px]"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;