// types/index.ts

export type FinancialTier = 'SURVIVING' | 'STABLE' | 'COMFORTABLE' | 'RICH';

export type FinancialGoal = 
  | 'RETIRE_EARLY' | 'BUY_HOUSE' | 'DEBT_FREE' | 'GENERATIONAL_WEALTH' | 'JUST_SURVIVE';

export interface FinancialData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  age: number;
  income: number;  // Monthly
  savings: number; // Total
  spending: number; // Monthly
  debt: number;    // Total
  goal: FinancialGoal;
  // Added for Investment Survey enhancement
  investmentKnowledge?: string; 
  riskTolerance?: string;
}

export interface FormStep {
  id: keyof FinancialData | string;
  label: string;
  type: "text" | "number" | "email" | "goal";
  optional: boolean;
}

export interface MultiStep {
  id: string;
  label: string;
  type: "multi";
  fields: FormStep[];
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
  offerTitle: string; 
}

export interface CalculationResult {
  score: number;
  tier: FinancialTier;
  persona: string;      // Advanced: e.g., "The Golden Handcuffs"
  diagnosis: string;    // Advanced: Psychological hook text
  gap: number;          // Points to next tier
  weakness: string;     // Specific area of failure
  freedomYears: number;
  percentile: number;
  countryRank: number; 
}
