"use client";

import { useState } from "react";
import { FinancialData, FinancialGoal } from "@/types";

export const useFinancialData = () => {
  // 1. Initial State
  const [formData, setFormData] = useState<FinancialData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    age: 0,
    income: 0,
    savings: 0,
    spending: 0,
    debt: 0,
    goal: 'JUST_SURVIVE', // Default goal
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Update Logic
  const updateField = <K extends keyof FinancialData>(key: K, value: FinancialData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError(null); // Clear error when user types
  };

  // 3. Navigation Logic
  const nextStep = () => {
    // Validation for Mandatory Email when on the email step (Assuming step 2)
    // We check if we are at the email step and if it's empty/invalid
    if (currentStep === 2 && (!formData.email || !formData.email.includes("@"))) {
      setError("Please enter a valid email to continue.");
      return;
    }

    if (currentStep < 9) { // Total of 10 steps (0-9)
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 4. Progress Calculation
  const progress = ((currentStep + 1) / 10) * 100;

  return {
    formData,
    updateField,
    currentStep,
    nextStep,
    prevStep,
    isComplete,
    setIsComplete,
    error,
    progress,
  };
};
