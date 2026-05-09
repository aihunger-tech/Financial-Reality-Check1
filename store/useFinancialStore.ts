// store/useFinancialStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FinancialState {
  // Currency State
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  setCurrency: (currency: { code: string; symbol: string; locale: string }) => void;

  // User Financial Data
  formData: {
    monthlyIncome: number;
    monthlyExpenses: number;
    totalDebt: number;
    savings: number;
    investmentKnowledge: string; // 'Beginner', 'Intermediate', 'Advanced'
    riskTolerance: string;      // 'Low', 'Medium', 'High'
    financialGoal: string;
  };
  updateFormData: (field: string, value: any) => void;
  resetStore: () => void;

  // Result State
  verdict: string | null;
  score: number;
  setVerdict: (verdict: string) => void;
  setScore: (score: number) => void;
}

const initialFormData = {
  monthlyIncome: 0,
  monthlyExpenses: 0,
  totalDebt: 0,
  savings: 0,
  investmentKnowledge: 'Beginner',
  riskTolerance: 'Medium',
  financialGoal: '',
};

const defaultCurrency = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
};

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      currency: defaultCurrency,
      setCurrency: (currency) => set({ currency }),
      
      formData: initialFormData,
      updateFormData: (field, value) => 
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      verdict: null,
      score: 0,
      setVerdict: (verdict) => set({ verdict }),
      setScore: (score) => set({ score }),

      resetStore: () => set({ 
        formData: initialFormData, 
        verdict: null, 
        score: 0 
      }),
    }),
    {
      name: 'financial-reality-storage', // This saves data in localStorage for sub-app access
    }
  )
);
