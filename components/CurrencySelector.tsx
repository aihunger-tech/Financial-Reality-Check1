// components/CurrencySelector.tsx
'use client';
import React from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { motion } from 'framer-motion';

const currencies = [
  { code: 'USD', symbol: '$', locale: 'en-US', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', label: 'Australian Dollar', flag: '🇦🇺' },
];

export default function CurrencySelector({ onNext }: { onNext: () => void }) {
  const { currency, setCurrency } = useFinancialStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Select Your Local Currency
        </h2>
        <p className="text-gray-400">
          To give you an accurate financial reality check, we need to know your currency.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {currencies.map((curr) => (
          <motion.div
            key={curr.code}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrency(curr)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 
              ${currency.code === curr.code 
                ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500'}`}
          >
            <span className="text-4xl">{curr.flag}</span>
            <span className="font-semibold">{curr.code}</span>
            <span className="text-xs opacity-60">{curr.symbol}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        className="mt-12 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-xl"
      >
        Continue to Analysis →
      </motion.button>
    </div>
  );
}
