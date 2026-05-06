import { FinancialData, FinancialTier, CalculationResult } from "@/types";

export const calculateFinancialReality = (data: FinancialData): CalculationResult => {
  let score = 50; // Base starting point

  // 1. SAVINGS RATE IMPACT
  const savingsRate = (data.savings / data.income) * 100;
  if (savingsRate > 30) score += 25;
  else if (savingsRate > 15) score += 15;
  else if (savingsRate > 0) score += 5;
  else if (savingsRate < 0) score -= 20;

  // 2. DEBT RATIO IMPACT
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

  // 4. AGE FACTOR
  if (data.age > 35 && data.savings < 5000) score -= 20;
  if (data.age < 25 && data.savings > 10000) score += 10;

  // 5. RANDOMNESS (Viral Variable)
  const randomness = (Math.random() * 10) - 5;
  const finalScore = Math.min(100, Math.max(0, Math.round(score + randomness)));

  // TIER ASSIGNMENT
  let tier: FinancialTier = 'SURVIVING';
  if (finalScore >= 76) tier = 'RICH';
  else if (finalScore >= 51) tier = 'COMFORTABLE';
  else if (finalScore >= 26) tier = 'STABLE';

  // PERSONA LOGIC (The "Label" users share)
  let persona = "The Average Joe";
  if (data.income > 8000 && data.spending > data.income * 0.8) {
    persona = "The High-Earning Broke Person";
  } else if (data.income < 6000 && data.savings > data.income * 0.2) {
    persona = "The Stealth Saver";
  } else if (data.debt > annualIncome * 0.6 && data.savings < 1000) {
    persona = "The Debt Prisoner";
  } else if (finalScore > 85) {
    persona = "The Wealth Architect";
  } else if (finalScore < 20) {
    persona = "The Financial Firefighter";
  }

  // GAP ANALYSIS (Points to next tier)
  let gap = 0;
  if (tier === 'SURVIVING') gap = 26 - finalScore;
  else if (tier === 'STABLE') gap = 51 - finalScore;
  else if (tier === 'COMFORTABLE') gap = 76 - finalScore;
  else gap = 0;

  // WEAKNESS DETECTION
  let weakness = "Lifestyle Creep";
  if (data.debt > annualIncome * 0.5) weakness = "Crushing Debt";
  else if (data.spending > data.income * 0.8) weakness = "Excessive Spending";
  else if (data.savings === 0) weakness = "Zero Safety Net";

  // FREEDOM YEARS CALCULATION
  const annualExpenses = data.spending * 12;
  const targetNestEgg = annualExpenses * 25;
  const currentSavingsTotal = data.savings * 12; 
  const gapToNestEgg = targetNestEgg - currentSavingsTotal;
  const yearlySavings = (data.income - data.spending) * 12;
  
  let freedomYears = 0;
  if (yearlySavings > 0) {
    freedomYears = Math.round(gapToNestEgg / yearlySavings);
  } else {
    freedomYears = 99; 
  }

  // RETURN FULL OBJECT (Matches CalculationResult interface)
  return {
    score: finalScore,
    tier: tier,
    persona: persona,
    gap: gap,
    weakness: weakness,
    freedomYears: freedomYears > 100 ? 100 : (freedomYears < 0 ? 0 : freedomYears),
    percentile: 100 - finalScore,
    countryRank: Math.floor(Math.random() * 20) + 75, // Simulated country rank
  };
};
