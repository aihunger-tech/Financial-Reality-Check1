"use client";

import React from "react";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isOptional?: boolean;
}

export const Input = ({ label, isOptional, ...props }: InputProps) => {
  return (
    <div className="w-full mb-8">
      <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">
        {label} {isOptional && <span className="text-gray-600">(Optional)</span>}
      </label>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <input
          {...props}
          className="w-full bg-transparent text-white text-4xl md:text-5xl font-black border-b-4 border-gray-800 focus:border-white outline-none transition-all duration-300 py-2 placeholder:text-gray-800"
        />
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-white w-0 group-focus:w-full transition-all duration-500" 
        />
      </motion.div>
    </div>
  );
};
