/**
 * duidjs - A TypeScript library for handling money operations
 * 
 * This library provides a robust way to represent monetary values,
 * perform arithmetic operations, handle different currencies,
 * and format money for display.
 */

// Export core classes
export { Money } from './money';
export { Currency } from './currency';

// Export currency data
export { ISO_CURRENCIES } from './currencies/iso';
export type { CurrencyMetadata } from './currencies/iso';

// Export formatting utilities
export { formatMoney, formatMoneyTable, formatAccounting, formatFinancial } from './formatter';
export type { ExtendedFormatOptions } from './formatter';
export type { FormatOptions } from './currency';

// Export conversion utilities
export { ExchangeRateProvider } from './conversion/exchange-rate';
export { CurrencyConverter } from './conversion/converter';
export type { ExchangeRateData } from './conversion/exchange-rate';

// Export error types
export {
  DuidError,
  CurrencyMismatchError,
  InvalidCurrencyError,
  InvalidOperationError,
  InvalidAmountError,
  AllocationError,
} from './errors';

// Import types for helper functions
import { Money } from './money';
import { Currency } from './currency';
import type { CurrencyMetadata } from './currencies/iso';

/**
 * Creates a Money instance from a floating-point amount
 *
 * @param amount The amount in major units (e.g., dollars) as a floating-point number
 * @param currency The currency code or Currency instance
 * @returns A new Money instance
 */
export function money(amount: number, currency: string | Currency): Money {
  return Money.fromFloat(amount, currency);
}

/**
 * Creates a Money instance from a string amount
 *
 * @param amount The amount in major units (e.g., dollars) as a string
 * @param currency The currency code or Currency instance
 * @returns A new Money instance
 */
export function moneyFromString(amount: string, currency: string | Currency): Money {
  return Money.fromString(amount, currency);
}

/**
 * Creates a Money instance from an integer amount in minor units
 *
 * @param amount The amount in minor units (e.g., cents) as an integer
 * @param currency The currency code or Currency instance
 * @returns A new Money instance
 */
export function moneyFromMinorUnits(amount: number, currency: string | Currency): Money {
  return Money.fromInt(amount, currency);
}

/**
 * Creates a Money instance from a BigInt amount in minor units
 *
 * @param amount The amount in minor units (e.g., cents) as a BigInt
 * @param currency The currency code or Currency instance
 * @returns A new Money instance
 */
export function moneyFromBigInt(amount: bigint, currency: string | Currency): Money {
  return Money.fromBigInt(amount, currency);
}

/**
 * Creates a zero Money instance
 *
 * @param currency The currency code or Currency instance
 * @returns A new Money instance with zero amount
 */
export function zero(currency: string | Currency): Money {
  return Money.zero(currency);
}

/**
 * Creates a Currency instance from an ISO currency code
 *
 * @param code The ISO currency code
 * @returns A new Currency instance
 */
export function currency(code: string): Currency {
  return new Currency(code);
}

/**
 * Creates a Currency instance from custom metadata
 *
 * @param metadata The currency metadata
 * @returns A new Currency instance
 */
export function customCurrency(metadata: CurrencyMetadata): Currency {
  return Currency.fromMetadata(metadata);
}