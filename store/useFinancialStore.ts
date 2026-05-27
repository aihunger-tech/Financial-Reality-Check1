// store/useFinancialStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialData } from '@/types';

interface FinancialState {
  // --- APP STATE ---
  appState: "landing" | "currency" | "form" | "calculating" | "result";
  setAppState: (state: "landing" | "currency" | "form" | "calculating" | "result") => void;

  // --- CURRENCY STATE ---
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  setCurrency: (currency: { code: string; symbol: string; locale: string }) => void;

  // --- USER FINANCIAL DATA ---
  formData: FinancialData;
  updateFormData: (field: string, value: any) => void;
  resetStore: () => void;


  // --- RESULT STATE ---
  verdict: string | null;
  score: number;
  setVerdict: (verdict: string) => void;
  setScore: (score: number) => void;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  age: 0,
  income: 0,
  savings: 0,
  spending: 0,
  debt: 0,
  goal: 'JUST_SURVIVE' as any,
};

const defaultCurrency = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
};

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      appState: "landing",
      setAppState: (appState) => set({ appState }),

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
        appState: "landing",
        formData: initialFormData, 
        verdict: null, 
        score: 0 
      }),
    }),
    {
      name: 'financial-reality-storage',
    }
  )
);
