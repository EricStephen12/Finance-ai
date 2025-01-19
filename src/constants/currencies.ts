export const currencies = {
  USD: { name: 'US Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' },
  NGN: { name: 'Nigerian Naira', symbol: '₦' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  CNY: { name: 'Chinese Yuan', symbol: '¥' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
  RUB: { name: 'Russian Ruble', symbol: '₽' },
  ZAR: { name: 'South African Rand', symbol: 'R' },
  BRL: { name: 'Brazilian Real', symbol: 'R$' },
  KRW: { name: 'South Korean Won', symbol: '₩' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$' },
  MXN: { name: 'Mexican Peso', symbol: '$' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ' },
  SAR: { name: 'Saudi Riyal', symbol: '﷼' },
  EGP: { name: 'Egyptian Pound', symbol: 'E£' },
  GHS: { name: 'Ghanaian Cedi', symbol: 'GH₵' },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh' },
  MAD: { name: 'Moroccan Dirham', symbol: 'MAD' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh' },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh' },
  ZMW: { name: 'Zambian Kwacha', symbol: 'ZK' },
  BTC: { name: 'Bitcoin', symbol: '₿' },
  ETH: { name: 'Ethereum', symbol: 'Ξ' },
  USDT: { name: 'Tether', symbol: '₮' },
  XAF: { name: 'Central African CFA', symbol: 'FCFA' },
  XOF: { name: 'West African CFA', symbol: 'CFA' },
  THB: { name: 'Thai Baht', symbol: '฿' },
  VND: { name: 'Vietnamese Dong', symbol: '₫' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM' },
  PHP: { name: 'Philippine Peso', symbol: '₱' },
  PKR: { name: 'Pakistani Rupee', symbol: '₨' },
  BDT: { name: 'Bangladeshi Taka', symbol: '৳' },
  LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs' },
  NPR: { name: 'Nepalese Rupee', symbol: 'रू' },
  ILS: { name: 'Israeli New Shekel', symbol: '₪' },
  TRY: { name: 'Turkish Lira', symbol: '₺' },
  PLN: { name: 'Polish Złoty', symbol: 'zł' },
  SEK: { name: 'Swedish Krona', symbol: 'kr' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr' },
  DKK: { name: 'Danish Krone', symbol: 'kr' },
  CZK: { name: 'Czech Koruna', symbol: 'Kč' },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft' },
  RON: { name: 'Romanian Leu', symbol: 'lei' },
  BGN: { name: 'Bulgarian Lev', symbol: 'лв' },
  HRK: { name: 'Croatian Kuna', symbol: 'kn' },
  RSD: { name: 'Serbian Dinar', symbol: 'дин' },
  UAH: { name: 'Ukrainian Hryvnia', symbol: '₴' },
  TWD: { name: 'New Taiwan Dollar', symbol: 'NT$' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' }
} as const;

export type CurrencyCode = keyof typeof currencies;

// Helper function to format currency with proper symbol and decimal places
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const currency = currencies[currencyCode];
  if (!currency) return `${amount.toFixed(2)}`;

  // Special formatting for some currencies
  switch (currencyCode) {
    case 'JPY':
    case 'KRW':
      // These currencies typically don't use decimal places
      return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
    case 'BTC':
    case 'ETH':
      // Crypto with more decimal places
      return `${currency.symbol}${amount.toFixed(8)}`;
    default:
      // Standard formatting with 2 decimal places
      return `${currency.symbol}${amount.toFixed(2)}`;
  }
} 