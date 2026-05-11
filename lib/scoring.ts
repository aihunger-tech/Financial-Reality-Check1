// lib/scoring.ts
import { FinancialData, CalculationResult, FinancialTier } from "@/types";

export function calculateFinancialReality(data: FinancialData): CalculationResult {
  // 1. CORE RATIOS (The actual "Reality Check")
  const monthlySurplus = data.income - data.spending;
  const savingsRate = data.income > 0 ? (monthlySurplus / data.income) * 100 : 0;
  const debtToIncomeRatio = data.income > 0 ? (data.debt / (data.income * 12)) : 0;
  const liquidityMonths = data.spending > 0 ? data.savings / data.spending : 0;
  
  // Wealth Velocity: How fast are they growing relative to their age?
  // A simple heuristic: (Savings / Age) * (1 + SavingsRate/100)
  const wealthVelocity = data.age > 0 ? (data.savings / data.age) * (1 + savingsRate / 100) : 0;

  // 2. WEIGHTED SCORING (Max 100)
  let score = 0;

  // Savings Rate (Max 40pts) - The primary wealth builder
  if (savingsRate > 50) score += 40;
  else if (savingsRate > 30) score += 30;
  else if (savingsRate > 15) score += 20;
  else if (savingsRate > 0) score += 10;

  // Emergency Fund / Liquidity (Max 30pts) - The safety net
  if (liquidityMonths >= 12) score += 30;
  else if (liquidityMonths >= 6) score += 20;
  else if (liquidityMonths >= 3) score += 10;
  else if (liquidityMonths >= 1) score += 5;

  // Debt Burden (Max 30pts) - The drag
  if (data.debt === 0) score += 30;
  else if (debtToIncomeRatio < 0.2) score += 25;
  else if (debtToIncomeRatio < 0.5) score += 15;
  else if (debtToIncomeRatio < 1.0) score += 5;

  // 3. TIER MAPPING
  let tier: FinancialTier = 'SURVIVING';
  let gap = 0;

  if (score >= 90) { tier = 'RICH'; gap = 0; }
  else if (score >= 70) { tier = 'COMFORTABLE'; gap = 90 - score; }
  else if (score >= 40) { tier = 'STABLE'; gap = 70 - score; }
  else { tier = 'SURVIVING'; gap = 40 - score; }

  // 4. PERSONA ENGINE (The Psychological Lead Hook)
  let persona = "The Average Earner";
  let diagnosis = "Your finances are functional, but lacking a strategic edge.";
  let weakness = "Lack of optimization";

  if (data.income > 10000 && savingsRate < 15) {
    persona = "The Golden Handcuffs";
    diagnosis = "You've reached a high income, but your lifestyle has scaled perfectly to match it. You're a high-earning prisoner of your own success.";
    weakness = "Lifestyle Inflation";
  } else if (debtToIncomeRatio > 2.0 || (debtToIncomeRatio > 1.0 && savingsRate < 0)) {
    persona = "The Debt Trap";
    diagnosis = "You're running on a treadmill that's moving faster than you can. Your income is a transit point for creditors, not a wealth builder.";
    weakness = "Compound Interest (Against You)";
  } else if (savingsRate > 30 && liquidityMonths < 3) {
    persona = "The Fragile High-Flyer";
    diagnosis = "You have an aggressive growth mindset, but you're walking a tightrope without a net. One bad month could reset your progress.";
    weakness = "Critical Liquidity Gap";
  } else if (score >= 90) {
    persona = "The Financial Fortress";
    diagnosis = "You've decoupled your time from your income. You're no longer working for money; your money is working for you.";
    weakness = "None (Optimization Phase)";
  } else if (data.income < 4000 && savingsRate > 25) {
    persona = "The Stealth Wealth-Builder";
    diagnosis = "You're outperforming people making 3x your salary through sheer discipline. You've mastered the hardest part: the habit.";
    weakness = "Income Ceiling";
  } else if (wealthVelocity > 5000 && tier === 'STABLE') {
    persona = "The Rising Star";
    diagnosis = "You're in the 'accumulation' phase. Your velocity is high, and you're about to hit the inflection point where wealth compounds rapidly.";
    weakness = "Patience & Scaling";
  }

  // 5. STATS & PROJECTIONS
  const percentile = Math.max(1, 100 - (score * 0.9)).toFixed(1);
  const countryRank = Math.max(1, 100 - (score * 0.8)).toFixed(1);
  
  const annualExpenses = data.spending * 12;
  const targetNestEgg = annualExpenses * 25;
  const currentGap = targetNestEgg - data.savings;
  const annualSurplus = monthlySurplus * 12;
  
  const freedomYears = annualSurplus > 0 
    ? Math.ceil(currentGap / annualSurplus) 
    : 99;

  return {
    score,
    tier,
    persona,
    diagnosis,
    gap,
    weakness,
    freedomYears: freedomYears > 100 ? 100 : freedomYears,
    percentile: Number(percentile),
    countryRank: Number(countryRank),
  };
}
