"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  ArrowRight, 
  Share2, 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  RefreshCcw,
  Loader2
} from "lucide-react";

// Internal Imports
import { useFinancialData } from "@/hooks/useFinancialData";
import { calculateFinancialReality } from "@/lib/scoring";
import { TIER_DATA, FORM_STEPS, FINANCIAL_GOALS } from "@/constants/copy";
import { CalculationResult, FinancialData } from "@/types";

// UI Components
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GoalOption } from "@/components/ui/GoalOptions";

export default function FinancialRealityCheck() {
  const [appState, setAppState] = useState<"landing" | "form" | "calculating" | "result">("landing");
  const { 
    formData, updateField, currentStep, nextStep, prevStep, 
    isComplete, setIsComplete, error, progress 
  } = useFinancialData();
  
  const [finalResult, setFinalResult] = useState<CalculationResult | null>(null);

  const handleStart = () => setAppState("form");

  // --- MODIFIED: This now saves data to the database ---
  const handleComplete = async () => {
    setAppState("calculating");
    
    // 1. Calculate the result immediately
    const result = calculateFinancialReality(formData);
    
    try {
      // 2. Send the data to our API route
      await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userData: formData, 
          result: result 
        }),
      });
    } catch (e) {
      console.error("Lead capture failed, but we will still show the result:", e);
    }

    // 3. Psychological tension delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setFinalResult(result);
    setAppState("result");

    if (result.tier === "RICH") {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  const shareResult = async () => {
    const text = `I just checked my financial reality… this humbled me 💀\nTry it yourself: ${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  if (appState === "landing") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            Are you actually doing well financially?
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium">
            Most people think they are. This test proves otherwise.
          </p>
          <Button onClick={handleStart} className="text-2xl px-12 py-8">
            Check Your Reality
          </Button>
          <p className="mt-8 text-gray-500 text-sm font-medium uppercase tracking-widest">
            Takes 20 seconds • No signup • Brutally honest
          </p>
        </motion.div>
      </div>
    );
  }

  if (appState === "form") {
    const stepConfig = FORM_STEPS[currentStep];

    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center p-6">
        <div className="max-w-lg mx-auto w-full">
          <ProgressBar progress={progress} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                  Step {currentStep + 1} of {FORM_STEPS.length}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  {stepConfig.label}
                </h2>
              </div>

              <div className="py-4">
                {stepConfig.type === "goal" ? (
                  <div className="space-y-3">
                    {FINANCIAL_GOALS.map((goal) => (
                      <GoalOption 
                        key={goal.value}
                        label={goal.label}
                        isSelected={formData.goal === goal.value}
                        onClick={() => updateField("goal", goal.value)}
                      />
                    ))}
                  </div>
                ) : (
                  <Input 
                    label={stepConfig.label}
                    type={stepConfig.type}
                    placeholder="Enter value..."
                    isOptional={stepConfig.optional}
                    value={formData[stepConfig.id] as string | number}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField(stepConfig.id, stepConfig.type === "number" ? Number(val) : val);
                    }}
                  />
                )}
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-500 text-sm font-bold flex items-center gap-2"
                >
                  <AlertCircle size={16} /> {error}
                </motion.p>
              )}

              <div className="flex gap-3 pt-4">
                {currentStep > 0 && (
                  <Button variant="secondary" onClick={prevStep} className="w-1/3">
                    Back
                  </Button>
                )}
                <Button 
                  onClick={currentStep === FORM_STEPS.length - 1 ? handleComplete : nextStep} 
                  className="flex-1"
                >
                  {currentStep === FORM_STEPS.length - 1 ? "Reveal My Reality" : "Next"} 
                  <ArrowRight size={20} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (appState === "calculating") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-8"
        >
          <Loader2 size={64} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-black mb-2">Analyzing your data...</h2>
        <p className="text-gray-400 font-medium italic">Comparing your spending habits against 10,000 peers</p>
      </div>
    );
  }

  if (appState === "result" && finalResult) {
    const content = TIER_DATA[finalResult.tier];
    const randomAlt = content.alts[Math.floor(Math.random() * content.alts.length)];
    const randomRoast = content.roasts[Math.floor(Math.random() * content.roasts.length)];

    return (
      <div className="min-h-screen bg-black text-white p-6 overflow-y-auto">
        <div className="max-w-lg mx-auto py-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center p-8 rounded-3xl ${content.bg} border border-white/10 ${content.shake ? 'animate-shake' : ''}`}
          >
            <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${content.color}`}>
              Your Financial Verdict
            </h3>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter">
              {content.title}
            </h1>
            
            <div className="relative w-32 h-32 mx-auto mb-10">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="stroke-gray-800" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                <path 
                  className={`${content.color} transition-all duration-1000`} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  fill="none" 
                  strokeDasharray={`${finalResult.score}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-black">
                {finalResult.score}
              </div>
            </div>

            <p className="text-2xl font-bold mb-4 leading-tight">
              {content.primary}
            </p>
            <p className="text-gray-400 italic mb-8">
              "{randomAlt}"
            </p>
            
            <div className="bg-black/50 p-5 rounded-2xl border border-white/5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className={content.color} size={22} />
                <p className="text-sm font-medium text-gray-300">{randomRoast}</p>
              </div>
            </div>

            <p className="text-lg font-bold mb-8 text-white/90">
              {content.motivation}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-900 p-6 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Percentile</p>
              <p className="text-3xl font-black">Top {finalResult.percentile}%</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Freedom Path</p>
              <p className="text-3xl font-black">{finalResult.freedomYears} Years</p>
            </div>
          </div>

          <div className="mt-4 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={18} />
                <p className="text-sm font-bold">Critical Weakness: <span className="text-red-400">{finalResult.weakness}</span></p>
             </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button onClick={shareResult} className="flex-1 py-6 text-xl">
              <Share2 size={20} /> Share Result
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => window.location.reload()} 
              className="p-6"
            >
              <RefreshCcw size={20} />
            </Button>
          </div>

          <div className="mt-20">
            <h4 className="text-center text-3xl font-black mb-10 tracking-tight">Fix This in 3 Steps</h4>
            <div className="space-y-4">
              <MonetizationCard 
                icon={<Wallet className="text-blue-400" />} 
                title="Control Your Spending" 
                desc="Stop the bleed. See where your money actually goes." 
              />
              <MonetizationCard 
                icon={<TrendingUp className="text-emerald-400" />} 
                title="Start Investing Smart" 
                desc="Turn your savings into a money-making machine." 
              />
              <MonetizationCard 
                icon={<ShieldCheck className="text-purple-400" />} 
                title="The Wealth Blueprint" 
                desc="Learn the rules of money they didn't teach in school." 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function MonetizationCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 bg-gray-900 border border-white/5 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-white/30 transition-all duration-300">
      <div className="flex items-center gap-5">
        <div className="p-4 bg-black rounded-2xl border border-white/10">{icon}</div>
        <div className="text-left">
          <p className="font-bold text-xl">{title}</p>
          <p className="text-gray-500 text-sm">{desc}</p>
        </div>
      </div>
      <div className="p-2 bg-white/5 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
        <ArrowRight size={20} />
      </div>
    </div>
  );
}
