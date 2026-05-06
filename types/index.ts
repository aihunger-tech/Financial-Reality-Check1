export type FinancialTier = 'SURVIVING' | 'STABLE' | 'COMFORTABLE' | 'RICH';

export type FinancialGoal = 
  | 'RETIRE_EARLY' | 'BUY_HOUSE' | 'DEBT_FREE' | 'GENERATIONAL_WEALTH' | 'JUST_SURVIVE';

export interface FinancialData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  age: number;
  income: number;
  savings: number;
  spending: number;
  debt: number;
  goal: FinancialGoal;
}

export interface TierContent {
  title: string;
  primary: string;
  alts: string[];
  roasts: string[];
  motivation: string;
  color: string;
  bg: string;
  shake: boolean;
  offerTitle: string; // Tier-specific offer
}

export interface CalculationResult {
  score: number;
  tier: FinancialTier;
  persona: string;    // New: "The Stealth Saver", etc.
  gap: number;        // New: Points to next tier
  weakness: string;
  freedomYears: number;
  percentile: number;
  countryRank: number; // New: Percentile within country
}
