// lib/currencyUtils.ts
import { useFinancialStore } from '@/store/useFinancialStore';

export const formatCurrencyValue = (value: number) => {
  const { currency } = useFinancialStore.getState();
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(value);
};
