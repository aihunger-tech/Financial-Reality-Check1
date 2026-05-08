"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  ArrowRight, Share2, AlertCircle, TrendingUp, Wallet, 
  ShieldCheck, RefreshCcw, Loader2, ExternalLink, 
  Calendar, Globe, BarChart3, X, ChevronRight
} from "lucide-react";

// Internal Imports
import { useFinancialData } from "@/hooks/useFinancialData";
import { calculateFinancialReality } from "@/lib/scoring";
import { TIER_DATA, FORM_STEPS, FINANCIAL_GOALS, INVESTMENT_SURVEY_QUESTIONS } from "@/constants/copy";
import { CalculationResult, FinancialData } from "@/types";

// UI Components
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GoalOption } from "@/components/ui/GoalOptions";

// --- CONFIG ---
const LINKS = {
  // THE BRIDGE: Redirects to your Welcome page
  APP: "https://cyfinances.vercel.app/welcome", 
  MARKETS: "#", 
  COURSE: "https://your-course.com",
  CONSULT: "https://calendly.com/your-link",
};

export default function FinancialRealityCheck() {
  const [appState, setAppState] = useState<"landing" | "form" | "calculating" | "result">("landing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyStep, setSurveyStep] = useState(0);
  const [humbleCount, setHumbleCount] = useState(12403);
  
  const { formData, updateField, currentStep, nextStep, prevStep, error, progress } = useFinancialData();
  const [finalResult, setFinalResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setHumbleCount(prev => prev + Math.floor(Math.random() * 3)), 3000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTION HANDLERS ---

  const handleStart = () => setAppState("form");

  const shareResult = async () => {
    const text = `I just checked my financial reality… this humbled me 💀\nTry it yourself: ${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const result = calculateFinancialReality(formData);
    try {
      await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: formData, result: result }),
      });
    } catch (e) { console.error(e); }
    setAppState("calculating");
    setIsSubmitting(false);
    await new Promise(r => setTimeout(r, 2000));
    setFinalResult(result);
    setAppState("result");
    if (result.tier === "RICH") confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  };

  // --- PAGE RENDERERS ---

  if (appState === "landing") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {humbleCount.toLocaleString()} people humbled today
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-none italic">
            Are you actually <br/><span className="text-gray-500">doing well?</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-lg mx-auto">
            Most people think they are. This test proves otherwise.
          </p>
          <Button onClick={handleStart} className="text-2xl px-16 py-10 rounded-full hover:scale-105 transition-transform">
            Check Your Reality <ArrowRight size={24} />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (appState === "form") {
    const stepConfig = FORM_STEPS[currentStep];
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center p-6 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div className="max-w-lg mx-auto w-full z-10">
          <ProgressBar progress={progress} />
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div className="space-y-2">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Step {currentStep + 1} of {FORM_STEPS.length}</span>
                <h2 className="text-4xl md:text-6xl font-black leading-tight">{stepConfig.label}</h2>
              </div>
              <div className="py-4">
                {stepConfig.type === "goal" ? (
                  <div className="space-y-3">
                    {FINANCIAL_GOALS.map((goal) => (
                      <GoalOption key={goal.value} label={goal.label} isSelected={formData.goal === goal.value} onClick={() => updateField("goal", goal.value)} />
                    ))}
                  </div>
                ) : (
                  <Input 
                    label={stepConfig.label} 
                    type={stepConfig.type} 
                    placeholder="Enter value..."
                    isOptional={stepConfig.optional} 
                    value={formData[stepConfig.id as keyof FinancialData] as any} 
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField(stepConfig.id as keyof FinancialData, stepConfig.type === "number" ? (val === "" ? 0 : Number(val)) : val);
                    }} 
                  />
                )}
              </div>
              {error && <p className="text-red-500 font-bold">{error}</p>}
              <div className="flex gap-3 pt-4">
                {currentStep > 0 && <Button variant="secondary" onClick={prevStep} className="w-1/3">Back</Button>}
                <Button onClick={currentStep === FORM_STEPS.length - 1 ? handleComplete : nextStep} isLoading={isSubmitting} className="flex-1">
                  {currentStep === FORM_STEPS.length - 1 ? "Reveal My Reality" : "Next"} <ArrowRight size={20} />
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
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-8"><Loader2 size={64} /></motion.div>
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Calculating Reality...</h2>
        <p className="text-gray-500 font-medium italic">Analyzing your data against global benchmarks</p>
      </div>
    );
  }

  if (appState === "result" && finalResult) {
    const content = TIER_DATA[finalResult.tier];
    return (
      <div className="min-h-screen bg-black text-white p-6 overflow-y-auto relative">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(#333 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="max-w-lg mx-auto py-12 z-10 relative">
          <motion.div initial={{ filter: "blur(20px)", opacity: 0 }} animate={{ filter: "blur(0px)", opacity: 1 }} transition={{ duration: 1 }} className={`text-center p-8 rounded-3xl ${content.bg} border border-white/10 ${content.shake ? 'animate-shake' : ''}`}>
            <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-4 ${content.color}`}>VERDICT</h3>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tighter">{content.title}</h1>
            <div className="bg-black/40 p-4 rounded-2xl mb-8 inline-block border border-white/10">
               <p className="text-gray-400 text-sm uppercase font-bold">Your Persona</p>
               <p className="text-2xl font-black text-white">{finalResult.persona}</p>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-10">
              <svg className="w-full h-full" viewBox="0 0 36 36"><path className="stroke-gray-800" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" /><path className={`${content.color} transition-all duration-1000`} strokeWidth="3" fill="none" strokeDasharray={`${finalResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" /></svg>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-black">{finalResult.score}</div>
            </div>
            <p className="text-2xl font-bold mb-4">{content.primary}</p>
            {finalResult.gap > 0 && (
              <div className="bg-white/5 p-4 rounded-2xl mb-8 border border-white/10">
                <p className="text-sm text-gray-400">You are only <span className="text-white font-bold">{finalResult.gap} points</span> away from the next tier.</p>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <StatCard label="Percentile" value={`Top ${finalResult.percentile}%`} />
            <StatCard label="Country Rank" value={`Top ${finalResult.countryRank}%`} />
            <StatCard label="Freedom Path" value={`${finalResult.freedomYears} Years`} />
            <StatCard label="Verdict" value={finalResult.tier} />
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-3xl text-center">
             <p className="text-gray-500 uppercase text-xs font-bold mb-4 tracking-widest">Certificate of Reality</p>
             <h2 className="text-3xl font-black mb-2">I am in the top {finalResult.percentile}% of financial strength.</h2>
             <p className="text-gray-400 mb-6 italic">Can you beat my score?</p>
             <Button onClick={shareResult} className="py-4 rounded-full flex items-center gap-2 mx-auto w-auto px-8">
               <Share2 size={18} /> Share My Result
             </Button>
          </div>

          <div className="mt-20">
            <h4 className="text-center text-3xl font-black mb-10 tracking-tight">The Recovery Plan</h4>
            <div className="space-y-6">
              <MonetizationCard 
                icon={<Wallet className="text-white" />} 
                title="Control Your Finances" 
                desc="You've faced your reality. Now, build your financial fortress. Privacy-first wealth tracking for the elite."
                primaryLink={LINKS.APP}
                primaryLabel="Launch App"
                isHighlighted={true}
              />
              <MonetizationCard 
                icon={<TrendingUp className="text-emerald-400" />} 
                title="Start Investing Smart" 
                desc="Real-time market data & wealth strategies."
                primaryLink={LINKS.MARKETS}
                primaryLabel="Market Hub"
                onSecondaryClick={() => setShowSurvey(true)}
                secondaryLabel="Investment Survey"
              />
              <MonetizationCard 
                icon={<ShieldCheck className="text-purple-400" />} 
                title="The Wealth Blueprint" 
                desc="Purchasable guides and advanced courses."
                primaryLink={LINKS.COURSE}
                primaryLabel="Get Blueprints"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showMarket && <MarketModal onClose={() => setShowMarket(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {showSurvey && <SurveyModal onClose={() => setShowSurvey(false)} />}
        </AnimatePresence>
      </div>
    );

}

return null;
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-gray-900 p-6 rounded-3xl border border-white/5">
      <p className="text-gray-500 text-xs uppercase font-bold mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function MonetizationCard({ icon, title, desc, primaryLink, primaryLabel, secondaryLabel, onSecondaryClick, isHighlighted }: any) {
  return (
    <div className={`p-6 rounded-3xl group transition-all ${isHighlighted ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-gray-900 border border-white/5 hover:border-white/20'}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border ${isHighlighted ? 'bg-black text-white border-black' : 'bg-black text-white border-white/10'}`}>{icon}</div>
          <div className="text-left">
            <p className={`font-bold text-xl ${isHighlighted ? 'text-black' : 'text-white'}`}>{title}</p>
            <p className={`${isHighlighted ? 'text-gray-600' : 'text-gray-500'} text-sm`}>{desc}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <a href={primaryLink} target="_blank" className={`flex-1 py-3 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-colors ${isHighlighted ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-gray-200'}`}>
          {primaryLabel} <ExternalLink size={14} />
        </a>
        {onSecondaryClick && (
          <Button onClick={onSecondaryClick} variant="secondary" className="flex-1 py-3 text-sm">
            {secondaryLabel}
          </Button>
        )}
        <a href={LINKS.CONSULT} target="_blank" className={`p-3 rounded-xl transition-colors ${isHighlighted ? 'bg-zinc-300 text-black hover:bg-zinc-400' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
          <Calendar size={18} />
        </a>
      </div>
    </div>
  );
}

function MarketModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-lg w-full bg-gray-900 border border-white/10 rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><BarChart3 className="text-emerald-400" /> Market Pulse</h2>
        <div className="space-y-4">
          <MarketItem label="Bitcoin" price="$64,210" change="+2.4%" color="text-emerald-400" />
          <MarketItem label="S&P 500" price="5,120" change="-0.1%" color="text-red-400" />
          <MarketItem label="Gold" price="$2,340" change="+0.8%" color="text-emerald-400" />
          <MarketItem label="Oil (WTI)" price="$82.10" change="+1.2%" color="text-emerald-400" />
        </div>
        <Button onClick={onClose} className="mt-10 w-full py-4">Back to Results</Button>
      </motion.div>
    </motion.div>
  );
}

function MarketItem({ label, price, change, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-white/5">
      <span className="font-bold">{label}</span>
      <div className="text-right">
        <p className="font-black">{price}</p>
        <p className={`text-xs font-bold ${color}`}>{change}</p>
      </div>
    </div>
  );
}

function SurveyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md w-full bg-gray-900 border border-white/10 rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
        <p className="text-gray-500 text-xs font-bold uppercase mb-2">Question {step + 1} of 5</p>
        <h2 className="text-2xl font-black mb-8">{INVESTMENT_SURVEY_QUESTIONS[step].q}</h2>
        <div className="space-y-3">
          {INVESTMENT_SURVEY_QUESTIONS[step].options.map((opt: string) => (
            <button key={opt} onClick={() => step < 4 ? setStep(step + 1) : onClose()} className="w-full p-4 bg-black border border-white/10 rounded-2xl text-left hover:border-white transition-colors font-medium">
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
