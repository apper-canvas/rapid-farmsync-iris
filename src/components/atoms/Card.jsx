import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, children, hover = false, ...props }, ref) => {
  const Component = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { scale: 1.02, y: -2 },
        transition: { duration: 0.2 }
      }
    : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200",
        hover && "hover:shadow-md cursor-pointer",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;