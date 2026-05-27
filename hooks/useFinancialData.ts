"use client";

import { useState } from "react";
import { FinancialData } from "@/types";
import { useFinancialStore } from "@/store/useFinancialStore";

export const useFinancialData = () => {
  const { formData, updateFormData, currency } = useFinancialStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FinancialData>(key: K, value: FinancialData[K]) => {
    updateFormData(key as string, value);
    setError(null);
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.firstName) {
      setError("Please enter your first name to continue.");
      return;
    }
    if (currentStep === 1 && (!formData.email || !formData.email.includes("@"))) {
      setError("Please enter a valid email to continue.");
      return;
    }

    if (currentStep < 9) {
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
