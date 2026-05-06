"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// We extend HTMLMotionProps instead of React.ButtonHTMLAttributes
// to prevent conflicts between standard HTML events and Framer Motion events
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button = ({ 
  variant = "primary", 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border-2 border-white text-white hover:bg-white hover:text-black",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
