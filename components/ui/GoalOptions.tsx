"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface GoalOptionProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const GoalOption = ({ label, isSelected, onClick }: GoalOptionProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
        isSelected 
          ? "border-white bg-white/10 text-white" 
          : "border-gray-800 bg-transparent text-gray-500 hover:border-gray-600"
      }`}
    >
      <span className="text-lg font-bold">{label}</span>
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="text-white"
        >
          <CheckCircle2 size={24} />
        </motion.div>
      )}
    </motion.div>
  );
};
