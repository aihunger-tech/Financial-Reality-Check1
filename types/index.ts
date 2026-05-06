export type FinancialTier = 'SURVIVING' | 'STABLE' | 'COMFORTABLE' | 'RICH';

export type FinancialGoal = 
  | 'RETIRE_EARLY' 
  | 'BUY_HOUSE' 
  | 'DEBT_FREE' 
  | 'GENERATIONAL_WEALTH' 
  | 'JUST_SURVIVE';

export interface FinancialData {
  firstName: string; // Optional
  lastName: string;   // Optional
  email: string;     // Mandatory
  country: string;   // Added
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
}

export interface CalculationResult {
  score: number;
  tier: FinancialTier;
  weakness: string;
  freedomYears: number;
  percentile: number;
}
