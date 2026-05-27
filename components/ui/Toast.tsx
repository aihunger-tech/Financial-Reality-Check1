import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

export const Toast = ({ message, type = "info", duration = 3000 }: ToastProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-lg min-w-[300px] ${
        type === "success" ? "bg-emerald-500/90 border-emerald-400 text-white" : 
        type === "error" ? "bg-red-500/90 border-red-400 text-white" : 
        "bg-zinc-800/90 border-white/10 text-white"
      }`}
    >
      {type === "success" && <CheckCircle2 size={20} />}
      {type === "error" && <AlertCircle size={20} />}
      {type === "info" && <Info size={20} />}
      <p className="font-medium text-sm">{message}</p>
    </motion.div>
  );
};