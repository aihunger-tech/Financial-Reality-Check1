"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Target, Zap, Lock } from "lucide-react";

interface BlueprintTeaserProps {
  tier: string;
  score: number;
}

export default function BlueprintTeaser({ tier, score }: BlueprintTeaserProps) {
  return (
    <div className="relative w-full my-12 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500 rounded-lg">
              <LayoutDashboard size={16} className="text-black" />
            </div>
            <span className="text-xs font-bold tracking-tight text-gray-300">Wealth OS v1.0</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          </div>
        </div>

        {/* Mock Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <TrendingUp size={12} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Net Worth Vector</span>
              </div>
              <div className="text-xl font-black text-white">Calculating...</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Target size={12} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Freedom %</span>
              </div>
              <div className="text-xl font-black text-white">{score}%</div>
            </div>
          </div>

          {/* Mock Chart */}
          <div className="h-32 w-full bg-zinc-900 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }} />
            <div className="relative h-full flex items-end gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="flex-1 bg-blue-500/40 border-t-2 border-blue-400 rounded-t-sm"
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
              <Zap size={10} />
              <span className="text-[9px] font-black uppercase tracking-tighter">AI Optimizing</span>
            </div>
          </div>

          {/* AI Module Teaser */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-black border border-white/10 text-blue-400">
              <Zap size={20} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white mb-1">Wealth Accelerator</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">
                Your <b>{tier}</b> profile is compatible with the High-Yield strategy.
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none flex items-end justify-center pb-6">
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
             <Lock size={12} />
             Interactive Preview Locked
           </div>
        </div>
      </div>
    </div>
  );
}
