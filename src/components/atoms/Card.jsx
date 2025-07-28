import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  gradient = false,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        hover && "hover:shadow-lg hover:scale-[1.01] transition-all duration-300",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;