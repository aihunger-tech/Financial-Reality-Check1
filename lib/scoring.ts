// lib/scoring.ts
import { FinancialData, CalculationResult, FinancialTier } from "@/types";

export function calculateFinancialReality(data: FinancialData): CalculationResult {
  // 1. CORE RATIOS (The actual "Reality Check")
  const monthlySurplus = data.income - data.spending;
  const savingsRate = data.income > 0 ? (monthlySurplus / data.income) * 100 : 0;
  const debtToIncomeRatio = data.income > 0 ? (data.debt / (data.income * 12)) : 0;
  const liquidityMonths = data.spending > 0 ? data.savings / data.spending : 0;

  // 2. WEIGHTED SCORING (Max 100)
  let score = 0;

  // Savings Rate (Max 40pts) - The primary wealth builder
  if (savingsRate > 40) score += 40;
  else if (savingsRate > 20) score += 25;
  else if (savingsRate > 0) score += 10;

  // Emergency Fund / Liquidity (Max 30pts) - The safety net
  if (liquidityMonths >= 6) score += 30;
  else if (liquidityMonths >= 3) score += 15;
  else if (liquidityMonths >= 1) score += 5;

  // Debt Burden (Max 30pts) - The drag
  if (data.debt === 0) score += 30;
  else if (debtToIncomeRatio < 0.3) score += 20;
  else if (debtToIncomeRatio < 1.0) score += 10;

  // 3. TIER MAPPING (Based on your FinancialTier types)
  let tier: FinancialTier = 'SURVIVING';
  let gap = 0;

  if (score >= 85) { tier = 'RICH'; gap = 0; }
  else if (score >= 60) { tier = 'COMFORTABLE'; gap = 85 - score; }
  else if (score >= 35) { tier = 'STABLE'; gap = 60 - score; }
  else { tier = 'SURVIVING'; gap = 35 - score; }

  // 4. PERSONA ENGINE (The Psychological Lead Hook)
  // We analyze the "Conflict" in their data to assign a Persona
  let persona = "The Average Earner";
  let diagnosis = "Your finances are functional, but lacking a strategic edge.";
  let weakness = "Lack of optimization";

  if (data.income > 8000 && savingsRate < 10) {
    persona = "The Golden Handcuffs";
    diagnosis = "You earn a premium salary, but your lifestyle has become a cage. You're high-income, but low-wealth.";
    weakness = "Lifestyle Inflation";
  } else if (debtToIncomeRatio > 1.5 && savingsRate < 0) {
    persona = "The Debt Trap";
    diagnosis = "You're fighting a losing battle against interest. Your income is being siphoned before you can build a future.";
    weakness = "High-Interest Debt";
  } else if (savingsRate > 25 && liquidityMonths < 3) {
    persona = "The Fragile Saver";
    diagnosis = "You have a great saving habit, but no foundation. One emergency would wipe out months of progress.";
    weakness = "Low Liquidity";
  } else if (score >= 85) {
    persona = "The Financial Fortress";
    diagnosis = "You've mastered the game of money. Your focus now shifts from survival to legacy and optimization.";
    weakness = "None (Optimization Phase)";
  } else if (data.income < 3000 && savingsRate > 20) {
    persona = "The Stealth Saver";
    diagnosis = "You're doing the impossible—saving significantly on a tight budget. You have the discipline, just not the scale.";
    weakness = "Income Ceiling";
  }

  // 5. STATS & PROJECTIONS
  const percentile = Math.max(1, 100 - (score * 0.95)).toFixed(1);
  const countryRank = Math.max(1, 100 - (score * 0.85)).toFixed(1);
  
  // Freedom Years (4% Rule: 25x annual expenses)
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
