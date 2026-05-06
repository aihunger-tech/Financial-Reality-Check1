"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mb-12">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      />
    </div>
  );
};
