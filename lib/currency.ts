// نظام موحد للعملات وتحويل الأسعار

export type Currency = 'AED' | 'SAR' | 'BHD' | 'KWD' | 'OMR' | 'QAR' | 'USD' | 'EUR' | 'GBP' | 'INR';

// أسعار الصرف (SAR كعملة أساسية)
export const exchangeRates: Record<Currency, number> = {
  SAR: 1,
  AED: 0.98,
  KWD: 0.082,
  QAR: 0.97,
  BHD: 0.10,
  OMR: 0.10,
  USD: 0.27,
  EUR: 0.25,
  GBP: 0.21,
  INR: 22.5,
};

// رموز العملات
export const currencySymbols: Record<Currency, string> = {
  AED: 'د.إ',
  SAR: 'ر.س',
  BHD: 'د.ب',
  KWD: 'د.ك',
  OMR: 'ر.ع',
  QAR: 'ر.ق',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

// معاملات التحويل لـ Ziina (subunit)
export const subunitMap: Record<Currency, number> = {
  AED: 100,
  SAR: 100,
  BHD: 1000,
  KWD: 1000,
  OMR: 1000,
  QAR: 100,
  USD: 100,
  EUR: 100,
  GBP: 100,
  INR: 100,
};

// الحصول على رمز العملة
export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency] || 'ر.س';
}

// تحويل السعر من SAR إلى عملة أخرى
export function convertPrice(priceInSAR: number, toCurrency: Currency): number {
  const rate = exchangeRates[toCurrency] || 1;
  return priceInSAR * rate;
}

// حساب السعر النهائي مع الخصم
export interface PriceCalculation {
  originalPrice: number;  // السعر الأصلي قبل الخصم
  discountedPrice: number; // السعر بعد الخصم (في SAR)
  finalPrice: number;      // السعر النهائي بالعملة المطلوبة
  discountPercentage: number; // نسبة الخصم
  currency: Currency;
  symbol: string;
}

export function calculatePrice(
  product: any,
  currency: Currency,
  applyDiscount: boolean = true
): PriceCalculation {
  // للمنتجات المجانية
  if (product.isFree || product.price === 0) {
    return {
      originalPrice: product.originalPrice || 0,
      discountedPrice: 0,
      finalPrice: 0,
      discountPercentage: 100,
      currency,
      symbol: getCurrencySymbol(currency),
    };
  }

  // السعر الأصلي (قبل الخصم)
  const originalPriceInSAR = product.originalPrice || product.price || 0;
  
  // السعر بعد الخصم 60% (أي 40% من السعر الأصلي)
  const discountedPriceInSAR = applyDiscount 
    ? originalPriceInSAR * 0.4 
    : originalPriceInSAR;
  
  // تحويل إلى العملة المطلوبة
  const finalPrice = convertPrice(discountedPriceInSAR, currency);
  const originalPriceConverted = convertPrice(originalPriceInSAR, currency);

  return {
    originalPrice: originalPriceConverted,
    discountedPrice: discountedPriceInSAR,
    finalPrice: finalPrice,
    discountPercentage: applyDiscount ? 60 : 0,
    currency,
    symbol: getCurrencySymbol(currency),
  };
}

// تنسيق السعر للعرض
export function formatPrice(price: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  return `${price.toFixed(2)} ${symbol}`;
}

