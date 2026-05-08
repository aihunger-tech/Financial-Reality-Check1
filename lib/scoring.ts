import { FinancialData, FinancialTier, CalculationResult } from "@/types";

// 2026 Economic Weights: Adjusts the "strength" of money based on local Cost of Living (COL)
// Factor > 1.0 means the money goes further (Low COL), increasing the score impact.
// Factor < 1.0 means the money is tighter (High COL), requiring more to achieve the same tier.
const COUNTRY_WEIGHTS: Record<string, number> = {
  "USA": 1.0,
  "UK": 0.95,
  "Canada": 0.98,
  "Australia": 0.97,
  "Switzerland": 0.85, // Extremely high COL
  "Singapore": 0.88,
  "Germany": 0.92,
  "India": 1.6,       // High PPP impact
  "Brazil": 1.5,
  "Vietnam": 1.7,
  "Indonesia": 1.65,
  "Mexico": 1.4,
  "Philippines": 1.55,
  "Default": 1.2,     // Average global weight
};

export const calculateFinancialReality = (data: FinancialData): CalculationResult => {
  let score = 50; // Base starting point
  
  // Resolve country weight
  const weight = COUNTRY_WEIGHTS[data.country.toUpperCase()] || COUNTRY_WEIGHTS["Default"];

  // 1. SAVINGS RATE IMPACT (Weighted)
  // We multiply the savings rate by the country weight to reflect relative strength
  const savingsRate = (data.savings / data.income) * 100;
  const weightedSavingsRate = savingsRate * weight;

  if (weightedSavingsRate > 30) score += 25;
  else if (weightedSavingsRate > 15) score += 15;
  else if (weightedSavingsRate > 0) score += 5;
  else if (savingsRate < 0) score -= 20; // Negative savings (burning cash) is a penalty regardless of country

  // 2. DEBT RATIO IMPACT (Weighted)
  const annualIncome = data.income * 12;
  const debtRatio = data.debt / annualIncome;
  
  // In high COL countries (weight < 1), debt is slightly more "tolerable" due to higher wages
  const weightedDebtRatio = debtRatio * weight;

  if (data.debt === 0) score += 15;
  else if (weightedDebtRatio > 3) score -= 25;
  else if (weightedDebtRatio > 1) score -= 15;
  else if (weightedDebtRatio < 0.5) score += 5;

  // 3. SPENDING VS INCOME (Relative)
  if (data.spending >= data.income) {
    score -= 30;
  } else if (data.spending < data.income * 0.5) {
    score += 10;
  }

  // 4. AGE FACTOR
  if (data.age > 35 && data.savings < 5000) score -= 20;
  if (data.age < 25 && data.savings > 10000) score += 10;

  // 5. RANDOMNESS (Viral Variable - preserves "uniqueness" of results)
  const randomness = (Math.random() * 10) - 5;
  const finalScore = Math.min(100, Math.max(0, Math.round(score + randomness)));

  // TIER ASSIGNMENT
  let tier: FinancialTier = 'SURVIVING';
  if (finalScore >= 76) tier = 'RICH';
  else if (finalScore >= 51) tier = 'COMFORTABLE';
  else if (finalScore >= 26) tier = 'STABLE';

  // PERSONA LOGIC
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

  // GAP ANALYSIS
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

  return {
    score: finalScore,
    tier: tier,
    persona: persona,
    gap: gap,
    weakness: weakness,
    freedomYears: freedomYears > 100 ? 100 : (freedomYears < 0 ? 0 : freedomYears),
    percentile: 100 - finalScore,
    countryRank: Math.floor(Math.random() * 20) + 75, 
  };
};
