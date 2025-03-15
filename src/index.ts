/**
 * duidjs - A TypeScript library for handling money operations
 *
 * This library provides a robust way to represent monetary values,
 * perform arithmetic operations, handle different currencies,
 * and format money for display.
 */

// Export core classes
export { Currency } from "./currency";
export { Money } from "./money";

// Export rounding functionality
export { round, RoundingConfig, RoundingMode } from "./rounding";

// Export currency data
export { CurrencyCode } from "./currencies/codes";
export { ISO_CURRENCIES } from "./currencies/iso";
export type { CurrencyMetadata } from "./currencies/iso";

// Export formatting utilities
export type { FormatOptions } from "./currency";
export {
  formatAccounting,
  formatFinancial,
  formatMoney,
  formatMoneyTable,
} from "./formatter";
export type { ExtendedFormatOptions } from "./formatter";

// Export conversion utilities
export { CurrencyConverter } from "./conversion/converter";
export { ExchangeRateProvider } from "./conversion/exchange-rate";
export type { ExchangeRateData } from "./conversion/exchange-rate";

// Export error types
export {
  AllocationError,
  CurrencyMismatchError,
  DuidError,
  InvalidAmountError,
  InvalidCurrencyError,
  InvalidOperationError,
} from "./errors";

// Import types for helper functions
import { CurrencyCode } from "./currencies/codes";
import type { CurrencyMetadata } from "./currencies/iso";
import { Currency } from "./currency";
import { Money } from "./money";

/**
 * Creates a Money instance from a floating-point amount
 *
 * @param amount The amount in major units (e.g., dollars) as a floating-point number
 * @param currency The currency code, CurrencyCode enum, or Currency instance
 * @returns A new Money instance
 */
export function money(
  amount: number,
  currency: string | CurrencyCode | Currency
): Money {
  if (typeof currency === "string") {
    return Money.fromFloat(amount, currency);
  }
  if (currency instanceof Currency) {
    return Money.fromFloat(amount, currency);
  }
  // Handle CurrencyCode enum
  return Money.fromFloat(amount, Currency.from(currency));
}

/**
 * Creates a Money instance from a string amount
 *
 * @param amount The amount in major units (e.g., dollars) as a string
 * @param currency The currency code, CurrencyCode enum, or Currency instance
 * @returns A new Money instance
 */
export function moneyFromString(
  amount: string,
  currency: string | CurrencyCode | Currency
): Money {
  if (typeof currency === "string") {
    return Money.fromString(amount, currency);
  }
  if (currency instanceof Currency) {
    return Money.fromString(amount, currency);
  }
  // Handle CurrencyCode enum
  return Money.fromString(amount, Currency.from(currency));
}

/**
 * Creates a Money instance from an integer amount in minor units
 *
 * @param amount The amount in minor units (e.g., cents) as an integer
 * @param currency The currency code, CurrencyCode enum, or Currency instance
 * @returns A new Money instance
 */
export function moneyFromMinorUnits(
  amount: number,
  currency: string | CurrencyCode | Currency
): Money {
  if (typeof currency === "string") {
    return Money.fromInt(amount, currency);
  }
  if (currency instanceof Currency) {
    return Money.fromInt(amount, currency);
  }
  // Handle CurrencyCode enum
  return Money.fromInt(amount, Currency.from(currency));
}

/**
 * Creates a Money instance from a BigInt amount in minor units
 *
 * @param amount The amount in minor units (e.g., cents) as a BigInt
 * @param currency The currency code, CurrencyCode enum, or Currency instance
 * @returns A new Money instance
 */
export function moneyFromBigInt(
  amount: bigint,
  currency: string | CurrencyCode | Currency
): Money {
  if (typeof currency === "string") {
    return Money.fromBigInt(amount * BigInt(10 ** 4), currency);
  }
  if (currency instanceof Currency) {
    return Money.fromBigInt(amount * BigInt(10 ** 4), currency);
  }
  // Handle CurrencyCode enum
  return Money.fromBigInt(amount * BigInt(10 ** 4), Currency.from(currency));
}

/**
 * Creates a zero Money instance
 *
 * @param currency The currency code, CurrencyCode enum, or Currency instance
 * @returns A new Money instance with zero amount
 */
export function zero(currency: string | CurrencyCode | Currency): Money {
  if (typeof currency === "string") {
    return Money.zero(currency);
  }
  if (currency instanceof Currency) {
    return Money.zero(currency);
  }
  // Handle CurrencyCode enum
  return Money.zero(Currency.from(currency));
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
