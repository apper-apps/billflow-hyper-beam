import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 shadow-sm",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 shadow-sm",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm",
    pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm",
    paid: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 shadow-sm",
    overdue: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;