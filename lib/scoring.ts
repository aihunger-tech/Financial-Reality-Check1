import { FinancialData, FinancialTier, CalculationResult } from "@/types";

export const calculateFinancialReality = (data: FinancialData): CalculationResult => {
  let score = 50; // Base starting point

  // 1. SAVINGS RATE IMPACT
  // (Monthly Savings / Monthly Income)
  const savingsRate = (data.savings / data.income) * 100;
  if (savingsRate > 30) score += 25;
  else if (savingsRate > 15) score += 15;
  else if (savingsRate > 0) score += 5;
  else if (savingsRate < 0) score -= 20; // Spending more than earning

  // 2. DEBT RATIO IMPACT
  // (Total Debt / Annual Income)
  const annualIncome = data.income * 12;
  const debtRatio = data.debt / annualIncome;
  if (data.debt === 0) score += 15;
  else if (debtRatio > 3) score -= 25;
  else if (debtRatio > 1) score -= 15;
  else if (debtRatio < 0.5) score += 5;

  // 3. SPENDING VS INCOME
  if (data.spending >= data.income) {
    score -= 30;
  } else if (data.spending < data.income * 0.5) {
    score += 10;
  }

  // 4. AGE FACTOR (The "Panic" Multiplier)
  // Penalize heavily if older with low savings
  if (data.age > 35 && data.savings < 5000) score -= 20;
  if (data.age < 25 && data.savings > 10000) score += 10;

  // 5. RANDOMNESS (The "Viral" Variable)
  // Adds ±5% so results feel less like a static calculator and more like a "test"
  const randomness = (Math.random() * 10) - 5;
  const finalScore = Math.min(100, Math.max(0, Math.round(score + randomness)));

  // TIER ASSIGNMENT
  let tier: FinancialTier = 'SURVIVING';
  if (finalScore >= 76) tier = 'RICH';
  else if (finalScore >= 51) tier = 'COMFORTABLE';
  else if (finalScore >= 26) tier = 'STABLE';

  // WEAKNESS DETECTION
  let weakness = "Lifestyle Creep";
  if (data.debt > annualIncome * 0.5) weakness = "Crushing Debt";
  else if (data.spending > data.income * 0.8) weakness = "Excessive Spending";
  else if (data.savings === 0) weakness = "Zero Safety Net";

  // FINANCIAL FREEDOM CALCULATION (Rough Estimate)
  // (Total savings needed is roughly 25x annual expenses)
  const annualExpenses = data.spending * 12;
  const targetNestEgg = annualExpenses * 25;
  const currentSavingsTotal = data.savings * 12; // Simplification for the tool
  const gap = targetNestEgg - currentSavingsTotal;
  const yearlySavings = (data.income - data.spending) * 12;
  
  let freedomYears = 0;
  if (yearlySavings > 0) {
    freedomYears = Math.round(gap / yearlySavings);
  } else {
    freedomYears = 99; // Effectively never
  }

  return {
    score: finalScore,
    tier: tier,
    weakness: weakness,
    freedomYears: freedomYears > 100 ? 100 : (freedomYears < 0 ? 0 : freedomYears),
    percentile: 100 - finalScore, // Simplistic percentile
  };
};
